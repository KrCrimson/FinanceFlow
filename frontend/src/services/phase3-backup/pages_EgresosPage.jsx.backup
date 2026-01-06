import React, { useState } from 'react';
import { useMovimientos } from '../hooks/useMovimientos';
import { useNavigate } from 'react-router-dom';
import { inhabilitarMovimiento } from '../services/movimientosService';

function EgresosPage() {
  const navigate = useNavigate();
  const { movimientos, loading, error } = useMovimientos();
  const [actualizando, setActualizando] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleInhabilitar = async (id) => {
    setActualizando(id);
    setFeedback('');
    try {
      await inhabilitarMovimiento(id);
      setFeedback('✅ Egreso desactivado exitosamente');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {
      setFeedback('❌ Error al desactivar el egreso');
    } finally {
      setActualizando(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Cargando egresos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="font-semibold">Error al cargar egresos</p>
          <p className="text-sm mt-2">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const movimientosArray = Array.isArray(movimientos) ? movimientos : [];
  const egresos = movimientosArray.filter(m => m.tipo === 'egreso');
  const egresosActivos = egresos.filter(m => m.estado === 'activo');
  const totalEgresos = egresosActivos.reduce((sum, m) => sum + (m.monto || 0), 0);
  const promedioMensual = egresosActivos.length > 0 ? totalEgresos / Math.max(1, new Set(egresosActivos.map(m => 
    m.creadoEn ? new Date(m.creadoEn).getMonth() : new Date().getMonth()
  )).size) : 0;

  // Análisis por categoría
  const gastosPorCategoria = {};
  egresosActivos.forEach(egreso => {
    const categoria = egreso.categoria || 'Sin categoría';
    gastosPorCategoria[categoria] = (gastosPorCategoria[categoria] || 0) + (egreso.monto || 0);
  });
  const categoriaConMayorGasto = Object.entries(gastosPorCategoria)
    .sort(([,a], [,b]) => b - a)[0] || ['Sin gastos', 0];

  // Filtros
  const egresosFiltrados = egresos.filter(m => {
    const cumpleCategoria = !filtroCategoria || m.categoria === filtroCategoria;
    const cumpleMes = !filtroMes || (m.creadoEn && new Date(m.creadoEn).getMonth() === parseInt(filtroMes));
    return cumpleCategoria && cumpleMes;
  });

  const categorias = [...new Set(egresos.map(m => m.categoria).filter(Boolean))];
  const meses = [
    { value: 0, label: 'Enero' }, { value: 1, label: 'Febrero' }, { value: 2, label: 'Marzo' },
    { value: 3, label: 'Abril' }, { value: 4, label: 'Mayo' }, { value: 5, label: 'Junio' },
    { value: 6, label: 'Julio' }, { value: 7, label: 'Agosto' }, { value: 8, label: 'Septiembre' },
    { value: 9, label: 'Octubre' }, { value: 10, label: 'Noviembre' }, { value: 11, label: 'Diciembre' }
  ];

  return (
    <div className="min-h-[80vh] bg-background py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">💸 Gestión de Egresos</h1>
              <p className="text-red-100">Controla y analiza todos tus gastos</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/movimiento')}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                ➕ Nuevo Egreso
              </button>
              <button 
                onClick={() => navigate('/')}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                ← Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Total de Egresos</p>
                <p className="text-2xl font-bold text-red-600">${totalEgresos.toLocaleString()}</p>
              </div>
              <div className="text-3xl text-red-500">📉</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Promedio Mensual</p>
                <p className="text-2xl font-bold text-orange-600">${promedioMensual.toFixed(0).toLocaleString()}</p>
              </div>
              <div className="text-3xl text-orange-500">📊</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Cantidad Activos</p>
                <p className="text-2xl font-bold text-purple-600">{egresosActivos.length}</p>
                <p className="text-sm text-gray-500">{egresos.length - egresosActivos.length} inactivos</p>
              </div>
              <div className="text-3xl text-purple-500">💳</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Mayor Gasto</p>
                <p className="text-lg font-bold text-gray-800">{categoriaConMayorGasto[0]}</p>
                <p className="text-sm text-red-600 font-semibold">${categoriaConMayorGasto[1].toLocaleString()}</p>
              </div>
              <div className="text-3xl text-gray-500">🎯</div>
            </div>
          </div>
        </div>

        {/* Análisis por Categoría */}
        {Object.keys(gastosPorCategoria).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Gastos por Categoría</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(gastosPorCategoria)
                .sort(([,a], [,b]) => b - a)
                .map(([categoria, monto]) => {
                  const porcentaje = totalEgresos > 0 ? (monto / totalEgresos * 100).toFixed(1) : 0;
                  return (
                    <div key={categoria} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-700 text-sm">{categoria}</span>
                        <span className="text-xs text-gray-500">{porcentaje}%</span>
                      </div>
                      <div className="text-xl font-bold text-red-600">${monto.toLocaleString()}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                          style={{width: `${porcentaje}%`}}
                        ></div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Filtros</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select 
                value={filtroCategoria} 
                onChange={e => setFiltroCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
              <select 
                value={filtroMes} 
                onChange={e => setFiltroMes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todos los meses</option>
                {meses.map(mes => (
                  <option key={mes.value} value={mes.value}>{mes.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => {setFiltroCategoria(''); setFiltroMes('');}}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-xl animate-fade-in ${
            feedback.includes('Error') 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {feedback}
          </div>
        )}

        {/* Lista de Egresos */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Lista de Egresos ({egresosFiltrados.length})</h3>
          </div>
          
          {egresosFiltrados.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {egresosFiltrados.map(egreso => (
                    <tr key={egreso._id} className={`hover:bg-gray-50 transition-colors ${egreso.estado === 'inactivo' ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{egreso.nombre}</div>
                        {egreso.descripcion && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{egreso.descripcion}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                        ${(egreso.monto || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {egreso.categoria || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          egreso.estado === 'activo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {egreso.estado === 'activo' ? '✅ Activo' : '⏸️ Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {egreso.estado === 'activo' && (
                          <button 
                            onClick={() => handleInhabilitar(egreso._id)} 
                            disabled={actualizando === egreso._id}
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                          >
                            {actualizando === egreso._id ? (
                              <span className="flex items-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-1"></div>
                                Desactivando...
                              </span>
                            ) : (
                              '⏸️ Desactivar'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💸</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No hay egresos</h3>
              <p className="text-gray-500 mb-4">Comienza registrando tu primer gasto</p>
              <button 
                onClick={() => navigate('/movimiento')}
                className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                <span className="mr-2">➕</span>
                Agregar Egreso
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EgresosPage;
