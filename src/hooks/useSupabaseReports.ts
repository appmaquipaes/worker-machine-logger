
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SupabaseReport {
  id: string;
  user_id: string;
  machine_id: string;
  machine_name: string;
  user_name: string;
  report_type: string;
  description?: string;
  report_date: string;
  trips?: number;
  hours?: number;
  value?: number;
  work_site?: string;
  origin?: string;
  destination?: string;
  cantidad_m3?: number;
  proveedor?: string;
  kilometraje?: number;
  created_at: string;
  updated_at: string;
}

export const useSupabaseReports = () => {
  const [reports, setReports] = useState<SupabaseReport[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReports(data || []);
      console.log('Reportes cargados desde Supabase:', data?.length || 0);
    } catch (error: any) {
      console.error('Error loading reports:', error);
      toast.error('Error al cargar los reportes');
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (reportData: Omit<SupabaseReport, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();

      if (error) throw error;

      setReports(prev => [data, ...prev]);
      toast.success('Reporte agregado exitosamente');
      return data;
    } catch (error: any) {
      console.error('Error adding report:', error);
      toast.error('Error al agregar el reporte');
      return null;
    }
  };

  const updateReport = async (id: string, updates: Partial<SupabaseReport>) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setReports(prev => prev.map(report => 
        report.id === id ? data : report
      ));
      toast.success('Reporte actualizado exitosamente');
      return data;
    } catch (error: any) {
      console.error('Error updating report:', error);
      toast.error('Error al actualizar el reporte');
      return null;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReports(prev => prev.filter(report => report.id !== id));
      toast.success('Reporte eliminado exitosamente');
      return true;
    } catch (error: any) {
      console.error('Error deleting report:', error);
      toast.error('Error al eliminar el reporte');
      return false;
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return {
    reports,
    loading,
    loadReports,
    addReport,
    updateReport,
    deleteReport
  };
};
