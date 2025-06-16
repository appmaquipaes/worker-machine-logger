
import { ReportType } from '@/types/report';
import { MACHINE_INVENTORY_CONFIG } from '@/constants/inventario';

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
  machineType?: string; // Nuevo parámetro
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
    selectedMaquinaria,
    machineType
  } = data;

  // Validaciones existentes para Horas Trabajadas y Horas Extras
  if (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras') {
    if (!hours || hours <= 0) {
      return `Debe ingresar un valor válido para las ${reportType === 'Horas Trabajadas' ? 'horas trabajadas' : 'horas extras'}`;
    }
    
    if (reportType === 'Horas Trabajadas' && !workSite.trim()) {
      return 'Debe ingresar el sitio de trabajo';
    }
  }

  // Validaciones para Viajes con reglas específicas por tipo de máquina
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

    // Validaciones específicas para máquinas Cargador
    if (machineType === 'Cargador') {
      const config = MACHINE_INVENTORY_CONFIG.Cargador;
      
      // Los Cargadores solo pueden tener origen "Acopio Maquipaes"
      if (config.forceOriginAcopio && !origin.toLowerCase().includes('acopio')) {
        return 'Las máquinas Cargador solo pueden realizar viajes desde Acopio Maquipaes';
      }
      
      // Los Cargadores no pueden realizar entradas al inventario
      if (!config.canEnter && origin.toLowerCase().includes('acopio')) {
        return 'Las máquinas Cargador no pueden realizar entradas al inventario de acopio';
      }
    }
    
    // Validación de cantidad de m³ para máquinas de transporte
    if (['Volqueta', 'Cargador', 'Camión'].includes(machineType || '')) {
      if (!cantidadM3 || cantidadM3 <= 0) {
        return 'Debe ingresar una cantidad válida de m³';
      }
      
      // Validación específica para salidas desde acopio
      if (origin.toLowerCase().includes('acopio')) {
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

  // Validaciones existentes para otros tipos de reporte
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
  if (reportType === 'Viajes' && ['Camabaja', 'Semirremolque', 'Tractomula'].includes(machineType || '')) {
    if (!selectedMaquinaria.trim()) {
      return 'Debe seleccionar la maquinaria transportada';
    }
  }

  return null;
};
