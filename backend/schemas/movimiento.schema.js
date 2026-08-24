const { z } = require('zod');

const crearMovimientoSchema = z.object({
  nombre: z.string({ required_error: 'El nombre o descripción es obligatorio' }).min(1, 'El nombre no puede estar vacío').trim(),
  monto: z.number({ required_error: 'El monto es obligatorio' }).positive('El monto debe ser mayor a 0'),
  tipo: z.enum(['ingreso', 'gasto', 'deuda'], { required_error: 'El tipo debe ser ingreso, gasto o deuda' }),
  categoria: z.string({ required_error: 'La categoría es requerida' }).min(1).trim(),
  fecha: z.string().optional(),
  notas: z.string().optional(),
});

const movimientoHistoricoSchema = z.object({
  nombre: z.string({ required_error: 'El nombre es obligatorio' }).min(1).trim(),
  monto: z.number({ required_error: 'El monto es obligatorio' }).positive('El monto debe ser mayor a 0'),
  tipo: z.enum(['ingreso', 'gasto', 'deuda']),
  categoria: z.string({ required_error: 'La categoría es obligatoria' }).min(1),
  fecha: z.string({ required_error: 'La fecha es obligatoria' }),
  password: z.string().optional(),
  notas: z.string().optional(),
});

const analizarComprobanteSchema = z.object({
  imageBase64: z.string({ required_error: 'La imagen en base64 es obligatoria' }).min(10, 'Imagen inválida o corrupta'),
  mimeType: z.string().optional(),
});

module.exports = {
  crearMovimientoSchema,
  movimientoHistoricoSchema,
  analizarComprobanteSchema,
};
