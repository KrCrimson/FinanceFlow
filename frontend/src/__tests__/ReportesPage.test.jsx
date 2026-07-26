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
