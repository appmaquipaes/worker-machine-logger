
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
}

const ClienteFincaSelector: React.FC<ClienteFincaSelectorProps> = ({
  selectedCliente,
  selectedFinca,
  onClienteChange,
  onFincaChange,
  onCiudadChange
}) => {
  const [clientes, setClientes] = useState<string[]>([]);
  const [fincas, setFincas] = useState<Finca[]>([]);

  useEffect(() => {
    const clientesData = loadClientes().map(c => c.nombre_cliente);
    setClientes(clientesData);
  }, []);

  useEffect(() => {
    if (selectedCliente) {
      const cliente = getClienteByName(selectedCliente);
      if (cliente) {
        const fincasData = getFincasByCliente(cliente.id);
        setFincas(fincasData);
        
        // Si hay fincas disponibles pero no hay una seleccionada, limpiar la selección
        if (fincasData.length > 0 && selectedFinca && !fincasData.find(f => f.nombre_finca === selectedFinca)) {
          onFincaChange('');
        }
        
        // Si solo hay una finca, seleccionarla automáticamente
        if (fincasData.length === 1 && !selectedFinca) {
          onFincaChange(fincasData[0].nombre_finca);
          if (onCiudadChange) {
            onCiudadChange(fincasData[0].ciudad);
          }
        }
      } else {
        setFincas([]);
        onFincaChange('');
      }
    } else {
      setFincas([]);
      onFincaChange('');
    }
  }, [selectedCliente, onFincaChange, onCiudadChange]);

  const handleClienteChange = (clienteNombre: string) => {
    onClienteChange(clienteNombre);
    onFincaChange(''); // Reset finca selection
  };

  const handleFincaChange = (fincaNombre: string) => {
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
        <Select 
          onValueChange={handleFincaChange} 
          value={selectedFinca}
          disabled={!selectedCliente || fincas.length === 0}
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
        {selectedCliente && fincas.length === 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            Este cliente no tiene fincas registradas. Agrégalas en la gestión de clientes.
          </p>
        )}
      </div>
    </>
  );
};

export default ClienteFincaSelector;
