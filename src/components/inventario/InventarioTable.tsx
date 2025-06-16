
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Package, AlertTriangle } from 'lucide-react';

interface InventarioItem {
  id: string;
  tipo_material: string;
  cantidad_disponible: number;
  costo_promedio_m3: number;
}

interface InventarioTableProps {
  inventario: InventarioItem[];
  editandoId: string | null;
  orden: 'asc' | 'desc';
  columnaOrdenada: string;
  onOrdenar: (columna: string) => void;
  onEditar: (item: InventarioItem) => void;
  onEliminar: (id: string) => void;
}

const InventarioTable: React.FC<InventarioTableProps> = ({
  inventario,
  editandoId,
  orden,
  columnaOrdenada,
  onOrdenar,
  onEditar,
  onEliminar
}) => {
  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <CardTitle className="text-2xl font-bold text-slate-800">Inventario Actual</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {inventario.length > 0 ? (
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead 
                    onClick={() => onOrdenar('tipo_material')} 
                    className="cursor-pointer font-bold text-slate-700 h-14 hover:text-blue-600 transition-colors"
                  >
                    Tipo de Material
                    {columnaOrdenada === 'tipo_material' && (orden === 'asc' ? ' ▲' : ' ▼')}
                  </TableHead>
                  <TableHead 
                    onClick={() => onOrdenar('cantidad_disponible')} 
                    className="cursor-pointer font-bold text-slate-700 h-14 hover:text-blue-600 transition-colors"
                  >
                    Cantidad Disponible (m³)
                    {columnaOrdenada === 'cantidad_disponible' && (orden === 'asc' ? ' ▲' : ' ▼')}
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 h-14">Costo Promedio</TableHead>
                  <TableHead className="font-bold text-slate-700 h-14">Valor Total</TableHead>
                  <TableHead className="w-32 font-bold text-slate-700 h-14">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventario.map((item, index) => (
                  <TableRow 
                    key={item.id}
                    className="hover:bg-blue-50/50 transition-colors duration-200"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <TableCell className="font-semibold text-slate-800 py-4">{item.tipo_material}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${item.cantidad_disponible <= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {item.cantidad_disponible.toLocaleString()}
                        </span>
                        {item.cantidad_disponible <= 0 && (
                          <Badge variant="destructive" className="text-xs">
                            Sin Stock
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-semibold text-emerald-600">
                        ${(item.costo_promedio_m3 || 0).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-bold text-purple-600">
                        ${((item.cantidad_disponible * (item.costo_promedio_m3 || 0))).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      {editandoId === item.id ? (
                        <div className="flex gap-2">
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Guardar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-3"
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onEditar(item)}
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
                                    Esta acción eliminará permanentemente el material <span className="font-bold text-slate-800">"{item.tipo_material}"</span> del inventario.
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
                                  onClick={() => onEliminar(item.id)}
                                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar Material
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
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
              <p className="text-xl font-semibold text-slate-600">No hay materiales en inventario</p>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                Agrega nuevos materiales para comenzar a gestionar el inventario
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventarioTable;
