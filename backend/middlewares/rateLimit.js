const rateLimit = require('express-rate-limit');

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
  forgotPasswordLimiter
};
