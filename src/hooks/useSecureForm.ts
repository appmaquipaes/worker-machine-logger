
import { useState, useCallback, useRef } from 'react';
import { validateEmail, validatePassword, sanitizeInput } from '@/utils/formValidation';

interface SecureFormState {
  isSubmitting: boolean;
  attemptCount: number;
  lastAttempt: number;
  isBlocked: boolean;
}

interface FormField {
  value: string;
  error: string;
  touched: boolean;
}

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos
const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutos

export const useSecureForm = () => {
  const [formState, setFormState] = useState<SecureFormState>({
    isSubmitting: false,
    attemptCount: 0,
    lastAttempt: 0,
    isBlocked: false
  });

  const [email, setEmail] = useState<FormField>({
    value: '',
    error: '',
    touched: false
  });

  const [password, setPassword] = useState<FormField>({
    value: '',
    error: '',
    touched: false
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const { attemptCount, lastAttempt, isBlocked } = formState;

    // Si está bloqueado, verificar si ha pasado el tiempo
    if (isBlocked && now - lastAttempt < BLOCK_DURATION) {
      return false;
    }

    // Si han pasado más de 5 minutos desde el último intento, resetear contador
    if (now - lastAttempt > ATTEMPT_WINDOW) {
      setFormState(prev => ({
        ...prev,
        attemptCount: 0,
        isBlocked: false
      }));
      return true;
    }

    // Si se ha alcanzado el máximo de intentos
    if (attemptCount >= MAX_ATTEMPTS) {
      setFormState(prev => ({
        ...prev,
        isBlocked: true,
        lastAttempt: now
      }));
      return false;
    }

    return true;
  }, [formState]);

  const incrementAttempts = useCallback(() => {
    const now = Date.now();
    setFormState(prev => ({
      ...prev,
      attemptCount: prev.attemptCount + 1,
      lastAttempt: now
    }));
  }, []);

  const validateEmailField = useCallback((value: string) => {
    const sanitized = sanitizeInput(value);
    const validation = validateEmail(sanitized);
    
    setEmail(prev => ({
      ...prev,
      value: sanitized,
      error: validation.error || '',
      touched: true
    }));

    return validation.isValid;
  }, []);

  const validatePasswordField = useCallback((value: string) => {
    const validation = validatePassword(value);
    
    setPassword(prev => ({
      ...prev,
      value,
      error: validation.error || '',
      touched: true
    }));

    return validation.isValid;
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState(prev => ({ ...prev, isSubmitting }));
  }, []);

  const clearForm = useCallback(() => {
    setEmail({ value: '', error: '', touched: false });
    setPassword({ value: '', error: '', touched: false });
  }, []);

  const resetSecurity = useCallback(() => {
    setFormState({
      isSubmitting: false,
      attemptCount: 0,
      lastAttempt: 0,
      isBlocked: false
    });
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const getBlockTimeRemaining = useCallback((): number => {
    if (!formState.isBlocked) return 0;
    
    const elapsed = Date.now() - formState.lastAttempt;
    const remaining = Math.max(0, BLOCK_DURATION - elapsed);
    
    return Math.ceil(remaining / 1000); // Retorna segundos
  }, [formState.isBlocked, formState.lastAttempt]);

  return {
    // Estado del formulario
    email,
    password,
    isSubmitting: formState.isSubmitting,
    isBlocked: formState.isBlocked,
    attemptCount: formState.attemptCount,
    
    // Métodos de validación
    validateEmailField,
    validatePasswordField,
    
    // Control de seguridad
    checkRateLimit,
    incrementAttempts,
    getBlockTimeRemaining,
    
    // Control de estado
    setSubmitting,
    clearForm,
    resetSecurity,
    
    // Estado de validación
    isFormValid: email.value && password.value && !email.error && !password.error
  };
};
