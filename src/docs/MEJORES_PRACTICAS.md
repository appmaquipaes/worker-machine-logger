
# Mejores Prácticas para Evitar Inconsistencias

## 1. Convención de Nomenclatura

### Hooks con Versiones Corregidas
- `useVentaCalculations` → Versión principal (siempre corregida)
- `useVentaCalculationsFixed` → Eliminar después de consolidar
- `useVentasData` → Versión principal (siempre corregida)
- `useVentasDataFixed` → Eliminar después de consolidar

### Componentes con Versiones Corregidas
- `VentasPageContainer` → Versión principal (siempre corregida)
- `VentasPageContainerFixed` → Eliminar después de consolidar

## 2. Reglas de Desarrollo

### Al Corregir Bugs:
1. **NO crear versiones "Fixed"** - Corregir directamente el archivo original
2. **Actualizar TODAS las referencias** al archivo corregido
3. **Eliminar versiones duplicadas** inmediatamente después de la corrección
4. **Probar en todos los lugares** donde se usa la funcionalidad

### Al Agregar Nuevas Funcionalidades:
1. **Crear nuevos archivos** con nombres descriptivos
2. **NO duplicar lógica existente** - reutilizar hooks y componentes
3. **Mantener separación de responsabilidades**
4. **Documentar cambios importantes**

## 3. Estructura de Archivos Recomendada

```
src/
├── hooks/
│   ├── useVentaCalculations.ts (PRINCIPAL)
│   ├── useVentasData.ts (PRINCIPAL)
│   └── useVentaCreation.ts
├── components/
│   ├── ventas/
│   │   ├── VentasPageContainer.tsx (PRINCIPAL)
│   │   ├── VentasTable.tsx
│   │   └── VentasFilters.tsx
│   └── TarifaClienteForm.tsx
└── pages/
    └── VentasPage.tsx (usa componentes principales)
```

## 4. Checklist Antes de Hacer Cambios

- [ ] ¿Existe ya esta funcionalidad en otro archivo?
- [ ] ¿Estoy duplicando código innecesariamente?
- [ ] ¿He probado en todas las páginas que usan esta funcionalidad?
- [ ] ¿He eliminado las versiones duplicadas?
- [ ] ¿Los nombres de archivo son descriptivos y únicos?

## 5. Archivos a Consolidar/Eliminar

### Para Eliminar Después de Consolidación:
- `useVentaCalculationsFixed.ts` → Ya consolidado en `useVentaCalculations.ts`
- `useVentasDataFixed.ts` → Ya consolidado en `useVentasData.ts`
- `VentasPageContainerFixed.tsx` → Ya consolidado en `VentasPageContainer.tsx`

### Acciones Realizadas:
- ✅ Consolidado `useVentaCalculations` con todas las correcciones
- ✅ Consolidado `useVentasData` con correcciones de totales
- ✅ Actualizado `VentasPageContainer` para usar versiones corregidas
- ✅ Actualizado `VentasPage.tsx` para usar componente principal

## 6. Próximos Pasos

1. **Verificar** que todas las funcionalidades trabajen correctamente
2. **Eliminar** archivos duplicados (`*Fixed.tsx`, `*Fixed.ts`)
3. **Refactorizar** archivos muy largos en componentes más pequeños
4. **Documentar** cambios importantes en este archivo
