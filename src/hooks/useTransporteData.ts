
import { useState, useEffect } from 'react';
import { useReportPersistence } from '@/hooks/useReportPersistence';
import { loadVentas } from '@/models/Ventas';

interface TransporteStats {
  viajesDelMes: number;
  crecimientoViajes: number;
  ingresosDelMes: number;
  crecimientoIngresos: number;
  gastoCombustible: number;
  eficienciaCombustible: number;
  rutasActivas: number;
  rutaMasRentable: string;
  viajesPorVehiculo: Array<{
    nombre: string;
    viajes: number;
    ingresos: number;
  }>;
  rutasMasUtilizadas: Array<{
    origen: string;
    destino: string;
    viajes: number;
    distancia: number;
  }>;
}

export const useTransporteData = () => {
  const [stats, setStats] = useState<TransporteStats>({
    viajesDelMes: 0,
    crecimientoViajes: 0,
    ingresosDelMes: 0,
    crecimientoIngresos: 0,
    gastoCombustible: 0,
    eficienciaCombustible: 0,
    rutasActivas: 0,
    rutaMasRentable: '',
    viajesPorVehiculo: [],
    rutasMasUtilizadas: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { reports } = useReportPersistence();

  useEffect(() => {
    const calcularStats = () => {
      const ventas = loadVentas();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Filtrar reportes de transporte del mes actual
      const reportesTransporte = reports.filter(report => {
        const reportDate = new Date(report.reportDate);
        const isTransporte = ['Volqueta', 'Camión'].some(tipo => 
          report.machineName.toLowerCase().includes(tipo.toLowerCase())
        );
        const isCurrentMonth = reportDate.getMonth() === currentMonth && 
                              reportDate.getFullYear() === currentYear;
        return isTransporte && isCurrentMonth && report.reportType === 'Viajes';
      });

      // Filtrar ventas de transporte del mes actual
      const ventasTransporte = ventas.filter(venta => {
        const ventaDate = new Date(venta.fecha);
        const isCurrentMonth = ventaDate.getMonth() === currentMonth && 
                              ventaDate.getFullYear() === currentYear;
        const isTransporte = ['Solo transporte', 'Material + transporte'].includes(venta.tipo_venta);
        return isTransporte && isCurrentMonth;
      });

      // Calcular estadísticas
      const viajesDelMes = reportesTransporte.reduce((total, report) => total + (report.trips || 0), 0);
      const ingresosDelMes = ventasTransporte.reduce((total, venta) => total + venta.total_venta, 0);
      
      // Gastos de combustible del mes
      const reportesCombustible = reports.filter(report => {
        const reportDate = new Date(report.reportDate);
        const isTransporte = ['Volqueta', 'Camión'].some(tipo => 
          report.machineName.toLowerCase().includes(tipo.toLowerCase())
        );
        const isCurrentMonth = reportDate.getMonth() === currentMonth && 
                              reportDate.getFullYear() === currentYear;
        return isTransporte && isCurrentMonth && report.reportType === 'Combustible';
      });

      const gastoCombustible = reportesCombustible.reduce((total, report) => total + (report.value || 0), 0);
      const totalKilometraje = reportesCombustible.reduce((total, report) => total + (report.kilometraje || 0), 0);
      const eficienciaCombustible = totalKilometraje > 0 ? Math.round(totalKilometraje / (gastoCombustible / 12000)) : 0; // Asumiendo 12000 pesos por galón

      // Viajes por vehículo
      const viajesPorVehiculo = reportesTransporte.reduce((acc, report) => {
        const existing = acc.find(v => v.nombre === report.machineName);
        if (existing) {
          existing.viajes += report.trips || 0;
        } else {
          acc.push({
            nombre: report.machineName,
            viajes: report.trips || 0,
            ingresos: 0
          });
        }
        return acc;
      }, [] as Array<{nombre: string; viajes: number; ingresos: number}>);

      // Rutas más utilizadas
      const rutasMasUtilizadas = reportesTransporte.reduce((acc, report) => {
        if (report.origin && report.destination) {
          const key = `${report.origin}-${report.destination}`;
          const existing = acc.find(r => `${r.origen}-${r.destino}` === key);
          if (existing) {
            existing.viajes += report.trips || 0;
          } else {
            acc.push({
              origen: report.origin,
              destino: report.destination,
              viajes: report.trips || 0,
              distancia: 50 // Placeholder, se actualizará con gestión de rutas
            });
          }
        }
        return acc;
      }, [] as Array<{origen: string; destino: string; viajes: number; distancia: number}>);

      setStats({
        viajesDelMes,
        crecimientoViajes: 15, // Placeholder
        ingresosDelMes,
        crecimientoIngresos: 12, // Placeholder
        gastoCombustible,
        eficienciaCombustible,
        rutasActivas: rutasMasUtilizadas.length,
        rutaMasRentable: rutasMasUtilizadas.length > 0 ? rutasMasUtilizadas[0].origen : 'N/A',
        viajesPorVehiculo: viajesPorVehiculo.slice(0, 5),
        rutasMasUtilizadas: rutasMasUtilizadas.slice(0, 5)
      });

      setIsLoading(false);
    };

    calcularStats();
  }, [reports]);

  return {
    stats,
    isLoading
  };
};
