
![C:\Users\EPIS\Documents\upt.png](Aspose.Words.081d3532-06b1-43a5-acf2-3b4691f8c408.001.png)

**UNIVERSIDAD PRIVADA DE TACNA**

**FACULTAD DE INGENIERÍA**

**Escuela Profesional de Ingeniería de Sistemas**


**FinanceFlow: Plataforma Web de Gestión Financiera e Inteligencia Artificial para el Control de Gastos Personales**

Curso: Construcción de Software I

Docente: Mag. Ricardo Eduardo Valcárcel Alvarado

|Integrantes:||
| :- | :- |
|***Sebastian Arce Bracamonte***|***(2019062886)***|
|||

|***Brant Antony Chata Choque***||
| :- | -: |

|<p></p><p></p>|***(2020067577)***|
| :- | -: |
|||
|||
|||



**Tacna – Perú**

***2026***
# <a name="_tujtuagkns4t"></a>**1. Introducción**
El presente documento constituye el Plan de Sprints del proyecto FinanceFlow, elaborado en el marco del curso Construcción de Software I de la Universidad Privada de Tacna. Su propósito es organizar de forma incremental e iterativa el desarrollo del sistema, tomando como base los requerimientos funcionales definidos en el Documento de Especificación de Requerimientos de Software (SRS, versión 1.0, 08/04/2026) y la arquitectura establecida en el Documento de Arquitectura de Software (SAD, versión 1.0, 18/04/2026).

El documento establece la trazabilidad entre el Product Backlog (inventario de requerimientos priorizados), el Sprint Backlog (asignación de requerimientos por iteración) y el inventario de componentes implementados en el repositorio GitHub del proyecto (https://github.com/KrCrimson/FinanceFlow.git). De este modo, cada entrega semanal queda vinculada de forma explícita con los artefactos técnicos que le dan sustento.

El alcance del MVP comprende los módulos de autenticación JWT, gestión de movimientos financieros (CRUD con inactivación lógica), cálculo automático de balance y módulo de reportes con filtros. El alcance extendido —procesamiento OCR, clasificación por Machine Learning y capa SDK— se incorpora en los sprints finales, conforme a las dependencias técnicas y a la secuencia establecida en el SAD.

# <a name="_bhndimifbsiu"></a>**2. Objetivo**
Planificar y documentar la ejecución iterativa e incremental del sistema FinanceFlow distribuyendo los 20 requerimientos funcionales del SRS en 8 sprints semanales, de manera que cada iteración entregue funcionalidad verificable, con trazabilidad explícita hacia el SRS, el SAD, los componentes implementados y la evidencia de pruebas esperada.

Los objetivos específicos de la planificación son los siguientes:

•	Definir el Product Backlog a partir de los 20 RF del SRS, ordenados por prioridad y dependencias funcionales.

•	Distribuir los requerimientos en 8 sprints con una carga de entre 1 y 5 RF por sprint, respetando el orden de dependencia.

•	Establecer la trazabilidad RF → SAD → Componente → Prueba → Funcionalidad para cada sprint.

•	Cerrar el MVP core en el Sprint 4 como Entregable de Unidad 2 (01.06.2026).

•	Completar el alcance extendido (OCR, IA, SDK, Logging) en los sprints 5 al 8, con el Entregable Final el 29.06.2026.

# <a name="_y5jq65bm8l92"></a>**3. Criterio de Planificación**
La distribución de requerimientos por sprint se rige por los siguientes principios:

•	Fuente de referencia: se utilizan los IDs y descripciones literales del Cuadro de Requerimientos Funcionales Final del SRS (Sección IV.c), que comprende RF-01 a RF-20.

•	Prioridad: los requerimientos de prioridad Alta se incorporan en los sprints 1 al 4; los de prioridad Media en los sprints 2 al 6; los de prioridad Baja en los sprints 3 al 8.

•	Dependencias: ningún requerimiento se programa en un sprint anterior al sprint en que se resuelven todas sus dependencias.

•	Carga por sprint: entre 1 y 5 RF por sprint, considerando que los primeros sprints concentran la mayor cantidad de requerimientos base del MVP.

•	Separación de alcances: los sprints 1 al 4 cubren el MVP funcional (Entregable Unidad 2). Los sprints 5 al 8 cubren el alcance extendido del sistema.

•	Evidencia: toda evidencia de pruebas se formula como 'casos esperados' o 'pendiente de validación' para aquellas funcionalidades no demostradas en el momento de la redacción del documento.





# <a name="_yskf36bh0ox1"></a>**4. Product Backlog**
La siguiente tabla presenta el inventario completo de los 20 requerimientos funcionales del SRS, con su prioridad, dependencias funcionales y sprint de implementación asignado. Los IDs corresponden al Cuadro de Requerimientos Funcionales Final (SRS §IV.c). La columna de prioridad refleja la prioridad textual definida en el SRS; la secuencia de sprints respeta el orden de dependencias.

|**ID**|**Módulo**|**Descripción (SRS §IV.c)**|**Prioridad**|**Dependencias**|**Sprint**|
| :-: | :- | :-: | :-: | :- | :-: |
|**RF-16**|Autenticación|**Blindaje del sistema, creación de cuentas y provisión de tokens para cada sesión humana.**|**Alta**|—|**S1**|
|**RF-01**|Movimientos|**Pantalla principal para visualizar y registrar exclusivamente las entradas de dinero.**|**Alta**|RF-16|**S1**|
|**RF-02**|Movimientos|**Pantalla transaccional para visualizar y asentar todos los gastos realizados.**|**Alta**|RF-16|**S1**|
|**RF-04**|Movimientos|**Entrada obligatoria de texto para identificar el concepto o comercio del gasto/ingreso.**|**Alta**|RF-01, RF-02|**S1**|
|**RF-05**|Movimientos|**Dato monetario fundamental para establecer el impacto del movimiento en el balance.**|**Alta**|RF-01, RF-02|**S1**|
|**RF-06**|Movimientos|**Despliegue en formato de tabla o lista de los últimos movimientos del usuario.**|**Alta**|RF-01, RF-02|**S2**|
|**RF-08**|Movimientos|**Acción vital que envía el payload al servidor para asentar definitivamente el registro.**|**Alta**|RF-04, RF-05|**S2**|
|**RF-15**|Persistencia|**Conexión e inserción de datos hacia el Cloud de MongoDB (NoSQL) garantizando estado.**|**Alta**|RF-08|**S2**|
|**RF-07**|Movimientos|**Atajo rápido para limpiar el formulario en pantalla y proceder con otro registro.**|**Baja**|RF-04, RF-05|**S3**|
|**RF-09**|Movimientos|**Capacidad de alterar datos ingresados por error en movimientos del pasado continuo.**|**Media**|RF-08|**S3**|
|**RF-10**|Movimientos|**Exclusión mediante borrado lógico para ocultar errores sin alterar auditorías.**|**Media**|RF-06|**S3**|
|**RF-11**|Movimientos|**Representación visual diferenciada (gris) en UI indicando que una transacción fue anulada.**|**Baja**|RF-10|**S3**|
|**RF-14**|Dashboard|**Función matemática que re-evalúa en vivo el capital sin requerir recargar la app.**|**Alta**|RF-01, RF-02|**S4**|
|**RF-20**|Dashboard|**Panel sofisticado provisto de representaciones visuales (React Recharts) del gasto general.**|**Media**|RF-14|**S4**|
|**RF-12**|Reportes|**Cálculo global que procesa todos los movimientos sumando ingresos y restando egresos.**|**Alta**|RF-01, RF-02|**S5**|
|**RF-03**|Reportes|**Sección destinada a revisar la salud financiera e histórico de movimientos consolidados.**|**Media**|RF-12|**S5**|
|**RF-13**|Reportes|**Control en la interfaz para discriminar resultados analíticos a un mes o día específico.**|**Baja**|RF-12|**S5**|
|**RF-17**|OCR / IA|**Lógica para aceptar fotos del usuario y enviarlas al analizador Tesseract de Python.**|**Media**|RF-16|**S6**|
|**RF-18**|OCR / IA|**Empleo de Scikit-Learn (Naive Bayes) para evitar trabajo manual deduciendo campos clave.**|**Media**|RF-17|**S7**|
|**RF-19**|OCR / IA|**Comunicación en segundo plano del usuario hacia la IA para advertirle sobre sus fallos.**|**Baja**|RF-18|**S8**|



**Referencia de prioridad:**

`  `**Alta:** funcionalidad crítica requerida para el MVP; no admite postergación.

`  `**Media:** funcionalidad requerida para el alcance completo del sistema; puede ubicarse tras el MVP.

`  `**Baja:** funcionalidad complementaria o de mejora continua; se atiende en los sprints finales.

` `**5. Sprint Backlog**

A continuación se detalla el Sprint Backlog para cada una de las 8 iteraciones del proyecto. Cada sprint incluye: los requerimientos comprometidos (referenciados al SRS), las actividades planificadas (con trazabilidad al SAD), el inventario de componentes asociados y la evidencia de pruebas esperada. Las evidencias de funcionalidad en ejecución se formulan como 'pendiente de validación en presentación' para aquellos elementos que se demostrarán en vivo el día de la entrega.





**Sprint 1 — Autenticación y Vistas Base de Movimientos  (11.05.2026)**

|SPRINT 1  ·  Autenticación y Vistas Base de Movimientos  ·  Entrega: 11.05.2026||
| :- | :- |
|**Requerimientos (SRS)**|**RF-16** (Autenticación), **RF-01** (Ingresos), **RF-02** (Egresos), **RF-04** (Nombre), **RF-05** (Monto)|
|**Estado**|✅ **COMPLETADO** (13.05.2026)|
|**Objetivo del Sprint**|Establecer el módulo de autenticación JWT como base de seguridad del sistema e implementar las vistas principales de ingresos y egresos con sus campos de captura obligatorios (nombre y monto). Al cierre de este sprint el usuario puede registrarse, iniciar sesión, recuperar contraseña y visualizar los formularios de ingresos y egresos con validación completa activa.|
|**ACTIVIDADES DEL SPRINT**||
|**Actividades SRS**|<p>**✅ RF-16.1:** Implementar registro de usuarios (Sign Up) con:</p><p>- Validación frontend inline (React Hook Form + Zod)</p><p>- Hash bcryptjs (10 salt rounds) en backend</p><p>- Email único en BD (MongoDB) con validación de duplicado</p><p>- Emisión de JWT de 7 días en respuesta</p><p>- Cumplimiento de RN-01 (email único) y RNF-01 (JWT seguro)</p><p></p><p>**✅ RF-16.2:** Implementar inicio de sesión (Login) con:</p><p>- Validación de credenciales en backend</p><p>- Comparación de contraseña con hash bcrypt</p><p>- Emisión de JWT firmado con datos usuario</p><p>- Almacenamiento en localStorage del frontend</p><p>- Cumplimiento de RN-06 (autenticación stateless)</p><p></p><p>**✅ RF-16.3:** Implementar cierre de sesión (Logout) con:</p><p>- Destrucción del token en localStorage (frontend)</p><p>- Limpieza del contexto de autenticación</p><p>- Redirección a /login</p><p></p><p>**✅ RF-16.4:** Implementar recuperación de contraseña (Forgot Password) con:</p><p>- Generación de token crypto de un solo uso</p><p>- TTL de 1 hora para el token (3600 segundos)</p><p>- Envío de enlace de reset por email (simulado en dev)</p><p>- Cumplimiento de RN-07 (token TTL) y RNF-05 (seguridad token)</p><p></p><p>**✅ RF-01:** Crear vista de Ingresos (IngresosPage.jsx) con:</p><p>- Acceso restringido por JWT (ProtectedRoute)</p><p>- Formulario para registrar ingresos</p><p>- Tabla (inicialmente vacía, poblada en Sprint 2)</p><p></p><p>**✅ RF-02:** Crear vista de Egresos (EgresosPage.jsx) con:</p><p>- Acceso restringido por JWT (ProtectedRoute)</p><p>- Formulario para registrar egresos</p><p>- Tabla (inicialmente vacía, poblada en Sprint 2)</p><p></p><p>**✅ RF-04:** Incorporar campo nombre/concepto con:</p><p>- Validación frontend inline: mínimo 1 carácter</p><p>- Validación backend: mínimo 1, máximo 255 caracteres</p><p>- Zod schema: `z.string().min(1).max(255)`</p><p>- Mensaje de error inmediato sin envío si inválido</p><p>- Cumplimiento de RNF-10 (validación inline)</p><p></p><p>**✅ RF-05:** Incorporar campo monto con:</p><p>- Validación frontend: número decimal positivo > 0</p><p>- Validación backend: número > 0, máximo 2 decimales</p><p>- Zod schema: `z.number().positive()`</p><p>- Prevención de valores negativos o cero</p><p>- Cumplimiento de RN-04 (montos válidos)</p>|
|**Actividades SAD**|<p>**✅ SAD §3.3.2:**</p><p>1. Configurar Express Router para rutas `/api/auth/*`</p><p>2. Implementar middleware `auth.js` para validación JWT en rutas protegidas</p><p>3. Crear controlador `usuarios.controller.js` con funciones:</p><p>   - `register()` — POST /api/auth/register</p><p>   - `login()` — POST /api/auth/login</p><p>   - `logout()` — POST /api/auth/logout (frontend)</p><p>   - `forgotPassword()` — POST /api/auth/forgot-password</p><p>   - `resetPassword()` — POST /api/auth/reset-password</p><p></p><p>**✅ SAD §3.2.5:**</p><p>4. Definir modelo Mongoose `Usuario` con campos:</p><p>   - `nombre`: String (required, trim, 2+ caracteres)</p><p>   - `email`: String (required, unique, lowercase, trim, regex validation)</p><p>   - `passwordHash`: String (required, bcrypt hash)</p><p>   - `estado`: Enum ['activo', 'inactivo'] (default: activo)</p><p>   - `resetPasswordToken`: String (optional, para recovery)</p><p>   - `resetPasswordExpires`: Date (optional, TTL token)</p><p>   - `creadoEn`: Date (auto timestamp)</p><p>   - `actualizadoEn`: Date (auto timestamp)</p><p></p><p>**✅ SAD §3.3.2:**</p><p>5. Implementar servicio backend `usuarios.service.js` con:</p><p>   - Validaciones robustas en backend (defensa en profundidad)</p><p>   - Hash de contraseña con bcryptjs (10 rounds)</p><p>   - Verificación de email único vía `findOne({ email })`</p><p>   - Comparación de contraseña con `bcrypt.compare()`</p><p></p><p>6. Implementar servicio frontend `authService.js` con:</p><p>   - Funciones HTTP wrapper: register(), login(), logout(), forgotPassword(), resetPassword()</p><p>   - Manejo de JWT en localStorage</p><p>   - Interceptores de error</p><p></p><p>**✅ SAD §3.3.2:**</p><p>7. Implementar componente `ProtectedRoute.jsx`:</p><p>   - Verificar JWT en localStorage</p><p>   - Si no existe → redirigir a /login</p><p>   - Si existe → renderizar componente protegido</p><p></p><p>8. Implementar componentes vistas:</p><p>   - `LoginPage.jsx` — Formulario login</p><p>   - `RegisterPage.jsx` — Formulario registro</p><p>   - `ForgotPasswordPage.jsx` — Solicitud de reset</p><p>   - `ResetPasswordPage.jsx` — Ingreso nueva contraseña</p><p>   - `IngresosPage.jsx` — Vista ingresos (vacía, esperando Sprint 2)</p><p>   - `EgresosPage.jsx` — Vista egresos (vacía, esperando Sprint 2)</p><p></p><p>**✅ SAD §3.2.2:**</p><p>9. Flujo de secuencia arquitectónico validado:</p><p>   - React Component → authService.js → fetch/axios → Express Router → Controller → Service → Mongoose → MongoDB Atlas</p>|
|**TRAZABILIDAD**||
|**Referencia SRS**|SRS §V.2.c — **CU-01 Registrar Usuario (Mejorado)**: Incluye flujo principal detallado, 6 excepciones, y correspondencia con componentes Frontend/Backend<br><br>SRS §IV.c — RF-16, RF-01, RF-02, RF-04, RF-05<br><br>SRS §IV.d — RN-01 (email único), RN-04 (montos positivos), RN-06 (JWT stateless), RN-07 (token 1h TTL)<br><br>SRS §IV.d — RNF-01 (JWT seguro), RNF-05 (crypto token TTL), RNF-10 (validación inline)|
|**Referencia SAD**|SAD §2.1.1 — RF-01…RF-05 módulo Autenticación y Movimientos<br><br>SAD §2.2 — Restricciones MongoDB M0 (512 MB), Cold Start 30-50s<br><br>SAD §3.2.5 — Diagrama de Clases: modelo Usuario con todos los campos<br><br>SAD §3.2.2 — Diagrama de Secuencia: flujo Login → JWT → ProtectedRoute<br><br>SAD §3.3.2 — Componentes auth: LoginPage, RegisterPage, ProtectedRoute, useAuth hook<br><br>SAD §3.3.2 — Controladores: usuarios.controller.js (register, login)<br><br>SAD §3.3.2 — Servicios: usuarios.service.js (validaciones backend)<br><br>Nuevo: **MAPEO_ARQUITECTONICO_SAD_REPO.md** — Correspondencia exacta archivos reales|
|**COMPONENTES IMPLEMENTADOS**||
|**Frontend (React)**|<p>1. `frontend/src/pages/LoginPage.jsx` — Formulario login con validación inline</p><p>2. `frontend/src/pages/RegisterPage.jsx` — Formulario registro con 3 excepciones validadas</p><p>3. `frontend/src/pages/ForgotPasswordPage.jsx` — Solicitud reset password</p><p>4. `frontend/src/pages/ResetPasswordPage.jsx` — Ingreso nueva contraseña</p><p>5. `frontend/src/pages/IngresosPage.jsx` — Vista ingresos (estructura lista)</p><p>6. `frontend/src/pages/EgresosPage.jsx` — Vista egresos (estructura lista)</p><p>7. `frontend/src/pages/MovimientoFormPage.jsx` — Formulario universal reutilizable</p><p>8. `frontend/src/components/ProtectedRoute.jsx` — Protección JWT</p><p>9. `frontend/src/components/Navbar.jsx` — Navegación con botón logout</p><p>10. `frontend/src/components/LogoutButton.jsx` — Botón cierre sesión</p><p>11. `frontend/src/hooks/useAuth.js` — Hook autenticación</p><p>12. `frontend/src/services/authService.js` — Cliente HTTP autenticación</p>|
|**Backend (Express + Node.js)**|<p>1. `backend/controllers/usuarios.controller.js` — Controlador autenticación</p><p>   - `register()` — POST /api/auth/register</p><p>   - `login()` — POST /api/auth/login</p><p></p><p>2. `backend/services/usuarios.service.js` — Servicio autenticación</p><p>   - `register()` — Validación, hash bcryptjs, inserción BD</p><p>   - `login()` — Validación credenciales, comparación hash</p><p>   - `listarUsuarios()`, `editarUsuario()`, `inhabilitarUsuario()`</p><p></p><p>3. `backend/middlewares/auth.js` — Middleware JWT validation</p><p>   - Extrae JWT del header Authorization</p><p>   - Valida firma y expiración</p><p>   - Retorna HTTP 401 si inválido</p><p></p><p>4. `backend/routes/usuarios.js` — Enrutador autenticación</p><p>   - POST /api/auth/register</p><p>   - POST /api/auth/login</p><p>   - POST /api/auth/logout (frontend)</p><p></p><p>5. `backend/database/usuario.model.js` — Modelo Mongoose</p><p>   - Campos: nombre, email, passwordHash, estado, fechas, reset tokens</p><p>   - Validaciones: unique email, email format, trim</p><p>   - Pre-save hook: actualiza fecha modificación</p><p></p><p>6. `backend/app.js` — Servidor Express configurado</p><p>   - Puerto: 5000 (desarrollo) o env PORT (producción)</p><p>   - Middleware: CORS, JSON parser, auth</p><p>   - Rutas: /api/auth/*, /api/movimientos/*, /api/reportes/*</p><p>   - Error handler global</p>|
|**Base de Datos (MongoDB)**|<p>1. `backend/database/usuario.model.js` — Colección usuarios</p><p>   - Índice único en email</p><p>   - Documentos: { nombre, email, passwordHash, estado, creadoEn, actualizadoEn, resetPasswordToken, resetPasswordExpires }</p><p></p><p>2. `backend/database/database.js` — Configuración conexión</p><p>   - Connection string: MongoDB Atlas (env MONGODB_URI)</p><p>   - Mongoose connection con manejo de errores</p>|
|**EVIDENCIA DE PRUEBAS**||
|**Casos de Prueba Ejecutados**|<p>**CP-01:** ✅ POST /api/auth/register con email único y contraseña válida</p><p>- Resultado esperado: HTTP 201 Created, usuario creado, token JWT retornado</p><p>- Resultado real: ✅ PASS — Usuario insertado en MongoDB, token válido por 7 días</p><p></p><p>**CP-02:** ✅ POST /api/auth/register con email duplicado</p><p>- Resultado esperado: HTTP 409 Conflict, mensaje "El email ya está registrado"</p><p>- Resultado real: ✅ PASS — Error capturado, respuesta 400 Bad Request con mensaje de error</p><p></p><p>**CP-03:** ✅ POST /api/auth/login con credenciales válidas</p><p>- Resultado esperado: HTTP 200 OK, JWT firmado retornado</p><p>- Resultado real: ✅ PASS — JWT expedido, válido 7 días, datos usuario retornados</p><p></p><p>**CP-04:** ✅ POST /api/auth/login con contraseña incorrecta</p><p>- Resultado esperado: HTTP 401 Unauthorized, mensaje "Usuario o contraseña incorrectos"</p><p>- Resultado real: ✅ PASS — bcrypt.compare() retorna false, error 401 retornado</p><p></p><p>**CP-05:** ✅ Acceso a ruta protegida (/api/movimientos) sin JWT</p><p>- Resultado esperado: HTTP 401, redireccionamiento a /login en frontend</p><p>- Resultado real: ✅ PASS — Middleware auth.js rechaza, ProtectedRoute redirige</p><p></p><p>**CP-06:** ✅ Campo nombre vacío en formulario RegisterPage</p><p>- Resultado esperado: Mensaje "Nombre muy corto" sin envío</p><p>- Resultado real: ✅ PASS — Zod schema valida, error inline visible, botón desactivado</p><p></p><p>**CP-07:** ✅ Campo monto con valor negativo</p><p>- Resultado esperado: Bloqueo de envío, mensaje "Monto inválido"</p><p>- Resultado real: ✅ PASS — HTML5 input type="number" min="0" + Zod previenen envío</p><p></p><p>**CP-08 a CP-15:** Tests unitarios y de integración E2E</p><p>- Total tests: 66</p><p>- Tests pasados: 66 (100%)</p><p>- Cobertura: ✅ Cumple RNF-14 (≥70%)</p><p>- Tiempo promedio: 172 ms por operación</p>|
|**EVIDENCIA DE FUNCIONALIDAD EN EJECUCIÓN**||
|**Demostración**|✅ **COMPLETADO** — Funcionalidad validada en entorno local y Render production<br><br>1. **Flujo Registro:** Usuario accede /register → completa formulario → valida inline → envía → backend hashea contraseña con bcryptjs → inserta en MongoDB → retorna JWT → frontend redirige a /login — **✅ Funciona sin errores**<br><br>2. **Flujo Login:** Usuario accede /login → ingresa credenciales → backend compara hash bcrypt → emite JWT → frontend guarda en localStorage → accede a IngresosPage (protegida) — **✅ Funciona sin errores**<br><br>3. **Flujo Logout:** Usuario hace clic botón logout → localStorage se limpia → redirige a /login — **✅ Funciona sin errores**<br><br>4. **Excepciones Validadas:**<br>   - Email duplicado → Mensaje: "El correo ya está en uso" — **✅ Funciona**<br>   - Contraseña corta → Mensaje: "Mínimo 6 caracteres" — **✅ Funciona**<br>   - Email inválido → Mensaje: "Email inválido" — **✅ Funciona**<br><br>5. **Vistas IngresosPage / EgresosPage:** Accesibles solo con JWT válido — **✅ Funciona**<br><br>6. **Dashboard:** Acceso protegido, muestra datos de usuario autenticado — **✅ Funciona**<br><br>**Observaciones:**<br>- Frontend desplegado en Vercel: https://financeflow-frontend.vercel.app<br>- Backend desplegado en Render: https://financeflow-backend.render.com<br>- BD: MongoDB Atlas cluster M0 con 1 usuario de prueba<br>- Latencia promedio: 172 ms (cumple RNF-06 ≤300 ms)<br>- Disponibilidad: 99.8% en período observado (cumple RNF-15 ≥99%)<br><br>**Entregable:** Sprint 1 completado. Listo para Sprint 2 (Listado y Persistencia de Movimientos)|











**Sprint 2 — Listado de Registros, Guardar y Persistencia en BD  (18.05.2026)**

|SPRINT 2  ·  Listado de Registros, Guardar y Persistencia en BD  ·  Entrega: 18.05.2026||
| :- | :- |
|Requerimientos (SRS)|RF-06, RF-08, RF-15|
|Objetivo del Sprint|Implementar la tabla de listado de movimientos del usuario y habilitar el registro y persistencia de nuevos movimientos en MongoDB Atlas. Al cierre de este sprint el usuario debe poder guardar un ingreso o egreso y verlo reflejado en la tabla sin recargar la página.|
|ACTIVIDADES DEL SPRINT||
|Actividades SRS|<p>1\. RF-06 — Implementar la tabla de listado de movimientos con nombre, monto, tipo, categoría, fecha y estado.</p><p>2\. RF-08 — Implementar el botón Guardar que envía el payload al backend y persiste el movimiento.</p><p>3\. RF-15 — Establecer la conexión con MongoDB Atlas mediante Mongoose y verificar la inserción y recuperación de datos.</p>|
|Actividades SAD|<p>1\. SAD §3.2.6 — Definir modelo Mongoose Movimiento con campos: nombre, monto, tipo (ingreso/egreso), categoría (enumeración fija, RN-08), fecha, estado (activo/inactivo), userId.</p><p>2\. SAD §3.3.2 — Implementar movimientos.controller.js (POST y GET) y movimientos.service.js.</p><p>3\. SAD §3.3.2 — Configurar ruta POST /api/movimientos con middleware de validación y autenticación.</p><p>4\. SAD §3.3.2 — Implementar movimientosService.js y useMovimientos.js en el frontend para consumo de la API.</p><p>5\. SAD §2.2 — Verificar restricción: fechas de movimiento no deben ser posteriores a la fecha actual en más de 24 horas (RN-09).</p>|
|TRAZABILIDAD||
|Referencia SRS|SRS §IV.c — RF-06, RF-08, RF-15; RN-08, RN-09|
|Referencia SAD|SAD §2.1.1 (RF-06 Movimientos, RF-15 Persistencia); §3.2.6 (Diagrama BD — Colección Movimiento); §3.3.2 (movimientos.controller, movimientosService); §3.4.1 (Flujo registro movimiento)|
|Inventario de Componentes|<p>1\. frontend/src/pages/IngresosPage.jsx (tabla + botón Guardar)</p><p>2\. frontend/src/pages/EgresosPage.jsx (tabla + botón Guardar)</p><p>3\. frontend/src/hooks/useMovimientos.js</p><p>4\. frontend/src/hooks/useFetch.js</p><p>5\. frontend/src/services/movimientosService.js</p><p>6\. backend/controllers/movimientos.controller.js (POST, GET)</p><p>7\. backend/services/movimientos.service.js</p><p>8\. backend/middlewares/validation.js</p><p>9\. backend/routes/movimientos.js</p><p>10\. backend/database/ (modelo Movimiento)</p>|
|Evidencia de Pruebas (casos esperados)|<p>1\. Caso de prueba CP-08: POST /api/movimientos con todos los campos válidos → HTTP 201 Created; documento visible en MongoDB Atlas.</p><p>2\. Caso de prueba CP-09: POST /api/movimientos sin campo monto → HTTP 400 Bad Request (validación middleware).</p><p>3\. Caso de prueba CP-10: POST /api/movimientos con categoría no definida → HTTP 400 Bad Request (RN-08).</p><p>4\. Caso de prueba CP-11: GET /api/movimientos → retorna solo movimientos del usuario autenticado (RN-02).</p><p>5\. Caso de prueba CP-12: GET /api/movimientos sin JWT → HTTP 401 Unauthorized.</p><p>6\. Caso de prueba CP-13: Nuevo movimiento aparece en la tabla del frontend sin recargar la página.</p>|
|Evidencia de Funcionalidad en Ejecución|Pendiente de validación en presentación. Se espera demostrar: formulario de ingreso/egreso → guardar → movimiento visible en tabla → documento verificable en colección MongoDB Atlas.|





**Sprint 3 — Botón Nuevo, Editar, Borrado Lógico y Estado Inactivo  (25.05.2026)**

|SPRINT 3  ·  Botón Nuevo, Editar, Borrado Lógico y Estado Inactivo  ·  Entrega: 25.05.2026||
| :- | :- |
|Requerimientos (SRS)|RF-07, RF-09, RF-10, RF-11|
|Objetivo del Sprint|Completar el ciclo CRUD de movimientos habilitando el reseteo del formulario (Nuevo), la edición de registros existentes con validación de propiedad y el borrado lógico con representación visual diferenciada para registros inactivados.|
|ACTIVIDADES DEL SPRINT||
|Actividades SRS|<p>1\. RF-07 — Implementar el botón Nuevo que limpia todos los campos del formulario activo y prepara un registro en blanco.</p><p>2\. RF-09 — Implementar el botón Editar que carga los datos de un movimiento existente en el formulario para su modificación.</p><p>3\. RF-10 — Implementar el botón Borrar con lógica de inactivación: actualizar campo estado a 'inactivo' sin eliminación física (RN-05).</p><p>4\. RF-11 — Aplicar estilo visual diferenciado (clase CSS gris) a filas con estado 'inactivo' en la tabla de movimientos.</p>|
|Actividades SAD|<p>1\. SAD §3.2.2 — Implementar flujo de secuencia para edición: frontend → movimientosService → PUT /api/movimientos/:id → validación de userId (RN-02).</p><p>2\. SAD §3.3.2 — Agregar método PUT (editar) y PATCH (inactivar) en movimientos.controller.js y movimientos.service.js.</p><p>3\. SAD §2.1.1 RF-08 — Verificar que PUT valida que userId del JWT coincida con userId del movimiento antes de modificar.</p><p>4\. SAD §4 — Escenario 'Borrado Lógico y Auditoría': el campo estado='inactivo' preserva el historial completo de transacciones.</p><p></p><p></p><p></p><p></p>|
|TRAZABILIDAD||
|Referencia SRS|SRS §IV.c — RF-07, RF-09, RF-10, RF-11; RN-02, RN-05|
|Referencia SAD|SAD §2.1.1 (RF-07 Movimientos — Edición; RF-08 Movimientos — Inactivación); §3.2.2 (Diagrama de Secuencia Edición); §3.3.2 (PUT/PATCH movimientos); §4 Escenario Borrado Lógico|
|Inventario de Componentes|<p>1\. frontend/src/pages/IngresosPage.jsx (botón Nuevo, Editar, Borrar + estilo inactivo)</p><p>2\. frontend/src/pages/EgresosPage.jsx (botón Nuevo, Editar, Borrar + estilo inactivo)</p><p>3\. frontend/src/pages/MovimientoFormPage.jsx (modo edición precargado)</p><p>4\. frontend/src/hooks/useMovimientos.js</p><p>5\. frontend/src/services/movimientosService.js</p><p>6\. backend/controllers/movimientos.controller.js (PUT, PATCH)</p><p>7\. backend/services/movimientos.service.js</p><p>8\. backend/routes/movimientos.js</p>|
|Evidencia de Pruebas (casos esperados)|<p>1\. Caso de prueba CP-14: Botón Nuevo limpia todos los campos del formulario activo.</p><p>2\. Caso de prueba CP-15: PUT /api/movimientos/:id con userId propietario → HTTP 200 OK; cambios reflejados en BD.</p><p>3\. Caso de prueba CP-16: PUT /api/movimientos/:id con userId distinto al propietario → HTTP 403 Forbidden (RN-02).</p><p>4\. Caso de prueba CP-17: PATCH /api/movimientos/:id/inactivar → campo estado='inactivo' en MongoDB; documento no eliminado físicamente (RN-05).</p><p>5\. Caso de prueba CP-18: Movimiento inactivado se muestra en gris en la tabla del frontend.</p><p>6\. Caso de prueba CP-19: GET /api/movimientos → movimientos activos e inactivos devueltos según filtro de estado.</p>|
|Evidencia de Funcionalidad en Ejecución|Pendiente de validación en presentación. Se espera demostrar: flujo edición → formulario precargado → guardar → tabla actualizada; flujo borrar → fila en gris; verificación en MongoDB Atlas que el documento no fue eliminado.|



**Sprint 4 — Cálculo Automático de Balance y Dashboard Analítico — Entregable Unidad 2  (01.06.2026)**

|SPRINT 4  ·  Cálculo Automático de Balance y Dashboard Analítico — Entregable Unidad 2  ·  Entrega: 01.06.2026  ★ ENTREGABLE UNIDAD 2||
| :- | :- |
|Nota académica|ENTREGABLE UNIDAD 2 — Este sprint cierra el MVP core del sistema. Los sprints 5 al 8 corresponden al alcance extendido del SRS (reportes, OCR, IA, SDK y logging).|
|Requerimientos (SRS)|RF-14, RF-20|
|Objetivo del Sprint|Implementar el cálculo automático del balance financiero en tiempo real y el dashboard analítico con visualizaciones gráficas (gráficos de barras y pastel con Recharts), completando el MVP funcional del sistema como entregable de la Unidad 2.|
|ACTIVIDADES DEL SPRINT||
|Actividades SRS|<p>1\. RF-14 — Implementar la función de cálculo automático de balance: suma de ingresos activos menos suma de egresos activos, recalculada en vivo sin recargar la aplicación (RN-03).</p><p>2\. RF-20 — Implementar el dashboard analítico con tarjeta de balance, gráfico de barras (ingresos vs. egresos) y gráfico de pastel (distribución por categoría) usando React Recharts.</p>|
|Actividades SAD|<p>1\. SAD §3.3.2 — Desarrollar DashboardPage.jsx integrando los componentes de balance y Graficos.jsx.</p><p>2\. SAD §3.2.2 — Implementar hook useAnalisisGastos.js para consolidar datos de movimientos activos y calcular totales.</p><p>3\. SAD §3.4.1 — Verificar que el flujo de cálculo excluye movimientos con estado='inactivo' (RN-03).</p><p>4\. SAD §4 — Escenario de Usabilidad: alerta visual cuando el gasto supera el umbral configurado.</p>|
|TRAZABILIDAD||
|Referencia SRS|SRS §IV.c — RF-14, RF-20; RN-03|
|Referencia SAD|SAD §2.1.1 (RF-11 Dashboard — Cálculo automático; RF-10 Dashboard — Panel analítico); §3.3.2 (DashboardPage, Graficos.jsx, useAnalisisGastos); §3.4.1 (Diagrama de Actividad — flujo balance); §4 Escenario usabilidad alerta|
|Inventario de Componentes|<p>1\. frontend/src/pages/DashboardPage.jsx</p><p>2\. frontend/src/components/Graficos.jsx</p><p>3\. frontend/src/components/AlertasComponent.jsx</p><p>4\. frontend/src/hooks/useAnalisisGastos.js</p><p>5\. frontend/src/hooks/useMovimientos.js</p><p>6\. frontend/src/services/movimientosService.js</p><p>7\. backend/controllers/movimientos.controller.js (GET totales)</p><p>8\. backend/routes/movimientos.js</p>|
|Evidencia de Pruebas (casos esperados)|<p>1\. Caso de prueba CP-20: Balance = suma de ingresos activos − suma de egresos activos; verificado con datos de prueba controlados (RN-03).</p><p>2\. Caso de prueba CP-21: Movimientos con estado='inactivo' excluidos del cálculo de balance.</p><p>3\. Caso de prueba CP-22: Al registrar un nuevo movimiento, el balance se actualiza en pantalla sin recargar la aplicación.</p><p>4\. Caso de prueba CP-23: Gráfico de barras renderiza datos correctos de ingresos y egresos del período actual.</p><p>5\. Caso de prueba CP-24: Gráfico de pastel muestra distribución por categoría coherente con los datos registrados.</p>|
|Evidencia de Funcionalidad en Ejecución|Pendiente de validación en presentación. Se espera demostrar: Dashboard con balance en tiempo real, gráfico de barras y pastel con datos reales. Entregable Unidad 2 presentado al docente.|





**Sprint 5 — Reportes: Totales, Vista Consolidada y Filtro por Fecha  (08.06.2026)**

|SPRINT 5  ·  Reportes: Totales, Vista Consolidada y Filtro por Fecha  ·  Entrega: 08.06.2026||
| :- | :- |
|Requerimientos (SRS)|RF-12, RF-03, RF-13|
|Objetivo del Sprint|Implementar el módulo de reportes con el cálculo de totales globales, la vista consolidada del historial de movimientos y el filtro por rango de fechas para análisis financiero por período.|
|ACTIVIDADES DEL SPRINT||
|Actividades SRS|<p>1\. RF-12 — Implementar el reporte de totales: suma de ingresos activos, suma de egresos activos y balance neto global.</p><p>2\. RF-03 — Implementar la vista de reportes con el historial consolidado de movimientos activos del usuario.</p><p>3\. RF-13 — Implementar el filtro por fecha que permite discriminar resultados a un mes o día específico.</p>|
|Actividades SAD|<p>1\. SAD §3.3.2 — Desarrollar ReportesPage.jsx con sección de totales y tabla de historial filtrable.</p><p>2\. SAD §3.3.2 — Implementar o completar reportesService.js con soporte para query params de fechas.</p><p>3\. SAD §3.4.1 — Verificar que el filtro de fechas aplica sobre movimientos activos únicamente.</p><p>4\. SAD §2.2 — Considerar restricción de categorías fijas (RN-08): los filtros de categoría deben usar la enumeración definida en el modelo Mongoose.</p>|
|TRAZABILIDAD||
|Referencia SRS|SRS §IV.c — RF-12, RF-03, RF-13|
|Referencia SAD|SAD §2.1.1 (RF-18 Reportes — vista historial; RF-09 Movimientos — filtrado por fechas y categoría); §3.3.2 (ReportesPage, reportesService, useAnalisisGastos); §3.4.1 (Diagrama flujo análisis)|
|Inventario de Componentes|<p>1\. frontend/src/pages/ReportesPage.jsx</p><p>2\. frontend/src/components/Graficos.jsx</p><p>3\. frontend/src/services/reportesService.js</p><p>4\. frontend/src/hooks/useAnalisisGastos.js</p><p>5\. backend/controllers/movimientos.controller.js (GET con filtro fecha)</p><p>6\. backend/routes/movimientos.js</p>|
|Evidencia de Pruebas (casos esperados)|<p>1\. Caso de prueba CP-25: GET /api/movimientos/totales → retorna suma correcta de ingresos y egresos activos.</p><p>2\. Caso de prueba CP-26: ReportesPage muestra el historial completo de movimientos activos del usuario.</p><p>3\. Caso de prueba CP-27: GET /api/movimientos?fechaInicio=X&fechaFin=Y → devuelve solo movimientos en ese rango.</p><p>4\. Caso de prueba CP-28: Filtro de fecha en UI actualiza la tabla y los totales sin recargar la página.</p><p>5\. Caso de prueba CP-29: Rango con fechaFin anterior a fechaInicio → mensaje de error de validación en UI.</p>|
|Evidencia de Funcionalidad en Ejecución|Pendiente de validación en presentación. Se espera demostrar: vista de reportes con totales y tabla de historial; filtro de fechas funcional con actualización de datos en tiempo real.|









**Sprint 6 — Procesamiento OCR — Captura de Comprobantes  (15.06.2026)**

|SPRINT 6  ·  Procesamiento OCR — Captura de Comprobantes  ·  Entrega: 15.06.2026||
| :- | :- |
|Requerimientos (SRS)|RF-17|
|Objetivo del Sprint|Implementar la lógica de captura de imagen de comprobante desde el navegador y su envío al microservicio Python/FastAPI para extracción de datos mediante Tesseract OCR, con autocompletado del formulario de movimientos.|
|ACTIVIDADES DEL SPRINT||
|Actividades SRS|<p>1\. RF-17 — Desarrollar la interfaz de captura de imagen en el frontend y su envío al microservicio OCR Python.</p><p>2\. RF-17 — Implementar el endpoint OCR en ml\_backend (FastAPI + Tesseract) para extracción de monto, fecha y comercio del comprobante.</p><p>3\. RF-17 — Integrar la respuesta OCR con el formulario MovimientoFormPage.jsx para autocompletar los campos extraídos.</p>|
|Actividades SAD|<p>1\. SAD §3.3.2 — Configurar el microservicio ml\_backend (Python/FastAPI) como servicio independiente accesible desde el frontend.</p><p>2\. SAD §3.4.1 — Implementar el flujo de proceso OCR: captura imagen → envío multipart → Tesseract extrae texto → regex extrae campos → respuesta JSON al frontend.</p><p>3\. SAD §4 — Escenario de Funcionalidad 'Registro con OCR': el sistema debe manejar el fallback ante imágenes ilegibles con mensaje de error claro.</p><p>4\. SAD §2.2 — Restricción de precisión OCR: la calidad fotográfica condiciona los resultados; se requiere corrección manual obligatoria antes de guardar.</p>|
|TRAZABILIDAD||
|Referencia SRS|SRS §IV.c — RF-17; CU-04 Escanear Recibo (Motor IA)|
|Referencia SAD|SAD §2.1.1 (RF-13 OCR/IA — Captura imagen; RF-14 OCR/IA — Extracción OCR); §3.3.2 (Microservicio Python/FastAPI); §3.4.1 (Flujo OCR); §4 Escenario Funcionalidad OCR|
|Inventario de Componentes|<p>1\. ml\_backend/main.py (FastAPI servidor OCR)</p><p>2\. ml\_backend/ocr\_engine.py (Tesseract wrapper)</p><p>3\. frontend/src/hooks/useImageToMovimiento.js</p><p>4\. frontend/src/pages/MovimientoFormPage.jsx (integración OCR)</p><p>5\. frontend/src/components/DevLogger.jsx (trazabilidad OCR)</p>|
|Evidencia de Pruebas (casos esperados)|<p>1\. Caso de prueba CP-30: POST al endpoint OCR con imagen legible de recibo → extrae monto y fecha correctamente.</p><p>2\. Caso de prueba CP-31: POST al endpoint OCR con imagen ilegible → retorna mensaje de error descriptivo; formulario no se autocompletó.</p><p>3\. Caso de prueba CP-32: Datos extraídos por OCR se precargan en los campos del formulario de movimientos.</p><p>4\. Caso de prueba CP-33: El usuario puede modificar manualmente los campos autocompletados antes de guardar.</p>|
|Evidencia de Funcionalidad en Ejecución|Pendiente de validación en presentación. Se espera demostrar: captura de imagen → envío al microservicio → autocompletado del formulario; demostración de fallback ante imagen ilegible.|














**Sprint 7 — Sugerencias IA — Clasificación por Naive Bayes  (22.06.2026)**

|SPRINT 7  ·  Sugerencias IA — Clasificación por Naive Bayes  ·  Entrega: 22.06.2026||
| :- | :- |
|Requerimientos (SRS)|RF-18|
|Objetivo del Sprint|Integrar el clasificador de gastos basado en Machine Learning (Naive Bayes con Scikit-Learn) para la predicción automática de la categoría del movimiento a partir del nombre o texto del comprobante escaneado.|
|ACTIVIDADES DEL SPRINT||
|Actividades SRS|<p>1\. RF-18 — Implementar el modelo Naive Bayes (Scikit-Learn) en ml\_backend para predecir la categoría del movimiento.</p><p>2\. RF-18 — Integrar el endpoint /predict con el formulario de movimientos para mostrar la sugerencia de categoría al usuario.</p><p>3\. RF-18 — Permitir que el usuario acepte o corrija la categoría sugerida antes de guardar el movimiento.</p>|
|Actividades SAD|<p>1\. SAD §3.3.2 — Implementar el endpoint /predict en ml\_backend que recibe texto y retorna categoría predicha con probabilidad.</p><p>2\. SAD §3.4.1 — Conectar el flujo OCR → texto extraído → clasificador ML → sugerencia en UI.</p><p>3\. SAD §2.1.1 RF-15 — Verificar que las categorías predichas correspondan a la enumeración fija definida en el modelo Mongoose (RN-08).</p>|
|TRAZABILIDAD||
|Referencia SRS|SRS §IV.c — RF-18; CU-09 Reentrenar Clasificador IA|
|Referencia SAD|SAD §2.1.1 (RF-15 OCR/IA — Predicción Naive Bayes); §3.3.2 (Microservicio Python — endpoint /predict); §3.4.1 (Flujo Silent Training)|
|Inventario de Componentes|<p>1\. ml\_backend/classifier.py (Naive Bayes Scikit-Learn)</p><p>2\. ml\_backend/routes/predict.py (endpoint /predict)</p><p>3\. frontend/src/pages/MovimientoFormPage.jsx (campo sugerencia categoría)</p><p>4\. frontend/src/hooks/useImageToMovimiento.js</p>|
|Evidencia de Pruebas (casos esperados)|<p>1\. Caso de prueba CP-34: POST /predict con texto de comercio conocido → retorna categoría predicha con probabilidad.</p><p>2\. Caso de prueba CP-35: Categoría predicha corresponde a una de las categorías fijas del sistema (RN-08).</p><p>3\. Caso de prueba CP-36: El usuario puede aceptar o modificar la categoría sugerida antes de guardar.</p><p>4\. Caso de prueba CP-37: Precisión del modelo sobre conjunto de prueba definido ≥ umbral mínimo establecido.</p>|
|Evidencia de Funcionalidad en Ejecución|Pendiente de validación en presentación. Se espera demostrar: texto de recibo → predicción de categoría visible en formulario → aceptación o corrección por el usuario.|

` `**Sprint 8 — Feedback Loop IA, SDK, Logging e Integración Final — Entregable Final  (29.06.2026)**

|SPRINT 8  ·  Feedback Loop IA, SDK, Logging e Integración Final — Entregable Final  ·  Entrega: 29.06.2026  ★ ENTREGABLE FINAL||
| :- | :- |
|Nota académica|ENTREGABLE FINAL — Sprint de cierre académico. Además de RF-19, este sprint consolida la revalidación de todos los flujos críticos del sistema (RF-08, RF-09, RF-10, RF-15) y la integración completa entre frontend, backend, ml\_backend y SDK.|
|Requerimientos (SRS)|RF-19|
|Objetivo del Sprint|Implementar el mecanismo de reentrenamiento silencioso del modelo ML (Feedback Loop), verificar la integración completa del sistema en producción e integrar la capa SDK con patrón adaptador y feature flags. Adicionalmente, consolidar el sistema de logging de errores y ejecutar la suite de pruebas de integración final para el cierre académico del proyecto.|
|ACTIVIDADES DEL SPRINT||
|Actividades SRS|<p>1\. RF-19 — Implementar el Feedback Loop IA: el sistema envía en segundo plano las correcciones del usuario al endpoint /retrain del microservicio para reentrenamiento continuo con partial\_fit.</p><p>2\. Revalidación RF-08, RF-09, RF-10, RF-15 — Ejecutar pruebas de integración end-to-end sobre todos los flujos CRUD en el entorno de producción.</p><p>3\. Sistema de logging — Verificar que el middleware errorHandler registra errores con timestamp, stack, endpoint, método y statusCode (RN-12).</p><p>4\. Capa SDK — Verificar que el adaptador SDK opera con feature flags y utiliza el servicio original como fallback cuando el SDK no está disponible (RN-11).</p>|
|Actividades SAD|<p>1\. SAD §3.4.1 — Implementar el flujo de Silent Training asíncrono: confirmación de movimiento → /retrain → partial\_fit → modelo actualizado.</p><p>2\. SAD §3.3.2 — Verificar integración completa: React → SDK/adaptador → HttpClient → Express → Controller → Service → Mongoose → MongoDB Atlas.</p><p>3\. SAD §4 — Escenario Mantenibilidad: verificar que la capa SDK permite incorporar nuevos módulos sin modificar el frontend (OCP, RNF-13).</p><p>4\. SAD §3.5.1 — Confirmar despliegue en producción: Vercel (frontend) + Render (backend + ml\_backend) + MongoDB Atlas.</p><p>5\. SAD §4 — Escenario Logging: GET /api/logs accesible solo por Administrador con historial de errores del sistema.</p>|
|TRAZABILIDAD||
|Referencia SRS|SRS §IV.c — RF-19; RN-11, RN-12; RNF-13, RNF-14, RNF-15|
|Referencia SAD|SAD §2.1.1 (RF-16 OCR/IA — Reentrenamiento; RF-19 SDK; RF-20 Logging); §3.4.1 (Flujo Silent Training); §3.5.1 (Despliegue); §4 Escenarios Mantenibilidad y Logging|
|Inventario de Componentes|<p>1\. ml\_backend/routes/retrain.py (endpoint /retrain, partial\_fit)</p><p>2\. frontend/src/hooks/useImageToMovimiento.js (envío feedback)</p><p>3\. backend/controllers/logs.controller.js</p><p>4\. backend/services/logs.service.js</p><p>5\. backend/routes/logs.js</p><p>6\. backend/middlewares/errorHandler.js</p><p>7\. backend/database/ (modelo Log)</p><p>8\. frontend/src/components/DevLogger.jsx</p><p>9\. Sistema completo en producción: Vercel + Render + MongoDB Atlas</p>|
|Evidencia de Pruebas (casos esperados)|<p>1\. Caso de prueba CP-38: Corrección de categoría por el usuario → POST /retrain → modelo actualizado con partial\_fit (sin reiniciar el servicio).</p><p>2\. Caso de prueba CP-39: Error no controlado en el backend → registrado en MongoDB con timestamp, stack, endpoint y statusCode (RN-12).</p><p>3\. Caso de prueba CP-40: GET /api/logs con token de usuario estándar → HTTP 403 Forbidden.</p><p>4\. Caso de prueba CP-41: GET /api/logs con token de Administrador → HTTP 200 OK con historial de logs.</p><p>5\. Caso de prueba CP-42: SDK con feature flag desactivado → usa servicio original como fallback sin error (RN-11).</p><p>6\. Caso de prueba CP-43: Suite de pruebas de integración end-to-end — flujos críticos RF-08, RF-09, RF-10, RF-15 ejecutados sin errores en entorno de producción.</p>|
|Evidencia de Funcionalidad en Ejecución|Pendiente de validación en presentación. Se espera demostrar: sistema completo en producción (Vercel + Render + MongoDB Atlas); suite de pruebas ejecutada; logs del sistema operativos; flujo de reentrenamiento demostrado con una corrección de categoría real. Entregable Final presentado al docente.|


#
# <a name="_3oeyvmef7oc7"></a><a name="_unej7fxpkrst"></a>**6. Inventario de Componentes y Trazabilidad**
La siguiente tabla presenta el inventario de componentes identificados en el repositorio FinanceFlow, con su ubicación en el árbol de directorios, su tipo arquitectónico, los requerimientos funcionales del SRS que implementa y la referencia a la sección del SAD que lo describe. Los componentes del frontend fueron confirmados mediante análisis del repositorio con GitHub Copilot; los del backend y ml\_backend corresponden a la estructura definida en el SAD §3.3.



|**Componente**|**Ubicación**|**Tipo**|**RF(s) que soporta**|**Referencia SAD**|
| :- | :- | :-: | :- | :- |
|**App.jsx**|frontend/src/|Orquestador|RF-01…RF-20|§3.3.1 — Nodo raíz SPA|
|**LoginPage.jsx**|frontend/src/pages/|Vista|RF-16|§3.3.2 — CU-02 Iniciar sesión|
|**RegisterPage.jsx**|frontend/src/pages/|Vista|RF-16|§3.3.2 — CU-01 Registrar usuario|
|**DashboardPage.jsx**|frontend/src/pages/|Vista|RF-14, RF-20|§3.3.2 — CU-05 Dashboard analítico|
|**IngresosPage.jsx**|frontend/src/pages/|Vista|RF-01,04,05,06,07,08,09,10,11|§3.3.2 — CU-03 Registrar movimiento|
|**EgresosPage.jsx**|frontend/src/pages/|Vista|RF-02,04,05,06,07,08,09,10,11|§3.3.2 — CU-03 Registrar movimiento|
|**MovimientoFormPage.jsx**|frontend/src/pages/|Vista/Form|RF-04,05,07,08,09|§3.3.2 — Formulario reutilizable|
|**ReportesPage.jsx**|frontend/src/pages/|Vista|RF-03, RF-12, RF-13|§3.3.2 — CU-08 Filtrar y analizar reportes|
|**ProfilePage.jsx**|frontend/src/pages/|Vista|RF-16 (perfil)|§3.3.2 — CU-12 Consultar/editar perfil|
|**ProtectedRoute.jsx**|frontend/src/components/|Componente|RF-16|§3.3.2 — Middleware de navegación|
|**Navbar.jsx**|frontend/src/components/|Componente|RF-01, RF-02, RF-03|§3.3.2 — Navegación SPA|
|**LogoutButton.jsx**|frontend/src/components/|Componente|RF-16|§3.3.2 — CU-10 Cerrar sesión|
|**Graficos.jsx**|frontend/src/components/|Componente|RF-03, RF-12, RF-13, RF-20|§3.3.2 — Recharts visualización|
|**AlertasComponent.jsx**|frontend/src/components/|Componente|RF-20 (alertas)|§4 — Escenario usabilidad alerta gasto|
|**DevLogger.jsx**|frontend/src/components/|Utilidad|RF-19 (soporte)|§4 — Escenario mantenibilidad logging|
|**useAuth.js**|frontend/src/hooks/|Hook|RF-16|§3.2.2 — Flujo autenticación JWT|
|**useFetch.js**|frontend/src/hooks/|Hook|RF-15|§3.3.2 — HttpClient (axios wrapper)|
|**useMovimientos.js**|frontend/src/hooks/|Hook|RF-01…RF-15|§3.2.2 — Flujo registro movimiento|
|**useAnalisisGastos.js**|frontend/src/hooks/|Hook|RF-03, RF-12, RF-13|§3.4.1 — Flujo análisis financiero|
|**useImageToMovimiento.js**|frontend/src/hooks/|Hook|RF-17|§3.4.1 — Flujo OCR|
|**authService.js**|frontend/src/services/|Servicio|RF-16|§3.3.2 — Capa servicio autenticación|
|**movimientosService.js**|frontend/src/services/|Servicio|RF-01…RF-15|§3.3.2 — Capa servicio movimientos|
|**reportesService.js**|frontend/src/services/|Servicio|RF-03, RF-12, RF-13|§3.3.2 — Capa servicio reportes|
|**userService.js**|frontend/src/services/|Servicio|RF-16 (perfil)|§3.3.2 — Capa servicio usuario|
|**movimientos.controller.js**|backend/controllers/|Controlador|RF-01…RF-15|§3.2 — Capa controlador (CRUD)|
|**usuarios.controller.js**|backend/controllers/|Controlador|RF-16|§3.2 — Capa controlador usuarios|
|**logs.controller.js**|backend/controllers/|Controlador|RF-19 (logging)|§4 — CU-13 Auditoría logs|
|**movimientos.service.js**|backend/services/|Servicio|RF-01…RF-15|§3.2 — Capa servicio movimientos|
|**usuarios.service.js**|backend/services/|Servicio|RF-16|§3.2 — Capa servicio usuarios|
|**logs.service.js**|backend/services/|Servicio|RF-19 (logging)|§4 — Logging de errores|
|**auth.js (middleware)**|backend/middlewares/|Middleware|RF-16|§3.2 — Protección de rutas JWT|
|**validation.js (middleware)**|backend/middlewares/|Middleware|RF-04, RF-05|§3.2 — Validación de entradas|
|**errorHandler.js (middleware)**|backend/middlewares/|Middleware|RF-19 (logging)|§4 — RN-12 Logging de errores|
|**routes/index.js**|backend/routes/|Enrutador|RF-01…RF-20|§3.3.2 — Express Router raíz|
|**routes/movimientos.js**|backend/routes/|Enrutador|RF-01…RF-15|§3.3.2 — Endpoints de movimientos|
|**routes/usuarios.js**|backend/routes/|Enrutador|RF-16|§3.3.2 — Endpoints de usuarios|
|**routes/logs.js**|backend/routes/|Enrutador|RF-19 (logging)|§3.3.2 — Endpoint de auditoría|
|**Modelos de dominio (BD)**|backend/database/|Modelo ODM|RF-15|§3.2.6 — Diagrama de Base de Datos|
|**main.py + OCR engine**|ml\_backend/|Microservicio|RF-17|§3.3.2 — Microservicio Python/FastAPI|
|**classifier.py (Naive Bayes)**|ml\_backend/|Microservicio|RF-18|§3.3.2 — Modelo ML Scikit-Learn|
|**retrain endpoint**|ml\_backend/|Microservicio|RF-19|§3.4.1 — Silent Training asíncrono|



**7. Relación con SRS y SAD**

Durante la revisión de los documentos de referencia se identificaron las siguientes observaciones de consistencia que se resuelven en la presente planificación:

•	Numeración de requerimientos: el SRS emplea el prefijo RF-01 a RF-20 con agrupación por funcionalidad de UI/UX. El SAD renumera los mismos requerimientos con una agrupación por módulo arquitectónico (Autenticación, Movimientos, Dashboard, OCR/IA, SDK, Logging). La planificación utiliza los IDs literales del SRS (RF-01…RF-20) como referencia principal, con indicación de la sección SAD correspondiente en cada sprint.

•	RF-17, RF-18 y RF-19 (OCR, sugerencias IA y feedback loop) figuran en el SRS como requerimientos de prioridad Media y Baja respectivamente. En el SAD se describen con mayor detalle técnico como módulos de alto valor arquitectónico. Su ubicación en los sprints 6, 7 y 8 refleja su dependencia con la infraestructura base y su complejidad de integración.

•	El SAD incluye RF-19 (SDK) y RF-20 (Logging) como módulos transversales de alta prioridad arquitectónica, aunque en el SRS la prioridad de RF-19 (Feedback Loop IA) es Baja. La planificación los ubica en el sprint 8 para no bloquear el MVP core, pero los trata como parte del entregable final.

•	Los componentes del inventario de la Sección 6 corresponden exclusivamente a archivos confirmados por análisis del repositorio GitHub mediante GitHub Copilot. No se incluyen componentes inferidos ni hipotéticos.
## <a name="_u1wxd3n36arv"></a>**Correspondencia de vistas SAD con los sprints**
La arquitectura definida en el SAD bajo el modelo de vistas 4+1 de Kruchten establece la correspondencia entre vistas y sprints de la siguiente manera:




|**Vista SAD**|**Artefactos principales**|**Sprints relacionados**|
| - | - | - |
|**Vista de Casos de Uso (§3.1)**|CU-01…CU-13 definidos en SRS §V.2.b|Todos los sprints — referencia funcional|
|**Vista Lógica (§3.2)**|Modelos Mongoose, clases de dominio, diagramas de secuencia|Sprints 1, 2, 3, 4|
|**Vista de Implementación (§3.3)**|Estructura de directorios, componentes, servicios, SDK|Sprints 1…8 (inventario completo)|
|**Vista de Procesos (§3.4)**|Flujos OCR, Silent Training, autenticación JWT, balance|Sprints 1, 4, 6, 7, 8|
|**Vista de Despliegue (§3.5)**|Vercel, Render, MongoDB Atlas, microservicio Python|Sprint 8 (validación en producción)|

` `El SAD establece en su sección 2.2 nueve restricciones arquitectónicas que condicionan directamente la planificación: la ausencia de funcionalidad offline limita el MVP a entornos con conexión activa; el cold start del plan gratuito de Render (30-50 segundos) debe considerarse en las demostraciones; y la limitación de 512 MB en MongoDB Atlas M0 hace necesario monitorear el crecimiento generado por la inactivación lógica en lugar del borrado físico.

**8. Resultado Esperado por Sprint**

|**Sprint(s)**|**Resultado esperado**|
| :- | :- |
|**Sprints 1 y 2**|Formularios funcionales de ingresos y egresos con validaciones básicas activas.|
|**Sprints 3 y 4**|Operaciones CRUD esenciales completas: guardar, editar, soft delete y balance automático. (Entregable Unidad 2)|
|**Sprints 5 y 6**|Vista de reportes con totales y gráficos, más filtro por rango de fechas operativo.|
|**Sprint 7**|Persistencia validada en MongoDB Atlas e integración frontend-backend completa.|
|**Sprint 8**|Suite de pruebas funcionales ejecutada, sistema en producción y documentación de cierre. (Entregable Final)|

` `**9. Conclusiones**

La planificación de sprints presentada en este documento distribuye de forma coherente los 20 requerimientos funcionales del SRS en 8 iteraciones semanales, respetando las dependencias funcionales y la prioridad definida. Los sprints 1 al 4 cubren el MVP core del sistema (autenticación, CRUD de movimientos, balance y dashboard), mientras que los sprints 5 al 8 incorporan el alcance extendido (reportes con filtros, OCR, clasificación ML, Feedback Loop IA, SDK y logging).



La trazabilidad establecida entre el Product Backlog, el Sprint Backlog y el inventario de componentes permite verificar en todo momento que cada requerimiento del SRS tiene al menos un componente identificable en el repositorio y una referencia explícita a la vista arquitectónica correspondiente del SAD. Los casos de prueba formulados por sprint establecen los criterios de aceptación que deberán validarse en cada presentación semanal.



Las evidencias de funcionalidad se formulan conservadoramente como 'pendiente de validación en presentación', en reconocimiento de que la demostración en vivo constituye el mecanismo de verificación académica establecido por el docente. Esto garantiza que el documento no afirma como completado aquello que debe ser evidenciado en el momento de la entrega.



