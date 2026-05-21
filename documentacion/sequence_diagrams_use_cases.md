# Diagramas de Secuencia - Casos de Uso

**Fecha:** 20 de mayo de 2026

---

## CU-01: Registrar Usuario

```mermaid
sequenceDiagram
title CU-01: Registrar Usuario
participant "RegisterPage.jsx" as RegisterPage
participant authService
participant "POST /api/usuarios/register" as POST_Register
participant "usuarios.controller.js" as UsuariosController
participant "usuarios.service.js" as UsuariosService
participant "usuario.model.js" as UsuarioModel
participant MongoDB

RegisterPage ->> authService: register(nombre,email,password)
authService ->> POST_Register: POST /api/usuarios/register {nombre,email,password}
POST_Register ->> UsuariosController: register(req.body)
UsuariosController ->> UsuariosService: register(data)
UsuariosService ->> UsuarioModel: new Usuario(...) and save()
UsuarioModel -->> MongoDB: insert document
MongoDB -->> UsuarioModel: insert result
UsuarioModel -->> UsuariosService: saved usuario
UsuariosService -->> UsuariosController: { id,nombre,email,estado,creadoEn }
UsuariosController -->> POST_Register: 201 Created { usuario }
POST_Register -->> authService: 201 Created { usuario }
authService -->> RegisterPage: return usuario

alt Email already exists
  UsuariosService -->> UsuariosController: throw Error("El email ya está registrado")
  UsuariosController -->> POST_Register: 400 { message: "El email ya está registrado" }
  POST_Register -->> authService: 400 { message }
  authService -->> RegisterPage: throws error
end
```

---

## CU-02: Iniciar Sesión (Login JWT)

```mermaid
sequenceDiagram
title CU-02: Iniciar Sesión (Login JWT)
participant "LoginPage.jsx" as LoginPage
participant authService
participant "POST /api/usuarios/login" as POST_Login
participant "usuarios.controller.js" as UsuariosController
participant "usuarios.service.js" as UsuariosService
participant "usuario.model.js" as UsuarioModel
participant "backend/middlewares/auth.js" as AuthMiddleware

LoginPage ->> authService: login(email,password)
authService ->> POST_Login: POST /api/usuarios/login {email,password}
POST_Login ->> UsuariosController: login(req.body)
UsuariosController ->> UsuariosService: login(email,password)
UsuariosService ->> UsuarioModel: findOne({email})
UsuarioModel -->> UsuariosService: usuario
UsuariosService ->> UsuariosService: bcrypt.compare(password,passwordHash)
UsuariosService -->> UsuariosController: { id,nombre,email,estado,creadoEn }
UsuariosController ->> POST_Login: sign JWT (expiresIn: 7d) -> { token, usuario }
POST_Login -->> authService: 200 OK { token, usuario }
authService ->> LoginPage: store token (localStorage) & notifyAuthChange()

alt Invalid credentials
  UsuariosService -->> UsuariosController: throw Error("Usuario o contraseña incorrectos")
  UsuariosController -->> POST_Login: 401 { message }
  POST_Login -->> authService: 401 { message }
  authService -->> LoginPage: throws error
end
```

---

## CU-03: Registrar Movimiento Manual

```mermaid
sequenceDiagram
title CU-03: Registrar Movimiento Manual
participant "MovimientoFormPage.jsx" as MovimientoForm
participant movimientosService
participant "POST /api/movimientos" as POST_Movimientos
participant "movimientos.controller.js" as MovimientosController
participant "movimientos.service.js" as MovimientosService
participant "movimiento.model.js" as MovimientoModel
participant MongoDB
participant "backend/middlewares/auth.js" as AuthMiddleware

MovimientoForm ->> movimientosService: createMovimiento(movimiento)
movimientosService ->> POST_Movimientos: POST /api/movimientos (Authorization: Bearer token)
POST_Movimientos ->> AuthMiddleware: validate JWT
AuthMiddleware -->> POST_Movimientos: req.user set
POST_Movimientos ->> MovimientosController: crearMovimiento(req.body + userId)
MovimientosController ->> MovimientosService: crearMovimiento(data)
MovimientosService ->> MovimientoModel: new Movimiento(...) and save()
MovimientoModel -->> MongoDB: insert document
MongoDB -->> MovimientoModel: insert result
MovimientoModel -->> MovimientosService: saved movimiento
MovimientosService -->> MovimientosController: movimiento
MovimientosController -->> POST_Movimientos: 201 { movimiento }
POST_Movimientos -->> movimientosService: 201 { movimiento }
movimientosService -->> MovimientoForm: created movimiento

alt Validation error (e.g., monto invalid)
  MovimientosService -->> MovimientosController: throw Error("El monto debe ser un número positivo")
  MovimientosController -->> POST_Movimientos: 400 { error }
  POST_Movimientos -->> movimientosService: 400 { error }
  movimientosService -->> MovimientoForm: throws error
end

alt Unauthorized (no/invalid token)
  AuthMiddleware -->> POST_Movimientos: 401 { error: 'Token no proporcionado' / 'Token inválido' }
  POST_Movimientos -->> movimientosService: 401 { error }
  movimientosService -->> MovimientoForm: throws error
end
```

---

## CU-04: Escanear Recibo (Motor IA)

```mermaid
sequenceDiagram
title CU-04: Escanear Recibo (Motor IA)
participant "useImageToMovimiento.js" as ImageHook
participant "POST /analyze-receipt" as POST_Analyze
participant "POST /categorize" as POST_Categorize
participant "ml_backend/main.py" as MLServer
participant "modelo_clasificador.pkl" as MLModel
participant "pytesseract/OpenCV" as OCR

ImageHook ->> POST_Analyze: POST /analyze-receipt (multipart/form-data file)
POST_Analyze ->> MLServer: analyze_receipt(file)
Note over MLServer,OCR: OpenCV preprocess -> Tesseract OCR -> extract text
MLServer ->> OCR: tesseract image_to_string
OCR -->> MLServer: raw_text
MLServer ->> MLModel: predict_category(description) (if model loaded)
alt Model available
  MLModel -->> MLServer: category + confidence
else Model not available / low confidence
  MLServer -->> MLServer: heuristic fallback -> category "Otros" or "Comida"
end
MLServer -->> POST_Analyze: 200 { data: { monto, descripcion, fecha, tipo, categoria_ml, estado } }
POST_Analyze -->> ImageHook: 200 { data }

Note right of ImageHook: frontend maps result to movimiento draft

alt OCR / processing error
  MLServer -->> POST_Analyze: 500 { detail: "Error analizando la imagen: ..." }
  POST_Analyze -->> ImageHook: 500 error
  ImageHook -->> MovimientoFormPage.jsx: show error / fallback
end

Note over POST_Categorize,MLServer: Optional categorization endpoint
ImageHook ->> POST_Categorize: POST /categorize { description, amount }
POST_Categorize ->> MLServer: categorize_transaction(request)
MLServer ->> MLModel: predict_category(description)
MLModel -->> MLServer: category
MLServer -->> POST_Categorize: 200 { category, confidence }
POST_Categorize -->> ImageHook: 200 { category, confidence }
```

---

## CU-05: Visualizar Dashboard Analítico

```mermaid
sequenceDiagram
title CU-05: Visualizar Dashboard Analítico
participant "DashboardPage.jsx" as DashboardPage
participant useMovimientos
participant movimientosService
participant "GET /api/movimientos" as GET_Movimientos
participant "movimientos.controller.js" as MovimientosController
participant "movimientos.service.js" as MovimientosService
participant "movimiento.model.js" as MovimientoModel
participant MongoDB
participant "Graficos.jsx" as Graficos

DashboardPage ->> useMovimientos: initialize
useMovimientos ->> movimientosService: getMovimientos()
movimientosService ->> GET_Movimientos: GET /api/movimientos (Authorization: Bearer token)
GET_Movimientos ->> MovimientosController: listarMovimientos(req.user.id)
MovimientosController ->> MovimientosService: listarMovimientos(userId)
MovimientosService ->> MovimientoModel: find({ userId }).sort(...)
MovimientoModel -->> MongoDB: query
MongoDB -->> MovimientoModel: results
MovimientoModel -->> MovimientosService: movimientos array
MovimientosService -->> MovimientosController: movimientos
MovimientosController -->> GET_Movimientos: 200 { movimientos }
GET_Movimientos -->> movimientosService: 200 { movimientos }
movimientosService -->> useMovimientos: movimientos
useMovimientos -->> DashboardPage: movimientos
DashboardPage ->> Graficos: render charts with movimientos

alt API error / network failure
  GET_Movimientos -->> movimientosService: 500 error
  movimientosService -->> useMovimientos: empty array / throw
  DashboardPage -->> Graficos: show empty state / error message
end
```

---

## CU-06: Inhabilitar Movimiento (Borrado Lógico)

```mermaid
sequenceDiagram
title CU-06: Inhabilitar Movimiento (Borrado Lógico)
participant ReportesPage
participant movimientosService
participant "PATCH /api/movimientos/:id/inhabilitar" as PATCH_Inhabilitar
participant "backend/middlewares/auth.js" as AuthMiddleware
participant "movimientos.controller.js" as MovimientosController
participant "movimientos.service.js" as MovimientosService
participant "movimiento.model.js" as MovimientoModel
participant MongoDB

ReportesPage ->> movimientosService: inhabilitarMovimiento(id)
movimientosService ->> PATCH_Inhabilitar: PATCH /api/movimientos/:id/inhabilitar (Authorization: Bearer token)
PATCH_Inhabilitar ->> AuthMiddleware: validate JWT
AuthMiddleware -->> PATCH_Inhabilitar: req.user
PATCH_Inhabilitar ->> MovimientosController: inhabilitarMovimiento(req.params.id)
MovimientosController ->> MovimientosService: inhabilitarMovimiento(id)
MovimientosService ->> MovimientoModel: findByIdAndUpdate(id, { estado: 'inactivo' }, { new: true })
MovimientoModel -->> MongoDB: update
MongoDB -->> MovimientoModel: updated document
MovimientoModel -->> MovimientosService: updated movimiento
MovimientosService -->> MovimientosController: movimiento
MovimientosController -->> PATCH_Inhabilitar: 200 { movimiento }
PATCH_Inhabilitar -->> movimientosService: 200 { movimiento }
movimientosService -->> ReportesPage: updated movimiento

alt Movimiento not found
  MovimientosService -->> MovimientosController: throw Error("Movimiento no encontrado")
  MovimientosController -->> PATCH_Inhabilitar: 400 { error }
  PATCH_Inhabilitar -->> movimientosService: 400 { error }
  movimientosService -->> ReportesPage: shows error
end

alt Unauthorized
  AuthMiddleware -->> PATCH_Inhabilitar: 401 { error }
  PATCH_Inhabilitar -->> movimientosService: 401 { error }
  movimientosService -->> ReportesPage: shows auth error
end
```

---

## CU-07: Filtrar y Analizar Reportes

```mermaid
sequenceDiagram
title CU-07: Filtrar y Analizar Reportes
participant "ReportesPage.jsx" as ReportesPage
participant getMovimientos
participant movimientosService
participant "GET /api/movimientos" as GET_Movimientos
participant "movimientos.controller.js" as MovimientosController
participant "movimientos.service.js" as MovimientosService
participant "movimiento.model.js" as MovimientoModel
participant MongoDB
participant "Graficos.jsx" as Graficos

ReportesPage ->> getMovimientos: request on mount
getMovimientos ->> movimientosService: getMovimientos()
movimientosService ->> GET_Movimientos: GET /api/movimientos (Authorization: Bearer token)
GET_Movimientos ->> MovimientosController: listarMovimientos(req.user.id)
MovimientosController ->> MovimientosService: listarMovimientos(userId)
MovimientosService ->> MovimientoModel: find({ userId }).sort(...)
MovimientoModel -->> MongoDB: query
MongoDB -->> MovimientoModel: results
MovimientoModel -->> MovimientosService: movimientos array
MovimientosService -->> MovimientosController: movimientos
MovimientosController -->> GET_Movimientos: 200 { movimientos }
GET_Movimientos -->> movimientosService: 200 { movimientos }
movimientosService -->> getMovimientos: movimientos
getMovimientos -->> ReportesPage: movimientos

Note over ReportesPage: Filtering is client-side only (filters by mes/categoria and estado)
ReportesPage ->> Graficos: compute aggregates and render charts

alt API error
  GET_Movimientos -->> movimientosService: 500 { error }
  movimientosService -->> getMovimientos: throws / returns []
  ReportesPage ->> Graficos: show error or empty state
end
```

---

## CU-08: Reentrenar Clasificador IA

```mermaid
sequenceDiagram
title CU-08: Reentrenar Clasificador IA
participant "train_model.py" as TrainScript
participant "POST /retrain" as POST_Retrain
participant "ml_backend/main.py" as MLServer
participant "modelo_clasificador.pkl" as MLModel
participant "joblib" as Joblib
participant "pandas" as Pandas

Note over POST_Retrain,MLServer: /retrain accepts JSON { data: [ { descripcion,categoria }, ... ] }
TrainScript ->> POST_Retrain: POST /retrain { data: [...] }
POST_Retrain ->> MLServer: retrain_model(payload)
Note over MLServer: Converts payload -> pd.DataFrame; fits TF-IDF + MultinomialNB pipeline
MLServer ->> Pandas: pd.DataFrame(...)
MLServer ->> MLServer: make_pipeline(...) and new_model.fit(...)
MLServer ->> Joblib: joblib.dump(new_model, modelo_clasificador.pkl)
Joblib -->> MLServer: file written
MLServer -->> POST_Retrain: 200 { status: "success", message }
POST_Retrain -->> TrainScript: 200 { status, message }

Note right of MLServer: /retrain is synchronous/blocking (training happens during request)

alt Training error (e.g., bad data)
  MLServer -->> POST_Retrain: 500 { detail: "Error al reentrenar: ..." }
  POST_Retrain -->> TrainScript: 500 error
end
```

---

## CU-09: Cerrar Sesión (Logout)

```mermaid
sequenceDiagram
title CU-09: Cerrar Sesión (Logout)
participant "LogoutButton.jsx" as LogoutButton
participant authService
participant "localStorage" as LocalStorage
participant "ProtectedRoute.jsx" as ProtectedRoute

LogoutButton ->> authService: logout()
authService ->> LocalStorage: removeItem('token')
authService -->> LogoutButton: notifyAuthChange()
LogoutButton ->> ProtectedRoute: UI navigates to /login (or triggers re-render)
ProtectedRoute ->> ProtectedRoute: detect missing token -> redirect to LoginPage

Note right of authService: No backend invalidation endpoint exists (logout is client-only)

alt If token was stored also in SDK
  authService ->> "frontend/src/sdk/index.js": sdk.removeToken()
  "frontend/src/sdk/index.js" -->> authService: token removed
end
```

---

## CU-10: Recuperar/Restablecer Contraseña

```mermaid
sequenceDiagram
title CU-10: Recuperar/Restablecer Contraseña
participant "ForgotPasswordPage.jsx" as ForgotPasswordPage
participant "ResetPasswordPage.jsx" as ResetPasswordPage
participant "POST /api/usuarios/forgot-password" as POST_Forgot
participant "POST /api/usuarios/verify-reset-token" as POST_Verify
participant "POST /api/usuarios/reset-password" as POST_Reset
participant "usuarios.controller.js" as UsuariosController
participant "usuarios.service.js" as UsuariosService
participant "usuario.model.js" as UsuarioModel
participant MongoDB

ForgotPasswordPage ->> POST_Forgot: POST /api/usuarios/forgot-password { email }
POST_Forgot ->> UsuariosController: forgotPassword(req.body)
UsuariosController ->> UsuariosService: forgotPassword(email)
UsuariosService ->> UsuarioModel: findOne({ email })
UsuarioModel -->> MongoDB: query
MongoDB -->> UsuarioModel: usuario
UsuariosService ->> UsuarioModel: set resetPasswordToken, resetPasswordExpires (Date.now + 10min) and save()
UsuarioModel -->> MongoDB: update
MongoDB -->> UsuarioModel: saved
UsuariosService ->> UsuariosController: { message: 'Email enviado' }
UsuariosController -->> POST_Forgot: 200 { message }
POST_Forgot -->> ForgotPasswordPage: 200 success

Note over UsuarioModel: Token TTL stored as resetPasswordExpires (~10 minutes)

ResetPasswordPage ->> POST_Verify: POST /api/usuarios/verify-reset-token { token }
POST_Verify ->> UsuariosController: verifyResetToken(req.body)
UsuariosController ->> UsuariosService: verifyResetToken(token)
UsuariosService ->> UsuarioModel: findOne({ resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } })
UsuarioModel -->> MongoDB: query
MongoDB -->> UsuarioModel: usuario or null
alt Token valid
  UsuarioModel -->> UsuariosService: usuario
  UsuariosService -->> UsuariosController: { message: 'Token válido' }
  UsuariosController -->> POST_Verify: 200 { message }
  POST_Verify -->> ResetPasswordPage: 200 OK
else Token invalid/expired
  UsuariosService -->> UsuariosController: throw Error('Token inválido o expirado')
  UsuariosController -->> POST_Verify: 400 { message }
  POST_Verify -->> ResetPasswordPage: 400 { message }
end

ResetPasswordPage ->> POST_Reset: POST /api/usuarios/reset-password { token, newPassword }
POST_Reset ->> UsuariosController: resetPassword(req.body)
UsuariosController ->> UsuariosService: resetPassword(token,newPassword)
UsuariosService ->> UsuarioModel: findOne({ resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } })
UsuarioModel -->> MongoDB: query
alt Token valid
  UsuarioModel -->> UsuariosService: usuario
  UsuariosService ->> UsuarioModel: update passwordHash, clear reset token fields, save()
  UsuarioModel -->> MongoDB: update
  MongoDB -->> UsuarioModel: saved
  UsuariosService -->> UsuariosController: { message: 'Contraseña actualizada exitosamente' }
  UsuariosController -->> POST_Reset: 200 { message }
  POST_Reset -->> ResetPasswordPage: 200 { message }
else Token invalid/expired
  UsuariosService -->> UsuariosController: throw Error('Token inválido o expirado')
  UsuariosController -->> POST_Reset: 400 { message }
  POST_Reset -->> ResetPasswordPage: 400 { message }
end
```

---

## CU-11: Consultar/Editar Perfil

```mermaid
sequenceDiagram
title CU-11: Consultar/Editar Perfil
participant "ProfilePage.jsx" as ProfilePage
participant userService
participant "GET /api/usuarios/me" as GET_Me
participant "PUT /api/usuarios/me" as PUT_Me
participant "usuarios.controller.js" as UsuariosController
participant "usuarios.service.js" as UsuariosService
participant "usuario.model.js" as UsuarioModel
participant MongoDB
participant "backend/middlewares/auth.js" as AuthMiddleware

ProfilePage ->> userService: getProfile()
userService ->> GET_Me: GET /api/usuarios/me (Authorization: Bearer token)
GET_Me ->> AuthMiddleware: validate JWT
AuthMiddleware -->> GET_Me: req.user
GET_Me ->> UsuariosController: getProfile(req.user)
UsuariosController ->> UsuariosService: obtenerUsuarioPorId(req.user.id)
UsuariosService ->> UsuarioModel: findById(id)
UsuarioModel -->> MongoDB: query
MongoDB -->> UsuarioModel: usuario
UsuarioModel -->> UsuariosService: usuario
UsuariosService -->> UsuariosController: usuario summary
UsuariosController -->> GET_Me: 200 { usuario }
GET_Me -->> userService: 200 { usuario }
userService -->> ProfilePage: usuario (render)

ProfilePage ->> userService: updateProfile({ nombre,email })
userService ->> PUT_Me: PUT /api/usuarios/me (Authorization: Bearer token) { data }
PUT_Me ->> AuthMiddleware: validate JWT
AuthMiddleware -->> PUT_Me: req.user
PUT_Me ->> UsuariosController: updateProfile(req.body)
UsuariosController ->> UsuariosService: editarUsuario(req.user.id, data)
UsuariosService ->> UsuarioModel: findByIdAndUpdate(id, data, { new: true })
UsuarioModel -->> MongoDB: update
MongoDB -->> UsuarioModel: updated document
UsuarioModel -->> UsuariosService: updated usuario
UsuariosService -->> UsuariosController: updated summary
UsuariosController -->> PUT_Me: 200 { usuario }
PUT_Me -->> userService: 200 { usuario }
userService -->> ProfilePage: updated usuario

alt Unauthorized / invalid token
  AuthMiddleware -->> GET_Me: 401 { error } / PUT_Me: 401
  GET_Me/PUT_Me -->> userService: 401 error
  userService -->> ProfilePage: shows auth error
end
```

---

## CU-12: Visualizar Auditoría (Logs)

```mermaid
sequenceDiagram
title CU-12: Visualizar Auditoría (Logs)
actor Administrator
participant "GET /api/logs" as GET_Logs
participant "logs.controller.js" as LogsController
participant "logs.service.js" as LogsService
participant "log.model.js" as LogModel
participant MongoDB

Administrator ->> GET_Logs: GET /api/logs (Authorization: Bearer token)
GET_Logs ->> LogsController: listarLogs(req)
LogsController ->> LogsService: listarLogs()
LogsService ->> LogModel: find()
LogModel -->> MongoDB: query
MongoDB -->> LogModel: logs array
LogModel -->> LogsService: logs
LogsService -->> LogsController: logs
LogsController -->> GET_Logs: 200 { logs }
GET_Logs -->> Administrator: 200 { logs }

alt No logs found
  LogsService -->> LogsController: returns []
  LogsController -->> GET_Logs: 200 { [] }
  GET_Logs -->> Administrator: empty list
end

alt Unauthorized
  GET_Logs -->> LogsController: 401 { error } (middleware)
  GET_Logs -->> Administrator: 401 { error }
end
```

---

**Notas Generales:**

- Todos los diagramas incluyen los nombres reales de archivos del repositorio
- Las rutas de API reflejan los endpoints implementados en `backend/routes/`
- Los flujos de error (alt/else) muestran comportamientos excepcionales
- Los participantes corresponden a componentes, servicios y capas arquitectónicas reales
- Las invocaciones usan sintaxis compatible con Mermaid sequenceDiagram
