const request = require('supertest');
const app = require('../app');
const Usuario = require('../database/usuario.model');

describe('Recuperación de Contraseña con Developer Fallback', () => {
  let email;

  beforeAll(async () => {
    email = `recuperar_${Date.now()}@mail.com`;
    // Registrar un usuario de prueba
    await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'Usuario Prueba', email, password: 'password123' });
  });

  it('debe generar enlace de recuperación simulado en modo desarrollo', async () => {
    // Configurar NODE_ENV como development
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    // Guardar EMAIL_USER original y simular valor por defecto
    const originalEmailUser = process.env.EMAIL_USER;
    process.env.EMAIL_USER = 'tu-email-real@gmail.com';

    const res = await request(app)
      .post('/api/usuarios/forgot-password')
      .send({ email });

    expect(res.statusCode).toBe(200);
    expect(res.body.devResetUrl).toBeDefined();
    expect(res.body.devResetUrl).toContain('/reset-password?token=');

    // Restaurar variables de entorno
    process.env.NODE_ENV = originalNodeEnv;
    process.env.EMAIL_USER = originalEmailUser;
  });

  it('debe fallar en producción si el correo no está configurado', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const originalEmailUser = process.env.EMAIL_USER;
    process.env.EMAIL_USER = 'tu-email-real@gmail.com';

    const res = await request(app)
      .post('/api/usuarios/forgot-password')
      .send({ email });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('El sistema de email no está configurado');

    process.env.NODE_ENV = originalNodeEnv;
    process.env.EMAIL_USER = originalEmailUser;
  });

  it('debe poder verificar el token y actualizar la clave', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    process.env.EMAIL_USER = 'tu-email-real@gmail.com';

    const res = await request(app)
      .post('/api/usuarios/forgot-password')
      .send({ email });

    const devResetUrl = res.body.devResetUrl;
    const token = devResetUrl.split('token=')[1];

    // Verificar token
    const resVerify = await request(app)
      .post('/api/usuarios/verify-reset-token')
      .send({ token });
    expect(resVerify.statusCode).toBe(200);
    expect(resVerify.body.message).toBe('Token válido');

    // Restablecer contraseña
    const resReset = await request(app)
      .post('/api/usuarios/reset-password')
      .send({ token, newPassword: 'nuevapassword123' });
    expect(resReset.statusCode).toBe(200);
    expect(resReset.body.message).toBe('Contraseña actualizada exitosamente');

    // Probar login con nueva clave
    const loginRes = await request(app)
      .post('/api/usuarios/login')
      .send({ email, password: 'nuevapassword123' });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();

    process.env.NODE_ENV = originalNodeEnv;
  });
});
