# Evidencias: documento ↔ código — FinanceFlow (G03)

Verificado el 05-nov-2026 clonando `KrCrimson/FinanceFlow` (rama `main`, commit `1f0571f`) y ejecutando los tests.

## 1. Método para la exposición

Cada afirmación importante del documento lleva un ID (`E-01`, `E-02`…). Para cada ID tienes tres cosas:

1. **Lo que dice el documento** (sección/página).
2. **Dónde está en el código** (`archivo:línea`) o **qué comando lo prueba**.
3. **Captura** (pantalla del código o de la terminal) guardada como `evidencias/E-xx.png`.

En el informe agrega una columna "Evidencia" (E-xx) a cada tabla. En la sustentación, abre el archivo en VS Code o ejecuta el comando, sin mostrar solo diapositivas.

## 2. Matriz de trazabilidad

Estado: ✅ coincide y se comprobó · ⚠️ coincide parcialmente (corregir texto o aclarar) · ❌ no coincide (corregir antes de exponer).

### Informe de QA y Guía de pruebas

| ID | Afirmación del documento | Evidencia en el repo / comando | Estado |
|---|---|---|---|
| E-01 | Backend: 12 suites, 29 pruebas aprobadas | `cd backend && NODE_ENV=test npm test` → *12 passed, 29 passed* (3,6 s) | ✅ |
| E-02 | Frontend: 9 suites, 13 pruebas | `cd frontend && npm run test:ci` → *9 passed, 13 passed* | ✅ |
| E-03 | SDK: 2 suites pasan (38 pruebas) y `movimientos-adapter` falla (D-01) | `cd sdk && npx jest` → *1 failed, 2 passed, 38 passed*; `SyntaxError: Cannot use import statement outside a module` | ✅ |
| E-04 | Pipeline "DevSecOps" en cada push/PR, Node 20, audit + tests | `.github/workflows/ci.yml` | ✅ |
| E-05 | D-05: el pipeline no bloquea por vulnerabilidades | `ci.yml`: `npm audit --audit-level=high \|\| echo "Vulnerabilidades…"` | ✅ |
| E-06 | Rate limiting en login y recuperación | `backend/middlewares/rateLimit.js` (5/15 min y 3/h); usado en `backend/routes/usuarios.js:20,28,30` | ✅ |
| E-07 | Validación Zod de montos | `backend/schemas/movimiento.schema.js:5` (`z.number().positive()`) | ✅ |
| E-08 | Helmet, CORS estricto, `trust proxy` | `backend/app.js:21` (helmet), `:38-44` (CORS), `:58` (trust proxy) | ✅ |
| E-09 | JWT: falla al arrancar si es corto | `backend/app.js:14-15` (exige ≥ 32 caracteres en producción) | ✅ |
| E-10 | Inactivación lógica de movimientos | `backend/services/movimientos.service.js:182` (`estado: 'inactivo'`) | ✅ |
| E-11 | Índice único en cierres | `backend/database/cierre.model.js:57` | ✅ |
| E-12 | Endpoints de desarrollo bloqueados en producción | `backend/routes/pagos.router.js:55,179` (devuelven 403 si `NODE_ENV=production`) | ✅ |
| E-13 | **Guía:** "Ejecuta `npm test` / `npm run test:backend` / `test:sdk` / `audit:backend` desde la raíz" | El `package.json` de la raíz **no tiene `scripts`** (solo `dependencies`) | ❌ |
| E-14 | **Guía:** tiempos 2,4 s (backend) y 2,0 s (frontend) | Tu informe dice 6,4 s y 8,8 s; mi ejecución dio 3,6 s. Dependen de la máquina | ⚠️ |
| E-15 | **Guía:** `npm test` en la raíz → 21 suites, 42 pruebas | Las sumas son correctas (12+9 suites, 29+13 pruebas), pero sin script raíz el comando no se puede ejecutar (ver E-13) | ❌ |
| E-16 | Informe: commit `6a2684d`; ejecución 10-oct | El `main` actual está en `1f0571f` ("expo sabado"). Hay que actualizar el commit citado | ⚠️ |

### Plan de Despliegue, Configuración de Ambientes y guion

| ID | Afirmación del documento | Evidencia en el repo | Estado |
|---|---|---|---|
| E-20 | Imagen Docker del microservicio ML con Tesseract | `ml_backend/Dockerfile` (instala `tesseract-ocr` y `tesseract-ocr-spa`, `uvicorn … $PORT`) | ✅ |
| E-21 | ML expone `/categorize` | `ml_backend/main.py:227` (también `/analyze-receipt`, `/retrain`, `/sync/{bank}`) | ✅ |
| E-22 | Frontend en Vercel con reescritura SPA | `vercel.json` y `frontend/vercel.json` | ✅ |
| E-23 | Variables de entorno del Paso 2 del Plan | El código usa además `ADMIN_EMAILS` y `EMAIL_PASS` (no figuran en el Plan). `backend/.env.example` incluye `RESEND_API_KEY` (no figura en el Plan) y le faltan `GEMINI_API_KEY`, `SENTRY_DSN`, `FRONTEND_URL`, `EMAIL_USER`. En frontend, el `.env.example` solo tiene `REACT_APP_API_URL` y `REACT_APP_CULQI_PUBLIC_KEY`; el Plan agrega `REACT_APP_ML_URL`, `REACT_APP_ENABLE_SDK` y `REACT_APP_SENTRY_DSN` | ⚠️ |
| E-24 | Sentry, Gemini, Brevo, Culqi integrados | `backend/instrument.js`, `backend/services/ocr.service.js`, `backend/services/usuarios.service.js`, `backend/routes/pagos.router.js:102-173` | ✅ |
| E-25 | **Health check `/api/health`** que Render consulta para el Rolling Update (guion, diap. 2) | **No existe** ningún endpoint de salud en `backend/` (solo `plan_de_riesgos.md` menciona `/health` como idea) | ❌ |
| E-26 | **`node scripts/deploy-preflight.js`** (Fase 3 del plan) | **No existe**. `backend/scripts/` solo tiene `aprobar-pago.js` y `change-password.js` | ❌ |
| E-27 | **Etiqueta `v1.3.0` / `v1.4.0` "inmutable"** en GitHub | `git ls-remote --tags` devuelve **0 tags**. Además `package.json` de backend/frontend/sdk dicen `1.0.0` | ❌ |
| E-28 | **Pasarelas: solo Culqi** (Config y Plan) | El código solo implementa Culqi. Pero `README.md` y `AUDITORIA_SEGURIDAD.md` hablan de Stripe, MercadoPago y Flow (webhooks en `pagos.router.js:379`, archivo que hoy tiene 250 líneas) | ❌ |
| E-29 | **Guion:** "si Gemini falla, el *backend* conmuta al motor Docker" | La conmutación existe pero está en el **frontend**: `frontend/src/hooks/useImageToMovimiento.js:54-55` llama a `/analyze-receipt` del ML si falla el backend. El backend solo usa Gemini (SDK y luego HTTP directo a Gemini) | ⚠️ |
| E-30 | Índices compuestos únicos en MongoDB | Solo hay uno: `cierre.model.js:57`. Decir "índices compuestos únicos" en plural exagera | ⚠️ |
| E-31 | Atlas M10 Multi-AZ, cifrado AES-256, TLS 1.3, backups 3-2-1, RTO/RPO | No se ve en código. Es infraestructura: necesita capturas de la consola de Atlas/Render/Vercel | ⚠️ |
| E-32 | Microservicio ML "seguro" | `ml_backend/main.py`: `allow_origins=["*"]` con credenciales, y ruta de Tesseract fija de Windows (`C:\Program Files\…`). En Docker/Linux esa línea sobra | ⚠️ |

### Otros datos inconsistentes entre documentos

- **Código de Sebastian Arce:** aparece como `2019062786` (Informe QA, Guía), `2019062986` (Plan, Guion) y `2019062886` (Config de Ambientes). Unifica en todos.
- **Matriz de trazabilidad (`documentacion/anexos/matriz_de_trazabilidad.md`):** todos los enlaces apuntan a `file:///c:/Users/windows11/…/Sistema de balance/…`. Ya no funcionan; cámbialos por rutas relativas (`../../frontend/src/pages/…`).
- **Versión:** Config de Ambientes dice v1.4.0; Plan de Despliegue y Guion dicen v1.3.0.

## 3. Qué corregir antes de exponer (en orden de impacto)

1. **E-25 y E-26 (health y preflight):** o los implementas (son pequeños) o quitas la afirmación. Un `GET /api/health` que responda 200 si Mongo está conectado son ~10 líneas en `backend/app.js`. El script `deploy-preflight.js` puede verificar la versión de Node, las variables requeridas y correr `npm test`.
2. **E-27 (tags):** crea los tags (`git tag -a v1.3.0 -m "…" && git push origin v1.3.0`) y alinea la versión de los `package.json`. Si el documento dice "línea base", el ingeniero puede pedir ver el tag.
3. **E-28 (pasarelas):** decide la verdad. Si ahora solo es Culqi, actualiza `README.md` y `AUDITORIA_SEGURIDAD.md` (o márcalos como "histórico"). Si siguen vigentes Stripe/MercadoPago/Flow, el código no los tiene.
4. **E-13 y E-15 (scripts raíz):** agrega a `package.json` de la raíz: `"test:backend": "npm --prefix backend test"`, `"test:frontend": "npm --prefix frontend run test:ci"`, `"test:sdk": "npm --prefix sdk test -- tests/sdk.test.js tests/sdk-integration.test.js"`, `"test": "npm run test:backend && npm run test:frontend"`, y los `audit:*`. O cambia la guía para que use `npm --prefix …`.
5. **E-29, E-30, E-32:** corrige el texto (ver arriba), no el código.
6. Actualiza el commit citado (E-16), los tiempos (E-14) y los códigos de estudiante.

## 4. Capturas a preparar (carpeta `evidencias/`)

| Captura | Cómo obtenerla |
|---|---|
| E-01 | Terminal: `NODE_ENV=test npm test` en `backend/` |
| E-02 | Terminal: `npm run test:ci` en `frontend/` |
| E-03 | Terminal: `npx jest` en `sdk/` (muestra el D-01 real) |
| Cobertura | `npm test -- --coverage` en `backend/` y en `frontend/` (`-- --watchAll=false --coverage`) |
| E-04 / E-05 | GitHub → pestaña **Actions** con la última ejecución verde, y `ci.yml` |
| E-25 | `curl https://<tu-backend>.onrender.com/api/health` (una vez implementado) |
| E-27 | GitHub → **Releases/Tags** mostrando `v1.3.0` / `v1.4.0` |
| E-31 | Consola de Atlas (clúster, usuario `financeflow_app`, Network Access), Render (servicio + variables sin mostrar valores), Vercel (deploy) |
| Código | Para cada E-xx de la tabla, captura del archivo en la línea indicada |

Importante: nunca captures valores de `.env`, claves de Culqi/Gemini ni la URI de Mongo. Tapa los secretos.

## 5. Orden sugerido para la demo (5 minutos)

1. Abrir el documento en la tabla de resultados → ejecutar `npm test` en vivo (E-01, E-02).
2. Mostrar el defecto D-01 en el SDK (E-03) y decir que ya está registrado en el Gantt (S3).
3. Abrir `ci.yml` y la pestaña Actions (E-04, E-05).
4. Elegir 2–3 controles de seguridad del informe y abrir su línea de código (E-06, E-07, E-09).
5. Si te piden el despliegue: abrir `/api/health` en el navegador y el tag en GitHub (E-25, E-27).

## 6. Preguntas que puede hacer el ingeniero (respuestas honestas)

- **"¿Dónde está el health check del que hablan?"** → Solo responde bien si lo implementaste (punto 1 de la sección 3).
- **"¿Por qué el README habla de Stripe y su código solo tiene Culqi?"** → Corrige el README antes.
- **"Muéstreme el tag v1.3.0."** → Necesitas haberlo creado.
- **"¿Por qué el pipeline no falla con vulnerabilidades?"** → Ya está declarado como D-05; muestra la solución del Gantt.
