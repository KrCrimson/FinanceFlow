
const request = require('supertest');
const app = require('../app');

let token;

describe('MovimientosController', () => {
  beforeAll(async () => {
    const email = `mov${Date.now()}@mail.com`;
    await request(app).post('/api/usuarios/register').send({ nombre: 'Mov', email, password: '123456' });
    const login = await request(app).post('/api/usuarios/login').send({ email, password: '123456' });
    token = login.body.token;
  });
  it('crea movimiento', async () => {
    const res = await request(app)
      .post('/api/movimientos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Test', monto: 100, tipo: 'ingreso', categoria: 'prueba' });
    expect(res.statusCode).toBe(201);
  });
  it('lista movimientos', async () => {
    const res = await request(app)
      .get('/api/movimientos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
