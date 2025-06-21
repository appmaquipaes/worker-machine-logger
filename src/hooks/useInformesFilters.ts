
import { useState, useEffect } from 'react';
import { loadClientes, getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
import { loadProveedores } from '@/models/Proveedores';

export const useInformesFilters = () => {
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedReportType, setSelectedReportType] = useState<string>('all');
  const [selectedCliente, setSelectedCliente] = useState<string>('all');
  const [selectedFinca, setSelectedFinca] = useState<string>('all');
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [selectedProveedor, setSelectedProveedor] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [clientes, setClientes] = useState<any[]>([]);
  const [fincas, setFincas] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);

  useEffect(() => {
    const clientesData = loadClientes();
    setClientes(clientesData);
    
    const proveedoresData = loadProveedores();
    setProveedores(proveedoresData);
  }, []);

  useEffect(() => {
    if (selectedCliente && selectedCliente !== 'all') {
      const cliente = getClienteByName(selectedCliente);
      if (cliente) {
        const fincasData = getFincasByCliente(cliente.id);
        setFincas(fincasData);
      } else {
        setFincas([]);
      }
      setSelectedFinca('all');
    } else {
      setFincas([]);
      setSelectedFinca('all');
    }
  }, [selectedCliente]);

  const getFilters = () => {
    const filters: any = {};
    
    if (selectedMachine !== 'all') {
      filters.machineId = selectedMachine;
    }
    
    if (selectedReportType !== 'all') {
      filters.reportType = selectedReportType;
    }

    if (selectedCliente !== 'all') {
      filters.cliente = selectedCliente;
    }

    if (selectedFinca !== 'all') {
      filters.finca = selectedFinca;
    }

    if (selectedOperator !== 'all') {
      filters.userId = selectedOperator;
    }

    if (selectedProveedor !== 'all') {
      filters.proveedorId = selectedProveedor;
    }
    
    if (startDate) {
      filters.startDate = startDate;
    }
    
    if (endDate) {
      filters.endDate = endDate;
    }

    return filters;
  };

  return {
    selectedMachine,
    setSelectedMachine,
    selectedReportType,
    setSelectedReportType,
    selectedCliente,
    setSelectedCliente,
    selectedFinca,
    setSelectedFinca,
    selectedOperator,
    setSelectedOperator,
    selectedProveedor,
    setSelectedProveedor,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clientes,
    fincas,
    proveedores,
    getFilters
  };
};
