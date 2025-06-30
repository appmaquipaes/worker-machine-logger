
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { loadClientes, getClienteByName } from '@/models/Clientes';
import { getFincasByCliente, Finca } from '@/models/Fincas';

interface ClienteFincaSelectorProps {
  selectedCliente: string;
  selectedFinca: string;
  onClienteChange: (cliente: string) => void;
  onFincaChange: (finca: string) => void;
  onCiudadChange?: (ciudad: string) => void;
  autoSetDestination?: boolean;
}

const ClienteFincaSelector: React.FC<ClienteFincaSelectorProps> = ({
  selectedCliente,
  selectedFinca,
  onClienteChange,
  onFincaChange,
  onCiudadChange,
  autoSetDestination = false
}) => {
  const [clientes, setClientes] = useState<string[]>([]);
  const [fincas, setFincas] = useState<Finca[]>([]);

  useEffect(() => {
    const clientesData = loadClientes()
      .filter(c => c.activo !== false) // Incluir clientes que no tienen activo definido
      .map(c => c.nombre_cliente);
    console.log('👥 Clientes disponibles en selector:', clientesData);
    setClientes(clientesData);
  }, []);

  useEffect(() => {
    if (selectedCliente) {
      console.log('🔍 Buscando cliente en ClienteFincaSelector:', selectedCliente);
      const clientesCompletos = loadClientes();
      console.log('📋 Todos los clientes:', clientesCompletos);
      
      const cliente = clientesCompletos.find(c => 
        c.nombre_cliente === selectedCliente && c.activo !== false
      );
      
      console.log('🎯 Cliente encontrado:', cliente);
      
      if (cliente) {
        const fincasData = getFincasByCliente(cliente.id);
        console.log('🏢 Fincas encontradas:', fincasData);
        setFincas(fincasData);
        
        // Si autoSetDestination está activo y no hay fincas, usar el nombre del cliente como destino
        if (autoSetDestination && fincasData.length === 0) {
          onFincaChange(selectedCliente);
        }
        // Si solo hay una finca y autoSetDestination está activo, seleccionarla automáticamente
        else if (autoSetDestination && fincasData.length === 1 && !selectedFinca) {
          onFincaChange(fincasData[0].nombre_finca);
          if (onCiudadChange) {
            onCiudadChange(fincasData[0].ciudad);
          }
        }
      } else {
        console.log('❌ Cliente no encontrado');
        setFincas([]);
        onFincaChange('');
      }
    } else {
      setFincas([]);
      onFincaChange('');
    }
  }, [selectedCliente, onFincaChange, onCiudadChange, autoSetDestination]);

  const handleClienteChange = (clienteNombre: string) => {
    console.log('🔄 Cambiando cliente a:', clienteNombre);
    onClienteChange(clienteNombre);
    onFincaChange(''); // Reset finca selection
  };

  const handleFincaChange = (fincaNombre: string) => {
    console.log('🔄 Cambiando finca a:', fincaNombre);
    onFincaChange(fincaNombre);
    
    // Update ciudad if callback is provided
    if (onCiudadChange && fincaNombre) {
      const finca = fincas.find(f => f.nombre_finca === fincaNombre);
      if (finca) {
        onCiudadChange(finca.ciudad);
      }
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="cliente">Cliente *</Label>
        <Select onValueChange={handleClienteChange} value={selectedCliente}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar cliente" />
          </SelectTrigger>
          <SelectContent>
            {clientes.map((clienteNombre) => (
              <SelectItem key={clienteNombre} value={clienteNombre}>
                {clienteNombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="finca">Finca/Punto de Entrega *</Label>
        {selectedCliente && fincas.length === 0 && autoSetDestination ? (
          <div className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-900">
            <span>{selectedCliente} (Cliente directo)</span>
          </div>
        ) : (
          <Select 
            onValueChange={handleFincaChange} 
            value={selectedFinca}
            disabled={!selectedCliente}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  !selectedCliente 
                    ? "Primero seleccione un cliente" 
                    : fincas.length === 0 
                      ? "El cliente no tiene fincas registradas"
                      : "Seleccionar finca"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {fincas.map((finca) => (
                <SelectItem key={finca.id} value={finca.nombre_finca}>
                  {finca.nombre_finca} - {finca.ciudad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {selectedCliente && fincas.length === 0 && autoSetDestination && (
          <p className="text-sm text-muted-foreground mt-1">
            Este cliente no tiene fincas registradas, se utilizará el nombre del cliente como destino.
          </p>
        )}
        {selectedCliente && fincas.length === 0 && !autoSetDestination && (
          <p className="text-sm text-muted-foreground mt-1">
            Este cliente no tiene fincas registradas. Agrégalas en la gestión de clientes.
          </p>
        )}
      </div>
    </>
  );
};

export default ClienteFincaSelector;
