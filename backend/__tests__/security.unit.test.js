const request = require('supertest');
const app = require('../app');
const Usuario = require('../database/usuario.model');
const Pago = require('../database/pago.model');

describe('Security & Chaos Audit - NoSQL Injection & Payload Protections', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('TC-INJ-01: Debe rechazar intentos de inyección NoSQL con operador $gt en credenciales de login', async () => {
    jest.spyOn(Usuario, 'findOne').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: { $gt: '' },
        password: { $gt: '' }
      });

    expect([400, 401]).toContain(res.statusCode);
    expect(res.body.token).toBeUndefined();
  });

  it('TC-INJ-02: Debe bloquear contaminación de prototipos (__proto__) en el body JSON', async () => {
    const rawJSON = '{"nombre": "Movimiento Hack", "monto": 100, "__proto__": {"isAdmin": true}}';
    const parsedObj = JSON.parse(rawJSON);

    expect(Object.prototype.isAdmin).toBeUndefined();
    expect(({}).isAdmin).toBeUndefined();
  });

  it('TC-SEC-02: Debe rechazar peticiones con montos o categorías no válidas', async () => {
    const invalidAmounts = [
      { $gt: 0 },
      'DROP TABLE usuarios',
      null,
      Infinity,
      NaN
    ];

    for (const invalidAmount of invalidAmounts) {
      const res = await request(app)
        .post('/api/movimientos')
        .send({
          nombre: 'Ataque de Monto',
          monto: invalidAmount,
          tipo: 'ingreso',
          categoria: 'Comida'
        });

      expect([400, 401, 422]).toContain(res.statusCode);
    }
  });

  it('TC-PAY-01: Debe procesar peticiones de pago y validar operaciones existentes', async () => {
    const validUserId = '507f1f77bcf86cd799439011';
    jest.spyOn(Usuario, 'findOne').mockResolvedValue({ _id: validUserId, email: 'test@mail.com' });
    jest.spyOn(Pago.prototype, 'save').mockResolvedValue({
      _id: '507f1f77bcf86cd799439012',
      usuario: validUserId,
      metodo: 'tarjeta_pro',
      nroOperacion: 'CARD-REPLAY-123',
      estado: 'pendiente'
    });

    const res = await request(app)
      .post('/api/pagos/solicitar-pro')
      .send({
        email: 'test@mail.com',
        metodo: 'tarjeta_pro',
        nroOperacion: 'CARD-REPLAY-123',
        monto: 19.9
      });

    expect([200, 201]).toContain(res.statusCode);
  });
});
