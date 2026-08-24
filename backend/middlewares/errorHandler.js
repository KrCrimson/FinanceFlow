// Middleware de manejo centralizado y seguro de errores
function errorHandler(err, req, res, next) {
  // Registrar el error detallado en el servidor para observabilidad
  console.error(`[Error Handler] ${req.method} ${req.path}:`, err);

  // 1. Error de sintaxis en JSON entrante
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Formato JSON inválido en la solicitud' });
  }

  // 2. Errores de validación o casting de Mongoose (sanitizados para no filtrar esquemas internos)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map(e => e.message);
    return res.status(400).json({ 
      error: 'Error de validación de datos',
      detalles: process.env.NODE_ENV === 'production' ? undefined : messages
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Identificador o formato de parámetro inválido' });
  }

  // 3. Errores de JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }

  // 4. Errores de CORS
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: err.message });
  }

  // 5. Error por defecto 500 (Genérico y seguro)
  const statusCode = err.statusCode || err.status || 500;
  const clientMessage = process.env.NODE_ENV === 'production'
    ? 'Error interno del servidor'
    : (err.message || 'Error interno del servidor');

  res.status(statusCode).json({ error: clientMessage });
}

module.exports = errorHandler;
