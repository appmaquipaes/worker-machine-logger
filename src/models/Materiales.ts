
export interface Material {
  id: string;
  nombre: string;
  nombre_material: string; // Alias para compatibilidad
  categoria: string;
  precioVenta: number;
  valor_por_m3?: number; // Alias para compatibilidad
  unidadMedida: string;
  descripcion: string;
  fechaRegistro: string;
}

export const loadMateriales = (): Material[] => {
  try {
    const stored = localStorage.getItem('materiales');
    const materiales = stored ? JSON.parse(stored) : [];
    // Asegurar compatibilidad de nombres
    return materiales.map((material: any) => ({
      ...material,
      nombre_material: material.nombre_material || material.nombre,
      valor_por_m3: material.valor_por_m3 || material.precioVenta
    }));
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
