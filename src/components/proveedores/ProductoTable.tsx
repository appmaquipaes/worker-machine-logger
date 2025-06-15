
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { ProductoProveedor } from '@/models/Proveedores';

interface ProductoTableProps {
  productos: ProductoProveedor[];
  onEdit: (producto: ProductoProveedor) => void;
  onDelete: (id: string) => void;
}

const ProductoTable: React.FC<ProductoTableProps> = ({ productos, onEdit, onDelete }) => {
  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  return (
    <>
      {productos.length > 0 ? (
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="font-bold text-slate-700 h-14">Tipo</TableHead>
                <TableHead className="font-bold text-slate-700 h-14">Producto</TableHead>
                <TableHead className="font-bold text-slate-700 h-14">Unidad</TableHead>
                <TableHead className="font-bold text-slate-700 h-14">Precio</TableHead>
                <TableHead className="w-24 font-bold text-slate-700 h-14">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto, index) => (
                <TableRow 
                  key={producto.id}
                  className="hover:bg-blue-50/50 transition-colors duration-200"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <TableCell className="py-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {producto.tipo_insumo}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800 py-4">{producto.nombre_producto}</TableCell>
                  <TableCell className="py-4">{producto.unidad}</TableCell>
                  <TableCell className="py-4">
                    <span className="font-bold text-emerald-600">${formatNumber(producto.precio_unitario)}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(producto)}
                        className="h-9 w-9 p-0 border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="h-9 w-9 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md bg-white shadow-2xl border-0">
                          <AlertDialogHeader className="text-center space-y-4 pb-4">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <AlertTriangle className="h-8 w-8 text-white" />
                            </div>
                            <div className="space-y-2">
                              <AlertDialogTitle className="text-2xl font-bold text-slate-800">
                                ¿Confirmar Eliminación?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base text-slate-600 leading-relaxed">
                                Esta acción eliminará permanentemente el producto <span className="font-bold text-slate-800">"{producto.nombre_producto}"</span>.
                                <br /><br />
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </div>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-3 pt-6 border-t border-slate-200">
                            <AlertDialogCancel className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(producto.id)}
                              className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
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
        <div className="text-center py-16 space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
            <Package className="w-12 h-12 text-slate-400" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-slate-600">No hay productos registrados</p>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              Agrega productos y servicios para este proveedor
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductoTable;
