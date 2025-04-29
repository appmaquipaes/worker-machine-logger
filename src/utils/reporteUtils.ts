
import { CompraMaterial, loadComprasMaterial } from '../models/ComprasMaterial';
import { InventarioAcopio, loadInventarioAcopio } from '../models/InventarioAcopio';
import { VentaMaterial, loadVentasMaterial } from '../models/VentasMaterial';
import { Report } from '../context/ReportContext';

// Función para obtener compras totales por material
export const getTotalComprasPorMaterial = () => {
  const compras = loadComprasMaterial();
  
  const totalPorMaterial: Record<string, { 
    cantidad: number, 
    costoTotal: number, 
    costoUnitarioPromedio: number 
  }> = {};
  
  compras.forEach(compra => {
    if (!totalPorMaterial[compra.tipo_material]) {
      totalPorMaterial[compra.tipo_material] = { 
        cantidad: 0, 
        costoTotal: 0, 
        costoUnitarioPromedio: 0 
      };
    }
    
    totalPorMaterial[compra.tipo_material].cantidad += compra.cantidad_m3;
    totalPorMaterial[compra.tipo_material].costoTotal += compra.costo_total;
  });
  
  // Calcular costo unitario promedio
  Object.keys(totalPorMaterial).forEach(material => {
    const data = totalPorMaterial[material];
    data.costoUnitarioPromedio = data.costoTotal / data.cantidad;
  });
  
  return totalPorMaterial;
};

// Función para obtener stock disponible
export const getStockDisponible = () => {
  return loadInventarioAcopio();
};

// Función para calcular ventas totales y márgenes
export const getVentasTotales = () => {
  const ventas = loadVentasMaterial();
  
  const totalVentas = {
    cantidadTotal: 0,
    ventaTotal: 0,
    costoTotal: 0,
    margenTotal: 0,
    porMaterial: {} as Record<string, { 
      cantidad: number, 
      venta: number, 
      costo: number, 
      margen: number 
    }>
  };
  
  ventas.forEach(venta => {
    // Totales generales
    totalVentas.cantidadTotal += venta.cantidad_m3;
    totalVentas.ventaTotal += venta.total_venta;
    
    const costoMaterial = venta.cantidad_m3 * venta.costo_base_m3;
    totalVentas.costoTotal += costoMaterial;
    totalVentas.margenTotal += venta.total_venta - costoMaterial;
    
    // Totales por material
    if (!totalVentas.porMaterial[venta.tipo_material]) {
      totalVentas.porMaterial[venta.tipo_material] = {
        cantidad: 0,
        venta: 0,
        costo: 0,
        margen: 0
      };
    }
    
    totalVentas.porMaterial[venta.tipo_material].cantidad += venta.cantidad_m3;
    totalVentas.porMaterial[venta.tipo_material].venta += venta.total_venta;
    totalVentas.porMaterial[venta.tipo_material].costo += costoMaterial;
    totalVentas.porMaterial[venta.tipo_material].margen += venta.total_venta - costoMaterial;
  });
  
  return totalVentas;
};

// Función para calcular ingresos por transporte
export const getIngresosPorTransporte = () => {
  // Usar los reportes de tipo 'Viajes'
  const reports = JSON.parse(localStorage.getItem('reports') || '[]') as Report[];
  const viajesReports = reports.filter(report => report.reportType === 'Viajes');
  
  let totalIngresos = 0;
  const porMaquina: Record<string, number> = {};
  
  viajesReports.forEach(report => {
    // Si el reporte tiene información de valor
    if (report.value) {
      totalIngresos += report.value;
      
      if (!porMaquina[report.machineName]) {
        porMaquina[report.machineName] = 0;
      }
      porMaquina[report.machineName] += report.value;
    }
  });
  
  return { totalIngresos, porMaquina };
};
