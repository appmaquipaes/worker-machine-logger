
// Utilidades de validación de formularios con seguridad mejorada
export const ValidationRules = {
  email: {
    required: 'El correo electrónico es requerido',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Formato de correo electrónico inválido'
    },
    maxLength: {
      value: 254,
      message: 'El correo electrónico es demasiado largo'
    }
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres'
    },
    maxLength: {
      value: 128,
      message: 'La contraseña es demasiado larga'
    }
  },
  name: {
    required: 'El nombre es requerido',
    minLength: {
      value: 2,
      message: 'El nombre debe tener al menos 2 caracteres'
    },
    maxLength: {
      value: 50,
      message: 'El nombre es demasiado largo'
    },
    pattern: {
      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      message: 'El nombre solo puede contener letras y espacios'
    }
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const sanitized = sanitizeInput(email);
  
  if (!sanitized) {
    return { isValid: false, error: ValidationRules.email.required };
  }
  
  if (sanitized.length > ValidationRules.email.maxLength.value) {
    return { isValid: false, error: ValidationRules.email.maxLength.message };
  }
  
  if (!ValidationRules.email.pattern.value.test(sanitized)) {
    return { isValid: false, error: ValidationRules.email.pattern.message };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: ValidationRules.password.required };
  }
  
  if (password.length < ValidationRules.password.minLength.value) {
    return { isValid: false, error: ValidationRules.password.minLength.message };
  }
  
  if (password.length > ValidationRules.password.maxLength.value) {
    return { isValid: false, error: ValidationRules.password.maxLength.message };
  }
  
  return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  const sanitized = sanitizeInput(name);
  
  if (!sanitized) {
    return { isValid: false, error: ValidationRules.name.required };
  }
  
  if (sanitized.length < ValidationRules.name.minLength.value) {
    return { isValid: false, error: ValidationRules.name.minLength.message };
  }
  
  if (sanitized.length > ValidationRules.name.maxLength.value) {
    return { isValid: false, error: ValidationRules.name.maxLength.message };
  }
  
  if (!ValidationRules.name.pattern.value.test(sanitized)) {
    return { isValid: false, error: ValidationRules.name.pattern.message };
  }
  
  return { isValid: true };
};
