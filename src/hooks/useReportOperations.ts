
import { Report, ReportType } from '@/types/report';
import { calcularValorHorasTrabajadas, calcularValorViajes } from '@/utils/reportValueCalculator';
import { findTarifaEscombrera } from '@/models/TarifasCliente';

export const useReportOperations = () => {
  const createReport = (
    reports: Report[],
    machineId: string,
    machineName: string,
    reportType: ReportType,
    description: string,
    reportDate: Date,
    trips?: number,
    hours?: number,
    value?: number,
    workSite?: string,
    origin?: string,
    destination?: string,
    cantidadM3?: number,
    proveedor?: string,
    kilometraje?: number
  ): Report => {
    let calculatedValue = value || 0;
    let detalleCalculo = '';
    let tarifaEncontrada = false;

    // Calcular valor automáticamente basado en tarifas
    if (reportType === 'Horas Trabajadas' && workSite && hours) {
      const calculo = calcularValorHorasTrabajadas(
        workSite,
        undefined, // Por ahora no manejamos finca específica en horas trabajadas
        machineId,
        hours
      );
      calculatedValue = calculo.valorCalculado;
      detalleCalculo = calculo.detalleCalculo;
      tarifaEncontrada = calculo.tarifaEncontrada;
    }
    
    if (reportType === 'Viajes' && destination && origin && cantidadM3) {
      const calculo = calcularValorViajes(
        destination.split(' - ')[0] || '', // Cliente del destino
        destination.split(' - ')[1], // Finca del destino
        origin,
        destination,
        cantidadM3
      );
      calculatedValue = calculo.valorCalculado;
      detalleCalculo = calculo.detalleCalculo;
      tarifaEncontrada = calculo.tarifaEncontrada;
    }

    // Calcular valor para recepción de escombrera usando las nuevas tarifas
    if (reportType === 'Recepción Escombrera' && destination && trips) {
      const tarifa = findTarifaEscombrera(destination, machineId);
      if (tarifa) {
        // Determinar tipo de volqueta desde la descripción
        const tipoVolqueta = description.includes('Doble Troque') ? 'Doble Troque' : 'Sencilla';
        const valorPorVolqueta = tipoVolqueta === 'Doble Troque' 
          ? tarifa.valor_volqueta_doble_troque || 0
          : tarifa.valor_volqueta_sencilla || 0;
        
        calculatedValue = valorPorVolqueta * trips;
        detalleCalculo = `${trips} volquetas ${tipoVolqueta} × $${valorPorVolqueta.toLocaleString()} = $${calculatedValue.toLocaleString()}`;
        tarifaEncontrada = true;
      }
    }

    // Si no se pudo calcular automáticamente, usar valor manual si se proporcionó
    if (!tarifaEncontrada && value !== undefined) {
      calculatedValue = value;
      detalleCalculo = 'Valor ingresado manualmente';
    }

    const newReport: Report = {
      id: Date.now().toString(),
      machineId,
      machineName,
      userName: 'Current User',
      reportType,
      description,
      reportDate,
      createdAt: new Date(),
      value: calculatedValue,
      trips,
      hours,
      workSite,
      origin,
      destination,
      cantidadM3,
      proveedor,
      kilometraje,
      detalleCalculo,
      tarifaEncontrada,
      // Campos específicos para escombrera
      clienteEscombrera: reportType === 'Recepción Escombrera' ? destination : undefined,
      tipoVolqueta: reportType === 'Recepción Escombrera' && description.includes('Doble Troque') ? 'Doble Troque' : 'Sencilla',
      cantidadVolquetas: reportType === 'Recepción Escombrera' ? trips : undefined,
    };

    // Log para debugging
    console.log('Nuevo reporte creado:', {
      tipo: reportType,
      valor: calculatedValue,
      detalleCalculo,
      tarifaEncontrada,
      inventarioSeraAfectado: reportType === 'Viajes' && (origin?.includes('Acopio') || destination?.includes('Acopio'))
    });

    return newReport;
  };

  const getReportsByMachine = (reports: Report[], machineId: string): Report[] => {
    return reports.filter(report => report.machineId === machineId);
  };

  const getTotalByType = (reports: Report[], type: string): number => {
    return reports
      .filter(report => report.reportType === type)
      .reduce((total, report) => total + report.value, 0);
  };

  return {
    createReport,
    getReportsByMachine,
    getTotalByType,
  };
};
