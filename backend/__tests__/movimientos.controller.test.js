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
