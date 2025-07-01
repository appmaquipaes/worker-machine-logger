
-- Crear tabla profiles para usuarios
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Trabajador', 'Administrador', 'Operador', 'Conductor')),
  assigned_machines TEXT[] DEFAULT '{}',
  comision_por_hora DECIMAL(10,2),
  comision_por_viaje DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla machines para máquinas/vehículos (ya existe, pero asegurar estructura)
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

-- Crear tabla reports para todos los reportes (ya existe, pero asegurar estructura)
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

-- Crear tablas adicionales necesarias
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_cliente TEXT NOT NULL,
  nit_cedula TEXT,
  tipo_persona TEXT CHECK (tipo_persona IN ('Natural', 'Jurídica')),
  tipo_cliente TEXT,
  direccion TEXT,
  ciudad TEXT,
  telefono_contacto TEXT,
  correo_electronico TEXT,
  persona_contacto TEXT,
  observaciones TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fincas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clients(id),
  nombre_finca TEXT NOT NULL,
  direccion TEXT,
  ciudad TEXT,
  contacto_nombre TEXT,
  contacto_telefono TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_material TEXT NOT NULL,
  valor_por_m3 DECIMAL(10,2) NOT NULL,
  precio_venta_m3 DECIMAL(10,2),
  margen_ganancia DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_acopio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_material TEXT NOT NULL,
  cantidad_disponible DECIMAL(10,2) DEFAULT 0,
  costo_promedio_m3 DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fincas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_acopio ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes antes de recrearlas
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Everyone can view machines" ON public.machines;
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can create own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view all clients" ON public.clients;
DROP POLICY IF EXISTS "Users can view all fincas" ON public.fincas;
DROP POLICY IF EXISTS "Users can view all materials" ON public.materials;
DROP POLICY IF EXISTS "Users can view inventory" ON public.inventory_acopio;

-- Crear políticas RLS
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Everyone can view machines" ON public.machines
  FOR SELECT USING (true);

CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" ON public.reports
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para otras tablas
CREATE POLICY "Users can view all clients" ON public.clients
  FOR SELECT USING (true);

CREATE POLICY "Users can view all fincas" ON public.fincas
  FOR SELECT USING (true);

CREATE POLICY "Users can view all materials" ON public.materials
  FOR SELECT USING (true);

CREATE POLICY "Users can view inventory" ON public.inventory_acopio
  FOR SELECT USING (true);

-- Asegurar que los triggers existan
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS machines_updated_at ON public.machines;
DROP TRIGGER IF EXISTS reports_updated_at ON public.reports;
DROP TRIGGER IF EXISTS clients_updated_at ON public.clients;
DROP TRIGGER IF EXISTS fincas_updated_at ON public.fincas;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER machines_updated_at
  BEFORE UPDATE ON public.machines
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER fincas_updated_at
  BEFORE UPDATE ON public.fincas
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insertar datos iniciales solo si no existen
INSERT INTO public.materials (nombre_material, valor_por_m3) 
SELECT * FROM (VALUES
  ('Arena', 25000),
  ('Grava', 30000),
  ('Tierra', 15000),
  ('Recebo', 20000),
  ('Piedra', 35000),
  ('Material Seleccionado', 28000)
) AS t(nombre_material, valor_por_m3)
WHERE NOT EXISTS (SELECT 1 FROM public.materials WHERE nombre_material = t.nombre_material);
