
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Plus } from 'lucide-react';

interface AgregarMaterialFormProps {
  nuevoMaterial: {
    tipo_material: string;
    cantidad_disponible: number;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAgregar: () => void;
  onExportarReporte: () => void;
}

const AgregarMaterialForm: React.FC<AgregarMaterialFormProps> = ({
  nuevoMaterial,
  onInputChange,
  onAgregar,
  onExportarReporte
}) => {
  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">Agregar Material</CardTitle>
          </div>
          <Button 
            onClick={onExportarReporte} 
            variant="outline" 
            className="flex items-center gap-2 h-12 px-6 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download size={16} />
            Exportar Reporte
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="tipo_material" className="text-slate-700 font-semibold">Tipo de Material</Label>
            <Input
              type="text"
              id="tipo_material"
              name="tipo_material"
              value={nuevoMaterial.tipo_material}
              onChange={onInputChange}
              className="h-12 border-slate-300 focus:border-blue-500"
              placeholder="Ej: Arena fina, Grava"
            />
          </div>
          <div>
            <Label htmlFor="cantidad_disponible" className="text-slate-700 font-semibold">Cantidad Disponible (m³)</Label>
            <Input
              type="number"
              id="cantidad_disponible"
              name="cantidad_disponible"
              value={nuevoMaterial.cantidad_disponible.toString()}
              onChange={onInputChange}
              className="h-12 border-slate-300 focus:border-blue-500"
              placeholder="0"
            />
          </div>
        </div>
        <Button 
          onClick={onAgregar}
          className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5" />
          Agregar Material
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgregarMaterialForm;
