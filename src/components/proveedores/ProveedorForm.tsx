
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
import { Plus, Save, Building, User, Mail, MapPin, Phone, CreditCard, FileText } from 'lucide-react';

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

  const tiposProveedor = [
    { value: 'Materiales', label: 'Materiales', icon: '🏗️' },
    { value: 'Lubricantes', label: 'Lubricantes', icon: '🛢️' },
    { value: 'Repuestos', label: 'Repuestos', icon: '🔧' },
    { value: 'Servicios', label: 'Servicios', icon: '⚙️' },
    { value: 'Otros', label: 'Otros', icon: '📦' }
  ];

  return (
    <div className="bg-white rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
          
          {/* Información básica */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <Building className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-slate-800">Información Básica</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Nombre del Proveedor *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Ej: Construcciones ABC Ltda." 
                        className="h-14 text-lg border-2 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      NIT *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Ej: 900123456-7" 
                        className="h-14 text-lg border-2 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Ciudad *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Ej: Bogotá" 
                        className="h-14 text-lg border-2 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipo_proveedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Tipo de Proveedor *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 text-lg border-2 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-2 border-slate-200">
                        {tiposProveedor.map((tipo) => (
                          <SelectItem 
                            key={tipo.value} 
                            value={tipo.value}
                            className="text-lg py-3 hover:bg-emerald-50 focus:bg-emerald-50"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{tipo.icon}</span>
                              <span>{tipo.label}</span>
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
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-800">Información de Contacto</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Persona de Contacto *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Ej: Juan Pérez" 
                        className="h-14 text-lg border-2 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
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
                  <FormItem>
                    <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Correo Electrónico *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email" 
                        placeholder="Ej: contacto@empresa.com" 
                        className="h-14 text-lg border-2 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Información comercial */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <CreditCard className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-slate-800">Información Comercial</h3>
            </div>
            
            <FormField
              control={form.control}
              name="forma_pago"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-slate-700 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Forma de Pago *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Ej: Contado, 30 días, 60 días" 
                      className="h-14 text-lg border-2 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
            
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
                      placeholder="Información adicional sobre el proveedor (opcional)" 
                      className="min-h-[100px] text-lg border-2 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors resize-none"
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
              className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isEditing ? (
                <>
                  <Save className="h-5 w-5 mr-3" />
                  Actualizar Proveedor
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-3" />
                  Guardar Proveedor
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default ProveedorForm;
