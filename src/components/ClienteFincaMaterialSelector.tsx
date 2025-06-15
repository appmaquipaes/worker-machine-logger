
import React, { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { loadClientes } from "@/models/Clientes";
import { getFincasByCliente } from "@/models/Fincas";
import { Material, loadMateriales } from "@/models/Materiales";

interface Props {
  selectedCliente: string;
  onClienteChange: (cliente: string) => void;
  selectedFinca: string;
  onFincaChange: (finca: string) => void;
  selectedMaterial: string;
  onMaterialChange: (mat: string) => void;
}

const ClienteFincaMaterialSelector: React.FC<Props> = ({
  selectedCliente, onClienteChange,
  selectedFinca, onFincaChange,
  selectedMaterial, onMaterialChange,
}) => {
  const [clientes, setClientes] = useState<string[]>([]);
  const [fincas, setFincas] = useState<string[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);

  useEffect(() => {
    setClientes(loadClientes().map(c => c.nombre_cliente));
    setMateriales(loadMateriales());
  }, []);

  useEffect(() => {
    if (selectedCliente) {
      const allClientes = loadClientes();
      const c = allClientes.find(cl => cl.nombre_cliente === selectedCliente);
      if (c) setFincas(getFincasByCliente(c.id).map(f => f.nombre_finca));
      else setFincas([]);
    } else {
      setFincas([]);
    }
    onFincaChange(""); // Limpiar la finca seleccionada cuando cambia cliente
  }, [selectedCliente, onFincaChange]);

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex flex-col min-w-[140px]">
        <span className="text-xs mb-1">Cliente</span>
        <Select value={selectedCliente} onValueChange={onClienteChange}>
          <SelectTrigger>
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            {clientes.map((cli) => (
              <SelectItem value={cli} key={cli}>{cli}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col min-w-[140px]">
        <span className="text-xs mb-1">Finca/Punto</span>
        <Select value={selectedFinca} onValueChange={onFincaChange} disabled={!selectedCliente || fincas.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder={selectedCliente
              ? (fincas.length === 0 ? "Sin fincas" : "Finca")
              : "Seleccione cliente"} />
          </SelectTrigger>
          <SelectContent>
            {fincas.map((fn) => (
              <SelectItem value={fn} key={fn}>{fn}</SelectItem>
            ))}
            {selectedCliente && fincas.length === 0 &&
              <SelectItem value={selectedCliente}>{selectedCliente} (sin finca)</SelectItem>
            }
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col min-w-[140px]">
        <span className="text-xs mb-1">Material</span>
        <Select value={selectedMaterial} onValueChange={onMaterialChange}>
          <SelectTrigger>
            <SelectValue placeholder="Material" />
          </SelectTrigger>
          <SelectContent>
            {materiales.map((mat) => (
              <SelectItem value={mat.nombre_material} key={mat.id}>{mat.nombre_material}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClienteFincaMaterialSelector;
