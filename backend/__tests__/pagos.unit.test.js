/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/pagos.unit.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas del cobro del Plan Pro y su registro.
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-16, RF-33, RF-34, RF-36, RF-40  (módulos: Cuenta, Perfil, Comprobantes, Plan Pro, Administración, Cierres)
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
 * Reglas de negocio : RN-01, RN-15, RN-17, RN-20, RN-23, RN-24
 * Depende de ......: backend/app.js
 *                    backend/database/pago.model.js
 *                    backend/database/usuario.model.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const request = require('supertest');
const app = require('../app');
const Pago = require('../database/pago.model');
const Usuario = require('../database/usuario.model');

describe('Pagos & Suscripciones Pro - Unit Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /api/pagos/solicitar-pro registra solicitud de pago correctamente', async () => {
    jest.spyOn(Usuario, 'findOne').mockResolvedValue({
      _id: 'user123',
      email: 'pro@test.com'
    });

    jest.spyOn(Pago.prototype, 'save').mockResolvedValue({
      _id: 'pago123',
      email: 'pro@test.com',
      metodo: 'tarjeta',
      nroOperacion: 'CARD-123456',
      monto: 19.9,
      estado: 'pendiente'
    });

    const res = await request(app)
      .post('/api/pagos/solicitar-pro')
      .send({
        email: 'pro@test.com',
        metodo: 'tarjeta',
        nroOperacion: 'CARD-123456',
        monto: 19.9
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/pagos/checkout-directo activa usuario como PRO instantáneamente', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'pro@test.com',
      esPremium: false,
      planTipo: 'free',
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Usuario, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(Pago.prototype, 'save').mockResolvedValue(true);

    const res = await request(app)
      .post('/api/pagos/checkout-directo')
      .send({
        email: 'pro@test.com',
        metodo: 'tarjeta',
        pais: 'Perú',
        monto: 19.9,
        moneda: 'PEN'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.esPremium).toBe(true);
    expect(mockUser.esPremium).toBe(true);
    expect(mockUser.planTipo).toBe('pro');
  });

  it('POST /api/pagos/toggle-dev-plan alterna plan entre Free y Pro', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'pro@test.com',
      esPremium: false,
      planTipo: 'free',
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Usuario, 'findOne').mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/pagos/toggle-dev-plan')
      .send({ email: 'pro@test.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.esPremium).toBe(true);
  });
});
