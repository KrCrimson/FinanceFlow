const { z } = require('zod');

const registerSchema = z.object({
  nombre: z.string({ required_error: 'El nombre es obligatorio' }).min(2, 'El nombre debe tener al menos 2 caracteres').trim(),
  email: z.string({ required_error: 'El email es obligatorio' }).email('Formato de email inválido').trim().toLowerCase(),
  password: z.string({ required_error: 'La contraseña es obligatoria' }).min(6, 'La contraseña debe tener al menos 6 caracteres'),
  fondoFijo: z.number().nonnegative('El fondo fijo no puede ser negativo').optional(),
});

const loginSchema = z.object({
  email: z.string({ required_error: 'El email es obligatorio' }).email('Formato de email inválido').trim().toLowerCase(),
  password: z.string({ required_error: 'La contraseña es obligatoria' }).min(1, 'La contraseña no puede estar vacía'),
});

const forgotPasswordSchema = z.object({
  email: z.string({ required_error: 'El email es obligatorio' }).email('Formato de email inválido').trim().toLowerCase(),
});

const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'El token de recuperación es requerido' }).min(1, 'Token inválido'),
  newPassword: z.string({ required_error: 'La nueva contraseña es obligatoria' }).min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const updateProfileSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').trim().optional(),
  email: z.string().email('Formato de email inválido').trim().toLowerCase().optional(),
  fondoFijo: z.number().nonnegative('El fondo fijo debe ser mayor o igual a 0').optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
};
