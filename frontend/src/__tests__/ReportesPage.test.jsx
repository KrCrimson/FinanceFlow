/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/ReportesPage.test.jsx
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de ReportesPage: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-09, RF-12, RF-13, RF-14, RF-22, RF-23, RF-24  (módulos: Movimientos, Reportes)
 * Calidad (RNF) ...: RNF-09
 * Casos de uso ....: CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-06 Registrar movimiento manual
 *                    CU-08 Desactivar movimiento
 *                    CU-09 Visualizar reportes y gráficos
 *                    CU-10 Filtrar historial de movimientos
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-17 Marcar y quitar ingreso constante
 *                    CU-21 Exportar reportes a Excel y PDF
 * Reglas de negocio : RN-03, RN-16
 * Depende de ......: frontend/src/pages/ReportesPage.jsx
 *                    frontend/src/services/movimientosService.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { render, screen } from '@testing-library/react';
import ReportesPage from '../pages/ReportesPage';
import * as movimientosService from '../services/movimientosService';

jest.mock('../services/movimientosService', () => ({
  getMovimientos: jest.fn().mockResolvedValue([]),
  getResumen: jest.fn().mockResolvedValue({ totalIngresos: 0, totalEgresos: 0, balanceTotal: 0 })
}));

describe('ReportesPage', () => {
  it('renderiza la vista de reportes', async () => {
    render(<ReportesPage />);
    expect(await screen.findByText(/Reportes/i)).toBeInTheDocument();
  });
});
