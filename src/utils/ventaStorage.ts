
import { Venta } from '@/types/venta';

// Función para guardar ventas en localStorage
export const saveVentas = (ventas: Venta[]): void => {
  localStorage.setItem('ventas', JSON.stringify(ventas));
};

// Función para cargar ventas desde localStorage
export const loadVentas = (): Venta[] => {
  const storedVentas = localStorage.getItem('ventas');
  if (!storedVentas) return [];
  
  return JSON.parse(storedVentas).map((venta: any) => ({
    ...venta,
    fecha: new Date(venta.fecha)
  }));
};
