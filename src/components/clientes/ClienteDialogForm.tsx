
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Save } from "lucide-react";

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="nombre_cliente"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-bold text-slate-700">Nombre del Cliente *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: Constructora XYZ S.A.S." 
                  className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo_persona"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-bold text-slate-700">Tipo de Persona *</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500">
                    <SelectValue placeholder="Seleccionar tipo de persona" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border-2 border-slate-200 shadow-xl">
                    {tiposPersona.map((tipo) => (
                      <SelectItem key={tipo} value={tipo} className="text-lg py-3 hover:bg-blue-50">
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="nit_cedula"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-bold text-slate-700">NIT o Cédula *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: 900123456-1 o 12345678" 
                  className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="correo_electronico"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-bold text-slate-700">Correo Electrónico</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email" 
                  placeholder="cliente@ejemplo.com" 
                  className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="persona_contacto"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-bold text-slate-700">Persona de Contacto *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: Juan Pérez Rodríguez" 
                  className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono_contacto"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-bold text-slate-700">Teléfono de Contacto *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: +57 301 234 5678" 
                  className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="ciudad"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-bold text-slate-700">Ciudad *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: Medellín, Antioquia" 
                  className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 transition-colors"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo_cliente"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-bold text-slate-700">Categoría de Cliente</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500">
                    <SelectValue placeholder="Seleccionar categoría (opcional)" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border-2 border-slate-200 shadow-xl">
                    {tiposCliente.map((tipo) => (
                      <SelectItem key={tipo} value={tipo} className="text-lg py-3 hover:bg-blue-50">
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="observaciones"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-lg font-bold text-slate-700">Observaciones</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Información adicional del cliente, necesidades especiales, notas importantes..." 
                className="min-h-[120px] text-lg border-2 border-slate-300 focus:border-blue-500 transition-colors resize-none"
              />
            </FormControl>
            <FormMessage className="text-base" />
          </FormItem>
        )}
      />
      
      <DialogFooter className="gap-4 pt-8 border-t border-slate-200">
        <Button 
          type="submit" 
          className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          {isEdit ? (
            <>
              <Save className="mr-3 h-6 w-6" />
              Actualizar Cliente
            </>
          ) : (
            <>
              <UserPlus className="mr-3 h-6 w-6" />
              Guardar Cliente
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  </Form>
);

export default ClienteDialogForm;
