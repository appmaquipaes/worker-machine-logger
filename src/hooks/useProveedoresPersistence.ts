
import { useState, useEffect } from 'react';
import { Proveedor, ProductoProveedor } from '@/models/Proveedores';
import { useDataPersistence } from '@/hooks/useDataPersistence';
import { toast } from "sonner";

export const useProveedoresPersistence = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productosProveedores, setProductosProveedores] = useState<ProductoProveedor[]>([]);
  const { saveToLocalStorage, loadFromLocalStorage } = useDataPersistence();

  useEffect(() => {
    loadProveedoresData();
    loadProductosData();
  }, []);

  const loadProveedoresData = () => {
    try {
      const storedProveedores = loadFromLocalStorage('proveedores', []);
      if (storedProveedores && storedProveedores.length > 0) {
        const parsedProveedores = storedProveedores.map((proveedor: any) => ({
          ...proveedor,
          fecha_registro: new Date(proveedor.fecha_registro)
        }));
        setProveedores(parsedProveedores);
        console.log('✅ Proveedores cargados:', parsedProveedores.length);
      }
    } catch (error) {
      console.error('❌ Error cargando proveedores:', error);
      toast.error('Error cargando proveedores');
    }
  };

  const loadProductosData = () => {
    try {
      const storedProductos = loadFromLocalStorage('productos_proveedores', []);
      if (storedProductos && storedProductos.length > 0) {
        setProductosProveedores(storedProductos);
        console.log('✅ Productos de proveedores cargados:', storedProductos.length);
      }
    } catch (error) {
      console.error('❌ Error cargando productos de proveedores:', error);
      toast.error('Error cargando productos de proveedores');
    }
  };

  const saveProveedores = (newProveedores: Proveedor[]) => {
    console.log('💾 Guardando proveedores:', newProveedores.length);
    setProveedores(newProveedores);
    const guardadoExitoso = saveToLocalStorage('proveedores', newProveedores);
    if (!guardadoExitoso) {
      toast.error('Error guardando proveedores');
      return false;
    }
    console.log('✅ Proveedores guardados exitosamente');
    return true;
  };

  const saveProductosProveedores = (newProductos: ProductoProveedor[]) => {
    console.log('💾 Guardando productos de proveedores:', newProductos.length);
    setProductosProveedores(newProductos);
    const guardadoExitoso = saveToLocalStorage('productos_proveedores', newProductos);
    if (!guardadoExitoso) {
      toast.error('Error guardando productos de proveedores');
      return false;
    }
    console.log('✅ Productos de proveedores guardados exitosamente');
    return true;
  };

  const addProveedor = (proveedor: Proveedor) => {
    const updatedProveedores = [...proveedores, proveedor];
    return saveProveedores(updatedProveedores);
  };

  const addProductoProveedor = (producto: ProductoProveedor) => {
    const updatedProductos = [...productosProveedores, producto];
    return saveProductosProveedores(updatedProductos);
  };

  const updateProveedor = (id: string, updatedProveedor: Partial<Proveedor>) => {
    const updatedProveedores = proveedores.map(proveedor =>
      proveedor.id === id ? { ...proveedor, ...updatedProveedor } : proveedor
    );
    return saveProveedores(updatedProveedores);
  };

  const deleteProveedor = (id: string) => {
    const updatedProveedores = proveedores.filter(proveedor => proveedor.id !== id);
    // También eliminar productos asociados
    const updatedProductos = productosProveedores.filter(producto => producto.proveedor_id !== id);
    saveProveedores(updatedProveedores);
    saveProductosProveedores(updatedProductos);
  };

  return {
    proveedores,
    productosProveedores,
    addProveedor,
    addProductoProveedor,
    updateProveedor,
    deleteProveedor,
    loadProveedoresData,
    loadProductosData
  };
};
