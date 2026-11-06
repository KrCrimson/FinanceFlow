/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/errorHandler.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de errorHandler: verifican que el comportamiento descrito en el SRS se cumple.
 * Calidad (RNF) ...: RNF-10, RNF-14
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
 * Depende de ......: backend/middlewares/errorHandler.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const errorHandler = require('../middlewares/errorHandler');

const crearRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const req = { method: 'POST', path: '/api/test' };

describe('errorHandler', () => {
  const entornoOriginal = process.env.NODE_ENV;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    process.env.NODE_ENV = entornoOriginal;
    jest.restoreAllMocks();
  });

  it('responde 400 ante un JSON mal formado', () => {
    const err = Object.assign(new SyntaxError('Unexpected token'), { status: 400, body: '{' });
    const res = crearRes();
    errorHandler(err, req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Formato JSON inválido en la solicitud' });
  });

  it('responde 400 ante un error de validación y muestra los detalles fuera de producción', () => {
    process.env.NODE_ENV = 'test';
    const err = { name: 'ValidationError', errors: { monto: { message: 'monto requerido' } } };
    const res = crearRes();
    errorHandler(err, req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error de validación de datos',
      detalles: ['monto requerido'],
    });
  });

  it('en producción no filtra los detalles internos de validación', () => {
    process.env.NODE_ENV = 'production';
    const err = { name: 'ValidationError', errors: { monto: { message: 'monto requerido' } } };
    const res = crearRes();
    errorHandler(err, req, res, jest.fn());
    expect(res.json.mock.calls[0][0].detalles).toBeUndefined();
  });

  it('responde 400 ante un CastError sin revelar el esquema', () => {
    const res = crearRes();
    errorHandler({ name: 'CastError', message: 'Cast to ObjectId failed for model Usuario' }, req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Identificador o formato de parámetro inválido' });
  });

  it.each(['JsonWebTokenError', 'TokenExpiredError'])('responde 401 ante %s', (name) => {
    const res = crearRes();
    errorHandler({ name, message: 'x' }, req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Sesión inválida o expirada' });
  });

  it('responde 403 ante un error de CORS', () => {
    const res = crearRes();
    errorHandler(new Error('Not allowed by CORS'), req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('usa el status del error y su mensaje fuera de producción', () => {
    process.env.NODE_ENV = 'test';
    const res = crearRes();
    errorHandler(Object.assign(new Error('no existe'), { statusCode: 404 }), req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'no existe' });
  });

  it('en producción un error inesperado devuelve 500 con mensaje genérico', () => {
    process.env.NODE_ENV = 'production';
    const res = crearRes();
    errorHandler(new Error('detalle interno con datos sensibles'), req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
  });
});
