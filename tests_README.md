# Guía de Ejecución de Pruebas: Sistema de Ingresos y Egresos

## Pruebas Frontend (React)

Las pruebas de frontend están ubicadas en `frontend/src/__tests__/` y usan React Testing Library.

### Cómo ejecutar

1. Instala dependencias:
   ```bash
   cd frontend
   npm install
   ```
2. Ejecuta los tests:
   ```bash
   npm test
   ```

### Qué deberías ver
- Salida con el resumen de tests ejecutados, por ejemplo:
  - `LoginPage` muestra el formulario y valida campos.
  - `RegisterPage` valida nombre/email/contraseña y muestra mensaje de éxito.
  - `DashboardPage` muestra la tabla de movimientos (puede estar vacía).
  - `ProfilePage` muestra mensaje de carga y datos de usuario.
  - `MovimientoFormPage` valida campos requeridos.
  - `ReportesPage` muestra mensaje de carga y datos de reporte.
  - `NotFoundPage` muestra mensaje 404 y link de volver.
  - `IngresosPage` y `EgresosPage` muestran mensaje de no implementado.

**Por qué:**
- Cada test verifica que la UI reacciona correctamente a entradas válidas/erróneas y que los mensajes y elementos clave aparecen según el flujo esperado.

---

## Pruebas Backend (Node.js/Express)

Las pruebas de backend están en `backend/__tests__/` y usan Jest + Supertest.

### Cómo ejecutar

1. Instala dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Ejecuta los tests:
   ```bash
   npm test
   ```

### Qué deberías ver
- Salida con el resumen de tests ejecutados, por ejemplo:
  - `usuarios.controller.test.js`: registra usuario nuevo y rechaza duplicados.
  - `movimientos.controller.test.js`: crea y lista movimientos.
  - `logs.controller.test.js`: lista logs con token y rechaza sin token.
  - `usuarios.integration.test.js`: prueba registro y login de usuario.
  - `e2e.test.js`: prueba flujo completo (registro, login, crear, listar, inactivar movimiento).

**Por qué:**
- Cada test asegura que los endpoints funcionan, validan correctamente, y que los flujos principales y alternativos (errores, permisos) están cubiertos.

---

## Notas
- Si algún test falla, revisa el mensaje de error: puede deberse a datos previos, configuración de entorno, o cambios recientes en la lógica.
- Los tests ayudan a garantizar que la app funciona como se espera y que los cambios futuros no rompen funcionalidades clave.
