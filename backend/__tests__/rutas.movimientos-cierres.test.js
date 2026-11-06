/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/rutas.movimientos-cierres.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de rutas.movimientos-cierres: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-09, RF-11, RF-12, RF-13, RF-14, RF-15, RF-16, RF-17, RF-21, RF-27, RF-28, RF-29, RF-30, RF-33, RF-40  (módulos: Cuenta, Perfil, Movimientos, Comprobantes, Panel, Cierres, Plan Pro)
 * Calidad (RNF) ...: RNF-01, RNF-02, RNF-03, RNF-04, RNF-05, RNF-06, RNF-12, RNF-13, RNF-14
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
 * Reglas de negocio : RN-01, RN-03, RN-04, RN-05, RN-06, RN-11, RN-12, RN-13, RN-14, RN-15, RN-20, RN-23, RN-24
 * Depende de ......: backend/app.js
 *                    backend/database/usuario.model.js
 *                    backend/services/cierres.service.js
 *                    backend/services/movimientos.service.js
 *                    backend/services/ocr.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Usuario = require('../database/usuario.model');
const movimientosService = require('../services/movimientos.service');
const cierresService = require('../services/cierres.service');

const JWT_SECRET = process.env.JWT_SECRET || 'testsecretkey1234567890';
const token = jwt.sign({ id: 'user1', email: 'u@test.com' }, JWT_SECRET);
const auth = { Authorization: `Bearer ${token}` };

afterEach(() => jest.restoreAllMocks());

describe('Rutas de movimientos - validación y respuestas', () => {
  const body = { nombre: 'Compra', monto: 50, tipo: 'egreso', categoria: 'Comida' };

  it('exige sesión en todas las rutas', async () => {
    const r = await request(app).get('/api/movimientos');
    expect(r.status).toBe(401);
  });

  it('crea un egreso (regresión: el tipo debe ser "egreso", no "gasto")', async () => {
    const crear = jest.spyOn(movimientosService, 'crearMovimiento').mockImplementation(async (d) => ({ _id: 'm1', ...d }));
    const res = await request(app).post('/api/movimientos').set(auth).send(body);
    expect(res.status).toBe(201);
    expect(crear.mock.calls[0][0]).toMatchObject({ tipo: 'egreso', userId: 'user1' });
  });

  it('rechaza con 400 el tipo "gasto" antes de llegar al servicio', async () => {
    const crear = jest.spyOn(movimientosService, 'crearMovimiento');
    const res = await request(app).post('/api/movimientos').set(auth).send({ ...body, tipo: 'gasto' });
    expect(res.status).toBe(400);
    expect(crear).not.toHaveBeenCalled();
  });

  it('conserva estado y recurrencia al pasar por la validación (no los descarta)', async () => {
    const crear = jest.spyOn(movimientosService, 'crearMovimiento').mockResolvedValue({});
    await request(app)
      .post('/api/movimientos')
      .set(auth)
      .send({ ...body, estado: 'planificado', esRecurrente: true });
    expect(crear.mock.calls[0][0]).toMatchObject({ estado: 'planificado', esRecurrente: true });
  });

  it.each([
    [{ monto: -1 }],
    [{ monto: '50' }],
    [{ nombre: '' }],
    [{ categoria: undefined }],
  ])('rechaza con 400 datos inválidos %j', async (cambio) => {
    const res = await request(app).post('/api/movimientos').set(auth).send({ ...body, ...cambio });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/inválidos/);
  });

  it('un error de negocio al crear responde 400 con el mensaje', async () => {
    jest.spyOn(movimientosService, 'crearMovimiento').mockRejectedValue(new Error('período cerrado'));
    const res = await request(app).post('/api/movimientos').set(auth).send(body);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('período cerrado');
  });

  it('lista los movimientos del usuario autenticado', async () => {
    const listar = jest.spyOn(movimientosService, 'listarMovimientos').mockResolvedValue([{ _id: 'm1' }]);
    const res = await request(app).get('/api/movimientos').set(auth);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ _id: 'm1' }]);
    expect(listar).toHaveBeenCalledWith('user1');
  });

  it('si falla el listado responde 500', async () => {
    jest.spyOn(movimientosService, 'listarMovimientos').mockRejectedValue(new Error('db'));
    const res = await request(app).get('/api/movimientos').set(auth);
    expect(res.status).toBe(500);
  });

  it('editar pasa id, datos y usuario al servicio', async () => {
    const editar = jest.spyOn(movimientosService, 'editarMovimiento').mockResolvedValue({ _id: 'm1', monto: 9 });
    const res = await request(app).put('/api/movimientos/m1').set(auth).send({ monto: 9 });
    expect(res.status).toBe(200);
    expect(editar).toHaveBeenCalledWith('m1', { monto: 9 }, 'user1');
  });

  it('editar un movimiento ajeno responde 400 con el mensaje de autorización', async () => {
    jest.spyOn(movimientosService, 'editarMovimiento').mockRejectedValue(new Error('No autorizado para modificar este movimiento'));
    const res = await request(app).put('/api/movimientos/m1').set(auth).send({ monto: 9 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/No autorizado/);
  });

  it.each(['inhabilitar', 'inactivar'])('PATCH /:id/%s deja el movimiento inactivo', async (accion) => {
    const inh = jest.spyOn(movimientosService, 'inhabilitarMovimiento').mockResolvedValue({ estado: 'inactivo' });
    const res = await request(app).patch(`/api/movimientos/m1/${accion}`).set(auth);
    expect(res.status).toBe(200);
    expect(inh).toHaveBeenCalledWith('m1', 'user1');
  });

  it('el movimiento histórico con contraseña incorrecta responde 401', async () => {
    jest.spyOn(movimientosService, 'crearMovimientoHistorico').mockRejectedValue(new Error('Contraseña incorrecta'));
    const res = await request(app)
      .post('/api/movimientos/historico')
      .set(auth)
      .send({ ...body, fecha: '2026-01-10', password: 'x' });
    expect(res.status).toBe(401);
  });

  it('el movimiento histórico válido responde 201', async () => {
    jest.spyOn(movimientosService, 'crearMovimientoHistorico').mockResolvedValue({ _id: 'h1' });
    const res = await request(app)
      .post('/api/movimientos/historico')
      .set(auth)
      .send({ ...body, fecha: '2026-01-10', password: 'ok' });
    expect(res.status).toBe(201);
  });
});

describe('OCR de comprobantes - cuota mensual del plan gratuito', () => {
  const imagen = { imageBase64: 'a'.repeat(50), mimeType: 'image/png' };
  const ruta = '/api/movimientos/ocr';
  let ocrService;

  beforeEach(() => {
    ocrService = require('../services/ocr.service');
    jest.spyOn(Usuario, 'findById').mockResolvedValue({ _id: 'user1', estado: 'activo', ultimoReinicioOcr: new Date() });
    jest.spyOn(Usuario, 'updateOne').mockResolvedValue({});
  });

  it('rechaza una imagen ausente o demasiado corta (validación Zod)', async () => {
    const res = await request(app).post(ruta).set(auth).send({ imageBase64: 'corta' });
    expect(res.status).toBe(400);
  });

  it('responde 403 con limiteAlcanzado cuando el plan gratuito agotó los 5 escaneos', async () => {
    jest.spyOn(Usuario, 'findOneAndUpdate').mockResolvedValue(null);
    const analizar = jest.spyOn(ocrService, 'analizarComprobante');
    const res = await request(app).post(ruta).set(auth).send(imagen);
    expect(res.status).toBe(403);
    expect(res.body.limiteAlcanzado).toBe(true);
    expect(analizar).not.toHaveBeenCalled();
  });

  it('con cupo disponible devuelve los datos del OCR', async () => {
    jest.spyOn(Usuario, 'findOneAndUpdate').mockResolvedValue({ esPremium: false, conteoOcrMes: 1 });
    jest.spyOn(ocrService, 'analizarComprobante').mockResolvedValue({ monto: 25, nombre: 'Bodega' });
    const res = await request(app).post(ruta).set(auth).send(imagen);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { monto: 25, nombre: 'Bodega' } });
  });

  it('si el OCR falla devuelve el escaneo consumido al usuario gratuito', async () => {
    jest.spyOn(Usuario, 'findOneAndUpdate').mockResolvedValue({ esPremium: false });
    jest.spyOn(ocrService, 'analizarComprobante').mockRejectedValue(new Error('Gemini caído'));
    const res = await request(app).post(ruta).set(auth).send(imagen);
    expect(res.status).toBe(500);
    expect(Usuario.updateOne).toHaveBeenCalledWith({ _id: 'user1' }, { $inc: { conteoOcrMes: -1 } });
  });

  it('un usuario Pro no necesita reembolso de cupo si el OCR falla', async () => {
    jest.spyOn(Usuario, 'findOneAndUpdate').mockResolvedValue({ esPremium: true });
    jest.spyOn(ocrService, 'analizarComprobante').mockRejectedValue(new Error('Gemini caído'));
    await request(app).post(ruta).set(auth).send(imagen);
    expect(Usuario.updateOne).not.toHaveBeenCalledWith({ _id: 'user1' }, { $inc: { conteoOcrMes: -1 } });
  });
});

describe('Rutas de cierres - códigos de respuesta', () => {
  it('crear cierre: contraseña incorrecta devuelve 401', async () => {
    jest.spyOn(cierresService, 'crearCierre').mockRejectedValue(new Error('Contraseña incorrecta'));
    const res = await request(app).post('/api/cierres').set(auth).send({});
    expect(res.status).toBe(401);
  });

  it('crear cierre: otro error de negocio devuelve 400', async () => {
    jest.spyOn(cierresService, 'crearCierre').mockRejectedValue(new Error('Ya existe un cierre'));
    const res = await request(app).post('/api/cierres').set(auth).send({});
    expect(res.status).toBe(400);
  });

  it('crear cierre: éxito devuelve 201', async () => {
    jest.spyOn(cierresService, 'crearCierre').mockResolvedValue({ _id: 'c1' });
    const res = await request(app).post('/api/cierres').set(auth).send({});
    expect(res.status).toBe(201);
  });

  it('el resumen exige tipo y periodo', async () => {
    const res = await request(app).get('/api/cierres/resumen').set(auth);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/requeridos/);
  });

  it('el resumen devuelve los totales del periodo', async () => {
    jest.spyOn(cierresService, 'obtenerResumenPeriodo').mockResolvedValue({ ingresosTotales: 10, egresosTotales: 4, count: 2 });
    const res = await request(app).get('/api/cierres/resumen?tipo=mensual&periodo=2026-09').set(auth);
    expect(res.status).toBe(200);
    expect(res.body.ingresosTotales).toBe(10);
  });

  it('lista los cierres del usuario', async () => {
    jest.spyOn(cierresService, 'listarCierres').mockResolvedValue([{ _id: 'c1' }]);
    const res = await request(app).get('/api/cierres').set(auth);
    expect(res.body).toEqual([{ _id: 'c1' }]);
  });

  it('si falla el listado de cierres responde 500', async () => {
    jest.spyOn(cierresService, 'listarCierres').mockRejectedValue(new Error('db'));
    const res = await request(app).get('/api/cierres').set(auth);
    expect(res.status).toBe(500);
  });

  it('reabrir: contraseña incorrecta devuelve 401 y éxito devuelve 200', async () => {
    const reabrir = jest.spyOn(cierresService, 'reabrirCierre');
    reabrir.mockRejectedValueOnce(new Error('Contraseña incorrecta'));
    expect((await request(app).post('/api/cierres/reabrir').set(auth).send({})).status).toBe(401);
    reabrir.mockResolvedValueOnce({ message: 'Periodo reabierto exitosamente' });
    expect((await request(app).post('/api/cierres/reabrir').set(auth).send({})).status).toBe(200);
  });

  it('reabrir: otro error devuelve 400', async () => {
    jest.spyOn(cierresService, 'reabrirCierre').mockRejectedValue(new Error('No se encontró ningún cierre'));
    const res = await request(app).post('/api/cierres/reabrir').set(auth).send({});
    expect(res.status).toBe(400);
  });

  it('pendientes: un error devuelve 400', async () => {
    jest.spyOn(cierresService, 'obtenerCierresPendientes').mockRejectedValue(new Error('fecha inválida'));
    const res = await request(app).get('/api/cierres/pendientes').set(auth);
    expect(res.status).toBe(400);
  });
});
