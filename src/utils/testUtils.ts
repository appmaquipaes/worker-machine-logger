
// Utilidades para testing y validación de formularios

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface SecurityTestResult {
  passed: boolean;
  vulnerabilities: string[];
  recommendations: string[];
}

/**
 * Ejecuta una batería de tests de validación en un formulario
 */
export const runFormValidationTests = (formData: Record<string, any>): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Test de campos requeridos
  Object.entries(formData).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined) {
      errors.push(`Campo ${key} es requerido`);
    }
  });

  // Test de longitud de campos
  Object.entries(formData).forEach(([key, value]) => {
    if (typeof value === 'string' && value.length > 1000) {
      errors.push(`Campo ${key} excede la longitud máxima permitida`);
    }
  });

  // Test de caracteres especiales maliciosos
  Object.entries(formData).forEach(([key, value]) => {
    if (typeof value === 'string' && /<script|javascript:|data:|vbscript:/i.test(value)) {
      errors.push(`Campo ${key} contiene contenido potencialmente malicioso`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Ejecuta tests de seguridad en el sistema de autenticación
 */
export const runSecurityTests = (): SecurityTestResult => {
  const vulnerabilities: string[] = [];
  const recommendations: string[] = [];

  // Verificar localStorage para datos sensibles
  try {
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value && (value.includes('password') || value.includes('token'))) {
        vulnerabilities.push(`Posible dato sensible en localStorage: ${key}`);
      }
    });
  } catch (error) {
    // localStorage no disponible
  }

  // Recomendaciones de seguridad
  recommendations.push('Implementar HTTPS en producción');
  recommendations.push('Configurar Content Security Policy (CSP)');
  recommendations.push('Implementar rate limiting en el servidor');
  recommendations.push('Usar tokens JWT con expiración corta');

  return {
    passed: vulnerabilities.length === 0,
    vulnerabilities,
    recommendations
  };
};

/**
 * Simula retrasos de red para testing de estados de carga
 */
export const simulateNetworkDelay = (min: number = 500, max: number = 2000): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Genera datos de prueba para formularios
 */
export const generateTestData = (type: 'valid' | 'invalid' | 'malicious') => {
  const baseData = {
    name: 'Usuario Test',
    email: 'test@example.com',
    password: 'password123'
  };

  switch (type) {
    case 'valid':
      return baseData;
    
    case 'invalid':
      return {
        name: '',
        email: 'invalid-email',
        password: '123'
      };
    
    case 'malicious':
      return {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com" onmouseover="alert(1)"',
        password: 'password123'
      };
    
    default:
      return baseData;
  }
};

/**
 * Logger para desarrollo que ayuda con debugging
 */
export const devLogger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
  },
  
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, data);
    }
  },
  
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error);
    }
  },
  
  security: (message: string, data?: any) => {
    console.warn(`[SECURITY] ${message}`, data);
  }
};
