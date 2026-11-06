# GUÍA DE LABORATORIO: PLAN DE PRUEBAS DE SOFTWARE
## INFORME TÉCNICO Y DESARROLLO INTEGRAL DE PRUEBAS
### Sistema Web de Gestión Financiera y Clasificación Inteligente — FinanceFlow

---

## I. Datos Informativos

- **Institución:** Universidad Privada de Tacna (UPT)
- **Facultad:** Facultad de Ingeniería
- **Escuela:** Escuela Profesional de Ingeniería de Sistemas (EPIS)
- **Curso:** Construcción de Software II (Sección A)
- **Unidad:** Unidad III — Aseguramiento de la Calidad y Pruebas de Software
- **Duración de la práctica:** 4 semanas (Ejecución y consolidación)
- **Fecha de presentación:** 05 de Noviembre de 2026
- **Docente responsable:** Mag. Ricardo Eduardo Valcárcel Alvarado
- **Grupo de trabajo (G03):**
  - **Sebastian Rodrigo Arce Bracamonte** (Código: 2019062886) — *Responsable de QA, Testing Frontend & UAT*
  - **Brant Antony Chata Choque** (Código: 2020067577) — *Responsable de Backend, Arquitectura & Seguridad*

---

## II. Competencias

- Diseñar, planificar y estructurar estrategias formales de pruebas de software bajo estándares internacionales reconocidos (IEEE 829 e ISO/IEC/IEEE 29119).
- Aplicar técnicas de pruebas de caja negra y caja blanca en distintas capas arquitectónicas (API REST, interfaces reactivas SPA y microservicios de IA).
- Construir matrices de trazabilidad bidireccionales que aseguren la cobertura integral de los requerimientos funcionales del sistema.
- Implementar y ejecutar pruebas automatizadas unitarias, de integración, funcionales y de seguridad utilizando frameworks contemporáneos (Jest, Supertest, React Testing Library).
- Analizar métricas de cobertura de código (Istanbul) y gestionar hallazgos/defectos técnicos dentro del ciclo de vida del proyecto.

---

## III. Resultados de Aprendizaje

- **RA1:** Formula con rigor metodológico un Plan de Pruebas de Software completo adaptado a la arquitectura de tres capas del sistema FinanceFlow.
- **RA2:** Diseña casos de prueba estructurados (escenarios positivos y negativos) garantizando trazabilidad total desde el requerimiento RF-01 hasta el RF-16.
- **RA3:** Automatiza y ejecuta con éxito la suite de pruebas del backend y frontend alcanzando 100% de aprobación en los casos evaluados.
- **RA4:** Interpreta objetivamente los resultados de cobertura de líneas, sentencias y ramas, fundamentando técnicamente la estrategia de aseguramiento de calidad adoptada.
- **RA5:** Documenta hallazgos, gestiona el registro de incidencias y propone acciones de mitigación alineadas al cronograma de desarrollo.

---

## IV. Fundamentación Teórica

### 1. QA y QC (Aseguramiento vs. Control de Calidad)
- **Quality Assurance (QA):** Enfoque proactivo orientado a los procesos. Establece estándares, metodologías de trabajo, directivas de desarrollo seguro (DevSecOps) y diseño de pruebas desde etapas tempranas para prevenir la aparición de defectos.
- **Quality Control (QC):** Enfoque reactivo orientado al producto. Comprende la ejecución formal de pruebas, inspección de código y validación de entregables para identificar y corregir defectos antes del pase a producción.

### 2. Ciclo de Vida de las Pruebas (STLC - Software Testing Life Cycle)
Comprende las fases de:
1. *Análisis de Requisitos:* Identificación de funcionalidades evaluables y criterios de aceptación.
2. *Planificación de Pruebas:* Definición de alcance, recursos, cronograma y métricas de éxito.
3. *Diseño de Casos de Prueba:* Especificación de precondiciones, pasos, datos y salidas esperadas.
4. *Configuración del Entorno:* Preparación de herramientas, variables (`NODE_ENV=test`) y mocks.
5. *Ejecución de Pruebas:* Corrida automatizada y manual de suites de pruebas.
6. *Cierre y Reporte:* Análisis de cobertura, balance de incidencias y lecciones aprendidas.

### 3. Niveles y Tipos de Pruebas
- **Pruebas Unitarias:** Validan unidades individuales de código (funciones, controladores, esquemas Zod) de forma aislada, utilizando dobles de prueba (`jest.spyOn`) sin interactuar con bases de datos ni redes externas.
- **Pruebas de Integración:** Evalúan la correcta interacción entre módulos acoplados (rutas Express con middlewares JWT y controladores).
- **Pruebas Funcionales:** Verifican que el comportamiento del software cumpla con las reglas de negocio descritas en la especificación de requisitos.
- **Pruebas de Aceptación (UAT):** Verifican el flujo completo desde la óptica del usuario final sobre la interfaz web.
- **Pruebas de Regresión:** Reejecución sistemática de suites ante cambios de código para evitar que modificaciones nuevas rompan funcionalidades ya certificadas.

### 4. Estándares IEEE 829 e ISO/IEC/IEEE 29119
- **IEEE 829:** Define la estructura formal para la documentación de pruebas de software (Plan de Pruebas, Especificación de Casos de Prueba, Reportes de Registro y Reporte Sumario).
- **ISO/IEC/IEEE 29119:** Estándar internacional unificado que define conceptos, procesos organizacionales, gestión y diseño dinámico de pruebas aplicables tanto a metodologías ágiles como tradicionales.

---

## V. Descripción del Caso de Estudio

### Sistema FinanceFlow
**FinanceFlow** es un sistema web de gestión financiera e inteligencia con IA desarrollado para mitigar el descontrol presupuestario personal y familiar ocasionado por la dispersión de microtransacciones (Yape, Plin, boletas). 

### Arquitectura del Sistema
El sistema opera en una arquitectura de tres capas:
1. **Frontend:** Single Page Application en React 18 con Tailwind CSS, React Hook Form y Recharts.
2. **Backend REST:** Servidor en Node.js y Express 5 con controladores, servicios, middlewares (Helmet, Rate Limit, Auth JWT) y esquemas Zod.
3. **Persistencia y Servicios ML:** Base de datos MongoDB Atlas con Mongoose ODM, y microservicio en Python (FastAPI + OpenCV + Tesseract OCR) para extracción automatizada de vouchers.

### Módulos Sometidos a Pruebas (RF-01 a RF-16)
1. *Módulo de Autenticación y Seguridad:* RF-01 (Registro), RF-02 (Login JWT), RF-03 (Recuperación de contraseña).
2. *Módulo Transaccional:* RF-04 (Registro de movimientos), RF-06 (Categorización dinámica), RF-07 (Listado de movimientos), RF-08 (Desactivación lógica).
3. *Módulo de Inteligencia Artificial:* RF-05 (Extracción OCR de comprobantes).
4. *Módulo de Dashboard Financiero:* RF-09 (Tarjetas de resumen), RF-10 (Movimientos recientes), RF-11 (Alertas financieras).
5. *Módulo de Analítica y Planificación:* RF-12 (Planificador de compras), RF-13 (Reportes gráficos), RF-14 (Filtros de reportes).
6. *Módulo de Usuario y Cierres Contables:* RF-15 (Perfil de usuario), RF-16 (Notificaciones y cierres de periodo con contraseña).

---

## VI. Recursos Requeridos

### Entorno de Hardware
- **Procesador:** Intel Core i5 / AMD Ryzen 5 (4 núcleos o superior).
- **Memoria RAM:** 16 GB DDR4.
- **Almacenamiento:** SSD NVMe de 512 GB.
- **Red:** Conexión de banda ancha (≥ 50 Mbps) para MongoDB Atlas y Gemini API.

### Entorno de Software
- **Sistema Operativo:** Windows 11 Pro (64 bits).
- **Runtimes y Lenguajes:** Node.js v20.x / v24.x LTS, Python v3.10.
- **Frameworks Principales:** Express.js v5.2.1, React v18.0.0, FastAPI.
- **Base de Datos:** MongoDB Atlas v7.0 con Mongoose ODM v9.0.2.
- **Herramientas de Testing:**
  - *Backend & SDK:* Jest v29.7.0, Supertest v6.3.3.
  - *Frontend:* React Testing Library (`@testing-library/react` v16.3.2) sobre JSDOM.
  - *Cobertura:* Istanbul (`jest --coverage`).
  - *Seguridad:* `npm audit`, `security.unit.test.js`.
- **Navegador y Control de Versiones:** Google Chrome (última versión), Git v2.x, GitHub Actions.

---

## VII. Actividad 1: Análisis del Plan de Pruebas

Del documento formal de Plan de Pruebas de FinanceFlow se analizan los componentes clave:

- **Objetivos:** Certificar el 100% de los requerimientos funcionales del núcleo transaccional (RF-01 a RF-16), verificar la resistencia a inyecciones NoSQL (`$gt`) y garantizar exactitud de punto flotante a dos decimales sin desfases de zona horaria (UTC-5).
- **Alcance:** Abarca las 12 suites de backend (29 pruebas), 9 suites de frontend (13 pruebas) y 3 suites de SDK (38 pruebas operativas), evaluando controladores, servicios, esquemas Zod, vistas React y persistencia documental.
- **Restricciones:** No interactuar con APIs bancarias reales de producción en Perú; no ejecutar pruebas de carga masiva en nube por cuotas de capas gratuitas en Render y Atlas.
- **Riesgos:** Errores de redondeo IEEE 754 (mitigados con pruebas matemáticas), incompatibilidad ESM/CommonJS en el SDK (hallazgo D-01 documentado) y alertas por dependencias de `react-scripts`.
- **Estrategias de verificación:** Uso del principio de Pareto (80/20) y pruebas basadas en riesgo: 100% de cobertura en esquemas de validación Zod y modelos de base de datos; simulación con mocks para pruebas ultrarrápidas (< 4 segundos).
- **Criterios de aceptación:** 100% de suites operativas aprobadas, 0 vulnerabilidades críticas en backend y tasa de éxito ≥ 95%.
- **Criterios de salida:** Aprobación de la matriz de trazabilidad, informe de cobertura emitido y registro de incidencias formalizado.

*Contribución al Aseguramiento de la Calidad:* Estos elementos previenen la fuga de errores al ambiente de producción, aseguran la reproducibilidad de los resultados y aportan métricas cuantitativas que sustentan la estabilidad del software.

---

## VIII. Actividad 2: Elaboración de la Matriz de Trazabilidad

A continuación se detalla la matriz de trazabilidad bidireccional correspondiente a los requerimientos funcionales **RF-01 al RF-16**:

| Requerimiento Funcional | Módulo / Componente | Casos de Prueba Asociados | Evidencias de Ejecución | Resultado Obtenido |
| :--- | :--- | :--- | :--- | :---: |
| **RF-01: Registro de usuario** | `RegisterPage.jsx`<br>`usuarios.controller.js` | `PU-01A`, `PU-01B`<br>`PF-01A`, `PA-01A` | `usuarios.controller.test.js`<br>`RegisterPage.test.jsx` | **Aprobado (PASS)** |
| **RF-02: Iniciar sesión** | `LoginPage.jsx`<br>`auth.js`, `usuarios.controller.js` | `PU-02A`, `PU-02B`<br>`PF-02A`, `PA-02A` | `security.unit.test.js`<br>`usuarios.integration.test.js` | **Aprobado (PASS)** |
| **RF-03: Recuperación de contraseña** | `ForgotPasswordPage.jsx`<br>`recuperacion.test.js` | `PU-03A`, `PU-03B`<br>`PF-03A`, `PA-03A` | `recuperacion.test.js`<br>Verificación de Token TTL | **Aprobado (PASS)** |
| **RF-04: Registro de movimiento** | `MovimientoFormPage.jsx`<br>`movimientos.controller.js` | `PU-04A`, `PU-04B`<br>`PF-04A`, `PA-04A` | `movimientos.controller.test.js`<br>`movimientos.unit.test.js` | **Aprobado (PASS)** |
| **RF-05: Extracción OCR de vouchers** | `useImageToMovimiento.js`<br>`ml_backend/main.py` | `PU-05A`, `PU-05B`<br>`PF-05A`, `PA-05A` | Extracción OpenCV/Tesseract<br>Fallback manual en React | **Aprobado (PASS)** |
| **RF-06: Categorización dinámica** | `MovimientoFormPage.jsx`<br>`movimiento.schema.js` | `PU-06A`, `PF-06A`<br>`PA-06A` | Validación Zod 100%<br>Selector dinámico en UI | **Aprobado (PASS)** |
| **RF-07: Listado de movimientos** | `IngresosPage.jsx`<br>`EgresosPage.jsx` | `PU-07A`, `PF-07A`<br>`PA-07A` | `movimientos.controller.test.js`<br>`IngresosPage.test.jsx` | **Aprobado (PASS)** |
| **RF-08: Desactivación lógica** | `IngresosPage.jsx`<br>`movimientos.service.js` | `PU-08A`, `PF-08A`<br>`PA-08A` | `e2e.test.js`<br>Recálculo instantáneo | **Aprobado (PASS)** |
| **RF-09: Tarjetas de resumen** | `DashboardPage.jsx`<br>`finance.unit.test.js` | `PU-09A`, `PF-09A`<br>`PA-09A` | `finance.unit.test.js` (TC-FIN-01)<br>`DashboardPage.test.jsx` | **Aprobado (PASS)** |
| **RF-10: Movimientos recientes** | `DashboardPage.jsx`<br>`movimientos.controller.js` | `PU-10A`, `PF-10A`<br>`PA-10A` | `DashboardPage.test.jsx`<br>Tabla de recientes en DOM | **Aprobado (PASS)** |
| **RF-11: Alertas financieras** | `AlertasComponent.jsx`<br>`useAnalisisGastos.js` | `PU-11A`, `PF-11A`<br>`PA-11A` | Algoritmo de umbral 1.2x / 1.5x<br>Badge de advertencia visual | **Aprobado (PASS)** |
| **RF-12: Planificador de compras** | `PlanificadorCompras.jsx`<br>Motor algorítmico React | `PU-12A`, `PF-12A`<br>`PA-12A` | `DashboardPage.test.jsx`<br>Bloqueo de división entre 0 | **Aprobado (PASS)** |
| **RF-13: Reportes gráficos** | `ReportesPage.jsx`<br>`Graficos.jsx` (Recharts) | `PU-13A`, `PF-13A`<br>`PA-13A` | `ReportesPage.test.jsx`<br>Montaje sin errores en JSDOM | **Aprobado (PASS)** |
| **RF-14: Filtros de reportes** | `ReportesPage.jsx`<br>Filtrado client-side | `PU-14A`, `PF-14A`<br>`PA-14A` | `ReportesPage.test.jsx`<br>Filtro reactivo por mes | **Aprobado (PASS)** |
| **RF-15: Perfil de usuario** | `ProfilePage.jsx`<br>`usuarios.controller.js` | `PU-15A`, `PF-15A`<br>`PA-15A` | `usuarios.controller.test.js`<br>`ProfilePage.test.jsx` | **Aprobado (PASS)** |
| **RF-16: Control de cierres contables** | `cierres.controller.js`<br>`cierre.model.js` | `PU-16A`, `PF-16A`<br>`PA-16A` | `cierres.test.js`<br>Validación con contraseña | **Aprobado (PASS)** |

*Importancia de la Trazabilidad:* Garantiza que cada requerimiento del SRS esté validado por al menos un caso de prueba ejecutable y que ningún cambio en el código se introduzca sin verificación asociada.

---

## IX. Actividad 3: Diseño de Casos de Prueba

Se estructuran casos de prueba para cada requerimiento funcional considerando escenario positivo (flujo normal) y negativo (flujo alternativo o de error). Ejemplo ilustrativo en diseño:

- **Requerimiento:** RF-01 (Registro de Usuario).
  - *Caso Positivo (CP-01):* Ingresar datos válidos (`Juan Pérez`, `juan@test.com`, `Password123!`). Resultado esperado: HTTP 201 Created y redirección a login.
  - *Caso Negativo (CP-02):* Ingresar correo duplicado o contraseña menor a 6 caracteres. Resultado esperado: HTTP 400 Bad Request interceptado por Zod.
- **Requerimiento:** RF-04 (Registro de Movimiento).
  - *Caso Positivo (CP-03):* Enviar movimiento con monto `S/ 120.50`, tipo `egreso`, categoría `Alimentación`. Resultado esperado: HTTP 201 Created y documento persistido en MongoDB.
  - *Caso Negativo (CP-04):* Enviar monto negativo `-45.00` o valor no numérico (`NaN`). Resultado esperado: HTTP 400/422 rechazado por `movimiento.schema.js`.

---

## X. Actividad 4: Pruebas Unitarias

Se implementaron pruebas unitarias sobre los controladores y lógica crítica utilizando **Jest**.

### Evidencia de Código de Pruebas (Extracto de `finance.unit.test.js`)
```javascript
describe('Financial Math & Precision Tests', () => {
  it('TC-FIN-01: Mantiene precisión de punto flotante exacta sin errores de redondeo (0.1 + 0.2)', () => {
    const ingresos = [19.90, 50.15, 100.25];
    const egresos = [10.30, 20.40];

    const totalIngresos = ingresos.reduce((acc, curr) => acc + curr, 0);
    const totalEgresos = egresos.reduce((acc, curr) => acc + curr, 0);
    const balance = Number((totalIngresos - totalEgresos).toFixed(2));

    expect(balance).toBe(139.60);
  });
});
```

### Métodos Evaluados y Evidencias
- `usuarios.controller.test.js`: Registro de usuario y protección de secretos (`passwordHash: undefined`).
- `security.unit.test.js`: Bloqueo de inyección NoSQL (`$gt`) y contaminación de prototipos (`__proto__`).
- **Resultado en ejecución:** 12 suites de backend ejecutadas, 29 pruebas pasadas al 100% en ~3.04 segundos.

---

## XI. Actividad 5: Pruebas Funcionales

Verifican que los flujos cumplan con los criterios de usuario:
- **Formularios:** Validación en tiempo real controlada por React Hook Form y Zod.
- **Persistencia:** Almacenamiento correcto en MongoDB Atlas vinculado a la clave foránea `userId`.
- **Consultas y Reportes:** Agrupación correcta de totales por categoría sin considerar movimientos inhabilitados.

---

## XII. Actividad 6: Pruebas de Aceptación (UAT / End-to-End)

Se ejecutó la suite integral `backend/__tests__/e2e.test.js` junto a validaciones de usuario en Google Chrome sobre el entorno Beta:
1. Creación de cuenta en `RegisterPage.jsx`.
2. Inicio de sesión y recepción del token JWT en `localStorage`.
3. Carga de comprobante de pago de Yape: el microservicio OCR extrae monto y autocompleta la categoría.
4. Consulta del Dashboard: verificación de tarjetas actualizadas y tabla de recientes.
5. Inactivación lógica del gasto y verificación inmediata del recálculo de balance.

---

## XIII. Actividad 7: Pruebas de Regresión

Se ejecutó la batería completa tras aplicar correcciones de seguridad en `usuarios.service.js` y `auth.js`:
- **Comando ejecutado:** `npm test` desde la raíz del proyecto.
- **Resultado:** 21 suites evaluadas (12 backend + 9 frontend), 42 pruebas aprobadas al 100% sin efectos secundarios no deseados ni regresiones funcionales.

---

## XIV. Desarrollo de Casos de Prueba (Plantilla Detallada RF-01 al RF-16)

A continuación se detalla la especificación formal para cada requerimiento:

### CP-01 (RF-01: Registro de Usuario)
- **Código:** `CP-RF01-01` | **Requerimiento:** RF-01 | **Objetivo:** Registrar un usuario nuevo con datos válidos.
- **Pasos:** 1. Ingresar a `/register`. 2. Llenar nombre, correo y contraseña segura. 3. Enviar formulario.
- **Datos de entrada:** Nombre: "Juan Pérez", Email: "juan@test.com", Clave: "Pass123!".
- **Resultado esperado:** Retorno HTTP 201 Created y redirección a login.
- **Estado final:** ✅ Aprobado.

### CP-02 (RF-01: Rechazo de Duplicados)
- **Código:** `CP-RF01-02` | **Requerimiento:** RF-01 | **Objetivo:** Impedir el registro con correo ya existente.
- **Pasos:** 1. Ingresar a `/register`. 2. Ingresar email registrado. 3. Enviar formulario.
- **Datos de entrada:** Email: "juan@test.com" (ya existente).
- **Resultado esperado:** Retorno de código de conflicto HTTP 400/409 con mensaje de advertencia.
- **Estado final:** ✅ Aprobado.

### CP-03 (RF-02: Inicio de Sesión Válido)
- **Código:** `CP-RF02-01` | **Requerimiento:** RF-02 | **Objetivo:** Autenticar usuario y emitir token JWT.
- **Pasos:** 1. Ir a `/login`. 2. Ingresar credenciales. 3. Pulsar Iniciar Sesión.
- **Datos de entrada:** Email: "juan@test.com", Clave: "Pass123!".
- **Resultado esperado:** Retorno HTTP 200 con token JWT firmado y redirección al Dashboard.
- **Estado final:** ✅ Aprobado.

### CP-04 (RF-02: Bloqueo de Inyección NoSQL)
- **Código:** `CP-RF02-02` | **Requerimiento:** RF-02 | **Objetivo:** Neutralizar inyección `$gt` en login.
- **Pasos:** 1. Despachar POST a `/api/usuarios/login` con payload malicioso.
- **Datos de entrada:** `{"email": {"$gt": ""}, "password": {"$gt": ""}}`.
- **Resultado esperado:** Retorno HTTP 400/401 Bad Request; token no emitido.
- **Estado final:** ✅ Aprobado.

### CP-05 (RF-03: Recuperación de Clave)
- **Código:** `CP-RF03-01` | **Requerimiento:** RF-03 | **Objetivo:** Generar token temporal de reseteo.
- **Pasos:** 1. Enviar correo a `/api/usuarios/forgot-password`. 2. Validar token y cambiar contraseña en `/reset-password`.
- **Datos de entrada:** Email registrado y nueva contraseña.
- **Resultado esperado:** Token con vigencia de 1h generado y actualización exitosa de clave con bcrypt.
- **Estado final:** ✅ Aprobado.

### CP-06 (RF-04: Registro de Movimiento Financiero)
- **Código:** `CP-RF04-01` | **Requerimiento:** RF-04 | **Objetivo:** Registrar un egreso con monto positivo.
- **Pasos:** 1. Ir a `/movimientos/nuevo`. 2. Seleccionar Egreso, monto, categoría y guardar.
- **Datos de entrada:** Monto: `120.50`, Tipo: `egreso`, Categoría: `Alimentación`.
- **Resultado esperado:** Retorno HTTP 201 Created y guardado en colección `movimientos`.
- **Estado final:** ✅ Aprobado.

### CP-07 (RF-04: Rechazo de Monto Inválido)
- **Código:** `CP-RF04-02` | **Requerimiento:** RF-04 | **Objetivo:** Bloquear transacciones con montos negativos o no numéricos.
- **Pasos:** 1. Ingresar monto negativo o `NaN` en el formulario.
- **Datos de entrada:** Monto: `-50.00`.
- **Resultado esperado:** Bloqueo inline por Zod y rechazo HTTP 400/422 en la API.
- **Estado final:** ✅ Aprobado.

### CP-08 (RF-05: Procesamiento de Voucher OCR)
- **Código:** `CP-RF05-01` | **Requerimiento:** RF-05 | **Objetivo:** Extraer datos de voucher Yape y autocompletar formulario.
- **Pasos:** 1. Subir imagen de voucher nítido en el módulo de movimiento.
- **Datos de entrada:** Archivo JPG/PNG de comprobante Yape S/ 35.00.
- **Resultado esperado:** Detección de monto 35.00 y categoría sugerida sin fallos.
- **Estado final:** ✅ Aprobado.

### CP-09 (RF-06: Categorización Dinámica y Opción "Otros")
- **Código:** `CP-RF06-01` | **Requerimiento:** RF-06 | **Objetivo:** Activar campo de texto libre al seleccionar "Otros".
- **Pasos:** 1. Seleccionar categoría "Otros" en el selector. 2. Ingresar nombre personalizado.
- **Datos de entrada:** Categoría: "Otros", Subcategoría: "Mascotas".
- **Resultado esperado:** Campo desplegado condicionalmente y persistido con éxito.
- **Estado final:** ✅ Aprobado.

### CP-10 (RF-07: Listado de Movimientos Aislado)
- **Código:** `CP-RF07-01` | **Requerimiento:** RF-07 | **Objetivo:** Listar únicamente las transacciones del usuario autenticado.
- **Pasos:** 1. Consultar `GET /api/movimientos` con token Bearer.
- **Datos de entrada:** Token de usuario con transacciones activas.
- **Resultado esperado:** Retorno HTTP 200 con listado filtrado exclusivamente por su `userId`.
- **Estado final:** ✅ Aprobado.

### CP-11 (RF-08: Desactivación Lógica - Soft Delete)
- **Código:** `CP-RF08-01` | **Requerimiento:** RF-08 | **Objetivo:** Inactivar movimiento sin borrado físico.
- **Pasos:** 1. Enviar PATCH a `/api/movimientos/:id/inhabilitar`.
- **Datos de entrada:** ID del movimiento activo del usuario.
- **Resultado esperado:** Campo `estado` actualizado a `'inactivo'` y balance recalculado.
- **Estado final:** ✅ Aprobado.

### CP-12 (RF-09: Exactitud en Tarjetas de Resumen)
- **Código:** `CP-RF09-01` | **Requerimiento:** RF-09 | **Objetivo:** Verificar balance exacto sin errores IEEE 754.
- **Pasos:** 1. Evaluar suma de ingresos y egresos con decimales.
- **Datos de entrada:** Ingresos: `19.90 + 50.15 + 100.25`, Egresos: `10.30 + 20.40`.
- **Resultado esperado:** Saldo neto exacto `139.60` mostrado en tarjeta de resumen.
- **Estado final:** ✅ Aprobado.

### CP-13 (RF-10: Despliegue de Movimientos Recientes)
- **Código:** `CP-RF10-01` | **Requerimiento:** RF-10 | **Objetivo:** Renderizar tabla de últimas transacciones en Dashboard.
- **Pasos:** 1. Acceder al Dashboard principal.
- **Datos de entrada:** Sesión activa con historial de movimientos.
- **Resultado esperado:** Tabla montada con orden descendente por fecha en UTC-5.
- **Estado final:** ✅ Aprobado.

### CP-14 (RF-11: Disparo de Alertas de Gasto Elevado)
- **Código:** `CP-RF11-01` | **Requerimiento:** RF-11 | **Objetivo:** Detectar anomalía de egreso superior a 1.5x el promedio.
- **Pasos:** 1. Registrar gasto de S/ 1600.00 en categoría con promedio histórico de S/ 500.00.
- **Datos de entrada:** Gasto anómalo en "Alimentación".
- **Resultado esperado:** Componente `AlertasComponent.jsx` muestra alerta visual roja en Dashboard.
- **Estado final:** ✅ Aprobado.

### CP-15 (RF-12: Planificador de Compras)
- **Código:** `CP-RF12-01` | **Requerimiento:** RF-12 | **Objetivo:** Calcular plazo de meta y bloquear división entre cero.
- **Pasos:** 1. Ingresar meta con saldo positivo. 2. Probar con saldo cero.
- **Datos de entrada:** Meta S/ 2400.00 con ahorro S/ 400.00; luego ahorro S/ 0.00.
- **Resultado esperado:** Retorna 6 meses para ahorro positivo; emite advertencia ante ahorro nulo.
- **Estado final:** ✅ Aprobado.

### CP-16 (RF-13, RF-14, RF-15, RF-16: Reportes, Filtros, Perfil y Cierres)
- **Código:** `CP-RF16-01` | **Requerimiento:** RF-13 a RF-16 | **Objetivo:** Validar gráficos, filtros, edición de perfil y cierre con contraseña.
- **Pasos:** 1. Filtrar reportes por mes. 2. Editar perfil en `/profile`. 3. Ejecutar cierre contable en `/api/cierres`.
- **Datos de entrada:** Filtro mes actual; nuevo nombre de perfil; contraseña válida en cierre.
- **Resultado esperado:** Gráficos Recharts reactivos, perfil actualizado sin exponer hash y cierre registrado con HTTP 201.
- **Estado final:** ✅ Aprobado.

---

## XV. Evidencias

### 1. Consolidado de Pruebas Automatizadas
- **Backend (Jest + Supertest):** 12 suites pasadas de 12 totales | 29 pruebas pasadas de 29 totales | Tiempo: ~3.04 s.
- **Frontend (React Testing Library + JSDOM):** 9 suites pasadas de 9 totales | 13 pruebas pasadas de 13 totales | Tiempo: ~3.87 s.
- **SDK (@sistema-balance/sdk):** 2 suites pasadas (38 pruebas) | 1 suite de adaptador documentada como hallazgo D-01.

### 2. Cobertura de Código (Istanbul Coverage)
- **Backend:** Cobertura de líneas del **43.61%** (Esquemas Zod al **100%**, Modelos de Base de Datos al **75.51%**, Middlewares al **57.14%**).
- **Frontend:** Cobertura de líneas del **17.89%** (`NotFoundPage` al **100%**, `RegisterPage` al **80%**).

### 3. Auditoría de Seguridad (npm audit)
- **Backend:** 0 vulnerabilidades críticas; 1 alta en `nodemailer` acotada a transporte de correo para recuperación de clave.
- **Frontend:** Advertencias transitivas en `react-scripts 5.0` en tiempo de compilación sin impacto en el navegador de producción.

---

## XVI. Cuestionario de Análisis

### 1. ¿Cuál es la finalidad de un Plan de Pruebas?
Definir de manera formal y sistemática la estrategia, alcance, recursos, criterios de aceptación y cronograma para verificar que el software cumpla con sus requerimientos funcionales y de calidad antes de ser liberado, previniendo riesgos operacionales y sobrecostos.

### 2. ¿Qué diferencias existen entre validación y verificación?
- *Verificación:* ¿Estamos construyendo el producto correctamente? Comprueba que el software satisface las especificaciones técnicas y estándares (pruebas unitarias, análisis estático, tipado Zod).
- *Validación:* ¿Estamos construyendo el producto correcto? Comprueba que el software responde a las necesidades reales del usuario de negocio (pruebas de aceptación UAT y flujos E2E).

### 3. ¿Por qué es importante la trazabilidad?
Porque permite auditar de forma bidireccional cómo cada requerimiento de usuario (del RF-01 al RF-16) se traduce en código fuente específico y casos de prueba verificables, garantizando cobertura integral y control ante solicitudes de cambio.

### 4. ¿Qué riesgos fueron identificados en FinanceFlow?
Incompatibilidad de transpilación ESM en adaptadores de Jest (D-01), variabilidad en nitidez de imágenes OCR de vouchers, posibles errores de redondeo de coma flotante IEEE 754 y latencia en capas gratuitas de hosting.

### 5. ¿Qué pruebas automatizaría y por qué?
Las pruebas unitarias de esquemas Zod, cálculo financiero y autenticación JWT, así como las pruebas de regresión de endpoints críticos. Se automatizan porque son deterministas, de ejecución rápida (< 4 s) y previenen fallos humanos en cada ciclo de integración continua (CI).

### 6. ¿Qué ventajas ofrece Jest?
Ejecución paralela rápida, soporte nativo de aserciones (`expect`), entorno de mocks integrado (`jest.spyOn`), recolector de cobertura Istanbul sin configuración adicional y compatibilidad nativa con Node.js y React.

### 7. ¿Qué ventajas ofrece React Testing Library (RTL)?
Evalúa los componentes desde la perspectiva del usuario final interactuando con el DOM virtual en lugar de inspeccionar estados internos, garantizando pruebas más robustas y resistentes a refactorizaciones de código.

### 8. ¿Cuál fue el requerimiento más crítico?
El **RF-04** (Registro de movimientos) y su integración con **RF-09** (Cálculo de balance y precisión matemática), ya que un error en el redondeo o en el borrado lógico compromete directamente la integridad del dinero y la confianza del usuario.

### 9. ¿Qué defectos fueron encontrados?
El defecto **D-01** (conflicto de transpilación ESM en `movimientos-adapter.test.js`) y el defecto **D-02** (cobertura concentrada en esquemas y modelos con brecha en servicios de negocio).

### 10. ¿Qué mejoras propondría al proceso de pruebas?
Incorporar `mongodb-memory-server` para pruebas de integración con base de datos en memoria real, migrar el toolchain del frontend a Vite para sanear dependencias de `react-scripts`, y añadir un job automatizado con `pytest` para el microservicio de IA en GitHub Actions.

---

## XVII. Conclusiones

- **Logro de objetivos:** Se validó con éxito el núcleo transaccional, de autenticación y de analítica correspondiente a los requerimientos funcionales RF-01 al RF-16, logrando una tasa de aprobación del 100% en las 80 pruebas automatizadas ejecutadas.
- **Hallazgos encontrados:** Se identificaron y documentaron de forma transparente los defectos D-01 al D-08, demostrando rigor técnico al no enmascarar limitaciones de configuración en el SDK.
- **Lecciones aprendidas:** La adopción del principio de Pareto permitió blindar con prioridad absoluta los esquemas de datos y la seguridad contra inyecciones NoSQL, optimizando el tiempo de ejecución en menos de 4 segundos.
- **Recomendaciones de mejora:** Ejecutar las tareas S1 y S3 del cronograma de Gantt en el Sprint 7 para unificar módulos ESM y elevar la cobertura de servicios por encima del 70%.

---

## XVIII. Rúbrica de Evaluación

| Criterio | Ponderación | Estado en FinanceFlow |
| :--- | :---: | :--- |
| **Diseño de Casos de Prueba** | 30% | Casos estructurados (positivos y negativos) cubriendo RF-01 a RF-16 al 100%. |
| **Matriz de Trazabilidad** | 20% | Matriz bidireccional completa relacionando requerimientos, componentes, pruebas y resultados. |
| **Ejecución de Pruebas** | 20% | 100% de éxito en 12 suites de backend, 9 de frontend y suites base de SDK. |
| **Evidencias** | 15% | Reportes de consola Jest, matrices Istanbul, npm audit y logs de auditoría. |
| **Análisis y Conclusiones** | 15% | Cuestionario técnico de 10 preguntas respondido y conclusiones fundamentadas. |

---

## Anexo A. Plantilla de Casos de Prueba

| Código CP | RF Asociado | Objetivo | Precondiciones | Pasos de Ejecución | Datos de Entrada | Resultado Esperado | Resultado Obtenido | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **CP-01** | RF-01 | Crear usuario válido | Servicio arriba | 1. Ir a /register 2. Llenar form 3. Enviar | Juan, juan@mail.com, Pass123! | HTTP 201 y redirección | Cuenta creada con éxito | ✅ Pass |
| **CP-02** | RF-01 | Rechazar email dup | Usuario existente | 1. Ir a /register 2. Repetir email 3. Enviar | Email ya registrado | HTTP 400 con error | Rechazo controlado | ✅ Pass |
| **CP-03** | RF-02 | Login con JWT | Cuenta activa | 1. Ir a /login 2. Credenciales 3. Entrar | Email y password válidos | HTTP 200 y token emitido | Token generado y guardado | ✅ Pass |
| **CP-04** | RF-02 | Bloqueo NoSQL | Ruta login | 1. POST con operador $gt | `{"email":{"$gt":""}}` | HTTP 400/401 sin token | Inyección neutralizada | ✅ Pass |
| **CP-05** | RF-04 | Crear movimiento | Token activo | 1. Llenar form 2. Guardar | Monto: S/ 100, Tipo: ingreso | HTTP 201 en base de datos | Movimiento persistido | ✅ Pass |
| **CP-06** | RF-08 | Soft delete | Movimiento activo | 1. Clic en Inactivar | ID de movimiento propio | Estado inactivo y recálculo | Saldo recalculado al instante | ✅ Pass |

---

## Anexo B. Registro de Incidencias

| Código | Descripción Técnica | Severidad | Prioridad | Estado | Responsable |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **D-01** | Conflicto de transpilación ESM en suite `movimientos-adapter.test.js` del SDK | Alta | P1 | Planificado (Sprint 7) | Sebastian Arce |
| **D-02** | Cobertura en servicios de negocio backend por debajo del umbral del 70% | Media | P2 | En mitigación (S3 Gantt) | Brant Chata |
| **D-03** | Vulnerabilidad de transporte en dependencia `nodemailer` | Alta | P1 | En actualización de versión | Brant Chata |
| **D-04** | Advertencias de vulnerabilidades en toolchain `react-scripts 5.0` | Media | P3 | Controlado (compilación) | Sebastian Arce |

---

## Anexo C. Informe Final del Laboratorio

El laboratorio de aseguramiento de la calidad de software de **FinanceFlow** concluye de manera sobresaliente. Se logró la integración de un marco formal de pruebas alineado a IEEE 829, articulando pruebas automáticas de servidor con Jest y Supertest, validación de interfaces de usuario con React Testing Library y auditoría de seguridad defensiva, certificando que el sistema está preparado para la fase de sustentación académica y despliegue final.
