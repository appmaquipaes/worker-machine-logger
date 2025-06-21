
// Modelo para controlar operaciones comerciales y evitar duplicación de ventas
export type OperacionComercial = {
  id: string;
  fecha: Date;
  cliente: string;
  material: string;
  reportes_asociados: string[]; // IDs de los reportes que forman esta operación
  venta_generada: boolean;
  venta_id?: string;
  tipo_operacion: 'Acopio' | 'Cantera' | 'Proveedor'; // Para identificar el flujo
  cantidad_total?: number; // Suma de todas las cantidades
};

// Función para generar un ID único de operación basado en fecha + cliente + material
export const generarIdOperacion = (fecha: Date, cliente: string, material: string): string => {
  const fechaStr = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
  const clienteNorm = cliente.toLowerCase().replace(/\s+/g, '_');
  const materialNorm = material.toLowerCase().replace(/\s+/g, '_');
  return `${fechaStr}_${clienteNorm}_${materialNorm}`;
};

// Función para extraer el cliente limpio del destino
export const extraerClienteDelDestino = (destino: string): string => {
  if (!destino) return '';
  return destino.split(' - ')[0].trim();
};

// Función para determinar si una operación es desde Acopio
export const esOperacionDesdeAcopio = (origen?: string): boolean => {
  if (!origen) return false;
  return origen.toLowerCase().includes('acopio');
};

// Función para cargar operaciones desde localStorage
export const loadOperacionesComerciales = (): OperacionComercial[] => {
  const stored = localStorage.getItem('operaciones_comerciales');
  if (!stored) return [];
  
  return JSON.parse(stored).map((op: any) => ({
    ...op,
    fecha: new Date(op.fecha)
  }));
};

// Función para guardar operaciones en localStorage
export const saveOperacionesComerciales = (operaciones: OperacionComercial[]): void => {
  localStorage.setItem('operaciones_comerciales', JSON.stringify(operaciones));
};

// Función para crear o actualizar una operación comercial
export const gestionarOperacionComercial = (
  reporteId: string,
  fecha: Date,
  cliente: string,
  material: string,
  esDesdeAcopio: boolean,
  cantidad?: number
): OperacionComercial => {
  const operaciones = loadOperacionesComerciales();
  const idOperacion = generarIdOperacion(fecha, cliente, material);
  
  // Buscar si ya existe la operación
  let operacionExistente = operaciones.find(op => op.id === idOperacion);
  
  if (operacionExistente) {
    // Agregar el reporte a la operación existente si no está ya
    if (!operacionExistente.reportes_asociados.includes(reporteId)) {
      operacionExistente.reportes_asociados.push(reporteId);
      // Sumar cantidad si existe
      if (cantidad) {
        operacionExistente.cantidad_total = (operacionExistente.cantidad_total || 0) + cantidad;
      }
    }
  } else {
    // Crear nueva operación
    operacionExistente = {
      id: idOperacion,
      fecha,
      cliente,
      material,
      reportes_asociados: [reporteId],
      venta_generada: false,
      tipo_operacion: esDesdeAcopio ? 'Acopio' : 'Cantera',
      cantidad_total: cantidad || 0
    };
    operaciones.push(operacionExistente);
  }
  
  saveOperacionesComerciales(operaciones);
  return operacionExistente;
};

// Función para marcar una operación como procesada para venta
export const marcarOperacionProcesada = (idOperacion: string, ventaId: string): void => {
  const operaciones = loadOperacionesComerciales();
  const operacion = operaciones.find(op => op.id === idOperacion);
  
  if (operacion) {
    operacion.venta_generada = true;
    operacion.venta_id = ventaId;
    saveOperacionesComerciales(operaciones);
  }
};

// Función para verificar si una operación está completa y lista para venta
export const esOperacionCompletaParaVenta = (operacion: OperacionComercial): boolean => {
  // Si ya se generó la venta, no generar otra
  if (operacion.venta_generada) {
    return false;
  }

  // Si es desde cantera/proveedor (no Acopio), generar venta inmediatamente
  if (operacion.tipo_operacion !== 'Acopio') {
    return true;
  }

  // Si es desde Acopio, esperar al menos 2 reportes (Cargador + Volqueta)
  return operacion.reportes_asociados.length >= 2;
};
