import React, { useState } from 'react';
import { useMovimientos } from '../hooks/useMovimientos';
import { useAnalisisGastos } from '../hooks/useAnalisisGastos';
import { inhabilitarMovimiento, updateMovimiento } from '../services/movimientosService';
import AlertasComponent from '../components/AlertasComponent';
import PlanificadorCompras from '../components/PlanificadorCompras';

const currentMonthStr = new Date().toISOString().slice(0, 7);

const formatMonthYear = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
};

function DashboardPage() {
  const { movimientos, loading, error } = useMovimientos();
  const { alertas, estadisticasPorCategoria, resumenMensual, calcularTiempoParaCompra, obtenerSugerenciasAhorro } = useAnalisisGastos();
  const [actualizando, setActualizando] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [vistaActiva, setVistaActiva] = useState('dashboard'); // 'dashboard' o 'planificador'
  const [mesFiltro, setMesFiltro] = useState(currentMonthStr);

  const handleCancelarConstancia = async (id) => {
    setActualizando(id);
    setFeedback('');
    try {
      await updateMovimiento(id, { esRecurrente: false });
      setFeedback('Constancia de ingreso cancelada con éxito');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      setFeedback('Error al cancelar la constancia del ingreso');
    } finally {
      setActualizando(null);
    }
  };

  const handleInhabilitar = async (id) => {
    setActualizando(id);
    setFeedback('');
    try {
      await inhabilitarMovimiento(id);
      setFeedback('Movimiento desactivado correctamente');
      // Actualizar la lista sin recargar la página
      window.location.reload();
    } catch (e) {
      setFeedback('Error al desactivar el movimiento');
    } finally {
      setActualizando(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh] text-lg animate-pulse">Cargando movimientos...</div>;
  if (error) return <div className="text-red-500 text-center mt-8 animate-fade-in">Error: {error.message}</div>;

  // Asegurar que movimientos sea un array
  const movimientosArray = Array.isArray(movimientos) ? movimientos : [];

  // Obtener meses disponibles dinámicamente de los movimientos
  const mesesDisponibles = Array.from(new Set(
    movimientosArray
      .map(m => {
        const date = new Date(m.fecha || m.creadoEn);
        return isNaN(date.getTime()) ? null : date.toISOString().slice(0, 7);
      })
      .filter(Boolean)
  )).sort((a, b) => b.localeCompare(a));
  
  if (!mesesDisponibles.includes(currentMonthStr)) {
    mesesDisponibles.unshift(currentMonthStr);
  }

  const activos = movimientosArray.filter(m => m.estado === 'activo');
  const inactivos = movimientosArray.filter(m => m.estado === 'inactivo');

  // Filtrar movimientos por el mes seleccionado
  const activosFiltrados = activos.filter(m => {
    if (mesFiltro === 'general') return true;
    const date = new Date(m.fecha || m.creadoEn);
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 7) === mesFiltro;
  });

  const inactivosFiltrados = inactivos.filter(m => {
    if (mesFiltro === 'general') return true;
    const date = new Date(m.fecha || m.creadoEn);
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 7) === mesFiltro;
  });

  const movimientosFiltrados = movimientosArray.filter(m => {
    if (mesFiltro === 'general') return true;
    const date = new Date(m.fecha || m.creadoEn);
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 7) === mesFiltro;
  });

  // Ingresos constantes
  const ingresosConstantes = activos.filter(m => m.tipo === 'ingreso' && m.esRecurrente === true);

  const ingresos = activosFiltrados.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);
  const egresos = activosFiltrados.filter(m => m.tipo === 'egreso').reduce((acc, m) => acc + m.monto, 0);
  const balance = ingresos - egresos;

  return (
    <div className="min-h-[80vh] bg-background py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header con acciones rápidas */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🏠 Dashboard</h1>
              <p className="text-gray-600">Resumen de tu actividad financiera</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Selector de Mes */}
              <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <span className="text-gray-600 font-semibold text-sm">📅 Filtrar:</span>
                <select
                  value={mesFiltro}
                  onChange={e => setMesFiltro(e.target.value)}
                  className="bg-transparent text-gray-800 font-bold text-sm focus:outline-none cursor-pointer"
                >
                  {mesesDisponibles.map(m => (
                    <option key={m} value={m}>
                      {formatMonthYear(m)}
                    </option>
                  ))}
                  <option value="general">📊 Histórico General</option>
                </select>
              </div>

              <a 
                href="/movimiento" 
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2 text-sm"
              >
                <span>➕</span>
                <span>Nuevo Movimiento</span>
              </a>
              <a 
                href="/reportes" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2 text-sm"
              >
                <span>📊</span>
                <span>Ver Reportes</span>
              </a>
            </div>
          </div>
        </div>

        {/* Cards de resumen mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 font-medium">Total Ingresos</p>
                <p className="text-3xl font-bold">${ingresos.toLocaleString()}</p>
              </div>
              <div className="text-4xl opacity-80">📈</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 font-medium">Total Egresos</p>
                <p className="text-3xl font-bold">${egresos.toLocaleString()}</p>
              </div>
              <div className="text-4xl opacity-80">📉</div>
            </div>
          </div>
          
          <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-400 to-blue-600' : 'from-orange-400 to-orange-600'} rounded-2xl shadow-lg p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 font-medium">Balance Total</p>
                <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
              </div>
              <div className="text-4xl opacity-80">{balance >= 0 ? '💰' : '⚠️'}</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-medium">Movimientos</p>
                <p className="text-3xl font-bold">{activosFiltrados.length}</p>
                <p className="text-sm text-purple-200">{inactivosFiltrados.length} inactivos</p>
              </div>
              <div className="text-4xl opacity-80">📋</div>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setVistaActiva('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                vistaActiva === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setVistaActiva('planificador')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                vistaActiva === 'planificador' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎯 Planificador de Compras
            </button>
          </div>
        </div>

        {/* Contenido según la pestaña activa */}
        {vistaActiva === 'dashboard' && (
          <>
            {/* Alertas de gastos */}
            <AlertasComponent alertas={alertas} />

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-xl animate-fade-in mb-6 ${
                feedback.includes('Error') 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">{feedback.includes('Error') ? '❌' : '✅'}</span>
                  {feedback}
                </div>
              </div>
            )}

            {/* Layout de 2 columnas: Movimientos y Ingresos Constantes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Tabla de movimientos mejorada */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden h-fit">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">💳 Movimientos Recientes</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {activosFiltrados.length} activos, {inactivosFiltrados.length} inactivos
                      </span>
                    </div>
                  </div>
                </div>
                
                {movimientosFiltrados.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {movimientosFiltrados.slice(0, 10).map(m => (
                          <tr key={m._id} className={`hover:bg-gray-50 transition-colors ${m.estado === 'inactivo' ? 'opacity-50 bg-gray-50' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                m.estado === 'inactivo' 
                                  ? 'bg-gray-100 text-gray-500' 
                                  : m.tipo === 'ingreso' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {m.tipo === 'ingreso' ? '💰' : '💸'} {m.tipo}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-medium ${
                                m.estado === 'inactivo' ? 'text-gray-400 line-through' : 'text-gray-900'
                              }`}>{m.nombre}</div>
                              {m.descripcion && (
                                <div className={`text-sm truncate max-w-xs ${
                                  m.estado === 'inactivo' ? 'text-gray-400' : 'text-gray-500'
                                }`}>{m.descripcion}</div>
                              )}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                              m.estado === 'inactivo' 
                                ? 'text-gray-400 line-through' 
                                : m.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ${(m.monto || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                m.estado === 'inactivo' 
                                  ? 'bg-gray-50 text-gray-400' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {m.categoria || 'Sin categoría'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                m.estado === 'activo' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {m.estado === 'activo' ? '✅' : '⏸️'} {m.estado}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {m.estado === 'activo' && (
                                <button 
                                  onClick={() => handleInhabilitar(m._id)} 
                                  disabled={actualizando === m._id}
                                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                                >
                                  {actualizando === m._id ? (
                                    <span className="flex items-center">
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-1"></div>
                                      Desactivando...
                                    </span>
                                  ) : (
                                    '⏸️ Desactivar'
                                  )}
                                </button>
                              )}
                              {m.estado === 'inactivo' && (
                                <span className="text-gray-400 text-xs">Inactivo</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {movimientosFiltrados.length > 10 && (
                      <div className="px-6 py-4 border-t border-gray-200 text-center">
                        <a 
                          href="/reportes" 
                          className="text-primary hover:text-primary/80 font-medium text-sm"
                        >
                          Ver todos los movimientos ({movimientosFiltrados.length}) →
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No hay movimientos</h3>
                    <p className="text-gray-500 mb-4">No se encontraron movimientos registrados en este periodo</p>
                    <a 
                      href="/movimiento"
                      className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200"
                    >
                      <span className="mr-2">➕</span>
                      Agregar movimiento
                    </a>
                  </div>
                )}
              </div>

              {/* Panel de ingresos constantes */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col h-fit">
                <div className="border-b border-gray-100 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    🔁 Ingresos Constantes
                  </h3>
                  <p className="text-xs text-gray-500">Tus ingresos recurrentes mensuales</p>
                </div>

                {ingresosConstantes.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {ingresosConstantes.map(inc => (
                      <div key={inc._id} className="p-3 bg-green-50/60 hover:bg-green-55 border border-green-100 rounded-xl transition-all duration-200">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{inc.nombre}</p>
                            <p className="text-xs text-gray-500">{inc.categoria} • {new Date(inc.fecha || inc.creadoEn).toLocaleDateString()}</p>
                          </div>
                          <p className="font-bold text-green-700 text-sm">
                            +${inc.monto.toLocaleString()}
                          </p>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => handleCancelarConstancia(inc._id)}
                            disabled={actualizando === inc._id}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors duration-200 disabled:opacity-50"
                          >
                            {actualizando === inc._id ? 'Cancelando...' : '❌ Cancelar Constancia'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-2xl mb-1">🔁</p>
                    <p className="text-sm font-medium text-gray-500">No hay ingresos constantes</p>
                    <p className="text-xs text-gray-400 mt-1">Marca la opción de recurrencia al crear un ingreso</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {vistaActiva === 'planificador' && (
          <PlanificadorCompras 
            resumenMensual={resumenMensual}
            estadisticasPorCategoria={estadisticasPorCategoria}
            calcularTiempoParaCompra={calcularTiempoParaCompra}
            obtenerSugerenciasAhorro={obtenerSugerenciasAhorro}
            movimientos={movimientos}
          />
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
