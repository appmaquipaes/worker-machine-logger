
import React from "react";
import { MapPin } from "lucide-react";

const FincasEmptyState = () => (
  <div className="text-center py-10 sm:py-16 animate-fade-in text-muted-foreground">
    <MapPin className="mx-auto h-10 w-10 mb-3 text-blue-300" />
    <h3 className="text-lg font-medium text-corporate">No hay fincas registradas</h3>
    <p className="mt-2 text-corporate-muted">Agrega una nueva finca para este cliente</p>
  </div>
);

export default FincasEmptyState;
