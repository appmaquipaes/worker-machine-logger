
import React from 'react';
import { Users, Truck, Hash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';
import { Machine } from '@/context/MachineContext';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';
import { ReportType } from '@/types/report';

interface EscombreraInputsProps {
  reportType: ReportType;
  selectedCliente: string;
  onClienteChangeForDestination: (cliente: string) => void;
  tipoMateria: string;
  setTipoMateria: (value: string) => void;
  trips?: number;
  setTrips: (value: number | undefined) => void;
  selectedMachine?: Machine;
}

const EscombreraInputs: React.FC<EscombreraInputsProps> = ({
  reportType,
  selectedCliente,
  onClienteChangeForDestination,
  tipoMateria,
  setTipoMateria,
  trips,
  setTrips,
  selectedMachine
}) => {
  const { isEscombrera } = useMachineSpecificReports();

  if (reportType !== 'Recepción Escombrera' || !isEscombrera(selectedMachine)) {
    return null;
  }

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Users size={24} />
          <Label className="text-lg">Cliente</Label>
        </div>
        <ClienteFincaSelector
          selectedCliente={selectedCliente}
          selectedFinca=""
          onClienteChange={onClienteChangeForDestination}
          onFincaChange={() => {}}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Truck size={24} />
          <Label htmlFor="tipo-volqueta" className="text-lg">Tipo de Volqueta</Label>
        </div>
        <Select onValueChange={(value) => setTipoMateria(value)} value={tipoMateria}>
          <SelectTrigger className="text-lg p-6">
            <SelectValue placeholder="Selecciona el tipo de volqueta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sencilla">Volqueta Sencilla</SelectItem>
            <SelectItem value="Doble Troque">Volqueta Doble Troque</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Hash size={24} />
          <Label htmlFor="cantidad-volquetas" className="text-lg">Cantidad de Volquetas</Label>
        </div>
        <Input 
          id="cantidad-volquetas"
          type="number"
          min="1"
          placeholder="Ej: 5"
          value={trips === undefined ? '' : trips}
          onChange={(e) => setTrips(parseInt(e.target.value) || undefined)}
          className="text-lg p-6"
          required
        />
      </div>
    </>
  );
};

export default EscombreraInputs;
