
import React from "react";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Finca } from "@/models/Fincas";

interface FincaFormProps {
  nombreFinca: string;
  setNombreFinca: (v: string) => void;
  direccion: string;
  setDireccion: (v: string) => void;
  ciudad: string;
  setCiudad: (v: string) => void;
  contactoNombre: string;
  setContactoNombre: (v: string) => void;
  contactoTelefono: string;
  setContactoTelefono: (v: string) => void;
  notas: string;
  setNotas: (v: string) => void;
  editingFinca: Finca | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const FincaForm: React.FC<FincaFormProps> = ({
  nombreFinca, setNombreFinca,
  direccion, setDireccion,
  ciudad, setCiudad,
  contactoNombre, setContactoNombre,
  contactoTelefono, setContactoTelefono,
  notas, setNotas,
  editingFinca,
  onSubmit,
  onCancel,
}) => (
  <>
    <DialogHeader>
      <DialogTitle>
        {editingFinca ? 'Editar Finca' : 'Agregar Nueva Finca'}
      </DialogTitle>
    </DialogHeader>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
      <div>
        <Label htmlFor="nombre-finca">Nombre de la Finca *</Label>
        <Input
          id="nombre-finca"
          value={nombreFinca}
          onChange={(e) => setNombreFinca(e.target.value)}
          placeholder="Ej: Finca La Esperanza"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="ciudad">Ciudad/Municipio *</Label>
        <Input
          id="ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Ej: Medellín"
          className="mt-1"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="direccion">Dirección Exacta *</Label>
        <Input
          id="direccion"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección completa de la finca"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="contacto-nombre">Persona de Contacto *</Label>
        <Input
          id="contacto-nombre"
          value={contactoNombre}
          onChange={(e) => setContactoNombre(e.target.value)}
          placeholder="Nombre del contacto"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="contacto-telefono">Teléfono de Contacto *</Label>
        <Input
          id="contacto-telefono"
          value={contactoTelefono}
          onChange={(e) => setContactoTelefono(e.target.value)}
          placeholder="Teléfono del contacto"
          className="mt-1"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="notas">Notas Adicionales</Label>
        <Textarea
          id="notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Notas adicionales sobre la finca"
          className="mt-1"
        />
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      <Button onClick={onSubmit} className="btn-primary-large btn-press">
        {editingFinca ? "Actualizar" : "Guardar"} Finca
      </Button>
    </DialogFooter>
  </>
);

export default FincaForm;
