
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Venta, loadVentas } from '@/models/Ventas';
import { loadClientes, getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
import { migrateTarifas } from '@/models/Tarifas';
import RegistrarVentaDialog from '@/components/RegistrarVentaDialog';
import VentasPageHeader from '@/components/ventas/VentasPageHeader';
import VentasFilters from '@/components/ventas/VentasFilters';
import VentasStats from '@/components/ventas/VentasStats';
import VentasTable from '@/components/ventas/VentasTable';
import * as XLSX from 'xlsx';

const VentasPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasFiltradas, setVentasFiltradas] = useState<Venta[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filtros
  const [filtroCliente, setFiltroCliente] = useState('all');
  const [filtroFinca, setFiltroFinca] = useState('all');
  const [filtroTipoVenta, setFiltroTipoVenta] = useState('all');
  const [filtroFormaPago, setFiltroFormaPago] = useState('all');
  const [filtroTipoRegistro, setFiltroTipoRegistro] = useState('all');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  
  const [clientes, setClientes] = useState<any[]>([]);
  const [fincas, setFincas] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    migrateTarifas();
    loadData();
  }, []);

  const loadData = () => {
    const ventasData = loadVentas();
    const clientesData = loadClientes();
    
    setVentas(ventasData);
    setVentasFiltradas(ventasData);
    setClientes(clientesData);
  };

  // Cargar fincas cuando se selecciona un cliente
  useEffect(() => {
    if (filtroCliente && filtroCliente !== 'all') {
      const cliente = getClienteByName(filtroCliente);
      if (cliente) {
        const fincasData = getFincasByCliente(cliente.id);
        setFincas(fincasData);
      } else {
        setFincas([]);
      }
      setFiltroFinca('all');
    } else {
      setFincas([]);
      setFiltroFinca('all');
    }
  }, [filtroCliente]);

  // Aplicar filtros
  useEffect(() => {
    let ventasFiltered = [...ventas];

    if (filtroCliente && filtroCliente !== 'all') {
      ventasFiltered = ventasFiltered.filter(v => v.cliente === filtroCliente);
    }

    if (filtroFinca && filtroFinca !== 'all') {
      ventasFiltered = ventasFiltered.filter(v => {
        const fincaFromDestino = v.destino_material ? v.destino_material.split(' - ')[1] : '';
        return fincaFromDestino === filtroFinca;
      });
    }

    if (filtroTipoVenta && filtroTipoVenta !== 'all') {
      ventasFiltered = ventasFiltered.filter(v => v.tipo_venta === filtroTipoVenta);
    }

    if (filtroFormaPago && filtroFormaPago !== 'all') {
      ventasFiltered = ventasFiltered.filter(v => v.forma_pago === filtroFormaPago);
    }

    if (filtroTipoRegistro && filtroTipoRegistro !== 'all') {
      const esAutomatica = (venta: Venta) => venta.observaciones?.includes('Venta automática') || false;
      if (filtroTipoRegistro === 'automatica') {
        ventasFiltered = ventasFiltered.filter(esAutomatica);
      } else if (filtroTipoRegistro === 'manual') {
        ventasFiltered = ventasFiltered.filter(v => !esAutomatica(v));
      }
    }

    if (filtroFechaInicio) {
      ventasFiltered = ventasFiltered.filter(v => 
        new Date(v.fecha) >= new Date(filtroFechaInicio)
      );
    }

    if (filtroFechaFin) {
      ventasFiltered = ventasFiltered.filter(v => 
        new Date(v.fecha) <= new Date(filtroFechaFin)
      );
    }

    setVentasFiltradas(ventasFiltered);
  }, [ventas, filtroCliente, filtroFinca, filtroTipoVenta, filtroFormaPago, filtroTipoRegistro, filtroFechaInicio, filtroFechaFin]);

  const limpiarFiltros = () => {
    setFiltroCliente('all');
    setFiltroFinca('all');
    setFiltroTipoVenta('all');
    setFiltroFormaPago('all');
    setFiltroTipoRegistro('all');
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
  };

  const calcularTotalVentas = () => {
    return ventasFiltradas.reduce((total, venta) => total + venta.total_venta, 0);
  };

  const exportToExcel = () => {
    if (ventasFiltradas.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const exportData = ventasFiltradas.map(venta => ({
      'Fecha': new Date(venta.fecha).toLocaleDateString(),
      'Cliente': venta.cliente,
      'Finca': venta.destino_material ? venta.destino_material.split(' - ')[1] || '' : '',
      'Tipo de Venta': venta.tipo_venta,
      'Ciudad Entrega': venta.ciudad_entrega,
      'Origen Material': venta.origen_material,
      'Forma de Pago': venta.forma_pago,
      'Total Venta': venta.total_venta,
      'Observaciones': venta.observaciones || '',
      'Tipo Registro': venta.observaciones?.includes('Venta automática') ? 'Automática' : 'Manual'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    
    const fileName = `ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Reporte exportado correctamente');
  };

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-2 sm:px-4">
      <VentasPageHeader onNewVentaClick={() => setDialogOpen(true)} />
      
      <VentasFilters
        filtroCliente={filtroCliente}
        setFiltroCliente={setFiltroCliente}
        filtroFinca={filtroFinca}
        setFiltroFinca={setFiltroFinca}
        filtroTipoVenta={filtroTipoVenta}
        setFiltroTipoVenta={setFiltroTipoVenta}
        filtroFormaPago={filtroFormaPago}
        setFiltroFormaPago={setFiltroFormaPago}
        filtroTipoRegistro={filtroTipoRegistro}
        setFiltroTipoRegistro={setFiltroTipoRegistro}
        filtroFechaInicio={filtroFechaInicio}
        setFiltroFechaInicio={setFiltroFechaInicio}
        filtroFechaFin={filtroFechaFin}
        setFiltroFechaFin={setFiltroFechaFin}
        clientes={clientes}
        fincas={fincas}
        onLimpiarFiltros={limpiarFiltros}
        onExportToExcel={exportToExcel}
        totalFiltrado={calcularTotalVentas()}
      />

      <VentasStats 
        ventasFiltradas={ventasFiltradas} 
        totalVentas={calcularTotalVentas()} 
      />

      <VentasTable ventasFiltradas={ventasFiltradas} />

      <RegistrarVentaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onVentaCreated={loadData}
      />
    </div>
  );
};

export default VentasPage;
