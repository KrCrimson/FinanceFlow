/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/cierres.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas del arqueo, cierre mensual, reapertura y periodo cerrado.
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-16, RF-21, RF-27, RF-28, RF-29, RF-30, RF-33, RF-40, RF-41, RF-42, RF-43, RF-44  (módulos: Cuenta, Perfil, Comprobantes, Panel, Cierres, Plan Pro)
 * Calidad (RNF) ...: RNF-01, RNF-02, RNF-03, RNF-04, RNF-05, RNF-06, RNF-13, RNF-14
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
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-01, RN-11, RN-12, RN-13, RN-14, RN-15, RN-20, RN-23, RN-24, RN-26, RN-27, RN-28, RN-29
 * Depende de ......: backend/app.js
 *                    backend/database/cierre.model.js
 *                    backend/database/usuario.model.js
 *                    backend/services/cierres.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Usuario = require('../database/usuario.model');
const Cierre = require('../database/cierre.model');
const cierresService = require('../services/cierres.service');
const bcrypt = require('bcryptjs');

describe('Cierres API - Unit & Integration Tests', () => {
  let token;
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

  beforeAll(() => {
    token = jwt.sign({ id: 'user123', email: 'cierre@test.com' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Debería obtener los cierres pendientes (ayer y mes anterior no cerrados)', async () => {
    jest.spyOn(cierresService, 'obtenerCierresPendientes').mockResolvedValue({
      yesterday: { date: '2026-06-15', isClosed: false },
      prevMonth: { periodo: '2026-05', isClosed: false }
    });

    const res = await request(app)
      .get('/api/cierres/pendientes?localDate=2026-06-16')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.yesterday.isClosed).toBe(false);
    expect(res.body.yesterday.date).toBe('2026-06-15');
    expect(res.body.prevMonth.isClosed).toBe(false);
    expect(res.body.prevMonth.periodo).toBe('2026-05');
  });

  it('Debería requerir contraseña para cierre mensual', async () => {
    const resSinPass = await request(app)
      .post('/api/cierres')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipo: 'mensual',
        periodo: '2026-06',
        fondoFijo: 1000,
        saldoFisico: 1450,
        comentarios: 'Cierre mensual de prueba'
      });
    expect(resSinPass.status).toBe(400);
  });

  it('Debería crear un cierre mensual con contraseña válida', async () => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue({
      _id: 'user123',
      passwordHash: 'hashed_pass'
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(cierresService, 'crearCierre').mockResolvedValue({
      _id: 'cierre123',
      tipo: 'mensual',
      periodo: '2026-06',
      saldoEsperado: 1450,
      saldoFisico: 1450,
      diferencia: 0
    });

    const res = await request(app)
      .post('/api/cierres')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipo: 'mensual',
        periodo: '2026-06',
        fondoFijo: 1000,
        saldoFisico: 1450,
        comentarios: 'Cierre mensual de prueba',
        password: 'password123'
      });

    expect(res.status).toBe(201);
  });
});
