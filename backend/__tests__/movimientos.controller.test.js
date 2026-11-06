/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/movimientos.controller.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas de las respuestas de movimientos y del cupo de lecturas del Plan Free.
 * Requerimientos ..: RF-09, RF-11, RF-12, RF-13, RF-14, RF-17  (módulos: Movimientos)
 * Calidad (RNF) ...: RNF-01, RNF-02, RNF-03, RNF-04, RNF-06, RNF-12, RNF-13, RNF-14
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-04 Restablecer contraseña
 *                    CU-05 Consultar resumen y balance (Panel principal)
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
 * Reglas de negocio : RN-03, RN-04, RN-05, RN-06, RN-13
 * Depende de ......: backend/app.js
 *                    backend/services/movimientos.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const movimientosService = require('../services/movimientos.service');

describe('MovimientosController Unit Tests', () => {
  let token;
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

  beforeAll(() => {
    token = jwt.sign({ id: 'mockuser123', email: 'mov@mail.com' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('crea movimiento exitosamente', async () => {
    jest.spyOn(movimientosService, 'crearMovimiento').mockResolvedValue({
      _id: 'mov123',
      nombre: 'Test',
      monto: 100,
      tipo: 'ingreso',
      categoria: 'prueba'
    });

    const res = await request(app)
      .post('/api/movimientos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Test', monto: 100, tipo: 'ingreso', categoria: 'prueba' });

    expect(res.statusCode).toBe(201);
  });

  it('lista movimientos exitosamente', async () => {
    jest.spyOn(movimientosService, 'listarMovimientos').mockResolvedValue([
      { _id: 'mov123', nombre: 'Test', monto: 100, tipo: 'ingreso', categoria: 'prueba' }
    ]);

    const res = await request(app)
      .get('/api/movimientos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
