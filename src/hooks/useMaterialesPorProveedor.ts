
import { useState, useEffect } from 'react';
import { loadProveedores, loadProductosProveedores } from '@/models/Proveedores';

export const useMaterialesPorProveedor = () => {
  const [materialesPorProveedor, setMaterialesPorProveedor] = useState<{[key: string]: any[]}>({});
  const [proveedoresDisponibles, setProveedoresDisponibles] = useState<any[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    try {
      console.log('📦 Cargando materiales por proveedor...');
      
      const proveedores = loadProveedores();
      const productos = loadProductosProveedores();
      
      console.log('📊 Proveedores cargados:', proveedores.length);
      console.log('📊 Productos cargados:', productos.length);

      setProveedoresDisponibles(proveedores);

      // Organizar materiales por proveedor
      const materialesOrganizados: {[key: string]: any[]} = {};
      
      proveedores.forEach(proveedor => {
        const productosProveedor = productos.filter(p => p.proveedor_id === proveedor.id);
        materialesOrganizados[proveedor.nombre] = productosProveedor;
        
        console.log(`📦 Proveedor "${proveedor.nombre}": ${productosProveedor.length} productos`);
      });

      setMaterialesPorProveedor(materialesOrganizados);
      
    } catch (error) {
      console.error('❌ Error cargando materiales por proveedor:', error);
    }
  };

  const obtenerMaterialesPorNombreProveedor = (nombreProveedor: string) => {
    return materialesPorProveedor[nombreProveedor] || [];
  };

  const obtenerProveedorPorOrigen = (origen: string) => {
    return proveedoresDisponibles.find(p => 
      origen.includes(p.nombre) || origen.includes(p.ciudad)
    );
  };

  const formatearOrigenProveedor = (proveedor: any) => {
    return `${proveedor.nombre} - ${proveedor.ciudad}`;
  };

  return {
    materialesPorProveedor,
    proveedoresDisponibles,
    obtenerMaterialesPorNombreProveedor,
    obtenerProveedorPorOrigen,
    formatearOrigenProveedor,
    cargarDatos
  };
};
