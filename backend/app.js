// Cargar variables de entorno primero
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./database/database');
const app = express();

app.use(express.json());
app.use(helmet());
// CORS configurado para desarrollo y producción
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? 
    [process.env.CORS_ORIGIN, 'http://localhost:3001', 'http://127.0.0.1:3001'] :
    ['http://localhost:3001', 'http://127.0.0.1:3001'],
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
  app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en puerto ${PORT}`);
  });
});

module.exports = app;
