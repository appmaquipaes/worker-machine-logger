
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
  <div className="rounded-xl border-2 border-slate-200 overflow-hidden shadow-lg bg-white">
    <Table className="text-base">
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-50 hover:to-green-100 border-b-2 border-green-200">
          <TableHead className="font-bold text-green-700 h-16 text-lg px-6">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Nombre del Proyecto/Finca
            </div>
          </TableHead>
          <TableHead className="font-bold text-green-700 h-16 text-lg px-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ciudad
            </div>
          </TableHead>
          <TableHead className="font-bold text-green-700 h-16 text-lg px-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Contacto
            </div>
          </TableHead>
          <TableHead className="font-bold text-green-700 h-16 text-lg px-6">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Teléfono
            </div>
          </TableHead>
          <TableHead className="font-bold text-green-700 h-16 text-lg px-6 text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fincas.map((finca, index) => (
          <TableRow 
            key={finca.id} 
            className="hover:bg-green-50/70 transition-colors duration-200 border-b border-slate-100"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <TableCell className="font-bold text-slate-800 py-6 px-6">
              <div className="space-y-1">
                <div className="text-lg">{finca.nombre_finca}</div>
                {finca.notas && (
                  <div className="text-sm text-slate-600 max-w-xs truncate">{finca.notas}</div>
                )}
              </div>
            </TableCell>
            <TableCell className="py-6 px-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-lg">{finca.ciudad}</span>
              </div>
            </TableCell>
            <TableCell className="py-6 px-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-lg">{finca.contacto_nombre}</span>
              </div>
            </TableCell>
            <TableCell className="py-6 px-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-lg">{finca.contacto_telefono}</span>
              </div>
            </TableCell>
            <TableCell className="py-6 px-6">
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-12 w-12 p-0 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  onClick={() => onEdit(finca)}
                  title="Editar proyecto"
                >
                  <Edit className="h-5 w-5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-12 w-12 p-0 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                      title="Eliminar proyecto"
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
                          Esta acción eliminará permanentemente el proyecto{' '}
                          <span className="font-bold text-slate-800">"{finca.nombre_finca}"</span>.
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
                        onClick={() => onDelete(finca.id)}
                        className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
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
