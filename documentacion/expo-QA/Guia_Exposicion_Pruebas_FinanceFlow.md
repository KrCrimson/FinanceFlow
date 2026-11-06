# GUÍA DEFINITIVA DE EJECUCIÓN Y EXPOSICIÓN DE PRUEBAS DE QA
## FinanceFlow — Sistema de Gestión Financiera e Inteligencia con IA
**Curso:** Construcción de Software II (Sec. A) — Universidad Privada de Tacna  
**Docente:** Mag. Ricardo Eduardo Valcárcel Alvarado  
**Integrantes (Grupo G03):** Brant Antony Chata Choque (2020067577) & Sebastian Rodrigo Arce Bracamonte (2019062786)  
**Documentos de referencia:** `Informe de Aseguramiento de Calidad`, `G03_FinanceFlow_5W1H_Gantt.xlsx`, `AUDITORIA_SEGURIDAD.md`

---

## 📑 ÍNDICE DE LA GUÍA
1. [Resumen Ejecutivo de Calidad y Cifras Clave](#1-resumen-ejecutivo-de-calidad-y-cifras-clave)
2. [Comandos de Ejecución Rápidos (Copiar y Pegar desde la Raíz)](#2-comandos-de-ejecución-rápidos-copiar-y-pegar-desde-la-raíz)
3. [Explicación Detallada: Pruebas de Backend (Jest + Supertest)](#3-explicación-detallada-pruebas-de-backend-jest--supertest)
4. [Explicación Detallada: Pruebas de Frontend (React Testing Library)](#4-explicación-detallada-pruebas-de-frontend-react-testing-library)
5. [Explicación Detallada: Pruebas del SDK de Desacoplamiento](#5-explicación-detallada-pruebas-del-sdk-de-desacoplamiento)
6. [Explicación de Cobertura de Código (Coverage)](#6-explicación-de-cobertura-de-código-coverage)
7. [Auditoría Estática y Seguridad (DevSecOps & npm audit)](#7-auditoría-estática-y-seguridad-devsecops--npm-audit)
8. [Matriz de Hallazgos y Conexión con 5W+1H / Gantt (Sprint 7)](#8-matriz-de-hallazgos-y-conexión-con-5w1h--gantt-sprint-7)
9. [Guion de Exposición para el Docente y Preguntas Trampa](#9-guion-de-exposición-para-el-docente-y-preguntas-trampa)

---

## 1. Resumen Ejecutivo de Calidad y Cifras Clave

| Métrica / Indicador | Valor Obtenido | Estado / Valoración |
|---|---|---|
| **Pruebas Automatizadas Ejecutadas** | **80 pruebas** (Backend: 29, Frontend: 13, SDK: 38) | ✅ 100% aprobadas de lo ejecutado |
| **Suites de Backend** | **12 de 12 aprobadas** (0 fallas) | ✅ Excelente (~2.4 s) |
| **Suites de Frontend** | **9 de 9 aprobadas** (0 fallas) | ✅ Excelente (~2.0 s) |
| **Suites del SDK** | **2 aprobadas, 1 observada** (Defecto D-01 registrado) | ⚠️ 38 aprobadas, 28 pendientes de transpilación Babel ESM |
| **Cobertura de Líneas Backend** | **43.61 %** (Zod Schemas 100%, Modelos 75.5%, Middlewares 57.1%) | 📊 En proceso de ampliación a meta ≥70% (Sprint 7) |
| **Cobertura de Líneas Frontend** | **17.89 %** (Validaciones básicas y renderizado) | 📊 En proceso de ampliación a flujos completos |
| **Hallazgos de Seguridad Backend** | **12 hallazgos remediados al 100%** (3 críticos, 2 altos, 5 medios, 2 bajos) | 🛡️ Certificados en `AUDITORIA_SEGURIDAD.md` |
| **Pipeline DevSecOps** | GitHub Actions (`.github/workflows/ci.yml`) en cada push | 🔄 Automatizado en Node.js 20 |

---

## 2. Comandos de Ejecución Rápidos (Copiar y Pegar desde la Raíz)

> **Nota importante:** Todos los comandos están diseñados para ser ejecutados desde la raíz del proyecto (`FinanceFlow/`).

### A. Ejecución Universal (Backend + Frontend juntos)
```powershell
npm test
```
* **Qué hace:** Ejecuta secuencialmente las 12 suites del backend y las 9 suites del frontend.
* **Resultado esperado:** 21 suites aprobadas, 42 pruebas aprobadas en ~4.5 segundos.

---

### B. Pruebas Automatizadas de Backend (API, Seguridad, Precisión)
```powershell
npm run test:backend
```
*(Comando alternativo directo sin npm run: `npm --prefix backend test`)*
* **Resultado esperado:** 12 suites passed, 29 tests passed.

---

### C. Cobertura de Código del Backend (Jest Istanbul)
```powershell
npm run test:backend:coverage
```
*(Comando alternativo: `npm --prefix backend test -- --coverage`)*
* **Resultado esperado:** Tabla desglosada por capas: Schemas 100%, Database 75.51%, Middlewares 57.14%, Total Líneas 43.61%.

---

### D. Pruebas Automatizadas de Frontend (Componentes React & UI)
```powershell
npm run test:frontend
```
*(Comando alternativo: `npm --prefix frontend run test:ci`)*
* **Resultado esperado:** 9 suites passed, 13 tests passed en entorno JSDOM.

---

### E. Cobertura de Código del Frontend
```powershell
npm run test:frontend:coverage
```
*(Comando alternativo: `npm --prefix frontend test -- --watchAll=false --coverage`)*
* **Resultado esperado:** Tabla con 17.89% de cobertura de líneas, detallando páginas, adaptadores y componentes.

---

### F. Pruebas del SDK Desacoplado (Módulos Base e Integración)
```powershell
npm run test:sdk
```
*(Comando alternativo: `npm --prefix sdk test -- tests/sdk.test.js tests/sdk-integration.test.js`)*
* **Resultado esperado:** 2 suites passed, 38 tests passed.

---

### G. Demostración del Defecto D-01 en el SDK (Transparencia Técnica)
```powershell
npm run test:sdk:all
```
*(Comando alternativo: `npm --prefix sdk test`)*
* **Resultado esperado:** Muestra 2 suites aprobadas (38 tests) y 1 suite fallida por `SyntaxError: Cannot use import statement outside a module` en `movimientos-adapter.js` (Defecto D-01 documentado en el informe).

---

### H. Auditoría de Seguridad de Dependencias (npm audit)
```powershell
npm run audit:backend
npm run audit:frontend
```
* **Resultado esperado:** Backend muestra 1 vulnerabilidad en nodemailer (notificada tras el cierre); Frontend muestra vulnerabilidades heredadas de `react-scripts`.

---

## 3. Explicación Detallada: Pruebas de Backend (Jest + Supertest)

El backend cuenta con **12 suites y 29 pruebas**, ejecutadas mediante Jest y Supertest en `backend/__tests__/`. La conexión a base de datos externa se omite intencionalmente mediante mocks (`NODE_ENV=test`) para garantizar pruebas determinísticas, ultra-rápidas (~2.4s) y sin dependencias de red.

### Desglose Punto por Punto de las 12 Suites:

#### 1. `usuarios.controller.test.js` (4 pruebas)
* **Qué valida:** 
  1. `POST /api/usuarios/register`: Creación de usuario nuevo con código HTTP 201 y sanitización de datos.
  2. `POST /api/usuarios/register`: Rechazo inmediato de emails duplicados con HTTP 400.
  3. `GET /api/usuarios/me`: Obtención de datos del perfil autenticado protegiendo la confidencialidad (verifica que el campo `passwordHash` **no** viaje en la respuesta).
  4. `PUT /api/usuarios/me`: Actualización exitosa del perfil de usuario con HTTP 200.
* **Justificación de ingeniería:** Cumple los requerimientos RF-01 y RF-02, asegurando la no exposición de secretos criptográficos.

#### 2. `admin.unit.test.js` (2 pruebas)
* **Qué valida:**
  1. `GET /api/admin/metrics`: Entrega de métricas consolidadas (usuarios registrados, suscripciones activas, volumen transaccional) bajo autorización de rol de administrador.
  2. `POST /api/admin/toggle-premium`: Operación de otorgar o revocar privilegios del Plan Pro sobre una cuenta de usuario específica.
* **Justificación de ingeniería:** Respalda el requerimiento RF-14 (Panel de Administración y Control de Licencias).

#### 3. `cierres.test.js` (3 pruebas)
* **Qué valida:**
  1. `GET /api/cierres/pendientes`: Cálculo automático de periodos pendientes de cierre (ayer y mes calendario anterior no cerrado).
  2. `POST /api/cierres`: Bloqueo de solicitud de cierre si no se proporciona la contraseña de confirmación (HTTP 400/401).
  3. `POST /api/cierres`: Registro exitoso de cierre mensual (HTTP 201) cuando se ingresa la contraseña válida y se concilian los saldos.
* **Justificación de ingeniería:** Implementa el control de integridad financiera RN-08 (Cierre formal de periodos contables).

#### 4. `movimientos.unit.test.js` (2 pruebas)
* **Qué valida:**
  1. `POST /api/movimientos/historico`: Registro de transacciones con fecha pasada cuando el usuario confirma su contraseña válida.
  2. `POST /api/movimientos/historico`: Rechazo estricto (HTTP 401) ante contraseña errónea para evitar alteraciones no auditadas del historial.
* **Justificación de ingeniería:** Previene el fraude o alteración extemporánea de balances sin doble factor de autorización.

#### 5. `pagos.unit.test.js` (3 pruebas)
* **Qué valida:**
  1. `POST /api/pagos/solicitar-pro`: Registro formal de una intención de pago (Yape/Plin/Tarjeta) con generación de identificador único.
  2. `POST /api/pagos/checkout-directo`: Activación instantánea en sandbox del plan Pro con confirmación de operación.
  3. `POST /api/pagos/toggle-dev-plan`: Alternancia controlada entre plan Gratuito y Pro para entornos de prueba.
* **Justificación de ingeniería:** Soporte a la monetización y control de pasarelas de pago (RF-13).

#### 6. `security.unit.test.js` (4 pruebas de Seguridad & Caos)
* **Qué valida:**
  1. `TC-INJ-01`: Inyección NoSQL mediante operadores de consulta (`{ "$gt": "" }`) en lugar de strings en los campos `email` y `password`. El sistema rechaza la petición con HTTP 400/401 sin vulnerar la autenticación.
  2. `TC-INJ-02`: Contaminación de prototipos (`__proto__` injection en JSON). Verifica que las propiedades del prototipo global de JavaScript permanecen intactas (`isAdmin: undefined`).
  3. `TC-SEC-02`: Fuzzing y valores no numéricos en montos de transacciones (`null`, `Infinity`, `NaN`, sentencias SQL inyectadas como `'DROP TABLE'`). Zod intercepta la carga y responde HTTP 400/422.
  4. `TC-PAY-01`: Validación de operaciones duplicadas (Replay attacks) en transacciones de pago.
* **Justificación de ingeniería:** Respalda los requerimientos no funcionales RNF-01 (Seguridad y Resistencia a Ataques OWASP Top 10).

#### 7. `recuperacion.test.js` (3 pruebas)
* **Qué valida:**
  1. `POST /api/usuarios/forgot-password`: Generación de token criptográfico temporal para restablecimiento de contraseña.
  2. `POST /api/usuarios/verify-reset-token`: Validación de vigencia y firma del token.
  3. `POST /api/usuarios/reset-password`: Actualización de la nueva contraseña y anulación del token utilizado.
* **Justificación de ingeniería:** Flujo seguro de recuperación de cuenta sin enviar credenciales en texto plano.

#### 8. `e2e.test.js` (2 pruebas integrales de ciclo de vida)
* **Qué valida:**
  1. Ciclo completo de cuenta: Registro -> Inicio de sesión -> Generación de JWT.
  2. Ciclo transaccional: Creación de movimiento -> Consulta en listado -> Inactivación lógica (*soft delete*).
* **Justificación de ingeniería:** Simula la experiencia extremo a extremo que realiza un usuario desde el cliente.

#### 9. `movimientos.controller.test.js` (2 pruebas)
* **Qué valida:**
  1. Creación válida de movimientos asignando automáticamente usuario, timestamp y categoría.
  2. Listado paginado y filtrado de transacciones del usuario autenticado.

#### 10. `logs.controller.test.js` (1 prueba)
* **Qué valida:**
  1. Consulta de la bitácora de auditoría del sistema: permite el acceso exclusivamente a usuarios con rol `admin` y token válido; deniega a usuarios sin privilegios.

#### 11. `usuarios.integration.test.js` (1 prueba)
* **Qué valida:**
  1. Integración entre rutas y controlador HTTP para el flujo encadenado de registro y posterior autenticación vía API REST.

#### 12. `finance.unit.test.js` (2 pruebas de Precisión y Normalización)
* **Qué valida:**
  1. `TC-FIN-01`: Precisión aritmética de punto flotante en cálculos de dinero (demuestra que operaciones como `0.1 + 0.2` se redondean exactamente a `0.30` sin arrastre de decimales binarios `0.30000000000000004`).
  2. `TC-FIN-02`: Normalización de fechas ISO para evitar desfasajes por zona horaria entre servidor y cliente (fijado en UTC-5 / Lima).
* **Justificación de ingeniería:** Garantiza que no se pierdan céntimos en balances acumulados ni se descuadren cierres de caja por huso horario.

---

## 4. Explicación Detallada: Pruebas de Frontend (React Testing Library)

El frontend cuenta con **9 suites y 13 pruebas** ejecutadas mediante `react-scripts test` con el entorno JSDOM en `frontend/src/__tests__/`.

### Desglose Punto por Punto de las 9 Suites:

1. **`LoginPage.test.jsx` (1 prueba):**
   * Comprueba que los campos de correo y contraseña se renderizan con sus etiquetas accesibles y que el botón de envío valida campos vacíos.
2. **`RegisterPage.test.jsx` (2 pruebas):**
   * Valida la estructura del formulario (nombre, email, contraseña) y comprueba la simulación del mensaje de éxito tras un registro correcto.
3. **`DashboardPage.test.jsx` (2 pruebas):**
   * Renderiza el dashboard financiero con estado de balance inicial/vacío y comprueba la alternancia entre las pestañas de navegación interna.
4. **`ProfilePage.test.jsx` (1 prueba):**
   * Verifica la presentación de los datos del usuario logueado en su vista de configuración de perfil.
5. **`MovimientoFormPage.test.jsx` (2 pruebas):**
   * Valida que el formulario bloquee el envío si faltan campos obligatorios (monto, tipo, concepto) y que los selectores de tipo (ingreso/egreso) reaccionen dinámicamente.
6. **`ReportesPage.test.jsx` (1 prueba):**
   * Renderiza el contenedor de métricas y gráficos estadísticos de Recharts sin provocar errores en el DOM virtual.
7. **`NotFoundPage.test.jsx` (2 pruebas):**
   * Comprueba que las rutas no existentes desplieguen el aviso amigable 404 y un enlace funcional para regresar al inicio.
8. **`IngresosPage.test.jsx` (1 prueba):**
   * Renderiza la tabla y controles de filtrado dedicados exclusivamente a movimientos de tipo ingreso.
9. **`EgresosPage.test.jsx` (1 prueba):**
   * Renderiza la vista especializada en egresos y gastos clasificados.

---

## 5. Explicación Detallada: Pruebas del SDK de Desacoplamiento

El SDK (`@sistema-balance/sdk`) es una capa arquitectónica creada para desacoplar el frontend del backend directo, permitiendo que la lógica de consumo de API sea reutilizable por el frontend web, la app móvil Expo y scripts automatizados.

### Suites Ejecutadas:
1. **`sdk-integration.test.js` (28 pruebas):**
   * Valida inicialización con `baseURL`, gestión y persistencia de tokens JWT en memoria, cálculo de estadísticas de peticiones (`successRate`, `uptime`, `requests`), estructura modular (`auth`, `movimientos`, `usuarios`, `reportes`) y la **no contaminación del ámbito global ni de los prototipos**.
2. **`sdk.test.js` (10 pruebas):**
   * Valida formateo de errores de red, construcción de parámetros en URL query strings, validación de configuraciones obligatorias y respuestas consistentes.
* **Resultado:** **38 pruebas aprobadas al 100%**.

### ⚠️ Defecto D-01: Suite `movimientos-adapter.test.js` (28 pruebas)
* **Qué ocurre:** Al ejecutar la suite completa del SDK (`npm run test:sdk:all`), Jest reporta un fallo de transpilación:
  `SyntaxError: Cannot use import statement outside a module` en `sdk/adapters/movimientos-adapter.js:16`.
* **Causa técnica:** El adaptador utiliza sintaxis moderna de módulos ES (`import * as originalService`), mientras que Jest en esa carpeta está configurado para CommonJS sin el plugin `@babel/preset-env`.
* **Manejo en la exposición:** Es un hallazgo de calidad transparente registrado como **Defecto D-01** (Prioridad P1), cuya solución ya está planificada en el Sprint 7 (solución S1/S3 del Gantt). Demuestra rigor en el aseguramiento de calidad al no ocultar discrepancias.

---

## 6. Explicación de Cobertura de Código (Coverage)

Al ejecutar la cobertura con Jest/Istanbul (`npm run test:backend:coverage` y `npm run test:frontend:coverage`), se obtienen las siguientes cifras objetivas:

### Matriz de Cobertura Global

| Componente | Declaraciones (Sentencias) | Ramas (Branches) | Funciones | Líneas de Código |
|---|---|---|---|---|
| **Backend API** | 42.44 % | 20.58 % | 35.86 % | **43.61 %** |
| **Frontend Web** | 17.41 % | 10.67 % | 12.58 % | **17.89 %** |

### Análisis por Capas del Backend (Lectura de Resultados):
* 🟢 **Esquemas Zod (`backend/schemas/`):** **100% de cobertura**. La validación de entrada de datos está completamente blindada.
* 🟢 **Modelos de Base de Datos (`backend/database/`):** **75.51% de cobertura**. Los esquemas y modelos de Mongoose están sólidamente cubiertos.
* 🟡 **Middlewares (`backend/middlewares/`):** **57.14% de cobertura**. El control de rate limiting (`100%`) y autenticación JWT (`87.5%`) están protegidos; la brecha se encuentra en el middleware general de manejo de excepciones `errorHandler.js` (`6.25%`).
* 🟠 **Controladores (`backend/controllers/`):** **41.05% de cobertura**. Los endpoints principales responden con tests, pero faltan casos de error alternativos.
* 🔴 **Capa de Servicios (`backend/services/`):** **22.84% de cobertura**. Es la zona identificada como prioritaria para remediación en el plan de mejora del Sprint 7.

---

## 7. Auditoría Estática y Seguridad (DevSecOps & npm audit)

### Pipeline Automatizado en GitHub Actions
El archivo `.github/workflows/ci.yml` ejecuta en cada commit y pull request:
1. **Fase 1 (DevSecOps):** Escaneo de vulnerabilidades con `npm audit --audit-level=high`.
2. **Fase 2 (Backend CI):** Instalación de dependencias y ejecución de las 12 suites con Jest.
3. **Fase 3 (Frontend CI):** Instalación y ejecución de las 9 suites de React en modo CI.

### Auditoría de Dependencias
* **Backend:** 1 vulnerabilidad alta identificada en `nodemailer` (avisos publicados recientemente respecto al manejo de caché DNS global y DoS en cadenas complejas de destinatarios). Solución: actualización de parche con `npm audit fix`.
* **Frontend:** 99 vulnerabilidades reportadas, concentradas casi en su totalidad como dependencias transitivas del paquete de construcción `react-scripts 5.0` (Webpack 5 / Babel). Se propone migrar a Vite en el mediano plazo para sanear la cadena de suministro.

---

## 8. Matriz de Hallazgos y Conexión con 5W+1H / Gantt (Sprint 7)

Todos los hallazgos de calidad detectados en este informe están formalmente vinculados al archivo de gestión [`G03_FinanceFlow_5W1H_Gantt.xlsx`](file:///c:/Users/HP/Documents/GitHub/FinanceFlow/G03_FinanceFlow_5W1H_Gantt.xlsx) en el marco de la metodología PDCA (Plan-Do-Check-Act):

| ID Hallazgo | Descripción Técnica | Severidad | Solución Gantt / 5W+1H | Responsable |
|---|---|---|---|---|
| **D-01** | Suite `movimientos-adapter.test.js` no corre por sintaxis ESM | Alta (P1) | **S1 & S3:** Transpilación Babel en SDK y automatización en Jest | Sebastian Arce |
| **D-02** | Cobertura en backend (43.6%) y frontend (17.9%) por debajo del umbral del 70% | Alta (P1) | **S3:** Escribir tests en Jest para CP-38 a CP-42 (Planificador y Perfil) | Sebastian Arce |
| **D-03** | Pruebas de integración usan mocks en lugar de base de datos MongoDB real | Media (P2) | **S3 / PDCA:** Incorporación de `mongodb-memory-server` para pruebas aisladas reales | Brant Chata |
| **D-04** | Vulnerabilidad en `nodemailer` y alertas de `react-scripts` | Alta (P1) | **S2 & S6:** Actualización de dependencias y unificación de configuración | Brant Chata |
| **D-05** | Pipeline de CI no rompe la construcción ante fallos de audit (`\|\| echo`) | Media (P2) | **S3 (Fase C-Actuar):** Endurecer el workflow fijando `--coverageThreshold` y audit estricto | Ambos |
| **D-06** | Documentación declara 94 pruebas y se ejecutan 80 | Media (P2) | **Cierre v1.4.0:** Sincronización automática de métricas mediante badges en README | Brant Chata |
| **D-07** | Pruebas de frontend superficiales en Ingresos y Egresos | Media (P2) | **S4 & S5:** Pruebas de integración visual y validación de formularios con React Hook Form | Brant Chata |
| **D-08** | Microservicio ML de FastAPI sin pruebas automatizadas en CI | Media (P3) | **Plan de Mejora:** Job adicional con `pytest` en GitHub Actions | Sebastian Arce |

---

## 9. Guion de Exposición para el Docente y Preguntas Trampa

### Estructura de la Intervención Oral (Tiempo estimado: 3 a 4 minutos)

1. **Apertura e Identificación:**
   > *"Buenos días, profesor Ricardo Valcárcel. Presentamos la sustentación de la estrategia de Aseguramiento de Calidad de FinanceFlow, correspondiente al Grupo G03. Nuestro enfoque de QA no se limita a 'pasar pruebas', sino que articula una pirámide de pruebas automatizadas, análisis estático, seguridad DevSecOps y trazabilidad contra nuestro cronograma de Gantt y ciclo PDCA."*

2. **Ejecución en Vivo (Demostración Práctica):**
   > *"Para demostrar la reproducibilidad de nuestras pruebas, ejecutamos desde la raíz del proyecto el comando `npm test`. En pantalla observamos la ejecución paralela:*
   > * *En Backend: 12 suites y 29 pruebas aprobadas al 100% en 2.4 segundos, validando controladores, esquemas Zod, inyecciones NoSQL y precisión financiera de punto flotante.*
   > * *En Frontend: 9 suites y 13 pruebas aprobadas al 100% en JSDOM, verificando la reactividad de componentes y la robustez de los formularios."*

3. **Análisis Crítico de Cobertura y Seguridad:**
   > *"En el informe medimos objetivamente la cobertura con Istanbul: el backend alcanza 43.6% de cobertura de líneas, donde la capa de validación Zod se encuentra al 100% y los modelos al 75.5%. Si bien la meta institucional sugerida es de 70%, identificamos con total rigor que la brecha se concentra en los servicios de negocio.*
   > *Asimismo, en seguridad demostramos la remediación de 12 vulnerabilidades críticas y altas, respaldadas con pruebas automáticas contra inyecciones NoSQL y prototype pollution."*

4. **Conexión con el Cronograma de Gantt (Sprint 7):**
   > *"Como se detalla en nuestra matriz 5W+1H y diagrama de Gantt del Sprint 7, los hallazgos D-01 al D-08 no son defectos olvidados, sino la entrada directa para las tareas S1, S2 y S3 asignadas a Sebastian Arce y mi persona para elevar la cobertura al 70% y cerrar la versión v1.4.0."*

---

### Respuestas a Preguntas Trampa del Docente:

* **Pregunta 1: *"¿Por qué la cobertura de líneas está en 43.6% y no supera el 70%?"***
  * **Respuesta:** *"Profesor, priorizamos una estrategia de prueba basada en riesgo: protegimos al 100% los esquemas de validación con Zod y los modelos de base de datos (75.5%), porque ahí es donde ocurren los ataques de inyección y la corrupción de datos. En el Sprint 7 de Hardening, según nuestro Gantt, la solución S3 tiene como objetivo exclusivo cubrir los servicios de negocio restantes para alcanzar el 70% requerido antes del pase a producción."*

* **Pregunta 2: *"¿Por qué usan mocks (`jest.spyOn`) en lugar de conectar una base de datos real?"***
  * **Respuesta:** *"En las pruebas unitarias y de integración de API seguimos la buena práctica del aislamiento: los tests deben ser deterministas, rápidos y ejecutables sin conexión a internet ni dependencia de latencia de red. El uso de mocks permite que 29 pruebas corran en apenas 2.4 segundos en el pipeline de GitHub Actions. No obstante, en la solución S3 de nuestro plan de mejora hemos contemplado incorporar `mongodb-memory-server` para una suite complementaria con motor en memoria real."*

* **Pregunta 3: *"Vi que en el SDK falló una suite (`movimientos-adapter`), ¿por qué la presentan si falla?"***
  * **Respuesta:** *"La presentamos porque el principio fundamental de la ingeniería de software y de este informe es la transparencia y la evidencia objetiva sin maquillar cifras. La suite define 28 pruebas perfectamente concebidas, pero el adaptador utiliza sintaxis ES Modules que Jest aún no transpila con Babel en ese módulo específico. Por ello, lo tipificamos formalmente en la Tabla 9 como Defecto D-01 (Severidad Alta, Prioridad P1) y le asignamos fecha de resolución en el cronograma de Gantt."*

* **Pregunta 4: *"¿Qué garantiza la prueba `TC-FIN-01` en `finance.unit.test.js`?"***
  * **Respuesta:** *"Garantiza que la aplicación no sufra errores de redondeo financiero causados por el estándar IEEE 754 de punto flotante en JavaScript, donde operaciones simples como 0.1 + 0.2 resultan en 0.30000000000000004. Nuestra prueba asegura que todos los cálculos monetarios se trunquen o redondeen con precisión bancaria a dos decimales y en zona horaria UTC-5 (Lima), protegiendo la exactitud del balance de caja."*

---
*Documento elaborado para el Grupo G03 — Tacna, 2026.*
