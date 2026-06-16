import { render, screen } from '@testing-library/react';
import IngresosPage from '../pages/IngresosPage';

jest.mock('../hooks/useMovimientos', () => ({
  useMovimientos: () => ({ movimientos: [], loading: false, error: null })
}));

describe('IngresosPage', () => {
  it('renderiza la vista', () => {
    render(<IngresosPage />);
    expect(screen.getByText(/Gestión de Ingresos/i)).toBeInTheDocument();
  });
});
