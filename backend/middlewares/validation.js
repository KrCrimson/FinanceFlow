/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/middlewares/validation.js
 * Capa / módulo ...: Backend · Validación
 * Función .........: Versión simple de la validación de cuerpo con esquema (equivalente a validate.js).
 * Requerimientos ..: RF-01, RF-09  (módulos: Cuenta, Movimientos)
 * Calidad (RNF) ...: RNF-10
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-06 Registrar movimiento manual
 * Reglas de negocio : RN-04
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Middleware de validación de datos con Zod
const { z } = require('zod');

function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ error: error.errors || error.message });
    }
  };
}

module.exports = validate;
