/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/EgresosPage.test.jsx
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de EgresosPage: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-13, RF-14  (módulos: Movimientos)
 * Casos de uso ....: CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-08 Desactivar movimiento
 * Depende de ......: frontend/src/pages/EgresosPage.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { render, screen } from '@testing-library/react';
import EgresosPage from '../pages/EgresosPage';

jest.mock('../hooks/useMovimientos', () => ({
  useMovimientos: () => ({ movimientos: [], loading: false, error: null })
}));

describe('EgresosPage', () => {
  it('renderiza la vista', () => {
    render(<EgresosPage />);
    expect(screen.getByText(/Gestión de Egresos/i)).toBeInTheDocument();
  });
});
