
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface ClientesTableProps {
  clientes: any[];
  getFincasCount: (clienteId: string) => number;
  getTipoClienteColor: (tipo?: string) => string;
  openFincasManagement: (cliente: any) => void;
  openEditCliente: (cliente: any) => void;
  handleDeleteCliente: (id: string) => void;
  form: any;
  tiposPersona: string[];
  tiposCliente: string[];
  handleUpdateCliente: (data: any) => void;
}

const ClientesTable: React.FC<ClientesTableProps> = ({
  clientes,
  getFincasCount,
  getTipoClienteColor,
  openFincasManagement,
  openEditCliente,
  handleDeleteCliente,
  form,
  tiposPersona,
  tiposCliente,
  handleUpdateCliente,
}) => (
  <div className="rounded-md border overflow-hidden bg-white/90 backdrop-blur-sm">
    <Table className="text-corporate">
      <TableHeader className="bg-slate-50/80">
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>NIT/Cédula</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Fincas</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <TableRow key={cliente.id} className="hover:bg-blue-50/50 transition-colors">
            <TableCell className="font-medium">{cliente.nombre_cliente}</TableCell>
            <TableCell>
              <Badge
                variant={cliente.tipo_persona === 'Empresa' ? 'default' : 'secondary'}
                className="status-badge"
              >
                {cliente.tipo_persona}
              </Badge>
            </TableCell>
            <TableCell>{cliente.nit_cedula}</TableCell>
            <TableCell>{cliente.persona_contacto}</TableCell>
            <TableCell>{cliente.telefono_contacto}</TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80">
                <MapPin className="h-4 w-4 text-blue-800" />
                <span className="font-semibold text-blue-900">{getFincasCount(cliente.id)}</span>
              </span>
            </TableCell>
            <TableCell>
              {cliente.tipo_cliente ? (
                <Badge
                  variant={getTipoClienteColor(cliente.tipo_cliente) as any}
                  className="uppercase shadow status-badge"
                >
                  {cliente.tipo_cliente}
                </Badge>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  className="btn-outline-large btn-press w-9 h-9 p-0"
                  onClick={() => openFincasManagement(cliente)}
                  title="Gestionar fincas"
                >
                  <MapPin />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="btn-outline-large btn-press w-9 h-9 p-0"
                      onClick={() => openEditCliente(cliente)}
                    >
                      <Edit />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>Editar Cliente</DialogTitle>
                      <DialogDescription>
                        Modifica los datos del cliente
                      </DialogDescription>
                    </DialogHeader>
                    {/* Se reusa ClienteDialogForm en el padre */}
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="btn-outline-large btn-press w-9 h-9 p-0"
                    >
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará permanentemente el cliente "{cliente.nombre_cliente}" y todas sus fincas asociadas.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCliente(cliente.id)}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Eliminar
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
);

export default ClientesTable;
