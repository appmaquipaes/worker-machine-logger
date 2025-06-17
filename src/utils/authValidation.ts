
import { getStoredUsers, getResetRequests } from './authStorage';
import { sanitizeInput } from './formValidation';

export const validateUserCredentials = (email: string, password: string) => {
  // Sanitizar inputs
  const cleanEmail = sanitizeInput(email).toLowerCase();
  const cleanPassword = password; // Las contraseñas no se sanitizan para preservar caracteres especiales
  
  // Validar longitud
  if (cleanEmail.length > 254 || cleanPassword.length > 128) {
    return null;
  }
  
  const users = getStoredUsers();
  return users.find((u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);
};

export const checkEmailExists = (email: string): boolean => {
  const cleanEmail = sanitizeInput(email).toLowerCase();
  
  if (cleanEmail.length > 254) {
    return false;
  }
  
  const users = getStoredUsers();
  return users.some((u) => u.email.toLowerCase() === cleanEmail);
};

export const validateResetCode = (email: string, resetCode: string): boolean => {
  const cleanEmail = sanitizeInput(email).toLowerCase();
  const cleanCode = sanitizeInput(resetCode);
  
  // Validar formato del código (debe ser 6 dígitos)
  if (!/^\d{6}$/.test(cleanCode)) {
    return false;
  }
  
  const resetRequests = getResetRequests();
  const request = resetRequests[cleanEmail];
  
  if (!request) return false;
  return request.code === cleanCode && request.expiresAt > Date.now();
};

export const generateResetCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validación adicional para prevenir ataques de fuerza bruta
export const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const cleanEmail = sanitizeInput(email);
  
  return emailRegex.test(cleanEmail) && cleanEmail.length <= 254;
};

export const isValidPasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Debe tener al menos 6 caracteres');
  }
  
  if (password.length > 128) {
    errors.push('No puede exceder 128 caracteres');
  }
  
  // Verificar que no sea una contraseña común
  const commonPasswords = ['123456', 'password', '123456789', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Esta contraseña es demasiado común');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
