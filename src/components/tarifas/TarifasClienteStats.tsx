
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users } from "lucide-react";

interface StatsProps {
  totalTarifas: number;
  totalClientes: number;
  promedioAlquilerHora: string;
}

const TarifasClienteStats: React.FC<StatsProps> = ({
  totalTarifas,
  totalClientes,
  promedioAlquilerHora,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Total Tarifas</p>
            <p className="text-3xl font-bold text-blue-700">{totalTarifas}</p>
          </div>
          <div className="p-3 bg-blue-200 rounded-xl">
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium">Clientes con Tarifas</p>
            <p className="text-3xl font-bold text-green-700">{totalClientes}</p>
          </div>
          <div className="p-3 bg-green-200 rounded-xl">
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 text-sm font-medium">Tarifa Promedio Alquiler (hora)</p>
            <p className="text-3xl font-bold text-purple-700">{promedioAlquilerHora}</p>
          </div>
          <div className="p-3 bg-purple-200 rounded-xl">
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default TarifasClienteStats;
