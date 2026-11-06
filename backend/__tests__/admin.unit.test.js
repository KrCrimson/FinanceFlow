/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/admin.unit.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas del portal de administración (métricas, planes, pagos, permisos).
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-09, RF-10, RF-13, RF-16, RF-17, RF-25, RF-33, RF-34, RF-36, RF-40, RF-41, RF-42, RF-43, RF-44  (módulos: Cuenta, Perfil, Movimientos, Comprobantes, Planificador, Plan Pro, Administración, Cierres)
 * Calidad (RNF) ...: RNF-01, RNF-02, RNF-03, RNF-04, RNF-06, RNF-12, RNF-14
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
 * Reglas de negocio : RN-01, RN-03, RN-04, RN-05, RN-06, RN-15, RN-17, RN-19, RN-20, RN-23, RN-24, RN-26, RN-27, RN-28, RN-29
 * Depende de ......: backend/app.js
 *                    backend/database/movimiento.model.js
 *                    backend/database/pago.model.js
 *                    backend/database/usuario.model.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Usuario = require('../database/usuario.model');
const Pago = require('../database/pago.model');
const Movimiento = require('../database/movimiento.model');

describe('Admin Dashboard - Unit Tests', () => {
  let adminToken;
  const JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-32-chars-minimum-key';

  beforeAll(() => {
    adminToken = jwt.sign({ id: 'admin123', email: 'admin@financeflow.com', rol: 'admin', mfa: true }, JWT_SECRET);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET /api/admin/metrics retorna métricas completas de usuarios, suscripciones y pagos', async () => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue({
      _id: 'admin123',
      email: 'admin@financeflow.com',
      rol: 'admin'
    });

    jest.spyOn(Usuario, 'countDocuments').mockImplementation((filter) => {
      if (!filter || Object.keys(filter).length === 0) return Promise.resolve(10);
      if (filter.esPremium === true) return Promise.resolve(4);
      if (filter.esPremium === false) return Promise.resolve(6);
      return Promise.resolve(0);
    });

    jest.spyOn(Usuario, 'aggregate').mockResolvedValue([{ totalConsultas: 25 }]);

    jest.spyOn(Pago, 'aggregate').mockResolvedValue([
      { _id: 'aprobado', total: 79.6 },
      { _id: 'pendiente', total: 19.9 }
    ]);

    jest.spyOn(Pago, 'countDocuments').mockResolvedValue(1);

    const res = await request(app)
      .get('/api/admin/metrics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalUsuarios).toBe(10);
    expect(res.body.usuariosPro).toBe(4);
    expect(res.body.usuariosFree).toBe(6);
  });

  it('POST /api/admin/toggle-premium otorga o revoca Pro a usuario', async () => {
    const mockTargetUser = {
      _id: 'user123',
      email: 'target@test.com',
      esPremium: false,
      planTipo: 'free',
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Usuario, 'findById').mockImplementation((id) => {
      if (id === 'admin123') {
        return Promise.resolve({
          _id: 'admin123',
          email: 'admin@financeflow.com',
          rol: 'admin'
        });
      }
      return Promise.resolve(mockTargetUser);
    });

    const res = await request(app)
      .post('/api/admin/toggle-premium')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userId: 'user123', esPremium: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockTargetUser.esPremium).toBe(true);
    expect(mockTargetUser.planTipo).toBe('pro');
  });
});
