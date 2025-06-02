
import React from 'react';
import { Machine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Truck, Wrench, Building, Loader2 } from 'lucide-react';

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
      case 'available':
        return <Badge variant="default" className="bg-green-500">Disponible</Badge>;
      case 'in-use':
        return <Badge variant="secondary" className="bg-yellow-500">En uso</Badge>;
      case 'maintenance':
        return <Badge variant="destructive">Mantenimiento</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listado de Máquinas y Vehículos</CardTitle>
        <CardDescription>
          Gestionar las máquinas y vehículos registrados en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {machines.length > 0 ? (
          <div className="rounded-md border overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMachineIcon(machine.type)}
                        <span>{machine.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{machine.name}</TableCell>
                    <TableCell>{machine.plate || '-'}</TableCell>
                    <TableCell>{getStatusBadge(machine.status)}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente {machine.type.toLowerCase()} {machine.name}.
                              Los reportes asociados a esta máquina podrían verse afectados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteMachine(machine.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Eliminar
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
          <div className="text-center py-10">
            <p className="text-muted-foreground">No hay máquinas registradas</p>
            <p className="text-sm text-muted-foreground mt-2">
              Utiliza el formulario superior para agregar la primera máquina
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MachineTable;
