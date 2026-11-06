/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/middlewares/auth.js
 * Capa / módulo ...: Backend · Seguridad
 * Función .........: Exige una sesión válida y una cuenta activa en cada solicitud privada; rechaza el token temporal del paso 2 de MFA, que no es una sesión.
 * Requerimientos ..: RF-02, RF-08, RF-42  (módulos: Cuenta, Perfil)
 * Calidad (RNF) ...: RNF-02, RNF-03
 * Casos de uso ....: CU-05 Consultar resumen y balance (Panel principal)
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
 *                    CU-02 Iniciar sesión
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-02, RN-07, RN-20, RN-26
 * Depende de ......: backend/database/usuario.model.js
 * Lo usan .........: backend/routes/cierres.js
 *                    backend/routes/index.js
 *                    backend/routes/logs.js
 *                    backend/routes/movimientos.js
 *                    backend/routes/pagos.router.js
 *                    backend/routes/recordatorios.js
 *                    backend/routes/usuarios.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Middleware de autenticación JWT
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test-jwt-secret-32-chars-minimum-key' : undefined);
const Usuario = require('../database/usuario.model');

module.exports = async function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // El token temporal del paso 2 de MFA solo sirve en /login/mfa; nunca como sesión
    if (decoded.tipo === 'mfa') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    // Verificar si el usuario ha sido eliminado o desactivado en la base de datos
    const user = await Usuario.findById(decoded.id);
    if (!user || user.estado === 'eliminado' || user.estado === 'inactivo') {
      return res.status(401).json({ error: 'Token inválido o usuario inhabilitado' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
