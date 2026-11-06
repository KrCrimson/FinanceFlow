/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/integration/flujo-completo.itest.js
 * Capa / módulo ...: Backend · Pruebas de integración
 * Función .........: Prueba la API completa contra una base de datos real en memoria (solo se simula la pasarela de pagos): cuenta, movimientos, cierres, plan y administración.
 * Requerimientos ..: RF-01, RF-02, RF-09, RF-13, RF-27, RF-28, RF-29, RF-30, RF-34  (módulos: Cuenta, Movimientos, Cierres, Plan Pro)
 * Calidad (RNF) ...: RNF-13
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-06 Registrar movimiento manual
 *                    CU-08 Desactivar movimiento
 *                    CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 *                    CU-19 Contratar el Plan Pro
 * Reglas de negocio : RN-13, RN-14
 * Depende de ......: backend/app.js
 *                    backend/database/movimiento.model.js
 *                    backend/database/pago.model.js
 *                    backend/database/usuario.model.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
/**
 * Pruebas de integración: la API completa contra una MongoDB real (en memoria).
 * No se simula ni la base de datos ni los modelos: solo el servicio externo de Culqi.
 */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecretkey1234567890';
process.env.CULQI_SECRET_KEY = 'sk_test_clave_de_prueba';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
let app;
let Usuario;
let Movimiento;
let Pago;

const PASS = 'secreta123';
const auth = (token) => ({ Authorization: `Bearer ${token}` });

// Registra por la API y firma un token válido directamente: el login real está limitado a 5 intentos
// por IP cada 15 min (rate limit), así que solo se usa en las pruebas que verifican el login.
async function registrarYEntrar(nombre, email) {
  const reg = await request(app).post('/api/usuarios/register').send({ nombre, email, password: PASS });
  expect(reg.status).toBe(201);
  const usuario = await Usuario.findOne({ email });
  return jwt.sign({ id: usuario._id.toString(), email }, process.env.JWT_SECRET);
}

const nuevoMov = (extra = {}) => ({ nombre: 'Movimiento', monto: 100, tipo: 'egreso', categoria: 'Otros', ...extra });

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = require('../app');
  Usuario = require('../database/usuario.model');
  Movimiento = require('../database/movimiento.model');
  Pago = require('../database/pago.model');
  await Usuario.init();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('Registro, login y perfil', () => {
  let token;

  it('registra un usuario sin exponer la contraseña ni su hash', async () => {
    const res = await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'Ana Test', email: 'Ana@Test.com', password: PASS });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('ana@test.com');
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|password/i);
    const enBD = await Usuario.findOne({ email: 'ana@test.com' });
    expect(enBD.passwordHash).toBeDefined();
    expect(enBD.passwordHash).not.toBe(PASS);
  });

  it('rechaza un email duplicado aunque cambien las mayúsculas', async () => {
    const res = await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'Otra Ana', email: 'ANA@test.com', password: PASS });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(await Usuario.countDocuments({ email: 'ana@test.com' })).toBe(1);
  });

  it('rechaza un email inválido', async () => {
    const res = await request(app).post('/api/usuarios/register').send({ nombre: 'X Y', email: 'no-es-email', password: PASS });
    expect(res.status).toBe(400);
  });

  it('una contraseña incorrecta no permite entrar', async () => {
    const res = await request(app).post('/api/usuarios/login').send({ email: 'ana@test.com', password: 'mala-clave' });
    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  it('con credenciales correctas devuelve un token y el perfil no incluye el hash', async () => {
    const login = await request(app).post('/api/usuarios/login').send({ email: 'ana@test.com', password: PASS });
    expect(login.status).toBe(200);
    token = login.body.token;
    const me = await request(app).get('/api/usuarios/me').set(auth(token));
    expect(me.status).toBe(200);
    expect(me.body.email).toBe('ana@test.com');
    expect(JSON.stringify(me.body)).not.toMatch(/passwordHash/);
  });

  it('actualiza el perfil y el cambio persiste en la base de datos', async () => {
    const res = await request(app).put('/api/usuarios/me').set(auth(token)).send({ nombre: 'Ana Actualizada', fondoFijo: 1500 });
    expect(res.status).toBe(200);
    const enBD = await Usuario.findOne({ email: 'ana@test.com' });
    expect(enBD.nombre).toBe('Ana Actualizada');
    expect(enBD.fondoFijo).toBe(1500);
  });
});

describe('Movimientos y planificador con datos reales', () => {
  let token;
  let otroToken;
  let egresoId;

  beforeAll(async () => {
    token = await registrarYEntrar('Beto Movs', 'beto@test.com');
    otroToken = await registrarYEntrar('Carla Ajena', 'carla@test.com');
  });

  it('crea un ingreso y un egreso y los lista solo para su dueño', async () => {
    const ing = await request(app).post('/api/movimientos').set(auth(token)).send(nuevoMov({ tipo: 'ingreso', monto: 1000, nombre: 'Sueldo' }));
    const egr = await request(app).post('/api/movimientos').set(auth(token)).send(nuevoMov({ monto: 250, nombre: 'Súper' }));
    expect(ing.status).toBe(201);
    expect(egr.status).toBe(201);
    egresoId = egr.body._id;

    const lista = await request(app).get('/api/movimientos').set(auth(token));
    expect(lista.body).toHaveLength(2);
    const balance = lista.body.reduce((a, m) => a + (m.tipo === 'ingreso' ? m.monto : -m.monto), 0);
    expect(balance).toBe(750);

    const listaAjena = await request(app).get('/api/movimientos').set(auth(otroToken));
    expect(listaAjena.body).toHaveLength(0);
  });

  it('el tipo "gasto" se rechaza y no llega a guardarse', async () => {
    const antes = await Movimiento.countDocuments();
    const res = await request(app).post('/api/movimientos').set(auth(token)).send(nuevoMov({ tipo: 'gasto' }));
    expect(res.status).toBe(400);
    expect(await Movimiento.countDocuments()).toBe(antes);
  });

  it('no se puede registrar un movimiento con fecha futura', async () => {
    const res = await request(app).post('/api/movimientos').set(auth(token)).send(nuevoMov({ fecha: '2999-01-01' }));
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/futuras/);
  });

  it('otro usuario no puede editar ni inactivar un movimiento ajeno (IDOR)', async () => {
    const editar = await request(app).put(`/api/movimientos/${egresoId}`).set(auth(otroToken)).send({ monto: 1 });
    const inactivar = await request(app).patch(`/api/movimientos/${egresoId}/inactivar`).set(auth(otroToken));
    expect(editar.status).toBe(400);
    expect(inactivar.status).toBe(400);
    const sigue = await Movimiento.findById(egresoId);
    expect(sigue.monto).toBe(250);
    expect(sigue.estado).toBe('activo');
  });

  it('una meta planificada se guarda con su estado y se convierte en compra al marcarla', async () => {
    const meta = await request(app).post('/api/movimientos').set(auth(token)).send(nuevoMov({ nombre: 'Laptop', monto: 3000, estado: 'planificado' }));
    expect(meta.status).toBe(201);
    expect(meta.body.estado).toBe('planificado');

    const compra = await request(app).put(`/api/movimientos/${meta.body._id}`).set(auth(token)).send({ estado: 'activo' });
    expect(compra.status).toBe(200);
    expect((await Movimiento.findById(meta.body._id)).estado).toBe('activo');
  });

  it('inactivar un movimiento lo conserva en la base de datos como inactivo', async () => {
    const res = await request(app).patch(`/api/movimientos/${egresoId}/inactivar`).set(auth(token));
    expect(res.status).toBe(200);
    expect((await Movimiento.findById(egresoId)).estado).toBe('inactivo');
  });
});

describe('Cierres de caja', () => {
  let token;
  const hoy = new Date().toISOString().slice(0, 10);
  const mes = hoy.slice(0, 7);

  beforeAll(async () => {
    token = await registrarYEntrar('Dani Cierres', 'dani@test.com');
    await request(app).post('/api/movimientos').set(auth(token)).send(nuevoMov({ tipo: 'ingreso', monto: 500, nombre: 'Venta' }));
  });

  it('el cierre diario calcula el saldo esperado con los movimientos reales y evita duplicados', async () => {
    const res = await request(app)
      .post('/api/cierres')
      .set(auth(token))
      .send({ tipo: 'diario', periodo: hoy, fondoFijo: 100, saldoFisico: 550 });
    expect(res.status).toBe(201);
    expect(res.body.ingresosTotales).toBe(500);
    expect(res.body.saldoEsperado).toBe(600);
    expect(res.body.diferencia).toBe(-50);

    const repetido = await request(app).post('/api/cierres').set(auth(token)).send({ tipo: 'diario', periodo: hoy, fondoFijo: 100, saldoFisico: 600 });
    expect(repetido.status).toBe(400);
  });

  it('el cierre mensual exige la contraseña correcta', async () => {
    const sin = await request(app).post('/api/cierres').set(auth(token)).send({ tipo: 'mensual', periodo: mes, saldoFisico: 600 });
    const mala = await request(app).post('/api/cierres').set(auth(token)).send({ tipo: 'mensual', periodo: mes, saldoFisico: 600, password: 'otra' });
    expect(sin.status).toBe(400);
    expect(mala.status).toBe(401);
  });

  it('tras cerrar el mes no se pueden registrar movimientos, y al reabrirlo sí', async () => {
    const cierre = await request(app).post('/api/cierres').set(auth(token)).send({ tipo: 'mensual', periodo: mes, saldoFisico: 600, password: PASS });
    expect(cierre.status).toBe(201);

    const bloqueado = await request(app).post('/api/movimientos').set(auth(token)).send(nuevoMov());
    expect(bloqueado.status).toBe(400);
    expect(bloqueado.body.error).toMatch(/cerrado/);

    const reabrirMal = await request(app).post('/api/cierres/reabrir').set(auth(token)).send({ tipo: 'mensual', periodo: mes, password: 'otra' });
    expect(reabrirMal.status).toBe(401);

    const reabrir = await request(app).post('/api/cierres/reabrir').set(auth(token)).send({ tipo: 'mensual', periodo: mes, password: PASS });
    expect(reabrir.status).toBe(200);

    const ahoraSi = await request(app).post('/api/movimientos').set(auth(token)).send(nuevoMov());
    expect(ahoraSi.status).toBe(201);
  });
});

describe('Suscripción Pro con Culqi y cuota de OCR', () => {
  let token;
  let usuarioId;

  beforeAll(async () => {
    token = await registrarYEntrar('Eli Pro', 'eli@test.com');
    usuarioId = (await Usuario.findOne({ email: 'eli@test.com' }))._id;
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('un usuario nuevo es gratuito', async () => {
    const res = await request(app).get('/api/pagos/estado-plan').set(auth(token));
    expect(res.body).toMatchObject({ success: true, esPremium: false });
  });

  it('el plan gratuito agota su cuota de OCR y recibe 403', async () => {
    await Usuario.updateOne({ _id: usuarioId }, { $set: { conteoOcrMes: 5, ultimoReinicioOcr: new Date() } });
    const res = await request(app).post('/api/movimientos/ocr').set(auth(token)).send({ imageBase64: 'a'.repeat(50) });
    expect(res.status).toBe(403);
    expect(res.body.limiteAlcanzado).toBe(true);
    expect((await Usuario.findById(usuarioId)).conteoOcrMes).toBe(5);
  });

  it('un cargo aprobado en Culqi activa Pro y guarda el pago (incluye validar el enum "culqi")', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'chr_integracion_1' }) });
    const res = await request(app).post('/api/pagos/crear-cargo-culqi').set(auth(token)).send({ token: 'tkn_1', monto: 0.01 });
    expect(res.status).toBe(200);

    const cuerpoEnviado = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(cuerpoEnviado.amount).toBe(1990);

    const usuario = await Usuario.findById(usuarioId);
    expect(usuario.esPremium).toBe(true);
    expect(usuario.planTipo).toBe('pro');
    const pago = await Pago.findOne({ nroOperacion: 'chr_integracion_1' });
    expect(pago).not.toBeNull();
    expect(pago.metodo).toBe('culqi');
    expect(pago.monto).toBe(19.9);

    const estado = await request(app).get('/api/pagos/estado-plan').set(auth(token));
    expect(estado.body.esPremium).toBe(true);
  });

  it('un reintento con el mismo cargo no duplica el pago', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'chr_integracion_1' }) });
    await request(app).post('/api/pagos/crear-cargo-culqi').set(auth(token)).send({ token: 'tkn_2' });
    expect(await Pago.countDocuments({ nroOperacion: 'chr_integracion_1' })).toBe(1);
  });

  it('un cargo rechazado no activa Pro', async () => {
    const t2 = await registrarYEntrar('Fede Rechazo', 'fede@test.com');
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ user_message: 'Tarjeta rechazada' }) });
    const res = await request(app).post('/api/pagos/crear-cargo-culqi').set(auth(t2)).send({ token: 'tkn_3' });
    expect(res.status).toBe(402);
    expect((await Usuario.findOne({ email: 'fede@test.com' })).esPremium).not.toBe(true);
  });
});

describe('Eliminación de cuenta (Sprint 7)', () => {
  it('tras eliminar la cuenta no se puede iniciar sesión ni usar el token anterior', async () => {
    const token = await registrarYEntrar('Gus Borrar', 'gus@test.com');
    const del = await request(app).delete('/api/usuarios/me').set(auth(token));
    expect(del.status).toBe(200);

    const enBD = await Usuario.findOne({ email: 'gus@test.com' });
    expect(enBD).not.toBeNull(); // borrado lógico: el registro se conserva
    expect(enBD.estado).toBe('eliminado');

    const login = await request(app).post('/api/usuarios/login').send({ email: 'gus@test.com', password: PASS });
    expect(login.status).toBe(401);

    const conTokenViejo = await request(app).get('/api/usuarios/me').set(auth(token));
    expect(conTokenViejo.status).toBe(401);
  });
});
