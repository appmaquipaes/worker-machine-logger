
-- Verificar qué tablas ya existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'machines', 'reports');

-- Crear solo la tabla machines si no existe
CREATE TABLE IF NOT EXISTS public.machines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'Retroexcavadora de Oruga', 'Retroexcavadora de Llanta', 'Cargador', 
    'Vibrocompactador', 'Paladraga', 'Bulldozer', 'Camabaja', 
    'Volqueta', 'Camión', 'Semirremolque', 'Tractomula', 
    'Motoniveladora', 'Escombrera', 'Otro'
  )),
  license_plate TEXT,
  brand TEXT,
  model TEXT,
  year INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear solo la tabla reports si no existe
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  machine_id UUID REFERENCES public.machines(id),
  machine_name TEXT NOT NULL,
  user_name TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN (
    'Horas Trabajadas', 'Viajes', 'Combustible', 'Mantenimiento', 
    'Novedades', 'Recepción Escombrera'
  )),
  report_date DATE NOT NULL,
  work_site TEXT,
  origin TEXT,
  destination TEXT,
  proveedor TEXT,
  hours DECIMAL(5,2),
  trips INTEGER,
  cantidad_m3 DECIMAL(10,2),
  kilometraje DECIMAL(10,2),
  value DECIMAL(12,2) DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS si no está habilitado
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Crear políticas solo si no existen
DO $$ 
BEGIN
  -- Política para machines
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'machines' AND policyname = 'Everyone can view machines'
  ) THEN
    CREATE POLICY "Everyone can view machines" ON public.machines
      FOR SELECT USING (true);
  END IF;

  -- Políticas para reports
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' AND policyname = 'Users can view own reports'
  ) THEN
    CREATE POLICY "Users can view own reports" ON public.reports
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' AND policyname = 'Users can create own reports'
  ) THEN
    CREATE POLICY "Users can create own reports" ON public.reports
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Crear triggers si no existen
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS machines_updated_at ON public.machines;
CREATE TRIGGER machines_updated_at
  BEFORE UPDATE ON public.machines
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS reports_updated_at ON public.reports;
CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insertar máquinas iniciales solo si la tabla está vacía
INSERT INTO public.machines (name, type, license_plate) 
SELECT * FROM (VALUES
  ('Cat315', 'Retroexcavadora de Oruga', null),
  ('Cat312', 'Retroexcavadora de Oruga', null),
  ('Bulldozer D6', 'Bulldozer', null),
  ('Vibro-SD100', 'Vibrocompactador', null),
  ('VIBRO-SD70D', 'Vibrocompactador', null),
  ('VIBRO-CATCS-323', 'Vibrocompactador', null),
  ('KOMATSU-200', 'Retroexcavadora de Oruga', null),
  ('CARGADOR-S950', 'Cargador', null),
  ('MOTONIVELADORA', 'Motoniveladora', null),
  ('PALADRAGA', 'Paladraga', null),
  ('MACK UFJ852', 'Volqueta', 'UFJ852'),
  ('MACK SWN429', 'Volqueta', 'SWN429')
) AS t(name, type, license_plate)
WHERE NOT EXISTS (SELECT 1 FROM public.machines LIMIT 1);
