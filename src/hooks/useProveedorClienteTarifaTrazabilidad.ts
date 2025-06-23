
import { useState, useEffect } from 'react';
import { loadProveedores, loadProductosProveedores } from '@/models/Proveedores';
import { loadClientes } from '@/models/Clientes';
import { loadTarifasCliente } from '@/models/TarifasCliente';
import { toast } from 'sonner';

export const useProveedorClienteTarifaTrazabilidad = () => {
  const [trazabilidad, setTrazabilidad] = useState<any[]>([]);
  const [problemasDetectados, setProblemasDetectados] = useState<string[]>([]);

  useEffect(() => {
    verificarTrazabilidad();
  }, []);

  const verificarTrazabilidad = () => {
    console.log('🔍 Verificando trazabilidad proveedor-cliente-tarifas...');
    
    try {
      const proveedores = loadProveedores();
      const productos = loadProductosProveedores();
      const clientes = loadClientes();
      const tarifas = loadTarifasCliente();
      
      console.log('📊 Datos cargados:');
      console.log('- Proveedores:', proveedores.length);
      console.log('- Productos:', productos.length);
      console.log('- Clientes:', clientes.length);
      console.log('- Tarifas:', tarifas.length);

      const problemas: string[] = [];
      const trazabilidadCompleta: any[] = [];

      // Verificar cada tarifa y su relación con proveedores
      tarifas.forEach(tarifa => {
        const cliente = clientes.find(c => c.nombre === tarifa.cliente);
        if (!cliente) {
          problemas.push(`Tarifa ${tarifa.id}: Cliente "${tarifa.cliente}" no encontrado`);
        }

        // Verificar si el origen corresponde a un proveedor
        const proveedorRelacionado = proveedores.find(p => 
          tarifa.origen.includes(p.nombre) || tarifa.origen.includes(p.ciudad)
        );

        if (proveedorRelacionado) {
          const productosProveedor = productos.filter(pr => pr.proveedor_id === proveedorRelacionado.id);
          
          trazabilidadCompleta.push({
            tarifaId: tarifa.id,
            cliente: tarifa.cliente,
            finca: tarifa.finca,
            origen: tarifa.origen,
            destino: tarifa.destino,
            proveedor: proveedorRelacionado,
            productosDisponibles: productosProveedor,
            tarifaCompleta: tarifa
          });
        }
      });

      setTrazabilidad(trazabilidadCompleta);
      setProblemasDetectados(problemas);

      if (problemas.length > 0) {
        console.log('⚠️ Problemas detectados en trazabilidad:', problemas);
        toast.warning(`Se detectaron ${problemas.length} problemas de trazabilidad`);
      } else {
        console.log('✅ Trazabilidad verificada correctamente');
      }

    } catch (error) {
      console.error('❌ Error verificando trazabilidad:', error);
      toast.error('Error verificando trazabilidad de datos');
    }
  };

  const obtenerMaterialesPorProveedor = (proveedorNombre: string) => {
    const proveedores = loadProveedores();
    const productos = loadProductosProveedores();
    
    const proveedor = proveedores.find(p => p.nombre === proveedorNombre);
    if (!proveedor) return [];
    
    return productos.filter(p => p.proveedor_id === proveedor.id);
  };

  const obtenerTarifaPorProveedorCliente = (proveedorNombre: string, cliente: string, finca?: string) => {
    const tarifas = loadTarifasCliente();
    
    return tarifas.find(t => 
      t.cliente === cliente &&
      (finca ? t.finca === finca : true) &&
      t.origen.includes(proveedorNombre)
    );
  };

  return {
    trazabilidad,
    problemasDetectados,
    verificarTrazabilidad,
    obtenerMaterialesPorProveedor,
    obtenerTarifaPorProveedorCliente
  };
};
