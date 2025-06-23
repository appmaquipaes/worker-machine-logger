
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
import { Package, Save, Plus, Tag, DollarSign, Ruler, FileText } from 'lucide-react';

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

  const tiposInsumo = [
    { value: 'Material', label: 'Material', icon: '🏗️', description: 'Materiales de construcción' },
    { value: 'Lubricante', label: 'Lubricante', icon: '🛢️', description: 'Aceites y lubricantes' },
    { value: 'Repuesto', label: 'Repuesto', icon: '🔧', description: 'Repuestos y piezas' },
    { value: 'Servicio', label: 'Servicio', icon: '⚙️', description: 'Servicios especializados' }
  ];

  const unidadesComunes = [
    { value: 'm³', label: 'Metro cúbico (m³)', categoria: 'Volumen' },
    { value: 'ton', label: 'Tonelada (ton)', categoria: 'Peso' },
    { value: 'kg', label: 'Kilogramo (kg)', categoria: 'Peso' },
    { value: 'galón', label: 'Galón', categoria: 'Volumen' },
    { value: 'litro', label: 'Litro', categoria: 'Volumen' },
    { value: 'unidad', label: 'Unidad', categoria: 'Cantidad' },
    { value: 'metro', label: 'Metro (m)', categoria: 'Longitud' },
    { value: 'hora', label: 'Hora', categoria: 'Tiempo' },
    { value: 'servicio', label: 'Servicio', categoria: 'Otro' }
  ];

  return (
    <div className="bg-white rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
          
          {/* Información del proveedor */}
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-emerald-800">Agregando producto para:</h3>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{proveedorNombre}</p>
          </div>

          {/* Tipo de producto */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <Tag className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-800">Clasificación del Producto</h3>
            </div>
            
            <FormField
              control={form.control}
              name="tipo_insumo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tipo de Insumo *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors">
                        <SelectValue placeholder="Seleccionar tipo de insumo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-2 border-slate-200">
                      {tiposInsumo.map((tipo) => (
                        <SelectItem 
                          key={tipo.value} 
                          value={tipo.value}
                          className="text-lg py-4 hover:bg-blue-50 focus:bg-blue-50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{tipo.icon}</span>
                            <div>
                              <div className="font-medium">{tipo.label}</div>
                              <div className="text-sm text-slate-500">{tipo.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <Package className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-slate-800">Detalles del Producto</h3>
            </div>
            
            <FormField
              control={form.control}
              name="nombre_producto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Nombre del Producto *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Ej: Arena fina lavada, Aceite hidráulico 15W40, Filtro de aceite" 
                      className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="unidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      Unidad de Medida *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors">
                          <SelectValue placeholder="Seleccionar unidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-2 border-slate-200 max-h-60">
                        {unidadesComunes.map((unidad) => (
                          <SelectItem 
                            key={unidad.value} 
                            value={unidad.value}
                            className="text-lg py-3 hover:bg-blue-50 focus:bg-blue-50"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{unidad.label}</span>
                              <span className="text-sm text-slate-500 ml-2">{unidad.categoria}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precio_unitario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Precio Unitario * (COP)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input 
                          type="number" 
                          {...field} 
                          placeholder="0" 
                          className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors pl-12"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <FileText className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-slate-800">Información Adicional</h3>
            </div>
            
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Observaciones
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Información adicional sobre el producto: calidad, especificaciones técnicas, condiciones especiales, etc. (opcional)" 
                      className="min-h-[100px] text-lg border-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
          </div>
          
          <DialogFooter className="gap-4 pt-8 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-14 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isEditing ? (
                <>
                  <Save className="h-5 w-5 mr-3" />
                  Actualizar Producto
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-3" />
                  Guardar Producto
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default ProductoForm;
