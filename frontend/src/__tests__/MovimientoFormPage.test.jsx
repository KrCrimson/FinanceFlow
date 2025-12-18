import { render, screen } from '@testing-library/react';
import MovimientoFormPage from '../pages/MovimientoFormPage';

describe('MovimientoFormPage', () => {
  it('renderiza el formulario', () => {
    render(<MovimientoFormPage />);
    expect(screen.getByText(/Registrar Movimiento|Nuevo Movimiento/i)).toBeInTheDocument();
  });
  it('valida campos requeridos', () => {
    render(<MovimientoFormPage />);
    // Simular submit vacío y esperar mensajes de error
  });
});
