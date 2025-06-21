
// Utilidades específicas para cálculo de valores de cargadores
import { loadTarifas } from '@/models/Tarifas';

export const calcularValorCargador = (
  workSite: string,
  machineId: string,
  hours: number
): {
  valorCalculado: number;
  detalleCalculo: string;
  tarifaEncontrada: boolean;
} => {
  // Buscar tarifa específica para el cargador en el sitio de trabajo
  const tarifas = loadTarifas();
  
  // Buscar tarifa que incluya "Acopio" en origen y el cliente en destino
  const tarifaCargador = tarifas.find(t => 
    t.origen.toLowerCase().includes('acopio') &&
    t.destino.toLowerCase().includes(workSite.toLowerCase())
  );

  if (tarifaCargador && tarifaCargador.valor_por_hora && tarifaCargador.valor_por_hora > 0) {
    const valorCalculado = tarifaCargador.valor_por_hora * hours;
    return {
      valorCalculado,
      detalleCalculo: `${hours} horas × $${tarifaCargador.valor_por_hora.toLocaleString()}/hora = $${valorCalculado.toLocaleString()}`,
      tarifaEncontrada: true
    };
  }

  // Si no hay tarifa específica, usar valor estándar para cargadores
  const valorEstandarPorHora = 45000; // Valor base para cargadores
  const valorCalculado = valorEstandarPorHora * hours;
  
  return {
    valorCalculado,
    detalleCalculo: `${hours} horas × $${valorEstandarPorHora.toLocaleString()}/hora (tarifa estándar) = $${valorCalculado.toLocaleString()}`,
    tarifaEncontrada: false
  };
};
