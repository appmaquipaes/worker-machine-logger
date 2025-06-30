
import { useState } from 'react';
import { ReportType } from '@/types/report';
import { useReport } from '@/context/ReportContext';
import { calcularValorHorasTrabajadas, calcularValorViajes } from '@/utils/reportValueCalculator';
import { toast } from "sonner";

export const useReportFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addReport } = useReport();

  const submitReport = async (
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
  ) => {
    setIsSubmitting(true);
    
    try {
      let finalValue = value;
      let detalleCalculo = '';
      let tarifaEncontrada = false;

      // CALCULAR VALOR AUTOMÁTICAMENTE PARA HORAS TRABAJADAS
      if (reportType === 'Horas Trabajadas' && workSite && hours) {
        console.log('🔄 Calculando valor automático para horas trabajadas...');
        const resultado = calcularValorHorasTrabajadas(workSite, undefined, machineId, hours);
        
        finalValue = resultado.valorCalculado;
        detalleCalculo = resultado.detalleCalculo;
        tarifaEncontrada = resultado.tarifaEncontrada;
        
        console.log('💰 Valor calculado para horas trabajadas:', {
          workSite,
          hours,
          valorCalculado: finalValue,
          detalleCalculo,
          tarifaEncontrada
        });
      }

      // CALCULAR VALOR AUTOMÁTICAMENTE PARA HORAS EXTRAS
      if (reportType === 'Horas Extras' && workSite && hours) {
        console.log('🔄 Calculando valor automático para horas extras...');
        const resultado = calcularValorHorasTrabajadas(workSite, undefined, machineId, hours);
        
        // Para horas extras, podríamos aplicar un multiplicador (ej: 1.5x)
        finalValue = resultado.valorCalculado * 1.5; // 50% adicional por horas extras
        detalleCalculo = `Horas extras: ${resultado.detalleCalculo} × 1.5 = $${finalValue.toLocaleString()}`;
        tarifaEncontrada = resultado.tarifaEncontrada;
        
        console.log('💰 Valor calculado para horas extras:', {
          workSite,
          hours,
          valorCalculado: finalValue,
          detalleCalculo,
          tarifaEncontrada
        });
      }

      // CALCULAR VALOR PARA VIAJES SI ES NECESARIO
      if (reportType === 'Viajes' && origin && destination && cantidadM3 && trips) {
        const clienteDestino = destination.split(' - ')[0] || '';
        const fincaDestino = destination.split(' - ')[1] || '';
        
        if (clienteDestino && !finalValue) {
          console.log('🔄 Calculando valor automático para viajes...');
          const resultado = calcularValorViajes(clienteDestino, fincaDestino, origin, destination, cantidadM3);
          
          finalValue = resultado.valorCalculado;
          detalleCalculo = resultado.detalleCalculo;
          tarifaEncontrada = resultado.tarifaEncontrada;
          
          console.log('💰 Valor calculado para viajes:', {
            origen: origin,
            destino: destination,
            cantidadM3,
            valorCalculado: finalValue,
            detalleCalculo,
            tarifaEncontrada
          });
        }
      }

      // Crear el reporte con el valor calculado
      addReport(
        machineId,
        machineName,
        reportType,
        description,
        reportDate,
        trips,
        hours,
        finalValue,
        workSite,
        origin,
        destination,
        cantidadM3,
        proveedor,
        kilometraje
      );

      // Agregar campos adicionales al reporte si fueron calculados
      if (detalleCalculo || tarifaEncontrada !== undefined) {
        console.log('📋 Información adicional del cálculo:', {
          detalleCalculo,
          tarifaEncontrada
        });
        
        // Mostrar toast con información del cálculo
        if (tarifaEncontrada) {
          toast.success(`✅ Reporte guardado con tarifa: ${detalleCalculo}`, {
            duration: 4000,
            style: {
              fontSize: '14px'
            }
          });
        } else if (finalValue && finalValue > 0) {
          toast.warning(`⚠️ Reporte guardado sin tarifa específica. Valor: $${finalValue.toLocaleString()}`, {
            duration: 4000,
            style: {
              fontSize: '14px'
            }
          });
        } else {
          toast.info('ℹ️ Reporte guardado. No se encontró tarifa para calcular valor automático.', {
            duration: 3000,
            style: {
              fontSize: '14px'
            }
          });
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Error enviando reporte:', error);
      toast.error('Error al enviar el reporte');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitReport,
    isSubmitting
  };
};
