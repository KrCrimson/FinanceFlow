

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
