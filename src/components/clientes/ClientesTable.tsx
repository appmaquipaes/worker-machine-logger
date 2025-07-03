
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, Building2, User, Phone, Mail, IdCard } from "lucide-react";
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
}) => (
  <div className="rounded-xl border border-slate-200 overflow-hidden shadow-md bg-white">
    <Table>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-50 hover:to-blue-100 border-b border-blue-200">
          <TableHead className="font-semibold text-blue-700 h-12 px-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Cliente
            </div>
          </TableHead>
          <TableHead className="font-semibold text-blue-700 h-12 px-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Tipo
            </div>
          </TableHead>
          <TableHead className="font-semibold text-blue-700 h-12 px-4">
            <div className="flex items-center gap-2">
              <IdCard className="w-4 h-4" />
              NIT/Cédula
            </div>
          </TableHead>
          <TableHead className="font-semibold text-blue-700 h-12 px-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contacto
            </div>
          </TableHead>
          <TableHead className="font-semibold text-blue-700 h-12 px-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Teléfono
            </div>
          </TableHead>
          <TableHead className="font-semibold text-blue-700 h-12 px-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Proyectos
            </div>
          </TableHead>
          <TableHead className="font-semibold text-blue-700 h-12 px-4">Categoría</TableHead>
          <TableHead className="font-semibold text-blue-700 h-12 px-4 text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente, index) => (
          <TableRow 
            key={cliente.id} 
            className="hover:bg-blue-50/80 transition-colors border-b border-slate-100 h-16"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both'
            }}
          >
            <TableCell className="font-semibold text-slate-800 py-4 px-4">
              <div className="space-y-1">
                <div className="font-bold">{cliente.nombre_cliente}</div>
                <div className="text-sm text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  {cliente.ciudad}
                </div>
              </div>
            </TableCell>
            <TableCell className="py-4 px-4">
              <Badge
                variant={cliente.tipo_persona === 'Empresa' ? 'default' : 'secondary'}
                className="font-semibold px-3 py-1"
              >
                {cliente.tipo_persona === 'Empresa' ? (
                  <Building2 className="w-3 h-3 mr-1" />
                ) : (
                  <User className="w-3 h-3 mr-1" />
                )}
                {cliente.tipo_persona}
              </Badge>
            </TableCell>
            <TableCell className="py-4 px-4">
              <div className="font-mono font-semibold bg-slate-100 px-3 py-2 rounded-lg border">
                {cliente.nit_cedula}
              </div>
            </TableCell>
            <TableCell className="py-4 px-4">
              <div className="space-y-1">
                <div className="font-semibold text-slate-800">{cliente.persona_contacto}</div>
                {cliente.correo_electronico && (
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Mail className="w-3 h-3 text-blue-600" />
                    <span className="truncate max-w-[150px]">{cliente.correo_electronico}</span>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className="py-4 px-4">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-700">{cliente.telefono_contacto}</span>
              </div>
            </TableCell>
            <TableCell className="py-4 px-4">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <div className="p-1 bg-blue-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-700" />
                </div>
                <div className="text-center">
                  <span className="font-bold text-xl text-blue-800 block">{getFincasCount(cliente.id)}</span>
                  <span className="text-xs text-blue-600">proyectos</span>
                </div>
              </div>
            </TableCell>
            <TableCell className="py-4 px-4">
              {cliente.tipo_cliente ? (
                <Badge
                  variant={getTipoClienteColor(cliente.tipo_cliente) as any}
                  className="font-semibold px-3 py-1"
                >
                  {cliente.tipo_cliente}
                </Badge>
              ) : (
                <span className="text-slate-400 italic text-sm">Sin categoría</span>
              )}
            </TableCell>
            <TableCell className="py-4 px-4">
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 transition-colors"
                  onClick={() => openFincasManagement(cliente)}
                  title="Gestionar proyectos"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors"
                  onClick={() => openEditCliente(cliente)}
                  title="Editar cliente"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors"
                      title="Eliminar cliente"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-lg bg-white shadow-xl border-0 rounded-2xl">
                    <AlertDialogHeader className="text-center space-y-4 pb-4">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <Trash2 className="h-8 w-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <AlertDialogTitle className="text-2xl font-bold text-slate-800">
                          ¿Confirmar Eliminación?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600 leading-relaxed">
                          Esta acción eliminará permanentemente el cliente{' '}
                          <span className="font-bold text-slate-800">"{cliente.nombre_cliente}"</span>{' '}
                          y todas sus fincas asociadas.
                          <br />
                          <span className="text-red-600 font-semibold">Esta acción no se puede deshacer.</span>
                        </AlertDialogDescription>
                      </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 pt-4 border-t border-slate-200">
                      <AlertDialogCancel className="h-10 font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCliente(cliente.id)}
                        className="h-10 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Cliente
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
