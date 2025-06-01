
import React from 'react';
import { Machine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface MachineTableProps {
  machines: Machine[];
  onDeleteMachine: (id: string) => void;
}

const MachineTable: React.FC<MachineTableProps> = ({ machines, onDeleteMachine }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Listado de Máquinas</CardTitle>
        <CardDescription>
          Gestionar las máquinas existentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {machines.length > 0 ? (
          <div className="rounded-md border overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="w-24">Placa</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell>{machine.id}</TableCell>
                    <TableCell className="font-medium">{machine.name}</TableCell>
                    <TableCell>{machine.type}</TableCell>
                    <TableCell>{machine.plate || '-'}</TableCell>
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
                              Esta acción eliminará permanentemente la máquina {machine.name}.
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MachineTable;
