
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

