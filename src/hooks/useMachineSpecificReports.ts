
import { Machine } from '@/context/MachineContext';
import { ReportType } from '@/types/report';

export const useMachineSpecificReports = () => {
  
  const getAvailableReportTypes = (machine: Machine | null): ReportType[] => {
    console.log('useMachineSpecificReports - machine received:', machine);
    
    if (!machine) {
      console.log('useMachineSpecificReports - no machine, returning empty array');
      return [];
    }

    // Solo vehículos de transporte específicos pueden registrar viajes
    const transportVehicles = ['Volqueta', 'Cargador', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'];
    
    // Maquinaria pesada: pueden registrar todo excepto viajes
    const heavyMachinery = ['Retroexcavadora de Oruga', 'Retroexcavadora de Llanta', 'Bulldozer', 'Motoniveladora', 'Vibrocompactador', 'Paladraga'];

    const allReportTypes: ReportType[] = [
      'Horas Trabajadas',
      'Horas Extras', 
      'Mantenimiento',
      'Combustible',
      'Novedades'
    ];

    console.log('useMachineSpecificReports - machine type:', machine.type);
    console.log('useMachineSpecificReports - is transport vehicle:', transportVehicles.includes(machine.type));

    if (transportVehicles.includes(machine.type)) {
      // Solo vehículos de transporte pueden usar viajes
      const reportTypesWithTrips: ReportType[] = [...allReportTypes, 'Viajes'];
      console.log('useMachineSpecificReports - returning types with Viajes:', reportTypesWithTrips);
      return reportTypesWithTrips;
    } else if (heavyMachinery.includes(machine.type)) {
      // La maquinaria pesada no puede registrar viajes
      console.log('useMachineSpecificReports - heavy machinery, no trips:', allReportTypes);
      return allReportTypes;
    } else {
      // Para otros tipos de máquina, no permitir viajes por ahora
      console.log('useMachineSpecificReports - other machine type, no trips:', allReportTypes);
      return allReportTypes;
    }
  };

  const getReportTypeDescription = (machine: Machine | null, reportType: ReportType): string => {
    if (!machine) return '';

    const isTransportVehicle = ['Volqueta', 'Cargador'].includes(machine.type);
    
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
    
    const transportVehicles = ['Volqueta', 'Cargador'];
    
    return transportVehicles.includes(machine.type) ? 'Vehículo de Transporte' : 'Maquinaria Pesada';
  };

  return {
    getAvailableReportTypes,
    getReportTypeDescription,
    getMachineTypeLabel
  };
};
