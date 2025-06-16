
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadInventarioAcopio, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { toast } from "sonner";
import { ArrowLeft, Package, History } from 'lucide-react';
import * as XLSX from 'xlsx';
import DesgloseMaterialModal from '@/components/DesgloseMaterialModal';
import MovimientosInventarioTable from '@/components/MovimientosInventarioTable';
import InventarioStats from '@/components/inventario/InventarioStats';
import AgregarMaterialForm from '@/components/inventario/AgregarMaterialForm';
import InventarioTable from '@/components/inventario/InventarioTable';
import EditarMaterialDialog from '@/components/inventario/EditarMaterialDialog';

const InventarioPage: React.FC = () => {
  const navigate = useNavigate();
  const [inventario, setInventario] = useState<any[]>([]);
  const [nuevoMaterial, setNuevoMaterial] = useState({
    tipo_material: '',
    cantidad_disponible: 0,
  });
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [materialEditado, setMaterialEditado] = useState({
    id: '',
    tipo_material: '',
    cantidad_disponible: 0,
  });
  const [orden, setOrden] = useState<'asc' | 'desc'>('asc');
  const [columnaOrdenada, setColumnaOrdenada] = useState<string>('tipo_material');
  const [modalDesgloseOpen, setModalDesgloseOpen] = useState(false);

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = () => {
    const inventarioCargado = loadInventarioAcopio();
    setInventario(inventarioCargado);
  };

  const guardarInventario = (inventarioActualizado: any[]) => {
    saveInventarioAcopio(inventarioActualizado);
    setInventario(inventarioActualizado);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoMaterial(prev => ({ ...prev, [name]: value }));
  };

  const agregarMaterial = () => {
    if (!nuevoMaterial.tipo_material.trim() || nuevoMaterial.cantidad_disponible <= 0) {
      toast.error('Por favor, ingrese un tipo de material y una cantidad válida.');
      return;
    }

    const nuevoItem = {
      id: Date.now().toString(),
      tipo_material: nuevoMaterial.tipo_material,
      cantidad_disponible: parseFloat(nuevoMaterial.cantidad_disponible.toString()),
      costo_promedio_m3: 0,
    };

    const inventarioActualizado = [...inventario, nuevoItem];
    guardarInventario(inventarioActualizado);
    setNuevoMaterial({ tipo_material: '', cantidad_disponible: 0 });
    toast.success('Material agregado al inventario.');
  };

  const handleEditarClick = (item: any) => {
    setEditandoId(item.id);
    setMaterialEditado({
      id: item.id,
      tipo_material: item.tipo_material,
      cantidad_disponible: item.cantidad_disponible,
    });
  };

  const handleEditarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMaterialEditado(prev => ({ ...prev, [name]: value }));
  };

  const guardarEdicion = () => {
    if (!materialEditado.tipo_material.trim() || materialEditado.cantidad_disponible <= 0) {
      toast.error('Por favor, ingrese un tipo de material y una cantidad válida.');
      return;
    }

    const inventarioActualizado = inventario.map(item =>
      item.id === editandoId
        ? {
            ...item,
            tipo_material: materialEditado.tipo_material,
            cantidad_disponible: parseFloat(materialEditado.cantidad_disponible.toString()),
          }
        : item
    );

    guardarInventario(inventarioActualizado);
    setEditandoId(null);
    toast.success('Inventario actualizado.');
  };

  const handleEliminar = (id: string) => {
    const inventarioActualizado = inventario.filter(item => item.id !== id);
    guardarInventario(inventarioActualizado);
    toast.success('Material eliminado del inventario.');
  };

  const ordenarInventario = (columna: string) => {
    if (columnaOrdenada === columna) {
      setOrden(orden === 'asc' ? 'desc' : 'asc');
    } else {
      setColumnaOrdenada(columna);
      setOrden('asc');
    }

    const inventarioOrdenado = [...inventario].sort((a: any, b: any) => {
      const factorOrden = orden === 'asc' ? 1 : -1;

      if (columna === 'cantidad_disponible') {
        return factorOrden * (a[columna] - b[columna]);
      } else {
        return factorOrden * a[columna].localeCompare(b[columna]);
      }
    });

    setInventario(inventarioOrdenado);
  };

  const exportarReporteStock = () => {
    if (inventario.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const exportData = inventario.map(item => ({
      'Tipo de Material': item.tipo_material,
      'Cantidad Disponible (m³)': item.cantidad_disponible,
      'Costo Promedio por m³': item.costo_promedio_m3 ? `$${item.costo_promedio_m3.toLocaleString()}` : '$0',
      'Valor Total Inventario': item.costo_promedio_m3 ? `$${(item.cantidad_disponible * item.costo_promedio_m3).toLocaleString()}` : '$0',
      'Estado': item.cantidad_disponible > 0 ? 'Disponible' : 'Sin Stock',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Stock');
    
    const fileName = `reporte_stock_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Reporte de stock exportado correctamente');
  };

  const generarReporteStock = () => {
    const totalMateriales = inventario.length;
    const materialesConStock = inventario.filter(item => item.cantidad_disponible > 0).length;
    const materialesSinStock = totalMateriales - materialesConStock;
    const valorTotalInventario = inventario.reduce((total, item) => 
      total + (item.cantidad_disponible * (item.costo_promedio_m3 || 0)), 0
    );

    return {
      totalMateriales,
      materialesConStock,
      materialesSinStock,
      valorTotalInventario
    };
  };

  const handleDesgloseRealizado = (movimiento: { cantidadRecebo: number; subproductos: { [key: string]: number } }) => {
    if (!movimiento) return;

    const { cantidadRecebo, subproductos } = movimiento;

    // Buscar Recebo
    const inventarioActual = [...inventario];
    const idxRecebo = inventarioActual.findIndex(i => i.tipo_material.toLowerCase().includes("recebo común"));
    if (idxRecebo === -1) return;

    // Descontar Recebo Común
    inventarioActual[idxRecebo].cantidad_disponible -= cantidadRecebo;

    // Agregar/sumar subproductos al inventario
    Object.entries(subproductos).forEach(([nombre, cantidad]) => {
      if (!cantidad || cantidad <= 0) return;
      const idxSub = inventarioActual.findIndex(i => i.tipo_material === nombre);
      if (idxSub === -1) {
        // Crear nueva línea
        inventarioActual.push({
          id: Date.now().toString() + Math.random().toString().slice(2,7),
          tipo_material: nombre,
          cantidad_disponible: cantidad,
          costo_promedio_m3: 0,
        });
      } else {
        inventarioActual[idxSub].cantidad_disponible += cantidad;
      }
    });

    guardarInventario(inventarioActual);
    cargarInventario();
  };

  const stats = generarReporteStock();

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Inventario de Acopio
            </h1>
            <p className="text-lg text-slate-600">
              Gestiona el inventario de materiales en acopio
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 h-12 px-6 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Volver al panel admin
          </Button>
        </div>
      </div>

      {/* Estadísticas del inventario */}
      <InventarioStats stats={stats} />

      {/* Tabs para organizar el contenido */}
      <Tabs defaultValue="inventario" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger 
            value="inventario" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Package className="h-4 w-4" />
            Gestión de Inventario
          </TabsTrigger>
          <TabsTrigger 
            value="movimientos"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <History className="h-4 w-4" />
            Historial de Movimientos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventario" className="space-y-6">
          <div className="flex justify-end mb-4">
            <Button
              variant="default"
              onClick={() => setModalDesgloseOpen(true)}
              className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white font-semibold px-6 h-10 shadow-lg hover:from-yellow-500 hover:to-yellow-300"
            >
              Desglosar/Transformar Material
            </Button>
          </div>

          {/* Agregar Material */}
          <AgregarMaterialForm
            nuevoMaterial={nuevoMaterial}
            onInputChange={handleInputChange}
            onAgregar={agregarMaterial}
            onExportarReporte={exportarReporteStock}
          />

          {/* Inventario Actual */}
          <InventarioTable
            inventario={inventario}
            editandoId={editandoId}
            orden={orden}
            columnaOrdenada={columnaOrdenada}
            onOrdenar={ordenarInventario}
            onEditar={handleEditarClick}
            onEliminar={handleEliminar}
          />

          {/* Modal de edición */}
          <EditarMaterialDialog
            open={!!editandoId}
            onOpenChange={(open) => !open && setEditandoId(null)}
            materialEditado={materialEditado}
            onInputChange={handleEditarInputChange}
            onGuardar={guardarEdicion}
          />
        </TabsContent>

        <TabsContent value="movimientos">
          <MovimientosInventarioTable />
        </TabsContent>
      </Tabs>

      <DesgloseMaterialModal
        open={modalDesgloseOpen}
        onOpenChange={setModalDesgloseOpen}
        inventario={inventario}
        onDesgloseRealizado={handleDesgloseRealizado}
      />
    </div>
  );
};

export default InventarioPage;
