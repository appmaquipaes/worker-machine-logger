
-- Verificar si existe la tabla profiles y sus políticas RLS
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Si no hay políticas RLS adecuadas, crearlas
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Crear políticas RLS correctas para profiles
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Asegurar que RLS está habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Crear un usuario administrador si no existe (para migración)
-- Nota: Esto se ejecutará solo si no existe ya un perfil para este usuario
INSERT INTO public.profiles (id, name, email, role)
SELECT 
  '97ef5b68-44ae-4692-8997-17ba778440eb'::uuid,
  'Administrador Sistema',
  'admin@maquipaes.com',
  'Administrador'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE email = 'admin@maquipaes.com'
);
