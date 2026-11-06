/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/RegisterPage.test.jsx
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de RegisterPage: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-01  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-10
 * Casos de uso ....: CU-01 Registrar cuenta
 * Reglas de negocio : RN-01
 * Depende de ......: frontend/src/pages/RegisterPage.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */


import { render, screen, fireEvent, act } from '@testing-library/react';
import RegisterPage from '../pages/RegisterPage';

describe('RegisterPage', () => {
  it('renderiza el formulario y valida campos', async () => {
    render(<RegisterPage />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Nombre/i), { target: { value: 'A' } });
      fireEvent.blur(screen.getByPlaceholderText(/Nombre/i));
      fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
    });
    expect(await screen.findByText(/Nombre muy corto/i)).toBeInTheDocument();
  });
  it('muestra mensaje de éxito tras registro simulado', async () => {
    render(<RegisterPage />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Nombre/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@mail.com' } });
      fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: '123456' } });
      fireEvent.click(screen.getByRole('button'));
    });
    // Aquí deberías mockear el servicio y esperar el mensaje de éxito
  });
});
