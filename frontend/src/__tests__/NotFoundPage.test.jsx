/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/NotFoundPage.test.jsx
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de NotFoundPage: verifican que el comportamiento descrito en el SRS se cumple.
 * Calidad (RNF) ...: RNF-11
 * Depende de ......: frontend/src/pages/NotFoundPage.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { render, screen } from '@testing-library/react';
import NotFoundPage from '../pages/NotFoundPage';

describe('NotFoundPage', () => {
  it('muestra mensaje 404', () => {
    render(<NotFoundPage />);
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
  it('muestra link de volver al inicio', () => {
    render(<NotFoundPage />);
    expect(screen.getByText(/Volver al inicio/i)).toBeInTheDocument();
  });
});
