
# API de Autenticación - Documentación

## Descripción General

Este sistema de autenticación proporciona funcionalidades seguras para el manejo de usuarios, incluyendo registro, login, recuperación de contraseñas y gestión de sesiones.

## Hooks Principales

### `useAuth()`

Hook principal para el manejo de autenticación.

#### Retorna:
- `user: User | null` - Usuario autenticado actual
- `login(email, password): Promise<boolean>` - Función de login
- `register(name, email, password, role, assignedMachines?): Promise<boolean>` - Función de registro
- `logout(): void` - Función de logout
- `isLoading: boolean` - Estado de carga
- `resetPassword(email): Promise<boolean>` - Recuperación de contraseña
- `updatePassword(email, code, newPassword): Promise<boolean>` - Actualización de contraseña

#### Ejemplo de uso:
```typescript
const { user, login, logout, isLoading } = useAuth();

const handleLogin = async () => {
  const success = await login('user@example.com', 'password123');
  if (success) {
    // Login exitoso
  }
};
```

### `useSecureForm()`

Hook para manejo seguro de formularios con validación y rate limiting.

#### Retorna:
- `email: FormField` - Campo de email con validación
- `password: FormField` - Campo de contraseña con validación
- `isSubmitting: boolean` - Estado de envío
- `isBlocked: boolean` - Estado de bloqueo por intentos fallidos
- `attemptCount: number` - Número de intentos fallidos
- `validateEmailField(value): boolean` - Validar campo email
- `validatePasswordField(value): boolean` - Validar campo contraseña
- `checkRateLimit(): boolean` - Verificar límites de velocidad
- `incrementAttempts(): void` - Incrementar contador de intentos
- `clearForm(): void` - Limpiar formulario
- `resetSecurity(): void` - Resetear estado de seguridad

#### Ejemplo de uso:
```typescript
const {
  email,
  password,
  isSubmitting,
  isBlocked,
  validateEmailField,
  validatePasswordField,
  checkRateLimit
} = useSecureForm();

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!checkRateLimit()) {
    return; // Bloqueado por rate limiting
  }
  
  const emailValid = validateEmailField(email.value);
  const passwordValid = validatePasswordField(password.value);
  
  if (emailValid && passwordValid) {
    // Proceder con el envío
  }
};
```

## Configuración de Seguridad

### Rate Limiting
- **Máximo de intentos**: 5 por ventana de tiempo
- **Ventana de tiempo**: 5 minutos
- **Duración de bloqueo**: 15 minutos

### Validaciones
- **Email**: Formato válido, máximo 254 caracteres
- **Contraseña**: Mínimo 6 caracteres, máximo 128 caracteres
- **Sanitización**: Automática en todos los inputs

## Tipos de Usuario

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador';
  assignedMachines?: string[]; // Solo para operadores
}
```

## Manejo de Errores

### Errores Comunes:
- `"Credenciales incorrectas"` - Email o contraseña inválidos
- `"El correo electrónico ya está registrado"` - Email duplicado en registro
- `"Demasiados intentos fallidos"` - Rate limiting activado
- `"El código es incorrecto o ha expirado"` - Código de recuperación inválido

### Códigos de Error:
- `AUTH_INVALID_CREDENTIALS` - Credenciales incorrectas
- `AUTH_USER_EXISTS` - Usuario ya existe
- `AUTH_RATE_LIMITED` - Demasiados intentos
- `AUTH_INVALID_CODE` - Código de recuperación inválido

## Testing

### Datos de Prueba:
```typescript
// Usuario válido
const validUser = {
  name: 'Usuario Test',
  email: 'test@example.com',
  password: 'password123'
};

// Usuario administrador por defecto
const adminUser = {
  email: 'admin@maquipaes.com',
  password: 'admin123'
};
```

### Escenarios de Prueba:
1. Login exitoso con credenciales válidas
2. Login fallido con credenciales inválidas
3. Registro de nuevo usuario
4. Rate limiting después de 5 intentos fallidos
5. Recuperación de contraseña
6. Validación de formularios
7. Sanitización de inputs maliciosos

## Mejores Prácticas

1. **Siempre validar inputs** en el cliente y servidor
2. **Usar HTTPS** en producción
3. **Implementar CSP** para prevenir XSS
4. **Monitorear intentos fallidos** para detectar ataques
5. **Rotar tokens** regularmente
6. **Auditar logs** de autenticación

## Roadmap

- [ ] Implementar 2FA (Two-Factor Authentication)
- [ ] Agregar OAuth (Google, GitHub)
- [ ] Implementar refresh tokens
- [ ] Agregar notificaciones de login
- [ ] Implementar device tracking
