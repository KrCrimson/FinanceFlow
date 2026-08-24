const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const validate = require('../middlewares/validate');
const { loginLimiter, forgotPasswordLimiter } = require('../middlewares/rateLimit');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} = require('../schemas/auth.schema');

// Registro de usuario con validación de esquema
router.post('/register', validate({ body: registerSchema }), usuariosController.register);

// Login de usuario (Protegido con rate limiter y validación de esquema)
router.post('/login', loginLimiter, validate({ body: loginSchema }), usuariosController.login);

// Rutas protegidas para el perfil del usuario actual
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
