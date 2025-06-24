
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, MapPin, Building, Phone, User } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Finca } from "@/models/Fincas";

interface FincasTableProps {
  fincas: Finca[];
  onEdit: (f: Finca) => void;
  onDelete: (id: string) => void;
}

const FincasTable: React.FC<FincasTableProps> = ({ fincas, onEdit, onDelete }) => (
  <div className="rounded-2xl border-3 border-slate-200 overflow-hidden shadow-2xl bg-white">
    <Table className="text-lg">
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-50 hover:to-green-100 border-b-3 border-green-200">
          <TableHead className="font-bold text-green-700 h-20 text-xl px-8">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6" />
              Nombre del Proyecto/Finca
            </div>
          </TableHead>
          <TableHead className="font-bold text-green-700 h-20 text-xl px-8">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6" />
              Ciudad
            </div>
          </TableHead>
          <TableHead className="font-bold text-green-700 h-20 text-xl px-8">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6" />
              Contacto
            </div>
          </TableHead>
          <TableHead className="font-bold text-green-700 h-20 text-xl px-8">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6" />
              Teléfono
            </div>
          </TableHead>
          <TableHead className="font-bold text-green-700 h-20 text-xl px-8 text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fincas.map((finca, index) => (
          <TableRow 
            key={finca.id} 
            className="hover:bg-green-50/80 transition-all duration-300 border-b-2 border-slate-100 h-24"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <TableCell className="font-bold text-slate-800 py-8 px-8">
              <div className="space-y-2">
                <div className="text-xl font-bold">{finca.nombre_finca}</div>
                {finca.notas && (
                  <div className="text-lg text-slate-600 max-w-md truncate bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                    {finca.notas}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className="py-8 px-8">
              <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-xl border-2 border-blue-200">
                <MapPin className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-xl text-blue-700">{finca.ciudad}</span>
              </div>
            </TableCell>
            <TableCell className="py-8 px-8">
              <div className="flex items-center gap-3 bg-purple-50 px-4 py-3 rounded-xl border-2 border-purple-200">
                <User className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-xl text-purple-700">{finca.contacto_nombre}</span>
              </div>
            </TableCell>
            <TableCell className="py-8 px-8">
              <div className="flex items-center gap-3 bg-green-50 px-4 py-3 rounded-xl border-2 border-green-200">
                <Phone className="w-6 h-6 text-green-600" />
                <span className="font-bold text-xl text-green-700">{finca.contacto_telefono}</span>
              </div>
            </TableCell>
            <TableCell className="py-8 px-8">
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-14 w-14 p-0 border-3 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 hover:scale-110 shadow-md"
                  onClick={() => onEdit(finca)}
                  title="Editar proyecto"
                >
                  <Edit className="h-6 w-6" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-14 w-14 p-0 border-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-300 hover:scale-110 shadow-md"
                      title="Eliminar proyecto"
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
                          Esta acción eliminará permanentemente el proyecto{' '}
                          <span className="font-bold text-slate-800">"{finca.nombre_finca}"</span>.
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
                        onClick={() => onDelete(finca.id)}
                        className="flex-1 h-16 bg-red-600 hover:bg-red-700 text-white font-bold text-xl shadow-xl"
                      >
                        <Trash2 className="h-6 w-6 mr-3" />
                        Eliminar Proyecto
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

export default FincasTable;
