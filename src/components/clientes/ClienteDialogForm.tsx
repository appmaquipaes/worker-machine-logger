
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <FormField
          control={form.control}
          name="nombre_cliente"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl font-bold text-slate-700 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                Nombre del Cliente *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: Constructora XYZ S.A.S." 
                  className="h-16 text-xl border-3 border-slate-300 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                />
              </FormControl>
              <FormMessage className="text-lg font-medium" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo_persona"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl font-bold text-slate-700 flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                Tipo de Persona *
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="h-16 text-xl border-3 border-slate-300 focus:border-blue-500 bg-white shadow-sm">
                    <SelectValue placeholder="Seleccionar tipo de persona" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border-3 border-slate-200 shadow-2xl">
                    {tiposPersona.map((tipo) => (
                      <SelectItem key={tipo} value={tipo} className="text-xl py-4 hover:bg-blue-50 cursor-pointer">
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-lg font-medium" />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <FormField
          control={form.control}
          name="nit_cedula"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl font-bold text-slate-700 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                NIT o Cédula *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: 900123456-1 o 12345678" 
                  className="h-16 text-xl border-3 border-slate-300 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                />
              </FormControl>
              <FormMessage className="text-lg font-medium" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="correo_electronico"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl font-bold text-slate-700 flex items-center gap-3">
                <Mail className="w-6 h-6 text-blue-600" />
                Correo Electrónico
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email" 
                  placeholder="cliente@ejemplo.com" 
                  className="h-16 text-xl border-3 border-slate-300 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                />
              </FormControl>
              <FormMessage className="text-lg font-medium" />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <FormField
          control={form.control}
          name="persona_contacto"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl font-bold text-slate-700 flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                Persona de Contacto *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: Juan Pérez Rodríguez" 
                  className="h-16 text-xl border-3 border-slate-300 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                />
              </FormControl>
              <FormMessage className="text-lg font-medium" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono_contacto"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl font-bold text-slate-700 flex items-center gap-3">
                <Phone className="w-6 h-6 text-blue-600" />
                Teléfono de Contacto *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: +57 301 234 5678" 
                  className="h-16 text-xl border-3 border-slate-300 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                />
              </FormControl>
              <FormMessage className="text-lg font-medium" />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <FormField
          control={form.control}
          name="ciudad"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl font-bold text-slate-700 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-600" />
                Ciudad *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: Medellín, Antioquia" 
                  className="h-16 text-xl border-3 border-slate-300 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                />
              </FormControl>
              <FormMessage className="text-lg font-medium" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo_cliente"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl font-bold text-slate-700 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                Categoría de Cliente
              </FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-16 text-xl border-3 border-slate-300 focus:border-blue-500 bg-white shadow-sm">
                    <SelectValue placeholder="Seleccionar categoría (opcional)" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border-3 border-slate-200 shadow-2xl">
                    {tiposCliente.map((tipo) => (
                      <SelectItem key={tipo} value={tipo} className="text-xl py-4 hover:bg-blue-50 cursor-pointer">
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-lg font-medium" />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="observaciones"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-xl font-bold text-slate-700 flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              Observaciones
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Información adicional del cliente, necesidades especiales, notas importantes..." 
                className="min-h-[140px] text-xl border-3 border-slate-300 focus:border-blue-500 transition-all duration-300 resize-none bg-white shadow-sm"
              />
            </FormControl>
            <FormMessage className="text-lg font-medium" />
          </FormItem>
        )}
      />
      
      <DialogFooter className="gap-6 pt-10 border-t-2 border-slate-200">
        <Button 
          type="submit" 
          className="h-16 px-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 min-w-[220px]"
        >
          {isEdit ? (
            <>
              <Save className="mr-4 h-7 w-7" />
              Actualizar Cliente
            </>
          ) : (
            <>
              <UserPlus className="mr-4 h-7 w-7" />
              Guardar Cliente
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  </Form>
);

export default ClienteDialogForm;
