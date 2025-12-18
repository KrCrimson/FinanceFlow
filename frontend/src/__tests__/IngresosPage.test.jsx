import { render, screen } from '@testing-library/react';
import IngresosPage from '../pages/IngresosPage';

describe('IngresosPage', () => {
  it('renderiza la vista', () => {
    render(<IngresosPage />);
    expect(screen.getByText(/Ingresos/i)).toBeInTheDocument();
  });
  it('muestra mensaje de no implementado', () => {
    render(<IngresosPage />);
    expect(screen.getByText(/no implementada/i)).toBeInTheDocument();
  });
});
