const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Log = require('../database/log.model');
const Usuario = require('../database/usuario.model');

describe('LogsController Unit Tests', () => {
  let token;
  const JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-32-chars-minimum-key';

  beforeAll(() => {
    token = jwt.sign({ id: 'mockadmin123', email: 'admin@mail.com', rol: 'admin' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('lista logs (requiere auth y rol admin)', async () => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue({
      _id: 'mockadmin123',
      email: 'admin@mail.com',
      rol: 'admin'
    });

    jest.spyOn(Log, 'find').mockResolvedValue([
      { _id: 'log1', accion: 'LOGIN', fecha: new Date() }
    ]);

    const res = await request(app)
      .get('/api/logs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
