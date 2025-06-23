import { ReportType } from '@/types/report';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';
import { useMachine } from '@/context/MachineContext';
import { loadInventarioAcopio } from '@/models/InventarioAcopio';

export const useReportFormValidation = () => {
  const { selectedMachine } = useMachine();
  const { isMaterialTransportVehicle, isMachineryTransportVehicle, isEscombrera, isCargador } = useMachineSpecificReports();

  const validateForm = (formData: {
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
    selectedMaquinaria?: string;
  }): string | null => {
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
    } = formData;

    // Validaciones específicas por tipo de reporte
    if (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras') {
      if (!hours || hours <= 0) {
        return 'Debe ingresar las horas trabajadas';
      }
      if (!workSite.trim()) {
        return 'Debe seleccionar el sitio de trabajo';
      }
    }

    if (reportType === 'Viajes' || reportType === 'Entrega Material') {
      // Validación específica para Cargadores
      if (isCargador(selectedMachine)) {
        if (!tipoMateria.trim()) {
          return reportType === 'Entrega Material' 
            ? 'Debe seleccionar el material a entregar'
            : 'Debe seleccionar el material a cargar';
        }
        if (!cantidadM3 || cantidadM3 <= 0) {
          return reportType === 'Entrega Material'
            ? 'Debe ingresar la cantidad de m³ entregados'
            : 'Debe ingresar la cantidad de m³ cargados';
        }
        if (!selectedCliente.trim()) {
          return 'Debe seleccionar el cliente de destino';
        }
        
        // Validar stock disponible SOLO si hay material seleccionado - cargar inventario fresco
        if (tipoMateria.trim()) {
          console.log('=== VALIDACIÓN DE STOCK EN FORMULARIO ===');
          const inventarioActual = loadInventarioAcopio();
          console.log('Inventario cargado para validación:', inventarioActual);
          
          const materialInventario = inventarioActual.find(item => item.tipo_material === tipoMateria);
          console.log('Material encontrado:', materialInventario);
          
          if (!materialInventario) {
            return `El material "${tipoMateria}" no se encuentra en el inventario`;
          }
          if (materialInventario.cantidad_disponible < cantidadM3) {
            console.log(`❌ VALIDACIÓN FALLIDA - Disponible: ${materialInventario.cantidad_disponible}, Solicitado: ${cantidadM3}`);
            return `Stock insuficiente. Disponible: ${materialInventario.cantidad_disponible} m³, solicitado: ${cantidadM3} m³`;
          }
          
          console.log(`✅ VALIDACIÓN EXITOSA - Material: ${tipoMateria}, Disponible: ${materialInventario.cantidad_disponible}, Solicitado: ${cantidadM3}`);
        }
      } else {
        // Validación para otras máquinas de transporte
        if (reportType === 'Viajes' && (!trips || trips <= 0)) {
          return 'Debe ingresar el número de viajes';
        }
        if (!origin.trim()) {
          return 'Debe especificar el origen';
        }
        if (!selectedCliente.trim()) {
          return 'Debe seleccionar el cliente de destino';
        }
        if (isMaterialTransportVehicle(selectedMachine) && (!cantidadM3 || cantidadM3 <= 0)) {
          return reportType === 'Entrega Material'
            ? 'Debe ingresar la cantidad de m³ entregados'
            : 'Debe ingresar la cantidad de m³ transportados';
        }
      }
    }

    if (reportType === 'Combustible') {
      if (!value || value <= 0) {
        return 'Debe ingresar el valor del combustible';
      }
      if (!kilometraje || kilometraje < 0) {
        return 'Debe ingresar el kilometraje actual';
      }
    }

    if (reportType === 'Mantenimiento') {
      if (!maintenanceValue || maintenanceValue <= 0) {
        return 'Debe ingresar el valor del mantenimiento';
      }
      if (!proveedor.trim()) {
        return 'Debe seleccionar el proveedor';
      }
    }

    if (reportType === 'Novedades') {
      if (!description.trim()) {
        return 'Debe ingresar la descripción de la novedad';
      }
    }

    if (reportType === 'Recepción Escombrera') {
      if (!selectedCliente.trim()) {
        return 'Debe seleccionar el cliente';
      }
      if (!trips || trips <= 0) {
        return 'Debe ingresar el número de volquetas';
      }
      if (!tipoMateria.trim()) {
        return 'Debe seleccionar el tipo de material';
      }
    }

    return null;
  };

  return {
    validateForm,
  };
};
