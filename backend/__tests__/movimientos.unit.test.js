/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/movimientos.unit.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas de la lógica de movimientos (montos, fechas, periodos cerrados, desactivación).
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-09, RF-10, RF-11, RF-12, RF-13, RF-14, RF-16, RF-17, RF-25, RF-33, RF-40  (módulos: Cuenta, Perfil, Movimientos, Comprobantes, Planificador, Plan Pro, Cierres)
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
 * Reglas de negocio : RN-01, RN-03, RN-04, RN-05, RN-06, RN-13, RN-15, RN-19, RN-20, RN-23, RN-24
 * Depende de ......: backend/app.js
 *                    backend/database/movimiento.model.js
 *                    backend/database/usuario.model.js
 *                    backend/services/movimientos.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Movimiento = require('../database/movimiento.model');
const Usuario = require('../database/usuario.model');
const movimientosService = require('../services/movimientos.service');
const bcrypt = require('bcryptjs');

describe('Movimientos - Unit / Mock Tests', () => {
  let token;
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

  beforeAll(() => {
    token = jwt.sign({ id: 'mockuser123', email: 'mock@test.com' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /api/movimientos/historico crea movimiento historico exitosamente con contraseña correcta', async () => {
    // Mock user search
    jest.spyOn(Usuario, 'findById').mockResolvedValue({
      _id: 'mockuser123',
      nombre: 'Mock User',
      passwordHash: 'hashed_password'
    });

    // Mock bcrypt compare
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    // Mock crearMovimiento in service
    jest.spyOn(movimientosService, 'crearMovimiento').mockResolvedValue({
      _id: 'mockmov123',
      nombre: 'Sueldo Anterior',
      monto: 1500,
      tipo: 'ingreso',
      categoria: 'Sueldo',
      fecha: new Date('2026-05-01'),
      esRecurrente: false
    });

    const res = await request(app)
      .post('/api/movimientos/historico')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Sueldo Anterior',
        monto: 1500,
        tipo: 'ingreso',
        categoria: 'Sueldo',
        fecha: '2026-05-01',
        password: 'correct_password'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Sueldo Anterior');
  });

  it('POST /api/movimientos/historico rechaza con contraseña incorrecta', async () => {
    // Mock user search
    jest.spyOn(Usuario, 'findById').mockResolvedValue({
      _id: 'mockuser123',
      nombre: 'Mock User',
      passwordHash: 'hashed_password'
    });

    // Mock bcrypt compare to fail
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const res = await request(app)
      .post('/api/movimientos/historico')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Sueldo Anterior',
        monto: 1500,
        tipo: 'ingreso',
        categoria: 'Sueldo',
        fecha: '2026-05-01',
        password: 'wrong_password'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Contraseña incorrecta');
  });
});
