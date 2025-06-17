
// Define el tipo para materiales
export type Material = {
  id: string;
  nombre_material: string;
  valor_por_m3: number;
  precio_venta_m3?: number; // Nuevo campo para precio de venta
  margen_ganancia?: number; // Margen de ganancia en porcentaje
};

// Función para guardar materiales en localStorage
export const saveMateriales = (materiales: Material[]): void => {
  localStorage.setItem('materiales_volquetas', JSON.stringify(materiales));
};

// Función para cargar materiales desde localStorage
export const loadMateriales = (): Material[] => {
  const storedMateriales = localStorage.getItem('materiales_volquetas');
  return storedMateriales ? JSON.parse(storedMateriales) : [];
};

// Función para obtener precio de venta de un material
export const getPrecioVentaMaterial = (nombreMaterial: string): number => {
  const materiales = loadMateriales();
  const material = materiales.find(m => m.nombre_material === nombreMaterial);
  
  if (material?.precio_venta_m3) {
    return material.precio_venta_m3;
  }
  
  // Si no tiene precio de venta definido, calcular con margen por defecto (20%)
  if (material?.valor_por_m3) {
    const margen = material.margen_ganancia || 20;
    return material.valor_por_m3 * (1 + margen / 100);
  }
  
  return 0;
};
