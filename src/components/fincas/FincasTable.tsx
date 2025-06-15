
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Finca } from "@/models/Fincas";

interface FincasTableProps {
  fincas: Finca[];
  onEdit: (f: Finca) => void;
  onDelete: (id: string) => void;
}

const FincasTable: React.FC<FincasTableProps> = ({ fincas, onEdit, onDelete }) => (
  <div className="rounded-md border overflow-hidden bg-white/90 backdrop-blur-sm animate-fade-in mt-2">
    <Table className="text-corporate">
      <TableHeader className="bg-slate-50/80">
        <TableRow>
          <TableHead>Nombre de la Finca</TableHead>
          <TableHead>Ciudad</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fincas.map((finca) => (
          <TableRow key={finca.id} className="hover:bg-blue-50/50 transition-colors">
            <TableCell className="font-medium">{finca.nombre_finca}</TableCell>
            <TableCell>{finca.ciudad}</TableCell>
            <TableCell>{finca.contacto_nombre}</TableCell>
            <TableCell>{finca.contacto_telefono}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="btn-outline-large btn-press w-9 h-9 p-0"
                  onClick={() => onEdit(finca)}
                  title="Editar finca"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="btn-outline-large btn-press w-9 h-9 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará permanentemente la finca <b>{finca.nombre_finca}</b>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(finca.id)}
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

export default FincasTable;
