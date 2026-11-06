/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/services.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de services: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-01, RF-02, RF-06, RF-07, RF-08, RF-21, RF-22, RF-27, RF-28, RF-30, RF-31, RF-32, RF-33, RF-34, RF-35, RF-36  (módulos: Cuenta, Perfil, Panel, Reportes, Cierres, Recordatorios, Plan Pro, Administración)
 * Calidad (RNF) ...: RNF-02, RNF-04
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-09 Visualizar reportes y gráficos
 *                    CU-12 Gestionar información de perfil
 *                    CU-13 Cerrar sesión
 *                    CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 *                    CU-18 Eliminar cuenta
 *                    CU-19 Contratar el Plan Pro
 *                    CU-20 Gestionar préstamos y recordatorios
 *                    CU-22 Administrar la plataforma
 * Reglas de negocio : RN-07, RN-17, RN-22
 * Depende de ......: frontend/src/services/adminService.js
 *                    frontend/src/services/authService.js
 *                    frontend/src/services/cierresService.js
 *                    frontend/src/services/pagosService.js
 *                    frontend/src/services/recordatoriosService.js
 *                    frontend/src/services/reportesService.js
 *                    frontend/src/services/userService.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn() }));

import axios from 'axios';
import * as pagos from '../services/pagosService';
import * as cierres from '../services/cierresService';
import * as recordatorios from '../services/recordatoriosService';
import * as reportes from '../services/reportesService';
import * as usuario from '../services/userService';
import * as auth from '../services/authService';
import * as admin from '../services/adminService';

const ok = (cuerpo) => ({ ok: true, status: 200, statusText: 'OK', json: async () => cuerpo });
const fail = (cuerpo, status = 400) => ({ ok: false, status, statusText: 'Error', json: async () => cuerpo });

beforeEach(() => {
  global.fetch = jest.fn();
  localStorage.clear();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

const urlLlamada = () => global.fetch.mock.calls[0][0];
const opcionesLlamada = () => global.fetch.mock.calls[0][1] || {};

describe('pagosService', () => {
  it('crearCargoCulqi envía el token de Culqi con la sesión y NO envía el monto', async () => {
    localStorage.setItem('token', 'jwt-abc');
    global.fetch.mockResolvedValue(ok({ success: true, esPremium: true }));
    const r = await pagos.crearCargoCulqi('tkn_1', 19.9, 'PEN');
    expect(r.esPremium).toBe(true);
    expect(urlLlamada()).toMatch(/\/api\/pagos\/crear-cargo-culqi$/);
    expect(opcionesLlamada().headers.Authorization).toBe('Bearer jwt-abc');
    expect(JSON.parse(opcionesLlamada().body)).toEqual({ token: 'tkn_1' });
  });

  it('crearCargoCulqi lanza el mensaje del servidor si el cargo falla', async () => {
    global.fetch.mockResolvedValue(fail({ success: false, error: 'Tarjeta sin fondos' }, 402));
    await expect(pagos.crearCargoCulqi('tkn_1')).rejects.toThrow('Tarjeta sin fondos');
  });

  it('crearCargoCulqi también falla si la respuesta es 200 pero success=false', async () => {
    global.fetch.mockResolvedValue(ok({ success: false }));
    await expect(pagos.crearCargoCulqi('tkn_1')).rejects.toThrow('Error al procesar el pago con Culqi');
  });

  it('getEstadoPlan llama a la ruta autenticada sin email en la URL (regresión del modo Pro)', async () => {
    localStorage.setItem('token', 'jwt-abc');
    global.fetch.mockResolvedValue(ok({ esPremium: true, planTipo: 'pro' }));
    const r = await pagos.getEstadoPlan();
    expect(r.esPremium).toBe(true);
    expect(urlLlamada()).toMatch(/\/api\/pagos\/estado-plan$/);
    expect(opcionesLlamada().headers.Authorization).toBe('Bearer jwt-abc');
  });

  it('getEstadoPlan devuelve el plan gratuito si el servidor falla', async () => {
    global.fetch.mockRejectedValue(new Error('sin red'));
    await expect(pagos.getEstadoPlan()).resolves.toEqual({ esPremium: false, planTipo: 'free', conteoOcrMes: 0 });
  });

  it('solicitarPlanPro envía la solicitud y propaga el error del servidor', async () => {
    global.fetch.mockResolvedValueOnce(ok({ success: true }));
    await expect(pagos.solicitarPlanPro('a@b.com', 'yape', '123', 19.9)).resolves.toEqual({ success: true });
    global.fetch.mockResolvedValueOnce(fail({ error: 'Usuario no encontrado' }, 404));
    await expect(pagos.solicitarPlanPro('x@b.com', 'yape', '1', 19.9)).rejects.toThrow('Usuario no encontrado');
  });

  it('checkoutDirectoPro y toggleDevPlan propagan errores', async () => {
    global.fetch.mockResolvedValue(fail({ error: 'No disponible' }, 403));
    await expect(pagos.checkoutDirectoPro('a@b.com', 'card', 'PE', 19.9, 'PEN')).rejects.toThrow('No disponible');
    await expect(pagos.toggleDevPlan('a@b.com')).rejects.toThrow('No disponible');
  });
});

describe('cierresService', () => {
  beforeEach(() => localStorage.setItem('token', 'jwt-abc'));

  it('crearCierre hace POST con la sesión y devuelve el cierre', async () => {
    global.fetch.mockResolvedValue(ok({ _id: 'c1' }));
    await expect(cierres.crearCierre({ tipo: 'diario' })).resolves.toEqual({ _id: 'c1' });
    expect(opcionesLlamada().method).toBe('POST');
    expect(opcionesLlamada().headers.Authorization).toBe('Bearer jwt-abc');
  });

  it('crearCierre lanza el error del servidor', async () => {
    global.fetch.mockResolvedValue(fail({ error: 'Contraseña incorrecta' }, 401));
    await expect(cierres.crearCierre({})).rejects.toThrow('Contraseña incorrecta');
  });

  it('getResumenPeriodo arma la consulta con tipo y periodo', async () => {
    global.fetch.mockResolvedValue(ok({ count: 1 }));
    await cierres.getResumenPeriodo('mensual', '2026-09');
    expect(urlLlamada()).toMatch(/\/cierres\/resumen\?tipo=mensual&periodo=2026-09$/);
  });

  it('getCierres devuelve [] si falla y getCierresPendientes devuelve null', async () => {
    global.fetch.mockResolvedValue(fail({ error: 'x' }, 500));
    await expect(cierres.getCierres()).resolves.toEqual([]);
    await expect(cierres.getCierresPendientes('2026-06-16')).resolves.toBeNull();
  });

  it('getCierresPendientes envía la fecha local', async () => {
    global.fetch.mockResolvedValue(ok({ yesterday: {} }));
    await cierres.getCierresPendientes('2026-06-16');
    expect(urlLlamada()).toMatch(/pendientes\?localDate=2026-06-16$/);
  });

  it('reabrirCierre hace POST y propaga errores', async () => {
    global.fetch.mockResolvedValueOnce(ok({ message: 'ok' }));
    await expect(cierres.reabrirCierre({ tipo: 'mensual' })).resolves.toEqual({ message: 'ok' });
    global.fetch.mockResolvedValueOnce(fail({ error: 'No se encontró ningún cierre' }));
    await expect(cierres.reabrirCierre({})).rejects.toThrow('No se encontró ningún cierre');
  });
});

describe('recordatoriosService', () => {
  beforeEach(() => localStorage.setItem('token', 'jwt-abc'));

  it('lista, crea, actualiza y elimina usando el método y la URL correctos', async () => {
    global.fetch.mockResolvedValue(ok({ ok: true }));
    await recordatorios.getRecordatorios();
    await recordatorios.crearRecordatorio({ titulo: 'Pago' });
    await recordatorios.actualizarRecordatorio('r1', { estado: 'pagado' });
    await recordatorios.eliminarRecordatorio('r1');
    const llamadas = global.fetch.mock.calls.map(([url, o]) => `${o.method} ${url.split('/api')[1]}`);
    expect(llamadas).toEqual([
      'GET /recordatorios',
      'POST /recordatorios',
      'PUT /recordatorios/r1',
      'DELETE /recordatorios/r1',
    ]);
    expect(global.fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer jwt-abc');
  });

  it('propaga el error del servidor', async () => {
    global.fetch.mockResolvedValue(fail({ error: 'No autorizado' }, 403));
    await expect(recordatorios.getRecordatorios()).rejects.toThrow('No autorizado');
    await expect(recordatorios.crearRecordatorio({})).rejects.toThrow('No autorizado');
    await expect(recordatorios.actualizarRecordatorio('r', {})).rejects.toThrow('No autorizado');
    await expect(recordatorios.eliminarRecordatorio('r')).rejects.toThrow('No autorizado');
  });
});

describe('reportesService', () => {
  it('getReportes arma los parámetros y devuelve [] si falla', async () => {
    global.fetch.mockResolvedValueOnce(ok([{ id: 1 }]));
    await expect(reportes.getReportes({ mes: '2026-10' })).resolves.toEqual([{ id: 1 }]);
    expect(urlLlamada()).toMatch(/\/api\/reportes\?mes=2026-10$/);
    global.fetch.mockResolvedValueOnce(fail({}, 500));
    await expect(reportes.getReportes()).resolves.toEqual([]);
  });

  it('generateReport y exportReport devuelven success=false ante un error', async () => {
    global.fetch.mockResolvedValue(fail({}, 500));
    expect((await reportes.generateReport({})).success).toBe(false);
    expect((await reportes.exportReport('r1', 'csv')).success).toBe(false);
  });

  it('getReportStats devuelve ceros ante un error', async () => {
    global.fetch.mockRejectedValue(new Error('red'));
    await expect(reportes.getReportStats()).resolves.toEqual({ total: 0, recent: 0 });
  });

  it('updateToken guarda y borra el token', () => {
    reportes.updateToken('abc');
    expect(localStorage.getItem('token')).toBe('abc');
    reportes.updateToken(null);
    expect(localStorage.getItem('token')).toBeNull();
  });
});

describe('userService', () => {
  beforeEach(() => localStorage.setItem('token', 'jwt-abc'));

  it('getProfile consulta /usuarios/me con la sesión', async () => {
    global.fetch.mockResolvedValue(ok({ nombre: 'Ana' }));
    await expect(usuario.getProfile()).resolves.toEqual({ nombre: 'Ana' });
    expect(urlLlamada()).toMatch(/\/api\/usuarios\/me$/);
  });

  it('getProfile lanza error si la respuesta no es correcta', async () => {
    global.fetch.mockResolvedValue(fail({}, 401));
    await expect(usuario.getProfile()).rejects.toThrow('Error al obtener perfil');
  });

  it('updateProfile usa PUT y muestra el mensaje del servidor si falla', async () => {
    global.fetch.mockResolvedValueOnce(ok({ nombre: 'Nueva' }));
    await usuario.updateProfile({ nombre: 'Nueva' });
    expect(opcionesLlamada().method).toBe('PUT');
    global.fetch.mockResolvedValueOnce(fail({ message: 'Email inválido' }));
    await expect(usuario.updateProfile({})).rejects.toThrow('Email inválido');
  });

  it('deleteProfile usa DELETE sobre /usuarios/me', async () => {
    global.fetch.mockResolvedValue(ok({ message: 'Cuenta eliminada exitosamente' }));
    await usuario.deleteProfile();
    expect(opcionesLlamada().method).toBe('DELETE');
    expect(urlLlamada()).toMatch(/\/api\/usuarios\/me$/);
  });

  it('deleteProfile propaga el error del servidor', async () => {
    global.fetch.mockResolvedValue(fail({ message: 'Usuario no encontrado' }, 404));
    await expect(usuario.deleteProfile()).rejects.toThrow('Usuario no encontrado');
  });
});

describe('authService', () => {
  const tokenConExp = (exp) => `x.${btoa(JSON.stringify({ exp }))}.y`;

  it('login guarda el token y avisa a los suscriptores', async () => {
    const cb = jest.fn();
    const baja = auth.onAuthChange(cb);
    global.fetch.mockResolvedValue(ok({ token: 'jwt-nuevo' }));
    await auth.login('a@b.com', 'secreta1');
    expect(localStorage.getItem('token')).toBe('jwt-nuevo');
    expect(cb).toHaveBeenCalledTimes(1);
    baja();
  });

  it('login no guarda nada con credenciales incorrectas', async () => {
    global.fetch.mockResolvedValue(fail({ message: 'Usuario o contraseña incorrectos' }, 401));
    await expect(auth.login('a@b.com', 'mala')).rejects.toThrow('Usuario o contraseña incorrectos');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('register devuelve los datos y propaga el error', async () => {
    global.fetch.mockResolvedValueOnce(ok({ id: 1 }));
    await expect(auth.register('Ana', 'a@b.com', 'secreta1')).resolves.toEqual({ id: 1 });
    global.fetch.mockResolvedValueOnce(fail({ message: 'El email ya está registrado' }));
    await expect(auth.register('Ana', 'a@b.com', 'secreta1')).rejects.toThrow('ya está registrado');
  });

  it('logout borra el token y notifica', () => {
    const cb = jest.fn();
    const baja = auth.onAuthChange(cb);
    localStorage.setItem('token', 'x');
    auth.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(cb).toHaveBeenCalledTimes(1);
    baja();
  });

  it('dejar de escuchar evita notificaciones posteriores', () => {
    const cb = jest.fn();
    auth.onAuthChange(cb)();
    auth.logout();
    expect(cb).not.toHaveBeenCalled();
  });

  it('isTokenValid: sin token es falso; con token vigente verdadero', () => {
    expect(auth.isTokenValid()).toBe(false);
    localStorage.setItem('token', tokenConExp(Math.floor(Date.now() / 1000) + 3600));
    expect(auth.isTokenValid()).toBe(true);
  });

  it('isTokenValid: un token vencido cierra la sesión automáticamente', () => {
    localStorage.setItem('token', tokenConExp(Math.floor(Date.now() / 1000) - 10));
    expect(auth.isTokenValid()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('isTokenValid: un token corrupto se elimina', () => {
    localStorage.setItem('token', 'no-es-un-jwt');
    expect(auth.isTokenValid()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});

describe('adminService', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'jwt-admin');
    axios.get.mockResolvedValue({ data: { ok: 1 } });
    axios.post.mockResolvedValue({ data: { ok: 2 } });
  });

  it('las consultas envían la sesión y codifican el texto de búsqueda', async () => {
    await admin.getAdminMetrics();
    await admin.getAdminUsuarios('ana & co');
    await admin.getAdminPagos('yape');
    expect(axios.get.mock.calls[0][1].headers.Authorization).toBe('Bearer jwt-admin');
    expect(axios.get.mock.calls[1][0]).toMatch(/usuarios\?q=ana%20%26%20co$/);
    expect(axios.get.mock.calls[2][0]).toMatch(/pagos\?q=yape$/);
  });

  it('toggleUserPremium y aprobarRechazarPago envían los datos por POST', async () => {
    await expect(admin.toggleUserPremium('u1', true)).resolves.toEqual({ ok: 2 });
    await admin.aprobarRechazarPago('p1', 'aprobado');
    expect(axios.post.mock.calls[0][1]).toEqual({ userId: 'u1', esPremium: true });
    expect(axios.post.mock.calls[1][1]).toEqual({ pagoId: 'p1', nuevoEstado: 'aprobado' });
  });
});
