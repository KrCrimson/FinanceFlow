/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/logs.controller.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas del registro de eventos.
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-16, RF-33, RF-37, RF-40  (módulos: Cuenta, Perfil, Comprobantes, Plan Pro, Administración, Cierres)
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
 * Reglas de negocio : RN-01, RN-15, RN-20, RN-22, RN-23, RN-24
 * Depende de ......: backend/app.js
 *                    backend/database/log.model.js
 *                    backend/database/usuario.model.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Log = require('../database/log.model');
const Usuario = require('../database/usuario.model');

describe('LogsController Unit Tests', () => {
  let token;
  const JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-32-chars-minimum-key';

  beforeAll(() => {
    token = jwt.sign({ id: 'mockadmin123', email: 'admin@mail.com', rol: 'admin' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('lista logs (requiere auth y rol admin)', async () => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue({
      _id: 'mockadmin123',
      email: 'admin@mail.com',
      rol: 'admin'
    });

    jest.spyOn(Log, 'find').mockResolvedValue([
      { _id: 'log1', accion: 'LOGIN', fecha: new Date() }
    ]);

    const res = await request(app)
      .get('/api/logs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
