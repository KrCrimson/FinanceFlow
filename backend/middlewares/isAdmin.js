/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/middlewares/isAdmin.js
 * Capa / módulo ...: Backend · Seguridad
 * Función .........: Permite el paso solo a cuentas con rol de administrador.
 * Requerimientos ..: RF-35, RF-36, RF-37  (módulos: Administración)
 * Calidad (RNF) ...: RNF-02
 * Casos de uso ....: CU-22 Administrar la plataforma
 * Reglas de negocio : RN-22
 * Depende de ......: backend/database/usuario.model.js
 * Lo usan .........: backend/routes/index.js
 *                    backend/routes/usuarios.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Middleware para verificar permisos de administrador
const Usuario = require('../database/usuario.model');

module.exports = async function (req, res, next) {
  // Este middleware asume que 'auth.js' ya se ejecutó y populó req.user
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  try {
    const user = await Usuario.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // 1. Verificación primaria: Campo 'rol' en la base de datos
    if (user.rol === 'admin') {
      return next();
    }

    // 2. Verificación secundaria: Lista configurable en variable de entorno ADMIN_EMAILS
    if (process.env.ADMIN_EMAILS) {
      const allowedAdmins = process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase());
      if (allowedAdmins.includes(user.email.toLowerCase())) {
        return next();
      }
    }

    console.warn(`[Seguridad] Intento de acceso admin no autorizado para: ${user.email}`);
    return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de administrador' });

  } catch (err) {
    console.error('Error en middleware isAdmin:', err);
    return res.status(500).json({ error: 'Error verificando permisos de administrador' });
  }
};
