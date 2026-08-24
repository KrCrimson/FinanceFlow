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
