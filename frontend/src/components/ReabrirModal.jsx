import React, { useState } from 'react';
import { reabrirCierre } from '../services/cierresService';

function ReabrirModal({ isOpen, onClose, tipo, periodo, onSuccess }) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('La contraseña es requerida');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await reabrirCierre({
        tipo,
        periodo,
        password
      });
      onSuccess(tipo, periodo);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al reabrir el periodo. Verifique su contraseña.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFormatPeriodoLabel = () => {
    if (tipo === 'diario') {
      const [year, month, day] = periodo.split('-');
      const monthNames = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ];
      return `${day} de ${monthNames[parseInt(month, 10) - 1]} ${year}`;
    } else {
      const [year, month] = periodo.split('-');
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return `${monthNames[parseInt(month, 10) - 1]} de ${year}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100 transform scale-100 transition-all duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-full">
              🔓 Reapertura de Periodo
            </span>
            <h3 className="text-2xl font-black text-gray-800 mt-2">
              Reabrir {tipo === 'diario' ? 'Día' : 'Mes'}
            </h3>
            <p className="text-gray-500 font-medium text-sm mt-0.5">
              Periodo: <span className="text-gray-700 font-bold">{getFormatPeriodoLabel()}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-xl transition-all duration-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Reabrir este periodo te permitirá volver a registrar, editar o inactivar movimientos correspondientes a esta fecha. Para confirmar, introduce tu contraseña de cuenta.
          </p>

          <div>
            <label className="block text-sm font-bold text-gray-750 mb-2">
              🔒 Contraseña de Cuenta
            </label>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold py-3 px-6 rounded-xl transition-colors duration-200 text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !password}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center text-sm"
            >
              {submitting ? 'Reabriendo...' : '🔓 Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReabrirModal;
