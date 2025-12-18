
const request = require('supertest');
const app = require('../../backend/app');

let token;

describe('Flujo completo (end-to-end)', () => {
  const email = `e2e${Date.now()}@mail.com`;
  it('registro y login', async () => {
    await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'E2E', email, password: '123456' });
    const login = await request(app)
      .post('/api/usuarios/login')
      .send({ email, password: '123456' });
    token = login.body.token;
    expect(token).toBeDefined();
  });

  it('crea, lista e inactiva movimiento', async () => {
    const mov = await request(app)
      .post('/api/movimientos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Test', monto: 100, tipo: 'ingreso', categoria: 'prueba' });
    expect(mov.statusCode).toBe(201);
    const lista = await request(app)
      .get('/api/movimientos')
      .set('Authorization', `Bearer ${token}`);
    expect(lista.body.length).toBeGreaterThan(0);
    const id = lista.body[0]._id;
    const inactiva = await request(app)
      .patch(`/api/movimientos/${id}/inactivar`)
      .set('Authorization', `Bearer ${token}`);
    expect(inactiva.statusCode).toBe(200);
  });
});
