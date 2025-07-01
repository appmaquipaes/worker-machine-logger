
-- Insertar datos iniciales de materiales (solo si no existen)
INSERT INTO public.materials (nombre_material, valor_por_m3, precio_venta_m3, margen_ganancia) 
SELECT * FROM (VALUES
  ('Arena', 25000, 30000, 20),
  ('Grava', 30000, 35000, 17),
  ('Tierra', 15000, 20000, 33),
  ('Recebo', 20000, 25000, 25),
  ('Piedra', 35000, 40000, 14),
  ('Material Seleccionado', 28000, 33000, 18)
) AS t(nombre_material, valor_por_m3, precio_venta_m3, margen_ganancia)
WHERE NOT EXISTS (SELECT 1 FROM public.materials WHERE nombre_material = t.nombre_material);

-- Insertar máquinas iniciales (solo si no existen)
INSERT INTO public.machines (name, type, license_plate, brand) 
SELECT * FROM (VALUES
  ('Cat315', 'Retroexcavadora de Oruga', null, 'Caterpillar'),
  ('Cat312', 'Retroexcavadora de Oruga', null, 'Caterpillar'),
  ('Bulldozer D6', 'Bulldozer', null, 'Caterpillar'),
  ('Vibro-SD100', 'Vibrocompactador', null, 'SAKAI'),
  ('VIBRO-SD70D', 'Vibrocompactador', null, 'SAKAI'),
  ('VIBRO-CATCS-323', 'Vibrocompactador', null, 'Caterpillar'),
  ('KOMATSU-200', 'Retroexcavadora de Oruga', null, 'Komatsu'),
  ('CARGADOR-S950', 'Cargador', null, 'Bobcat'),
  ('MOTONIVELADORA', 'Motoniveladora', null, 'Caterpillar'),
  ('PALADRAGA', 'Paladraga', null, 'Generic'),
  ('MACK UFJ852', 'Volqueta', 'UFJ852', 'Mack'),
  ('MACK SWN429', 'Volqueta', 'SWN429', 'Mack'),
  ('Escombrera MAQUIPAES', 'Escombrera', 'ESC-001', 'MAQUIPAES')
) AS t(name, type, license_plate, brand)
WHERE NOT EXISTS (SELECT 1 FROM public.machines WHERE name = t.name);

-- Insertar algunos tipos de inventario básico
INSERT INTO public.inventory_acopio (tipo_material, cantidad_disponible, costo_promedio_m3) 
SELECT * FROM (VALUES
  ('Arena', 0, 25000),
  ('Grava', 0, 30000),
  ('Tierra', 0, 15000),
  ('Recebo', 0, 20000),
  ('Piedra', 0, 35000),
  ('Material Seleccionado', 0, 28000)
) AS t(tipo_material, cantidad_disponible, costo_promedio_m3)
WHERE NOT EXISTS (SELECT 1 FROM public.inventory_acopio WHERE tipo_material = t.tipo_material);
