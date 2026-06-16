import { render, screen, waitFor } from '@testing-library/react';
import ReportesPage from '../pages/ReportesPage';
import * as movimientosService from '../services/movimientosService';

jest.mock('../services/movimientosService');

describe('ReportesPage', () => {
  it('renderiza la vista de reportes', async () => {
    movimientosService.getMovimientos.mockResolvedValue([]);
    render(<ReportesPage />);
    expect(await screen.findByText(/Reportes y Análisis/i)).toBeInTheDocument();
  });
});
