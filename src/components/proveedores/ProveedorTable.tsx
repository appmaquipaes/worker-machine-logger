
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Building, AlertTriangle, Package, Mail, Phone } from 'lucide-react';
import { Proveedor } from '@/models/Proveedores';

interface ProveedorTableProps {
  proveedores: Proveedor[];
  onEdit: (proveedor: Proveedor) => void;
  onDelete: (id: string) => void;
  onSelect: (proveedor: Proveedor) => void;
  getProductosCount: (proveedorId: string) => number;
}

const ProveedorTable: React.FC<ProveedorTableProps> = ({ 
  proveedores, 
  onEdit, 
  onDelete, 
  onSelect, 
  getProductosCount 
}) => {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Materiales': return '🏗️';
      case 'Lubricantes': return '🛢️';
      case 'Repuestos': return '🔧';
      case 'Servicios': return '⚙️';
      default: return '📦';
    }
  };

  const getTipoBadgeVariant = (tipo: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (tipo) {
      case 'Materiales': return 'default';
      case 'Lubricantes': return 'secondary';
      case 'Repuestos': return 'outline';
      case 'Servicios': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <>
      {proveedores.length > 0 ? (
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-50 hover:to-slate-100">
                <TableHead className="font-bold text-slate-700 h-16 text-base">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Proveedor
                  </div>
                </TableHead>
                <TableHead className="font-bold text-slate-700 h-16 text-base">Ciudad</TableHead>
                <TableHead className="font-bold text-slate-700 h-16 text-base">Tipo</TableHead>
                <TableHead className="font-bold text-slate-700 h-16 text-base">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contacto
                  </div>
                </TableHead>
                <TableHead className="font-bold text-slate-700 h-16 text-base">NIT</TableHead>
                <TableHead className="font-bold text-slate-700 h-16 text-base">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Productos
                  </div>
                </TableHead>
                <TableHead className="w-48 font-bold text-slate-700 h-16 text-base text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proveedores.map((proveedor, index) => (
                <TableRow 
                  key={proveedor.id}
                  className="hover:bg-emerald-50/50 transition-colors duration-200 border-b border-slate-100"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <TableCell className="py-6">
                    <div className="space-y-2">
                      <div className="font-bold text-slate-800 text-lg">{proveedor.nombre}</div>
                      {proveedor.correo_electronico && (
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <Mail className="w-3 h-3" />
                          <span>{proveedor.correo_electronico}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <span className="text-slate-700 font-medium text-base">{proveedor.ciudad}</span>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge 
                      variant={getTipoBadgeVariant(proveedor.tipo_proveedor)} 
                      className="text-sm font-medium px-3 py-1"
                    >
                      <span className="mr-2">{getTipoIcon(proveedor.tipo_proveedor)}</span>
                      {proveedor.tipo_proveedor}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-1">
                      <div className="font-medium text-slate-800">{proveedor.contacto}</div>
                      {proveedor.telefono && (
                        <div className="text-slate-600 text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {proveedor.telefono}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <span className="bg-slate-100 px-3 py-2 rounded-lg text-slate-700 font-mono text-sm font-medium">
                      {proveedor.nit}
                    </span>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-600" />
                      <span className="text-base text-emerald-600 font-bold">
                        {getProductosCount(proveedor.id)}
                      </span>
                      <span className="text-slate-600 text-sm">
                        producto{getProductosCount(proveedor.id) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelect(proveedor)}
                        className="h-10 w-10 p-0 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                        title="Ver productos"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(proveedor)}
                        className="h-10 w-10 p-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                        title="Editar proveedor"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-10 w-10 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                            title="Eliminar proveedor"
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
                                Esta acción eliminará permanentemente el proveedor{' '}
                                <span className="font-bold text-slate-800">"{proveedor.nombre}"</span>{' '}
                                y todos sus productos asociados.
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
                              onClick={() => onDelete(proveedor.id)}
                              className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar Proveedor
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
            <Building className="w-16 h-16 text-slate-400" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-600">No hay proveedores registrados</h3>
            <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
              Comienza agregando un nuevo proveedor para gestionar tu red de suministro de manera efectiva
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProveedorTable;
