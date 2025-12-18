
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
