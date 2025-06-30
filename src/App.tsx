
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "./context/AuthContext"
import { DataSourceProvider } from "./context/DataSourceContext"
import { MachineProvider } from "./context/MachineContext"
import { EnhancedReportProvider } from "./context/EnhancedReportContext"
import { ClientFincaProvider } from "./context/EnhancedClientFincaContext"
import { EnhancedVentasProvider } from "./context/EnhancedVentasContext"
import { InventoryMaterialsProvider } from "./context/EnhancedInventoryMaterialsContext"
import Index from "./pages/Index"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import Dashboard from "./pages/Dashboard"
import MachineSelection from "./pages/MachineSelection"
import ReportForm from "./pages/ReportForm"
import Reports from "./pages/Reports"
import MachineManagement from "./pages/MachineManagement"
import UserManagement from "./pages/UserManagement"
import AdminPanel from "./pages/AdminPanel"
import ClientesPage from "./pages/ClientesPage"
import InventarioPage from "./pages/InventarioPage"
import ComprasPage from "./pages/ComprasPage"
import VentasPage from "./pages/VentasPage"
import VentasPageFixed from "./pages/VentasPageFixed"
import VentasMaterialPage from "./pages/VentasMaterialPage"
import ComprasMaterialPage from "./pages/ComprasMaterialPage"
import ProveedoresPage from "./pages/ProveedoresPage"
import TarifasClientePage from "./pages/TarifasClientePage"
import InformesPage from "./pages/InformesPage"
import ControlCombustiblePage from "./pages/ControlCombustiblePage"
import ControlTransportePage from "./pages/ControlTransportePage"
import ServiciosTransportePage from "./pages/ServiciosTransportePage"
import VolquetaManagement from "./pages/VolquetaManagement"
import NotFound from "./pages/NotFound"
import "./App.css"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <DataSourceProvider>
                <MachineProvider>
                  <EnhancedReportProvider>
                    <ClientFincaProvider>
                      <EnhancedVentasProvider>
                        <InventoryMaterialsProvider>
                          <div className="min-h-screen bg-background">
                            <Routes>
                              <Route path="/" element={<Index />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/forgot-password" element={<ForgotPassword />} />
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/machines" element={<MachineSelection />} />
                              <Route path="/machine-selection" element={<MachineSelection />} />
                              <Route path="/report-form" element={<ReportForm />} />
                              <Route path="/reports" element={<Reports />} />
                              <Route path="/machine-management" element={<MachineManagement />} />
                              <Route path="/user-management" element={<UserManagement />} />
                              <Route path="/admin-panel" element={<AdminPanel />} />
                              <Route path="/admin" element={<AdminPanel />} />
                              <Route path="/clientes" element={<ClientesPage />} />
                              <Route path="/inventario" element={<InventarioPage />} />
                              <Route path="/compras" element={<ComprasPage />} />
                              <Route path="/ventas" element={<VentasPage />} />
                              <Route path="/ventas-fixed" element={<VentasPageFixed />} />
                              <Route path="/ventas-material" element={<VentasMaterialPage />} />
                              <Route path="/compras-material" element={<ComprasMaterialPage />} />
                              <Route path="/proveedores" element={<ProveedoresPage />} />
                              <Route path="/tarifas-cliente" element={<TarifasClientePage />} />
                              <Route path="/informes" element={<InformesPage />} />
                              <Route path="/control-combustible" element={<ControlCombustiblePage />} />
                              <Route path="/control-transporte" element={<ControlTransportePage />} />
                              <Route path="/servicios-transporte" element={<ServiciosTransportePage />} />
                              <Route path="/volqueta-management" element={<VolquetaManagement />} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </div>
                          <Toaster />
                        </InventoryMaterialsProvider>
                      </EnhancedVentasProvider>
                    </ClientFincaProvider>
                  </EnhancedReportProvider>
                </MachineProvider>
              </DataSourceProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
