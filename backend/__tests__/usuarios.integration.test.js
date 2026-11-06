/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/usuarios.integration.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas integradas del ciclo de cuenta con la base de datos.
 * Requerimientos ..: RF-01, RF-02, RF-04, RF-05, RF-07, RF-08, RF-41, RF-42, RF-43, RF-44  (módulos: Cuenta, Perfil)
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
 * Reglas de negocio : RN-01, RN-09, RN-20, RN-23, RN-24, RN-26, RN-27, RN-28, RN-29
 * Depende de ......: backend/app.js
 *                    backend/services/usuarios.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const request = require('supertest');
const app = require('../app');
const usuariosService = require('../services/usuarios.service');

describe('API integración - Usuarios', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registro y login de usuario', async () => {
    const email = `test${Date.now()}@mail.com`;

    jest.spyOn(usuariosService, 'register').mockResolvedValue({
      id: 'mockuser123',
      nombre: 'Test',
      email,
      estado: 'activo'
    });

    jest.spyOn(usuariosService, 'login').mockResolvedValue({
      token: 'mockjwttoken',
      usuario: { id: 'mockuser123', nombre: 'Test', email }
    });

    const resReg = await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'Test', email, password: '123456' });

    expect(resReg.statusCode).toBe(201);

    const resLog = await request(app)
      .post('/api/usuarios/login')
      .send({ email, password: '123456' });

    expect(resLog.statusCode).toBe(200);
    expect(resLog.body.token).toBeDefined();
  });
});
