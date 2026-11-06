/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/app.js
 * Capa / módulo ...: Backend · Arranque
 * Función .........: Crea y configura el servidor: cabeceras de seguridad, CORS, límite de solicitudes, lectura de JSON, conexión con la base de datos, montaje de rutas y manejo central de errores.
 * Calidad (RNF) ...: RNF-02, RNF-03, RNF-04, RNF-06, RNF-14
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-04 Restablecer contraseña
 *                    CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-06 Registrar movimiento manual
 *                    CU-07 Cargar comprobante por imagen
 *                    CU-08 Desactivar movimiento
 *                    CU-09 Visualizar reportes y gráficos
 *                    CU-10 Filtrar historial de movimientos
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-12 Gestionar información de perfil
 *                    CU-13 Cerrar sesión
 *                    CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 *                    CU-17 Marcar y quitar ingreso constante
 *                    CU-18 Eliminar cuenta
 *                    CU-19 Contratar el Plan Pro
 *                    CU-20 Gestionar préstamos y recordatorios
 *                    CU-21 Exportar reportes a Excel y PDF
 *                    CU-22 Administrar la plataforma
 * Depende de ......: backend/database/database.js
 *                    backend/instrument.js
 *                    backend/middlewares/errorHandler.js
 *                    backend/routes/index.js
 * Lo usan .........: backend/integration/flujo-completo.itest.js
 * Pruebas .........: backend/__tests__/admin.unit.test.js
 *                    backend/__tests__/cierres.test.js
 *                    backend/__tests__/e2e.test.js
 *                    backend/__tests__/logs.controller.test.js
 *                    backend/__tests__/movimientos.controller.test.js
 *                    backend/__tests__/movimientos.unit.test.js
 *                    backend/__tests__/pagos.culqi.test.js
 *                    backend/__tests__/pagos.unit.test.js
 *                    backend/__tests__/recuperacion.test.js
 *                    backend/__tests__/rutas.movimientos-cierres.test.js
 *                    backend/__tests__/security.unit.test.js
 *                    backend/__tests__/usuarios.controller.test.js
 *                    backend/__tests__/usuarios.integration.test.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Cargar variables de entorno primero
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

// Inicialización de observabilidad con Sentry (debe ir antes de express)
require('./instrument');
const Sentry = require('@sentry/node');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./database/database');

// Validación estricta de entorno en arranque
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error('FATAL: JWT_SECRET no configurado o es demasiado corto en producción. Abortando arranque.');
}

const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(helmet());
// CORS configurado estrictamente para entornos de desarrollo y dominios oficiales de FinanceFlow
const allowedOrigins = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
}
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN.replace(/\/$/, ''));
}

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (mobile apps, Postman o curl)
    if (!origin) return callback(null, true);

    const isAllowedExact = allowedOrigins.includes(origin);
    // Permitir exclusivamente previews oficiales del proyecto FinanceFlow en Vercel
    const isOfficialPreview = /^https:\/\/(financeflow|sistema-balance)(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);

    if (isAllowedExact || isOfficialPreview) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por CORS: Origen no autorizado'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Configuración de Proxy para Rate Limiting seguro en producción
app.set('trust proxy', 1);

// Middleware de logging con redacción de contraseñas y datos sensibles
app.use((req, res, next) => {
  const safeBody = { ...req.body };
  if (safeBody.password) safeBody.password = '[REDACTED]';
  if (safeBody.newPassword) safeBody.newPassword = '[REDACTED]';
  if (safeBody.currentPassword) safeBody.currentPassword = '[REDACTED]';
  if (safeBody.token) safeBody.token = '[REDACTED]';
  console.log(`${req.method} ${req.path}`, safeBody);
  next();
});

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

const mainRouter = require('./routes');
app.use('/api', mainRouter);

// Endpoint de verificación y prueba de Sentry (solo activo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  app.get('/debug-sentry', (req, res) => {
    throw new Error('FinanceFlow - Primer error de prueba en Sentry!');
  });
}

// Integración de Sentry para captura de errores en rutas de Express
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

// Middleware de manejo de errores (debe ir al final)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en puerto ${PORT}`);
    });
  }
});

module.exports = app;
