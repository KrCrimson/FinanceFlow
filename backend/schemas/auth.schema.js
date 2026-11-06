/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/schemas/auth.schema.js
 * Capa / módulo ...: Backend · Validación
 * Función .........: Reglas de datos de cuenta: nombre (2+), correo válido, contraseña (6+), perfil y restablecimiento.
 * Requerimientos ..: RF-01, RF-05, RF-07, RF-42, RF-43  (módulos: Cuenta, Perfil)
 * Calidad (RNF) ...: RNF-10
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-04 Restablecer contraseña
 *                    CU-12 Gestionar información de perfil
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-01
 * Lo usan .........: backend/routes/usuarios.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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

const loginMfaSchema = z.object({
  mfaToken: z.string({ required_error: 'La verificación expiró. Inicie sesión de nuevo' }).min(10, 'La verificación expiró. Inicie sesión de nuevo'),
  codigo: z.string({ required_error: 'El código es obligatorio' }).trim().min(6, 'El código es obligatorio').max(20, 'Código no válido'),
});

const mfaCodigoSchema = z.object({
  codigo: z.string({ required_error: 'El código es obligatorio' }).trim().regex(/^\d{6}$/, 'El código debe tener 6 dígitos'),
});

const mfaDesactivarSchema = z.object({
  password: z.string({ required_error: 'La contraseña es obligatoria' }).min(1, 'La contraseña es obligatoria'),
  codigo: z.string({ required_error: 'El código es obligatorio' }).trim().min(6, 'El código es obligatorio').max(20, 'Código no válido'),
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
  loginMfaSchema,
  mfaCodigoSchema,
  mfaDesactivarSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
};
