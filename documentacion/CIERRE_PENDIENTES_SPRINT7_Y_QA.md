# Cierre de pendientes del Sprint 7 y del Informe de Aseguramiento de Calidad

Fecha: 21-10-2026 · Base: commit `1f0571f` (rama `main`) + cambios de esta entrega (sin commitear al momento de escribir).

Este documento registra qué se resolvió de lo pendiente en el **Plan de Iteración del Sprint 7** y en el **Informe de Aseguramiento de Calidad** (hallazgos D-01 a D-08), con la evidencia de cómo verificarlo.

## 1. Pendientes del Plan de Iteración — Sprint 7

| ID | Pendiente | Estado | Evidencia |
|----|-----------|--------|-----------|
| A1 | Automatizar CP-38 y CP-39 (Planificador) | Hecho | `frontend/src/__tests__/PlanificadorCompras.test.jsx` (14 pruebas) |
| A2 | Automatizar CP-40 y CP-41 (Perfil) | Ya existían; reforzado | `backend/__tests__/usuarios.controller.test.js` + prueba de integración "actualiza el perfil y el cambio persiste" |
| A3 | Página independiente `/planificador` | Ya existía | `frontend/src/App.jsx` (ruta protegida con `ProtectedRoute`) |
| A4 | Eliminación real de cuenta | Ya existía (borrado lógico); ahora con pruebas | `usuarios.service.test.js` e `integration/flujo-completo.itest.js` ("tras eliminar la cuenta no se puede iniciar sesión") |
| A5 | URLs de producción reales | Hecho | `DEPLOY_FRONTEND.md` y `DEPLOY_BACKEND.md` |

Notas importantes:

- **CP-38 y CP-39 describen un comportamiento que ya no existe.** Hablan de "meses estimados" y "ahorro mensual 0 o negativo", pero el planificador actual es una "carrera de metas" contra el balance disponible (porcentaje de avance, meta alcanzada). Las pruebas cubren el comportamiento actual (balance cero o negativo => 0 %, sin meta alcanzada). Falta reescribir el texto de CP-38/CP-39 en el catálogo de casos de prueba.
- **Las URLs de plantilla apuntaban a otro servicio.** `https://financeflow-backend.onrender.com` lo atiende un servidor distinto (cabecera `x-render-origin-server: gunicorn`, no es Node). El backend real, tomado del bundle del frontend desplegado, es `https://financeflow-backend-4fbw.onrender.com` (responde 401 `Token no proporcionado` en `/api/movimientos`). El servicio ML es `https://financeflow-ml.onrender.com` (uvicorn).

## 2. Hallazgos del Informe de QA

| ID | Hallazgo | Estado | Qué se hizo |
|----|----------|--------|-------------|
| D-01 | La suite del SDK no se ejecutaba (ESM) | Cerrado | Babel 7 configurado (`sdk/babel.config.cjs`); la suite corre |
| D-02 | Cobertura insuficiente | Parcial | Backend 43,6 % -> 75,9 % de líneas (cumple 70 %). Frontend 17,9 % -> 28,2 % (no cumple) |
| D-03 | Pruebas "E2E" simuladas, sin BD real | Parcial | 21 pruebas de integración con MongoDB real en memoria. No se agregó E2E con Playwright |
| D-04 | Vulnerabilidades en dependencias | Parcial | Backend: 0 vulnerabilidades en producción (nodemailer 9 -> 10.1.7). Frontend: 115 (hoy) -> 99 con `npm audit fix` sin cambios incompatibles; las restantes vienen de `react-scripts` |
| D-05 | CI no bloquea | Cerrado, con una excepción | Se quitó `|| echo`; `npm audit` de producción del backend bloquea; umbrales de cobertura; el audit del frontend es informativo (ver D-04) |
| D-06 | Documentación con cifras desactualizadas | Parcial | Cifras actualizadas en este documento; el anexo `casos_de_prueba_con_evidencias.md` sigue con las cifras viejas |
| D-07 | Pruebas de frontend superficiales | Parcial | +68 pruebas con lógica real (planificador, servicios, OCR, rutas protegidas, errores, cookies, moneda). Páginas grandes siguen sin probar |
| D-08 | ML y mobile sin CI | ML: no aplica; mobile: pendiente | El microservicio ML se eliminó (ver sección 5). Mobile: sin cambios |

## 3. Cifras (ejecutadas el 21-10-2026)

| Componente | Antes (informe del 10-oct) | Ahora |
|------------|----------------------------|-------|
| Backend (Jest, con mocks) | 29 pruebas, 43,6 % líneas | 170 pruebas, 75,9 % líneas |
| Backend (integración, MongoDB real) | 0 | 21 pruebas |
| Frontend (RTL) | 13 pruebas, 17,9 % líneas | 81 pruebas, 28,2 % líneas |
| SDK | 38 pruebas (1 suite sin ejecutar) | 65 pruebas, 3 de 3 suites |
| **Total automatizado** | 80 | **337** |

Cómo reproducirlo:

```bash
cd backend  && npm run test:ci          # unitarias + cobertura con umbral
cd backend  && npm run test:integration # MongoDB real en memoria
cd frontend && npm run test:ci          # con umbral de cobertura
cd sdk      && npm test
```

## 4. Errores reales encontrados al escribir las pruebas

1. **Cobro de Culqi con el monto elegido por el cliente (corregido).** `POST /api/pagos/crear-cargo-culqi` usaba el `monto` que enviaba el navegador y activaba Pro igual: se podía pagar S/ 0,01. Ahora el precio (S/ 19,90 PEN) lo fija el servidor y el cliente solo envía el token. Hay pruebas unitarias y de integración.
2. **`inhabilitarMovimiento` del adaptador del SDK (corregido).** Con el SDK activo devolvía `undefined` y caía siempre al servicio original, por lo que el SDK nunca se usaba para inhabilitar.
3. **Los 28 tests de `movimientos-adapter.test.js` no probaban nada (reemplazados).** Nunca llamaban al adaptador (solo comprobaban mocks y varios decían "TODO"). Hacer que "corrieran" habría dado 28 aprobados sin valor. Se reemplazaron por 27 pruebas reales.
4. **El respaldo al servicio ML saltaba el límite del plan gratuito (corregido al retirar el servicio).** Cuando Gemini respondía 403 por cuota agotada, el frontend caía al servicio ML, que no tenía límite.
5. **Validación de email en el registro (corregido).** Un email con espacios alrededor se rechazaba como inválido antes de limpiarlo.

## 5. Decisión: OCR solo con la API de Gemini (se retira el servicio ML propio)

El equipo decidió mantener únicamente la API de Gemini, porque entrenar y mantener un modelo propio es pesado y aporta poco. Con eso desaparecen tres problemas de seguridad que tenía el microservicio ML público (`ml_backend`):

1. `verify_api_key` fallaba abierto si `ML_API_KEY` no estaba definida.
2. `/retrain` no exigía autenticación (cualquiera podía envenenar el modelo compartido).
3. El frontend enviaba al servicio ML todos los movimientos del usuario (nombres y categorías) para reentrenar un modelo global.

Cambios hechos:

- Se eliminó la carpeta `ml_backend/` (sigue en el historial de git) y su job de CI.
- `useImageToMovimiento.js`: ya no hay respaldo; si se agota la cuota del plan gratuito se muestra el aviso del servidor.
- `MovimientoFormPage.jsx`: se quitó el reentrenamiento en segundo plano.
- `GEMINI_API_KEY` quedó documentada en `backend/.env.example` y `DEPLOY_BACKEND.md`.
- Pruebas nuevas: `ocr.service.test.js` (8) y `useImageToMovimiento.test.js` (6).

**Acciones que solo puede hacer el equipo:**

- **Dar de baja el servicio `financeflow-ml` en Render.** Seguirá activo y público, con los fallos anteriores, hasta que se elimine o se suspenda desde el panel de Render.
- Revisar que `GEMINI_API_KEY` esté configurada en el backend desplegado.

## 6. Lo que sigue pendiente

- Cobertura del frontend al 70 % (hoy 27,2 %): páginas grandes (Dashboard, Reportes, Recordatorios, Admin, Movimiento) y el SDK duplicado en `frontend/src/sdk`.
- Migrar `react-scripts` (deprecado) a Vite para eliminar las 99 vulnerabilidades transitivas.
- E2E real con Playwright.
- CI para la app móvil.
- Reescribir CP-38/CP-39 y actualizar `casos_de_prueba_con_evidencias.md` con las cifras de la sección 3.
- Quitar el servicio ML de unos 25 documentos y diagramas (SAD, manual técnico, plan de despliegue, diagramas de diseño, informe ejecutivo, guiones de exposición) que aún lo describen.
- Verificar el checkout de Culqi con un dominio autorizado (el botón de pago no abrió en la prueba local).
- Observación menor: el login permite a una cuenta `inactivo` obtener un token que luego el middleware rechaza.
