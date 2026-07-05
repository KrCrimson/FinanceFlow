import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import logger from '../utils/logger';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token de recuperación no válido');
      setTokenValid(false);
      return;
    }

    // Verificar token
    const verifyToken = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/api/usuarios/verify-reset-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });

        if (response.ok) {
          setTokenValid(true);
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Token no válido o expirado');
        }
      } catch (err) {
        setError(err.message);
        setTokenValid(false);
        logger.logApiError('/usuarios/verify-reset-token', err, { token });
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      logger.logUserAction('password_reset_submit');

      const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/usuarios/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Contraseña actualizada exitosamente. Redirigiendo al login...');
        logger.info('Password reset successful');
        
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Contraseña actualizada. Puedes iniciar sesión con tu nueva contraseña.' }
          });
        }, 2000);
      } else {
        throw new Error(data.message || 'Error al actualizar contraseña');
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al procesar la solicitud';
      setError(errorMessage);
      logger.logApiError('/usuarios/reset-password', err, { token });
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando enlace de recuperación...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Enlace No Válido</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link 
              to="/forgot-password" 
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🔑 Solicitar Nuevo Enlace
            </Link>
            <Link 
              to="/login" 
              className="block text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            >
              ← Volver al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Nueva Contraseña
          </h1>
          <p className="text-gray-600">
            Crea una nueva contraseña segura para tu cuenta
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              🔒 Nueva Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              🔒 Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Repite la contraseña"
              disabled={loading}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Consejos para una contraseña segura:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Al menos 6 caracteres de longitud</li>
              <li>• Combina letras mayúsculas y minúsculas</li>
              <li>• Incluye números y símbolos</li>
              <li>• Evita información personal</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Actualizando...
              </>
            ) : (
              <>
                🔐 Actualizar Contraseña
              </>
            )}
          </button>
        </form>

        {/* Enlaces */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link 
            to="/login" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
          >
            ← Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;