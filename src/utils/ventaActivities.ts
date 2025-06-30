
import { Report } from '@/types/report';

export const getActividadGeneradora = (report: Report): string => {
  const maquina = report.machineName;
  const tipo = report.reportType;
  
  switch (tipo) {
    case 'Horas Trabajadas':
      return `Alquiler ${maquina}`;
    case 'Horas Extras':
      return `Horas extras ${maquina}`;
    case 'Mantenimiento':
      return `Mantenimiento ${maquina}`;
    case 'Combustible':
      return `Combustible ${maquina}`;
    case 'Viajes':
      if (maquina.toLowerCase().includes('cargador')) {
        return `Carga y transporte - ${maquina}`;
      } else if (maquina.toLowerCase().includes('volqueta') || maquina.toLowerCase().includes('camión')) {
        return `Transporte material - ${maquina}`;
      } else if (maquina.toLowerCase().includes('camabaja')) {
        return `Transporte - ${maquina}`;
      } else {
        return `Transporte - ${maquina}`;
      }
    case 'Recepción Escombrera':
      return `Recepción escombrera - ${maquina}`;
    default:
      return `${tipo} - ${maquina}`;
  }
};
