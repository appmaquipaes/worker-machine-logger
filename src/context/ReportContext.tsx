
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Report, ReportType, ReportContextType } from '@/types/report';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport debe ser utilizado dentro de un ReportProvider');
  }
  return context;
};

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const { user } = useAuth();

  // Load reports from Supabase
  const loadReports = async () => {
    if (!user) return;

    try {
      const { data: supabaseReports, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading reports:', error);
        return;
      }

      if (supabaseReports) {
        const formattedReports: Report[] = supabaseReports.map(report => ({
          id: report.id,
          machineId: report.machine_id || '',
          machineName: report.machine_name,
          userName: report.user_name,
          userId: report.user_id,
          reportType: report.report_type as ReportType,
          description: report.description || '',
          value: Number(report.value) || 0,
          createdAt: new Date(report.created_at),
          reportDate: new Date(report.report_date),
          origin: report.origin,
          destination: report.destination,
          cantidadM3: Number(report.cantidad_m3) || undefined,
          trips: report.trips || undefined,
          hours: Number(report.hours) || undefined,
          workSite: report.work_site,
          proveedor: report.proveedor,
          kilometraje: Number(report.kilometraje) || undefined
        }));

        setReports(formattedReports);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  useEffect(() => {
    loadReports();
  }, [user]);

  const addReport = async (
    machineId: string,
    machineName: string,
    reportType: ReportType,
    description: string,
    reportDate: Date,
    trips?: number,
    hours?: number,
    value?: number,
    workSite?: string,
    origin?: string,
    destination?: string,
    cantidadM3?: number,
    proveedor?: string,
    kilometraje?: number
  ) => {
    if (!user) {
      toast.error('Debes estar autenticado para crear reportes');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          machine_id: machineId,
          machine_name: machineName,
          user_name: user.name,
          report_type: reportType,
          description,
          report_date: reportDate.toISOString().split('T')[0],
          trips,
          hours,
          value: value || 0,
          work_site: workSite,
          origin,
          destination,
          cantidad_m3: cantidadM3,
          proveedor,
          kilometraje
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding report:', error);
        toast.error('Error al crear el reporte');
        return;
      }

      const newReport: Report = {
        id: data.id,
        machineId,
        machineName,
        userName: user.name,
        userId: user.id,
        reportType,
        description,
        value: value || 0,
        createdAt: new Date(),
        reportDate,
        origin,
        destination,
        cantidadM3,
        trips,
        hours,
        workSite,
        proveedor,
        kilometraje
      };

      setReports(prev => [newReport, ...prev]);
      toast.success('Reporte creado exitosamente');
    } catch (error) {
      console.error('Error adding report:', error);
      toast.error('Error al crear el reporte');
    }
  };

  const updateReport = async (id: string, updatedReport: Partial<Report>) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          machine_name: updatedReport.machineName,
          report_type: updatedReport.reportType,
          description: updatedReport.description,
          value: updatedReport.value,
          report_date: updatedReport.reportDate?.toISOString().split('T')[0],
          trips: updatedReport.trips,
          hours: updatedReport.hours,
          work_site: updatedReport.workSite,
          origin: updatedReport.origin,
          destination: updatedReport.destination,
          cantidad_m3: updatedReport.cantidadM3,
          proveedor: updatedReport.proveedor,
          kilometraje: updatedReport.kilometraje
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating report:', error);
        toast.error('Error al actualizar el reporte');
        return;
      }

      setReports(prev => prev.map(report =>
        report.id === id ? { ...report, ...updatedReport } : report
      ));
      
      toast.success('Reporte actualizado exitosamente');
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Error al actualizar el reporte');
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting report:', error);
        toast.error('Error al eliminar el reporte');
        return;
      }

      setReports(prev => prev.filter(report => report.id !== id));
      toast.success('Reporte eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Error al eliminar el reporte');
    }
  };

  const getReportsByMachine = (machineId: string) => {
    return reports.filter(report => report.machineId === machineId);
  };

  const getTotalByType = (type: string) => {
    return reports
      .filter(report => report.reportType === type)
      .reduce((total, report) => total + report.value, 0);
  };

  const getFilteredReports = (filters: any) => {
    return reports.filter(report => {
      if (filters.machineId && report.machineId !== filters.machineId) return false;
      if (filters.reportType && report.reportType !== filters.reportType) return false;
      if (filters.startDate && report.reportDate < filters.startDate) return false;
      if (filters.endDate && report.reportDate > filters.endDate) return false;
      return true;
    });
  };

  const value: ReportContextType = {
    reports,
    addReport,
    updateReport,
    deleteReport,
    getReportsByMachine,
    getTotalByType,
    getFilteredReports
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};
