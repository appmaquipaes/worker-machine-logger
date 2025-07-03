
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Save, User, Mail, Phone, MapPin, Building2, FileText } from "lucide-react";

interface ClienteDialogFormProps {
  form: any;
  tiposPersona: string[];
  tiposCliente: string[];
  isEdit?: boolean;
  onSubmit: (data: any) => void;
}

const ClienteDialogForm: React.FC<ClienteDialogFormProps> = ({
  form,
  tiposPersona,
  tiposCliente,
  isEdit,
  onSubmit,
}) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nombre_cliente"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Nombre del Cliente *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: Constructora XYZ S.A.S." 
                  className="h-10 border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo_persona"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Tipo de Persona *
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="h-10 border-2 border-slate-300 focus:border-blue-500">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border-2 border-slate-200 shadow-xl">
                    {tiposPersona.map((tipo) => (
                      <SelectItem key={tipo} value={tipo} className="hover:bg-blue-50 cursor-pointer">
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nit_cedula"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                NIT o Cédula *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: 900123456-1 o 12345678" 
                  className="h-10 border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="correo_electronico"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                Correo Electrónico
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email" 
                  placeholder="cliente@ejemplo.com" 
                  className="h-10 border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="persona_contacto"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Persona de Contacto *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: Juan Pérez Rodríguez" 
                  className="h-10 border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono_contacto"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Teléfono de Contacto *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: +57 301 234 5678" 
                  className="h-10 border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ciudad"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Ciudad *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: Medellín, Antioquia" 
                  className="h-10 border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo_cliente"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Categoría de Cliente
              </FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-10 border-2 border-slate-300 focus:border-blue-500">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border-2 border-slate-200 shadow-xl">
                    {tiposCliente.map((tipo) => (
                      <SelectItem key={tipo} value={tipo} className="hover:bg-blue-50 cursor-pointer">
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="observaciones"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Observaciones
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Información adicional del cliente..." 
                className="min-h-[80px] border-2 border-slate-300 focus:border-blue-500 transition-colors resize-none"
              />
            </FormControl>
            <FormMessage className="text-sm" />
          </FormItem>
        )}
      />
      
      <DialogFooter className="gap-3 pt-4 border-t border-slate-200">
        <Button 
          type="submit" 
          className="h-10 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isEdit ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Actualizar Cliente
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Guardar Cliente
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  </Form>
);

export default ClienteDialogForm;
