import React, { useEffect, useState } from 'react';
import { getReportes } from '../services/reportesService';
import { getMovimientos } from '../services/movimientosService';
import { useNavigate } from 'react-router-dom';

function ReportesPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('resumen');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError('');
        const [logsData, movimientosData] = await Promise.all([
          getReportes().catch(() => []),
          getMovimientos().catch(() => [])
        ]);
        setLogs(Array.isArray(logsData) ? logsData : []);
        setMovimientos(Array.isArray(movimientosData) ? movimientosData : []);
      } catch (e) {
        setError('Error al cargar los datos');
        console.error('Error:', e);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Generando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="font-semibold">Error al cargar reportes</p>
          <p className="text-sm mt-2">{error}</p>
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

  // Cálculos para el resumen
  const movimientosActivos = movimientos.filter(m => m.estado === 'activo');
  const totalIngresos = movimientosActivos
    .filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + (m.monto || 0), 0);
  const totalEgresos = movimientosActivos
    .filter(m => m.tipo === 'egreso')
    .reduce((sum, m) => sum + (m.monto || 0), 0);
  const balance = totalIngresos - totalEgresos;

  // Filtros
  const movimientosFiltrados = movimientosActivos.filter(m => {
    const cumpleMes = !filtroMes || (m.creadoEn && new Date(m.creadoEn).getMonth() === parseInt(filtroMes));
    const cumpleCategoria = !filtroCategoria || m.categoria === filtroCategoria;
    return cumpleMes && cumpleCategoria;
  });

  const categorias = [...new Set(movimientos.map(m => m.categoria).filter(Boolean))];

  const meses = [
    { value: 0, label: 'Enero' }, { value: 1, label: 'Febrero' }, { value: 2, label: 'Marzo' },
    { value: 3, label: 'Abril' }, { value: 4, label: 'Mayo' }, { value: 5, label: 'Junio' },
    { value: 6, label: 'Julio' }, { value: 7, label: 'Agosto' }, { value: 8, label: 'Septiembre' },
    { value: 9, label: 'Octubre' }, { value: 10, label: 'Noviembre' }, { value: 11, label: 'Diciembre' }
  ];

  return (
    <div className="min-h-[80vh] bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Reportes y Análisis</h1>
              <p className="text-gray-600">Resumen completo de tu actividad financiera</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/movimiento')}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                ➕ Nuevo Movimiento
              </button>
              <button 
                onClick={() => navigate('/')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                ← Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'resumen', label: '📈 Resumen General', icon: '📈' },
              { id: 'movimientos', label: '💰 Movimientos', icon: '💰' },
              { id: 'logs', label: '📋 Historial', icon: '📋' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'resumen' && (
              <div className="space-y-6">
                {/* Resumen Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 font-medium">Total Ingresos</p>
                        <p className="text-2xl font-bold text-green-800">${totalIngresos.toLocaleString()}</p>
                      </div>
                      <div className="text-3xl text-green-500">📈</div>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 font-medium">Total Egresos</p>
                        <p className="text-2xl font-bold text-red-800">${totalEgresos.toLocaleString()}</p>
                      </div>
                      <div className="text-3xl text-red-500">📉</div>
                    </div>
                  </div>
                  <div className={`${balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border rounded-xl p-6`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`${balance >= 0 ? 'text-blue-600' : 'text-orange-600'} font-medium`}>Balance</p>
                        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                          ${balance.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-3xl">{balance >= 0 ? '💰' : '⚠️'}</div>
                    </div>
                  </div>
                </div>

                {/* Estadísticas por categoría */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Movimientos por Categoría</h3>
                  {categorias.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorias.map(categoria => {
                        const movsCat = movimientosActivos.filter(m => m.categoria === categoria);
                        const total = movsCat.reduce((sum, m) => sum + (m.monto || 0), 0);
                        return (
                          <div key={categoria} className="bg-white rounded-lg p-4 border">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">{categoria}</span>
                              <span className="text-sm text-gray-500">({movsCat.length})</span>
                            </div>
                            <div className="text-lg font-bold text-gray-800">${total.toLocaleString()}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No hay movimientos categorizados</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'movimientos' && (
              <div className="space-y-6">
                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-xl">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por mes</label>
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
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por categoría</label>
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
                  <div className="flex items-end">
                    <button 
                      onClick={() => {setFiltroMes(''); setFiltroCategoria('');}}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                </div>

                {/* Lista de Movimientos */}
                {movimientosFiltrados.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-xl">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Monto</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoría</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {movimientosFiltrados.map(m => (
                          <tr key={m._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                m.tipo === 'ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {m.tipo === 'ingreso' ? '💰' : '💸'} {m.tipo}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">{m.nombre}</td>
                            <td className={`px-4 py-3 font-semibold ${
                              m.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ${(m.monto || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{m.categoria}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                m.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {m.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-xl font-medium mb-2">No hay movimientos</p>
                    <p>Con los filtros aplicados no se encontraron resultados</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'logs' && (
              <div>
                {logs.length > 0 ? (
                  <div className="space-y-3">
                    {logs.slice(0, 20).map((log, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{log.accion || 'Acción no especificada'}</p>
                            <p className="text-sm text-gray-600 mt-1">{log.descripcion || 'Sin descripción'}</p>
                          </div>
                          <span className="text-xs text-gray-500 ml-4">
                            {log.fecha ? new Date(log.fecha).toLocaleDateString() : 'Sin fecha'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-xl font-medium mb-2">No hay historial disponible</p>
                    <p>Los logs del sistema aparecerán aquí</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportesPage;
