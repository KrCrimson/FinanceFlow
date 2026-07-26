import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ProfilePage from '../pages/ProfilePage';
import * as usuariosAdapter from '../services/usuarios-adapter';

jest.mock('../services/usuarios-adapter');
jest.mock('../services/auth-adapter', () => ({
  logout: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra datos de perfil', async () => {
    usuariosAdapter.getProfile.mockResolvedValue({
      nombre: 'Sebastian Arce',
      email: 'sebastian@mail.com',
      creadoEn: '2026-01-01T12:00:00.000Z',
      estado: 'activo'
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Tu nombre completo/i)).toHaveValue('Sebastian Arce');
      expect(screen.getByPlaceholderText(/tu@email.com/i)).toHaveValue('sebastian@mail.com');
    });

    expect(screen.getByText(/Miembro desde/i)).toBeInTheDocument();
  });
});
