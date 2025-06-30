
import { useState, useEffect } from 'react';
import { useUnifiedDataManager } from './useUnifiedDataManager';
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types/report';

export const useEnhancedReportManager = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { readData, writeData } = useUnifiedDataManager();

  // Cargar reportes usando el sistema unificado
  const loadReports = async () => {
    setIsLoading(true);
    
    const supabaseQuery = async () => {
      return await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
    };

    try {
      const supabaseReports = await readData<any>(
        'reports',
        supabaseQuery,
        'reports'
      );

      const formattedReports: Report[] = supabaseReports.map(report => ({
        id: report.id,
        machineId: report.machine_id,
        machineName: report.machine_name,
        userName: report.user_name,
        userId: report.user_id,
        reportType: report.report_type,
        description: report.description || '',
        value: report.value || 0,
        createdAt: new Date(report.created_at),
        reportDate: new Date(report.report_date),
        origin: report.origin,
        destination: report.destination,
        cantidadM3: report.cantidad_m3,
        trips: report.trips,
        hours: report.hours,
        workSite: report.work_site,
        proveedor: report.proveedor,
        kilometraje: report.kilometraje
      }));

      setReports(formattedReports);
      console.log(`✅ Reportes cargados: ${formattedReports.length}`);
      
    } catch (error) {
      console.error('❌ Error cargando reportes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar reporte usando el sistema unificado
  const addReport = async (reportData: Omit<Report, 'id'>) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('reports')
        .insert({
          machine_id: reportData.machineId,
          machine_name: reportData.machineName,
          user_name: reportData.userName,
          user_id: reportData.userId,
          report_type: reportData.reportType,
          description: reportData.description,
          value: reportData.value,
          report_date: reportData.reportDate.toISOString().split('T')[0],
          origin: reportData.origin,
          destination: reportData.destination,
          cantidad_m3: reportData.cantidadM3,
          trips: reportData.trips,
          hours: reportData.hours,
          work_site: reportData.workSite,
          proveedor: reportData.proveedor,
          kilometraje: reportData.kilometraje
        });
    };

    const localStorageUpdater = () => {
      const reportWithId = { ...reportData, id: Date.now().toString() };
      const updatedReports = [reportWithId, ...reports];
      setReports(updatedReports);
      localStorage.setItem('reports', JSON.stringify(updatedReports));
    };

    const success = await writeData(
      'reports',
      reportData,
      'create',
      supabaseOperation,
      'reports',
      localStorageUpdater
    );

    if (success) {
      await loadReports(); // Recargar para obtener el ID correcto de Supabase
    }

    return success;
  };

  // Actualizar reporte usando el sistema unificado
  const updateReport = async (id: string, updatedReport: Partial<Report>) => {
    const supabaseOperation = async () => {
      const updateData: any = {};
      
      if (updatedReport.machineId) updateData.machine_id = updatedReport.machineId;
      if (updatedReport.machineName) updateData.machine_name = updatedReport.machineName;
      if (updatedReport.userName) updateData.user_name = updatedReport.userName;
      if (updatedReport.userId) updateData.user_id = updatedReport.userId;
      if (updatedReport.reportType) updateData.report_type = updatedReport.reportType;
      if (updatedReport.description !== undefined) updateData.description = updatedReport.description;
      if (updatedReport.value !== undefined) updateData.value = updatedReport.value;
      if (updatedReport.reportDate) updateData.report_date = updatedReport.reportDate.toISOString().split('T')[0];
      if (updatedReport.origin !== undefined) updateData.origin = updatedReport.origin;
      if (updatedReport.destination !== undefined) updateData.destination = updatedReport.destination;
      if (updatedReport.cantidadM3 !== undefined) updateData.cantidad_m3 = updatedReport.cantidadM3;
      if (updatedReport.trips !== undefined) updateData.trips = updatedReport.trips;
      if (updatedReport.hours !== undefined) updateData.hours = updatedReport.hours;
      if (updatedReport.workSite !== undefined) updateData.work_site = updatedReport.workSite;
      if (updatedReport.proveedor !== undefined) updateData.proveedor = updatedReport.proveedor;
      if (updatedReport.kilometraje !== undefined) updateData.kilometraje = updatedReport.kilometraje;

      return await supabase
        .from('reports')
        .update(updateData)
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedReports = reports.map(report =>
        report.id === id ? { ...report, ...updatedReport } : report
      );
      setReports(updatedReports);
      localStorage.setItem('reports', JSON.stringify(updatedReports));
    };

    return await writeData(
      'reports',
      { id, ...updatedReport },
      'update',
      supabaseOperation,
      'reports',
      localStorageUpdater
    );
  };

  // Eliminar reporte usando el sistema unificado
  const deleteReport = async (id: string) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('reports')
        .delete()
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedReports = reports.filter(report => report.id !== id);
      setReports(updatedReports);
      localStorage.setItem('reports', JSON.stringify(updatedReports));
    };

    return await writeData(
      'reports',
      { id },
      'delete',
      supabaseOperation,
      'reports',
      localStorageUpdater
    );
  };

  return {
    reports,
    isLoading,
    loadReports,
    addReport,
    updateReport,
    deleteReport
  };
};
