import { render, screen } from '@testing-library/react';
import ReportesPage from '../pages/ReportesPage';

describe('ReportesPage', () => {
  it('muestra cargando', () => {
    render(<ReportesPage />);
    expect(screen.getByText(/Cargando reportes/i)).toBeInTheDocument();
  });
  it('muestra datos de reporte', () => {
    // Mockear hook/servicio para datos
  });
});
