
export interface Material {
  id: string;
  nombre_material: string;
  categoria: string;
  unidad_medida: string;
  valor_por_m3: number;
  descripcion?: string;
  activo: boolean;
  fechaRegistro: string;
}

export const loadMateriales = (): Material[] => {
  try {
    const stored = localStorage.getItem('materiales');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading materiales:', error);
    return [];
  }
};

export const saveMateriales = (materiales: Material[]): void => {
  try {
    localStorage.setItem('materiales', JSON.stringify(materiales));
  } catch (error) {
    console.error('Error saving materiales:', error);
  }
};

export const createMaterial = (
  nombre_material: string,
  valor_por_m3: number,
  categoria: string = 'Material',
  unidad_medida: string = 'm³',
  descripcion?: string
): Material => {
  return {
    id: Date.now().toString(),
    nombre_material,
    categoria,
    unidad_medida,
    valor_por_m3,
    descripcion,
    activo: true,
    fechaRegistro: new Date().toISOString()
  };
};

export const getMaterialById = (id: string): Material | undefined => {
  const materiales = loadMateriales();
  return materiales.find(material => material.id === id);
};

export const updateMaterial = (id: string, updates: Partial<Material>): boolean => {
  try {
    const materiales = loadMateriales();
    const index = materiales.findIndex(material => material.id === id);
    
    if (index === -1) return false;
    
    materiales[index] = { ...materiales[index], ...updates };
    saveMateriales(materiales);
    return true;
  } catch (error) {
    console.error('Error updating material:', error);
    return false;
  }
};

export const deleteMaterial = (id: string): boolean => {
  try {
    const materiales = loadMateriales();
    const materialesFiltrados = materiales.filter(material => material.id !== id);
    saveMateriales(materialesFiltrados);
    return true;
  } catch (error) {
    console.error('Error deleting material:', error);
    return false;
  }
};
