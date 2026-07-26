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
