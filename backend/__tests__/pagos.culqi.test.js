/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/pagos.culqi.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de pagos.culqi: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-16, RF-33, RF-34, RF-36, RF-40  (módulos: Cuenta, Perfil, Comprobantes, Plan Pro, Administración, Cierres)
 * Calidad (RNF) ...: RNF-01, RNF-02, RNF-03, RNF-04, RNF-06, RNF-14
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-04 Restablecer contraseña
 *                    CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-06 Registrar movimiento manual
 *                    CU-07 Cargar comprobante por imagen
 *                    CU-08 Desactivar movimiento
 *                    CU-09 Visualizar reportes y gráficos
 *                    CU-10 Filtrar historial de movimientos
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-12 Gestionar información de perfil
 *                    CU-13 Cerrar sesión
 *                    CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 *                    CU-17 Marcar y quitar ingreso constante
 *                    CU-18 Eliminar cuenta
 *                    CU-19 Contratar el Plan Pro
 *                    CU-20 Gestionar préstamos y recordatorios
 *                    CU-21 Exportar reportes a Excel y PDF
 *                    CU-22 Administrar la plataforma
 * Reglas de negocio : RN-01, RN-15, RN-17, RN-20, RN-23, RN-24
 * Depende de ......: backend/app.js
 *                    backend/database/pago.model.js
 *                    backend/database/usuario.model.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Pago = require('../database/pago.model');
const Usuario = require('../database/usuario.model');

const JWT_SECRET = process.env.JWT_SECRET || 'testsecretkey1234567890';
const token = jwt.sign({ id: 'user1', email: 'pro@test.com' }, JWT_SECRET);
const ruta = '/api/pagos/crear-cargo-culqi';

const respuestaCulqi = (ok, cuerpo) => ({ ok, json: async () => cuerpo });

describe('POST /api/pagos/crear-cargo-culqi', () => {
  let usuario;
  const claveOriginal = process.env.CULQI_SECRET_KEY;

  beforeEach(() => {
    process.env.CULQI_SECRET_KEY = 'sk_test_clave_de_prueba';
    usuario = {
      _id: 'user1',
      email: 'pro@test.com',
      esPremium: false,
      planTipo: 'free',
      lastPaymentId: null,
      save: jest.fn().mockResolvedValue(),
    };
    jest.spyOn(Usuario, 'findById').mockResolvedValue(usuario);
    jest.spyOn(Pago.prototype, 'save').mockResolvedValue();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env.CULQI_SECRET_KEY = claveOriginal;
    jest.restoreAllMocks();
    delete global.fetch;
  });

  it('exige sesión iniciada', async () => {
    const res = await request(app).post(ruta).send({ token: 'tkn_1' });
    expect(res.status).toBe(401);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('rechaza la petición si falta el token de Culqi', async () => {
    const res = await request(app).post(ruta).set('Authorization', `Bearer ${token}`).send({});
    expect(res.status).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('responde 503 si el servidor no tiene configurada la llave secreta', async () => {
    delete process.env.CULQI_SECRET_KEY;
    const res = await request(app).post(ruta).set('Authorization', `Bearer ${token}`).send({ token: 'tkn_1' });
    expect(res.status).toBe(503);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('un cargo aprobado activa el plan Pro y registra el pago', async () => {
    global.fetch.mockResolvedValue(respuestaCulqi(true, { id: 'chr_test_123' }));
    const res = await request(app).post(ruta).set('Authorization', `Bearer ${token}`).send({ token: 'tkn_1' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, esPremium: true, planTipo: 'pro' });
    expect(usuario.esPremium).toBe(true);
    expect(usuario.planTipo).toBe('pro');
    expect(usuario.lastPaymentId).toBe('chr_test_123');
    expect(usuario.save).toHaveBeenCalledTimes(1);
    expect(Pago.prototype.save).toHaveBeenCalledTimes(1);
  });

  it('el monto y la moneda los fija el servidor: se ignora lo que envíe el cliente', async () => {
    global.fetch.mockResolvedValue(respuestaCulqi(true, { id: 'chr_test_456' }));
    await request(app)
      .post(ruta)
      .set('Authorization', `Bearer ${token}`)
      .send({ token: 'tkn_1', monto: 0.01, moneda: 'USD' });
    const [url, opciones] = global.fetch.mock.calls[0];
    const cuerpo = JSON.parse(opciones.body);
    expect(url).toBe('https://api.culqi.com/v2/charges');
    expect(cuerpo.amount).toBe(1990);
    expect(cuerpo.currency_code).toBe('PEN');
    expect(cuerpo.source_id).toBe('tkn_1');
    expect(cuerpo.email).toBe('pro@test.com');
  });

  it('usa la llave secreta como Bearer y no la devuelve al cliente', async () => {
    global.fetch.mockResolvedValue(respuestaCulqi(true, { id: 'chr_test_789' }));
    const res = await request(app).post(ruta).set('Authorization', `Bearer ${token}`).send({ token: 'tkn_1' });
    expect(global.fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer sk_test_clave_de_prueba');
    expect(JSON.stringify(res.body)).not.toContain('sk_test');
  });

  it('un cargo rechazado devuelve 402 con el mensaje de Culqi y no activa Pro', async () => {
    global.fetch.mockResolvedValue(respuestaCulqi(false, { user_message: 'Tarjeta sin fondos' }));
    const res = await request(app).post(ruta).set('Authorization', `Bearer ${token}`).send({ token: 'tkn_1' });
    expect(res.status).toBe(402);
    expect(res.body.error).toBe('Tarjeta sin fondos');
    expect(usuario.esPremium).toBe(false);
    expect(usuario.save).not.toHaveBeenCalled();
    expect(Pago.prototype.save).not.toHaveBeenCalled();
  });

  it('un reintento con el mismo cargo no registra el pago dos veces (idempotencia)', async () => {
    usuario.lastPaymentId = 'chr_test_123';
    global.fetch.mockResolvedValue(respuestaCulqi(true, { id: 'chr_test_123' }));
    const res = await request(app).post(ruta).set('Authorization', `Bearer ${token}`).send({ token: 'tkn_1' });
    expect(res.status).toBe(200);
    expect(Pago.prototype.save).not.toHaveBeenCalled();
    expect(usuario.save).not.toHaveBeenCalled();
  });

  it('si la llamada a Culqi falla por red responde 500 genérico', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockRejectedValue(new Error('ECONNRESET'));
    const res = await request(app).post(ruta).set('Authorization', `Bearer ${token}`).send({ token: 'tkn_1' });
    expect(res.status).toBe(500);
    expect(res.body.error).not.toContain('ECONNRESET');
  });

  it('el registro del pago acepta el método culqi (regresión del enum del modelo)', () => {
    const pago = new Pago({ usuario: new mongoose.Types.ObjectId(), email: 'a@b.com', metodo: 'culqi', nroOperacion: 'chr_1', monto: 19.9 });
    expect(pago.validateSync()).toBeUndefined();
  });
});
