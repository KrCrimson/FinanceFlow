# Diagramas de Secuencia (Vista de Diseño) — FinanceFlow

Diagramas técnicos con **nombres reales de archivos, rutas HTTP y módulos** del código fuente actual.

---

## 1. Autenticación de Usuario (Login)

```mermaid
sequenceDiagram
    actor Usuario
    participant UI as frontend/src/pages/LoginPage.jsx
    participant Adapter as frontend/src/services/auth-adapter.js
    participant Route as backend/routes/usuarios.js
    participant Ctrl as backend/controllers/usuarios.controller.js
    participant Svc as backend/services/usuarios.service.js
    participant DB as MongoDB (usuarios)

    Usuario->>UI: Ingresa credenciales y envía
    UI->>Adapter: login(email, password)
    Adapter->>Route: POST /api/usuarios/login
    Route->>Route: loginLimiter (rate limit) + validate(loginSchema)
    Route->>Ctrl: login(req, res)
    Ctrl->>Svc: usuariosService.login(email, password)
    Svc->>DB: Usuario.findOne({ email })
    DB-->>Svc: documento Usuario (con passwordHash)
    Svc->>Svc: bcrypt.compare(password, passwordHash)
    Svc-->>Ctrl: objeto usuario (sin passwordHash)
    Ctrl->>Ctrl: jwt.sign({id, email, nombre}, JWT_SECRET, {expiresIn:"7d"})
    Ctrl-->>Route: HTTP 200 { token, usuario }
    Route-->>Adapter: respuesta JSON
    Adapter->>Adapter: localStorage.setItem("token", token)
    Adapter-->>UI: éxito
    UI-->>Usuario: redirige a /dashboard
```

---

## 2. Visualización del Dashboard

```mermaid
sequenceDiagram
    actor Usuario
    participant UI as frontend/src/pages/DashboardPage.jsx
    participant Hook as frontend/src/hooks/useAnalisisGastos.js
    participant Adapter as frontend/src/services/movimientos-adapter.js
    participant Ctrl as backend/controllers/movimientos.controller.js
    participant Mid as backend/middlewares/auth.js
    participant DB as MongoDB (movimientos)

    Usuario->>UI: Ingresa al Dashboard
    UI->>Hook: useEffect() inicial
    Hook->>Adapter: getMovimientos()
    Adapter->>Mid: GET /api/movimientos (Authorization: Bearer token)
    Mid->>Mid: jwt.verify(token) → req.user
    Mid->>Ctrl: listarMovimientos(req, res)
    Ctrl->>DB: Movimiento.find({ userId: req.user.id })
    DB-->>Ctrl: array de movimientos
    Ctrl-->>Adapter: HTTP 200 { movimientos }
    Adapter-->>Hook: lista de movimientos
    Hook->>Hook: calcula ingresos, egresos, balance y alertas
    Hook-->>UI: resumenMensual, estadisticasPorCategoria
    UI->>UI: renderiza Graficos.jsx
    UI-->>Usuario: Dashboard actualizado
```

---

## 3. Realizar Cierre Mensual

```mermaid
sequenceDiagram
    actor Usuario
    participant Modal as frontend/src/components/CajaChicaModal.jsx
    participant Adapter as frontend/src/services (cierres)
    participant Route as backend/routes/cierres.js
    participant Ctrl as backend/controllers/cierres.controller.js
    participant Svc as backend/services/cierres.service.js
    participant DBUsr as MongoDB (usuarios)
    participant DBCie as MongoDB (cierres)

    Usuario->>Modal: Ingresa saldo físico y contraseña
    Modal->>Adapter: crearCierre({ tipo: "mensual", saldoFisico, password })
    Adapter->>Route: POST /api/cierres (auth)
    Route->>Ctrl: crearCierre(req, res)
    Ctrl->>Svc: cierresController → cierresService.crearCierre(...)
    Svc->>DBUsr: Usuario.findById(userId) + bcrypt.compare(password, passwordHash)
    DBUsr-->>Svc: contraseña válida
    Svc->>DBCie: agregación de Movimiento (ingresos/egresos del periodo)
    DBCie-->>Svc: ingresosTotales, egresosTotales
    Svc->>Svc: diferencia = saldoFisico - saldoEsperado
    Svc->>DBCie: Cierre.create({...}) — índice único {userId, tipo, periodo}
    DBCie-->>Svc: documento Cierre creado
    Svc-->>Ctrl: cierre creado
    Ctrl-->>Adapter: HTTP 201 Created
    Adapter-->>Modal: éxito
    Modal-->>Usuario: Cierre confirmado, periodo bloqueado
```

---

## 4. Suscripción al Plan Pro con Culqi

```mermaid
sequenceDiagram
    actor Usuario
    participant Modal as frontend/src/components/PaywallModal.jsx
    participant CulqiJS as checkout.culqi.com/js/v4 (script externo)
    participant Adapter as frontend/src/services/pagosService.js
    participant Route as backend/routes/pagos.router.js
    participant CulqiAPI as api.culqi.com/v2/charges
    participant DB as MongoDB (usuarios, pagos)

    Usuario->>Modal: Click "Pagar S/ 19.90 con Culqi"
    Modal->>CulqiJS: window.Culqi.open() con publicKey
    Usuario->>CulqiJS: Ingresa datos de tarjeta dentro del iframe de Culqi
    CulqiJS-->>Modal: window.culqi() callback con Culqi.token.id
    Modal->>Adapter: crearCargoCulqi(tokenId, 19.90, "PEN")
    Adapter->>Route: POST /api/pagos/crear-cargo-culqi (auth)
    Route->>Route: Usuario.findById(req.user.id)
    Route->>CulqiAPI: POST /v2/charges { amount: 1990, source_id: tokenId }
    CulqiAPI-->>Route: { id, outcome: "venta_exitosa" } o error
    alt Cargo aprobado
        Route->>DB: actualiza Usuario.esPremium = true y Usuario.planTipo = "pro"
        Route->>DB: Pago.create({ metodo: "culqi", estado: "aprobado" })
        Route-->>Adapter: HTTP 200 { success: true, esPremium: true }
        Adapter-->>Modal: éxito
        Modal-->>Usuario: "¡Cuenta Pro Activada!"
    else Cargo rechazado
        Route-->>Adapter: HTTP 402 { error: motivo }
        Adapter-->>Modal: excepción
        Modal-->>Usuario: mensaje de error de Culqi
    end
```
