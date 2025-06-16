
import { useCallback } from 'react';
import { Report } from '@/types/report';
import { createVenta, saveVentas, loadVentas, DetalleVenta } from '@/models/Ventas';
import { findTarifaCliente } from '@/models/TarifasCliente';
import { extractClienteFromDestination, extractFincaFromDestination } from '@/utils/reportUtils';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';
import { toast } from 'sonner';

export const useReportesToVentas = () => {
  const { isMaterialTransportVehicle, isMachineryTransportVehicle } = useMachineSpecificReports();

  const convertirReporteAVenta = useCallback((reporte: Report) => {
    // Solo procesar reportes de tipo "Viajes"
    if (reporte.reportType !== 'Viajes') {
      return { exito: false, mensaje: 'No es un reporte de viajes' };
    }

    // Verificar que sea un vehículo de transporte
    const esMaterialTransport = isMaterialTransportVehicle({ id: reporte.machineId } as any);
    const esMachineryTransport = isMachineryTransportVehicle({ id: reporte.machineId } as any);
    
    if (!esMaterialTransport && !esMachineryTransport) {
      return { exito: false, mensaje: 'No es un vehículo de transporte' };
    }

    // Extraer datos del reporte
    const cliente = extractClienteFromDestination(reporte.destination || '');
    const finca = extractFincaFromDestination(reporte.destination || '');
    const origen = reporte.origin || '';
    const destino = reporte.destination || '';
    const cantidadM3 = reporte.cantidadM3 || 0;

    // Validar datos mínimos requeridos
    if (!cliente || !destino || cantidadM3 <= 0) {
      return { 
        exito: false, 
        mensaje: 'Faltan datos requeridos: cliente, destino o cantidad' 
      };
    }

    try {
      // Determinar tipo de venta y ciudad de entrega
      let tipoVenta: string;
      let ciudadEntrega = finca || cliente;

      if (esMaterialTransport) {
        // Para transporte de material
        if (origen === 'Acopio Maquipaes') {
          tipoVenta = 'Material + transporte'; // Vendemos material propio + flete
        } else {
          tipoVenta = 'Solo transporte'; // Solo prestamos servicio de flete
        }
      } else {
        // Para transporte de maquinaria
        tipoVenta = 'Solo transporte';
      }

      // Buscar tarifa para el cliente
      const tarifa = findTarifaCliente(cliente, finca, origen, destino);
      
      // Crear nueva venta
      const nuevaVenta = createVenta(
        reporte.reportDate,
        cliente,
        ciudadEntrega,
        tipoVenta,
        origen,
        destino,
        'Pendiente', // Forma de pago por defecto
        `Venta generada automáticamente desde reporte de viaje ID: ${reporte.id}`
      );

      // Crear detalles de la venta
      const detalles: DetalleVenta[] = [];

      if (esMaterialTransport && tarifa) {
        // Agregar detalle de material si corresponde
        if (origen === 'Acopio Maquipaes' && tarifa.valor_material_m3) {
          detalles.push({
            id: Date.now().toString() + '_material',
            tipo: 'Material',
            producto_servicio: reporte.tipoMateria || 'Material no especificado',
            cantidad_m3: cantidadM3,
            valor_unitario: tarifa.valor_material_m3,
            subtotal: cantidadM3 * tarifa.valor_material_m3
          });
        }

        // Agregar detalle de flete
        if (tarifa.valor_flete_m3) {
          detalles.push({
            id: Date.now().toString() + '_flete',
            tipo: 'Flete',
            producto_servicio: `Transporte ${origen} → ${destino}`,
            cantidad_m3: cantidadM3,
            valor_unitario: tarifa.valor_flete_m3,
            subtotal: cantidadM3 * tarifa.valor_flete_m3
          });
        }
      }

      // Si no se encontró tarifa o no hay detalles, crear un detalle básico con el valor del reporte
      if (detalles.length === 0 && reporte.value > 0) {
        detalles.push({
          id: Date.now().toString() + '_servicio',
          tipo: 'Flete',
          producto_servicio: `Servicio de transporte - ${reporte.machineName}`,
          cantidad_m3: cantidadM3,
          valor_unitario: reporte.value / cantidadM3,
          subtotal: reporte.value
        });
      }

      // Asignar detalles y calcular total
      nuevaVenta.detalles = detalles;
      nuevaVenta.total_venta = detalles.reduce((total, detalle) => total + detalle.subtotal, 0);

      // Guardar la venta
      const ventasExistentes = loadVentas();
      const ventasActualizadas = [...ventasExistentes, nuevaVenta];
      saveVentas(ventasActualizadas);

      // Log para debugging
      console.log('=== VENTA GENERADA AUTOMÁTICAMENTE ===');
      console.log('Reporte origen:', reporte.id);
      console.log('Cliente:', cliente);
      console.log('Tipo venta:', tipoVenta);
      console.log('Total venta:', nuevaVenta.total_venta);
      console.log('Detalles:', detalles);

      // Mostrar notificación de éxito
      toast.success(`Venta registrada automáticamente`, {
        description: `Cliente: ${cliente} - Total: $${nuevaVenta.total_venta.toLocaleString()}`
      });

      return { 
        exito: true, 
        mensaje: `Venta generada para ${cliente}`,
        ventaId: nuevaVenta.id,
        total: nuevaVenta.total_venta
      };

    } catch (error) {
      console.error('Error al convertir reporte a venta:', error);
      return { 
        exito: false, 
        mensaje: 'Error interno al generar la venta' 
      };
    }
  }, [isMaterialTransportVehicle, isMachineryTransportVehicle]);

  const procesarReporteParaVenta = useCallback((reporte: Report) => {
    return convertirReporteAVenta(reporte);
  }, [convertirReporteAVenta]);

  return {
    convertirReporteAVenta,
    procesarReporteParaVenta
  };
};
