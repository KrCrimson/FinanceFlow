
const request = require('supertest');
const app = require('../app');

describe('UsuariosController', () => {
  it('registra usuario nuevo', async () => {
    const email = `test${Date.now()}@mail.com`;
    const res = await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'Test', email, password: '123456' });
    expect(res.statusCode).toBe(201);
  });
  it('no permite registro duplicado', async () => {
    const email = `dup${Date.now()}@mail.com`;
    await request(app).post('/api/usuarios/register').send({ nombre: 'Test', email, password: '123456' });
    const res = await request(app).post('/api/usuarios/register').send({ nombre: 'Test', email, password: '123456' });
    expect(res.statusCode).not.toBe(201);
  });
});
