import { loadTarifas } from '@/models/Tarifas';
import { calcularValorCargador } from './cargadorCalculations';

export const calcularValorHorasTrabajadas = (
  workSite: string,
  finca: string | undefined,
  machineId: string,
  hours: number
): {
  valorCalculado: number;
  detalleCalculo: string;
  tarifaEncontrada: boolean;
} => {
  console.log('🔍 Calculando valor horas trabajadas:', { workSite, finca, machineId, hours });

  // Si es un cargador, usar lógica específica
  if (machineId.toLowerCase().includes('cargador')) {
    return calcularValorCargador(workSite, machineId, hours);
  }

  // Lógica existente para otras máquinas
  const tarifas = loadTarifas();
  
  // Buscar tarifa específica
  let tarifa = tarifas.find(t => 
    t.origen.toLowerCase().includes(workSite.toLowerCase()) ||
    t.destino.toLowerCase().includes(workSite.toLowerCase())
  );

  if (tarifa && tarifa.valor_por_hora && tarifa.valor_por_hora > 0) {
    const valorCalculado = tarifa.valor_por_hora * hours;
    return {
      valorCalculado,
      detalleCalculo: `${hours} horas × $${tarifa.valor_por_hora.toLocaleString()}/hora = $${valorCalculado.toLocaleString()}`,
      tarifaEncontrada: true
    };
  }

  return {
    valorCalculado: 0,
    detalleCalculo: 'No se encontró tarifa específica para este trabajo',
    tarifaEncontrada: false
  };
};

export const calcularValorViajes = (
  cliente: string,
  finca: string,
  origin: string,
  destination: string,
  cantidadM3: number
): {
  valorCalculado: number;
  detalleCalculo: string;
  tarifaEncontrada: boolean;
} => {
  console.log('Calculando valor viajes:', { cliente, finca, origin, destination, cantidadM3 });

  const tarifas = loadTarifas();

  // Buscar tarifa que coincida exactamente con origen y destino
  let tarifa = tarifas.find(
    t =>
      t.origen.toLowerCase() === origin.toLowerCase() &&
      t.destino.toLowerCase() === destination.toLowerCase()
  );

  // Si no se encuentra tarifa exacta, buscar tarifa que incluya el cliente y finca en el destino
  if (!tarifa) {
    tarifa = tarifas.find(t =>
      t.destino.toLowerCase().includes(cliente.toLowerCase()) &&
      t.destino.toLowerCase().includes(finca.toLowerCase())
    );
  }

  if (tarifa && tarifa.valor_por_m3 > 0) {
    const valorCalculado = tarifa.valor_por_m3 * cantidadM3;
    return {
      valorCalculado,
      detalleCalculo: `${cantidadM3} m³ × $${tarifa.valor_por_m3.toLocaleString()}/m³ = $${valorCalculado.toLocaleString()}`,
      tarifaEncontrada: true
    };
  }

  return {
    valorCalculado: 0,
    detalleCalculo: 'No se encontró tarifa para este viaje',
    tarifaEncontrada: false
  };
};
