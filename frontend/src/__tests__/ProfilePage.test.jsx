/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/ProfilePage.test.jsx
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de ProfilePage: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-06, RF-07, RF-08, RF-33, RF-39  (módulos: Cuenta, Perfil, Plan Pro)
 * Casos de uso ....: CU-12 Gestionar información de perfil
 *                    CU-13 Cerrar sesión
 *                    CU-18 Eliminar cuenta
 *                    CU-19 Contratar el Plan Pro
 * Reglas de negocio : RN-20
 * Depende de ......: frontend/src/pages/ProfilePage.jsx
 *                    frontend/src/services/usuarios-adapter.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
