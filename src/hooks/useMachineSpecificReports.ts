
import { Machine } from '@/context/MachineContext';
import { ReportType } from '@/types/report';

export const useMachineSpecificReports = () => {
  const isMaterialTransportVehicle = (machine?: Machine): boolean => {
    if (!machine) return false;
    const transportTypes = ['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'];
    return transportTypes.includes(machine.type);
  };

  const isMachineryTransportVehicle = (machine?: Machine): boolean => {
    if (!machine) return false;
    const transportTypes = ['Camabaja', 'Semirremolque', 'Tractomula'];
    return transportTypes.includes(machine.type);
  };

  const isEscombrera = (machine?: Machine): boolean => {
    if (!machine) return false;
    return machine.name.toLowerCase().includes('escombrera') || machine.type === 'Escombrera';
  };

  const getAvailableReportTypes = (machine?: Machine): ReportType[] => {
    if (!machine) return [];

    // Si es escombrera, solo permite Recepción Escombrera
    if (isEscombrera(machine)) {
      return ['Recepción Escombrera'];
    }

    const baseReports: ReportType[] = ['Horas Trabajadas', 'Mantenimiento', 'Combustible', 'Novedades'];
    
    if (machine.type === 'Excavadora' || machine.type === 'Cargador' || machine.type === 'Bulldozer' || machine.type === 'Motoniveladora') {
      return [...baseReports, 'Horas Extras'];
    }
    
    if (isMaterialTransportVehicle(machine) || isMachineryTransportVehicle(machine)) {
      return [...baseReports, 'Viajes'];
    }
    
    return baseReports;
  };

  return {
    isMaterialTransportVehicle,
    isMachineryTransportVehicle,
    isEscombrera,
    getAvailableReportTypes,
  };
};
