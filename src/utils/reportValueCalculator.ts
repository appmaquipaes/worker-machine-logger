
import { loadTarifasCliente, findTarifaCliente } from '@/models/TarifasCliente';
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
  console.log('🔍 Calculando valor horas trabajadas con TarifasCliente:', { workSite, finca, machineId, hours });

  // Si es un cargador, usar lógica específica
  if (machineId.toLowerCase().includes('cargador')) {
    return calcularValorCargador(workSite, machineId, hours);
  }

  // Usar el nuevo sistema de TarifasCliente
  const tarifasCliente = loadTarifasCliente();
  console.log('📋 Tarifas de cliente cargadas:', tarifasCliente.length);

  // Buscar tarifa por cliente y finca si está disponible
  let tarifa = tarifasCliente.find(t => 
    t.activa &&
    t.tipo_servicio === 'alquiler_maquina' &&
    t.cliente.toLowerCase() === workSite.toLowerCase() &&
    t.valor_por_hora && 
    t.valor_por_hora > 0
  );

  // Si no se encuentra y hay finca, buscar por cliente y finca
  if (!tarifa && finca) {
    tarifa = tarifasCliente.find(t => 
      t.activa &&
      t.tipo_servicio === 'alquiler_maquina' &&
      t.cliente.toLowerCase() === workSite.toLowerCase() &&
      t.finca && t.finca.toLowerCase().includes(finca.toLowerCase()) &&
      t.valor_por_hora && 
      t.valor_por_hora > 0
    );
  }

  // Si no se encuentra tarifa específica, buscar tarifa general del cliente
  if (!tarifa) {
    tarifa = tarifasCliente.find(t => 
      t.activa &&
      t.cliente.toLowerCase() === workSite.toLowerCase() &&
      t.valor_por_hora && 
      t.valor_por_hora > 0
    );
  }

  console.log('🎯 Tarifa encontrada:', tarifa);

  if (tarifa && tarifa.valor_por_hora && tarifa.valor_por_hora > 0) {
    const valorCalculado = tarifa.valor_por_hora * hours;
    const detalleCalculo = `${hours} horas × $${tarifa.valor_por_hora.toLocaleString()}/hora = $${valorCalculado.toLocaleString()}`;
    
    console.log('✅ Valor calculado exitosamente:', {
      cliente: workSite,
      finca,
      hours,
      valorPorHora: tarifa.valor_por_hora,
      valorCalculado,
      detalleCalculo
    });

    return {
      valorCalculado,
      detalleCalculo,
      tarifaEncontrada: true
    };
  }

  console.log('❌ No se encontró tarifa para el cliente:', workSite);
  return {
    valorCalculado: 0,
    detalleCalculo: `No se encontró tarifa de alquiler por hora para el cliente: ${workSite}`,
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
  console.log('🔍 Calculando valor viajes con TarifasCliente:', { cliente, finca, origin, destination, cantidadM3 });

  const tarifasCliente = loadTarifasCliente();

  // Buscar tarifa de transporte específica
  let tarifa = tarifasCliente.find(t =>
    t.activa &&
    t.tipo_servicio === 'transporte' &&
    t.cliente.toLowerCase() === cliente.toLowerCase() &&
    (t.finca?.toLowerCase() === finca.toLowerCase() || !finca) &&
    t.valor_flete_m3 && t.valor_flete_m3 > 0
  );

  // Si no se encuentra tarifa específica, buscar tarifa general de transporte
  if (!tarifa) {
    tarifa = tarifasCliente.find(t =>
      t.activa &&
      t.tipo_servicio === 'transporte' &&
      t.cliente.toLowerCase() === cliente.toLowerCase() &&
      t.valor_flete_m3 && t.valor_flete_m3 > 0
    );
  }

  console.log('🎯 Tarifa de viaje encontrada:', tarifa);

  if (tarifa && tarifa.valor_flete_m3 && tarifa.valor_flete_m3 > 0) {
    const valorCalculado = tarifa.valor_flete_m3 * cantidadM3;
    const detalleCalculo = `${cantidadM3} m³ × $${tarifa.valor_flete_m3.toLocaleString()}/m³ = $${valorCalculado.toLocaleString()}`;
    
    console.log('✅ Valor de viaje calculado exitosamente:', {
      cliente,
      finca,
      cantidadM3,
      valorPorM3: tarifa.valor_flete_m3,
      valorCalculado,
      detalleCalculo
    });

    return {
      valorCalculado,
      detalleCalculo,
      tarifaEncontrada: true
    };
  }

  console.log('❌ No se encontró tarifa de transporte para:', cliente);
  return {
    valorCalculado: 0,
    detalleCalculo: `No se encontró tarifa de transporte para el cliente: ${cliente}`,
    tarifaEncontrada: false
  };
};
