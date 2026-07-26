import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DashboardPage from '../pages/DashboardPage';

const mockMovimientos = jest.fn();

jest.mock('../hooks/useMovimientos', () => ({
  useMovimientos: () => mockMovimientos()
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    mockMovimientos.mockReturnValue({ movimientos: [], loading: false, error: null });
  });

  it('muestra el dashboard y tabla vacía', () => {
    render(<DashboardPage />);
    const elements = screen.getAllByText(/Dashboard/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('cambia entre pestañas correctamente', () => {
    render(<DashboardPage />);
    const tabBtn = screen.getByText(/Planificador de Compras/i);
    fireEvent.click(tabBtn);
    expect(screen.getByText(/Carrera de Compras Planificadas/i)).toBeInTheDocument();
  });
});
