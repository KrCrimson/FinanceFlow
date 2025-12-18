import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register as registerUser } from '../services/authService';

const schema = z.object({
  nombre: z.string().min(2, { message: 'Nombre muy corto' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres' })
});

function RegisterPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await registerUser(data.nombre, data.email, data.password);
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background animate-fade-in">
      <div className="bg-white/80 shadow-soft rounded-xl p-8 w-full max-w-md flex flex-col gap-4 border border-primary/30">
        <h2 className="text-2xl font-bold text-center mb-2">Registro</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <input type="text" placeholder="Nombre" {...register('nombre')} className="rounded-xl border border-primary/40 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          {errors.nombre && <div className="text-red-500 text-sm animate-pulse">{errors.nombre.message}</div>}
          <input type="email" placeholder="Email" {...register('email')} className="rounded-xl border border-primary/40 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          {errors.email && <div className="text-red-500 text-sm animate-pulse">{errors.email.message}</div>}
          <input type="password" placeholder="Contraseña" {...register('password')} className="rounded-xl border border-primary/40 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          {errors.password && <div className="text-red-500 text-sm animate-pulse">{errors.password.message}</div>}
          <button type="submit" disabled={loading} className="bg-primary text-text font-semibold rounded-xl py-2 mt-2 shadow hover:bg-secondary transition-colors duration-200 disabled:opacity-60">
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          {error && <div className="text-red-500 text-center animate-fade-in">{error}</div>}
          {success && <div className="text-green-600 text-center animate-fade-in">{success}</div>}
        </form>
        <p className="text-center text-sm mt-2">¿Ya tienes cuenta? <a href="/login" className="text-primary underline hover:text-accent transition-colors">Inicia sesión</a></p>
      </div>
    </div>
  );
}

export default RegisterPage;
