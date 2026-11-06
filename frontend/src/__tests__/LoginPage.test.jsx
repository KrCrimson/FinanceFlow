/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/LoginPage.test.jsx
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de LoginPage: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-02, RF-03, RF-42, RF-44  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-10
 * Casos de uso ....: CU-02 Iniciar sesión
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-07, RN-08, RN-26, RN-28
 * Depende de ......: frontend/src/pages/LoginPage.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';


describe('LoginPage', () => {
  it('renderiza el formulario y valida campos', async () => {
    render(<LoginPage />);
    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'mal' } });
      fireEvent.blur(screen.getByPlaceholderText(/Email/i));
      fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));
    });
    expect(await screen.findByText(/Email inválido/i)).toBeInTheDocument();
  });
});
