
import { Report, ReportType } from '@/types/report';
import { calcularValorHorasTrabajadas, calcularValorViajes } from '@/utils/reportValueCalculator';
import { useInventarioOperations } from '@/hooks/useInventarioOperations';
import { useReportesToVentas } from '@/hooks/useReportesToVentas';

export const useReportOperations = () => {
  const { procesarReporteInventario } = useInventarioOperations();
  const { procesarReporteParaVenta } = useReportesToVentas();

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

    // Si no se pudo calcular automáticamente, usar valor manual si se proporcionó
    if (!tarifaEncontrada && value !== undefined) {
      calculatedValue = value;
      detalleCalculo = 'Valor ingresado manualmente';
    }

    const newReport: Report = {
      id: Date.now().toString(),
      machineId,
      machineName,
      userName: 'Current User', // This should come from auth context
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
    };
    
    // PROCESAMIENTO AUTOMÁTICO DE INVENTARIO (existente)
    if (newReport.reportType === 'Viajes') {
      console.log('=== PROCESANDO INVENTARIO PARA NUEVO REPORTE ===');
      const resultado = procesarReporteInventario(newReport);
      if (resultado.exito) {
        console.log('✓ Inventario actualizado automáticamente:', resultado.mensaje);
      } else {
        console.log('ℹ No se actualizó inventario:', resultado.mensaje);
      }
    }

    // NUEVO: PROCESAMIENTO AUTOMÁTICO DE VENTAS
    if (newReport.reportType === 'Viajes') {
      console.log('=== PROCESANDO VENTA AUTOMÁTICA PARA NUEVO REPORTE ===');
      const resultadoVenta = procesarReporteParaVenta(newReport);
      if (resultadoVenta.exito) {
        console.log('✓ Venta generada automáticamente:', resultadoVenta.mensaje);
        console.log('✓ Total venta:', resultadoVenta.total);
      } else {
        console.log('ℹ No se generó venta automática:', resultadoVenta.mensaje);
      }
    }

    // Log para debugging
    console.log('Nuevo reporte creado:', {
      tipo: reportType,
      valor: calculatedValue,
      detalleCalculo,
      tarifaEncontrada
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
