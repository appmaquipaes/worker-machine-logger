
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ClienteDialogForm from "./ClienteDialogForm";
import type { Cliente } from "@/models/Clientes";
import { Edit } from "lucide-react";

interface EditarClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
  form: any;
  tiposPersona: string[];
  tiposCliente: string[];
  onSubmit: (data: any) => void;
}

const EditarClienteDialog: React.FC<EditarClienteDialogProps> = ({
  open,
  onOpenChange,
  cliente,
  form,
  tiposPersona,
  tiposCliente,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] animate-scale-in shadow-xl bg-white border-0 rounded-2xl">
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-800">Editar Cliente</DialogTitle>
              <DialogDescription className="text-slate-600 mt-1">
                Modifica los datos del cliente
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ClienteDialogForm
          form={form}
          tiposPersona={tiposPersona}
          tiposCliente={tiposCliente}
          isEdit={true}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditarClienteDialog;
