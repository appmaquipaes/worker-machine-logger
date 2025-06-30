
import { Venta, DetalleVenta } from '@/types/venta';

// Función para crear una nueva venta
export const createVenta = (
  fecha: Date,
  cliente: string,
  ciudad_entrega: string,
  tipo_venta: string,
  origen_material: string,
  destino_material: string,
  forma_pago: string,
  observaciones?: string,
  actividad_generadora?: string
): Venta => {
  const esAutomatica = observaciones?.includes('Venta automática') || false;
  
  return {
    id: Date.now().toString(),
    fecha,
    cliente,
    ciudad_entrega,
    tipo_venta: tipo_venta as any,
    origen_material,
    destino_material,
    forma_pago,
    observaciones,
    total_venta: 0,
    detalles: [],
    actividad_generadora: actividad_generadora || 'Venta manual',
    tipo_registro: esAutomatica ? 'Automática' : 'Manual'
  };
};

// Función para crear un nuevo detalle de venta - CORREGIDA
export const createDetalleVenta = (
  tipo: 'Material' | 'Flete' | 'Alquiler' | 'Servicio',
  producto_servicio: string,
  cantidad_m3: number,
  valor_unitario: number
): DetalleVenta => {
  // Asegurar que los valores sean números válidos
  const cantidadNumerica = Number(cantidad_m3) || 0;
  const valorUnitarioNumerico = Number(valor_unitario) || 0;
  
  // CORRECCIÓN: Asegurar que la multiplicación sea correcta y precisa
  const subtotal = Math.round((cantidadNumerica * valorUnitarioNumerico) * 100) / 100;
  
  console.log('🔢 Calculando subtotal en createDetalleVenta:', {
    tipo,
    producto: producto_servicio,
    cantidad: cantidadNumerica,
    valorUnitario: valorUnitarioNumerico,
    subtotal: subtotal,
    verificacion: `${cantidadNumerica} × ${valorUnitarioNumerico} = ${subtotal}`,
    tiposOriginales: {
      cantidadTipo: typeof cantidad_m3,
      valorTipo: typeof valor_unitario
    }
  });

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    tipo,
    producto_servicio,
    cantidad_m3: cantidadNumerica,
    valor_unitario: valorUnitarioNumerico,
    subtotal: subtotal
  };
};
