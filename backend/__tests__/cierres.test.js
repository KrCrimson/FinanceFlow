const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Usuario = require('../database/usuario.model');
const Movimiento = require('../database/movimiento.model');
const Cierre = require('../database/cierre.model');

describe('Cierres API & Logic', () => {
  let token;
  let userId;
  const email = `cierretest_${Date.now()}@test.com`;

  beforeAll(async () => {
    // Registrar usuario
    await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'Test Cierres', email, password: 'password123' });
    
    // Login
    const resLog = await request(app)
      .post('/api/usuarios/login')
      .send({ email, password: 'password123' });
    
    token = resLog.body.token;
    userId = resLog.body.usuario.id || resLog.body.usuario._id;
  });

  afterAll(async () => {
    // Limpieza
    await Movimiento.deleteMany({ userId });
    await Cierre.deleteMany({ userId });
    await Usuario.findByIdAndDelete(userId);
  });

  it('Debería obtener los cierres pendientes (ayer y mes anterior no cerrados)', async () => {
    const res = await request(app)
      .get('/api/cierres/pendientes?localDate=2026-06-16')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.yesterday.isClosed).toBe(false);
    expect(res.body.yesterday.date).toBe('2026-06-15');
    expect(res.body.prevMonth.isClosed).toBe(false);
    expect(res.body.prevMonth.periodo).toBe('2026-05');
  });

  it('Debería crear un cierre diario exitosamente', async () => {
    // 1. Crear un movimiento el 2026-06-15
    await request(app)
      .post('/api/movimientos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Ingreso Ayer',
        monto: 500,
        tipo: 'ingreso',
        categoria: 'Sueldo',
        fecha: '2026-06-15T10:00:00.000Z'
      });
    
    // 2. Realizar el cierre de ayer
    const resCierre = await request(app)
      .post('/api/cierres')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipo: 'diario',
        periodo: '2026-06-15',
        fondoFijo: 1000,
        saldoFisico: 1500,
        comentarios: 'Todo cuadra perfecto',
        password: 'password123'
      });
    
    expect(resCierre.status).toBe(201);
    expect(resCierre.body.saldoEsperado).toBe(1500);
    expect(resCierre.body.diferencia).toBe(0);

    // 3. Comprobar que ayer ahora sale cerrado
    const resPendientes = await request(app)
      .get('/api/cierres/pendientes?localDate=2026-06-16')
      .set('Authorization', `Bearer ${token}`);
    expect(resPendientes.body.yesterday.isClosed).toBe(true);
  });

  it('No debería bloquear la creación de movimientos tras un cierre diario', async () => {
    const res = await request(app)
      .post('/api/movimientos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Gasto permitido diario',
        monto: 50,
        tipo: 'egreso',
        categoria: 'Comida',
        fecha: '2026-06-15T12:00:00.000Z'
      });
    
    expect(res.status).toBe(201);
  });

  it('Debería crear un cierre mensual y requerir contraseña', async () => {
    // 1. Cierre mensual sin contraseña -> Debería fallar
    const resSinPass = await request(app)
      .post('/api/cierres')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipo: 'mensual',
        periodo: '2026-06',
        fondoFijo: 1000,
        saldoFisico: 1450,
        comentarios: 'Cierre mensual de prueba'
      });
    expect(resSinPass.status).toBe(400);

    // 2. Cierre mensual con contraseña correcta -> Debería tener éxito
    const resCierre = await request(app)
      .post('/api/cierres')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipo: 'mensual',
        periodo: '2026-06',
        fondoFijo: 1000,
        saldoFisico: 1450,
        comentarios: 'Cierre mensual de prueba',
        password: 'password123'
      });
    expect(resCierre.status).toBe(201);
  });

  it('Debería bloquear la creación de movimientos en un mes cerrado', async () => {
    const res = await request(app)
      .post('/api/movimientos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Gasto no permitido mensual',
        monto: 50,
        tipo: 'egreso',
        categoria: 'Comida',
        fecha: '2026-06-10T12:00:00.000Z'
      });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('No se pueden registrar movimientos');
  });
});
