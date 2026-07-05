# Casos de Prueba con Evidencias - FinanceFlow

Este documento recopila los principales casos de prueba (CP) ejecutados de forma manual y automatizada para asegurar la calidad y correcto funcionamiento del sistema **FinanceFlow**.

---

## 1. Suite de Pruebas Automatizadas

El monorepo cuenta con **94 casos de prueba automatizados** distribuidos en **18 archivos de especificación**:
- **Pruebas Backend (Jest y Supertest):** 12 archivos que comprueban las validaciones con Zod en controladores, la lógica de servicios, la encriptación bcryptjs y el middleware de autorización JWT.
- **Pruebas Frontend (Jest y React Testing Library):** 16 archivos que validan la reactividad de componentes React, el renderizado de gráficos de Recharts, el comportamiento del formulario y el ruteo privado.
- **Pruebas del SDK de Simulación:** El SDK del proyecto integra un panel de control con 66 pruebas y una suite de pruebas de estrés paralela que registra 50 iteraciones de stress-testing simulando peticiones recurrentes con una tasa de éxito de 100%.

---

## 2. Casos de Prueba Funcionales y Evidencias de Aceptación

A continuación, se describen los principales casos de prueba manuales aplicados en el control de calidad:

### CP-01: Registro de Usuario Exitoso (RF-01)
- **Objetivo:** Comprobar la creación de una cuenta con credenciales válidas.
- **Pasos:**
  1. Acceder a [RegisterPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/RegisterPage.jsx).
  2. Ingresar nombre: `Juan Pérez`, email: `juan.perez@example.com`, y password: `password123`.
  3. Presionar "Registrarse".
- **Resultado Esperado:** Retorna HTTP 201 Created. Los datos se guardan en la colección `usuarios` de MongoDB Atlas (con la contraseña encriptada en un hash seguro de bcryptjs) y la UI redirige al Login.
- **Estado:** ✅ Aprobado

### CP-04: Login Denegado por Clave Incorrecta (RF-02)
- **Objetivo:** Confirmar que el sistema deniega el acceso ante credenciales no coincidentes.
- **Pasos:**
  1. Ingresar a [LoginPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/LoginPage.jsx).
  2. Ingresar email: `juan.perez@example.com` y password incorrecta: `claveerronea`.
  3. Presionar "Ingresar".
- **Resultado Esperado:** Retorna HTTP 401 Unauthorized y la UI muestra el mensaje de error: "Credenciales inválidas".
- **Estado:** ✅ Aprobado

### CP-11: Validación de Monto Positivo en Movimientos (RF-04)
- **Objetivo:** Asegurar que el sistema no guarda transacciones con montos nulos o negativos.
- **Pasos:**
  1. Ir a [MovimientoFormPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/MovimientoFormPage.jsx).
  2. Completar concepto, tipo, categoría y monto: `-150.00` o `0`.
  3. Presionar "Guardar".
- **Resultado Esperado:** Zod y React Hook Form bloquean el envío en el cliente. Si se intenta por POST directo, la API retorna HTTP 400 Bad Request por la validación de la regla de negocio `RN-04`.
- **Estado:** ✅ Aprobado

### CP-15: Categoría Personalizada "Otros" (RF-06)
- **Objetivo:** Validar que al seleccionar la categoría "Otros" se activa un campo para texto libre.
- **Pasos:**
  1. Acceder a [MovimientoFormPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/MovimientoFormPage.jsx).
  2. Seleccionar el dropdown de Categoría y hacer clic en "Otros".
- **Resultado Esperado:** Se despliega condicionalmente un input de texto libre para ingresar la categoría personalizada obligatoriamente.
- **Estado:** ✅ Aprobado

### CP-18: Inactivación de Transacción (Soft Delete) (RF-08)
- **Objetivo:** Probar que la desactivación de una transacción la oculta del balance sin borrarla físicamente.
- **Pasos:**
  1. Ir a [IngresosPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/IngresosPage.jsx).
  2. En una transacción activa, presionar el botón `Desactivar` (`⏸️`).
- **Resultado Esperado:** Se envía un PATCH a `/api/movimientos/:id/inhabilitar` de forma exitosa. El registro se visualiza con opacidad del 60% en la tabla y su monto se descuenta inmediatamente del balance neto acumulado de caja.
- **Estado:** ✅ Aprobado

### CP-29: Disparo de Alertas de Gasto Elevado (RF-11)
- **Objetivo:** Verificar que el sistema lanza advertencias visuales ante anomalías de gasto.
- **Pasos:**
  1. Registrar un egreso por S/. 1600.00 en la categoría "Alimentos" (donde el promedio histórico del usuario es S/. 500.00).
- **Resultado Esperado:** El componente [AlertasComponent.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/components/AlertasComponent.jsx) detecta que el gasto excede en 1.5x el promedio histórico y muestra una alerta roja: "Gasto de categoría muy elevado detectado".
- **Estado:** ✅ Aprobado

### CP-35: Procesamiento de Captura OCR (RF-05)
- **Objetivo:** Probar el correcto funcionamiento de la lectura de comprobantes de pago de Yape/Plin.
- **Pasos:**
  1. Cargar una imagen legible de un voucher de Yape en el formulario.
- **Resultado Esperado:** FastAPI binariza la imagen y extrae el texto por Tesseract. Retorna el monto correcto, el concepto y asigna la categoría correspondiente mediante clasificación inteligente, autocompletando los campos del formulario.
- **Estado:** ✅ Aprobado

### CP-39: Bloqueo de Proyecciones de Meta sin Ahorro (RF-12)
- **Objetivo:** Comprobar que el planificador maneja errores matemáticos de división por cero ante ahorros nulos o negativos.
- **Pasos:**
  1. Acceder al dashboard del usuario cuyo balance neto acumulativo es menor o igual a 0.
  2. Escribir una meta de compra de S/. 500 en [PlanificadorCompras.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/components/PlanificadorCompras.jsx).
- **Resultado Esperado:** El sistema bloquea el cálculo y muestra la advertencia: "Tu balance de ahorro es insuficiente para calcular metas", protegiendo la consistencia de la interfaz.
- **Estado:** ✅ Aprobado
