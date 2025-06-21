
// Función mejorada para detectar si es acopio (CORREGIDA para manejar concatenación con ciudad)
export const esAcopio = (ubicacion?: string): boolean => {
  if (!ubicacion) return false;
  const ubicacionNorm = ubicacion.toLowerCase().trim();
  console.log('🔍 Verificando si es acopio:', ubicacion, '- Normalizado:', ubicacionNorm);
  
  // Buscar específicamente por "acopio" seguido de "maquipaes" o solo "acopio maquipaes"
  // También manejar casos donde venga concatenado con ciudad (ej: "Acopio Maquipaes - Madrid")
  const esAcopioResult = (
    ubicacionNorm.includes('acopio maquipaes') ||
    ubicacionNorm.includes('acopio') && ubicacionNorm.includes('maquipaes') ||
    ubicacionNorm.startsWith('acopio maquipaes -') ||
    ubicacionNorm === 'acopio maquipaes'
  );
  
  console.log('📍 Resultado esAcopio:', esAcopioResult);
  return esAcopioResult;
};

// Función para detectar si una máquina es cargador
export const esCargador = (machineName?: string): boolean => {
  if (!machineName) return false;
  return machineName.toLowerCase().includes('cargador');
};
