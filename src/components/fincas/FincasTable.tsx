
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
  <div className="rounded-xl border border-slate-200 overflow-hidden shadow-md bg-white">
    <Table>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-50 hover:to-green-100 border-b border-green-200">
          <TableHead className="font-semibold text-green-700 h-12 px-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Proyecto/Finca
            </div>
          </TableHead>
          <TableHead className="font-semibold text-green-700 h-12 px-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ciudad
            </div>
          </TableHead>
          <TableHead className="font-semibold text-green-700 h-12 px-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Contacto
            </div>
          </TableHead>
          <TableHead className="font-semibold text-green-700 h-12 px-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Teléfono
            </div>
          </TableHead>
          <TableHead className="font-semibold text-green-700 h-12 px-4 text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fincas.map((finca, index) => (
          <TableRow 
            key={finca.id} 
            className="hover:bg-green-50/80 transition-colors border-b border-slate-100 h-16"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both'
            }}
          >
            <TableCell className="font-semibold text-slate-800 py-4 px-4">
              <div className="space-y-1">
                <div className="font-bold">{finca.nombre_finca}</div>
                {finca.notas && (
                  <div className="text-sm text-slate-600 max-w-xs truncate bg-slate-50 px-2 py-1 rounded border">
                    {finca.notas}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className="py-4 px-4">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-700">{finca.ciudad}</span>
              </div>
            </TableCell>
            <TableCell className="py-4 px-4">
              <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                <User className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-700">{finca.contacto_nombre}</span>
              </div>
            </TableCell>
            <TableCell className="py-4 px-4">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-700">{finca.contacto_telefono}</span>
              </div>
            </TableCell>
            <TableCell className="py-4 px-4">
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors"
                  onClick={() => onEdit(finca)}
                  title="Editar proyecto"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors"
                      title="Eliminar proyecto"
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
                          Esta acción eliminará permanentemente el proyecto{' '}
                          <span className="font-bold text-slate-800">"{finca.nombre_finca}"</span>.
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
                        onClick={() => onDelete(finca.id)}
                        className="h-10 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
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
