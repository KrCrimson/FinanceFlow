# Plan de pruebas de software

*Desarrollo e implementación del Sistema Web de Gestión Financiera y Clasificación Inteligente (FinanceFlow), 2026.*

**Fecha:** 05/11/2026

---

## Tabla de contenido

- Historial de versiones
- Información del proyecto
- Aprobaciones
- **I. Resumen ejecutivo**
- **II. Alcance de las pruebas**
  - 1. Elementos de pruebas
    - 1.1 Módulos funcionales (Áreas de negocio)
    - 1.2 Componentes lógicos y técnicos (Artefactos de implementación)
  - 2. Nuevas funcionalidades a probar
  - 3. Pruebas de regresión
  - 4. Funcionalidades a no probar
  - 5. Enfoque de pruebas (estrategia)
    - 5.1 Pruebas unitarias
    - 5.2 Pruebas funcionales y de integración
    - 5.3 Pruebas de aceptación (End-to-End)
    - 5.4 Pruebas de regresión
    - 5.5 Priorización
    - 5.6 Casos de prueba planificados por requerimiento (RF-01 al RF-16)
- **III. Criterios de aceptación o rechazo**
  - 6. Criterios de Aceptación Granulares
  - 7. Criterios de Rechazo o No Conclusión
  - 8. Criterios de suspensión
  - 9. Criterios de reanudación
- **IV. Entregables**
- **V. Recursos**
  - Requerimientos de entornos – Hardware (Tabla 1)
  - Requerimientos de entornos – Software (Tabla 2)
  - 10. Herramientas de pruebas requeridas (Tabla 3)
  - 11. Personal (Tabla 4)
  - 12. Entrenamiento
- **VI. Planificación y organización**
  - 13. Procedimientos para las pruebas
  - 14. Matriz de responsabilidades (Tabla 5)
  - 15. Cronograma (Tabla 6)
  - 16. Premisas
  - 17. Dependencias y Riesgos (Tabla 7)
- **VII. Referencias**
- **VIII. Glosario**

---

## Historial de versiones

| Fecha | Versión | Autor | Organización | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| 15/05/2026 | 1.0 | Sebastian Rodrigo Arce Bracamonte / Brant Antony Chata Choque | UPT | Elaboración inicial del plan de pruebas |
| 05/11/2026 | 1.4 | Sebastian Rodrigo Arce Bracamonte / Brant Antony Chata Choque | UPT | Consolidación del Plan de Pruebas sobre los requerimientos RF-01 a RF-16 |

## Información del proyecto

| Campo | Detalle |
| :--- | :--- |
| **Empresa / Organización** | Universidad Privada de Tacna (UPT) — Escuela Profesional de Ingeniería de Sistemas (EPIS) |
| **Proyecto** | FinanceFlow — Sistema Web de Balance y Clasificación Financiera Inteligente |
| **Fecha de preparación** | 05/11/2026 |
| **Cliente** | Usuarios de control financiero personal y familiar / Unidad académica EPIS |
| **Patrocinador principal** | Asignatura de Construcción de Software II — Mag. Ricardo Eduardo Valcárcel Alvarado |
| **Gerente / Líder de proyecto** | Equipo de desarrollo Grupo G03 (Brant Antony Chata Choque) |
| **Gerente / Líder de pruebas de software** | Responsable de QA del proyecto Grupo G03 (Sebastian Rodrigo Arce Bracamonte) |

## Aprobaciones

| Nombre y Apellido | Cargo | Departamento u organización | Fecha | Firma |
| :--- | :--- | :--- | :--- | :--- |
| Brant Antony Chata Choque | Integrante / Desarrollador Backend & SDK | UPT - EPIS | 05/11/2026 | |
| Sebastian Rodrigo Arce Bracamonte | Integrante / QA & Desarrollador Frontend | UPT - EPIS | 05/11/2026 | |
| Mag. Ricardo Eduardo Valcárcel Alvarado | Docente Supervisor del Curso | UPT - EPIS | 05/11/2026 | |

---

## I. Resumen ejecutivo

El presente Plan de Pruebas de Software define la estrategia, el alcance, los recursos, los criterios y la organización necesarios para validar la calidad del sistema web **FinanceFlow** (Sistema de Balance y Clasificación Financiera Inteligente). Su propósito es asegurar que las funcionalidades de gestión de ingresos y egresos, reconocimiento óptico de comprobantes (OCR), analítica financiera, planificación de compras y cierres contables operen de manera correcta, consistente, segura y usable antes de su liberación en ambiente operativo.

Este documento corresponde a un plan detallado de pruebas, ya que especifica los módulos a evaluar, tipos de pruebas, responsabilidades, entorno tecnológico (Node.js, Express 5, React 18, Python FastAPI, MongoDB Atlas, Jest, Supertest y React Testing Library), cronograma, riesgos y entregables. La estructura adoptada responde fielmente al formato institucional de Plan de Pruebas, manteniendo las secciones de alcance, estrategia, criterios, recursos, planificación, dependencias y glosario.

El esfuerzo de pruebas se orienta a la validación integral de los requerimientos funcionales del sistema especificados en el SRS v2.0, comprendidos entre el **RF-01** y el **RF-16**. Estos abarcan el registro e inicio de sesión de usuarios con JWT, recuperación de contraseña, registro de movimientos financieros, extracción OCR de vouchers, categorización dinámica, listado y desactivación lógica (*soft delete*), tarjetas de resumen y movimientos recientes en el Dashboard, alertas financieras automáticas, planificador de compras, reportes gráficos con Recharts, filtros de reportes, gestión de perfil de usuario y notificaciones/control de cierres contables pendientes.

El plan contempla pruebas unitarias, funcionales, de integración, de aceptación y de regresión, con énfasis en los flujos críticos del negocio financiero y en la interacción entre el cliente SPA en React, la API REST en Express, el cliente desacoplado `@sistema-balance/sdk`, el microservicio de Machine Learning/OCR en FastAPI y la persistencia en MongoDB Atlas. De esta manera, se busca verificar no solo el funcionamiento individual de cada requerimiento, sino también la trazabilidad, precisión aritmética de punto flotante y consistencia del balance contable.

---

## II. Alcance de las pruebas

El alcance de este plan comprende la verificación de las funcionalidades del sistema vinculadas al flujo integral de gestión financiera en FinanceFlow, desde el registro inicial y autenticación del usuario hasta la consulta de reportes gráficos, proyecciones de ahorro y control de cierres contables. Se consideran pruebas sobre reglas de negocio financieras, validaciones de entrada con esquemas Zod, persistencia de datos en MongoDB, integración con el microservicio de visión artificial/OCR y validación de la experiencia del usuario en la interfaz React.

Las pruebas se aplicarán sobre los siguientes requerimientos funcionales del sistema (definidos en el SRS v2.0):

- **RF-01:** Registro de usuario (con nombre, email y contraseña validados con Zod y cifrados con bcryptjs).
- **RF-02:** Inicio de sesión (con email y contraseña y emisión de token JWT con TTL de 7 días).
- **RF-03:** Recuperación de contraseña (mediante token temporal de un solo uso enviado por correo).
- **RF-04:** Registro de movimiento (ingreso o egreso con monto positivo, nombre, categoría y descripción).
- **RF-05:** Extracción OCR de vouchers (lectura automatizada de imágenes de comprobantes para autocompletar el formulario).
- **RF-06:** Categorización dinámica (categorías según tipo de movimiento y habilitación de campo personalizado al elegir "Otros").
- **RF-07:** Listado de movimientos (visualización de movimientos activos con indicación visual de inactivos).
- **RF-08:** Desactivación lógica de movimientos (*soft delete*, excluyendo el registro inactivo del balance y reportes sin borrarlo físicamente).
- **RF-09:** Tarjetas de resumen en Dashboard (Total Ingresos, Total Egresos, Balance Total y conteo de movimientos).
- **RF-10:** Movimientos recientes en Dashboard (tabla de últimas transacciones con opción de desactivación directa).
- **RF-11:** Alertas financieras (generación de advertencias automáticas ante patrones de gasto que superan el promedio histórico).
- **RF-12:** Planificador de compras (cálculo del tiempo estimado en meses para alcanzar una meta según la capacidad de ahorro mensual).
- **RF-13:** Reportes gráficos (visualización de distribución de gastos, ingresos por categoría, tendencia y balance mensual con Recharts).
- **RF-14:** Filtros de reportes (filtrado de movimientos por mes y por categoría en el módulo de reportes).
- **RF-15:** Perfil de usuario (consulta y edición de nombre y correo electrónico del usuario autenticado sin exponer `passwordHash`).
- **RF-16:** Notificaciones y control de cierres contables (visualización de avisos de arqueo diario y cierre mensual pendientes, y validación con contraseña).

Dentro del alcance también se contempla la validación de los controles de seguridad defensiva implementados en el backend (protección contra inyección NoSQL `$gt`, bloqueo de contaminación de prototipos `__proto__`, precisión aritmética de punto flotante IEEE 754 y control de acceso por roles en rutas administrativas y logs).

No forman parte de este plan las pruebas de integración con APIs bancarias reales en producción (Open Banking productivo de entidades financieras), pruebas de estrés masivo distribuido sobre infraestructura cloud pagada, auditorías de caja negra con herramientas comerciales externas ni validación de facturación electrónica ante SUNAT, lo cual es consistente con las exclusiones definidas en la sección 4 del presente documento.

---

### 1. Elementos de pruebas

Los elementos de prueba comprenden todos los artefactos de software del monorepo de FinanceFlow, tanto funcionales como técnicos, que serán sometidos a verificación para garantizar la integridad, calidad y trazabilidad del sistema. La selección de estos elementos se basa en los requerimientos funcionales RF-01 al RF-16 del SRS v2.0, así como en los componentes que intervienen en el backend Express, frontend React, paquete SDK y microservicio FastAPI.

Esta división por capas facilita la aplicación de la estrategia de pruebas definida en el plan, considerando pruebas unitarias, funcionales, de integración, aceptación y regresión sobre los módulos reales del repositorio.

#### 1.1 Módulos funcionales (Áreas de negocio)

Estos módulos representan las áreas del sistema vistas desde la perspectiva del usuario y del negocio, y constituyen el objetivo principal de las pruebas funcionales y de aceptación:

- Módulo de registro de usuarios (`RegisterPage.jsx`).
- Módulo de autenticación, control de acceso JWT y recuperación de contraseña (`LoginPage.jsx`, `ForgotPasswordPage.jsx`, `ResetPasswordPage.jsx`).
- Módulo de gestión y perfil de usuario (`ProfilePage.jsx`).
- Módulo de registro y categorización dinámica de movimientos financieros (`MovimientoFormPage.jsx`).
- Módulo de digitalización de comprobantes mediante OCR e Inteligencia Artificial (`useImageToMovimiento.js` / microservicio `ml_backend` y servicio Gemini Vision).
- Módulo de listado y administración de ingresos y egresos con desactivación lógica (`IngresosPage.jsx`, `EgresosPage.jsx`).
- Módulo de Dashboard financiero: tarjetas de resumen y movimientos recientes (`DashboardPage.jsx`).
- Módulo de alertas automáticas de anomalías de gasto (`AlertasComponent.jsx`, `useAnalisisGastos.js`).
- Módulo de planificación financiera de compras (`PlanificadorCompras.jsx`).
- Módulo de reportes estadísticos, gráficos interactivos y filtrado (`ReportesPage.jsx`, `Graficos.jsx`).
- Módulo de arqueo de caja chica y cierres contables mensuales (`cierres.controller.js`, `cierres.service.js`).
- Módulo de monetización Pro y administración de auditoría (`pagos.controller.js`, `admin.controller.js`, `logs.controller.js`).

#### 1.2 Componentes lógicos y técnicos (Artefactos de implementación)

Estos componentes constituyen la base técnica del backend, el frontend, el SDK y el servicio de IA, siendo esenciales para las pruebas unitarias, funcionales y de integración:

- **Controladores del Backend (`backend/controllers/`):** `usuarios.controller.js`, `movimientos.controller.js`, `cierres.controller.js`, `pagos.controller.js`, `admin.controller.js`, `logs.controller.js`, `ai.controller.js`.
- **Servicios de Negocio (`backend/services/`):** `usuarios.service.js`, `movimientos.service.js`, `cierres.service.js`, `email.service.js`, `gemini.service.js`.
- **Esquemas de Validación y Middlewares (`backend/schemas/`, `backend/middlewares/`):** `auth.schema.js`, `movimiento.schema.js`, `auth.js`, `validate.js`, `rateLimit.js`, `errorHandler.js`.
- **Modelos de Datos Mongoose (`backend/database/`):** `usuario.model.js`, `movimiento.model.js`, `cierre.model.js`, `pago.model.js`, `log.model.js`, `recordatorio.model.js`.
- **Páginas y Componentes React (`frontend/src/pages/`, `frontend/src/components/`):** Formularios de registro, login, nuevo movimiento, vistas de ingresos, egresos, dashboard, reportes, perfil y página 404 (`NotFoundPage.jsx`).
- **Cliente Desacoplado SDK (`sdk/`):** Clase `BalanceSDK` (`sdk/index.js`) y adaptador `movimientos-adapter.js`.
- **Microservicio ML/OCR (`ml_backend/`):** `main.py` (FastAPI con OpenCV, Tesseract OCR y clasificador Naive Bayes `train_model.py`).
- **Suites de Pruebas Automatizadas:**
  - `backend/__tests__/` (12 suites en Jest + Supertest, 29 pruebas).
  - `frontend/src/__tests__/` (9 suites en Jest + React Testing Library sobre JSDOM, 13 pruebas).
  - `sdk/tests/` (3 suites en Jest: 2 operativas con 38 pruebas aprobadas y 1 suite `movimientos-adapter.test.js` con hallazgo D-01 documentado).

---

### 2. Nuevas funcionalidades a probar

Desde la perspectiva del usuario final y en concordancia con el documento SRS v2.0 del proyecto FinanceFlow, se han priorizado las funcionalidades que componen el flujo integral del sistema:

- **RF-01 Registro de usuario:** El usuario completa el formulario de registro con su nombre, correo electrónico y contraseña; el sistema valida el formato mediante Zod, verifica la unicidad del correo y almacena la contraseña cifrada con bcryptjs.
- **RF-02 Iniciar sesión:** Los usuarios registrados acceden al sistema mediante credenciales válidas, recibiendo un token JWT firmado con vigencia de 7 días para el acceso a rutas protegidas.
- **RF-03 Recuperación de contraseña:** El usuario solicita el restablecimiento de su clave mediante correo electrónico, generándose un token temporal de un solo uso con expiración de 1 hora que permite definir una nueva contraseña segura.
- **RF-04 Registro de movimiento:** El usuario autenticado registra transacciones de tipo ingreso o egreso indicando nombre/concepto, monto estrictamente positivo, fecha y categoría, persistiendo el documento vinculado a su `userId`.
- **RF-05 Extracción OCR de vouchers:** El usuario carga la imagen de un comprobante de pago digital (Yape, Plin o boleta) y el sistema extrae automáticamente el monto, concepto y categoría sugerida para autocompletar el formulario.
- **RF-06 Categorización dinámica:** El formulario de movimientos actualiza dinámicamente el listado de categorías según el tipo seleccionado (ingreso o egreso) y habilita un campo adicional obligatorio cuando el usuario elige la opción "Otros".
- **RF-07 Listado de movimientos:** El sistema presenta en tablas separadas los movimientos de ingresos y egresos del usuario autenticado, diferenciando visualmente los registros activos de los inactivos.
- **RF-08 Desactivación lógica (*Soft Delete*):** El usuario puede inhabilitar un movimiento existente mediante `PATCH /api/movimientos/:id/inhabilitar`; el registro cambia a estado `inactivo` sin eliminarse físicamente de MongoDB y se descuenta de inmediato del cálculo del balance.
- **RF-09 Tarjetas de resumen:** El Dashboard calcula y muestra en tiempo real los indicadores consolidados de Total Ingresos, Total Egresos, Balance Neto Disponible y cantidad total de movimientos activos.
- **RF-10 Movimientos recientes:** El Dashboard despliega una tabla con las últimas transacciones registradas por el usuario e incorpora controles directos para su inactivación rápida.
- **RF-11 Alertas financieras:** El sistema analiza los egresos registrados por categoría y emite alertas visuales automáticas cuando un gasto supera los umbrales del promedio histórico del usuario (1.2x elevado / 1.5x muy elevado).
- **RF-12 Planificador de compras:** El usuario ingresa el nombre y costo de una meta de compra y el sistema calcula el número estimado de meses necesarios según su capacidad de ahorro mensual, bloqueando divisiones entre cero cuando el ahorro es nulo o negativo.
- **RF-13 Reportes gráficos:** El módulo de reportes renderiza gráficos estadísticos interactivos en Recharts (distribución de gastos por categoría, ingresos por categoría, tendencia de los últimos meses y balance mensual).
- **RF-14 Filtros de reportes:** El usuario filtra instantáneamente los registros y gráficos del módulo de reportes seleccionando el mes de consulta y la categoría específica.
- **RF-15 Perfil de usuario:** El usuario consulta y actualiza su nombre y correo electrónico desde su vista de perfil (`GET /api/usuarios/me` y `PUT /api/usuarios/me`), asegurando que el hash de contraseña nunca sea expuesto en la respuesta JSON.
- **RF-16 Notificaciones y control de cierres contables:** El sistema detecta periodos pendientes de cierre (arqueo diario del día anterior y cierre del mes anterior en `GET /api/cierres/pendientes`), muestra banners de aviso en el Dashboard y exige la validación de la contraseña del usuario (`POST /api/cierres`) para consolidar el cierre mensual.

---

### 3. Pruebas de regresión

El principio fundamental de la regresión en este plan es proteger los flujos financieros ya implementados que presentan alta integración entre la interfaz React, los adaptadores del SDK, los controladores Express y los modelos de MongoDB. Dado que cualquier cambio en la validación de montos, autenticación JWT o estados de transacciones impacta directamente en el balance del usuario, cualquier modificación debe validarse ejecutando la batería automatizada de Jest (`npm test`).

La regresión se ejecutará a nivel granular en las siguientes áreas de impacto crítico:

#### 3.1 Validación de Flujos de Acceso y Seguridad
Se verificará la correcta persistencia de usuarios, la emisión y verificación de tokens JWT, la recuperación de clave y la edición de perfil, cubriendo **RF-01**, **RF-02**, **RF-03** y **RF-15** mediante las suites `usuarios.controller.test.js`, `usuarios.integration.test.js`, `recuperacion.test.js` y `security.unit.test.js`. Un fallo en esta capa comprometería la confidencialidad o permitiría inyecciones NoSQL (`$gt`).

#### 3.2 Registro, Categorización y Precisión de Movimientos
Se validará que la creación de transacciones (**RF-04**), la selección de categorías dinámicas (**RF-06**) y el cálculo aritmético (**RF-09**) no sufran errores de redondeo de punto flotante IEEE 754 ni desfasajes de zona horaria (UTC-5 Lima), ejecutando `movimientos.controller.test.js`, `movimientos.unit.test.js` y `finance.unit.test.js`.

#### 3.3 Integridad de Listados y Borrado Lógico (Soft Delete)
Se pondrá especial énfasis en la relación entre el listado de transacciones (**RF-07**), los movimientos recientes (**RF-10**) y la inactivación lógica (**RF-08**) validada en `e2e.test.js`, comprobando que al inactivar un registro su monto se excluya del saldo disponible sin destruir el documento histórico en la base de datos.

#### 3.4 Extracción OCR y Tolerancia a Fallos del Servicio de IA
Se revisará la estabilidad de **RF-05** (Extracción OCR de vouchers), verificando que la comunicación con el servicio de IA/FastAPI autocompleta los campos cuando la imagen es nítida y que, ante baja confianza o desconexión del servicio externo, la interfaz active el modo de ingreso manual (*fallback*) sin bloquear la aplicación.

#### 3.5 Analítica, Alertas y Planificador Financiero
Se comprobará que las tarjetas de resumen (**RF-09**), las alertas automáticas de gasto (**RF-11**) y las proyecciones del Planificador de Compras (**RF-12**) mantengan cálculos consistentes y prevengan errores matemáticos cuando el usuario tiene saldo negativo o cero (`DashboardPage.test.jsx`).

#### 3.6 Reportes Gráficos, Filtros y Cierres Contables
Finalmente, se mantendrá la verificación de **RF-13** (Reportes gráficos), **RF-14** (Filtros de reportes) y **RF-16** (Notificaciones y cierres contables) mediante `ReportesPage.test.jsx` y `cierres.test.js`, asegurando que los cierres mensuales exijan confirmación de contraseña y que los gráficos Recharts rendericen sin errores.

---

### 4. Funcionalidades a no probar

Justificación y riesgos de las exclusiones dentro del presente Plan de Pruebas:

- **Integración con APIs bancarias reales en producción (Open Banking comercial):** Se excluye porque el alcance del proyecto académico contempla únicamente el registro manual, digitalización OCR y simulación local, sin convenios comerciales ni acceso a entornos productivos del sistema financiero peruano (BCP, BBVA, Interbank). El riesgo es que una futura integración bancaria real requiera un ciclo específico de homologación de seguridad y contratos de API.
- **Pruebas de estrés o concurrencia masiva distribuida en la nube:** Se excluyen pruebas de denegación de servicio a gran escala porque los entornos de despliegue utilizan capas académicas/gratuitas en Vercel, Render y MongoDB Atlas (M0/Starter). Únicamente se ejecuta una simulación controlada de 50 iteraciones en el SDK local. El riesgo es la latencia por arranque en frío (*cold start*) en el contenedor gratuito de Render ante picos abruptos de tráfico.
- **Pruebas de penetración ofensiva con herramientas comerciales externas:** El plan incluye pruebas automatizadas defensivas contra inyección NoSQL (`$gt`), contaminación de prototipos (`__proto__`) y fuzzing de montos en `security.unit.test.js`, pero excluye auditorías de red intrusivas o *pentesting* externo por carecer de un laboratorio de red aislado dedicado.
- **Compatibilidad exhaustiva en navegadores obsoletos o secundarios:** La validación de interfaz se centra en Google Chrome (última versión estable) y en el entorno virtual JSDOM de React Testing Library por restricciones de tiempo del ciclo académico. El riesgo es la posible variación visual menor en motores antiguos como Safari legacy o navegadores móviles no basados en Chromium.
- **Cobros reales con tarjetas bancarias en producción:** Las pruebas del módulo de pagos (`pagos.unit.test.js`) se ejecutan exclusivamente con mocks y credenciales de prueba (*sandbox*), evitando cargos monetarios reales.

---

### 5. Enfoque de pruebas (estrategia)

El enfoque de pruebas de FinanceFlow se establece bajo un modelo de aseguramiento de calidad basado en la pirámide de pruebas, priorizando la ejecución de pruebas automatizadas rápidas y determinísticas en el backend y el SDK antes de validar el renderizado de componentes en el frontend y los flujos de aceptación de usuario. La estrategia combina pruebas unitarias, pruebas funcionales/de integración, pruebas de aceptación (End-to-End) y pruebas de regresión aplicadas de forma incremental sobre los requerimientos RF-01 al RF-16.

Esta aproximación permite detectar defectos en etapas tempranas del desarrollo, proteger la exactitud matemática de los balances financieros y asegurar que los módulos de autenticación, transacciones, OCR, reportes, planificador y cierres mantengan su comportamiento esperado al integrarse entre sí.

#### 5.1 Pruebas unitarias

Las pruebas unitarias constituyen la base fundamental de la calidad de código en FinanceFlow, asegurando la confiabilidad a nivel de componente, controlador, esquema Zod y funciones matemáticas. Estas validan funciones aisladas utilizando **Jest** (`v29.7.0`) y dobles de prueba (`jest.spyOn`, `jest.fn`) bajo `NODE_ENV=test` para evitar dependencias de red con MongoDB Atlas durante la validación de la lógica pura.

Este nivel es especialmente importante para los requerimientos **RF-01**, **RF-02**, **RF-03**, **RF-04**, **RF-06**, **RF-09**, **RF-15** y **RF-16**, así como para la precisión aritmética financiera (`finance.unit.test.js`) y la seguridad contra inyecciones (`security.unit.test.js`).

**Objetivos:**
- Validar reglas de negocio específicas, como la precisión decimal en sumas y restas monetarias (`0.1 + 0.2 = 0.30` exacto en `TC-FIN-01`) y la normalización de fechas en zona horaria UTC-5 (`TC-FIN-02`).
- Verificar respuestas esperadas ante entradas válidas e inválidas mediante esquemas Zod (`auth.schema.js` y `movimiento.schema.js`, que cuentan con 100% de cobertura de líneas).
- Confirmar la protección de rutas autenticadas, el rechazo de contraseñas erróneas en cierres y movimientos históricos, y la no exposición de `passwordHash`.
- Asegurar que el cliente `@sistema-balance/sdk` gestione tokens, parámetros de consulta y estadísticas de manera aislada (`sdk.test.js` y `sdk-integration.test.js`).

#### 5.2 Pruebas funcionales y de integración

Las pruebas funcionales y de integración verifican la interacción correcta entre las rutas HTTP de Express, los middlewares de validación y autenticación (`auth.js`, `validate.js`, `rateLimit.js`), los controladores, los servicios de negocio y el renderizado reactivo de las páginas en React.

En el backend se emplea **Jest + Supertest** para automatizar peticiones HTTP completas (`POST`, `GET`, `PUT`, `PATCH`) sobre la instancia de la aplicación Express (`app.js`), mientras que en el frontend se utiliza **React Testing Library** sobre entorno **JSDOM** para verificar formularios, validaciones inline, estados de carga y consumo de adaptadores.

**Objetivos:**
- Comprobar el flujo encadenado de registro e inicio de sesión con emisión de token JWT (`usuarios.integration.test.js`).
- Validar la creación, consulta y restricción de movimientos financieros, cierres contables, pagos y bitácoras de auditoría (`movimientos.controller.test.js`, `cierres.test.js`, `pagos.unit.test.js`, `logs.controller.test.js`).
- Confirmar el montaje correcto y la validación de formularios en las vistas React (`LoginPage.test.jsx`, `RegisterPage.test.jsx`, `MovimientoFormPage.test.jsx`, `ProfilePage.test.jsx`, `ReportesPage.test.jsx`, `DashboardPage.test.jsx`, `IngresosPage.test.jsx`, `EgresosPage.test.jsx`, `NotFoundPage.test.jsx`).
- Verificar la integración del flujo OCR (FastAPI / Gemini Vision) y su mecanismo de contingencia (*fallback*) manual cuando la imagen es ilegible o el servicio no está disponible.

#### 5.3 Pruebas de aceptación (End-to-End)

Las pruebas de aceptación (PA / UAT) constituyen el filtro de validación desde la perspectiva del usuario final antes de la liberación. Se orientan al recorrido completo de negocio en FinanceFlow, combinando la suite automatizada de ciclo de vida (`backend/__tests__/e2e.test.js`) con la ejecución de escenarios de usuario en el navegador web **Google Chrome** sobre los entornos Alfa (local) y Beta (Vercel/Render).

**Objetivos:**
- Verificar que el sistema cumpla con los criterios esperados por el usuario en términos de avisos visuales, mensajes de error claros y actualización inmediata de saldos.
- Confirmar la usabilidad de los formularios de autenticación y registro de movimientos, la visualización de gráficos en Recharts y la proyección de metas en el Planificador de Compras.
- Validar flujos completos de negocio de extremo a extremo: Registro de cuenta $\rightarrow$ Inicio de sesión $\rightarrow$ Registro de ingreso/egreso (manual y con voucher OCR) $\rightarrow$ Consulta de tarjetas y alertas en Dashboard $\rightarrow$ Inactivación lógica (*soft delete*) $\rightarrow$ Filtrado de reportes $\rightarrow$ Cierre contable.

#### 5.4 Pruebas de regresión

Se ejecutan de manera sistemática tras cualquier modificación de código, corrección de defectos o refactorización arquitectónica (tanto localmente mediante `npm test` como automáticamente en el pipeline de GitHub Actions `.github/workflows/ci.yml` en cada `push` o `pull_request`) para prevenir la introducción de defectos en funcionalidades previamente certificadas.

El alcance de la regresión cubre las 12 suites del backend (29 pruebas), las 9 suites del frontend (13 pruebas) y las suites operativas del SDK (38 pruebas).

**Objetivos:**
- Verificar que los cambios aplicados no alteren el comportamiento de los requerimientos RF-01 al RF-16 ya aprobados.
- Confirmar que las correcciones de seguridad (remediación de hallazgos en `AUDITORIA_SEGURIDAD.md`) no bloqueen operaciones legítimas del usuario.
- Mantener la estabilidad de los flujos críticos de autenticación, cálculo de balance e inactivación lógica con una ejecución automatizada menor a 10 segundos.
- Detectar de forma temprana incompatibilidades de módulos o dependencias entre backend, frontend y SDK (como el hallazgo D-01 identificado en `movimientos-adapter.test.js`).

#### 5.5 Priorización

La priorización de la ejecución de pruebas se define por el impacto directo en la integridad financiera y seguridad de los datos del usuario, la dependencia secuencial entre módulos y el nivel de criticidad asignado en el SRS v2.0:

1. **Prioridad 1 — Crítica (Acceso y Seguridad Base):** **RF-01** (Registro de usuario), **RF-02** (Iniciar sesión) y **RF-03** (Recuperación de contraseña). Son módulos bloqueantes que constituyen el prerrequisito de identidad (`userId` y token JWT) para todas las demás operaciones del sistema.
2. **Prioridad 2 — Crítica (Núcleo Transaccional y Contable):** **RF-04** (Registro de movimiento), **RF-06** (Categorización dinámica), **RF-07** (Listado de movimientos), **RF-08** (Desactivación lógica) y **RF-16** (Notificaciones y control de cierres contables). Concentran la creación, integridad e inmutabilidad de los registros monetarios.
3. **Prioridad 3 — Alta (Consolidación de Balance y Dashboard):** **RF-09** (Tarjetas de resumen) y **RF-10** (Movimientos recientes). Reflejan el saldo neto disponible del usuario en tiempo real; un error de cálculo o redondeo afecta directamente la confiabilidad del sistema.
4. **Prioridad 4 — Media (Automatización con IA, Alertas y Proyección):** **RF-05** (Extracción OCR de vouchers), **RF-11** (Alertas financieras), **RF-12** (Planificador de compras) y **RF-13** (Reportes gráficos). Aportan el valor diferencial de inteligencia y analítica sobre los datos transaccionales ya registrados.
5. **Prioridad 5 — Baja (Consultas Auxiliares y Configuración):** **RF-14** (Filtros de reportes) y **RF-15** (Perfil de usuario). Son funciones de soporte, consulta focalizada y mantenimiento de datos de cuenta que no alteran el motor de cálculo contable.

---

#### 5.6 Casos de prueba planificados por requerimiento

Esta sección organiza el plan de cobertura para cada uno de los requerimientos funcionales **RF-01 al RF-16** del sistema FinanceFlow, definiendo los casos de prueba unitarios (**PU**), funcionales/integración (**PF**) y de aceptación (**PA**) de manera granular:

##### 5.6.1 RF-01 – Registro de usuario
**Objetivo:** Verificar que el sistema permita registrar correctamente a un nuevo usuario y almacene sus credenciales de manera válida y segura en MongoDB.
- **PU-01A:** Validar que el esquema Zod (`auth.schema.js`) y el formulario rechacen campos obligatorios vacíos, nombres demasiado cortos o contraseñas menores a 6 caracteres.
- **PU-01B:** Validar en `usuarios.controller.test.js` que el controlador rechace correos electrónicos duplicados (código HTTP distinto de 201 / HTTP 400-409), protegiendo la unicidad de la cuenta.
- **PF-01A:** Verificar que `POST /api/usuarios/register` cree el registro de usuario con estado `activo` y retorne HTTP 201 Created.
- **PF-01B:** Verificar que la contraseña se almacene cifrada mediante hashing seguro con `bcryptjs` (10 salt rounds) y nunca en texto plano.
- **PA-01A:** Validar en `RegisterPage.jsx` que el usuario complete el formulario de registro, visualice la confirmación de éxito y sea redirigido a la vista de inicio de sesión.

##### 5.6.2 RF-02 – Iniciar sesión
**Objetivo:** Verificar que los usuarios registrados accedan correctamente al sistema mediante JWT y que se bloqueen estrictamente credenciales inválidas o ataques de inyección.
- **PU-02A:** Validar que la autenticación falle con código HTTP 401 ante contraseñas erróneas o usuarios inexistentes.
- **PU-02B:** Validar en `security.unit.test.js` (`TC-INJ-01`) que el endpoint `/api/usuarios/login` rechace intentos de inyección NoSQL mediante operadores `{ "$gt": "" }` con HTTP 400/401 sin emitir token.
- **PF-02A:** Verificar en `usuarios.integration.test.js` que el inicio de sesión válido genere y retorne un token JWT firmado con vigencia de 7 días.
- **PF-02B:** Verificar que el middleware `auth.js` bloquee el acceso a rutas protegidas cuando no se envía token o cuando el token es inválido/expirado (HTTP 401).
- **PA-02A:** Validar en `LoginPage.jsx` que el usuario ingrese credenciales válidas y acceda inmediatamente al `/dashboard`.
- **PA-02B:** Validar en `LoginPage.test.jsx` que el sistema muestre mensajes de error claros ("Email inválido" o "Credenciales inválidas") ante entradas incorrectas.

##### 5.6.3 RF-03 – Recuperación de contraseña
**Objetivo:** Verificar el flujo seguro de restablecimiento de contraseña mediante token temporal de un solo uso.
- **PU-03A:** Validar en `recuperacion.test.js` que `POST /api/usuarios/forgot-password` genere un token temporal y enlace de recuperación para un correo registrado.
- **PU-03B:** Validar que `POST /api/usuarios/verify-reset-token` compruebe correctamente la vigencia del token y rechace tokens expirados o inexistentes.
- **PF-03A:** Verificar en `recuperacion.test.js` que `POST /api/usuarios/reset-password` actualice el hash de la contraseña con `bcryptjs` y anule el token utilizado (`resetPasswordToken = null`).
- **PF-03B:** Verificar que el token de recuperación no pueda reutilizarse una vez consumido en el cambio de clave.
- **PA-03A:** Validar desde `ForgotPasswordPage.jsx` y `ResetPasswordPage.jsx` que el usuario solicite la recuperación, ingrese su nueva contraseña y reciba confirmación visual de actualización exitosa.

##### 5.6.4 RF-04 – Registro de movimiento
**Objetivo:** Verificar el registro y persistencia de transacciones financieras (ingresos y egresos) garantizando montos positivos y asociación al usuario autenticado.
- **PU-04A:** Validar en `movimiento.schema.js` y `security.unit.test.js` (`TC-SEC-02`) que se rechacen montos negativos, cero, `null`, `NaN`, `Infinity` o cadenas maliciosas con HTTP 400/422.
- **PU-04B:** Validar en `movimientos.unit.test.js` que el registro de movimientos históricos (`POST /api/movimientos/historico`) exija la contraseña del usuario y rechace claves incorrectas con HTTP 401.
- **PF-04A:** Verificar en `movimientos.controller.test.js` que `POST /api/movimientos` con token Bearer válido cree el movimiento y retorne HTTP 201 Created.
- **PF-04B:** Verificar que el documento creado en MongoDB incluya `userId`, `tipo`, `monto`, `categoria`, `fecha` normalizada y `estado: 'activo'`.
- **PA-04A:** Validar en `MovimientoFormPage.jsx` que el usuario registre un ingreso o egreso válido y observe su incorporación inmediata en el balance del sistema.
- **PA-04B:** Validar en `MovimientoFormPage.test.jsx` que el formulario bloquee el envío cuando los campos requeridos (nombre, monto, categoría) estén vacíos.

##### 5.6.5 RF-05 – Extracción OCR de vouchers
**Objetivo:** Verificar la extracción automatizada de monto, fecha y categoría a partir de imágenes de comprobantes de pago (Yape/Plin/boletas) y el manejo de contingencias.
- **PU-05A:** Validar que el hook/servicio rechace archivos con formato no soportado o cargas vacías antes de invocar el procesamiento OCR.
- **PU-05B:** Validar la función de preprocesamiento y extracción de patrones numéricos de moneda sobre el texto devuelto por el motor OCR.
- **PF-05A:** Verificar la integración entre el frontend (`useImageToMovimiento.js`) y el servicio de IA/OCR (`ml_backend/main.py` o `/api/ai`), comprobando el retorno del JSON con monto y categoría sugerida.
- **PF-05B:** Verificar la tolerancia a fallos (*fallback*): si el microservicio FastAPI está fuera de línea o la imagen es borrosa, el sistema captura la excepción sin colapsar y habilita la edición manual.
- **PA-05A:** Validar que el usuario suba la captura legible de un voucher de Yape y observe cómo los campos del formulario se autocompletan automáticamente.
- **PA-05B:** Validar que al subir una imagen ilegible se muestre un aviso claro al usuario invitándolo a completar los datos manualmente.

##### 5.6.6 RF-06 – Categorización dinámica
**Objetivo:** Verificar que las categorías se filtren dinámicamente según el tipo de movimiento y que la opción "Otros" habilite la especificación personalizada.
- **PU-06A:** Validar que el esquema de validación rechace un movimiento cuando el campo de categoría esté vacío o no corresponda a un valor permitido.
- **PU-06B:** Validar que al seleccionar la categoría "Otros" se exija obligatoriamente el texto de la categoría personalizada.
- **PF-06A:** Verificar en `MovimientoFormPage.jsx` que al alternar el selector entre "Ingreso" y "Egreso" se actualice inmediatamente la lista de categorías disponibles.
- **PF-06B:** Verificar que el movimiento guardado con categoría personalizada persista correctamente dicho valor en la base de datos.
- **PA-06A:** Validar en la interfaz que al hacer clic en "Otros" se despliegue dinámicamente el campo de texto adicional y permita guardar la transacción personalizada.

##### 5.6.7 RF-07 – Listado de movimientos
**Objetivo:** Verificar la consulta y visualización diferenciada de los movimientos de ingresos y egresos pertenecientes exclusivamente al usuario autenticado.
- **PU-07A:** Validar en `movimientos.controller.test.js` que `GET /api/movimientos` retorne un arreglo JSON válido con estado HTTP 200.
- **PU-07B:** Validar el aislamiento de datos por usuario (`userId`), asegurando que una consulta nunca devuelva transacciones de terceros.
- **PF-07A:** Verificar en `IngresosPage.test.jsx` y `EgresosPage.test.jsx` que las vistas filtren y rendericen correctamente las tablas de ingresos y egresos respectivamente.
- **PF-07B:** Verificar que la tabla distinga visualmente los movimientos en estado `activo` de aquellos en estado `inactivo`.
- **PA-07A:** Validar que el usuario navegue a las vistas de Ingresos y Egresos y visualice el listado completo y ordenado de sus transacciones registradas.

##### 5.6.8 RF-08 – Desactivación lógica (Soft Delete)
**Objetivo:** Verificar que la inactivación de un movimiento conserve el registro histórico para auditoría pero excluya su monto del balance y reportes activos.
- **PU-08A:** Validar que el servicio de inactivación cambie el atributo `estado` a `'inactivo'` sin ejecutar un borrado físico (`deleteOne`) en la colección.
- **PU-08B:** Validar que un usuario no pueda inactivar un movimiento cuyo `userId` pertenezca a otra cuenta (protección contra IDOR, retornando HTTP 403/404).
- **PF-08A:** Verificar en `e2e.test.js` el flujo encadenado de creación, listado e inactivación lógica de un movimiento financiero.
- **PF-08B:** Verificar que tras ejecutar `PATCH /api/movimientos/:id/inhabilitar`, el recálculo del balance general descuente inmediatamente el monto inactivado.
- **PA-08A:** Validar en la interfaz que al presionar el botón de inactivar sobre una fila activa, esta cambie a estilo atenuado/gris y las tarjetas de saldo se actualicen al instante.

##### 5.6.9 RF-09 – Tarjetas de resumen
**Objetivo:** Verificar la exactitud matemática y visualización en tiempo real de las tarjetas de Total Ingresos, Total Egresos, Balance Neto y conteo de movimientos en el Dashboard.
- **PU-09A:** Validar en `finance.unit.test.js` (`TC-FIN-01`) que la suma de ingresos (`19.90 + 50.15 + 100.25`) menos egresos (`10.30 + 20.40`) arroje exactamente `139.60` a dos decimales, evitando errores de coma flotante IEEE 754.
- **PU-09B:** Validar que los movimientos con estado `inactivo` sean excluidos del acumulador de ingresos y egresos.
- **PF-09A:** Verificar en `DashboardPage.test.jsx` que el componente monte correctamente las tarjetas de resumen incluso cuando la lista inicial de movimientos está vacía (mostrando saldo `S/ 0.00`).
- **PF-09B:** Verificar la sincronización reactiva de las tarjetas tras agregar o desactivar una transacción.
- **PA-09A:** Validar que el usuario visualice en la parte superior del Dashboard sus totales actualizados en moneda local con formato de dos decimales.

##### 5.6.10 RF-10 – Movimientos recientes
**Objetivo:** Verificar que el Dashboard muestre las transacciones más recientes del usuario y permita gestionarlas directamente.
- **PU-10A:** Validar el ordenamiento descendente por fecha de las transacciones recientes y la normalización horaria UTC-5 (`TC-FIN-02`).
- **PU-10B:** Validar el comportamiento del componente cuando el usuario aún no registra movimientos (mensaje informativo de tabla vacía).
- **PF-10A:** Verificar en `DashboardPage.test.jsx` que la tabla de movimientos recientes se renderice dentro del contenedor principal del Dashboard.
- **PF-10B:** Verificar que la acción de desactivar un movimiento desde la tabla de recientes actualice simultáneamente la fila y las tarjetas de resumen superior.
- **PA-10A:** Validar que el usuario consulte sus últimos movimientos apenas inicia sesión en el Dashboard sin necesidad de cambiar de página.

##### 5.6.11 RF-11 – Alertas financieras
**Objetivo:** Verificar la generación automática de alertas preventivas cuando los gastos del usuario superan los umbrales de su promedio histórico por categoría.
- **PU-11A:** Validar la regla algorítmica en `useAnalisisGastos.js` que detecta excesos superiores a 1.2x ("gasto elevado") y 1.5x ("gasto muy elevado") respecto al promedio de la categoría.
- **PU-11B:** Validar que no se disparen falsas alertas cuando los egresos se mantienen dentro del rango normal o cuando solo existen ingresos.
- **PF-11A:** Verificar que el componente `AlertasComponent.jsx` reciba la lista de anomalías detectadas y renderice los avisos correspondientes en el Dashboard.
- **PF-11B:** Verificar que al inactivar el egreso causante del exceso, la alerta desaparezca automáticamente al recalcularse el estado.
- **PA-11A:** Validar que al registrar un gasto de S/ 1600.00 en una categoría cuyo promedio es S/ 500.00, el usuario visualice de forma destacada la alerta preventiva en pantalla.

##### 5.6.12 RF-12 – Planificador de compras
**Objetivo:** Verificar el cálculo algorítmico del tiempo estimado de ahorro para alcanzar metas de compra y la prevención de errores por capacidad de ahorro nula o negativa.
- **PU-12A:** Validar la fórmula de proyección $\lceil \text{Costo Meta} / \text{Ahorro Mensual} \rceil$ para valores positivos (ej. meta de S/ 2400.00 con ahorro de S/ 400.00 retorna exactamente 6 meses).
- **PU-12B:** Validar que cuando el ahorro mensual es menor o igual a `0`, la función bloquee el cálculo evitando divisiones entre cero (`Infinity` o `NaN`).
- **PF-12A:** Verificar en `DashboardPage.test.jsx` la navegación e interacción con la pestaña del Planificador de Compras (`PlanificadorCompras.jsx`).
- **PF-12B:** Verificar que el componente procese el balance neto actual del usuario desde el estado global de movimientos.
- **PA-12A:** Validar que un usuario con saldo positivo ingrese una meta de compra y visualice el número de meses estimados y la cuota recomendada.
- **PA-12B:** Validar que un usuario con saldo cero o negativo reciba la advertencia preventiva indicando que su capacidad de ahorro actual es insuficiente para calcular metas.

##### 5.6.13 RF-13 – Reportes gráficos
**Objetivo:** Verificar la generación y renderizado de gráficos estadísticos interactivos (barras, líneas y pastel/donut) sobre el historial financiero del usuario.
- **PU-13A:** Validar las funciones de agrupación de montos por categoría y por mes utilizadas como fuente de datos para Recharts.
- **PU-13B:** Validar que el agregador de reportes ignore los registros marcados como `inactivo`.
- **PF-13A:** Verificar en `ReportesPage.test.jsx` que la vista de reportes cargue asíncronamente los datos del servicio de movimientos y monte los contenedores gráficos sin lanzar excepciones en el DOM virtual.
- **PF-13B:** Verificar que `Graficos.jsx` actualice las series visuales al cambiar los datos de entrada.
- **PA-13A:** Validar que el usuario acceda al módulo de Reportes y visualice claramente los gráficos de distribución de gastos, ingresos por categoría y balance mensual.

##### 5.6.14 RF-14 – Filtros de reportes
**Objetivo:** Verificar el funcionamiento de los filtros por mes y por categoría dentro del módulo de reportes financieros.
- **PU-14A:** Validar la función de filtrado en cliente para combinaciones específicas de mes/año y categoría.
- **PU-14B:** Validar que al seleccionar un filtro sin coincidencias se retorne una colección vacía controlada sin errores de ejecución.
- **PF-14A:** Verificar que al cambiar el selector de mes o categoría en `ReportesPage.jsx` se actualicen tanto la tabla de movimientos filtrados como los totales mostrados.
- **PF-14B:** Verificar que la opción de restablecer filtros ("Todos") devuelva la totalidad de movimientos activos del periodo.
- **PA-14A:** Validar que el usuario filtre sus movimientos por un mes y categoría específicos y observe los resultados actualizados instantáneamente sin recargar el navegador.

##### 5.6.15 RF-15 – Perfil de usuario
**Objetivo:** Verificar que el usuario autenticado pueda consultar y actualizar su nombre y correo electrónico manteniendo la seguridad de su cuenta.
- **PU-15A:** Validar en `usuarios.controller.test.js` que `GET /api/usuarios/me` retorne los datos del perfil (`nombre`, `email`, `estado`) y garantice que `passwordHash` y `password` sean `undefined`.
- **PU-15B:** Validar en `usuarios.controller.test.js` que `PUT /api/usuarios/me` actualice satisfactoriamente el nombre y correo del usuario retornando HTTP 200.
- **PF-15A:** Verificar en `ProfilePage.test.jsx` la carga asíncrona de los datos del usuario mediante el adaptador y su despliegue en los campos del formulario.
- **PF-15B:** Verificar que la modificación del perfil persista los cambios en MongoDB y mantenga activa la sesión del usuario.
- **PA-15A:** Validar que el usuario edite su nombre en `ProfilePage.jsx`, guarde los cambios y visualice la confirmación con sus datos actualizados en la interfaz.

##### 5.6.16 RF-16 – Notificaciones y control de cierres contables
**Objetivo:** Verificar la detección de periodos contables pendientes de cierre (diario y mensual), la notificación al usuario y el registro formal del cierre exigiendo confirmación de contraseña.
- **PU-16A:** Validar en `cierres.test.js` que `GET /api/cierres/pendientes` identifique correctamente si el día anterior (`yesterday`) y el mes anterior (`prevMonth`) se encuentran pendientes de cierre (`isClosed: false`).
- **PU-16B:** Validar en `cierres.test.js` que `POST /api/cierres` rechace con HTTP 400 cualquier intento de cierre mensual cuando no se proporciona la contraseña de confirmación.
- **PF-16A:** Verificar en `cierres.test.js` que `POST /api/cierres` valide el hash de la contraseña con `bcrypt.compare`, calcule la conciliación entre `saldoEsperado` y `saldoFisico` y registre el cierre con HTTP 201.
- **PF-16B:** Verificar la integridad del modelo `cierre.model.js` (100% de cobertura en Jest) para almacenar el periodo, tipo de cierre, montos y diferencia.
- **PA-16A:** Validar que el usuario visualice el banner de notificación cuando existan cierres pendientes y pueda completar el cierre contable ingresando su saldo físico y contraseña válida.

---

## III. Criterios de aceptación o rechazo

### 6. Criterios de Aceptación Granulares

El Plan de Pruebas del sistema FinanceFlow se considerará completado y la versión evaluada estará lista para aprobación académica o pase a producción únicamente si se cumple la totalidad de los siguientes criterios técnicos y funcionales:

- **Cobertura y Ejecución de Casos de Prueba (Granularidad por Nivel):**
  - Ejecución y aprobación del **100%** de las suites de prueba automatizadas del **Backend** (`12 de 12 suites`, `29 de 29 pruebas` en Jest + Supertest), cubriendo registro, login, perfil, movimientos, movimientos históricos, cierres contables, recuperación de clave, pagos, logs, administración, precisión matemática y seguridad contra inyecciones.
  - Ejecución y aprobación del **100%** de las suites de prueba automatizadas del **Frontend** (`9 de 9 suites`, `13 de 13 pruebas` en React Testing Library), cubriendo las vistas `LoginPage`, `RegisterPage`, `DashboardPage`, `IngresosPage`, `EgresosPage`, `MovimientoFormPage`, `ReportesPage`, `ProfilePage` y `NotFoundPage`.
  - Ejecución y aprobación del **100%** de las pruebas operativas del núcleo del **SDK** (`38 de 38 pruebas` en `sdk.test.js` y `sdk-integration.test.js`) y de los casos de prueba funcionales/aceptación catalogados para los requerimientos **RF-01 al RF-16**.
- **Métrica de Éxito y Tasa de Fallo:**
  - La tasa de éxito de los casos de prueba ejecutados sobre el sistema (Backend + Frontend + Casos Funcionales/UAT de RF-01 a RF-16) debe ser igual o superior al **95%** (alcanzando actualmente el **100%** de aprobación en las 80 pruebas automatizadas ejecutadas y en los casos funcionales validados).
  - Cumplimiento exitoso del **100%** en los flujos críticos de seguridad y precisión financiera: cifrado bcrypt, firma JWT, bloqueo de inyección NoSQL (`TC-INJ-01`), bloqueo de contaminación de prototipos (`TC-INJ-02`) y exactitud decimal (`TC-FIN-01`).
- **Gestión de Defectos y Calidad de Código:**
  - Cierre total (**100%**) de todos los defectos clasificados como Críticos o Bloqueantes en la lógica transaccional y de seguridad del servidor (los 12 hallazgos de seguridad del backend se encuentran 100% remediados y certificados en `AUDITORIA_SEGURIDAD.md`).
  - Todo hallazgo técnico o deuda de configuración no bloqueante (como el **Defecto D-01** de transpilación ESM en `movimientos-adapter.test.js` o la ampliación de cobertura de servicios en el Sprint 7) debe encontrarse formalmente registrado, documentado en el Registro de Incidencias y asignado a un responsable en la matriz 5W+1H / Gantt.
  - Cobertura de validación de esquemas de entrada (`backend/schemas/`) al **100%** en Jest/Istanbul.
- **Documentación y Evidencias:**
  - Existencia de evidencias verificables de ejecución: reportes de consola de Jest y Supertest, tabla de cobertura de Istanbul (`--coverage`), resultados de `npm audit`, matriz de trazabilidad actualizada (RF-01 a RF-16) y catálogo de casos de prueba ejecutados.

---

### 7. Criterios de Rechazo o No Conclusión

El plan de pruebas se considerará no concluido o la versión del sistema será rechazada para liberación si ocurre cualquiera de las siguientes condiciones:

- Persiste al menos un defecto clasificado como **Crítico** en los flujos principales: imposibilidad de registrar usuarios o iniciar sesión (RF-01, RF-02), pérdida o corrupción de movimientos financieros (RF-04, RF-07), fallo en el borrado lógico que altere saldos (RF-08) o errores de redondeo aritmético en el cálculo del balance general (RF-09).
- La tasa de éxito en las suites automatizadas de Backend (`backend/__tests__/`) o Frontend (`frontend/src/__tests__/`) cae por debajo del **90%**, o alguna de las 21 suites principales de aplicación falla durante la ejecución de regresión (`npm test`).
- Se detecta exposición de información sensible en las respuestas de la API (por ejemplo, filtración del campo `passwordHash` en `GET /api/usuarios/me` o aceptación de operadores de inyección NoSQL `$gt` en el login).
- Se identifican violaciones de aislamiento entre cuentas que permitan a un usuario consultar, modificar o inactivar movimientos financieros pertenecientes a otro `userId`.
- No existen evidencias reproducibles de la ejecución de las pruebas o no se cuenta con la matriz de trazabilidad que vincule los requerimientos RF-01 a RF-16 con sus respectivos casos de prueba.

---

### 8. Criterios de suspensión

Las actividades de ejecución de pruebas podrán suspenderse de manera inmediata y temporal para un módulo o para la totalidad del ciclo de QA si se cumple alguna de las siguientes condiciones críticas:

- **Bloqueo de funcionalidad base de autenticación o persistencia:** Si un defecto crítico en el módulo de autenticación JWT (`auth.js` / `usuarios.controller.js`) o en la configuración de modelos Mongoose impide la ejecución del **25% o más** de los casos de prueba dependientes (como registro de movimientos, dashboard, reportes, planificador o cierres).
- **Inestabilidad o caída del entorno de pruebas:** Indisponibilidad continua del entorno de ejecución local (fallo de Node.js/npm, corrupción de `node_modules`) o caída prolongada del clúster de MongoDB Atlas / servicios en Render y Vercel durante las pruebas de integración y aceptación por más de 4 horas.
- **Densidad masiva de fallos en una suite:** Si durante una corrida de regresión se detecta el fallo simultáneo del **40% o más** de las pruebas de un módulo debido a un cambio estructural incompatible en las rutas de Express o en los adaptadores de React.
- **Compromiso de integridad en los datos de prueba:** Si la manipulación o ejecución de pruebas en el entorno compartido altera o corrompe los documentos base de usuarios o cierres contables, invalidando los cálculos posteriores de balance y alertas.
- **Incompatibilidad de transpilación en módulos bajo prueba:** Cuando un cambio de sintaxis entre CommonJS (`require`) y ES Modules (`import`) impide que el ejecutor Jest cargue un archivo de prueba específico (como ocurrió de manera aislada y controlada con la suite `sdk/tests/movimientos-adapter.test.js`, cuya ejecución individual quedó suspendida y registrada bajo el código de incidencia **D-01** mientras se completaban las 21 suites restantes del sistema).

---

### 9. Criterios de reanudación

Una vez que las pruebas han sido suspendidas total o parcialmente, la reanudación formal solo se autorizará cuando se cumplan los siguientes criterios:

- **Resolución y verificación técnica del bloqueo:** El defecto, error de configuración o causa raíz que originó la suspensión ha sido corregido por el responsable de desarrollo (Brant Chata o Sebastian Arce) y verificado en una nueva versión del código en el repositorio Git.
- **Ejecución exitosa de Smoke Test y Regresión Mínima Obligatoria (RMO):** El equipo de QA ha ejecutado `npm test` comprobando que el servidor Express levanta correctamente, la validación de esquemas Zod opera al 100% y las suites base de autenticación (`usuarios.controller.test.js`) y transacciones (`movimientos.controller.test.js`) pasan sin errores.
- **Restauración del entorno y variables de prueba:** Se ha verificado la correcta definición de las variables de entorno (`NODE_ENV=test`, `JWT_SECRET` para pruebas automatizadas, y conexión limpia a MongoDB para pruebas manuales/UAT) junto con la integridad de las dependencias (`npm install`).
- **Revalidación de integridad funcional y contable:** Si la suspensión afectó el cálculo de movimientos o cierres, se verificará nuevamente la precisión aritmética (`finance.unit.test.js`) y el flujo completo (`e2e.test.js`) antes de continuar con el resto del catálogo.
- **Actualización del registro de incidencias y trazabilidad:** Se ha documentado la causa de la suspensión, la solución aplicada y el resultado de la reejecución en el Registro de Incidencias y en la guía de pruebas del proyecto.
- **Autorización del Líder de Pruebas:** El responsable de QA del Grupo G03 confirma la estabilidad del entorno y autoriza formalmente la continuación del cronograma de pruebas.

---

## IV. Entregables

Los entregables constituyen los productos verificables generados durante la planificación, diseño, ejecución y cierre del proceso de aseguramiento de calidad de FinanceFlow. Estos artefactos permiten dar trazabilidad a cada actividad de validación, respaldar la gestión de hallazgos y sustentar la conformidad del sistema ante el docente del curso.

Considerando el alcance funcional completo del sistema (RF-01 al RF-16) y las herramientas reales del repositorio, los entregables son:

- **Documento de Plan de Pruebas de Software** (el presente documento, alineado al modelo oficial del curso).
- **Informe de Desarrollo de la Guía de Laboratorio de Plan de Pruebas** (incluyendo fundamentación teórica, actividades 1 a 7, cuestionario técnico de 10 preguntas y conclusiones).
- **Matriz de Trazabilidad Bidireccional** entre Requerimientos Funcionales (RF-01 al RF-16), componentes de Frontend (`frontend/src/`), componentes de Backend (`backend/`), casos de prueba, evidencias y resultados obtenidos (`documentacion/anexos/matriz_de_trazabilidad.md`).
- **Catálogo y desarrollo de Casos de Prueba por requerimiento**, cubriendo del RF-01 al RF-16 con escenarios positivos y negativos (`documentacion/anexos/G03-Casos de Prueba-FinanceFlow.pdf`, `G03-Catalogo_de_Casos_de_Prueba_FinanceFlow.xlsx`).
- **Scripts de pruebas unitarias, funcionales, de integración y seguridad en Backend** implementados con Jest y Supertest en `backend/__tests__/` (12 archivos `.test.js`).
- **Scripts de pruebas de componentes y formularios en Frontend** implementados con Jest y React Testing Library en `frontend/src/__tests__/` (9 archivos `.test.jsx`).
- **Scripts de pruebas de arquitectura y desacoplamiento del SDK** en `sdk/tests/` (3 archivos `.test.js`).
- **Pipeline de Integración Continua y DevSecOps** configurado en `.github/workflows/ci.yml` para ejecución automatizada en GitHub Actions.
- **Reportes de ejecución y tablas de cobertura de código (Istanbul Coverage)** para Backend (`43.61%` general / `100%` en esquemas Zod) y Frontend (`17.89%`).
- **Reporte de Auditoría de Seguridad y Remediación** (`AUDITORIA_SEGURIDAD.md`) junto con los resultados de `npm audit` sobre las dependencias productivas.
- **Registro formal de Incidencias y Hallazgos de Calidad** (códigos `D-01` a `D-08` vinculados al cronograma de Gantt y matriz 5W+1H del Sprint 7).

---

## V. Recursos

### Requerimientos de entornos – Hardware

**Tabla 1. Requerimientos Mínimos de Hardware para el Entorno de Pruebas**

Una tabla de componentes de hardware presenta las especificaciones técnicas mínimas requeridas en las estaciones de trabajo del equipo G03 para la ejecución del Plan de Pruebas de Software de FinanceFlow, proporcionando una base física estable para soportar la ejecución simultánea del servidor Node.js/Express, el cliente React, el microservicio Python FastAPI y los ejecutores de pruebas automatizadas (Jest, Supertest y JSDOM).

| Componente | Especificación Mínima | Justificación Técnica para Testing |
| :--- | :--- | :--- |
| **Procesador** | Intel Core i5 (8va Gen o superior) / AMD Ryzen 5 (4 núcleos / 8 hilos) | Necesario para ejecutar en paralelo los procesos de Node.js v20+, la emulación del DOM virtual (JSDOM en React Testing Library), el motor de cobertura Istanbul y el procesamiento de imágenes OCR con OpenCV/Tesseract. |
| **Memoria RAM** | 16 GB DDR4 | Mínimo requerido para mantener abiertos simultáneamente Visual Studio Code, los servidores de desarrollo (Frontend React + Backend Express + ML FastAPI), Google Chrome y los workers de Jest sin agotamiento de memoria (*Heap out of memory*). |
| **Almacenamiento** | SSD NVMe de 512 GB o superior | Indispensable para acelerar las operaciones intensivas de lectura/escritura (I/O) sobre los árboles de `node_modules` (705 paquetes en backend y 1382 en frontend) y lograr tiempos de ejecución de suites inferiores a 4 segundos. |
| **Entorno de Pruebas** | Estación de trabajo local (Ambiente Alfa) + Contenedores Cloud en Vercel/Render (Ambiente Beta) | Permite ejecutar pruebas unitarias e integración aisladas con mocks en local (~3 s) y validar pruebas funcionales y de aceptación (UAT) sobre el entorno desplegado conectado a MongoDB Atlas. |
| **Conectividad** | Red local e internet estable (≥ 50 Mbps) | Vital para la comunicación con el clúster en la nube de MongoDB Atlas, consultas a la API de Google Gemini Vision, ejecución de `npm audit` y sincronización con GitHub Actions. |

*Fuente: Elaboración Propia (2026)*

*Nota: Esta tabla presenta la configuración de hardware utilizada por el Grupo G03 para el testing local (Ambiente Alfa) y validación cloud (Ambiente Beta), donde el uso de un procesador multinúcleo, 16 GB de RAM y almacenamiento SSD resulta determinante para que las 12 suites del backend corran en ~3.04 segundos y las 9 suites del frontend en ~3.87 segundos. Esta configuración prioriza la velocidad de retroalimentación continua del equipo de desarrollo y QA. No obstante, las pruebas de carga se acotan a simulaciones controladas de 50 peticiones concurrentes para no exceder las cuotas de las capas académicas gratuitas de nube.*

---

### Requerimientos de entornos – Software

**Tabla 2. Estructura de Software y Herramientas de Automatización del Entorno de Pruebas**

Una tabla de componentes de software y herramientas de automatización proporciona una visión estructurada del entorno tecnológico real de FinanceFlow, detallando el stack de ejecución y las utilidades específicas de QA empleadas para validar el monorepo.

| Tipo de Software | Componente | Versión / Detalle | Propósito en el Proceso de Testing |
| :--- | :--- | :--- | :--- |
| **Sistema Operativo** | Windows 11 Pro (64 bits) / Linux Ubuntu (CI Runner) | Última versión estable | Plataforma base de trabajo para el equipo de desarrollo/QA local y entorno de ejecución en GitHub Actions. |
| **Entorno de Ejecución Backend** | Node.js + Express.js | Node.js v20.x / v24.x LTS, Express v5.2.1 | Ejecución de la API REST, middlewares de autenticación JWT, validación con Zod (`v4.3.6`) y cifrado con `bcryptjs` (`v3.0.3`). |
| **Entorno Frontend Web** | React + Tailwind CSS | React v18.0.0, `react-scripts` v5.0.0 | Renderizado de la Single Page Application (SPA), formularios con React Hook Form y gráficos con Recharts (`v3.8.1`). |
| **Microservicio IA / OCR** | Python + FastAPI + OpenCV + Tesseract | Python v3.10, FastAPI, `scikit-learn` | Procesamiento de imágenes de comprobantes (binarización y extracción de texto OCR) y clasificación predictiva Naive Bayes (RF-05). |
| **Base de Datos** | MongoDB Atlas + Mongoose ODM | MongoDB v7.0 / Mongoose v9.0.2 | Persistencia documental NoSQL de usuarios, movimientos, cierres, pagos y logs de auditoría. |
| **Automatización Backend & SDK** | Jest + Supertest | Jest v29.7.0, Supertest v6.3.3 | Ejecución de las 12 suites unitarias, de integración, seguridad y precisión matemática del backend (29 pruebas) y las 3 suites del SDK. |
| **Automatización Frontend** | React Testing Library + JSDOM | `@testing-library/react` v16.3.2 | Ejecución de las 9 suites de componentes y validación de formularios en DOM virtual (13 pruebas). |
| **Navegador de Referencia** | Google Chrome | Última versión estable | Navegador principal para la ejecución de pruebas funcionales manuales y pruebas de aceptación (UAT) de extremo a extremo. |
| **Gestión de Código y CI/CD** | Git + GitHub Actions | Git v2.x / Workflow `ci.yml` | Control de versiones, trazabilidad de commits y ejecución automatizada de pruebas y `npm audit` en cada push. |

*Fuente: Elaboración propia (2026).*

*Nota: La tabla evidencia que el entorno de pruebas se apoya exclusivamente en las tecnologías reales que conforman la arquitectura de FinanceFlow. La combinación de Node.js, Express 5, React 18, Python FastAPI y MongoDB Atlas permite reproducir fielmente las condiciones operativas del sistema, mientras que Jest, Supertest y React Testing Library brindan el soporte de automatización para backend, SDK y frontend respectivamente. Asimismo, la integración con Git y GitHub Actions asegura la repetibilidad y trazabilidad continua de los artefactos de prueba.*

---

### 10. Herramientas de pruebas requeridas

En esta sección se especifican las herramientas de software, librerías de aserción y medios de apoyo utilizados durante la ejecución de las pruebas del sistema FinanceFlow. Su definición permite identificar qué tecnología se emplea en cada nivel de testing, desde la validación unitaria y cobertura de código hasta la auditoría de seguridad y el seguimiento de hallazgos.

**Tabla 3. Herramientas de pruebas requeridas**

| Tipo de prueba / Actividad | Herramienta | Uso principal en FinanceFlow |
| :--- | :--- | :--- |
| **Unitaria (Backend y SDK)** | Jest (`v29.7.0`) + Mocks (`jest.spyOn`) | Validación aislada de controladores, esquemas Zod, precisión aritmética de punto flotante (`finance.unit.test.js`) y módulos del cliente `@sistema-balance/sdk`. |
| **Funcional y de Integración API** | Supertest (`v6.3.3`) + Jest | Simulación de peticiones HTTP (`GET`, `POST`, `PUT`, `PATCH`) sobre `app.js` para probar rutas, middlewares JWT, cierres contables, pagos y protección contra inyecciones NoSQL. |
| **Funcional de Componentes UI** | React Testing Library (`@testing-library/react`) + JSDOM | Renderizado en memoria de las 9 páginas principales de React, disparo de eventos de usuario (`fireEvent`) y verificación de mensajes de validación en formularios. |
| **Aceptación (UAT) y Flujo E2E** | Supertest (`e2e.test.js`) + Google Chrome (Ambiente Beta) | Verificación del ciclo completo de usuario (registro, login, alta de movimiento, OCR, dashboard, inactivación lógica, reportes y planificador). |
| **Cobertura de Código** | Istanbul (`jest --coverage`) | Medición cuantitativa del porcentaje de declaraciones, ramas, funciones y líneas ejecutadas en Backend (`43.61%`) y Frontend (`17.89%`). |
| **Seguridad y Dependencias** | `npm audit` + `security.unit.test.js` | Escaneo estático de vulnerabilidades CVE/GHSA en paquetes instalados y pruebas activas contra `$gt` NoSQL injection y Prototype Pollution. |
| **Gestión de datos y entorno** | Variables `NODE_ENV=test` / MongoDB Atlas QA | Aislamiento de ejecución sin alterar datos productivos y pruebas de persistencia controlada. |
| **Seguimiento y Trazabilidad** | GitHub Repository + Matriz Excel (`G03_FinanceFlow_5W1H_Gantt.xlsx`) | Control de versiones de los scripts de prueba, registro de defectos (`D-01` a `D-08`) y seguimiento de tareas de remediación en el Sprint 7. |

*Fuente: Elaboración propia (2026).*

*Nota: La tabla muestra una selección de herramientas alineada con la arquitectura JavaScript/TypeScript y Python del proyecto FinanceFlow. Jest y Supertest cubren tanto las pruebas unitarias como las de integración y seguridad a nivel de API REST en el backend, mientras que React Testing Library con JSDOM valida el comportamiento de la interfaz React. Por su parte, Istanbul (`--coverage`) y `npm audit` aportan métricas objetivas de cobertura y seguridad, y la matriz 5W+1H/Gantt junto con el repositorio Git permiten documentar hallazgos y avances de forma trazable durante todo el ciclo de pruebas.*

---

### 11. Personal

Para la ejecución del presente Plan de Pruebas se requiere la participación de los integrantes del Grupo G03 y la supervisión académica del curso, con responsabilidades claramente definidas en las actividades de planificación, preparación del entorno, diseño de casos de prueba, ejecución automatizada y manual, registro de incidencias, corrección de defectos y validación final del sistema.

**Tabla 4. Personal involucrado en el proceso de pruebas**

| Rol | Persona Asignada | Responsabilidad principal |
| :--- | :--- | :--- |
| **Líder de pruebas / QA Tester** | Sebastian Rodrigo Arce Bracamonte | Planificar y supervisar el Plan de Pruebas, diseñar el catálogo de casos de prueba (RF-01 al RF-16), ejecutar las suites de Frontend (React Testing Library) y pruebas de aceptación (UAT), y documentar evidencias e incidencias. |
| **Desarrollador / Arquitecto Técnico** | Brant Antony Chata Choque | Desarrollar y ejecutar las suites de pruebas de Backend (Jest + Supertest) y SDK, realizar la auditoría de seguridad (`security.unit.test.js` y `npm audit`), corregir defectos detectados y mantener el pipeline de integración continua. |
| **Usuario validador** | Evaluadores de prueba UAT / Integrantes G03 | Validar los flujos completos de negocio desde la perspectiva del usuario final (registro, vouchers OCR, dashboard, alertas, planificador de compras y reportes) en el entorno Beta. |
| **Docente asesor / Supervisor** | Mag. Ricardo Eduardo Valcárcel Alvarado | Supervisar el cumplimiento metodológico y académico del Plan de Pruebas, evaluar las evidencias de ejecución y aprobar la sustentación de calidad del proyecto. |

*Fuente: Elaboración propia (2026).*

*Nota: La distribución de roles presentada refleja la organización real del Grupo G03 en el curso de Construcción de Software II, integrando funciones de dirección de QA, desarrollo y automatización técnica, validación funcional de usuario y supervisión académica. La participación conjunta de Sebastian Arce y Brant Chata permite cubrir tanto las pruebas de interfaz y aceptación como las pruebas unitarias, de integración API y de seguridad en el backend, garantizando trazabilidad y control durante todo el ciclo de validación.*

---

### 12. Entrenamiento

Necesidades de entrenamiento en el sistema FinanceFlow, así como en las herramientas de prueba utilizadas por el equipo:

Antes y durante la ejecución formal de las pruebas, el equipo de trabajo cuenta con preparación técnica en:

- **Uso de Jest y Supertest** para el diseño y ejecución de pruebas unitarias, de integración HTTP y de seguridad con mocks (`jest.spyOn`) en Node.js y Express.
- **Uso de React Testing Library y JSDOM** para el montaje de componentes React 18, simulación de eventos de usuario y validación de formularios controlados por React Hook Form y Zod.
- **Interpretación de reportes de cobertura con Istanbul (`--coverage`)** y análisis de vulnerabilidades de dependencias mediante `npm audit`.
- **Configuración de variables de entorno de prueba (`NODE_ENV=test`, `JWT_SECRET`, `CI=true`)** en Windows PowerShell y flujos de GitHub Actions.
- **Interpretación de los requerimientos funcionales RF-01 al RF-16 del SRS v2.0** y reglas de negocio contables (precisión decimal, borrado lógico y cierres mensuales).
- **Registro estandarizado de defectos, matriz de trazabilidad y documentación de evidencias** conforme a la Guía de Laboratorio y al estándar IEEE 829 / ISO/IEC/IEEE 29119.

---

## VI. Planificación y organización

### 13. Procedimientos para las pruebas

Especifica los procedimientos metodológicos empleados por el Grupo G03 durante la ejecución del Plan de Pruebas de Software de FinanceFlow.

#### 13.1 Procedimientos para las pruebas

La ejecución del plan sigue secuencialmente el siguiente procedimiento:

1. **Revisión de requerimientos funcionales seleccionados:** Verificación de las especificaciones de los requerimientos **RF-01 al RF-16** en el documento SRS v2.0 y sus criterios de aceptación asociados.
2. **Diseño y validación de casos de prueba:** Elaboración de los casos unitarios (PU), funcionales/integración (PF) y de aceptación (PA), incluyendo escenarios positivos (flujo normal) y negativos (flujo alternativo/excepción).
3. **Preparación del entorno de pruebas y variables de configuración:** Instalación de dependencias en `backend/`, `frontend/` y `sdk/`, y configuración de `NODE_ENV=test`, `JWT_SECRET` y `CI=true`.
4. **Ejecución de pruebas unitarias:** Corrida de las pruebas aisladas de esquemas Zod, lógica aritmética financiera (`finance.unit.test.js`), seguridad (`security.unit.test.js`) y cliente SDK (`npm run test:sdk`).
5. **Ejecución de pruebas funcionales y de integración:** Corrida de las suites de controladores y rutas REST con Supertest (`npm run test:backend`) y de las vistas y formularios React con React Testing Library (`npm run test:frontend`).
6. **Ejecución de pruebas de aceptación (End-to-End):** Validación del flujo completo de ciclo de vida en `e2e.test.js` y prueba interactiva de los flujos de usuario en Google Chrome (incluyendo carga de vouchers OCR, alertas y planificador).
7. **Medición de cobertura y auditoría de seguridad:** Generación de matrices de cobertura con `npm run test:backend:coverage` y `npm run test:frontend:coverage`, y ejecución de `npm audit --omit=dev`.
8. **Registro de defectos y observaciones:** Documentación transparente de cualquier discrepancia o hallazgo técnico en el Registro de Incidencias (ej. defectos `D-01` a `D-08`).
9. **Corrección por parte del equipo de desarrollo:** Aplicación de parches de código y remediaciones de seguridad sobre las ramas correspondientes del repositorio.
10. **Reejecución y pruebas de regresión:** Ejecución integral del comando unificado `npm test` desde la raíz del proyecto para confirmar que el 100% de las suites operativas se mantienen en estado `PASS`.
11. **Cierre y consolidación de resultados:** Actualización de la Matriz de Trazabilidad, recopilación de logs y generación del informe final de pruebas.

---

### 14. Matriz de responsabilidades

Lista cada uno de los participantes del proceso de aseguramiento de calidad de FinanceFlow y su rol dentro de una matriz **RACI** (**R**esponsable de ejecutar, **A**probador final, **C**onsultado, **I**nformado).

**Tabla 5. Matriz de responsabilidades del proceso de pruebas**

| Actividad | Sebastian Arce (QA / Frontend) | Brant Chata (Dev / Backend & SDK) | Docente (Mag. Ricardo Valcárcel) | Usuario validador |
| :--- | :---: | :---: | :---: | :---: |
| **Elaborar plan de pruebas** | R | C | A | I |
| **Diseñar casos de prueba (RF-01 a RF-16)** | R | R | C | I |
| **Preparar entorno de pruebas y mocks** | C | R | I | I |
| **Ejecutar pruebas unitarias (Backend y SDK)** | C | R | I | I |
| **Ejecutar pruebas funcionales (API y React UI)** | R | R | I | I |
| **Ejecutar pruebas de aceptación (UAT / E2E)** | R | C | I | C |
| **Registrar defectos y medir cobertura** | R | R | I | I |
| **Validar conformidad y cierre** | C | I | A | C |

*Fuente: Elaboración propia (2026).*

*Nota: La matriz de responsabilidades evidencia una organización equilibrada de las tareas de aseguramiento de calidad en el Grupo G03. Brant Chata lidera la preparación técnica del entorno y la ejecución de pruebas unitarias de backend y SDK, mientras que Sebastian Arce lidera la elaboración del plan, el diseño de casos y las pruebas de interfaz y aceptación, compartiendo ambos la responsabilidad en las pruebas funcionales y el registro de hallazgos. Por su parte, el docente del curso actúa como aprobador académico final y el usuario validador aporta retroalimentación sobre la experiencia de uso.*

---

### 15. Cronograma

El cronograma de pruebas organiza las actividades principales del proceso de validación del sistema FinanceFlow en concordancia con los sprints de construcción y la fase de estabilización (Sprint 7), distribuyendo secuencialmente la planificación, diseño, preparación, ejecución por niveles, corrección de hallazgos y cierre.

**Tabla 6. Cronograma de ejecución del plan de pruebas**

| Semana | Actividad |
| :--- | :--- |
| **Semana 1** | Elaboración y revisión del Plan de Pruebas de Software y análisis de los requerimientos RF-01 al RF-16 del SRS v2.0. |
| **Semana 2** | Diseño del catálogo de casos de prueba (unitarios, funcionales y de aceptación, positivos y negativos) y Matriz de Trazabilidad. |
| **Semana 3** | Preparación del entorno de pruebas (configuración de Jest, Supertest, React Testing Library, JSDOM, mocks y datos de prueba). |
| **Semana 4** | Ejecución de pruebas unitarias sobre esquemas Zod, lógica financiera (`finance.unit.test.js`), seguridad (`security.unit.test.js`) y SDK. |
| **Semana 5** | Ejecución de pruebas funcionales y de integración en Backend (`backend/__tests__/`) y Frontend (`frontend/src/__tests__/`). |
| **Semana 6** | Ejecución de pruebas de aceptación End-to-End (`e2e.test.js` y validación UAT en navegador sobre módulos de OCR, Dashboard, Reportes y Planificador). |
| **Semana 7** | Análisis de cobertura Istanbul, auditoría `npm audit`, registro de hallazgos (`D-01` a `D-08`), corrección de defectos de seguridad y pruebas de regresión. |
| **Semana 8** | Consolidación de evidencias, actualización del informe final del laboratorio y sustentación académica del Plan de Pruebas. |

*Fuente: Elaboración propia (2026).*

*Nota: El cronograma propuesto refleja una secuencia lógica y progresiva alineada con el ciclo de desarrollo de FinanceFlow, iniciando con la planificación y diseño de casos sobre los requerimientos RF-01 a RF-16, avanzando por los niveles de la pirámide de pruebas (unitarias, funcionales/integración y aceptación) y culminando con la medición de cobertura, remediación de hallazgos y regresión final. Esta estructura semanal permite controlar dependencias técnicas y asegurar que cada entregable cuente con evidencia verificable antes del cierre del curso.*

---

### 16. Premisas

Este plan se formula bajo las siguientes premisas técnicas y operativas:

- Los requerimientos funcionales del sistema (**RF-01 al RF-16**) definidos en el documento SRS v2.0 se encuentran especificados y estabilizados para su verificación.
- El entorno de pruebas local (Node.js, npm, Jest, Supertest y React Testing Library) y el repositorio en GitHub estarán disponibles durante todo el periodo programado.
- El equipo del Grupo G03 cuenta con acceso completo al código fuente de `backend/`, `frontend/`, `sdk/` y `ml_backend/`, así como a la documentación técnica del proyecto.
- Las pruebas automatizadas de backend operan bajo `NODE_ENV=test` empleando mocks deterministas sobre los modelos y servicios para garantizar una ejecución rápida y aislada sin depender de conectividad externa a MongoDB Atlas en cada corrida unitaria.
- En entornos Windows PowerShell con restricción de directivas de ejecución (`ExecutionPolicy`), los comandos de prueba se invocan mediante `npm.cmd` y `npx.cmd` o desde la raíz con `npm test`.
- Los integrantes responsables asignados en la Matriz RACI (Sebastian Arce y Brant Chata) disponen del tiempo y equipamiento necesarios dentro del cronograma académico.
- El microservicio de IA/OCR y las integraciones de pago operan en modo simulado/*sandbox* o mediante pruebas controladas durante la validación funcional, sin generar cargos monetarios reales.

---

### 17. Dependencias y Riesgos

Los riesgos del proceso de pruebas de FinanceFlow se identifican considerando la configuración de los entornos de ejecución, la naturaleza multimódulo del monorepo (Backend, Frontend, SDK y ML Backend), la precisión requerida en operaciones financieras y las dependencias de paquetes externos.

**Tabla 7. Riesgos del proceso de pruebas y acciones de mitigación**

| Riesgo | Probabilidad | Impacto | Mitigación |
| :--- | :---: | :---: | :--- |
| **Incompatibilidad de sintaxis de módulos (ESM vs CommonJS) en el ejecutor Jest** | Alta | Media | Aislar las suites operativas (`npm run test:sdk`) y registrar formalmente el hallazgo (**D-01** en `movimientos-adapter.test.js`) planificando la transpilación con Babel en el Sprint 7. |
| **Desconexión o latencia hacia el clúster remoto de MongoDB Atlas durante las pruebas** | Media | Alta | Utilizar `NODE_ENV=test` y mocks (`jest.spyOn`) en las suites automatizadas de Jest para que la ejecución sea 100% determinista e independiente de la red, reservando Atlas para pruebas UAT. |
| **Variabilidad en la nitidez de las imágenes de vouchers en pruebas de OCR (RF-05)** | Media | Media | Emplear imágenes de prueba estandarizadas (vouchers nítidos y borrosos) y verificar el mecanismo de *fallback* automático al formulario manual en React. |
| **Bloqueo de scripts `.ps1` de npm en terminales Windows PowerShell** | Media | Media | Documentar y utilizar los ejecutables `.cmd` (`npm.cmd`, `npx.cmd`) y variables de entorno explícitas en la guía de ejecución de pruebas. |
| **Cobertura de código concentrada en esquemas y modelos pero baja en servicios auxiliares** | Media | Media | Priorizar el blindaje al 100% de los esquemas Zod y rutas críticas de dinero/seguridad (Principio de Pareto) y programar la ampliación de tests de servicios en la tarea S3 del Gantt (hallazgo **D-02**). |
| **Alertas de vulnerabilidades en dependencias transitivas del empaquetador (`react-scripts`)** | Alta | Baja | Auditar las dependencias de producción con `npm audit --omit=dev`, actualizar parches seguros en backend y evitar `--force` destructivo en `react-scripts` (hallazgo **D-04**). |
| **Errores de redondeo de punto flotante o desfase de zona horaria en balances y cierres** | Baja | Alta | Mantener pruebas unitarias obligatorias de precisión decimal (`TC-FIN-01`) y normalización UTC-5 Lima (`TC-FIN-02`) en `finance.unit.test.js`. |
| **Falta de tiempo para reejecución manual tras cambios de último minuto** | Media | Media | Automatizar la regresión mediante el comando único `npm test` (~4.5 segundos) y el workflow `.github/workflows/ci.yml`. |

*Fuente: Elaboración Propia (2026)*

*Nota: La relación de riesgos presentada evidencia que el proceso de pruebas en FinanceFlow aborda tanto riesgos propios de la lógica financiera (precisión decimal, cierres contables y lectura OCR) como factores técnicos del entorno JavaScript/Node.js (interoperabilidad entre CommonJS y ES Modules, políticas de PowerShell y dependencias de `react-scripts`). El uso de mocks deterministas en Jest, la validación al 100% de esquemas Zod y la transparencia en el registro de hallazgos (D-01 a D-08) permiten mantener un control preventivo riguroso durante toda la validación del sistema.*

#### Dependencias:
- Disponibilidad del código fuente actualizado en el repositorio GitHub (`KrCrimson/FinanceFlow`).
- Correcta instalación de dependencias en `backend/node_modules`, `frontend/node_modules` y `sdk/node_modules` (usando `--legacy-peer-deps` en el frontend para compatibilidad de React 18 con `react-scripts 5`).
- Definición de las variables de entorno `NODE_ENV=test`, `JWT_SECRET` y `CI=true` para las corridas automatizadas.
- Disponibilidad del equipo de desarrollo y QA (Grupo G03) para ejecutar, documentar y sustentar las pruebas.
- Disponibilidad del microservicio Python FastAPI o su simulador/fallback para las pruebas específicas del requerimiento RF-05 (OCR).

---

## VII. Referencias

Los documentos de apoyo e insumo reales del proyecto utilizados para la elaboración del presente Plan de Pruebas de Software son los siguientes:

- **Documento de Especificación de Requerimientos de Software (SRS v2.0):** `documentacion/G03-FinanceFlow-FD03-Documento de SRS (1).docx` y `documentacion/requerimientos.md`.
- **Documento de Arquitectura de Software (SAD v1.0):** `documentacion/G03-FinanceFlow-FD04-Documento SAD (1).docx` y `documentacion/anexos/documento_de_arquitectura.md`.
- **Matriz de Trazabilidad del Sistema:** `documentacion/anexos/matriz_de_trazabilidad.md` y `documentacion/anexos/Trazabilidad_Implementacion_FinanceFlow.xlsx`.
- **Catálogo e Informe de Pruebas Planificadas:** `documentacion/anexos/G03-Informe_de_Pruebas_Planificadas_FinanceFlow.pdf`, `documentacion/anexos/G03-Casos de Prueba-FinanceFlow.pdf` y `documentacion/anexos/casos_de_prueba_con_evidencias.md`.
- **Guías de Ejecución y Exposición de Pruebas QA:** `documentacion/GUIA_EJECUCION_PRUEBAS.md`, `GUIA_EXPOSICION_PRUEBAS_QA.md` y `tests_README.md`.
- **Auditoría de Seguridad y Gestión del Proyecto:** `AUDITORIA_SEGURIDAD.md`, `INFORME_EJECUTIVO_SISTEMA.md` y `G03_FinanceFlow_5W1H_Gantt.xlsx`.
- **Estándares de Referencia en Ingeniería de Calidad:** IEEE Std 829 (Standard for Software and System Test Documentation) e ISO/IEC/IEEE 29119 (Software and systems engineering — Software testing).
- **Plantilla y Guía Oficial del Curso:** `Modelo de Plan de Pruebas (1).pdf` y `Guia de Laboratorio-Plan Pruebas (1).pdf` — Construcción de Software II, EPIS - UPT.

---

## VIII. Glosario

- **Caso de prueba:** Conjunto de condiciones, precondiciones, datos de entrada, pasos de ejecución y resultados esperados diseñado para verificar el cumplimiento de un requerimiento funcional (RF-01 al RF-16) del sistema.
- **Prueba unitaria (PU):** Validación aislada de una unidad mínima de código (controlador, esquema Zod, función de cálculo financiero o método del SDK) ejecutada con Jest sin depender de servicios externos ni base de datos real.
- **Prueba funcional (PF):** Validación del comportamiento del sistema respecto a los requerimientos funcionales definidos en el SRS, comprobando entradas, validaciones, códigos de estado HTTP y respuestas en la interfaz.
- **Prueba de integración:** Tipo de prueba orientada a verificar la comunicación correcta entre capas acopladas del sistema (por ejemplo, rutas Express con middlewares JWT y controladores mediante Supertest, o componentes React con adaptadores de servicios).
- **Prueba de aceptación (PA / UAT):** Validación del sistema desde la perspectiva del usuario final sobre flujos completos de negocio para confirmar que satisface sus necesidades operativas y de usabilidad.
- **Prueba de regresión:** Reejecución automatizada de las suites de prueba existentes (`npm test`) después de aplicar cambios o correcciones para asegurar que no se hayan introducido nuevos defectos en funcionalidades previamente certificadas.
- **Defecto / Hallazgo:** Error, discrepancia o limitación técnica detectada durante las pruebas respecto al resultado esperado o estándar de calidad (registrados en FinanceFlow bajo los códigos `D-01` a `D-08`).
- **Evidencia de prueba:** Registro verificable del resultado de una prueba, tales como salidas de consola de Jest/Supertest, reportes de cobertura de Istanbul, reportes de `npm audit`, bitácoras de Git o capturas de ejecución.
- **Mock (Doble de prueba):** Objeto o función simulada (`jest.spyOn`, `jest.fn`) que imita de manera controlada el comportamiento de un modelo de Mongoose o servicio externo para lograr pruebas rápidas y deterministas.
- **Soft Delete (Borrado lógico):** Mecanismo de inactivación (`estado: 'inactivo'`) que oculta una transacción del cálculo del balance y reportes activos sin destruir físicamente el registro en MongoDB, preservando la trazabilidad histórica (RF-08).
- **OCR (Reconocimiento Óptico de Caracteres):** Tecnología empleada en FinanceFlow (mediante OpenCV + Tesseract en FastAPI y Gemini Vision) para extraer automáticamente montos, fechas y conceptos a partir de imágenes de comprobantes de pago como Yape o Plin (RF-05).
- **JWT (JSON Web Token):** Estándar de token firmado criptográficamente (HMAC SHA-256) utilizado en FinanceFlow para autenticar sesiones de usuario y autorizar peticiones a rutas protegidas de la API REST (RF-02).
- **Zod:** Librería de declaración y validación de esquemas utilizada en el backend y frontend de FinanceFlow para sanitizar entradas de datos y prevenir inyecciones o tipos corruptos.
- **Cobertura de código (Code Coverage):** Métrica porcentual generada por Istanbul que mide la proporción de declaraciones, ramas, funciones y líneas físicas de código ejecutadas durante la corrida de pruebas automatizadas.
- **Trazabilidad:** Capacidad de vincular y seguir cada requerimiento funcional del SRS v2.0 a través de los archivos de código fuente que lo implementan, los casos de prueba que lo verifican y los resultados obtenidos.

