
import React from 'react';
import { Machine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Truck, Wrench, Building, Loader2, Database, AlertTriangle } from 'lucide-react';

interface MachineTableProps {
  machines: Machine[];
  onDeleteMachine: (id: string) => void;
}

const MachineTable: React.FC<MachineTableProps> = ({ machines, onDeleteMachine }) => {
  const getMachineIcon = (type: string) => {
    switch (type) {
      case 'Camión':
      case 'Volqueta':
      case 'Camabaja':
      case 'Semirremolque':
      case 'Tractomula':
        return <Truck className="h-4 w-4" />;
      case 'Excavadora':
      case 'Bulldozer':
      case 'Motoniveladora':
      case 'Paladraga':
        return <Building className="h-4 w-4" />;
      case 'Cargador':
      case 'Compactador':
        return <Loader2 className="h-4 w-4" />;
      default:
        return <Wrench className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Machine['status']) => {
    switch (status) {
      case 'Disponible':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white shadow-sm">Disponible</Badge>;
      case 'En Uso':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm">En Uso</Badge>;
      case 'Mantenimiento':
        return <Badge variant="destructive" className="shadow-sm">Mantenimiento</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Inventario de Máquinas y Vehículos</CardTitle>
            <CardDescription className="text-blue-50 mt-1">
              Gestiona el catálogo completo de equipos registrados en el sistema
            </CardDescription>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-blue-100 text-sm font-medium">{machines.length} equipos registrados</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {machines.length > 0 ? (
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-bold text-slate-700 h-14">Tipo</TableHead>
                  <TableHead className="font-bold text-slate-700 h-14">Nombre</TableHead>
                  <TableHead className="font-bold text-slate-700 h-14">Placa</TableHead>
                  <TableHead className="font-bold text-slate-700 h-14">Estado</TableHead>
                  <TableHead className="w-24 font-bold text-slate-700 h-14">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((machine, index) => (
                  <TableRow 
                    key={machine.id}
                    className="hover:bg-blue-50/50 transition-colors duration-200"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getMachineIcon(machine.type)}
                        </div>
                        <span className="font-medium text-slate-700">{machine.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800 py-4">{machine.name}</TableCell>
                    <TableCell className="py-4">
                      {machine.plate ? (
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-mono text-sm">
                          {machine.plate}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">{getStatusBadge(machine.status)}</TableCell>
                    <TableCell className="py-4">
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
                                Esta acción eliminará permanentemente <span className="font-bold text-slate-800">{machine.type.toLowerCase()} {machine.name}</span> del sistema.
                                <br /><br />
                                Los reportes asociados a esta máquina podrían verse afectados. Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </div>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-3 pt-6 border-t border-slate-200">
                            <AlertDialogCancel className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteMachine(machine.id)}
                              className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar Máquina
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Wrench className="w-12 h-12 text-slate-400" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-slate-600">No hay máquinas registradas</p>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                Utiliza el formulario superior para agregar la primera máquina al inventario del sistema
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MachineTable;
