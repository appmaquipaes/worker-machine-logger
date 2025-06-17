
// Tipos para el sistema de validación y testing

export interface FormField {
  value: string;
  error: string;
  touched: boolean;
  isValid?: boolean;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

export interface FormValidationConfig {
  fields: Record<string, ValidationRule[]>;
  onValidate?: (isValid: boolean) => void;
  sanitize?: boolean;
}

export interface SecurityConfig {
  maxAttempts: number;
  blockDuration: number;
  attemptWindow: number;
  enableRateLimit: boolean;
  enableSanitization: boolean;
}

export interface AuthSecurityState {
  attemptCount: number;
  lastAttempt: number;
  isBlocked: boolean;
  blockStartTime?: number;
}

export interface TestScenario {
  name: string;
  description: string;
  input: Record<string, any>;
  expectedOutput: {
    isValid: boolean;
    errors?: string[];
  };
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  networkRequests: number;
  memoryUsage?: number;
}
