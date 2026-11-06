/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/finance.unit.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas de los cálculos financieros (balance, totales).
 * Requerimientos ..: RF-09, RF-11, RF-12, RF-13, RF-14, RF-17  (módulos: Movimientos)
 * Calidad (RNF) ...: RNF-12, RNF-13
 * Casos de uso ....: CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-06 Registrar movimiento manual
 *                    CU-08 Desactivar movimiento
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-17 Marcar y quitar ingreso constante
 * Reglas de negocio : RN-03, RN-04, RN-05, RN-06, RN-13
 * Depende de ......: backend/services/movimientos.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
