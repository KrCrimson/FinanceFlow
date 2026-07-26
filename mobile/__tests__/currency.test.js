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
