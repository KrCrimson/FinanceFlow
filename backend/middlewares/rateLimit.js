/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/middlewares/rateLimit.js
 * Capa / módulo ...: Backend · Seguridad
 * Función .........: Limita a 5 los intentos de inicio de sesión por 15 minutos, a 3 las solicitudes de recuperación por hora y a 10 los intentos de verificación en dos pasos por 15 minutos.
 * Requerimientos ..: RF-03, RF-04, RF-42  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-02
 * Casos de uso ....: CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-08, RN-09, RN-29
 * Lo usan .........: backend/routes/usuarios.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const rateLimit = require('express-rate-limit');

// Límite para el segundo factor (códigos de 6 dígitos): 10 intentos por 15 minutos por IP
const mfaLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de verificación. Por favor intente nuevamente en 15 minutos.' },
});

// Límite para intentos de login (ej: 5 intentos por cada 15 minutos)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limitar cada IP a 5 peticiones por ventana
  message: { error: 'Demasiados intentos de inicio de sesión desde esta IP. Por favor intente nuevamente en 15 minutos.' },
  standardHeaders: true, // Retorna info del límite en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita los headers `X-RateLimit-*`
});

// Límite para recuperación de contraseña (ej: 3 intentos por hora)
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Limitar cada IP a 3 peticiones por hora
  message: { error: 'Demasiadas solicitudes de recuperación de contraseña. Por favor intente nuevamente en 1 hora.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  forgotPasswordLimiter, mfaLimiter };
