/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/schemas/movimiento.schema.js
 * Capa / módulo ...: Backend · Validación
 * Función .........: Reglas de datos de movimiento: tipo, nombre, monto mayor que cero, categoría y fecha.
 * Requerimientos ..: RF-09  (módulos: Movimientos)
 * Calidad (RNF) ...: RNF-10
 * Casos de uso ....: CU-06 Registrar movimiento manual
 * Reglas de negocio : RN-04, RN-06
 * Lo usan .........: backend/routes/movimientos.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const { z } = require('zod');

const crearMovimientoSchema = z.object({
  nombre: z.string({ required_error: 'El nombre o descripción es obligatorio' }).min(1, 'El nombre no puede estar vacío').trim(),
  monto: z.number({ required_error: 'El monto es obligatorio' }).positive('El monto debe ser mayor a 0'),
  tipo: z.enum(['ingreso', 'egreso'], { required_error: 'El tipo debe ser ingreso o egreso' }),
  categoria: z.string({ required_error: 'La categoría es requerida' }).min(1).trim(),
  fecha: z.coerce.date().optional(),
  estado: z.enum(['activo', 'inactivo', 'planificado']).optional(),
  esRecurrente: z.boolean().optional(),
  descripcion: z.string().optional(),
  notas: z.string().optional(),
});

const movimientoHistoricoSchema = z.object({
  nombre: z.string({ required_error: 'El nombre es obligatorio' }).min(1).trim(),
  monto: z.number({ required_error: 'El monto es obligatorio' }).positive('El monto debe ser mayor a 0'),
  tipo: z.enum(['ingreso', 'egreso']),
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
