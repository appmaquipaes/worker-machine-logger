
import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAdminData } from '@/hooks/useAdminData';
import { useAdminDialogStates } from '@/hooks/useAdminDialogStates';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminReconciliationSection from '@/components/admin/AdminReconciliationSection';
import AdminStatsGrid from '@/components/admin/AdminStatsGrid';
import LazyAdminDialogs from '@/components/admin/LazyAdminDialogs';
import AdminSkeletonLoader from '@/components/admin/AdminSkeletonLoader';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Usar el hook optimizado para datos
  const { 
    stats,
    loading, 
    error, 
    refreshData 
  } = useAdminData();

  // Usar el hook para estados de diálogos
  const { dialogStates, dialogSetters, dialogHandlers } = useAdminDialogStates();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'Administrador') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Memoizar handler de logout
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  if (!user || user.role !== 'Administrador') return null;

  // Mostrar skeleton mientras carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto py-8 px-4">
          <AdminSkeletonLoader type="dashboard" count={6} />
        </div>
      </div>
    );
  }

  // Mostrar error si hay alguno
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto py-8 px-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refreshData} variant="outline">
                Reintentar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto py-8 px-4">
        <AdminHeader 
          userName={user.name}
          userRole={user.role}
          onLogout={handleLogout}
        />

        <AdminReconciliationSection />

        <AdminStatsGrid
          stats={stats}
          loading={loading}
          onOpenUserDialog={dialogHandlers.handleOpenUserDialog}
          onOpenClientDialog={dialogHandlers.handleOpenClientDialog}
          onOpenMachineDialog={dialogHandlers.handleOpenMachineDialog}
          onOpenProviderDialog={dialogHandlers.handleOpenProviderDialog}
          onOpenInventoryDialog={dialogHandlers.handleOpenInventoryDialog}
          onOpenMaterialDialog={dialogHandlers.handleOpenMaterialDialog}
        />

        <LazyAdminDialogs
          {...dialogStates}
          {...dialogSetters}
          onDataUpdated={refreshData}
        />
      </div>
    </div>
  );
};

export default AdminPanel;
