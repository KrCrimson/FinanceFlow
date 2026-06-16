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
