
-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Trabajador', 'Administrador', 'Operador', 'Conductor')),
  assigned_machines TEXT[],
  comision_por_hora DECIMAL(10,2),
  comision_por_viaje DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Crear tabla de máquinas
CREATE TABLE public.machines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  license_plate TEXT,
  brand TEXT,
  model TEXT,
  year INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de clientes
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_cliente TEXT NOT NULL,
  tipo_persona TEXT CHECK (tipo_persona IN ('Natural', 'Empresa')),
  nit_cedula TEXT,
  ciudad TEXT,
  direccion TEXT,
  telefono_contacto TEXT,
  correo_electronico TEXT,
  persona_contacto TEXT,
  tipo_cliente TEXT,
  activo BOOLEAN DEFAULT true,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de fincas
CREATE TABLE public.fincas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  nombre_finca TEXT NOT NULL,
  direccion TEXT,
  ciudad TEXT,
  contacto_nombre TEXT,
  contacto_telefono TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de reportes
CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  machine_id UUID REFERENCES public.machines(id) ON DELETE CASCADE,
  machine_name TEXT NOT NULL,
  user_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  description TEXT,
  report_date DATE NOT NULL,
  trips INTEGER,
  hours DECIMAL(8,2),
  value DECIMAL(12,2) DEFAULT 0,
  work_site TEXT,
  origin TEXT,
  destination TEXT,
  cantidad_m3 DECIMAL(10,2),
  proveedor TEXT,
  kilometraje DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de inventario de acopio
CREATE TABLE public.inventory_acopio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_material TEXT NOT NULL UNIQUE,
  cantidad_disponible DECIMAL(10,2) DEFAULT 0,
  costo_promedio_m3 DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de materiales
CREATE TABLE public.materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_material TEXT NOT NULL UNIQUE,
  valor_por_m3 DECIMAL(10,2) NOT NULL,
  precio_venta_m3 DECIMAL(10,2),
  margen_ganancia DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fincas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_acopio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para perfiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para administradores (pueden ver todo)
CREATE POLICY "Admins can view all" ON public.machines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Administrador'
    )
  );

CREATE POLICY "Admins can manage clients" ON public.clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Administrador'
    )
  );

CREATE POLICY "Admins can manage fincas" ON public.fincas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Administrador'
    )
  );

CREATE POLICY "Users can manage own reports" ON public.reports
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all reports" ON public.reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Administrador'
    )
  );

-- Políticas para inventario y materiales
CREATE POLICY "Authenticated users can view inventory" ON public.inventory_acopio
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage inventory" ON public.inventory_acopio
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Administrador'
    )
  );

CREATE POLICY "Authenticated users can view materials" ON public.materials
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage materials" ON public.materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Administrador'
    )
  );

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a las tablas
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_machines_updated_at
  BEFORE UPDATE ON public.machines
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_fincas_updated_at
  BEFORE UPDATE ON public.fincas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory_acopio
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
