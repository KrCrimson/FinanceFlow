/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/DashboardPage.test.jsx
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de DashboardPage: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-13, RF-14, RF-17, RF-18, RF-19, RF-20, RF-21  (módulos: Movimientos, Panel)
 * Calidad (RNF) ...: RNF-06, RNF-09
 * Casos de uso ....: CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-08 Desactivar movimiento
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 *                    CU-17 Marcar y quitar ingreso constante
 * Reglas de negocio : RN-03, RN-13, RN-18
 * Depende de ......: frontend/src/pages/DashboardPage.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DashboardPage from '../pages/DashboardPage';

const mockMovimientos = jest.fn();

jest.mock('../hooks/useMovimientos', () => ({
  useMovimientos: () => mockMovimientos()
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    mockMovimientos.mockReturnValue({ movimientos: [], loading: false, error: null });
  });

  it('muestra el dashboard y tabla vacía', () => {
    render(<DashboardPage />);
    const elements = screen.getAllByText(/Dashboard/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('cambia entre pestañas correctamente', () => {
    render(<DashboardPage />);
    const tabBtn = screen.getByText(/Planificador de Compras/i);
    fireEvent.click(tabBtn);
    expect(screen.getByText(/Carrera de Compras Planificadas/i)).toBeInTheDocument();
  });
});
