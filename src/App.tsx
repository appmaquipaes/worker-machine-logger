
import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';
import { MachineProvider } from './context/MachineContext';
import { ThemeProvider } from '@/components/ui/theme-provider';

import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import MachineSelection from './pages/MachineSelection';
import MachineManagement from './pages/MachineManagement';
import UserManagement from './pages/UserManagement';
import VolquetaManagement from './pages/VolquetaManagement';
import ReportForm from './pages/ReportForm';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import InventarioPage from './pages/InventarioPage';
import ComprasMaterialPage from './pages/ComprasMaterialPage';
import VentasMaterialPage from './pages/VentasMaterialPage';
import ProveedoresPage from './pages/ProveedoresPage';
import ClientesPage from './pages/ClientesPage';

import { initialSetup } from './utils/initialSetup';
import { Toaster } from './components/ui/sonner';

const App: React.FC = () => {
  useEffect(() => {
    initialSetup();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="maquipaes-theme">
      <AuthProvider>
        <MachineProvider>
          <ReportProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/machines" element={<MachineSelection />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/machines" element={<MachineManagement />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/volquetas" element={<VolquetaManagement />} />
                <Route path="/admin/inventario" element={<InventarioPage />} />
                <Route path="/admin/compras-material" element={<ComprasMaterialPage />} />
                <Route path="/admin/ventas-material" element={<VentasMaterialPage />} />
                <Route path="/admin/proveedores" element={<ProveedoresPage />} />
                <Route path="/admin/clientes" element={<ClientesPage />} />
                <Route path="/report" element={<ReportForm />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </ReportProvider>
        </MachineProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
