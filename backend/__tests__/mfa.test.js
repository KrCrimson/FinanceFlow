/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/mfa.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas de la verificación en dos pasos: activación, segundo factor al iniciar sesión, no reutilizar códigos, bloqueo tras 5 fallos, desactivación y obligatoriedad para el administrador.
 * Requerimientos ..: RF-01, RF-02, RF-04, RF-05, RF-07, RF-08, RF-16, RF-33, RF-40, RF-41, RF-42, RF-43, RF-44  (módulos: Cuenta, Perfil, Comprobantes, Plan Pro, Cierres)
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
 * Reglas de negocio : RN-01, RN-09, RN-15, RN-20, RN-23, RN-24, RN-26, RN-27, RN-28, RN-29
 * Depende de ......: backend/app.js
 *                    backend/database/usuario.model.js
 *                    backend/services/usuarios.service.js
 *                    backend/utils/totp.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Usuario = require('../database/usuario.model');
const servicio = require('../services/usuarios.service');
const totp = require('../utils/totp');

const JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-32-chars-minimum-key';

// Cuenta falsa en memoria: findById/findOne devuelven siempre el mismo objeto y save() no toca la base de datos
function crearCuenta(extra = {}) {
  const doc = {
    _id: 'u1', id: 'u1', nombre: 'Ana', email: 'ana@test.com',
    passwordHash: bcrypt.hashSync('secreta1', 4), estado: 'activo', rol: 'user',
    mfaActivo: false, mfaSecreto: null, mfaSecretoPendiente: null, mfaUltimoPaso: 0,
    mfaCodigosRecuperacion: [], mfaIntentosFallidos: 0, mfaBloqueadoHasta: null,
    ...extra,
  };
  doc.save = jest.fn().mockResolvedValue(doc);
  return doc;
}
const conMfa = (extra = {}) => {
  const secreto = totp.generarSecreto();
  const { claros, hashes } = totp.generarCodigosRecuperacion(8);
  return { cuenta: crearCuenta({ mfaActivo: true, mfaSecreto: totp.cifrar(secreto), mfaCodigosRecuperacion: hashes, ...extra }), secreto, claros };
};
const simular = (cuenta) => {
  jest.spyOn(Usuario, 'findById').mockImplementation(async () => cuenta);
  jest.spyOn(Usuario, 'findOne').mockImplementation(async () => cuenta);
};

afterEach(() => { jest.restoreAllMocks(); delete process.env.ADMIN_EMAILS; });

describe('MFA · activación (servicio)', () => {
  test('flujo completo: configurar → activar con el código de la app → 8 códigos de recuperación', async () => {
    const cuenta = crearCuenta(); simular(cuenta);
    const { secreto, otpauthUrl } = await servicio.mfaIniciarConfiguracion('u1');
    expect(secreto).toMatch(/^[A-Z2-7]{32}$/);
    expect(otpauthUrl).toContain('otpauth://totp/FinanceFlow:ana%40test.com');
    expect(cuenta.mfaActivo).toBe(false);                       // todavía no está activo
    expect(cuenta.mfaSecretoPendiente).not.toContain(secreto);  // se guarda cifrado

    const { codigosRecuperacion } = await servicio.mfaActivar('u1', totp.totp(secreto));
    expect(codigosRecuperacion).toHaveLength(8);
    expect(cuenta.mfaActivo).toBe(true);
    expect(cuenta.mfaSecretoPendiente).toBeNull();
    expect(cuenta.mfaSecreto).toMatch(/^v1:/);
    expect(cuenta.mfaCodigosRecuperacion).toHaveLength(8);
    expect(cuenta.mfaCodigosRecuperacion.join('')).not.toContain(codigosRecuperacion[0].replace('-', '')); // solo hashes
  });

  test('un código incorrecto no activa el MFA', async () => {
    const cuenta = crearCuenta(); simular(cuenta);
    await servicio.mfaIniciarConfiguracion('u1');
    await expect(servicio.mfaActivar('u1', '000000')).rejects.toThrow('Código incorrecto');
    expect(cuenta.mfaActivo).toBe(false);
  });

  test('no se puede activar sin pedir antes la configuración', async () => {
    simular(crearCuenta());
    await expect(servicio.mfaActivar('u1', '123456')).rejects.toThrow('Primero solicite la configuración');
  });

  test('no se puede configurar de nuevo si ya está activo', async () => {
    simular(conMfa().cuenta);
    await expect(servicio.mfaIniciarConfiguracion('u1')).rejects.toThrow('ya está activa');
  });

  test('cada configuración genera un secreto distinto', async () => {
    const cuenta = crearCuenta(); simular(cuenta);
    const a = await servicio.mfaIniciarConfiguracion('u1');
    const b = await servicio.mfaIniciarConfiguracion('u1');
    expect(a.secreto).not.toBe(b.secreto);
  });
});

describe('MFA · verificación al iniciar sesión (servicio)', () => {
  test('acepta el código de la app y no deja reutilizarlo', async () => {
    const { cuenta, secreto } = conMfa(); simular(cuenta);
    const codigo = totp.totp(secreto);
    expect(await servicio.mfaVerificarLogin('u1', codigo)).toEqual({ metodo: 'totp' });
    await expect(servicio.mfaVerificarLogin('u1', codigo)).rejects.toThrow('Código incorrecto'); // reutilización
  });

  test('un código de recuperación sirve una sola vez', async () => {
    const { cuenta, claros } = conMfa(); simular(cuenta);
    expect(await servicio.mfaVerificarLogin('u1', claros[0])).toEqual({ metodo: 'recuperacion', codigosRestantes: 7 });
    await expect(servicio.mfaVerificarLogin('u1', claros[0])).rejects.toThrow('Código incorrecto');
    expect(await servicio.mfaVerificarLogin('u1', claros[1].toLowerCase())).toEqual({ metodo: 'recuperacion', codigosRestantes: 6 });
  });

  test('un código incorrecto se rechaza y cuenta como intento fallido', async () => {
    const { cuenta } = conMfa(); simular(cuenta);
    await expect(servicio.mfaVerificarLogin('u1', '000000')).rejects.toThrow('Código incorrecto');
    expect(cuenta.mfaIntentosFallidos).toBe(1);
  });

  test('tras 5 fallos seguidos bloquea 15 minutos, incluso con un código correcto', async () => {
    const { cuenta, secreto } = conMfa(); simular(cuenta);
    for (let i = 0; i < 5; i += 1) await expect(servicio.mfaVerificarLogin('u1', '000000')).rejects.toThrow('Código incorrecto');
    expect(cuenta.mfaBloqueadoHasta.getTime()).toBeGreaterThan(Date.now() + 14 * 60 * 1000);
    await expect(servicio.mfaVerificarLogin('u1', totp.totp(secreto))).rejects.toThrow('Demasiados intentos');
    cuenta.mfaBloqueadoHasta = new Date(Date.now() - 1000); // el bloqueo vence
    expect(await servicio.mfaVerificarLogin('u1', totp.totp(secreto))).toEqual({ metodo: 'totp' });
    expect(cuenta.mfaIntentosFallidos).toBe(0);
  });

  test('un acierto reinicia el contador de fallos', async () => {
    const { cuenta, secreto } = conMfa(); simular(cuenta);
    await expect(servicio.mfaVerificarLogin('u1', '111111')).rejects.toThrow();
    await servicio.mfaVerificarLogin('u1', totp.totp(secreto));
    expect(cuenta.mfaIntentosFallidos).toBe(0);
  });

  test('una cuenta eliminada o sin MFA nunca pasa', async () => {
    simular(crearCuenta());
    await expect(servicio.mfaVerificarLogin('u1', '123456')).rejects.toThrow('Código incorrecto');
    const { cuenta } = conMfa({ estado: 'eliminado' }); simular(cuenta);
    await expect(servicio.mfaVerificarLogin('u1', '123456')).rejects.toThrow('Código incorrecto');
  });
});

describe('MFA · desactivación (servicio)', () => {
  test('pide contraseña y código; con ambos correctos lo desactiva y borra los secretos', async () => {
    const { cuenta, claros } = conMfa(); simular(cuenta);
    await servicio.mfaDesactivar('u1', 'secreta1', claros[0]);
    expect(cuenta.mfaActivo).toBe(false);
    expect(cuenta.mfaSecreto).toBeNull();
    expect(cuenta.mfaCodigosRecuperacion).toEqual([]);
  });

  test('contraseña incorrecta: no lo desactiva', async () => {
    const { cuenta, claros } = conMfa(); simular(cuenta);
    await expect(servicio.mfaDesactivar('u1', 'mala', claros[0])).rejects.toThrow('Contraseña incorrecta');
    expect(cuenta.mfaActivo).toBe(true);
  });

  test('código incorrecto: no lo desactiva', async () => {
    const { cuenta } = conMfa(); simular(cuenta);
    await expect(servicio.mfaDesactivar('u1', 'secreta1', '000000')).rejects.toThrow('Código incorrecto');
    expect(cuenta.mfaActivo).toBe(true);
  });

  test('el administrador (por rol o por ADMIN_EMAILS) no puede desactivarlo', async () => {
    const a = conMfa({ rol: 'admin' }); simular(a.cuenta);
    await expect(servicio.mfaDesactivar('u1', 'secreta1', a.claros[0])).rejects.toThrow('administrador no puede desactivar');
    process.env.ADMIN_EMAILS = 'otro@x.com, ANA@test.com';
    const b = conMfa(); simular(b.cuenta);
    await expect(servicio.mfaDesactivar('u1', 'secreta1', b.claros[0])).rejects.toThrow('administrador no puede desactivar');
    expect(b.cuenta.mfaActivo).toBe(true);
  });

  test('si no está activo, avisa', async () => {
    simular(crearCuenta());
    await expect(servicio.mfaDesactivar('u1', 'secreta1', '123456')).rejects.toThrow('no está activa');
  });
});

describe('MFA · inicio de sesión (API)', () => {
  test('con MFA activo, el login NO entrega sesión: solo un token temporal para el paso 2', async () => {
    const { cuenta } = conMfa(); simular(cuenta);
    const res = await request(app).post('/api/usuarios/login').send({ email: 'ana@test.com', password: 'secreta1' });
    expect(res.statusCode).toBe(200);
    expect(res.body.mfaRequerido).toBe(true);
    expect(res.body.token).toBeUndefined();
    expect(res.body.usuario).toBeUndefined();
    const dec = jwt.verify(res.body.mfaToken, JWT_SECRET);
    expect(dec.tipo).toBe('mfa');
    expect(dec.exp - dec.iat).toBe(300); // 5 minutos
  });

  test('el token temporal no sirve como sesión en ninguna ruta protegida', async () => {
    const { cuenta } = conMfa(); simular(cuenta);
    const mfaToken = jwt.sign({ id: 'u1', tipo: 'mfa' }, JWT_SECRET, { expiresIn: '5m' });
    const res = await request(app).get('/api/usuarios/me').set('Authorization', `Bearer ${mfaToken}`);
    expect(res.statusCode).toBe(401);
  });

  test('paso 2 con el código correcto abre sesión con mfa:true', async () => {
    const { cuenta, secreto } = conMfa(); simular(cuenta);
    const mfaToken = jwt.sign({ id: 'u1', tipo: 'mfa' }, JWT_SECRET, { expiresIn: '5m' });
    const res = await request(app).post('/api/usuarios/login/mfa').send({ mfaToken, codigo: totp.totp(secreto) });
    expect(res.statusCode).toBe(200);
    expect(res.body.metodo).toBe('totp');
    const sesion = jwt.verify(res.body.token, JWT_SECRET);
    expect(sesion.mfa).toBe(true);
    expect(sesion.tipo).toBeUndefined();
    // y esa sesión sí funciona en rutas protegidas
    const me = await request(app).get('/api/usuarios/me').set('Authorization', `Bearer ${res.body.token}`);
    expect(me.statusCode).toBe(200);
    expect(me.body.mfaActivo).toBe(true);
  });

  test('paso 2 con un código incorrecto da 401', async () => {
    const { cuenta } = conMfa(); simular(cuenta);
    const mfaToken = jwt.sign({ id: 'u1', tipo: 'mfa' }, JWT_SECRET, { expiresIn: '5m' });
    const res = await request(app).post('/api/usuarios/login/mfa').send({ mfaToken, codigo: '000000' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Código incorrecto');
  });

  test('paso 2 con un token que no es temporal de MFA (una sesión normal) da 401', async () => {
    const { cuenta, secreto } = conMfa(); simular(cuenta);
    const sesion = jwt.sign({ id: 'u1', email: 'ana@test.com', mfa: false }, JWT_SECRET, { expiresIn: '7d' });
    const res = await request(app).post('/api/usuarios/login/mfa').send({ mfaToken: sesion, codigo: totp.totp(secreto) });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/expiró/);
  });

  test('paso 2 con un token vencido o inventado da 401', async () => {
    const vencido = jwt.sign({ id: 'u1', tipo: 'mfa' }, JWT_SECRET, { expiresIn: -10 });
    const r1 = await request(app).post('/api/usuarios/login/mfa').send({ mfaToken: vencido, codigo: '123456' });
    expect(r1.statusCode).toBe(401);
    const r2 = await request(app).post('/api/usuarios/login/mfa').send({ mfaToken: 'inventado-inventado', codigo: '123456' });
    expect(r2.statusCode).toBe(401);
  });

  test('paso 2 sin código o sin token es un error de validación (400)', async () => {
    const r = await request(app).post('/api/usuarios/login/mfa').send({ codigo: '123456' });
    expect(r.statusCode).toBe(400);
  });
});

describe('MFA · el administrador la necesita para operar el portal (API)', () => {
  test('un administrador sin MFA inicia sesión, pero se le avisa y el portal le responde 403', async () => {
    const cuenta = crearCuenta({ rol: 'admin', email: 'admin@test.com' }); simular(cuenta);
    const login = await request(app).post('/api/usuarios/login').send({ email: 'admin@test.com', password: 'secreta1' });
    expect(login.statusCode).toBe(200);
    expect(login.body.mfaObligatorioPendiente).toBe(true);
    expect(jwt.verify(login.body.token, JWT_SECRET).mfa).toBe(false);

    const portal = await request(app).get('/api/admin/metrics').set('Authorization', `Bearer ${login.body.token}`);
    expect(portal.statusCode).toBe(403);
    expect(portal.body.mfaRequerido).toBe(true);
  });

  test('un administrador designado por ADMIN_EMAILS también necesita el segundo factor', async () => {
    process.env.ADMIN_EMAILS = 'ana@test.com';
    simular(crearCuenta());
    const sesion = jwt.sign({ id: 'u1', email: 'ana@test.com', mfa: false }, JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app).get('/api/admin/metrics').set('Authorization', `Bearer ${sesion}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.mfaRequerido).toBe(true);
  });

  test('un usuario normal sin MFA sigue recibiendo el 403 de permisos (no el de MFA)', async () => {
    simular(crearCuenta());
    const sesion = jwt.sign({ id: 'u1', email: 'ana@test.com', mfa: false }, JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app).get('/api/admin/metrics').set('Authorization', `Bearer ${sesion}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.mfaRequerido).toBeUndefined();
    expect(res.body.error).toMatch(/permisos de administrador/);
  });

  test('un usuario normal sin MFA inicia sesión como siempre (MFA opcional)', async () => {
    simular(crearCuenta());
    const res = await request(app).post('/api/usuarios/login').send({ email: 'ana@test.com', password: 'secreta1' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.mfaObligatorioPendiente).toBe(false);
    expect(res.body.mfaRequerido).toBeUndefined();
  });
});

describe('MFA · registros del servidor', () => {
  test('los códigos y el token temporal nunca se escriben en el log de peticiones', async () => {
    const { cuenta, secreto } = conMfa(); simular(cuenta);
    const registro = jest.spyOn(console, 'log').mockImplementation(() => {});
    const mfaToken = jwt.sign({ id: 'u1', tipo: 'mfa' }, JWT_SECRET, { expiresIn: '5m' });
    const codigo = totp.totp(secreto);
    await request(app).post('/api/usuarios/login/mfa').send({ mfaToken, codigo });
    const escrito = registro.mock.calls.map((c) => JSON.stringify(c)).join('\n');
    expect(escrito).toContain('/api/usuarios/login/mfa');
    expect(escrito).not.toContain(mfaToken);
    expect(escrito).not.toContain(codigo);
    expect(escrito).toContain('[REDACTED]');
  });
});
