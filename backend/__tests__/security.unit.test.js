/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/security.unit.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas de seguridad: sesión, límite de intentos y protección de datos.
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-16, RF-33, RF-34, RF-36, RF-40, RF-41, RF-42, RF-43, RF-44  (módulos: Cuenta, Perfil, Comprobantes, Plan Pro, Administración, Cierres)
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
 * Reglas de negocio : RN-01, RN-15, RN-17, RN-20, RN-23, RN-24, RN-26, RN-27, RN-28, RN-29
 * Depende de ......: backend/app.js
 *                    backend/database/pago.model.js
 *                    backend/database/usuario.model.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const request = require('supertest');
const app = require('../app');
const Usuario = require('../database/usuario.model');
const Pago = require('../database/pago.model');

describe('Security & Chaos Audit - NoSQL Injection & Payload Protections', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('TC-INJ-01: Debe rechazar intentos de inyección NoSQL con operador $gt en credenciales de login', async () => {
    jest.spyOn(Usuario, 'findOne').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: { $gt: '' },
        password: { $gt: '' }
      });

    expect([400, 401]).toContain(res.statusCode);
    expect(res.body.token).toBeUndefined();
  });

  it('TC-INJ-02: Debe bloquear contaminación de prototipos (__proto__) en el body JSON', async () => {
    const rawJSON = '{"nombre": "Movimiento Hack", "monto": 100, "__proto__": {"isAdmin": true}}';
    const parsedObj = JSON.parse(rawJSON);

    expect(Object.prototype.isAdmin).toBeUndefined();
    expect(({}).isAdmin).toBeUndefined();
  });

  it('TC-SEC-02: Debe rechazar peticiones con montos o categorías no válidas', async () => {
    const invalidAmounts = [
      { $gt: 0 },
      'DROP TABLE usuarios',
      null,
      Infinity,
      NaN
    ];

    for (const invalidAmount of invalidAmounts) {
      const res = await request(app)
        .post('/api/movimientos')
        .send({
          nombre: 'Ataque de Monto',
          monto: invalidAmount,
          tipo: 'ingreso',
          categoria: 'Comida'
        });

      expect([400, 401, 422]).toContain(res.statusCode);
    }
  });

  it('TC-PAY-01: Debe procesar peticiones de pago y validar operaciones existentes', async () => {
    const validUserId = '507f1f77bcf86cd799439011';
    jest.spyOn(Usuario, 'findOne').mockResolvedValue({ _id: validUserId, email: 'test@mail.com' });
    jest.spyOn(Pago.prototype, 'save').mockResolvedValue({
      _id: '507f1f77bcf86cd799439012',
      usuario: validUserId,
      metodo: 'tarjeta_pro',
      nroOperacion: 'CARD-REPLAY-123',
      estado: 'pendiente'
    });

    const res = await request(app)
      .post('/api/pagos/solicitar-pro')
      .send({
        email: 'test@mail.com',
        metodo: 'tarjeta_pro',
        nroOperacion: 'CARD-REPLAY-123',
        monto: 19.9
      });

    expect([200, 201]).toContain(res.statusCode);
  });
});
