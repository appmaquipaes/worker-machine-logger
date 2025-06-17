
import React, { useState } from 'react';
import { useVentasData } from '@/hooks/useVentasData';
import { useVentasFilters } from '@/hooks/useVentasFilters';
import RegistrarVentaDialog from '@/components/RegistrarVentaDialog';
import VentasPageHeader from '@/components/ventas/VentasPageHeader';
import VentasFilters from '@/components/ventas/VentasFilters';
import VentasStats from '@/components/ventas/VentasStats';
import VentasTable from '@/components/ventas/VentasTable';

const VentasPageContainer = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { ventas, loadData, exportToExcel } = useVentasData();
  
  const {
    filtroCliente,
    setFiltroCliente,
    filtroFinca,
    setFiltroFinca,
    filtroTipoVenta,
    setFiltroTipoVenta,
    filtroFormaPago,
    setFiltroFormaPago,
    filtroTipoRegistro,
    setFiltroTipoRegistro,
    filtroFechaInicio,
    setFiltroFechaInicio,
    filtroFechaFin,
    setFiltroFechaFin,
    clientes,
    fincas,
    ventasFiltradas,
    limpiarFiltros,
    calcularTotalVentas
  } = useVentasFilters(ventas);

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
        onExportToExcel={() => exportToExcel(ventasFiltradas)}
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

export default VentasPageContainer;
