
import { ReportType } from '@/context/ReportContext';
import { getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';

interface ValidationParams {
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

export const validateReportForm = (params: ValidationParams): string | null => {
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
  } = params;

  // Solo validar descripción para Novedades
  if (reportType === 'Novedades' && !description.trim()) {
    return 'Las novedades no pueden estar vacías';
  }

  // Validaciones específicas para cada tipo de reporte
  if (reportType === 'Viajes') {
    if (trips === undefined || trips <= 0) {
      return 'Debe ingresar un número válido de viajes';
    }
    
    if (!origin.trim()) {
      return 'Debe seleccionar el origen del viaje';
    }

    if (!selectedCliente.trim()) {
      return 'Debe seleccionar el cliente destino';
    }

    // Validar finca solo si el cliente tiene fincas registradas
    const clienteData = getClienteByName(selectedCliente);
    const fincasDisponibles = clienteData ? getFincasByCliente(clienteData.id) : [];
    
    if (fincasDisponibles.length > 0 && !selectedFinca.trim()) {
      return 'Debe seleccionar la finca destino';
    }

    if (cantidadM3 === undefined || cantidadM3 <= 0) {
      return 'Debe ingresar una cantidad válida de m³ transportados';
    }

    // Para viajes desde Acopio Maquipaes, validar material del inventario
    if (origin === 'Acopio Maquipaes') {
      if (!tipoMateria.trim()) {
        return 'Debe seleccionar el tipo de material desde el inventario';
      }
      
      const materialEnInventario = inventarioAcopio.find(item => item.tipo_material === tipoMateria);
      if (!materialEnInventario) {
        return 'El material seleccionado no está disponible en el inventario';
      }
      
      if (materialEnInventario.cantidad_disponible < cantidadM3) {
        return `Solo hay ${materialEnInventario.cantidad_disponible} m³ disponibles de ${tipoMateria}`;
      }
    } else {
      if (!tipoMateria.trim()) {
        return 'Debe seleccionar el tipo de materia';
      }
    }
  }
  
  // Validar horas para tipos de reporte relevantes
  const shouldShowHoursInput = (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras');
  if (shouldShowHoursInput && (hours === undefined || hours <= 0)) {
    return 'Debe ingresar un número válido de horas';
  }
  
  // Validar sitio de trabajo para horas trabajadas
  if (reportType === 'Horas Trabajadas' && !workSite.trim()) {
    return 'Debe seleccionar el cliente para el sitio de trabajo';
  }
  
  // Validar combustible
  if (reportType === 'Combustible') {
    if (value === undefined || value <= 0) {
      return 'Debe ingresar un valor válido para el combustible';
    }
    
    if (kilometraje === undefined || kilometraje <= 0) {
      return 'Debe ingresar el kilometraje actual del vehículo';
    }
  }

  // Validar mantenimiento
  if (reportType === 'Mantenimiento') {
    if (maintenanceValue === undefined || maintenanceValue <= 0) {
      return 'Debe ingresar un valor válido para el mantenimiento';
    }
    
    if (!proveedor.trim()) {
      return 'Debe seleccionar un proveedor para el mantenimiento';
    }
  }

  return null; // No hay errores
};
