
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
  <div className="rounded-2xl border-3 border-slate-200 overflow-hidden shadow-2xl bg-white">
    <Table className="text-lg">
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-50 hover:to-blue-100 border-b-3 border-blue-200">
          <TableHead className="font-bold text-blue-700 h-20 text-xl px-8">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6" />
              Cliente
            </div>
          </TableHead>
          <TableHead className="font-bold text-blue-700 h-20 text-xl px-8">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6" />
              Tipo
            </div>
          </TableHead>
          <TableHead className="font-bold text-blue-700 h-20 text-xl px-8">
            <div className="flex items-center gap-3">
              <IdCard className="w-6 h-6" />
              NIT/Cédula
            </div>
          </TableHead>
          <TableHead className="font-bold text-blue-700 h-20 text-xl px-8">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6" />
              Contacto
            </div>
          </TableHead>
          <TableHead className="font-bold text-blue-700 h-20 text-xl px-8">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6" />
              Teléfono
            </div>
          </TableHead>
          <TableHead className="font-bold text-blue-700 h-20 text-xl px-8">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6" />
              Proyectos
            </div>
          </TableHead>
          <TableHead className="font-bold text-blue-700 h-20 text-xl px-8">Categoría</TableHead>
          <TableHead className="font-bold text-blue-700 h-20 text-xl px-8 text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente, index) => (
          <TableRow 
            key={cliente.id} 
            className="hover:bg-blue-50/90 transition-all duration-300 border-b-2 border-slate-100 h-24"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <TableCell className="font-bold text-slate-800 py-8 px-8">
              <div className="space-y-2">
                <div className="text-xl font-bold">{cliente.nombre_cliente}</div>
                <div className="text-lg text-slate-600 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {cliente.ciudad}
                </div>
              </div>
            </TableCell>
            <TableCell className="py-8 px-8">
              <Badge
                variant={cliente.tipo_persona === 'Empresa' ? 'default' : 'secondary'}
                className="text-lg font-bold px-6 py-3 shadow-md"
              >
                {cliente.tipo_persona === 'Empresa' ? (
                  <Building2 className="w-5 h-5 mr-3" />
                ) : (
                  <User className="w-5 h-5 mr-3" />
                )}
                {cliente.tipo_persona}
              </Badge>
            </TableCell>
            <TableCell className="py-8 px-8">
              <div className="font-mono text-xl font-bold bg-slate-100 px-4 py-3 rounded-xl border-2 border-slate-200 shadow-sm">
                {cliente.nit_cedula}
              </div>
            </TableCell>
            <TableCell className="py-8 px-8">
              <div className="space-y-2">
                <div className="font-bold text-xl text-slate-800">{cliente.persona_contacto}</div>
                {cliente.correo_electronico && (
                  <div className="flex items-center gap-2 text-lg text-slate-600">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="truncate max-w-[200px]">{cliente.correo_electronico}</span>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className="py-8 px-8">
              <div className="flex items-center gap-3 bg-green-50 px-4 py-3 rounded-xl border-2 border-green-200">
                <Phone className="w-6 h-6 text-green-600" />
                <span className="font-bold text-xl text-green-700">{cliente.telefono_contacto}</span>
              </div>
            </TableCell>
            <TableCell className="py-8 px-8">
              <div className="flex items-center gap-4 bg-blue-50 px-4 py-3 rounded-xl border-2 border-blue-200">
                <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                  <MapPin className="h-7 w-7 text-blue-700" />
                </div>
                <div className="text-center">
                  <span className="font-bold text-3xl text-blue-800 block">{getFincasCount(cliente.id)}</span>
                  <span className="text-lg text-blue-600 font-medium">proyectos</span>
                </div>
              </div>
            </TableCell>
            <TableCell className="py-8 px-8">
              {cliente.tipo_cliente ? (
                <Badge
                  variant={getTipoClienteColor(cliente.tipo_cliente) as any}
                  className="text-lg font-bold px-6 py-3 shadow-md"
                >
                  {cliente.tipo_cliente}
                </Badge>
              ) : (
                <span className="text-slate-400 italic text-lg font-medium">Sin categoría</span>
              )}
            </TableCell>
            <TableCell className="py-8 px-8">
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-14 w-14 p-0 border-3 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 transition-all duration-300 hover:scale-110 shadow-md"
                  onClick={() => openFincasManagement(cliente)}
                  title="Gestionar proyectos"
                >
                  <MapPin className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-14 w-14 p-0 border-3 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 hover:scale-110 shadow-md"
                  onClick={() => openEditCliente(cliente)}
                  title="Editar cliente"
                >
                  <Edit className="h-6 w-6" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-14 w-14 p-0 border-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-300 hover:scale-110 shadow-md"
                      title="Eliminar cliente"
                    >
                      <Trash2 className="h-6 w-6" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-2xl bg-white shadow-2xl border-0 rounded-3xl">
                    <AlertDialogHeader className="text-center space-y-8 pb-8">
                      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
                        <Trash2 className="h-12 w-12 text-white" />
                      </div>
                      <div className="space-y-4">
                        <AlertDialogTitle className="text-4xl font-bold text-slate-800">
                          ¿Confirmar Eliminación?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xl text-slate-600 leading-relaxed">
                          Esta acción eliminará permanentemente el cliente{' '}
                          <span className="font-bold text-slate-800">"{cliente.nombre_cliente}"</span>{' '}
                          y todas sus fincas asociadas.
                          <br /><br />
                          <span className="text-red-600 font-bold text-xl">
                            Esta acción no se puede deshacer.
                          </span>
                        </AlertDialogDescription>
                      </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-6 pt-8 border-t-2 border-slate-200">
                      <AlertDialogCancel className="flex-1 h-16 text-xl font-bold border-3 border-slate-300 text-slate-700 hover:bg-slate-50">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCliente(cliente.id)}
                        className="flex-1 h-16 bg-red-600 hover:bg-red-700 text-white font-bold text-xl shadow-xl"
                      >
                        <Trash2 className="h-6 w-6 mr-3" />
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
