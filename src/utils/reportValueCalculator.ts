
import { findTarifaCliente, getTarifasByCliente, TarifaCliente } from '@/models/TarifasCliente';
import { loadMachines } from '@/models/Machines';

export interface ReportValueCalculation {
  valorCalculado: number;
  detalleCalculo: string;
  tarifaEncontrada: boolean;
}

// Calcular valor para reportes de horas trabajadas (alquiler de maquinaria)
export const calcularValorHorasTrabajadas = (
  cliente: string,
  finca: string | undefined,
  machineId: string,
  horas: number
): ReportValueCalculation => {
  const tarifas = getTarifasByCliente(cliente);
  
  // Buscar tarifa de alquiler para esta máquina
  const tarifaAlquiler = tarifas.find(t => 
    t.tipo_servicio === 'alquiler_maquina' && 
    t.maquina_id === machineId &&
    (t.finca === finca || !t.finca) // Priorizar finca específica, luego general
  );
  
  if (!tarifaAlquiler) {
    return {
      valorCalculado: 0,
      detalleCalculo: 'No se encontró tarifa de alquiler para esta máquina y cliente',
      tarifaEncontrada: false
    };
  }
  
  // Calcular valor basado en horas
  let valorPorHora = tarifaAlquiler.valor_por_hora || 0;
  
  // Si no hay tarifa por hora, intentar convertir desde día (asumiendo 8 horas/día)
  if (!valorPorHora && tarifaAlquiler.valor_por_dia) {
    valorPorHora = tarifaAlquiler.valor_por_dia / 8;
  }
  
  // Si no hay tarifa por hora ni día, intentar desde mes (asumiendo 22 días laborales)
  if (!valorPorHora && tarifaAlquiler.valor_por_mes) {
    valorPorHora = tarifaAlquiler.valor_por_mes / (22 * 8);
  }
  
  const valorCalculado = horas * valorPorHora;
  
  return {
    valorCalculado,
    detalleCalculo: `${horas} horas × $${valorPorHora.toLocaleString()}/hora = $${valorCalculado.toLocaleString()}`,
    tarifaEncontrada: true
  };
};

// Calcular valor para reportes de viajes (transporte)
export const calcularValorViajes = (
  cliente: string,
  finca: string | undefined,
  origen: string,
  destino: string,
  cantidadM3: number
): ReportValueCalculation => {
  // Extraer cliente y finca del destino si viene en formato "Cliente - Finca"
  const clienteDestino = destino?.split(' - ')[0] || cliente;
  const fincaDestino = destino?.split(' - ')[1] || finca;
  
  const tarifa = findTarifaCliente(clienteDestino, fincaDestino, origen, clienteDestino);
  
  if (!tarifa || tarifa.tipo_servicio !== 'transporte') {
    return {
      valorCalculado: 0,
      detalleCalculo: 'No se encontró tarifa de transporte para esta ruta y cliente',
      tarifaEncontrada: false
    };
  }
  
  let valorTotal = 0;
  let detalleCalculo = '';
  
  // Calcular valor del flete
  if (tarifa.valor_flete_m3) {
    const valorFlete = cantidadM3 * tarifa.valor_flete_m3;
    valorTotal += valorFlete;
    detalleCalculo += `Flete: ${cantidadM3} m³ × $${tarifa.valor_flete_m3.toLocaleString()}/m³ = $${valorFlete.toLocaleString()}`;
  }
  
  // Calcular valor del material (si aplica)
  if (tarifa.valor_material_cliente_m3) {
    const valorMaterial = cantidadM3 * tarifa.valor_material_cliente_m3;
    valorTotal += valorMaterial;
    if (detalleCalculo) detalleCalculo += ' + ';
    detalleCalculo += `Material: ${cantidadM3} m³ × $${tarifa.valor_material_cliente_m3.toLocaleString()}/m³ = $${valorMaterial.toLocaleString()}`;
  }
  
  if (detalleCalculo) {
    detalleCalculo += ` = $${valorTotal.toLocaleString()} total`;
  }
  
  return {
    valorCalculado: valorTotal,
    detalleCalculo: detalleCalculo || `${cantidadM3} m³ sin valores de tarifa definidos`,
    tarifaEncontrada: valorTotal > 0
  };
};

// Obtener información de la máquina para búsqueda de tarifas
export const getMachineInfo = (machineId: string) => {
  const machines = loadMachines();
  return machines.find(m => m.id === machineId);
};
