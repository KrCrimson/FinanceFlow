const request = require('supertest');
const app = require('../app');
const Pago = require('../database/pago.model');
const Usuario = require('../database/usuario.model');

describe('Pagos & Suscripciones Pro - Unit Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /api/pagos/solicitar-pro registra solicitud de pago correctamente', async () => {
    jest.spyOn(Usuario, 'findOne').mockResolvedValue({
      _id: 'user123',
      email: 'pro@test.com'
    });

    jest.spyOn(Pago.prototype, 'save').mockResolvedValue({
      _id: 'pago123',
      email: 'pro@test.com',
      metodo: 'tarjeta',
      nroOperacion: 'CARD-123456',
      monto: 19.9,
      estado: 'pendiente'
    });

    const res = await request(app)
      .post('/api/pagos/solicitar-pro')
      .send({
        email: 'pro@test.com',
        metodo: 'tarjeta',
        nroOperacion: 'CARD-123456',
        monto: 19.9
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/pagos/checkout-directo activa usuario como PRO instantáneamente', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'pro@test.com',
      esPremium: false,
      planTipo: 'free',
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Usuario, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(Pago.prototype, 'save').mockResolvedValue(true);

    const res = await request(app)
      .post('/api/pagos/checkout-directo')
      .send({
        email: 'pro@test.com',
        metodo: 'tarjeta',
        pais: 'Perú',
        monto: 19.9,
        moneda: 'PEN'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.esPremium).toBe(true);
    expect(mockUser.esPremium).toBe(true);
    expect(mockUser.planTipo).toBe('pro');
  });

  it('POST /api/pagos/toggle-dev-plan alterna plan entre Free y Pro', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'pro@test.com',
      esPremium: false,
      planTipo: 'free',
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Usuario, 'findOne').mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/pagos/toggle-dev-plan')
      .send({ email: 'pro@test.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.esPremium).toBe(true);
  });
});
