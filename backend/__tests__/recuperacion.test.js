const request = require('supertest');
const app = require('../app');
const Usuario = require('../database/usuario.model');
const bcrypt = require('bcryptjs');

describe('Recuperación de Contraseña - Unit Tests', () => {
  const email = 'recuperar@mail.com';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe generar enlace de recuperación simulado en modo desarrollo', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    process.env.EMAIL_USER = 'tu-email-real@gmail.com';

    jest.spyOn(Usuario, 'findOne').mockResolvedValue({
      _id: 'user123',
      email,
      save: jest.fn().mockResolvedValue(true)
    });

    const res = await request(app)
      .post('/api/usuarios/forgot-password')
      .send({ email });

    expect(res.statusCode).toBe(200);
    expect(res.body.devResetUrl).toBeDefined();
    expect(res.body.devResetUrl).toContain('/reset-password?token=');

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('debe verificar token de recuperación correctamente', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    jest.spyOn(Usuario, 'findOne').mockResolvedValue({
      _id: 'user123',
      email,
      resetPasswordToken: 'mocktoken123',
      resetPasswordExpires: futureDate
    });

    const resVerify = await request(app)
      .post('/api/usuarios/verify-reset-token')
      .send({ token: 'mocktoken123' });

    expect(resVerify.statusCode).toBe(200);
    expect(resVerify.body.message).toBe('Token válido');
  });

  it('debe restablecer la contraseña con token válido', async () => {
    const futureDate = new Date(Date.now() + 3600000);
    const mockUser = {
      _id: 'user123',
      email,
      resetPasswordToken: 'mocktoken123',
      resetPasswordExpires: futureDate,
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Usuario, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('new_hashed_password');

    const resReset = await request(app)
      .post('/api/usuarios/reset-password')
      .send({ token: 'mocktoken123', newPassword: 'nuevapassword123' });

    expect(resReset.statusCode).toBe(200);
    expect(resReset.body.message).toBe('Contraseña actualizada exitosamente');
    expect(mockUser.resetPasswordToken).toBeNull();
  });
});
