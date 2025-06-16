
import { useState, useEffect } from 'react';
import { loadProveedores, getUniqueProviderMaterialTypes } from '@/models/Proveedores';
import { loadMateriales } from '@/models/Materiales';

export const useReportFormData = () => {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [tiposMaterial, setTiposMaterial] = useState<string[]>([]);
  const [inventarioAcopio, setInventarioAcopio] = useState<any[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);
  
  useEffect(() => {
    setProveedores(loadProveedores());
    
    // Combinar tipos de material de proveedores y materiales propios
    const tiposProveedores = getUniqueProviderMaterialTypes();
    const materialesPropios = loadMateriales();
    const tiposMaterialesPropios = materialesPropios.map(m => m.nombre_material);
    
    // Unir ambos arrays y eliminar duplicados
    const todosLosTipos = [...new Set([...tiposProveedores, ...tiposMaterialesPropios])];
    setTiposMaterial(todosLosTipos);
    setMateriales(materialesPropios);
    
    const inventario = localStorage.getItem('inventario_acopio');
    if (inventario) {
      setInventarioAcopio(JSON.parse(inventario));
    }
  }, []);

  return {
    proveedores,
    tiposMaterial,
    inventarioAcopio,
    materiales
  };
};
