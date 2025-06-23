
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, Building2, User, Phone, Mail } from "lucide-react";
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
  <div className="rounded-xl border-2 border-slate-200 overflow-hidden shadow-lg bg-white">
    <Table className="text-base">
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-50 hover:to-slate-100 border-b-2 border-slate-200">
          <TableHead className="font-bold text-slate-700 h-16 text-lg px-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Cliente
            </div>
          </TableHead>
          <TableHead className="font-bold text-slate-700 h-16 text-lg px-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Tipo
            </div>
          </TableHead>
          <TableHead className="font-bold text-slate-700 h-16 text-lg px-6">NIT/Cédula</TableHead>
          <TableHead className="font-bold text-slate-700 h-16 text-lg px-6">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contacto
            </div>
          </TableHead>
          <TableHead className="font-bold text-slate-700 h-16 text-lg px-6">Teléfono</TableHead>
          <TableHead className="font-bold text-slate-700 h-16 text-lg px-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Proyectos
            </div>
          </TableHead>
          <TableHead className="font-bold text-slate-700 h-16 text-lg px-6">Categoría</TableHead>
          <TableHead className="font-bold text-slate-700 h-16 text-lg px-6 text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente, index) => (
          <TableRow 
            key={cliente.id} 
            className="hover:bg-blue-50/80 transition-colors duration-200 border-b border-slate-100"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <TableCell className="font-bold text-slate-800 py-6 px-6">
              <div className="space-y-1">
                <div className="text-lg">{cliente.nombre_cliente}</div>
                <div className="text-sm text-slate-600">{cliente.ciudad}</div>
              </div>
            </TableCell>
            <TableCell className="py-6 px-6">
              <Badge
                variant={cliente.tipo_persona === 'Empresa' ? 'default' : 'secondary'}
                className="text-base font-semibold px-4 py-2"
              >
                {cliente.tipo_persona === 'Empresa' ? (
                  <Building2 className="w-4 h-4 mr-2" />
                ) : (
                  <User className="w-4 h-4 mr-2" />
                )}
                {cliente.tipo_persona}
              </Badge>
            </TableCell>
            <TableCell className="py-6 px-6">
              <span className="font-mono text-lg font-semibold bg-slate-100 px-3 py-2 rounded-lg">
                {cliente.nit_cedula}
              </span>
            </TableCell>
            <TableCell className="py-6 px-6">
              <div className="space-y-1">
                <div className="font-semibold text-slate-800">{cliente.persona_contacto}</div>
                {cliente.correo_electronico && (
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Mail className="w-3 h-3" />
                    {cliente.correo_electronico}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className="py-6 px-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-lg">{cliente.telefono_contacto}</span>
              </div>
            </TableCell>
            <TableCell className="py-6 px-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-700" />
                </div>
                <span className="font-bold text-2xl text-blue-800">{getFincasCount(cliente.id)}</span>
                <span className="text-sm text-slate-600">proyectos</span>
              </div>
            </TableCell>
            <TableCell className="py-6 px-6">
              {cliente.tipo_cliente ? (
                <Badge
                  variant={getTipoClienteColor(cliente.tipo_cliente) as any}
                  className="text-base font-semibold px-4 py-2 shadow-sm"
                >
                  {cliente.tipo_cliente}
                </Badge>
              ) : (
                <span className="text-slate-400 italic text-base">Sin categoría</span>
              )}
            </TableCell>
            <TableCell className="py-6 px-6">
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 w-12 p-0 border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                  onClick={() => openFincasManagement(cliente)}
                  title="Gestionar proyectos"
                >
                  <MapPin className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 w-12 p-0 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  onClick={() => openEditCliente(cliente)}
                  title="Editar cliente"
                >
                  <Edit className="h-5 w-5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-12 w-12 p-0 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                      title="Eliminar cliente"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-lg bg-white shadow-2xl border-0 rounded-2xl">
                    <AlertDialogHeader className="text-center space-y-6 pb-6">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg">
                        <Trash2 className="h-10 w-10 text-white" />
                      </div>
                      <div className="space-y-3">
                        <AlertDialogTitle className="text-3xl font-bold text-slate-800">
                          ¿Confirmar Eliminación?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-lg text-slate-600 leading-relaxed">
                          Esta acción eliminará permanentemente el cliente{' '}
                          <span className="font-bold text-slate-800">"{cliente.nombre_cliente}"</span>{' '}
                          y todas sus fincas asociadas.
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
                        onClick={() => handleDeleteCliente(cliente.id)}
                        className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg"
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
