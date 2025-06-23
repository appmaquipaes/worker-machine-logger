
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Package, AlertTriangle, DollarSign, Ruler } from 'lucide-react';
import { ProductoProveedor } from '@/models/Proveedores';

interface ProductoTableProps {
  productos: ProductoProveedor[];
  onEdit: (producto: ProductoProveedor) => void;
  onDelete: (id: string) => void;
}

const ProductoTable: React.FC<ProductoTableProps> = ({ productos, onEdit, onDelete }) => {
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Material': return '🏗️';
      case 'Lubricante': return '🛢️';
      case 'Repuesto': return '🔧';
      case 'Servicio': return '⚙️';
      default: return '📦';
    }
  };

  const getTipoBadgeVariant = (tipo: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (tipo) {
      case 'Material': return 'default';
      case 'Lubricante': return 'secondary';
      case 'Repuesto': return 'outline';
      case 'Servicio': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <>
      {productos.length > 0 ? (
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-50 hover:to-slate-100">
                <TableHead className="font-bold text-slate-700 h-16 text-base">Tipo</TableHead>
                <TableHead className="font-bold text-slate-700 h-16 text-base">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Producto
                  </div>
                </TableHead>
                <TableHead className="font-bold text-slate-700 h-16 text-base">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Unidad
                  </div>
                </TableHead>
                <TableHead className="font-bold text-slate-700 h-16 text-base">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Precio
                  </div>
                </TableHead>
                <TableHead className="w-32 font-bold text-slate-700 h-16 text-base text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto, index) => (
                <TableRow 
                  key={producto.id}
                  className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-slate-100"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <TableCell className="py-6">
                    <Badge 
                      variant={getTipoBadgeVariant(producto.tipo_insumo)} 
                      className="text-sm font-medium px-3 py-2"
                    >
                      <span className="mr-2">{getTipoIcon(producto.tipo_insumo)}</span>
                      {producto.tipo_insumo}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 text-lg">{producto.nombre_producto}</div>
                      {producto.observaciones && (
                        <div className="text-slate-600 text-sm leading-relaxed">
                          {producto.observaciones}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <span className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-medium text-base">
                      {producto.unidad}
                    </span>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-1">
                      <div className="font-bold text-emerald-600 text-xl">
                        {formatNumber(producto.precio_unitario)}
                      </div>
                      <div className="text-slate-500 text-sm">
                        por {producto.unidad}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(producto)}
                        className="h-10 w-10 p-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                        title="Editar producto"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-10 w-10 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-lg bg-white shadow-2xl border-0 rounded-2xl">
                          <AlertDialogHeader className="text-center space-y-6 pb-6">
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg">
                              <AlertTriangle className="h-10 w-10 text-white" />
                            </div>
                            <div className="space-y-3">
                              <AlertDialogTitle className="text-3xl font-bold text-slate-800">
                                ¿Confirmar Eliminación?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-lg text-slate-600 leading-relaxed">
                                Esta acción eliminará permanentemente el producto{' '}
                                <span className="font-bold text-slate-800">"{producto.nombre_producto}"</span>.
                                <br /><br />
                                <span className="text-red-600 font-semibold">
                                  Esta acción no se puede deshacer.
                                </span>
                              </AlertDialogDescription>
                            </div>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-4 pt-6 border-t border-slate-200">
                            <AlertDialogCancel className="flex-1 h-14 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(producto.id)}
                              className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar Producto
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-24 space-y-8 bg-white rounded-xl border border-slate-200">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-lg">
            <Package className="w-16 h-16 text-slate-400" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-600">No hay productos registrados</h3>
            <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
              Agrega productos y servicios para este proveedor para comenzar a gestionar el inventario
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductoTable;
