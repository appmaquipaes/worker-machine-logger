import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { MachineProvider } from '@/context/MachineContext';
import { ReportProvider } from '@/context/ReportContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import MachineSelection from '@/pages/MachineSelection';
import ReportForm from '@/pages/ReportForm';
import Reports from '@/pages/Reports';
import InformesPage from '@/pages/InformesPage';
import NotFound from '@/pages/NotFound';

// Admin Pages
import AdminPanel from '@/pages/AdminPanel';
import UserManagement from '@/pages/UserManagement';
import MachineManagement from '@/pages/MachineManagement';
import VolquetaManagement from '@/pages/VolquetaManagement';
import ProveedoresPage from '@/pages/ProveedoresPage';
import ClientesPage from '@/pages/ClientesPage';
import ComprasPage from '@/pages/ComprasPage';
import ComprasMaterialPage from '@/pages/ComprasMaterialPage';
import VentasPage from '@/pages/VentasPage';
import VentasMaterialPage from '@/pages/VentasMaterialPage';
import InventarioPage from '@/pages/InventarioPage';
import TarifasClientePage from '@/pages/TarifasClientePage';
import ServiciosTransportePage from '@/pages/ServiciosTransportePage';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <MachineProvider>
            <ReportProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/machines" element={<MachineSelection />} />
                    <Route path="/report-form" element={<ReportForm />} />
                    <Route path="/machines/:machineId/report" element={<ReportForm />} />
                    <Route path="/machines/:machineId/reports" element={<Reports />} />
                    <Route path="/informes" element={<InformesPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/machines" element={<MachineManagement />} />
                    <Route path="/admin/volquetas" element={<VolquetaManagement />} />
                    <Route path="/admin/proveedores" element={<ProveedoresPage />} />
                    <Route path="/admin/clientes" element={<ClientesPage />} />
                    <Route path="/admin/tarifas-cliente" element={<TarifasClientePage />} />
                    <Route path="/admin/servicios-transporte" element={<ServiciosTransportePage />} />
                    <Route path="/admin/compras" element={<ComprasPage />} />
                    <Route path="/admin/compras-material" element={<ComprasMaterialPage />} />
                    <Route path="/admin/ventas" element={<VentasPage />} />
                    <Route path="/admin/ventas-material" element={<VentasMaterialPage />} />
                    <Route path="/admin/inventario" element={<InventarioPage />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </div>
              </Router>
            </ReportProvider>
          </MachineProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
