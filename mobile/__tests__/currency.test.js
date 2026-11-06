/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: mobile/__tests__/currency.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de currency: verifican que el comportamiento descrito en el SRS se cumple.
 * Casos de uso ....: CU-12 Gestionar información de perfil
 * Depende de ......: mobile/src/utils/currency.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { getMobileCurrencySymbol, setMobileCurrencySymbol } from '../src/utils/currency';

describe('Mobile Currency Utils', () => {
  it('debería retornar S/ como moneda por defecto', () => {
    expect(getMobileCurrencySymbol()).toBe('S/');
  });

  it('debería actualizar el símbolo de moneda correctamente', () => {
    setMobileCurrencySymbol('$');
    expect(getMobileCurrencySymbol()).toBe('$');

    setMobileCurrencySymbol('€');
    expect(getMobileCurrencySymbol()).toBe('€');

    // Restaurar por defecto
    setMobileCurrencySymbol('S/');
  });
});
