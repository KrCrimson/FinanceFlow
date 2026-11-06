/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/LoginMfa.test.jsx
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de LoginMfa: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-01, RF-02, RF-03, RF-06, RF-42, RF-44  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-10
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-13 Cerrar sesión
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-07, RN-08, RN-26, RN-28
 * Depende de ......: frontend/src/pages/LoginPage.jsx
 *                    frontend/src/services/auth-adapter.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import { login, loginMfa } from '../services/auth-adapter';

const mockNavigate = jest.fn();
const mockUpdateAuth = jest.fn();

jest.mock('../services/auth-adapter', () => ({ login: jest.fn(), loginMfa: jest.fn() }));
jest.mock('../hooks/useAuth', () => ({ useAuth: () => ({ user: null, updateAuth: mockUpdateAuth }) }));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/login', search: '', hash: '', state: null }),
}));

async function iniciarSesion() {
  render(<LoginPage />);
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'ana@test.com' } });
  fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'secreta1' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
}

describe('LoginPage · verificación en dos pasos', () => {
  beforeEach(() => jest.clearAllMocks());

  it('sin MFA entra directo al panel', async () => {
    login.mockResolvedValue({ token: 't', usuario: {} });
    await iniciarSesion();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true }));
    expect(loginMfa).not.toHaveBeenCalled();
  });

  it('con MFA activo no entra: muestra el paso del código y no abre sesión todavía', async () => {
    login.mockResolvedValue({ mfaRequerido: true, mfaToken: 'temporal-123' });
    await iniciarSesion();
    expect(await screen.findByText('Verificación en dos pasos')).toBeInTheDocument();
    expect(screen.getByLabelText('Código de verificación')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockUpdateAuth).not.toHaveBeenCalled();
  });

  it('envía el token temporal y el código; si es correcto entra al panel', async () => {
    login.mockResolvedValue({ mfaRequerido: true, mfaToken: 'temporal-123' });
    loginMfa.mockResolvedValue({ token: 'sesion', usuario: {} });
    await iniciarSesion();
    fireEvent.change(await screen.findByLabelText('Código de verificación'), { target: { value: ' 123456 ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verificar' }));
    await waitFor(() => expect(loginMfa).toHaveBeenCalledWith('temporal-123', '123456'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true }));
    expect(mockUpdateAuth).toHaveBeenCalled();
  });

  it('un código incorrecto muestra el error y no entra', async () => {
    login.mockResolvedValue({ mfaRequerido: true, mfaToken: 'temporal-123' });
    loginMfa.mockRejectedValue(new Error('Código incorrecto'));
    await iniciarSesion();
    fireEvent.change(await screen.findByLabelText('Código de verificación'), { target: { value: '000000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verificar' }));
    expect(await screen.findByText('Código incorrecto')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('no envía nada si el código está vacío', async () => {
    login.mockResolvedValue({ mfaRequerido: true, mfaToken: 'temporal-123' });
    await iniciarSesion();
    await screen.findByLabelText('Código de verificación');
    fireEvent.click(screen.getByRole('button', { name: 'Verificar' }));
    expect(await screen.findByText('Ingresa el código de 6 dígitos')).toBeInTheDocument();
    expect(loginMfa).not.toHaveBeenCalled();
  });

  it('«Volver al inicio de sesión» descarta el token temporal y muestra el formulario', async () => {
    login.mockResolvedValue({ mfaRequerido: true, mfaToken: 'temporal-123' });
    await iniciarSesion();
    fireEvent.click(await screen.findByText('← Volver al inicio de sesión'));
    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Código de verificación')).not.toBeInTheDocument();
  });

  it('un administrador sin MFA entra y se le lleva a Mi Perfil para activarla', async () => {
    login.mockResolvedValue({ token: 't', usuario: {}, mfaObligatorioPendiente: true });
    await iniciarSesion();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/perfil', { replace: true, state: { mfaObligatorio: true } }));
  });
});
