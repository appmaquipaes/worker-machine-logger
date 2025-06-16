
import { Machine } from '@/context/MachineContext';
import { ReportType } from '@/types/report';

export const useMachineSpecificReports = () => {
  
  const getAvailableReportTypes = (machine: Machine | null): ReportType[] => {
    console.log('useMachineSpecificReports - machine received:', machine);
    
    if (!machine) {
      console.log('useMachineSpecificReports - no machine, returning empty array');
      return [];
    }

    // Vehículos que transportan materiales
    const materialTransportVehicles = ['Volqueta', 'Cargador', 'Camión'];
    
    // Vehículos que transportan maquinaria
    const machineryTransportVehicles = ['Camabaja', 'Semirremolque', 'Tractomula'];
    
    // Todos los vehículos de transporte
    const allTransportVehicles = [...materialTransportVehicles, ...machineryTransportVehicles];
    
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
    console.log('useMachineSpecificReports - is transport vehicle:', allTransportVehicles.includes(machine.type));

    if (allTransportVehicles.includes(machine.type)) {
      // Todos los vehículos de transporte pueden usar viajes
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

    const materialTransportVehicles = ['Volqueta', 'Cargador', 'Camión'];
    const machineryTransportVehicles = ['Camabaja', 'Semirremolque', 'Tractomula'];
    
    switch (reportType) {
      case 'Horas Trabajadas':
        return materialTransportVehicles.includes(machine.type)
          ? 'Registra las horas que el vehículo estuvo en operación de transporte'
          : machineryTransportVehicles.includes(machine.type)
          ? 'Registra las horas que el vehículo estuvo transportando maquinaria'
          : 'Registra las horas que la máquina estuvo trabajando en el sitio';
      
      case 'Horas Extras':
        return materialTransportVehicles.includes(machine.type) || machineryTransportVehicles.includes(machine.type)
          ? 'Registra horas adicionales de operación del vehículo fuera del horario normal'
          : 'Registra horas adicionales de trabajo de la máquina fuera del horario normal';
      
      case 'Viajes':
        if (materialTransportVehicles.includes(machine.type)) {
          return 'Registra los viajes de transporte de material desde el origen hasta el destino';
        } else if (machineryTransportVehicles.includes(machine.type)) {
          return 'Registra los viajes de transporte de maquinaria desde el origen hasta el destino';
        }
        return 'Registra los viajes de transporte realizados';
      
      case 'Combustible':
        return materialTransportVehicles.includes(machine.type) || machineryTransportVehicles.includes(machine.type)
          ? 'Registra el abastecimiento de combustible del vehículo'
          : 'Registra el abastecimiento de combustible de la máquina';
      
      case 'Mantenimiento':
        return materialTransportVehicles.includes(machine.type) || machineryTransportVehicles.includes(machine.type)
          ? 'Registra servicios de mantenimiento realizados al vehículo'
          : 'Registra servicios de mantenimiento realizados a la máquina';
      
      case 'Novedades':
        return materialTransportVehicles.includes(machine.type) || machineryTransportVehicles.includes(machine.type)
          ? 'Registra incidentes, daños o situaciones especiales del vehículo'
          : 'Registra incidentes, daños o situaciones especiales de la máquina';
      
      default:
        return '';
    }
  };

  const getMachineTypeLabel = (machine: Machine | null): string => {
    if (!machine) return '';
    
    const materialTransportVehicles = ['Volqueta', 'Cargador', 'Camión'];
    const machineryTransportVehicles = ['Camabaja', 'Semirremolque', 'Tractomula'];
    
    if (materialTransportVehicles.includes(machine.type)) {
      return 'Vehículo de Transporte de Materiales';
    } else if (machineryTransportVehicles.includes(machine.type)) {
      return 'Vehículo de Transporte de Maquinaria';
    }
    
    return 'Maquinaria Pesada';
  };

  const isMaterialTransportVehicle = (machine: Machine | null): boolean => {
    if (!machine) return false;
    return ['Volqueta', 'Cargador', 'Camión'].includes(machine.type);
  };

  const isMachineryTransportVehicle = (machine: Machine | null): boolean => {
    if (!machine) return false;
    return ['Camabaja', 'Semirremolque', 'Tractomula'].includes(machine.type);
  };

  return {
    getAvailableReportTypes,
    getReportTypeDescription,
    getMachineTypeLabel,
    isMaterialTransportVehicle,
    isMachineryTransportVehicle
  };
};
