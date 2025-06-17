import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, Settings, Users, Truck, Store, FileText, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import ReconciliationDashboard from '@/components/reconciliation/ReconciliationDashboard';
import OptimizedAdminStatsCard from '@/components/admin/OptimizedAdminStatsCard';
import LazyAdminDialogs from '@/components/admin/LazyAdminDialogs';
import AdminSkeletonLoader from '@/components/admin/AdminSkeletonLoader';
import { useAdminData } from '@/hooks/useAdminData';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Usar el hook optimizado para datos
  const { 
    users, 
    clients, 
    machines, 
    providers, 
    inventory, 
    materials, 
    stats,
    loading, 
    error, 
    refreshData 
  } = useAdminData();

  // Estado de diálogos
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isMachineDialogOpen, setIsMachineDialogOpen] = useState(false);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);

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

  // Memoizar handlers de los botones
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleOpenUserDialog = useCallback(() => setIsUserDialogOpen(true), []);
  const handleOpenClientDialog = useCallback(() => setIsClientDialogOpen(true), []);
  const handleOpenMachineDialog = useCallback(() => setIsMachineDialogOpen(true), []);
  const handleOpenProviderDialog = useCallback(() => setIsProviderDialogOpen(true), []);
  const handleOpenInventoryDialog = useCallback(() => setIsInventoryDialogOpen(true), []);
  const handleOpenMaterialDialog = useCallback(() => setIsMaterialDialogOpen(true), []);

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
        {/* Header mejorado */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl mb-12 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          <div className="relative px-8 py-12">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Settings className="w-4 h-4 text-amber-300" />
                <span className="text-amber-100 text-sm font-medium">Panel de Control</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                  <span className="text-white font-medium">
                    {user.name} ({user.role})
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  <span className="font-medium">Cerrar Sesión</span>
                </Button>
              </div>
            </div>

            {/* Keep existing header content */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                <Settings className="w-10 h-10 text-amber-300" />
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Panel de <span className="text-amber-300">Administración</span>
                </h1>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Controla todos los aspectos del sistema desde un solo lugar. 
                  Gestiona usuarios, equipos, inventario y más con herramientas intuitivas.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white/90 text-sm">👥 Gestión de Personal</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white/90 text-sm">🚛 Control de Flota</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white/90 text-sm">📊 Análisis de Datos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Reconciliación */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Control de Consistencia de Datos
            </CardTitle>
            <CardDescription>
              Verifica la integridad entre reportes, inventario y ventas automáticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReconciliationDashboard />
          </CardContent>
        </Card>

        {/* Grid de estadísticas optimizado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OptimizedAdminStatsCard
            title="Usuarios"
            count={stats.totalUsers}
            description={`${stats.activeUsers} activos de ${stats.totalUsers} total`}
            icon={Users}
            buttonText="Administrar Usuarios"
            onButtonClick={handleOpenUserDialog}
            trend={{ value: 12, isPositive: true }}
            isLoading={loading}
          />

          <OptimizedAdminStatsCard
            title="Clientes"
            count={stats.totalClients}
            description="Gestiona los clientes de la empresa"
            icon={Truck}
            buttonText="Administrar Clientes"
            onButtonClick={handleOpenClientDialog}
            trend={{ value: 8, isPositive: true }}
            isLoading={loading}
          />

          <OptimizedAdminStatsCard
            title="Máquinas"
            count={stats.totalMachines}
            description={`${stats.activeMachines} activas de ${stats.totalMachines} total`}
            icon={Settings}
            buttonText="Administrar Máquinas"
            onButtonClick={handleOpenMachineDialog}
            trend={{ value: 3, isPositive: false }}
            isLoading={loading}
          />

          <OptimizedAdminStatsCard
            title="Proveedores"
            count={stats.totalProviders}
            description="Gestiona los proveedores de la empresa"
            icon={Store}
            buttonText="Administrar Proveedores"
            onButtonClick={handleOpenProviderDialog}
            isLoading={loading}
          />

          <OptimizedAdminStatsCard
            title="Inventario Acopio"
            count={stats.totalInventoryItems}
            description={`${stats.lowStockItems} con stock bajo`}
            icon={FileText}
            buttonText="Administrar Inventario"
            onButtonClick={handleOpenInventoryDialog}
            trend={{ value: 15, isPositive: true }}
            isLoading={loading}
          />

          <OptimizedAdminStatsCard
            title="Materiales Volquetas"
            count={stats.totalMaterials}
            description="Gestiona los materiales de las volquetas"
            icon={FileText}
            buttonText="Administrar Materiales"
            onButtonClick={handleOpenMaterialDialog}
            isLoading={loading}
          />
        </div>

        {/* Diálogos con lazy loading */}
        <LazyAdminDialogs
          isUserDialogOpen={isUserDialogOpen}
          isClientDialogOpen={isClientDialogOpen}
          isMachineDialogOpen={isMachineDialogOpen}
          isProviderDialogOpen={isProviderDialogOpen}
          isInventoryDialogOpen={isInventoryDialogOpen}
          isMaterialDialogOpen={isMaterialDialogOpen}
          setIsUserDialogOpen={setIsUserDialogOpen}
          setIsClientDialogOpen={setIsClientDialogOpen}
          setIsMachineDialogOpen={setIsMachineDialogOpen}
          setIsProviderDialogOpen={setIsProviderDialogOpen}
          setIsInventoryDialogOpen={setIsInventoryDialogOpen}
          setIsMaterialDialogOpen={setIsMaterialDialogOpen}
          onDataUpdated={refreshData}
        />
      </div>
    </div>
  );
};

export default AdminPanel;
