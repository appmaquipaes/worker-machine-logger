
import { useState, useEffect } from 'react';
import { loadProveedores, getUniqueProviderMaterialTypes } from '@/models/Proveedores';

export const useReportFormData = () => {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [tiposMaterial, setTiposMaterial] = useState<string[]>([]);
  const [inventarioAcopio, setInventarioAcopio] = useState<any[]>([]);
  
  useEffect(() => {
    setProveedores(loadProveedores());
    setTiposMaterial(getUniqueProviderMaterialTypes());
    
    const inventario = localStorage.getItem('inventario_acopio');
    if (inventario) {
      setInventarioAcopio(JSON.parse(inventario));
    }
  }, []);

  return {
    proveedores,
    tiposMaterial,
    inventarioAcopio
  };
};
