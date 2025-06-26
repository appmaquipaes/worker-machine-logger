
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from '@/context/AuthContext';
import { MachineProvider } from '@/context/MachineContext';
import { ReportProvider } from '@/context/ReportContext';
import { SupabaseAuthProvider } from '@/context/SupabaseAuthProvider';
import Navbar from '@/components/Navbar';

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

// MIGRACIÓN: Acceso completamente libre
import MigrationDashboard from '@/pages/MigrationDashboard';

const queryClient = new QueryClient();

function App() {
  console.log('🚀 APP: Renderizando aplicación principal');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SupabaseAuthProvider>
          <AuthProvider>
            <MachineProvider>
              <ReportProvider>
                <Router>
                  <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* MIGRACIÓN: Ruta completamente libre - SIN guards de autenticación */}
                      <Route 
                        path="/migration" 
                        element={
                          <div>
                            <div className="bg-yellow-100 border border-yellow-300 p-2 text-center text-sm">
                              🔧 DEBUG: Ruta /migration ejecutándose directamente
                            </div>
                            <MigrationDashboard />
                          </div>
                        } 
                      />
                      
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
                </Router>
              </ReportProvider>
            </MachineProvider>
          </AuthProvider>
        </SupabaseAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
