/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/mfaService.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de mfaService: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-01, RF-02, RF-06, RF-41, RF-42, RF-43  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-02
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-13 Cerrar sesión
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-07, RN-26, RN-27
 * Depende de ......: frontend/src/services/authService.js
 *                    frontend/src/services/mfaService.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { configurarMfa, activarMfa, desactivarMfa } from '../services/mfaService';
import { loginMfa } from '../services/authService';

const respuesta = (ok, cuerpo) => Promise.resolve({ ok, json: () => Promise.resolve(cuerpo) });

describe('servicios de verificación en dos pasos', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'sesion-vieja');
    global.fetch = jest.fn();
  });

  it('configurarMfa llama a /mfa/configurar con la sesión', async () => {
    global.fetch.mockReturnValue(respuesta(true, { secreto: 'ABC', otpauthUrl: 'otpauth://x' }));
    const r = await configurarMfa();
    expect(r.secreto).toBe('ABC');
    const [url, opciones] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/api\/usuarios\/mfa\/configurar$/);
    expect(opciones.method).toBe('POST');
    expect(opciones.headers.Authorization).toBe('Bearer sesion-vieja');
  });

  it('activarMfa envía el código y reemplaza la sesión por la nueva (con segundo factor)', async () => {
    global.fetch.mockReturnValue(respuesta(true, { token: 'sesion-nueva', codigosRecuperacion: ['A-B'] }));
    const r = await activarMfa('123456');
    expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({ codigo: '123456' });
    expect(r.codigosRecuperacion).toEqual(['A-B']);
    expect(localStorage.getItem('token')).toBe('sesion-nueva');
  });

  it('un error del servidor se convierte en un mensaje legible y no cambia la sesión', async () => {
    global.fetch.mockReturnValue(respuesta(false, { message: 'Código incorrecto' }));
    await expect(activarMfa('000000')).rejects.toThrow('Código incorrecto');
    expect(localStorage.getItem('token')).toBe('sesion-vieja');
  });

  it('desactivarMfa envía contraseña y código', async () => {
    global.fetch.mockReturnValue(respuesta(true, { message: 'ok' }));
    await desactivarMfa('secreta1', 'ABCDE-FGHIJ');
    expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({ password: 'secreta1', codigo: 'ABCDE-FGHIJ' });
    expect(global.fetch.mock.calls[0][0]).toMatch(/\/mfa\/desactivar$/);
  });

  it('loginMfa canjea el token temporal por la sesión y la guarda', async () => {
    global.fetch.mockReturnValue(respuesta(true, { token: 'sesion-mfa', usuario: {} }));
    await loginMfa('temporal', '123456');
    expect(global.fetch.mock.calls[0][0]).toMatch(/\/api\/usuarios\/login\/mfa$/);
    expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({ mfaToken: 'temporal', codigo: '123456' });
    expect(localStorage.getItem('token')).toBe('sesion-mfa');
  });

  it('loginMfa con código incorrecto no guarda ninguna sesión', async () => {
    localStorage.clear();
    global.fetch.mockReturnValue(respuesta(false, { message: 'Código incorrecto' }));
    await expect(loginMfa('temporal', '000000')).rejects.toThrow('Código incorrecto');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
