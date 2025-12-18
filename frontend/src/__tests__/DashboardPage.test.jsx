import { render, screen } from '@testing-library/react';
import DashboardPage from '../pages/DashboardPage';

jest.mock('../hooks/useMovimientos', () => ({
  useMovimientos: () => ({ movimientos: [], loading: false, error: null })
}));

describe('DashboardPage', () => {
  it('muestra el dashboard y tabla vacía', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Movimientos/i)).toBeInTheDocument();
  });
});
