
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from '@/context/AuthContext';
import { MachineProvider } from '@/context/MachineContext';
import { ReportProvider } from '@/context/ReportContext';
import { SupabaseAuthProvider } from '@/context/SupabaseAuthProvider';
import Navbar from '@/components/Navbar';
import { MigrationNavbar } from '@/components/migration/MigrationNavbar';

// Páginas existentes
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import MachineSelection from '@/pages/MachineSelection';
import ReportForm from '@/pages/ReportForm';
import Reports from '@/pages/Reports';
import MachineManagement from '@/pages/MachineManagement';
import UserManagement from '@/pages/UserManagement';
import AdminPanel from '@/pages/AdminPanel';
import ClientesPage from '@/pages/ClientesPage';
import ProveedoresPage from '@/pages/ProveedoresPage';
import ComprasPage from '@/pages/ComprasPage';
import ComprasMaterialPage from '@/pages/ComprasMaterialPage';
import VentasPage from '@/pages/VentasPage';
import VentasMaterialPage from '@/pages/VentasMaterialPage';
import InventarioPage from '@/pages/InventarioPage';
import InformesPage from '@/pages/InformesPage';
import TarifasClientePage from '@/pages/TarifasClientePage';
import ServiciosTransportePage from '@/pages/ServiciosTransportePage';
import VolquetaManagement from '@/pages/VolquetaManagement';
import NotFound from '@/pages/NotFound';

// MIGRACIÓN: Página completamente independiente
import MigrationDashboard from '@/pages/MigrationDashboard';

const queryClient = new QueryClient();

function App() {
  console.log('🚀 APP: Inicializando aplicación');
  
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Routes>
            {/* 🔥 RUTA DE MIGRACIÓN - MÁXIMA PRIORIDAD - SIN RESTRICCIONES */}
            <Route 
              path="/migration" 
              element={
                <SupabaseAuthProvider>
                  <div className="min-h-screen bg-gray-50">
                    <div className="bg-green-500 text-white p-2 text-center font-bold text-sm">
                      ✅ MIGRACIÓN ACTIVA - Acceso completamente libre - Sin validaciones
                    </div>
                    <MigrationNavbar />
                    <MigrationDashboard />
                  </div>
                  <Toaster />
                </SupabaseAuthProvider>
              } 
            />
            
            {/* Todas las demás rutas con contextos completos */}
            <Route path="/*" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/machine-selection" element={<MachineSelection />} />
                          <Route path="/report" element={<ReportForm />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/machine-management" element={<MachineManagement />} />
                          <Route path="/user-management" element={<UserManagement />} />
                          <Route path="/admin" element={<AdminPanel />} />
                          <Route path="/clientes" element={<ClientesPage />} />
                          <Route path="/proveedores" element={<ProveedoresPage />} />
                          <Route path="/compras" element={<ComprasPage />} />
                          <Route path="/compras-material" element={<ComprasMaterialPage />} />
                          <Route path="/ventas" element={<VentasPage />} />
                          <Route path="/ventas-material" element={<VentasMaterialPage />} />
                          <Route path="/inventario" element={<InventarioPage />} />
                          <Route path="/informes" element={<InformesPage />} />
                          <Route path="/tarifas-cliente" element={<TarifasClientePage />} />
                          <Route path="/servicios-transporte" element={<ServiciosTransportePage />} />
                          <Route path="/volqueta-management" element={<VolquetaManagement />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
