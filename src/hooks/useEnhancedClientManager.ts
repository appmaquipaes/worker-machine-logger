
import { useState, useEffect } from 'react';
import { useUnifiedDataManager } from './useUnifiedDataManager';
import { supabase } from '@/integrations/supabase/client';
import { Cliente } from '@/models/Clientes';

export const useEnhancedClientManager = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { readData, writeData } = useUnifiedDataManager();

  // Cargar clientes usando el sistema unificado
  const loadClientes = async () => {
    setIsLoading(true);
    
    const supabaseQuery = async () => {
      return await supabase
        .from('clients')
        .select('*')
        .eq('activo', true);
    };

    try {
      const supabaseClientes = await readData<any>(
        'clients',
        supabaseQuery,
        'clientes'
      );

      const formattedClientes: Cliente[] = supabaseClientes.map(cliente => ({
        id: cliente.id,
        nombre_cliente: cliente.nombre_cliente,
        nombre: cliente.nombre_cliente, // Alias
        tipo_persona: cliente.tipo_persona,
        nit_cedula: cliente.nit_cedula,
        nit: cliente.nit_cedula, // Alias
        ciudad: cliente.ciudad,
        direccion: cliente.direccion || cliente.ciudad,
        telefono_contacto: cliente.telefono_contacto,
        telefono: cliente.telefono_contacto, // Alias
        correo_electronico: cliente.correo_electronico,
        email: cliente.correo_electronico, // Alias
        persona_contacto: cliente.persona_contacto,
        contacto_principal: cliente.persona_contacto, // Alias
        tipo_cliente: cliente.tipo_cliente,
        activo: cliente.activo,
        fecha_registro: new Date(cliente.created_at),
        observaciones: cliente.observaciones
      }));

      setClientes(formattedClientes);
      console.log(`✅ Clientes cargados: ${formattedClientes.length}`);
      
    } catch (error) {
      console.error('❌ Error cargando clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar cliente usando el sistema unificado
  const addCliente = async (clienteData: Omit<Cliente, 'id' | 'fecha_registro'>) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('clients')
        .insert({
          nombre_cliente: clienteData.nombre_cliente,
          tipo_persona: clienteData.tipo_persona,
          nit_cedula: clienteData.nit_cedula,
          ciudad: clienteData.ciudad,
          direccion: clienteData.direccion || clienteData.ciudad,
          telefono_contacto: clienteData.telefono_contacto,
          correo_electronico: clienteData.correo_electronico,
          persona_contacto: clienteData.persona_contacto,
          tipo_cliente: clienteData.tipo_cliente,
          observaciones: clienteData.observaciones,
          activo: true
        });
    };

    const localStorageUpdater = () => {
      const clienteWithId = { 
        ...clienteData, 
        id: Date.now().toString(),
        fecha_registro: new Date(),
        // Agregar aliases
        nombre: clienteData.nombre_cliente,
        nit: clienteData.nit_cedula,
        telefono: clienteData.telefono_contacto,
        email: clienteData.correo_electronico,
        contacto_principal: clienteData.persona_contacto
      };
      const updatedClientes = [clienteWithId, ...clientes];
      setClientes(updatedClientes);
      localStorage.setItem('clientes', JSON.stringify(updatedClientes));
    };

    const success = await writeData(
      'clients',
      clienteData,
      'create',
      supabaseOperation,
      'clientes',
      localStorageUpdater
    );

    if (success) {
      await loadClientes(); // Recargar para obtener el ID correcto de Supabase
    }

    return success;
  };

  // Actualizar cliente usando el sistema unificado
  const updateCliente = async (id: string, updatedCliente: Partial<Cliente>) => {
    const supabaseOperation = async () => {
      const updateData: any = {};
      
      if (updatedCliente.nombre_cliente) updateData.nombre_cliente = updatedCliente.nombre_cliente;
      if (updatedCliente.tipo_persona) updateData.tipo_persona = updatedCliente.tipo_persona;
      if (updatedCliente.nit_cedula) updateData.nit_cedula = updatedCliente.nit_cedula;
      if (updatedCliente.ciudad) updateData.ciudad = updatedCliente.ciudad;
      if (updatedCliente.direccion) updateData.direccion = updatedCliente.direccion;
      if (updatedCliente.telefono_contacto) updateData.telefono_contacto = updatedCliente.telefono_contacto;
      if (updatedCliente.correo_electronico !== undefined) updateData.correo_electronico = updatedCliente.correo_electronico;
      if (updatedCliente.persona_contacto) updateData.persona_contacto = updatedCliente.persona_contacto;
      if (updatedCliente.tipo_cliente) updateData.tipo_cliente = updatedCliente.tipo_cliente;
      if (updatedCliente.observaciones !== undefined) updateData.observaciones = updatedCliente.observaciones;
      if (updatedCliente.activo !== undefined) updateData.activo = updatedCliente.activo;

      return await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedClientes = clientes.map(cliente => {
        if (cliente.id === id) {
          const updated = { ...cliente, ...updatedCliente };
          // Actualizar aliases
          updated.nombre = updated.nombre_cliente;
          updated.nit = updated.nit_cedula;
          updated.telefono = updated.telefono_contacto;
          updated.email = updated.correo_electronico;
          updated.contacto_principal = updated.persona_contacto;
          return updated;
        }
        return cliente;
      });
      setClientes(updatedClientes);
      localStorage.setItem('clientes', JSON.stringify(updatedClientes));
    };

    return await writeData(
      'clients',
      { id, ...updatedCliente },
      'update',
      supabaseOperation,
      'clientes',
      localStorageUpdater
    );
  };

  // Eliminar cliente (soft delete) usando el sistema unificado
  const deleteCliente = async (id: string) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('clients')
        .update({ activo: false })
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedClientes = clientes.map(cliente =>
        cliente.id === id ? { ...cliente, activo: false } : cliente
      );
      setClientes(updatedClientes.filter(c => c.activo));
      localStorage.setItem('clientes', JSON.stringify(updatedClientes));
    };

    return await writeData(
      'clients',
      { id, activo: false },
      'update',
      supabaseOperation,
      'clientes',
      localStorageUpdater
    );
  };

  return {
    clientes,
    isLoading,
    loadClientes,
    addCliente,
    updateCliente,
    deleteCliente
  };
};
