
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
    // Ahora detecta por tipo específico o por nombre que contenga 'escombrera'
    return machine.type === 'Escombrera' || machine.name.toLowerCase().includes('escombrera');
  };

  const isCargador = (machine?: Machine): boolean => {
    if (!machine) return false;
    return machine.type === 'Cargador';
  };

  const isInventoryMachine = (machine?: Machine): boolean => {
    if (!machine) return false;
    // Máquinas que manejan inventario: Volquetas, Camiones y Cargadores
    return isMaterialTransportVehicle(machine) || isCargador(machine);
  };

  const getMachineTypeLabel = (machine: Machine): string => {
    return `${machine.type}`;
  };

  const getAvailableReportTypes = (machine?: Machine): ReportType[] => {
    if (!machine) return [];

    // Si es escombrera, solo permite Recepción Escombrera
    if (isEscombrera(machine)) {
      return ['Recepción Escombrera'];
    }

    const baseReports: ReportType[] = ['Horas Trabajadas', 'Mantenimiento', 'Combustible', 'Novedades'];
    
    // Para Cargadores: agregar Entrega Material (en lugar de Viajes)
    if (isCargador(machine)) {
      return [...baseReports, 'Entrega Material'];
    }
    
    if (machine.type === 'Retroexcavadora de Oruga' || machine.type === 'Bulldozer' || machine.type === 'Motoniveladora') {
      return [...baseReports, 'Horas Extras'];
    }
    
    // Para vehículos de transporte de material: agregar Entrega Material (en lugar de Viajes)
    if (isMaterialTransportVehicle(machine) || isMachineryTransportVehicle(machine)) {
      return [...baseReports, 'Entrega Material'];
    }
    
    return baseReports;
  };

  const getReportTypeDescription = (machine: Machine, reportType: ReportType): string => {
    if (reportType === 'Entrega Material') {
      if (isCargador(machine)) {
        return `Registro de entrega de material cargado desde el Acopio hacia clientes. El ${machine.name} opera desde el Acopio Maquipaes, selecciona el material y destino. NO genera venta automática.`;
      } else {
        return `Registro de entrega de material transportado por ${machine.name}. Especifica origen, destino y cantidad. NO genera venta automática - las ventas se registran manualmente.`;
      }
    }

    switch (reportType) {
      case 'Recepción Escombrera':
        return 'Registro de recepción de volquetas en la escombrera. Selecciona el cliente y tipo de volqueta para calcular automáticamente el valor a cobrar.';
      case 'Horas Trabajadas':
        return `Registro de horas trabajadas por ${machine.name}. Las tarifas se calculan automáticamente según el cliente y tipo de máquina.`;
      case 'Viajes':
        return `Registro de viajes realizados por ${machine.name}. Los valores se calculan según origen, destino y cantidad de material.`;
      case 'Combustible':
        return `Registro del combustible cargado en ${machine.name}. Incluye valor y kilometraje actual.`;
      case 'Mantenimiento':
        return `Registro de mantenimientos realizados a ${machine.name}. Especifica proveedor y valor del servicio.`;
      case 'Novedades':
        return `Registro de novedades o incidentes relacionados con ${machine.name}.`;
      default:
        return 'Completa la información requerida para este tipo de reporte.';
    }
  };

  return {
    isMaterialTransportVehicle,
    isMachineryTransportVehicle,
    isEscombrera,
    isCargador,
    isInventoryMachine,
    getAvailableReportTypes,
    getReportTypeDescription,
    getMachineTypeLabel,
  };
};
