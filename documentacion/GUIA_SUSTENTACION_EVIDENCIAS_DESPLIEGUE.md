# GUÍA MAESTRA DE SUSTENTACIÓN DE EVIDENCIAS: PLAN DE DESPLIEGUE FINANCEFLOW v1.3.0
**Curso:** Construcción de Software II (Sec. A) | **Docente:** Mag. Ricardo Eduardo Valcárcel Alvarado  
**Institución:** Universidad Privada de Tacna — Escuela Profesional de Ingeniería de Sistemas  
**Equipo Expositor (Grupo 03):**  
* **Sebastian Rodrigo Arce Bracamonte (2019062986)** — Líder de Despliegue & DevOps  
* **Brant Antony Chata Choque (2020067577)** — Infraestructura, Calidad & Seguridad  

---

## 🎯 Estrategia General de Demostración ante el Docente
Para cada punto técnico que el Ingeniero cuestione o pida sustentar:
1. **Afirmación Técnica:** Citar lo expuesto en el documento formal y diapositivas.
2. **Ubicación en el Código:** Abrir el archivo en el editor y resaltar las líneas exactas.
3. **Evidencia Ejecutable en Vivo:** Ejecutar el comando en la terminal y contrastar con la salida esperada.

---

## 📌 EVIDENCIA 1: Topología Multi-Cloud y Enrutamiento SPA Atómico

### 1. ¿Qué se afirmó en el documento?
> *"El frontend se aloja en Vercel Edge Anycast CDN con rewrites atómicos para evitar errores 404 al refrescar rutas de React Router. El backend opera desacoplado en Render bajo arquitectura stateless con sondeo continuo de salud en `/api/health`."*

### 2. Archivos y sección de código:
* **Archivo 1:** `frontend/vercel.json` *(Líneas 1-16)*:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ],
    "routes": [
      { "handle": "filesystem" },
      { "src": "/(.*)", "dest": "/index.html" }
    ]
  }
  ```
  *(Demuestra cómo la red perimetral de Vercel intercepta cualquier ruta y sirve el `index.html` de React sin fallo 404).*

* **Archivo 2:** `backend/app.js` *(Líneas 71-83 y 104)*:
  ```javascript
  // Health Check para orquestadores PaaS (Render / Docker) y Rolling Update
  app.get('/api/health', (req, res) => {
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
      status: 'ok',
      service: 'financeflow-backend',
      version: '1.3.0',
      uptime: Math.floor(process.uptime()),
      database: dbState,
      timestamp: new Date().toISOString()
    });
  });

  const PORT = process.env.PORT || 3000;
  ```

### 3. Comando en vivo y resultado real:
> **Nota importante en PowerShell:** Escribir siempre `curl.exe` (con `.exe`) para invocar el binario real de cURL y no el alias de PowerShell `Invoke-WebRequest`.

Ejecutar en la terminal:
```bash
curl.exe -I https://financeflow-frontend.vercel.app
curl.exe -I https://financeflow-backend-4fbw.onrender.com/api/movimientos
```
**Resultado observable:**
* En Vercel: cabeceras `Server: Vercel`, `HTTP/1.1 200 OK`.
* En Render: cabeceras `Server: cloudflare`, `x-render-origin-server: Render` y `HTTP/1.1 401 Unauthorized` con el cuerpo `{"error":"Token no proporcionado"}` (demuestra que el backend en la nube está en ejecución y bloquea accesos no autenticados).

---

## 📌 EVIDENCIA 2: Seguridad en Tránsito, CORS y Redacción de Secretos

### 1. ¿Qué se afirmó en el documento?
> *"Se aplica el estándar de Defensa en Profundidad (Defense-in-Depth): el pool dinámico `0.0.0.0/0` en MongoDB Atlas se neutraliza con autenticación obligatoria SCRAM-SHA-256 y TLS 1.3. Además, ningún secreto reside en Git, se redactan contraseñas en los logs y se aborta el arranque si el JWT Secret es débil o no alcanza 32 caracteres."*

### 2. Archivos y sección de código:
* **Archivo 1:** `.gitignore`:
  ```gitignore
  .env
  .env.local
  .env.*.local
  ```
* **Archivo 2:** `backend/app.js` *(Líneas 14-16, 21-55 y 60-69)*:
  ```javascript
  // 1. Aborto por secreto débil o ausente en producción:
  if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
    throw new Error('FATAL: JWT_SECRET no configurado o es demasiado corto en producción. Abortando arranque.');
  }

  // 2. Cabeceras HTTP de protección:
  app.use(helmet());

  // 3. CORS con whitelist estricta y regex para previews oficiales de Vercel:
  const isOfficialPreview = /^https:\/\/(financeflow|sistema-balance)(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);

  // 4. Sanitización en tiempo real de logs para evitar fugas de contraseñas:
  app.use((req, res, next) => {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = '[REDACTED]';
    if (safeBody.token) safeBody.token = '[REDACTED]';
    console.log(`${req.method} ${req.path}`, safeBody);
    next();
  });
  ```

### 3. Comando en vivo y resultado real:
Generación de tokens criptográficos de alta entropía para variables de entorno:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Resultado:** Cadena hexadecimal pseudoaleatoria de 64 caracteres (256 bits).

---

## 📌 EVIDENCIA 3: Integridad de Base de Datos y Prevención de Cierres Duplicados

### 1. ¿Qué se afirmó en el documento?
> *"El modelo de datos NoSQL cuenta con 7 colecciones. La colección `cierres` posee un índice compuesto único `{ userId: 1, tipo: 1, periodo: 1 }` que impide físicamente que se registre más de un arqueo de caja chica en el mismo periodo. Las contraseñas se almacenan con bcrypt con factor de costo 10."*

### 2. Archivos y sección de código:
* **Archivo 1:** `backend/database/cierre.model.js` *(Líneas 56-57)*:
  ```javascript
  // Index único para evitar duplicación de cierres
  cierreSchema.index({ userId: 1, tipo: 1, periodo: 1 }, { unique: true });
  ```
* **Archivo 2:** `backend/services/usuarios.service.js` *(Líneas 23 y 50)*:
  ```javascript
  const passwordHash = await bcrypt.hash(data.password, 10);
  // ...
  const ok = await bcrypt.compare(password, usuario.passwordHash);
  ```
* **Archivo 3:** `backend/scripts/change-password.js` *(Líneas 25-27)*:
  ```javascript
  // Procedimiento seguro para cambio o bootstrap de credenciales administrativas
  const passwordHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = passwordHash;
  await user.save();
  ```

---

## 📌 EVIDENCIA 4: Arquitectura de Inteligencia Artificial (Gemini Vision + Timeout de Resiliencia)

### 1. ¿Qué se afirmó en el documento?
> *"El escaneo de tickets y recibos utiliza el modelo multimodal de Google Gemini Vision, parseando directamente los campos financieros en formato JSON y protegiendo al cliente con un temporizador `AbortController` de 20 segundos para evitar peticiones colgadas."*

### 2. Archivos y sección de código:
* **Archivo:** `backend/services/ocr.service.js` *(Líneas 12-50 y 88-92)*:
  ```javascript
  // Timeout de seguridad de 20 segundos
  const TIMEOUT_MS = 20000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // Extracción estructurada de campos contables
  const prompt = `Analiza detenidamente esta imagen de un comprobante de pago...
  Extrae exactamente: {"monto": number, "nombre": string, "categoria": string, "fecha": string, "tipo": string}`;

  // Resiliencia con Promise.race
  jsonText = await Promise.race([fetchWithTimeout(), timeoutPromise]);
  ```

### 3. Comando en vivo y resultado real:
Ejecutar la suite unitaria del servicio OCR:
```bash
cd backend
npx jest __tests__/ocr.service.test.js
```
**Resultado:** `PASS __tests__/ocr.service.test.js` con todas las aserciones aprobadas.

---

## 📌 EVIDENCIA 5: Compuerta Automática de Calidad (`deploy-preflight.js`) y DevSecOps CI/CD

### 1. ¿Qué se afirmó en el documento?
> *"Implementamos un Quality Gate bloqueante (`deploy-preflight.js`) que valida el entorno Node.js, los 5 archivos críticos de configuración, las variables de entorno mandatorias y ejecuta las 19 suites de pruebas unitarias/integración de Jest (170 pruebas) aprobadas al 100% antes de autorizar cualquier pase a producción."*

### 2. Archivos y sección de código:
* **Archivo 1:** `scripts/deploy-preflight.js` *(Líneas 43-125)*:
  - Valida versión de Node >= 18.
  - Comprueba integridad de archivos (`backend/package.json`, `backend/app.js`, `backend/database/database.js`, `frontend/package.json`, `frontend/vercel.json`).
  - Verifica variables obligatorias (`MONGODB_URI`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`).
  - Ejecuta Jest en modo silencioso y en banda: `npm test -- --silent --runInBand`.
  - Si una sola prueba falla, finaliza con código de error 1 (`process.exit(1)`).

* **Archivo 2:** `.github/workflows/ci.yml` *(Líneas 29-45)*:
  ```yaml
  # Auditoría de seguridad bloqueante en dependencias
  - name: 🔍 Security audit (producción, bloqueante)
    run: npm audit --omit=dev --audit-level=high

  # Pruebas con cobertura
  - name: 🧪 Unit tests con cobertura (con mocks)
    run: npm run test:ci

  # Pruebas de integración con base de datos en memoria
  - name: 🗄️ Integration tests (MongoDB en memoria)
    run: npm run test:integration
  ```

### 3. Comando en vivo y resultado real:
Desde la raíz del proyecto ejecutar:
```bash
node scripts/deploy-preflight.js
```
**Salida de consola literal generada:**
```text
=====================================================
  FINANCEFLOW v1.3.0 — PRE-FLIGHT DEPLOYMENT CHECK   
=====================================================

1. Verificación de Entorno de Ejecución (Node.js)
  [✓ OK] Node.js versión detectada: v24.18.0 (Cumple requisito >= v18.x)

2. Comprobación de Archivos de Configuración Críticos
  [✓ OK] Archivo crítico verificado: backend/package.json
  [✓ OK] Archivo crítico verificado: backend/app.js
  [✓ OK] Archivo crítico verificado: backend/database/database.js
  [✓ OK] Archivo crítico verificado: frontend/package.json
  [✓ OK] Archivo crítico verificado: frontend/vercel.json

3. Validación de Variables de Entorno de Producción
  [✓ OK] Variable de entorno declarada: MONGODB_URI
  [✓ OK] Variable de entorno declarada: JWT_SECRET
  [✓ OK] Variable de entorno declarada: PORT
  [✓ OK] Variable de entorno declarada: CORS_ORIGIN

4. Ejecución Rápida de Validación de Sintaxis & Pruebas Unitarias
   Ejecutando pruebas de backend (Jest)...
  [✓ OK] Todas las pruebas unitarias y de integración de backend pasaron con éxito (19/19 suites, 170 tests).

-----------------------------------------------------
>>> PRE-FLIGHT EXITOSO: El sistema está LISTO para Despliegue en Producción.
-----------------------------------------------------
```

---

## 📌 EVIDENCIA 6: Protocolo de Rollback (<5 min)

### 1. ¿Qué se afirmó en el documento?
> *"En caso de incidente crítico o NO-GO: Vercel conmuta al despliegue previo en <10 s; Render revierte al commit anterior desde el historial de eventos; y la base de datos se restaura con `mongorestore --gzip --drop` a partir del snapshot previo a la ventana de cambio."*

### 2. Dónde mostrarlo:
* Archivo: `documentacion/Guion_Exposicion_Plan_Despliegue.md` *(Líneas 119-128)*.
* Archivos operativos: `DEPLOY_FRONTEND.md` y `DEPLOY_BACKEND.md`.
* **Comando documentado de reversión de BD:**
  ```bash
  mongorestore --uri="mongodb+srv://..." --archive="backup_pre_deploy_v1.3.0.gz" --gzip --drop
  ```
* **Justificación técnica para el docente:**
  *"La bandera `--drop` garantiza consistencia eliminando colecciones inconsistentes generadas durante la falla, pero por norma contable exige la aprobación formal del Product Owner para no perder transacciones legítimas registradas durante la ventana."*

---

## ⚡ TABLA RESUMEN DE COMANDOS RÁPIDOS

| Objetivo | Comando | Ubicación de Ejecución |
| :--- | :--- | :--- |
| **Pre-vuelo Completo (Quality Gate)** | `node scripts/deploy-preflight.js` | Raíz del proyecto |
| **Pruebas Jest (170 tests / 19 suites)** | `npm test` | Carpeta `backend/` |
| **Frontend en Producción (Vercel)** | `curl.exe -I https://financeflow-frontend.vercel.app` | Cualquier terminal |
| **Backend en Producción (Render)** | `curl.exe -I https://financeflow-backend-4fbw.onrender.com/api/movimientos` | Cualquier terminal |
| **Generación de Secreto Criptográfico** | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Cualquier terminal |

