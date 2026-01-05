import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logger from '../utils/logger';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor ingresa un email válido');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      logger.logUserAction('password_reset_request', { email });

      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/api/usuarios/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Se ha enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada.');
        logger.info('Password reset email sent successfully', { email });
      } else {
        throw new Error(data.message || 'Error al enviar email de recuperación');
      }
    } catch (err) {
      let errorMessage = 'Error al procesar la solicitud';
      
      if (err.message.includes('configuración')) {
        errorMessage = 'Error de configuración del servidor. Contacta al administrador.';
      } else if (err.message.includes('EMAIL_USER')) {
        errorMessage = 'El servidor no está configurado para enviar emails. Contacta al administrador.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      logger.logApiError('/usuarios/forgot-password', err, { email });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Recuperar Contraseña
          </h1>
          <p className="text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {/* Mensajes */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span className="text-sm">{message}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">❌</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              📧 Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="tu.email@ejemplo.com"
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                📤 Enviar Enlace de Recuperación
              </>
            )}
          </button>
        </form>

        {/* Enlaces */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-3">
          <div>
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            >
              ← Volver al Login
            </Link>
          </div>
          <div>
            <span className="text-gray-500 text-sm">¿No tienes cuenta? </span>
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;