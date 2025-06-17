
export interface Material {
  id: string;
  nombre: string;
  categoria: string;
  precioVenta: number;
  unidadMedida: string;
  descripcion: string;
  fechaRegistro: string;
}

export const loadMateriales = (): Material[] => {
  try {
    const stored = localStorage.getItem('materiales');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading materials:', error);
    return [];
  }
};

export const saveMateriales = (materiales: Material[]): void => {
  try {
    localStorage.setItem('materiales', JSON.stringify(materiales));
  } catch (error) {
    console.error('Error saving materials:', error);
  }
};
