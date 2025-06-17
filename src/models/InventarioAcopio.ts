
export interface InventarioAcopio {
  id: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  unidadMedida: string;
  precioUnitario: number;
  stockMinimo: number;
  fechaRegistro: string;
}

export const loadInventarioAcopio = (): InventarioAcopio[] => {
  try {
    const stored = localStorage.getItem('inventario_acopio');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading inventory:', error);
    return [];
  }
};

export const saveInventarioAcopio = (inventario: InventarioAcopio[]): void => {
  try {
    localStorage.setItem('inventario_acopio', JSON.stringify(inventario));
  } catch (error) {
    console.error('Error saving inventory:', error);
  }
};
