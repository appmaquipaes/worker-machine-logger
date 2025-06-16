import { ReportType } from '@/types/report';

export interface ReportFormData {
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
  selectedMaquinaria: string;
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
    inventarioAcopio,
    selectedMaquinaria
  } = data;

  if (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras') {
    if (!hours || hours <= 0) {
      return `Debe ingresar un valor válido para las ${reportType === 'Horas Trabajadas' ? 'horas trabajadas' : 'horas extras'}`;
    }
    
    if (reportType === 'Horas Trabajadas' && !workSite.trim()) {
      return 'Debe ingresar el sitio de trabajo';
    }
  }

  if (reportType === 'Viajes') {
    if (!trips || trips <= 0) {
      return 'Debe ingresar un número válido de viajes';
    }
    
    if (!origin.trim()) {
      return 'Debe ingresar el origen';
    }
    
    if (!selectedCliente.trim()) {
      return 'Debe seleccionar un cliente';
    }
    
    // Si es transporte de material, validar cantidad de m3
    if (['Volqueta', 'Cargador', 'Camión'].some(type => 
      // Necesitamos verificar el tipo de máquina seleccionada desde el contexto
      false // Por ahora dejamos esto así ya que necesitamos acceso al contexto de máquina
    )) {
      if (!cantidadM3 || cantidadM3 <= 0) {
        return 'Debe ingresar una cantidad válida de m³';
      }
      
      if (origin === 'Acopio Maquipaes') {
        if (!tipoMateria.trim()) {
          return 'Debe seleccionar el tipo de material del inventario';
        }
        
        const materialInventario = inventarioAcopio.find(item => item.tipo_material === tipoMateria);
        if (materialInventario && cantidadM3 > materialInventario.cantidad_disponible) {
          return `No hay suficiente material disponible. Máximo: ${materialInventario.cantidad_disponible} m³`;
        }
      } else if (!tipoMateria.trim()) {
        return 'Debe seleccionar el tipo de material';
      }
    }
  }

  if (reportType === 'Combustible') {
    if (!value || value <= 0) {
      return 'Debe ingresar un valor válido para el combustible';
    }
    
    if (!kilometraje || kilometraje <= 0) {
      return 'Debe ingresar el kilometraje actual';
    }
  }

  if (reportType === 'Mantenimiento') {
    if (!maintenanceValue || maintenanceValue <= 0) {
      return 'Debe ingresar un valor válido para el mantenimiento';
    }
    
    if (!proveedor.trim()) {
      return 'Debe seleccionar un proveedor';
    }
  }

  if (reportType === 'Novedades' && !description.trim()) {
    return 'Debe ingresar una descripción de la novedad';
  }

  // Validación para transporte de maquinaria
  if (reportType === 'Viajes' && ['Camabaja', 'Semirremolque', 'Tractomula'].some(type => 
    // Necesitamos verificar el tipo de máquina seleccionada desde el contexto
    false // Por ahora dejamos esto así ya que necesitamos acceso al contexto de máquina
  )) {
    if (!selectedMaquinaria.trim()) {
      return 'Debe seleccionar la maquinaria transportada';
    }
  }

  return null;
};
