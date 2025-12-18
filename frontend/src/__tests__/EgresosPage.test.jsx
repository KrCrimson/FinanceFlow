import { render, screen } from '@testing-library/react';
import EgresosPage from '../pages/EgresosPage';

describe('EgresosPage', () => {
  it('renderiza la vista', () => {
    render(<EgresosPage />);
    expect(screen.getByText(/Egresos/i)).toBeInTheDocument();
  });
  it('muestra mensaje de no implementado', () => {
    render(<EgresosPage />);
    expect(screen.getByText(/no implementada/i)).toBeInTheDocument();
  });
});
