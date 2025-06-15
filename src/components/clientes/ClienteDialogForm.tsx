
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nombre_cliente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Cliente *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Constructora XYZ" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo_persona"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Persona *</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposPersona.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nit_cedula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIT o Cédula *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: 900123456-1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="correo_electronico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="cliente@ejemplo.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="persona_contacto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persona de Contacto *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Juan Pérez" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono_contacto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono de Contacto *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: 301 234 5678" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ciudad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Medellín" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo_cliente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Cliente</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposCliente.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="observaciones"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observaciones</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Observaciones adicionales (opcional)" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <DialogFooter>
        <Button type="submit">{isEdit ? "Actualizar Cliente" : "Guardar Cliente"}</Button>
      </DialogFooter>
    </form>
  </Form>
);

export default ClienteDialogForm;
