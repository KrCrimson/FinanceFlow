/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/usuarios.controller.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas de las respuestas de cuenta (registro, inicio de sesión, perfil, baja).
 * Requerimientos ..: RF-01, RF-02, RF-04, RF-05, RF-07, RF-08, RF-16, RF-33, RF-40, RF-41, RF-42, RF-43, RF-44  (módulos: Cuenta, Perfil, Comprobantes, Plan Pro, Cierres)
 * Calidad (RNF) ...: RNF-01, RNF-02, RNF-03, RNF-04, RNF-05, RNF-06, RNF-14
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
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-01, RN-09, RN-15, RN-20, RN-23, RN-24, RN-26, RN-27, RN-28, RN-29
 * Depende de ......: backend/app.js
 *                    backend/database/usuario.model.js
 *                    backend/services/usuarios.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */

const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Usuario = require('../database/usuario.model');
const usuariosService = require('../services/usuarios.service');

describe('UsuariosController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registra usuario nuevo', async () => {
    jest.spyOn(usuariosService, 'register').mockResolvedValue({
      id: 'mockuser123',
      nombre: 'Test',
      email: 'test@mail.com',
      estado: 'activo',
      creadoEn: new Date()
    });

    const email = `test${Date.now()}@mail.com`;
    const res = await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'Test', email, password: '123456' });
    expect(res.statusCode).toBe(201);
  });
  
  it('no permite registro duplicado', async () => {
    jest.spyOn(usuariosService, 'register')
      .mockResolvedValueOnce({ id: 'mock123' })
      .mockRejectedValueOnce(new Error('El email ya está registrado'));

    const email = `dup${Date.now()}@mail.com`;
    await request(app).post('/api/usuarios/register').send({ nombre: 'Test', email, password: '123456' });
    const res = await request(app).post('/api/usuarios/register').send({ nombre: 'Test', email, password: '123456' });
    expect(res.statusCode).not.toBe(201);
  });
});

describe('UsuariosController - Perfil', () => {
  let token;
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

  beforeAll(() => {
    token = jwt.sign({ id: 'mockuser123', email: 'mock@test.com' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET /api/usuarios/me retorna el perfil sin passwordHash', async () => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue({
      _id: 'mockuser123',
      nombre: 'Mock User',
      email: 'mock@test.com',
      estado: 'activo'
    });

    jest.spyOn(usuariosService, 'obtenerUsuarioPorId').mockResolvedValue({
      id: 'mockuser123',
      nombre: 'Mock User',
      email: 'mock@test.com',
      estado: 'activo',
      creadoEn: '2026-06-15T00:00:00.000Z'
    });

    const res = await request(app)
      .get('/api/usuarios/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Mock User');
    expect(res.body.email).toBe('mock@test.com');
    expect(res.body.passwordHash).toBeUndefined();
    expect(res.body.password).toBeUndefined();
  });

  it('PUT /api/usuarios/me actualiza el perfil con éxito', async () => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue({
      _id: 'mockuser123',
      nombre: 'Mock User',
      email: 'mock@test.com',
      estado: 'activo'
    });

    jest.spyOn(usuariosService, 'editarUsuario').mockResolvedValue({
      id: 'mockuser123',
      nombre: 'Updated Mock User',
      email: 'updated@test.com',
      estado: 'activo',
      creadoEn: '2026-06-15T00:00:00.000Z'
    });

    const res = await request(app)
      .put('/api/usuarios/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Updated Mock User', email: 'updated@test.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Updated Mock User');
    expect(res.body.email).toBe('updated@test.com');
  });
});

