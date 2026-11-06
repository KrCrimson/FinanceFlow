/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/recuperacion.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas de la solicitud y el restablecimiento de contraseña (enlace de 10 minutos, un solo uso).
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-16, RF-33, RF-40, RF-41, RF-42, RF-43, RF-44  (módulos: Cuenta, Perfil, Comprobantes, Plan Pro, Cierres)
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
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-01, RN-15, RN-20, RN-23, RN-24, RN-26, RN-27, RN-28, RN-29
 * Depende de ......: backend/app.js
 *                    backend/database/usuario.model.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
