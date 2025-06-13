
import { ReportType } from '@/types/report';

interface ReportFormData {
  reportType: ReportType;
  description: string;
  trips?: number;
  hours?: number;
  value?: number;
  origin: string;
  selectedCliente: string;
  selectedFinca: string;
  workSite: string;
  maintenanceValue?: number;
  cantidadM3?: number;
  proveedor: string;
  kilometraje?: number;
  tipoMateria: string;
  inventarioAcopio: any[];
}

export const validateReportForm = (data: ReportFormData): string | null => {
  const {
    reportType,
    description,
    trips,
    hours,
    value,
    origin,
    selectedCliente,
    selectedFinca,
    workSite,
    maintenanceValue,
    cantidadM3,
    proveedor,
    kilometraje,
    tipoMateria,
    inventarioAcopio
  } = data;

  console.log('Validating report form data:', { reportType, ...data });

  // Validaciones específicas por tipo de reporte
  switch (reportType) {
    case 'Horas Trabajadas':
      if (!hours || hours <= 0) {
        return 'Las horas trabajadas son obligatorias y deben ser mayor a 0';
      }
      if (!workSite || workSite.trim() === '') {
        return 'El sitio de trabajo (cliente) es obligatorio';
      }
      break;

    case 'Horas Extras':
      if (!hours || hours <= 0) {
        return 'Las horas extras son obligatorias y deben ser mayor a 0';
      }
      break;

    case 'Viajes':
      if (!origin || origin.trim() === '') {
        return 'El origen es obligatorio para los viajes';
      }
      if (!selectedCliente || selectedCliente.trim() === '') {
        return 'El cliente de destino es obligatorio para los viajes';
      }
      if (!selectedFinca || selectedFinca.trim() === '') {
        return 'La finca de destino es obligatoria para los viajes';
      }
      if (!cantidadM3 || cantidadM3 <= 0) {
        return 'La cantidad de m³ transportados es obligatoria y debe ser mayor a 0';
      }
      if (!tipoMateria || tipoMateria.trim() === '') {
        return 'El tipo de material es obligatorio para los viajes';
      }
      
      // Validación especial para viajes desde acopio
      if (origin === 'Acopio Maquipaes') {
        const itemInventario = inventarioAcopio.find(item => item.tipo_material === tipoMateria);
        if (!itemInventario) {
          return 'El material seleccionado no está disponible en el inventario de acopio';
        }
        if (cantidadM3 > itemInventario.cantidad_disponible) {
          return `La cantidad solicitada (${cantidadM3} m³) excede la cantidad disponible en acopio (${itemInventario.cantidad_disponible} m³)`;
        }
      }
      break;

    case 'Combustible':
      if (!value || value <= 0) {
        return 'El valor del combustible es obligatorio y debe ser mayor a 0';
      }
      if (kilometraje === undefined || kilometraje < 0) {
        return 'El kilometraje actual es obligatorio y debe ser mayor o igual a 0';
      }
      break;

    case 'Mantenimiento':
      if (!maintenanceValue || maintenanceValue <= 0) {
        return 'El valor del mantenimiento es obligatorio y debe ser mayor a 0';
      }
      if (!proveedor || proveedor.trim() === '') {
        return 'El proveedor es obligatorio para el mantenimiento';
      }
      break;

    case 'Novedades':
      if (!description || description.trim() === '') {
        return 'La descripción de las novedades es obligatoria';
      }
      if (description.trim().length < 10) {
        return 'La descripción de las novedades debe tener al menos 10 caracteres';
      }
      break;

    default:
      return 'Tipo de reporte no válido';
  }

  console.log('Validation passed for report type:', reportType);
  return null; // No hay errores de validación
};
