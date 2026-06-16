
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ProfilePage from '../pages/ProfilePage';
import * as userService from '../services/userService';

jest.mock('../services/userService');
jest.mock('../services/authService');
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra cargando mientras no hay perfil', () => {
    userService.getProfile.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<ProfilePage />);
    expect(screen.getByText(/Cargando perfil/i)).toBeInTheDocument();
  });

  it('muestra datos de perfil', async () => {
    userService.getProfile.mockResolvedValue({
      nombre: 'Sebastian Arce',
      email: 'sebastian@mail.com',
      creadoEn: '2026-01-01T12:00:00.000Z',
      estado: 'activo'
    });

    render(<ProfilePage />);

    // Esperar a que se carguen y rendericen los datos del perfil
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Tu nombre completo/i)).toHaveValue('Sebastian Arce');
      expect(screen.getByPlaceholderText(/tu@email.com/i)).toHaveValue('sebastian@mail.com');
    });

    expect(screen.getByText(/Miembro desde/i)).toBeInTheDocument();
    expect(screen.getByText(/1 de enero de 2026/i)).toBeInTheDocument();
  });
});

