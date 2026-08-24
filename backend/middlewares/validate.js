const { z } = require('zod');

/**
 * Middleware genérico para validar solicitudes con esquemas Zod
 * @param {Object} schemas - Objeto con esquemas opcionales: { body, query, params }
 */
const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body && req.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.query && req.query) {
      req.query = schemas.query.parse(req.query);
    }
    if (schemas.params && req.params) {
      req.params = schemas.params.parse(req.params);
    }
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const rawIssues = error.issues || error.errors || [];
      const issues = rawIssues.map(err => ({
        campo: Array.isArray(err.path) ? err.path.join('.') : String(err.path || ''),
        mensaje: err.message
      }));
      return res.status(400).json({
        error: 'Datos de solicitud inválidos',
        detalles: issues
      });
    }
    next(error);
  }
};

module.exports = validate;
