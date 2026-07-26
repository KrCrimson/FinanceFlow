const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const usuariosService = require('../services/usuarios.service');
const movimientosService = require('../services/movimientos.service');

describe('Flujo completo (end-to-end)', () => {
  let token;
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

  beforeAll(() => {
    token = jwt.sign({ id: 'user123', email: 'e2e@test.com' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registro y login', async () => {
    jest.spyOn(usuariosService, 'register').mockResolvedValue({ id: 'user123' });
    jest.spyOn(usuariosService, 'login').mockResolvedValue({ token });

    const resReg = await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'E2E', email: 'e2e@test.com', password: '123456' });

    expect(resReg.statusCode).toBe(201);
  });

  it('crea, lista e inactiva movimiento', async () => {
    jest.spyOn(movimientosService, 'crearMovimiento').mockResolvedValue({
      _id: 'mov123',
      nombre: 'Test',
      monto: 100,
      tipo: 'ingreso',
      categoria: 'prueba'
    });

    jest.spyOn(movimientosService, 'listarMovimientos').mockResolvedValue([
      { _id: 'mov123', nombre: 'Test', monto: 100, tipo: 'ingreso', categoria: 'prueba' }
    ]);

    const mov = await request(app)
      .post('/api/movimientos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Test', monto: 100, tipo: 'ingreso', categoria: 'prueba' });

    expect(mov.statusCode).toBe(201);

    const lista = await request(app)
      .get('/api/movimientos')
      .set('Authorization', `Bearer ${token}`);

    expect(lista.statusCode).toBe(200);
    expect(Array.isArray(lista.body)).toBe(true);
  });
});
