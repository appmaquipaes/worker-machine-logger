
import { loadProveedores } from '@/models/Proveedores';

// Función para extraer información del proveedor desde el string de origen
export const extraerInfoProveedor = (origen: string): {
  proveedorId: string | undefined;
  proveedorNombre: string | undefined;
} => {
  if (!origen) {
    return { proveedorId: undefined, proveedorNombre: undefined };
  }

  // Si el origen es "Acopio Maquipaes", no es un proveedor externo
  if (origen === 'Acopio Maquipaes') {
    return { proveedorId: undefined, proveedorNombre: undefined };
  }

  const proveedores = loadProveedores();
  
  // Buscar el proveedor que coincida con el origen
  // El formato esperado es "Nombre Proveedor - Ciudad"
  const proveedorEncontrado = proveedores.find(proveedor => {
    const formatoCompleto = `${proveedor.nombre} - ${proveedor.ciudad}`;
    return formatoCompleto === origen;
  });

  if (proveedorEncontrado) {
    console.log('✅ Proveedor identificado:', {
      id: proveedorEncontrado.id,
      nombre: proveedorEncontrado.nombre,
      origen: origen
    });
    
    return {
      proveedorId: proveedorEncontrado.id,
      proveedorNombre: proveedorEncontrado.nombre
    };
  }

  console.log('⚠️ No se encontró proveedor para origen:', origen);
  return { proveedorId: undefined, proveedorNombre: undefined };
};

// Función para obtener proveedor por ID
export const obtenerProveedorPorId = (proveedorId: string) => {
  const proveedores = loadProveedores();
  return proveedores.find(proveedor => proveedor.id === proveedorId);
};
