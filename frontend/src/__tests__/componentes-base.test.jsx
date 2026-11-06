/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/componentes-base.test.jsx
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de componentes-base: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-02, RF-06, RF-38, RF-39  (módulos: Cuenta, Información legal y ayuda, Perfil)
 * Calidad (RNF) ...: RNF-02, RNF-14
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-12 Gestionar información de perfil
 *                    CU-13 Cerrar sesión
 * Reglas de negocio : RN-07
 * Depende de ......: frontend/src/components/CookieBanner.jsx
 *                    frontend/src/components/ErrorBoundary.jsx
 *                    frontend/src/components/LogoutButton.jsx
 *                    frontend/src/components/ProtectedRoute.jsx
 *                    frontend/src/hooks/useAuth.js
 *                    frontend/src/utils/currency.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';
import CookieBanner from '../components/CookieBanner';
import LogoutButton from '../components/LogoutButton';
import { getCurrencySymbol, setCurrencySymbol, CURRENCIES } from '../utils/currency';
import { useAuth } from '../hooks/useAuth';

jest.mock('../hooks/useAuth', () => ({ useAuth: jest.fn() }));

describe('ProtectedRoute', () => {
  const renderRuta = () =>
    render(
      <MemoryRouter initialEntries={['/privado']}>
        <Routes>
          <Route path="/landing" element={<div>Página pública</div>} />
          <Route path="/privado" element={<ProtectedRoute><div>Contenido privado</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

  it('mientras carga la sesión muestra el mensaje de carga y no el contenido', () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    renderRuta();
    expect(screen.getByText(/Cargando FinanceFlow/i)).toBeInTheDocument();
    expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument();
  });

  it('sin sesión redirige a la landing', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    renderRuta();
    expect(screen.getByText('Página pública')).toBeInTheDocument();
    expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument();
  });

  it('con sesión muestra el contenido protegido', () => {
    useAuth.mockReturnValue({ user: { id: 'u1' }, loading: false });
    renderRuta();
    expect(screen.getByText('Contenido privado')).toBeInTheDocument();
  });
});

describe('ErrorBoundary', () => {
  const Explota = () => {
    throw new Error('fallo de prueba');
  };

  beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it('muestra los hijos cuando no hay errores', () => {
    render(<ErrorBoundary><div>todo bien</div></ErrorBoundary>);
    expect(screen.getByText('todo bien')).toBeInTheDocument();
  });

  it('atrapa el error y muestra la pantalla de recuperación sin detalles técnicos', () => {
    render(<ErrorBoundary><Explota /></ErrorBoundary>);
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText('Volver al Inicio')).toBeInTheDocument();
    expect(screen.queryByText(/Detalles técnicos/)).not.toBeInTheDocument();
  });

  it('con debug activo muestra los detalles técnicos', () => {
    render(<ErrorBoundary debug><Explota /></ErrorBoundary>);
    expect(screen.getByText(/Detalles técnicos/)).toBeInTheDocument();
    expect(screen.getByText(/fallo de prueba/)).toBeInTheDocument();
  });
});

describe('CookieBanner', () => {
  beforeEach(() => localStorage.clear());

  const renderBanner = () => render(<MemoryRouter><CookieBanner /></MemoryRouter>);

  it('aparece cuando el usuario aún no eligió', () => {
    renderBanner();
    expect(screen.getByText('Aceptar Todas')).toBeInTheDocument();
    expect(screen.getByText('Solo Esenciales')).toBeInTheDocument();
  });

  it('"Solo Esenciales" guarda la elección y oculta el banner', () => {
    renderBanner();
    fireEvent.click(screen.getByText('Solo Esenciales'));
    expect(localStorage.getItem('financeflow_cookie_consent')).toBe('esenciales');
    expect(screen.queryByText('Aceptar Todas')).not.toBeInTheDocument();
  });

  it('"Aceptar Todas" guarda la elección', () => {
    renderBanner();
    fireEvent.click(screen.getByText('Aceptar Todas'));
    expect(localStorage.getItem('financeflow_cookie_consent')).toBe('todas');
  });

  it('no aparece si ya había una elección guardada', () => {
    localStorage.setItem('financeflow_cookie_consent', 'todas');
    renderBanner();
    expect(screen.queryByText('Aceptar Todas')).not.toBeInTheDocument();
  });
});

describe('LogoutButton', () => {
  it('llama a onLogout al hacer clic', () => {
    const onLogout = jest.fn();
    render(<LogoutButton onLogout={onLogout} />);
    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});

describe('utils/currency', () => {
  beforeEach(() => localStorage.clear());

  it('por defecto el símbolo es S/', () => {
    expect(getCurrencySymbol()).toBe('S/');
  });

  it('setCurrencySymbol guarda el símbolo y emite el evento currency_changed', () => {
    const escucha = jest.fn();
    window.addEventListener('currency_changed', escucha);
    setCurrencySymbol('$');
    expect(getCurrencySymbol()).toBe('$');
    expect(escucha).toHaveBeenCalledTimes(1);
    window.removeEventListener('currency_changed', escucha);
  });

  it('el catálogo no repite códigos de moneda y empieza por el sol peruano', () => {
    const codigos = CURRENCIES.map((c) => c.code);
    expect(new Set(codigos).size).toBe(codigos.length);
    expect(CURRENCIES[0]).toMatchObject({ code: 'PEN', symbol: 'S/' });
  });
});
