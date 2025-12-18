
const request = require('supertest');
const app = require('../../backend/app');

describe('API integración', () => {
  it('registro y login de usuario', async () => {
    const email = `test${Date.now()}@mail.com`;
    const res = await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'Test', email, password: '123456' });
    expect(res.statusCode).toBe(201);
    const login = await request(app)
      .post('/api/usuarios/login')
      .send({ email, password: '123456' });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBeDefined();
  });
});
