
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Package } from 'lucide-react';

// Schema for product validation
const productoSchema = z.object({
  tipo_insumo: z.enum(['Material', 'Lubricante', 'Repuesto', 'Servicio']),
  nombre_producto: z.string().min(1, { message: "El nombre del producto es obligatorio" }),
  unidad: z.string().min(1, { message: "La unidad es obligatoria" }),
  precio_unitario: z.coerce.number().min(0, { message: "El precio debe ser positivo" }),
  observaciones: z.string().optional()
});

export type ProductoFormData = z.infer<typeof productoSchema>;

interface ProductoFormProps {
  onSubmit: (data: ProductoFormData) => void;
  onCancel: () => void;
  defaultValues?: ProductoFormData;
  isEditing?: boolean;
  proveedorNombre: string;
}

const ProductoForm: React.FC<ProductoFormProps> = ({ 
  onSubmit, 
  onCancel, 
  defaultValues, 
  isEditing, 
  proveedorNombre 
}) => {
  const form = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: defaultValues || {
      tipo_insumo: "Material",
      nombre_producto: "",
      unidad: "",
      precio_unitario: 0,
      observaciones: ""
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
        <FormField
          control={form.control}
          name="tipo_insumo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Insumo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Material">Material</SelectItem>
                  <SelectItem value="Lubricante">Lubricante</SelectItem>
                  <SelectItem value="Repuesto">Repuesto</SelectItem>
                  <SelectItem value="Servicio">Servicio</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nombre_producto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Arena fina, Aceite 15W40" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="m³, galón, unidad" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="precio_unitario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Unitario</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="0" />
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
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
          >
            <Package className="h-4 w-4 mr-2" />
            {isEditing ? 'Actualizar' : 'Guardar'} Producto
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ProductoForm;
