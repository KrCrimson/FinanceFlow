const request = require('supertest');
const app = require('../app');
const Usuario = require('../database/usuario.model');
const Pago = require('../database/pago.model');
const Movimiento = require('../database/movimiento.model');

describe('Admin Dashboard - Unit Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET /api/admin/metrics retorna métricas completas de usuarios, suscripciones y pagos', async () => {
    jest.spyOn(Usuario, 'countDocuments').mockImplementation((filter) => {
      if (!filter || Object.keys(filter).length === 0) return Promise.resolve(10);
      if (filter.esPremium === true) return Promise.resolve(4);
      if (filter.esPremium === false) return Promise.resolve(6);
      return Promise.resolve(0);
    });

    jest.spyOn(Usuario, 'aggregate').mockResolvedValue([{ totalConsultas: 25 }]);

    jest.spyOn(Pago, 'aggregate').mockResolvedValue([
      { _id: 'aprobado', total: 79.6 },
      { _id: 'pendiente', total: 19.9 }
    ]);

    jest.spyOn(Pago, 'countDocuments').mockResolvedValue(1);

    const res = await request(app).get('/api/admin/metrics');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalUsuarios).toBe(10);
    expect(res.body.usuariosPro).toBe(4);
    expect(res.body.usuariosFree).toBe(6);
  });

  it('POST /api/admin/toggle-premium otorga o revoca Pro a usuario', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'target@test.com',
      esPremium: false,
      planTipo: 'free',
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Usuario, 'findById').mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/admin/toggle-premium')
      .send({ userId: 'user123', esPremium: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockUser.esPremium).toBe(true);
    expect(mockUser.planTipo).toBe('pro');
  });
});
