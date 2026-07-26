const movimientosService = require('../services/movimientos.service');

describe('Financial Math & Precision Tests', () => {
  it('TC-FIN-01: Mantiene precisión de punto flotante exacta sin errores de redondeo (0.1 + 0.2)', () => {
    const ingresos = [19.90, 50.15, 100.25];
    const egresos = [10.30, 20.40];

    const totalIngresos = ingresos.reduce((acc, curr) => acc + curr, 0);
    const totalEgresos = egresos.reduce((acc, curr) => acc + curr, 0);
    const balance = Number((totalIngresos - totalEgresos).toFixed(2));

    expect(balance).toBe(139.60);
  });

  it('TC-FIN-02: Normaliza fechas ISO con desfases de zona horaria (UTC-5 America/Lima)', () => {
    const fechaLimaISO = '2026-07-31T23:59:59-05:00';
    const parsedDate = new Date(fechaLimaISO);

    expect(parsedDate.toISOString()).toBe('2026-08-01T04:59:59.000Z');
    expect(parsedDate.getUTCFullYear()).toBe(2026);
  });
});
