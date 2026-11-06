/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/MfaSection.test.jsx
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de MfaSection: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-41, RF-43, RF-44  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-02, RNF-05, RNF-11
 * Casos de uso ....: CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-27, RN-28
 * Depende de ......: frontend/src/components/MfaSection.jsx
 *                    frontend/src/services/mfaService.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MfaSection from '../components/MfaSection';
import { configurarMfa, activarMfa, desactivarMfa } from '../services/mfaService';

jest.mock('../services/mfaService');
jest.mock('../services/auth-adapter', () => ({ authAdapter: { notifyAuthChange: jest.fn() } }));

const CONFIG = { secreto: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', otpauthUrl: 'otpauth://totp/FinanceFlow:ana%40test.com?secret=ABCDEFGHIJKLMNOPQRSTUVWXYZ234567&issuer=FinanceFlow' };
const CODIGOS = ['AAAAA-BBBBB', 'CCCCC-DDDDD', 'EEEEE-FFFFF', 'GGGGG-HHHHH', 'IIIII-JJJJJ', 'KKKKK-LLLLL', 'MMMMM-NNNNN', 'OOOOO-PPPPP'];

describe('MfaSection', () => {
  beforeEach(() => jest.clearAllMocks());

  it('usuario sin MFA: muestra «Desactivada» y el botón para activarla', () => {
    render(<MfaSection perfil={{ mfaActivo: false, esAdmin: false }} />);
    expect(screen.getByText('Desactivada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Activar verificación en dos pasos' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('flujo completo: QR y clave → código → códigos de recuperación → Listo', async () => {
    configurarMfa.mockResolvedValue(CONFIG);
    activarMfa.mockResolvedValue({ token: 'nuevo', codigosRecuperacion: CODIGOS });
    const onCambio = jest.fn().mockResolvedValue();
    render(<MfaSection perfil={{ mfaActivo: false }} onCambio={onCambio} />);

    fireEvent.click(screen.getByRole('button', { name: 'Activar verificación en dos pasos' }));
    expect(await screen.findByTestId('mfa-qr')).toBeInTheDocument();
    expect(screen.getByTestId('mfa-qr').querySelector('svg')).not.toBeNull();
    expect(screen.getByTestId('mfa-secreto')).toHaveTextContent(CONFIG.secreto);

    fireEvent.change(screen.getByLabelText('Código de 6 dígitos'), { target: { value: '12a3456' } }); // solo deja dígitos
    expect(screen.getByLabelText('Código de 6 dígitos')).toHaveValue('123456');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y activar' }));

    await waitFor(() => expect(activarMfa).toHaveBeenCalledWith('123456'));
    const lista = await screen.findByTestId('mfa-codigos');
    expect(lista.querySelectorAll('li')).toHaveLength(8);
    expect(screen.getByText(/Se muestran una sola vez/)).toBeInTheDocument();
    expect(onCambio).toHaveBeenCalled();

    const listo = screen.getByRole('button', { name: 'Listo' });
    expect(listo).toBeDisabled();                       // no se puede cerrar sin confirmar que los guardó
    fireEvent.click(screen.getByLabelText(/Ya guardé mis códigos/));
    expect(listo).toBeEnabled();
    fireEvent.click(listo);
    expect(screen.queryByTestId('mfa-codigos')).not.toBeInTheDocument();
  });

  it('un código que no tiene 6 dígitos no se envía', async () => {
    configurarMfa.mockResolvedValue(CONFIG);
    render(<MfaSection perfil={{ mfaActivo: false }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Activar verificación en dos pasos' }));
    await screen.findByTestId('mfa-qr');
    fireEvent.change(screen.getByLabelText('Código de 6 dígitos'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y activar' }));
    expect(await screen.findByText('El código debe tener 6 dígitos')).toBeInTheDocument();
    expect(activarMfa).not.toHaveBeenCalled();
  });

  it('un código incorrecto muestra el error del servidor y permanece en el paso del código', async () => {
    configurarMfa.mockResolvedValue(CONFIG);
    activarMfa.mockRejectedValue(new Error('Código incorrecto'));
    render(<MfaSection perfil={{ mfaActivo: false }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Activar verificación en dos pasos' }));
    await screen.findByTestId('mfa-qr');
    fireEvent.change(screen.getByLabelText('Código de 6 dígitos'), { target: { value: '000000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y activar' }));
    expect(await screen.findByText('Código incorrecto')).toBeInTheDocument();
    expect(screen.getByTestId('mfa-qr')).toBeInTheDocument();
  });

  it('si no se puede iniciar la configuración, muestra el motivo', async () => {
    configurarMfa.mockRejectedValue(new Error('La verificación en dos pasos ya está activa'));
    render(<MfaSection perfil={{ mfaActivo: false }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Activar verificación en dos pasos' }));
    expect(await screen.findByText('La verificación en dos pasos ya está activa')).toBeInTheDocument();
  });

  it('Cancelar vuelve al inicio sin activar nada', async () => {
    configurarMfa.mockResolvedValue(CONFIG);
    render(<MfaSection perfil={{ mfaActivo: false }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Activar verificación en dos pasos' }));
    await screen.findByTestId('mfa-qr');
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByTestId('mfa-qr')).not.toBeInTheDocument();
    expect(activarMfa).not.toHaveBeenCalled();
  });

  it('usuario con MFA activa: «Activada» y puede desactivarla con contraseña y código', async () => {
    desactivarMfa.mockResolvedValue({ message: 'Verificación en dos pasos desactivada' });
    const onCambio = jest.fn().mockResolvedValue();
    render(<MfaSection perfil={{ mfaActivo: true, esAdmin: false }} onCambio={onCambio} />);
    expect(screen.getByText('Activada')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Desactivar' }));
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreta1' } });
    fireEvent.change(screen.getByLabelText('Código'), { target: { value: 'ABCDE-FGHIJ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Desactivar' }));
    await waitFor(() => expect(desactivarMfa).toHaveBeenCalledWith('secreta1', 'ABCDE-FGHIJ'));
    await waitFor(() => expect(onCambio).toHaveBeenCalled());
  });

  it('desactivar sin contraseña o sin código no envía nada', async () => {
    render(<MfaSection perfil={{ mfaActivo: true, esAdmin: false }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Desactivar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Desactivar' }));
    expect(await screen.findByText('Ingresa tu contraseña y un código')).toBeInTheDocument();
    expect(desactivarMfa).not.toHaveBeenCalled();
  });

  it('administrador sin MFA: ve el aviso de obligatoriedad y el botón para activarla', () => {
    render(<MfaSection perfil={{ mfaActivo: false, esAdmin: true }} />);
    expect(screen.getByRole('alert')).toHaveTextContent(/obligatoria/);
    expect(screen.getByRole('button', { name: 'Activar verificación en dos pasos' })).toBeInTheDocument();
  });

  it('administrador con MFA: no puede desactivarla', () => {
    render(<MfaSection perfil={{ mfaActivo: true, esAdmin: true }} />);
    expect(screen.getByText('Activada')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Desactivar' })).not.toBeInTheDocument();
    expect(screen.getByText(/no puede desactivar/)).toBeInTheDocument();
  });

  it('el aviso de obligatoriedad también aparece si se llega desde el login del administrador', () => {
    render(<MfaSection perfil={{ mfaActivo: false, esAdmin: false }} obligatorioAviso />);
    expect(screen.getByRole('alert')).toHaveTextContent(/obligatoria/);
  });
});
