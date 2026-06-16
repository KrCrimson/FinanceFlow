import React, { useState, useEffect } from 'react';
import { crearCierre, getResumenPeriodo } from '../services/cierresService';

function CajaChicaModal({ isOpen, onClose, tipo, periodo, defaultFondoFijo, onSuccess }) {
  const [fondoFijo, setFondoFijo] = useState(defaultFondoFijo || 1000);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [egresosTotales, setEgresosTotales] = useState(0);
  const [saldoFisico, setSaldoFisico] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [password, setPassword] = useState('');
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Cargar resumen de ingresos/egresos del periodo al abrir
  useEffect(() => {
    if (isOpen && periodo) {
      const cargarResumen = async () => {
        try {
          setLoadingResumen(true);
          setError('');
          const data = await getResumenPeriodo(tipo, periodo);
          setIngresosTotales(data.ingresosTotales || 0);
          setEgresosTotales(data.egresosTotales || 0);
        } catch (err) {
          setError(err.message || 'Error al obtener resumen de transacciones');
        } finally {
          setLoadingResumen(false);
        }
      };
      cargarResumen();
      // Resetear inputs
      setSaldoFisico('');
      setComentarios('');
      setPassword('');
    }
  }, [isOpen, tipo, periodo]);

  if (!isOpen) return null;

  const ff = Number(fondoFijo) || 0;
  const saldoEsperado = ff + ingresosTotales - egresosTotales;
  const fis = saldoFisico !== '' ? Number(saldoFisico) : saldoEsperado; // Autocompletar si no se digita, o requerir explícito
  const diferencia = (saldoFisico !== '' ? Number(saldoFisico) : saldoEsperado) - saldoEsperado;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saldoFisico === '') {
      setError('Por favor digite el dinero físico en caja');
      return;
    }
    if (tipo === 'mensual' && !password) {
      setError('Se requiere la contraseña para cerrar el mes');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await crearCierre({
        tipo,
        periodo,
        fondoFijo: ff,
        saldoFisico: Number(saldoFisico),
        comentarios,
        password
      });
      onSuccess(tipo, periodo);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el cierre. Verifique su contraseña.');
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-gray-100 transform scale-100 transition-all duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 bg-primary/10 text-primary rounded-full">
              🏛️ Arqueo de Caja Chica
            </span>
            <h3 className="text-2xl font-black text-gray-800 mt-2">
              Cierre {tipo === 'diario' ? 'Diario' : 'Mensual'}
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

        {loadingResumen ? (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-500 font-medium text-sm mt-4">Calculando balance del periodo...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Resumen Contable */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Resumen Contable (Monto Esperado)</h4>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600"> Fondo Fijo Asignado:</span>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400 font-bold">$</span>
                  <input
                    type="number"
                    value={fondoFijo}
                    onChange={(e) => setFondoFijo(e.target.value)}
                    required
                    className="w-20 bg-transparent border-b border-gray-300 focus:border-primary text-right font-bold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">📈 (+) Total Ingresos:</span>
                <span className="text-green-600 font-bold">+${ingresosTotales.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">📉 (-) Total Egresos:</span>
                <span className="text-red-600 font-bold">-${egresosTotales.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-gray-200/60 my-2 pt-2 flex justify-between items-center text-base font-bold">
                <span className="text-gray-800">💰 (=) Saldo Esperado en Caja:</span>
                <span className="text-gray-900">${saldoEsperado.toLocaleString()}</span>
              </div>
            </div>

            {/* Efectivo Físico */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💵 Dinero Físico Real en Caja
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-bold">$</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={saldoFisico}
                  onChange={(e) => setSaldoFisico(e.target.value)}
                  required
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-bold text-lg"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Suma todo el dinero físico en tu cajón o caja de efectivo.</p>
            </div>

            {/* Cálculo de diferencia */}
            {saldoFisico !== '' && (
              <div className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                diferencia === 0 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : diferencia < 0 
                    ? 'bg-red-50 border-red-200 text-red-800' 
                    : 'bg-yellow-50 border-yellow-200 text-yellow-800'
              }`}>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wider">Resultado del Arqueo</span>
                  <span className="text-sm font-medium">
                    {diferencia === 0 && '✅ Caja cuadra perfectamente.'}
                    {diferencia < 0 && '⚠️ Caja no cuadra. Hay un Faltante de dinero.'}
                    {diferencia > 0 && '💡 Caja no cuadra. Hay un Sobrante de dinero.'}
                  </span>
                </div>
                <span className="text-xl font-black">
                  {diferencia > 0 ? '+' : ''}${diferencia.toLocaleString()}
                </span>
              </div>
            )}

            {/* Comentarios */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Notas / Comentarios del Arqueo
              </label>
              <textarea
                placeholder="Explique aquí los motivos de faltantes/sobrantes si existieran..."
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm resize-none"
              />
            </div>

            {/* Confirmar con contraseña (solo para cierre mensual) */}
            {tipo === 'mensual' && (
              <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 animate-fade-in">
                <label className="block text-sm font-bold text-red-800 mb-2 flex items-center gap-1.5">
                  🔒 Confirmación de Seguridad
                </label>
                <input
                  type="password"
                  placeholder="Ingrese su contraseña de cuenta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white"
                />
                <p className="text-xs text-red-600 mt-2 font-semibold">
                  ⚠️ Esta acción es irreversible. Una vez cerrada la caja, no podrás añadir ni modificar ningún movimiento de este periodo.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-850 px-4 py-3 rounded-xl text-sm font-semibold flex items-center">
                <span className="mr-2">❌</span>
                {error}
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-150 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors duration-200 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || saldoFisico === ''}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center text-sm"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4.5 w-4.5 border-b-2 border-white mr-2"></div>
                    Cerrando Periodo...
                  </>
                ) : (
                  <>💾 Confirmar Cierre</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CajaChicaModal;
