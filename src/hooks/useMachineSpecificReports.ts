
import { Machine } from '@/context/MachineContext';
import { ReportType } from '@/types/report';

export const useMachineSpecificReports = () => {
  
  const getAvailableReportTypes = (machine: Machine | null): ReportType[] => {
    if (!machine) return [];

    // Vehículos de transporte: pueden registrar todos los tipos de reporte
    const transportVehicles = ['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'];
    
    // Maquinaria pesada: pueden registrar todo excepto viajes
    const heavyMachinery = ['Excavadora', 'Bulldozer', 'Cargador', 'Motoniveladora', 'Compactador', 'Paladraga'];

    const allReportTypes: ReportType[] = [
      'Horas Trabajadas',
      'Horas Extras', 
      'Mantenimiento',
      'Combustible',
      'Novedades',
      'Viajes'
    ];

    if (transportVehicles.includes(machine.type)) {
      // Los vehículos de transporte pueden usar todos los tipos de reporte
      return allReportTypes;
    } else if (heavyMachinery.includes(machine.type)) {
      // La maquinaria pesada no puede registrar viajes
      return allReportTypes.filter(type => type !== 'Viajes');
    } else {
      // Para otros tipos de máquina, permitir todos los reportes por defecto
      return allReportTypes;
    }
  };

  const getReportTypeDescription = (machine: Machine | null, reportType: ReportType): string => {
    if (!machine) return '';

    const isTransportVehicle = ['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'].includes(machine.type);
    
    switch (reportType) {
      case 'Horas Trabajadas':
        return isTransportVehicle 
          ? 'Registra las horas que el vehículo estuvo en operación de transporte'
          : 'Registra las horas que la máquina estuvo trabajando en el sitio';
      
      case 'Horas Extras':
        return isTransportVehicle
          ? 'Registra horas adicionales de operación del vehículo fuera del horario normal'
          : 'Registra horas adicionales de trabajo de la máquina fuera del horario normal';
      
      case 'Viajes':
        return 'Registra los viajes de transporte de material desde el origen hasta el destino';
      
      case 'Combustible':
        return isTransportVehicle
          ? 'Registra el abastecimiento de combustible del vehículo'
          : 'Registra el abastecimiento de combustible de la máquina';
      
      case 'Mantenimiento':
        return isTransportVehicle
          ? 'Registra servicios de mantenimiento realizados al vehículo'
          : 'Registra servicios de mantenimiento realizados a la máquina';
      
      case 'Novedades':
        return isTransportVehicle
          ? 'Registra incidentes, daños o situaciones especiales del vehículo'
          : 'Registra incidentes, daños o situaciones especiales de la máquina';
      
      default:
        return '';
    }
  };

  const getMachineTypeLabel = (machine: Machine | null): string => {
    if (!machine) return '';
    
    const transportVehicles = ['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'];
    
    return transportVehicles.includes(machine.type) ? 'Vehículo de Transporte' : 'Maquinaria Pesada';
  };

  return {
    getAvailableReportTypes,
    getReportTypeDescription,
    getMachineTypeLabel
  };
};
