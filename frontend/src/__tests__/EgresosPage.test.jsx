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
