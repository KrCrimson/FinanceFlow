import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/auth-adapter';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres' })
});

function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user, updateAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register: reg, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Mostrar mensaje de éxito si viene del reset de contraseña
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el estado
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    console.log("Intento de login. API URL:", process.env.REACT_APP_API_URL);
    try {
      await login(data.email, data.password);
      updateAuth(); // Actualizar el estado de autenticación
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background animate-fade-in">
      <div className="bg-white/80 shadow-soft rounded-xl p-8 w-full max-w-md flex flex-col gap-4 border border-primary/30">
        <h2 className="text-2xl font-bold text-center mb-2">Iniciar sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-2">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span className="text-sm">{successMessage}</span>
              </div>
            </div>
          )}
          <input type="email" placeholder="Email" {...reg('email')} className="rounded-xl border border-primary/40 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          {errors.email && <div className="text-red-500 text-sm animate-pulse">{errors.email.message}</div>}
          <input type="password" placeholder="Contraseña" {...reg('password')} className="rounded-xl border border-primary/40 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          {errors.password && <div className="text-red-500 text-sm animate-pulse">{errors.password.message}</div>}
          <button type="submit" disabled={loading} className="bg-primary text-text font-semibold rounded-xl py-2 mt-2 shadow hover:bg-secondary transition-colors duration-200 disabled:opacity-60">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          {error && <div className="text-red-500 text-center animate-fade-in">{error}</div>}
        </form>
        
        <div className="text-center text-sm mt-4 space-y-2">
          <p>
            <a href="/forgot-password" className="text-primary underline hover:text-accent transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </p>
          <p>¿No tienes cuenta? <a href="/register" className="text-primary underline hover:text-accent transition-colors">Regístrate</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
