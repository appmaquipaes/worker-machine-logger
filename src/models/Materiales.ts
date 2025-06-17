
// Define el tipo para materiales
export type Material = {
  id: string;
  nombre_material: string;
  valor_por_m3: number;
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
