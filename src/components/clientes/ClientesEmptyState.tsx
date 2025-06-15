
import React from "react";
import { Users } from "lucide-react";

const ClientesEmptyState = () => (
  <div className="text-center py-12 sm:py-20 animate-fade-in">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 shimmer">
      <Users size={32} className="text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium text-corporate">No hay clientes registrados</h3>
    <p className="text-corporate-muted mt-2">Agrega un nuevo cliente para comenzar</p>
  </div>
);

export default ClientesEmptyState;
