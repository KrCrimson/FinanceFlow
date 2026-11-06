/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/middlewares/validate.js
 * Capa / módulo ...: Backend · Validación
 * Función .........: Valida con esquemas el cuerpo, los parámetros y la consulta de cada solicitud antes de procesarla.
 * Requerimientos ..: RF-01, RF-09  (módulos: Cuenta, Movimientos)
 * Calidad (RNF) ...: RNF-10
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-04 Restablecer contraseña
 *                    CU-06 Registrar movimiento manual
 *                    CU-12 Gestionar información de perfil
 * Reglas de negocio : RN-04
 * Lo usan .........: backend/routes/movimientos.js
 *                    backend/routes/usuarios.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
