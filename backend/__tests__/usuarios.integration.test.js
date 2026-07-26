const request = require('supertest');
const app = require('../app');
const usuariosService = require('../services/usuarios.service');

describe('API integración - Usuarios', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registro y login de usuario', async () => {
    const email = `test${Date.now()}@mail.com`;

    jest.spyOn(usuariosService, 'register').mockResolvedValue({
      id: 'mockuser123',
      nombre: 'Test',
      email,
      estado: 'activo'
    });

    jest.spyOn(usuariosService, 'login').mockResolvedValue({
      token: 'mockjwttoken',
      usuario: { id: 'mockuser123', nombre: 'Test', email }
    });

    const resReg = await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'Test', email, password: '123456' });

    expect(resReg.statusCode).toBe(201);

    const resLog = await request(app)
      .post('/api/usuarios/login')
      .send({ email, password: '123456' });

    expect(resLog.statusCode).toBe(200);
    expect(resLog.body.token).toBeDefined();
  });
});
