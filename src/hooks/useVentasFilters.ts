
import { useState, useEffect } from 'react';
import { Venta } from '@/models/Ventas';
import { loadClientes, getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';

export const useVentasFilters = (ventas: Venta[]) => {
  const [filtroCliente, setFiltroCliente] = useState('all');
  const [filtroFinca, setFiltroFinca] = useState('all');
  const [filtroTipoVenta, setFiltroTipoVenta] = useState('all');
  const [filtroFormaPago, setFiltroFormaPago] = useState('all');
  const [filtroTipoRegistro, setFiltroTipoRegistro] = useState('all');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  
  const [clientes, setClientes] = useState<any[]>([]);
  const [fincas, setFincas] = useState<any[]>([]);
  const [ventasFiltradas, setVentasFiltradas] = useState<Venta[]>(ventas);

  useEffect(() => {
    const clientesData = loadClientes();
    setClientes(clientesData);
  }, []);

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

  return {
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
  };
};
