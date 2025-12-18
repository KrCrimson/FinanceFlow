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
