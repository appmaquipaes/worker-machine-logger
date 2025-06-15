
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Plus, Building } from 'lucide-react';

// Schema for provider validation
const proveedorSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
  ciudad: z.string().min(1, { message: "La ciudad es obligatoria" }),
  contacto: z.string().min(1, { message: "El contacto es obligatorio" }),
  correo_electronico: z.string().email({ message: "Ingrese un correo válido" }),
  nit: z.string().min(1, { message: "El NIT es obligatorio" }),
  tipo_proveedor: z.enum(['Materiales', 'Lubricantes', 'Repuestos', 'Servicios', 'Otros']),
  forma_pago: z.string().min(1, { message: "La forma de pago es obligatoria" }),
  observaciones: z.string().optional()
});

export type ProveedorFormData = z.infer<typeof proveedorSchema>;

interface ProveedorFormProps {
  onSubmit: (data: ProveedorFormData) => void;
  onCancel: () => void;
  defaultValues?: ProveedorFormData;
  isEditing?: boolean;
}

const ProveedorForm: React.FC<ProveedorFormProps> = ({ 
  onSubmit, 
  onCancel, 
  defaultValues, 
  isEditing 
}) => {
  const form = useForm<ProveedorFormData>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: defaultValues || {
      nombre: "",
      ciudad: "",
      contacto: "",
      correo_electronico: "",
      nit: "",
      tipo_proveedor: "Materiales",
      forma_pago: "",
      observaciones: ""
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Nombre del Proveedor *
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Nombre del proveedor" 
                    className="h-12 text-base border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ciudad"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Ciudad *
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Ciudad" 
                    className="h-12 text-base border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Persona de Contacto *
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Nombre del contacto" 
                    className="h-12 text-base border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                  />
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
                <FormLabel className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Correo Electrónico *
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    placeholder="correo@ejemplo.com" 
                    className="h-12 text-base border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  NIT *
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="123456789-0" 
                    className="h-12 text-base border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tipo_proveedor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Tipo de Proveedor *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 text-base border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Materiales">Materiales</SelectItem>
                    <SelectItem value="Lubricantes">Lubricantes</SelectItem>
                    <SelectItem value="Repuestos">Repuestos</SelectItem>
                    <SelectItem value="Servicios">Servicios</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="forma_pago"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                Forma de Pago *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ej: Contado, 30 días, 60 días" 
                  className="h-12 text-base border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="observaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                Observaciones
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Observaciones adicionales (opcional)" 
                  className="min-h-[80px] text-base border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="gap-3 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isEditing ? 'Actualizar' : 'Guardar'} Proveedor
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ProveedorForm;
