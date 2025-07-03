
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
    <DialogHeader className="space-y-4 pb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
          {editingFinca ? <Save className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
        </div>
        <div>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            {editingFinca ? 'Editar Proyecto/Finca' : 'Agregar Proyecto/Finca'}
          </DialogTitle>
          <p className="text-slate-600 mt-1">
            {editingFinca ? 'Modifica la información del proyecto' : 'Complete los datos del nuevo proyecto'}
          </p>
        </div>
      </div>
    </DialogHeader>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="nombre-finca" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Building className="w-4 h-4 text-green-600" />
          Nombre del Proyecto/Finca *
        </Label>
        <Input
          id="nombre-finca"
          value={nombreFinca}
          onChange={(e) => setNombreFinca(e.target.value)}
          placeholder="Ej: Proyecto Urbanización La Esperanza"
          className="h-10 border-2 border-slate-300 focus:border-green-500 transition-colors"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ciudad" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          Ciudad/Municipio *
        </Label>
        <Input
          id="ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Ej: Medellín, Antioquia"
          className="h-10 border-2 border-slate-300 focus:border-green-500 transition-colors"
        />
      </div>
      
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="direccion" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          Dirección Exacta del Proyecto *
        </Label>
        <Input
          id="direccion"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección completa y detallada del proyecto"
          className="h-10 border-2 border-slate-300 focus:border-green-500 transition-colors"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contacto-nombre" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <User className="w-4 h-4 text-green-600" />
          Persona de Contacto *
        </Label>
        <Input
          id="contacto-nombre"
          value={contactoNombre}
          onChange={(e) => setContactoNombre(e.target.value)}
          placeholder="Nombre del responsable en el proyecto"
          className="h-10 border-2 border-slate-300 focus:border-green-500 transition-colors"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contacto-telefono" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Phone className="w-4 h-4 text-green-600" />
          Teléfono de Contacto *
        </Label>
        <Input
          id="contacto-telefono"
          value={contactoTelefono}
          onChange={(e) => setContactoTelefono(e.target.value)}
          placeholder="Ej: +57 301 234 5678"
          className="h-10 border-2 border-slate-300 focus:border-green-500 transition-colors"
        />
      </div>
      
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="notas" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <FileText className="w-4 h-4 text-green-600" />
          Notas Adicionales del Proyecto
        </Label>
        <Textarea
          id="notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Información adicional sobre el proyecto..."
          className="min-h-[80px] border-2 border-slate-300 focus:border-green-500 transition-colors resize-none"
        />
      </div>
    </div>
    
    <DialogFooter className="gap-3 pt-4 border-t border-slate-200">
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="h-10 px-4 font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSubmit} 
        className="h-10 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {editingFinca ? (
          <>
            <Save className="mr-2 h-4 w-4" />
            Actualizar Proyecto
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Guardar Proyecto
          </>
        )}
      </Button>
    </DialogFooter>
  </>
);

export default FincaForm;
