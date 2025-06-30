
import React, { createContext, useContext, useEffect } from 'react';
import { useEnhancedInventoryManager } from '@/hooks/useEnhancedInventoryManager';
import { useEnhancedMaterialsManager } from '@/hooks/useEnhancedMaterialsManager';
import { InventarioAcopio } from '@/models/InventarioAcopio';
import { Material } from '@/models/Materiales';

type InventoryMaterialsContextType = {
  // Inventario
  inventario: InventarioAcopio[];
  isLoadingInventario: boolean;
  addInventarioItem: (itemData: Omit<InventarioAcopio, 'id'>) => Promise<boolean>;
  updateInventarioItem: (id: string, updatedItem: Partial<InventarioAcopio>) => Promise<boolean>;
  deleteInventarioItem: (id: string) => Promise<boolean>;
  getItemByMaterial: (tipoMaterial: string) => InventarioAcopio | undefined;
  
  // Materiales
  materiales: Material[];
  isLoadingMateriales: boolean;
  addMaterial: (materialData: Omit<Material, 'id'>) => Promise<boolean>;
  updateMaterial: (id: string, updatedMaterial: Partial<Material>) => Promise<boolean>;
  deleteMaterial: (id: string) => Promise<boolean>;
  getMaterialByName: (nombreMaterial: string) => Material | undefined;
  
  // Utilidades
  reloadData: () => Promise<void>;
};

const InventoryMaterialsContext = createContext<InventoryMaterialsContextType | undefined>(undefined);

export const useInventoryMaterials = () => {
  const context = useContext(InventoryMaterialsContext);
  if (!context) {
    throw new Error('useInventoryMaterials debe ser utilizado dentro de un InventoryMaterialsProvider');
  }
  return context;
};

export const InventoryMaterialsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    inventario,
    isLoading: isLoadingInventario,
    loadInventario,
    addInventarioItem: enhancedAddInventarioItem,
    updateInventarioItem: enhancedUpdateInventarioItem,
    deleteInventarioItem: enhancedDeleteInventarioItem,
    getItemByMaterial
  } = useEnhancedInventoryManager();

  const {
    materiales,
    isLoading: isLoadingMateriales,
    loadMateriales,
    addMaterial: enhancedAddMaterial,
    updateMaterial: enhancedUpdateMaterial,
    deleteMaterial: enhancedDeleteMaterial,
    getMaterialByName
  } = useEnhancedMaterialsManager();

  useEffect(() => {
    loadInventario();
    loadMateriales();
  }, []);

  const addInventarioItem = async (itemData: Omit<InventarioAcopio, 'id'>) => {
    return await enhancedAddInventarioItem(itemData);
  };

  const updateInventarioItem = async (id: string, updatedItem: Partial<InventarioAcopio>) => {
    return await enhancedUpdateInventarioItem(id, updatedItem);
  };

  const deleteInventarioItem = async (id: string) => {
    return await enhancedDeleteInventarioItem(id);
  };

  const addMaterial = async (materialData: Omit<Material, 'id'>) => {
    return await enhancedAddMaterial(materialData);
  };

  const updateMaterial = async (id: string, updatedMaterial: Partial<Material>) => {
    return await enhancedUpdateMaterial(id, updatedMaterial);
  };

  const deleteMaterial = async (id: string) => {
    return await enhancedDeleteMaterial(id);
  };

  const reloadData = async () => {
    await Promise.all([loadInventario(), loadMateriales()]);
  };

  const value = {
    // Inventario
    inventario,
    isLoadingInventario,
    addInventarioItem,
    updateInventarioItem,
    deleteInventarioItem,
    getItemByMaterial,
    
    // Materiales
    materiales,
    isLoadingMateriales,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialByName,
    
    // Utilidades
    reloadData
  };

  return (
    <InventoryMaterialsContext.Provider value={value}>
      {children}
    </InventoryMaterialsContext.Provider>
  );
};
