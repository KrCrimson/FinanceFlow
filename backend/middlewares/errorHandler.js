/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/middlewares/errorHandler.js
 * Capa / módulo ...: Backend · Seguridad
 * Función .........: Centraliza los errores: registra el detalle en el servidor y responde al usuario con un mensaje claro sin datos internos.
 * Calidad (RNF) ...: RNF-10, RNF-14
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
 * Lo usan .........: backend/app.js
 * Pruebas .........: backend/__tests__/errorHandler.test.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
