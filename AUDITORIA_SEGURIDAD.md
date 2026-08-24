# Auditoría de Seguridad — Sistema de Balance (Backend)

**Fecha:** 2026-08-23
**Alcance:** `backend/` — foco en el diff pendiente (`movimientos.controller.js`, `movimientos.service.js`, `pagos.router.js`, `usuarios.js`, `isAdmin.js`, `rateLimit.js`) + archivos referenciados críticos (`auth.js`, `app.js`, `usuarios.controller.js`).
**Metodología:** Source-to-Sink manual + `npm audit` + búsqueda estática dirigida (ripgrep).

## Resumen ejecutivo
 
| # | Hallazgo | Severidad | CVSS 3.1 | Estado |
|---|---|---|---|---|
| 1 | Secreto JWT hardcodeado como fallback (`'supersecreto'`) | 🔴 Crítico | 9.8 | ✅ **RESUELTO** (Fallback eliminado + guard estricto en arranque) |
| 2 | IDOR sin autenticación en `GET /pagos/estado-plan/:email` | 🔴 Crítico | 7.5 | ✅ **RESUELTO** (Protegido con `auth` + `req.user.id`, ruta redundante eliminada) |
| 3 | Verificación de firma de webhook MercadoPago condicional (fail-open) | 🔴 Crítico | 8.1 | ✅ **RESUELTO** (Fail-Closed estricto 503/401 + validación segura) |
| 4 | Endpoints de pagos con fallback global peligroso `findOne().sort()` | 🟠 Alto | 8.6 | ✅ **RESUELTO** (Eliminados todos los fallbacks a usuarios aleatorios) |
| 5 | Datos sensibles (contraseñas, tokens) logueados en texto plano | 🟠 Alto | 7.5 | ✅ **RESUELTO** (Sanitizado con redacción `[REDACTED]`) |
| 6 | CORS confía en cualquier `*.vercel.app` / `*.github.io` con `credentials:true` | 🟡 Medio | 6.5 | ✅ **RESUELTO** (Allowlist estricta de dominios oficiales de FinanceFlow) |
| 7 | `express-rate-limit` sin `trust proxy` configurado | 🟡 Medio | 5.3 | ✅ **RESUELTO** (`app.set('trust proxy', 1)` configurado) |
| 8 | `/usuarios/test-email-config` sin auth ni guard de entorno | 🟡 Medio | 5.3 | ✅ **RESUELTO** (Protegido con `auth` + `isAdmin`) |
| 9 | Condición de carrera en cuota OCR (`analizarComprobante`) | 🟡 Medio | 4.3 | ✅ **RESUELTO** (Reserva y conteo atómico con `findOneAndUpdate`) |
| 10 | `nodemailer` con 8 CVEs (SMTP/CRLF injection, SSRF) | 🟡 Medio | 5.9 | ✅ **RESUELTO** (`nodemailer` actualizado a última versión, 0 vulnerabilidades) |
| 11 | Mensajes de error verbosos de Mongoose expuestos al cliente | 🟢 Bajo | 3.1 | ✅ **RESUELTO** (Middleware de errores normalizado y sanitizado) |
| 12 | Lista de admins hardcodeada en código, incluye email "demo" | 🟢 Bajo (higiene) | — | ✅ **RESUELTO** (Migrado a campo `rol: 'admin'` en BD + `ADMIN_EMAILS`) |

---

## 1. 🔴 CRÍTICO — Secreto JWT con fallback hardcodeado

**Ubicación:** [backend/middlewares/auth.js:3](backend/middlewares/auth.js#L3), [backend/controllers/usuarios.controller.js:5](backend/controllers/usuarios.controller.js#L5)

**CVSS 3.1:** 9.8 — `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`

```js
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';
```

**Descripción:** Si la variable de entorno `JWT_SECRET` no está definida en el entorno de despliegue (error de configuración fácil de cometer, especialmente en previews de Vercel/Render), el servidor firma y valida tokens con el string público `'supersecreto'` — que además es visible en el propio repositorio y en `__tests__/*`. Cualquier atacante puede forjar un JWT válido con `jwt.sign({id: '<idDeCualquierUsuario>'}, 'supersecreto')`, incluyendo el ID de una cuenta admin, y pasar tanto `auth.js` como `isAdmin.js` (que confía ciegamente en `decoded.id`).

**Impacto:** Suplantación total de cualquier usuario, incluidos administradores → acceso completo a movimientos financieros, pagos y rutas `/admin`.

**Remediación:**
```js
// backend/config/env.js (nuevo, importado antes que cualquier otro módulo)
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET no configurado o demasiado corto. Abortando arranque.');
}
```
```js
// auth.js / usuarios.controller.js
const JWT_SECRET = process.env.JWT_SECRET; // sin fallback
```
No usar el mismo patrón en tests: generar el secreto de test vía `process.env.JWT_SECRET` inyectado en `jest.setup.js`, nunca un literal compartido con producción.

---

## 2. 🔴 CRÍTICO — IDOR sin autenticación: fuga de datos de cualquier usuario por email

**Ubicación:** [backend/routes/pagos.router.js:499-535](backend/routes/pagos.router.js#L499)

**CVSS 3.1:** 7.5 — `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`

```js
router.get("/estado-plan/:email", async (req, res) => {
  const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
  ...
  res.json({ esPremium, planTipo, conteoOcrMes, pagoPendiente: {...} });
});
```

**Descripción:** `router.use("/pagos", require("./pagos.router"))` en [index.js:14](backend/routes/index.js#L14) se monta **sin** el middleware `auth`. Esta ruta permite a cualquier persona no autenticada, solo conociendo (o adivinando) el email de un usuario, consultar su estado premium, cuántos OCR ha usado ese mes y detalles de su pago pendiente (número de operación, método, fecha). Es enumeración + fuga de PII/datos financieros.

**Impacto:** Reconocimiento de cuentas, fuga de datos personales, permite a un atacante confirmar si un email está registrado y su estado de pago.

**Remediación:**
```js
router.get("/estado-plan", auth, async (req, res) => {
  const usuario = await Usuario.findById(req.user.id); // nunca por email en query param público
  ...
});
```
Requiere `auth` y usar `req.user.id` del token verificado, no un email libre en la URL.

---

## 3. 🔴 CRÍTICO — Verificación de firma del webhook MercadoPago es "fail-open"

**Ubicación:** [backend/routes/pagos.router.js:329-346](backend/routes/pagos.router.js#L329)

**CVSS 3.1:** 8.1 — `AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N`

```js
if (process.env.MERCADO_PAGO_WEBHOOK_SECRET && xSignature) {
  // ... verifica firma
}
// si falta la env var, continúa sin verificar
```

**Descripción:** Si `MERCADO_PAGO_WEBHOOK_SECRET` no está configurada (o el atacante simplemente omite el header `x-signature`), el bloque de verificación se salta por completo y el endpoint procede a activar premium para el `userId` que devuelva la API de MercadoPago para ese `dataId`. El diseño correcto es **fail-closed**: si no se puede verificar la firma, rechazar la petición, no continuar en modo confiado.

**Impacto:** Bajo mala configuración de entorno, el webhook queda abierto a cualquier llamada que referencie un `data.id` de un pago aprobado (incluso de otro comercio/cuenta si el atacante puede predecir o reusar IDs), otorgando Premium sin pago real verificado de forma robusta.

**Remediación:**
```js
router.post("/webhook-mercadopago", async (req, res) => {
  if (!process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
    console.error("MERCADO_PAGO_WEBHOOK_SECRET no configurado — rechazando webhook");
    return res.status(503).send("Webhook no configurado");
  }
  if (!xSignature) return res.status(401).send("Falta firma");
  // ... resto de la verificación, y si expectedSignature !== v1 -> return 401 (ya existe)
```
Aplicar el mismo principio fail-closed a `webhook-flow` (actualmente **no verifica ninguna firma entrante**, ver nota abajo).

> Nota adicional (no numerada aparte, mismo endpoint familiar): `webhook-flow` ([pagos.router.js:379](backend/routes/pagos.router.js#L379)) no valida ninguna firma de la petición entrante — confía en volver a consultar el estado a la API de Flow, lo cual mitiga parcialmente el riesgo, pero sigue sin autenticar el origen de la llamada al webhook. Aceptable solo si Flow no ofrece verificación de firma en el request entrante; confirmar en su documentación.

---

## 4. 🟠 ALTO — Endpoints "solo desarrollo" sin autenticación y con fallback peligroso

**Ubicación:** [backend/routes/pagos.router.js:91-141](backend/routes/pagos.router.js#L91) (`/checkout-directo`), [backend/routes/pagos.router.js:458-496](backend/routes/pagos.router.js#L458) (`/toggle-dev-plan`)

**CVSS 3.1:** 8.6 — `AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N` (condicionado a `NODE_ENV !== 'production'`)

```js
if (process.env.NODE_ENV === 'production') {
  return res.status(403).json(...);
}
...
if (!usuario) {
  usuario = await Usuario.findOne().sort({ actualizadoEn: -1 }); // ← el usuario más reciente de TODA la BD
}
usuario.esPremium = true;
```

**Descripción:** Dos problemas compuestos:
1. La única protección es un `if (NODE_ENV === 'production')` **dentro del handler**, sin middleware de autenticación. Si `NODE_ENV` no está seteado (común en previews/staging de Vercel, contenedores mal configurados, o simplemente se olvida en el `.env` del servidor), estos endpoints quedan expuestos a cualquiera en internet.
2. Si el `email` no coincide con ningún usuario, el código cae a `Usuario.findOne().sort({actualizadoEn:-1})` — es decir, **otorga Premium al usuario que sea el más recientemente actualizado en toda la base de datos**, sin relación con quien hizo la petición.

**Impacto:** Escalación de privilegios (Premium gratis) para un atacante, o para *cualquier* usuario de la base según el fallback, en cualquier entorno donde `NODE_ENV` no esté explícitamente en `'production'`.

**Remediación:**
- Eliminar estos endpoints del router de producción; moverlos a un archivo separado que solo se registre condicionalmente en `app.js`:
```js
// app.js
if (process.env.NODE_ENV === 'development') {
  app.use('/api/pagos/dev', require('./routes/pagos.dev.router'));
}
```
- Eliminar por completo el fallback `Usuario.findOne().sort(...)` — si no hay `email` o no se encuentra, responder 400/404, nunca operar sobre "el último usuario".
- Aun en dev, exigir un `auth` + `isAdmin` para evitar que cualquier proceso en la máquina de desarrollo module esta ruta accidentalmente.

---

## 5. 🟠 ALTO — Datos sensibles logueados en texto plano

**Ubicación:** [backend/app.js:45-48](backend/app.js#L45)

**CVSS 3.1:** 7.5 — `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Descripción:** Este middleware global loguea el `body` completo de **toda** petición, incluyendo `POST /usuarios/login` (contraseña en texto plano), `POST /usuarios/register` (contraseña), `POST /usuarios/reset-password` (nueva contraseña), y datos de pago (`nroOperacion`, montos). En despliegues típicos (Render, Vercel, Railway) estos logs suelen enviarse a un servicio de agregación con retención larga y acceso más amplio que la base de datos misma.

**Impacto:** Cualquier persona con acceso a los logs (operador, integración de terceros, o log leak) obtiene contraseñas de usuarios en texto plano.

**Remediación:**
```js
const REDACT_FIELDS = ['password', 'newPassword', 'currentPassword'];
app.use((req, res, next) => {
  const safeBody = { ...req.body };
  for (const f of REDACT_FIELDS) if (safeBody[f]) safeBody[f] = '[REDACTED]';
  console.log(`${req.method} ${req.path}`, safeBody);
  next();
});
```
Idealmente, eliminar este logging manual y usar `morgan` en modo `combined` sin loguear el body en absoluto, salvo en debug local explícito.

---

## 6. 🟡 MEDIO — CORS confía en cualquier subdominio público de Vercel/GitHub Pages

**Ubicación:** [backend/app.js:29-37](backend/app.js#L29)

**CVSS 3.1:** 6.5 — `AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N`

```js
const isVercel = /\.vercel\.app$/.test(origin);
const isGithubPages = /\.github\.io$/.test(origin);
if (allowedOrigins.includes(origin) || isVercel || isGithubPages) {
  callback(null, true);
}
```
con `credentials: true` en el mismo `corsOptions`.

**Descripción:** `*.vercel.app` y `*.github.io` son dominios que **cualquier persona** puede reclamar gratis (deploy de un proyecto propio). Esta regex efectivamente amplía "orígenes confiables" a cualquier usuario de internet que despliegue una página en esas plataformas, combinado con `credentials: true` (envío de cookies/Authorization en cross-origin).

**Impacto:** Si en algún flujo se usa autenticación basada en cookies (o se planea migrar a ello), un atacante puede alojar una página en `evil.vercel.app` y hacer peticiones autenticadas contra la API a nombre de una víctima que la visite.

**Remediación:** Reemplazar la regex amplia por una allowlist explícita de subdominios propios (ej. `financeflow.vercel.app`, `financeflow-*.vercel.app` solo si son previews del propio proyecto, verificables por variable de entorno de Vercel `VERCEL_GIT_REPO_OWNER`), y evaluar si `credentials: true` es realmente necesario dado que la auth es por Bearer token.

---

## 7. 🟡 MEDIO — `express-rate-limit` sin `trust proxy` configurado

**Ubicación:** [backend/app.js](backend/app.js) (ausente), usado por [backend/middlewares/rateLimit.js](backend/middlewares/rateLimit.js)

**CVSS 3.1:** 5.3 — `AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L`

**Descripción:** No se encontró `app.set('trust proxy', ...)` en `app.js`. En un despliegue detrás de un proxy/load balancer (Render, Railway, Vercel Functions), `req.ip` sin este ajuste refleja la IP del proxy, no la del cliente real. Esto causa una de dos fallas:
- Si el proxy es la única fuente de IP: **todos los usuarios comparten el mismo cupo** de 5 intentos de login/15min (DoS accidental sobre usuarios legítimos).
- Si en algún punto se confía ciegamente en `X-Forwarded-For` sin `trust proxy` correctamente acotado, un atacante puede spoofear ese header para resetear su propio contador y así bypassear el rate limit de fuerza bruta.

**Remediación:**
```js
// app.js, antes de montar rutas
app.set('trust proxy', 1); // 1 hop si hay un único proxy inverso (Render/Vercel)
```
Verificar el número exacto de hops según el proveedor de hosting.

---

## 8. 🟡 MEDIO — Endpoint de diagnóstico de email sin autenticación ni guard de entorno

**Ubicación:** [backend/routes/usuarios.js:25-36](backend/routes/usuarios.js#L25)

**CVSS 3.1:** 5.3 — `AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`

```js
router.get('/test-email-config', (req, res) => {
  res.json({ emailConfigured, environment: process.env.NODE_ENV, frontendUrl: process.env.FRONTEND_URL, ... });
});
```

**Descripción:** A diferencia de los endpoints dev-only de `pagos.router.js` (que al menos intentan un check de `NODE_ENV === 'production'`), esta ruta no tiene ningún guard: está expuesta permanentemente en producción, sin `auth`. Revela `NODE_ENV`, si las credenciales de email están configuradas y la URL del frontend — información de reconocimiento útil para un atacante.

**Remediación:**
```js
if (process.env.NODE_ENV === 'production') {
  router.get('/test-email-config', auth, isAdmin, handler); // requiere admin incluso si se mantiene
} else {
  router.get('/test-email-config', handler);
}
```
O, más simple: eliminar la ruta y mover esta verificación a un script de arranque (`connectDB`/health check interno), nunca a un endpoint HTTP público.

---

## 9. 🟡 MEDIO — Condición de carrera en el límite de escaneos OCR

**Ubicación:** [backend/controllers/movimientos.controller.js:50-94](backend/controllers/movimientos.controller.js#L50)

**CVSS 3.1:** 4.3 — `AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:N/A:L`

**Descripción:** El patrón "leer contador → comparar con `LIMITE_FREE` → procesar → incrementar y guardar" no es atómico. Un usuario gratuito puede disparar múltiples peticiones concurrentes a `analizarComprobante`; todas leerán `conteoOcrMes` con el mismo valor antes de que cualquiera lo incremente, superando el límite de 5 escaneos/mes. Como cada escaneo invoca la API de Gemini (con costo), esto es abuso de recursos, no solo un bug de negocio.

**Remediación:** Usar un incremento atómico condicionado en la propia query:
```js
const usuario = await Usuario.findOneAndUpdate(
  { _id: req.user.id, $or: [{ esPremium: true }, { conteoOcrMes: { $lt: LIMITE_FREE } }] },
  { $inc: { conteoOcrMes: 1 } },
  { new: true }
);
if (!usuario) return res.status(403).json({ error: 'Límite mensual alcanzado', limiteAlcanzado: true });
// procesar OCR después de reservar el cupo; si falla el OCR, opcionalmente $inc: -1 en catch
```

---

## 10. 🟡 MEDIO — Dependencia `nodemailer` con 8 vulnerabilidades conocidas

**Ubicación:** `backend/package.json` (vía `npm audit`)

**CVSS 3.1:** 5.9 (agregado, según la más severa: SMTP/CRLF injection)

**Descripción:** `npm audit --production` reporta `nodemailer <=9.0.0` con 8 advisories, incluyendo inyección de comandos SMTP/CRLF y SSRF vía la opción `raw`. Explotable si algún campo controlado por el usuario (nombre, asunto, cuerpo de un email de notificación) llega sin sanitizar a las opciones de `nodemailer`.

**Remediación:**
```bash
npm audit fix --force
```
Es un cambio breaking (`nodemailer@9.0.5`) — tras actualizar, revisar manualmente el servicio de envío de emails (`forgotPassword`, notificaciones) para confirmar que la API no cambió firma.

---

## 11. 🟢 BAJO — Mensajes de error de Mongoose expuestos directamente al cliente

**Ubicación:** patrón repetido en `movimientos.controller.js`, `usuarios.controller.js` (`res.status(400).json({ error: error.message })`)

**CVSS 3.1:** 3.1 — `AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N`

**Descripción:** Errores de Mongoose (`CastError`, `ValidationError`) contienen nombres de campos, tipos esperados y a veces valores — información interna del esquema que ayuda a un atacante a mapear la estructura de datos. No es una fuga crítica, pero conviene normalizar la salida de errores.

**Remediación:** Middleware centralizado de errores (`errorHandler.js`, ya existe en `app.js:54`) que mapee `error.name === 'CastError' | 'ValidationError'` a un mensaje genérico `"Solicitud inválida"` en producción, logueando el detalle solo server-side.

---

## 12. 🟢 BAJO (higiene) — Lista de administradores hardcodeada, incluye cuenta demo

**Ubicación:** [backend/middlewares/isAdmin.js:20-23](backend/middlewares/isAdmin.js#L20)

**Descripción:** `ADMIN_EMAILS` incluye `'usuario@financeflow.com'` — el mismo email usado como "usuario por defecto" en los fallbacks de `pagos.router.js` (`checkout-directo`, `toggle-dev-plan`). Si esa cuenta demo existe en la base de producción, tiene privilegios de administrador por defecto. Además, otorgar/revocar admin requiere un despliegue de código en vez de un cambio de dato.

**Remediación:** Migrar a un campo `rol: { type: String, enum: ['user','admin'], default: 'user' }` en el modelo `Usuario`, y que `isAdmin.js` verifique `user.rol === 'admin'`. Eliminar `usuario@financeflow.com` de cualquier lista de admins en código.

---

## Notas positivas (lo que ya está bien hecho)

- `movimientos.service.js` — `editarMovimiento` e `inhabilitarMovimiento` **sí** verifican `existingMovimiento.userId.toString() !== userId` antes de mutar — no hay IDOR en el CRUD de movimientos.
- `crearMovimientoHistorico` exige reingreso de contraseña (`bcrypt.compare`) antes de una operación sensible — buen patrón de step-up auth.
- El webhook de Stripe (`webhook-stripe`) verifica la firma correctamente vía `stripe.webhooks.constructEvent` y usa `express.raw()` (necesario para que la verificación de firma funcione) — es el webhook mejor implementado del archivo.
- `helmet()` está activo globalmente en `app.js`.
- `rateLimit.js` aplica límites razonables a login y forgot-password (pendiente solo el fix de `trust proxy` del punto 7).

---

## Próximos pasos sugeridos (orden de prioridad)

1. Eliminar el fallback de `JWT_SECRET` y validar en el arranque (#1).
2. Añadir `auth` al router de `pagos` y corregir `/estado-plan` (#2).
3. Hacer fail-closed la verificación del webhook de MercadoPago (#3).
4. Retirar o aislar los endpoints dev-only de pagos (#4).
5. Redactar campos sensibles del logger global (#5).
6. Resto de hallazgos medios/bajos según ventana de mantenimiento disponible.
