
const request = require('supertest');
const app = require('../app');

describe('LogsController', () => {
  it('lista logs (requiere auth)', async () => {
    const email = `log${Date.now()}@mail.com`;
    await request(app).post('/api/usuarios/register').send({ nombre: 'Log', email, password: '123456' });
    const login = await request(app).post('/api/usuarios/login').send({ email, password: '123456' });
    const token = login.body.token;
    const res = await request(app)
      .get('/api/logs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('rechaza sin token', async () => {
    const res = await request(app).get('/api/logs');
    expect(res.statusCode).not.toBe(200);
  });
});
