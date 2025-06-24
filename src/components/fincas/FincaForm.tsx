
import React from "react";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Finca } from "@/models/Fincas";
import { Save, Plus, MapPin, Building, Phone, User, FileText } from "lucide-react";

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
    <DialogHeader className="space-y-6 pb-8">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl">
          {editingFinca ? <Save className="h-8 w-8 text-white" /> : <Plus className="h-8 w-8 text-white" />}
        </div>
        <div>
          <DialogTitle className="text-3xl font-bold text-slate-800">
            {editingFinca ? 'Editar Proyecto/Finca' : 'Agregar Nuevo Proyecto/Finca'}
          </DialogTitle>
          <p className="text-xl text-slate-600 mt-2">
            {editingFinca ? 'Modifica la información del proyecto' : 'Complete los datos del nuevo proyecto'}
          </p>
        </div>
      </div>
    </DialogHeader>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-8">
      <div className="space-y-4">
        <Label htmlFor="nombre-finca" className="text-xl font-bold text-slate-700 flex items-center gap-3">
          <Building className="w-6 h-6 text-green-600" />
          Nombre del Proyecto/Finca *
        </Label>
        <Input
          id="nombre-finca"
          value={nombreFinca}
          onChange={(e) => setNombreFinca(e.target.value)}
          placeholder="Ej: Proyecto Urbanización La Esperanza"
          className="h-16 text-xl border-3 border-slate-300 focus:border-green-500 transition-all duration-300 bg-white shadow-sm"
        />
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="ciudad" className="text-xl font-bold text-slate-700 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-green-600" />
          Ciudad/Municipio *
        </Label>
        <Input
          id="ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Ej: Medellín, Antioquia"
          className="h-16 text-xl border-3 border-slate-300 focus:border-green-500 transition-all duration-300 bg-white shadow-sm"
        />
      </div>
      
      <div className="md:col-span-2 space-y-4">
        <Label htmlFor="direccion" className="text-xl font-bold text-slate-700 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-green-600" />
          Dirección Exacta del Proyecto *
        </Label>
        <Input
          id="direccion"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección completa y detallada del proyecto"
          className="h-16 text-xl border-3 border-slate-300 focus:border-green-500 transition-all duration-300 bg-white shadow-sm"
        />
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="contacto-nombre" className="text-xl font-bold text-slate-700 flex items-center gap-3">
          <User className="w-6 h-6 text-green-600" />
          Persona de Contacto *
        </Label>
        <Input
          id="contacto-nombre"
          value={contactoNombre}
          onChange={(e) => setContactoNombre(e.target.value)}
          placeholder="Nombre del responsable en el proyecto"
          className="h-16 text-xl border-3 border-slate-300 focus:border-green-500 transition-all duration-300 bg-white shadow-sm"
        />
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="contacto-telefono" className="text-xl font-bold text-slate-700 flex items-center gap-3">
          <Phone className="w-6 h-6 text-green-600" />
          Teléfono de Contacto *
        </Label>
        <Input
          id="contacto-telefono"
          value={contactoTelefono}
          onChange={(e) => setContactoTelefono(e.target.value)}
          placeholder="Ej: +57 301 234 5678"
          className="h-16 text-xl border-3 border-slate-300 focus:border-green-500 transition-all duration-300 bg-white shadow-sm"
        />
      </div>
      
      <div className="md:col-span-2 space-y-4">
        <Label htmlFor="notas" className="text-xl font-bold text-slate-700 flex items-center gap-3">
          <FileText className="w-6 h-6 text-green-600" />
          Notas Adicionales del Proyecto
        </Label>
        <Textarea
          id="notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Información adicional sobre el proyecto, requisitos especiales, observaciones importantes..."
          className="min-h-[140px] text-xl border-3 border-slate-300 focus:border-green-500 transition-all duration-300 resize-none bg-white shadow-sm"
        />
      </div>
    </div>
    
    <DialogFooter className="gap-6 pt-10 border-t-2 border-slate-200">
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="h-16 px-10 font-bold text-xl border-3 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 min-w-[180px]"
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSubmit} 
        className="h-16 px-10 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 min-w-[250px]"
      >
        {editingFinca ? (
          <>
            <Save className="mr-4 h-7 w-7" />
            Actualizar Proyecto
          </>
        ) : (
          <>
            <Plus className="mr-4 h-7 w-7" />
            Guardar Proyecto
          </>
        )}
      </Button>
    </DialogFooter>
  </>
);

export default FincaForm;
