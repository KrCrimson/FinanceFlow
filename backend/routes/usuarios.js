/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/routes/usuarios.js
 * Capa / módulo ...: Backend · Rutas
 * Función .........: Define las direcciones de cuenta: registro, inicio de sesión, perfil, baja, recuperación y restablecimiento; aplica validación y límite de intentos.
 * Requerimientos ..: RF-01 a RF-08, RF-41, RF-42, RF-43  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-02
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-04 Restablecer contraseña
 *                    CU-12 Gestionar información de perfil
 *                    CU-18 Eliminar cuenta
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-08, RN-09, RN-29
 * Depende de ......: backend/controllers/usuarios.controller.js
 *                    backend/middlewares/auth.js
 *                    backend/middlewares/isAdmin.js
 *                    backend/middlewares/rateLimit.js
 *                    backend/middlewares/validate.js
 *                    backend/schemas/auth.schema.js
 * Lo usan .........: backend/routes/index.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const validate = require('../middlewares/validate');
const { loginLimiter, forgotPasswordLimiter, mfaLimiter } = require('../middlewares/rateLimit');
const {
  registerSchema,
  loginSchema,
  loginMfaSchema,
  mfaCodigoSchema,
  mfaDesactivarSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} = require('../schemas/auth.schema');

// Registro de usuario con validación de esquema
router.post('/register', validate({ body: registerSchema }), usuariosController.register);

// Login de usuario (Protegido con rate limiter y validación de esquema)
router.post('/login', loginLimiter, validate({ body: loginSchema }), usuariosController.login);

// Rutas protegidas para el perfil del usuario actual
// Verificación en dos pasos (MFA)
router.post('/login/mfa', mfaLimiter, validate({ body: loginMfaSchema }), usuariosController.loginMfa);
router.post('/mfa/configurar', auth, mfaLimiter, usuariosController.mfaConfigurar);
router.post('/mfa/activar', auth, mfaLimiter, validate({ body: mfaCodigoSchema }), usuariosController.mfaActivar);
router.post('/mfa/desactivar', auth, mfaLimiter, validate({ body: mfaDesactivarSchema }), usuariosController.mfaDesactivar);

router.get('/me', auth, usuariosController.getProfile);
router.put('/me', auth, validate({ body: updateProfileSchema }), usuariosController.updateProfile);
router.delete('/me', auth, usuariosController.deleteProfile);

// Rutas de recuperación de contraseña (sin autenticación)
router.post('/forgot-password', forgotPasswordLimiter, validate({ body: forgotPasswordSchema }), usuariosController.forgotPassword);
router.post('/verify-reset-token', usuariosController.verifyResetToken);
router.post('/reset-password', forgotPasswordLimiter, validate({ body: resetPasswordSchema }), usuariosController.resetPassword);

// Ruta de diagnóstico de email (Exclusiva para Administradores autenticados)
router.get('/test-email-config', auth, isAdmin, (req, res) => {
  const emailConfigured = Boolean(
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_USER !== 'tu-email@gmail.com'
  );

  res.json({
    emailConfigured,
    environment: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
    emailUser: process.env.EMAIL_USER ? '***configurado***' : 'NO_CONFIGURADO',
    emailPass: process.env.EMAIL_PASS ? '***configurado***' : 'NO_CONFIGURADO',
  });
});

module.exports = router;
