import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, Settings, Users, Truck, Store, FileText, AlertTriangle } from 'lucide-react';
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
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona usuarios, clientes, máquinas y más</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              {user.name} ({user.role})
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Nuevo: Sección de Reconciliación */}
      <Card className="mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Gestiona los usuarios del sistema
            </p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => setIsUserDialogOpen(true)}>
              Administrar Usuarios
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Clientes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              Gestiona los clientes de la empresa
            </p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => setIsClientDialogOpen(true)}>
              Administrar Clientes
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Máquinas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{machines.length}</div>
            <p className="text-xs text-muted-foreground">
              Gestiona las máquinas de la empresa
            </p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => setIsMachineDialogOpen(true)}>
              Administrar Máquinas
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Store className="h-4 w-4" />
              Proveedores
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
            <p className="text-xs text-muted-foreground">
              Gestiona los proveedores de la empresa
            </p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => setIsProviderDialogOpen(true)}>
              Administrar Proveedores
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Inventario Acopio
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              Gestiona el inventario de acopio
            </p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => setIsInventoryDialogOpen(true)}>
              Administrar Inventario
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Materiales Volquetas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">
              Gestiona los materiales de las volquetas
            </p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => setIsMaterialDialogOpen(true)}>
              Administrar Materiales
            </Button>
          </CardContent>
        </Card>
      </div>

      <UserManagementDialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen} onUsersUpdated={loadData} />
      <ClientManagementDialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen} onClientsUpdated={loadData} />
      <MachineManagementDialog open={isMachineDialogOpen} onOpenChange={setIsMachineDialogOpen} onMachinesUpdated={loadData} />
      <ProviderManagementDialog open={isProviderDialogOpen} onOpenChange={setIsProviderDialogOpen} onProvidersUpdated={loadData} />
      <InventoryManagementDialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen} onInventoryUpdated={loadData} />
      <MaterialManagementDialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen} onMaterialsUpdated={loadData} />
    </div>
  );
};

export default AdminPanel;
