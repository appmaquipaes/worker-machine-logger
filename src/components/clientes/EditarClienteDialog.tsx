
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ClienteDialogForm from "./ClienteDialogForm";
import type { Cliente } from "@/models/Clientes";

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
      <DialogContent className="sm:max-w-[700px] animate-scale-in corporate-card shadow-2xl bg-background border">
        <DialogHeader>
          <DialogTitle className="text-responsive-lg font-bold">Editar Cliente</DialogTitle>
          <DialogDescription className="text-corporate-muted">
            Modifica los datos del cliente
          </DialogDescription>
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
