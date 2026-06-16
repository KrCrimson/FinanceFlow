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
    expect(screen.getByText('🏠 Dashboard')).toBeInTheDocument();
    expect(screen.getByText('💳 Movimientos Recientes')).toBeInTheDocument();
  });

  it('calcula correctamente los meses estimados (CP-38)', () => {
    mockMovimientos.mockReturnValue({
      movimientos: [
        { _id: '1', nombre: 'Sueldo', monto: 1500, tipo: 'ingreso', estado: 'activo', creadoEn: '2026-06-15T00:00:00.000Z' },
        { _id: '2', nombre: 'Alquiler', monto: 500, tipo: 'egreso', estado: 'activo', creadoEn: '2026-06-15T00:00:00.000Z' }
      ],
      loading: false,
      error: null
    });

    render(<DashboardPage />);
    
    // Cambiar a la pestaña del Planificador
    const tabBtn = screen.getByText(/Planificador de Compras/i);
    fireEvent.click(tabBtn);

    // Obtener los inputs y el botón de cálculo
    const priceInput = screen.getByPlaceholderText('0.00');
    const calculateBtn = screen.getByText(/Calcular Plan de Ahorro/i);

    // Ingresar precio de 2000 (Ahorro promedio: 1000, Meses esperados: 2)
    fireEvent.change(priceInput, { target: { value: '2000' } });
    fireEvent.click(calculateBtn);

    // Verificar el cálculo del plan de ahorro
    expect(screen.getByText(/Podrías comprarlo en 2 meses/i)).toBeInTheDocument();
    expect(screen.getByText(/Con tu ahorro mensual actual/i)).toBeInTheDocument();
  });

  it('muestra mensaje de advertencia si el ahorro es 0 o negativo (CP-39)', () => {
    mockMovimientos.mockReturnValue({
      movimientos: [
        { _id: '1', nombre: 'Sueldo', monto: 500, tipo: 'ingreso', estado: 'activo', creadoEn: '2026-06-15T00:00:00.000Z' },
        { _id: '2', nombre: 'Alquiler', monto: 500, tipo: 'egreso', estado: 'activo', creadoEn: '2026-06-15T00:00:00.000Z' }
      ],
      loading: false,
      error: null
    });

    render(<DashboardPage />);
    
    // Cambiar a la pestaña del Planificador
    const tabBtn = screen.getByText(/Planificador de Compras/i);
    fireEvent.click(tabBtn);

    // Obtener los inputs y el botón de cálculo
    const priceInput = screen.getByPlaceholderText('0.00');
    const calculateBtn = screen.getByText(/Calcular Plan de Ahorro/i);

    // Ingresar precio de 2000 (Ahorro promedio: 0)
    fireEvent.change(priceInput, { target: { value: '2000' } });
    fireEvent.click(calculateBtn);

    // Verificar la advertencia de no viabilidad
    expect(screen.getByText(/No es posible con el ahorro actual/i)).toBeInTheDocument();
    expect(screen.getByText(/Necesitas reducir gastos o aumentar ingresos/i)).toBeInTheDocument();
  });
});

