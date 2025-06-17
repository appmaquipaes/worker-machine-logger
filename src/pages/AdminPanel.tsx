
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, Settings, Users, Truck, Store, FileText, AlertTriangle, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { loadUsers } from '@/models/Usuarios';
import { loadClientes } from '@/models/Clientes';
import { loadMaquinas } from '@/models/Maquinas';
import { loadProveedores } from '@/models/Proveedores';
import { loadInventarioAcopio } from '@/models/InventarioAcopio';
import { loadMateriales } from '@/models/Materiales';
import UserManagementDialog from '@/components/admin/UserManagementDialog';
import ClientManagementDialog from '@/components/admin/ClientManagementDialog';
import MachineManagementDialog from '@/components/admin/MachineManagementDialog';
import ProviderManagementDialog from '@/components/admin/ProviderManagementDialog';
import InventoryManagementDialog from '@/components/admin/InventoryManagementDialog';
import MaterialManagementDialog from '@/components/admin/MaterialManagementDialog';
import ReconciliationDashboard from '@/components/reconciliation/ReconciliationDashboard';
import AdminStatsCard from '@/components/admin/AdminStatsCard';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [machines, setMachines] = useState([]);
  const [providers, setProviders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [materials, setMaterials] = useState([]);

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

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const usersData = await loadUsers();
      setUsers(usersData);

      const clientsData = await loadClientes();
      setClients(clientsData);

      const machinesData = await loadMaquinas();
      setMachines(machinesData);

      const providersData = await loadProveedores();
      setProviders(providersData);

      const inventoryData = await loadInventarioAcopio();
      setInventory(inventoryData);

      const materialsData = await loadMateriales();
      setMaterials(materialsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar datos. Por favor, intenta nuevamente.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'Administrador') return null;

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

        {/* Nuevo: Sección de Reconciliación */}
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

        {/* Grid de estadísticas mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminStatsCard
            title="Usuarios"
            count={users.length}
            description="Gestiona los usuarios del sistema"
            icon={Users}
            buttonText="Administrar Usuarios"
            onButtonClick={() => setIsUserDialogOpen(true)}
            trend={{ value: 12, isPositive: true }}
          />

          <AdminStatsCard
            title="Clientes"
            count={clients.length}
            description="Gestiona los clientes de la empresa"
            icon={Truck}
            buttonText="Administrar Clientes"
            onButtonClick={() => setIsClientDialogOpen(true)}
            trend={{ value: 8, isPositive: true }}
          />

          <AdminStatsCard
            title="Máquinas"
            count={machines.length}
            description="Gestiona las máquinas de la empresa"
            icon={Settings}
            buttonText="Administrar Máquinas"
            onButtonClick={() => setIsMachineDialogOpen(true)}
            trend={{ value: 3, isPositive: false }}
          />

          <AdminStatsCard
            title="Proveedores"
            count={providers.length}
            description="Gestiona los proveedores de la empresa"
            icon={Store}
            buttonText="Administrar Proveedores"
            onButtonClick={() => setIsProviderDialogOpen(true)}
          />

          <AdminStatsCard
            title="Inventario Acopio"
            count={inventory.length}
            description="Gestiona el inventario de acopio"
            icon={FileText}
            buttonText="Administrar Inventario"
            onButtonClick={() => setIsInventoryDialogOpen(true)}
            trend={{ value: 15, isPositive: true }}
          />

          <AdminStatsCard
            title="Materiales Volquetas"
            count={materials.length}
            description="Gestiona los materiales de las volquetas"
            icon={FileText}
            buttonText="Administrar Materiales"
            onButtonClick={() => setIsMaterialDialogOpen(true)}
          />
        </div>

        {/* Diálogos */}
        <UserManagementDialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen} onUsersUpdated={loadData} />
        <ClientManagementDialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen} onClientsUpdated={loadData} />
        <MachineManagementDialog open={isMachineDialogOpen} onOpenChange={setIsMachineDialogOpen} onMachinesUpdated={loadData} />
        <ProviderManagementDialog open={isProviderDialogOpen} onOpenChange={setIsProviderDialogOpen} onProvidersUpdated={loadData} />
        <InventoryManagementDialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen} onInventoryUpdated={loadData} />
        <MaterialManagementDialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen} onMaterialsUpdated={loadData} />
      </div>
    </div>
  );
};

export default AdminPanel;
