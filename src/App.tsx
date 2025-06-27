
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
  console.log('🚀 APP: Inicializando aplicación - Ruta actual:', window.location.pathname);
  
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Routes>
            {/* 🔥 RUTA DE MIGRACIÓN - MÁXIMA PRIORIDAD ABSOLUTA */}
            <Route 
              path="/migration" 
              element={
                <div className="min-h-screen bg-gray-50">
                  <div className="bg-green-500 text-white p-4 text-center font-bold text-lg">
                    ✅ PANEL DE MIGRACIÓN - ACCESO TOTALMENTE LIBRE
                  </div>
                  <div className="bg-blue-500 text-white p-2 text-center font-semibold">
                    🎯 Ruta: /migration - Estado: ACTIVO - Sin restricciones de autenticación
                  </div>
                  <SupabaseAuthProvider>
                    <MigrationNavbar />
                    <MigrationDashboard />
                  </SupabaseAuthProvider>
                  <Toaster />
                </div>
              } 
            />
            
            {/* Todas las demás rutas normales */}
            <Route path="/" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <Index />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/login" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <Login />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/register" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <Register />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/forgot-password" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <ForgotPassword />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            {/* Resto de rutas con autenticación */}
            <Route path="/dashboard" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <Dashboard />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/machine-selection" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <MachineSelection />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/report" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <ReportForm />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/reports" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <Reports />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/machine-management" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <MachineManagement />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/user-management" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <UserManagement />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/admin" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <AdminPanel />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/clientes" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <ClientesPage />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/proveedores" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <ProveedoresPage />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/compras" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <ComprasPage />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/compras-material" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <ComprasMaterialPage />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/ventas" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <VentasPage />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/ventas-material" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <VentasMaterialPage />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/inventario" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <InventarioPage />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/informes" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <InformesPage />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/tarifas-cliente" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <TarifasClientePage />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/servicios-transporte" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <ServiciosTransportePage />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="/volqueta-management" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <VolquetaManagement />
                      </div>
                      <Toaster />
                    </ReportProvider>
                  </MachineProvider>
                </AuthProvider>
              </SupabaseAuthProvider>
            } />
            
            <Route path="*" element={
              <SupabaseAuthProvider>
                <AuthProvider>
                  <MachineProvider>
                    <ReportProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <NotFound />
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
