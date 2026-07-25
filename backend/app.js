// Cargar variables de entorno primero
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./database/database');
const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(helmet());
// CORS configurado dinámicamente para soportar desarrollo local y despliegues en Vercel
const corsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (como Postman o curl)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];

    if (process.env.CORS_ORIGIN) {
      allowedOrigins.push(process.env.CORS_ORIGIN);
    }

    // Permitir cualquier subdominio de Vercel (.vercel.app) y GitHub Pages (.github.io)
    const isVercel = /\.vercel\.app$/.test(origin);
    const isGithubPages = /\.github\.io$/.test(origin);

    if (allowedOrigins.includes(origin) || isVercel || isGithubPages) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por CORS: Origen no permitido'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

const mainRouter = require('./routes');
app.use('/api', mainRouter);

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
