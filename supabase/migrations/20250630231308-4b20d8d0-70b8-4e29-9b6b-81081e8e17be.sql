
-- Corregir el warning de Function Search Path Mutable
-- Recrear la función con search_path seguro
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Verificar que los triggers existentes sigan funcionando
-- (Los triggers ya existentes seguirán usando la función actualizada automáticamente)
