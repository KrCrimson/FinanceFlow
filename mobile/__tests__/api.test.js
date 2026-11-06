/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: mobile/__tests__/api.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de api: verifican que el comportamiento descrito en el SRS se cumple.
 * Depende de ......: mobile/src/config/env.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { API_URL } from '../src/config/env';

describe('Mobile Config & API Environment', () => {
  it('debería tener la URL del backend de Render configurada en producción', () => {
    expect(API_URL).toBe('https://financeflow-backend-4fbw.onrender.com/api');
  });
});
