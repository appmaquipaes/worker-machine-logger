
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ClienteDialogForm from "./ClienteDialogForm";
import type { Cliente } from "@/models/Clientes";
import { Edit, User } from "lucide-react";

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
      <DialogContent className="sm:max-w-[900px] animate-scale-in shadow-2xl bg-white border-0 rounded-3xl">
        <DialogHeader className="space-y-6 pb-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl">
              <Edit className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold text-slate-800">Editar Cliente</DialogTitle>
              <DialogDescription className="text-xl text-slate-600 mt-2">
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
