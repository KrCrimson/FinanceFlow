import React, { useState, useEffect } from 'react';
import { useMovimientos } from '../hooks/useMovimientos';
import { useAnalisisGastos } from '../hooks/useAnalisisGastos';
import { inhabilitarMovimiento, updateMovimiento, createMovimiento } from '../services/movimientos-adapter';
import AlertasComponent from '../components/AlertasComponent';
import PlanificadorCompras from '../components/PlanificadorCompras';
import { getCierresPendientes, crearCierre, getCierres } from '../services/cierresService';
import CajaChicaModal from '../components/CajaChicaModal';
import ReabrirModal from '../components/ReabrirModal';
import { getProfile } from '../services/usuarios-adapter';

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
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  // Estados para Cierre de Caja Chica (Opción 1)
  const [pendientes, setPendientes] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [posponerCierre, setPosponerCierre] = useState({ yesterday: false, prevMonth: false });
  const [modalCierre, setModalCierre] = useState({ isOpen: false, tipo: 'diario', periodo: '' });
  const [cierresRealizados, setCierresRealizados] = useState([]);
  const [modalReabrir, setModalReabrir] = useState({ isOpen: false, tipo: 'mensual', periodo: '' });

  const cargarPendientesYPerfil = async () => {
    try {
      const localDate = new Date().toISOString().slice(0, 10);
      const dataPendientes = await getCierresPendientes(localDate);
      setPendientes(dataPendientes);
      
      const dataPerfil = await getProfile();
      setPerfil(dataPerfil);

      const listCierres = await getCierres();
      setCierresRealizados(listCierres);
    } catch (err) {
      console.error('Error al cargar pendientes o perfil:', err);
    }
  };

  useEffect(() => {
    cargarPendientesYPerfil();
  }, []);

  const handleCierreExitoso = (tipo, periodo) => {
    setFeedback(`✅ Cierre ${tipo} del periodo ${periodo} registrado exitosamente.`);
    cargarPendientesYPerfil();
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleReabrirExitoso = (tipo, periodo) => {
    setFeedback(`🔓 El periodo ${periodo} ha sido reabierto con éxito. Ahora puedes realizar modificaciones.`);
    cargarPendientesYPerfil();
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleVerificacionRapidaAyer = async () => {
    if (!pendientes || !pendientes.yesterday) return;
    const { date, resumen } = pendientes.yesterday;
    setActualizando('verificacion-rapida');
    try {
      const ff = perfil?.fondoFijo || 0;
      const expected = ff + (resumen?.ingresosTotales || 0) - (resumen?.egresosTotales || 0);
      await crearCierre({
        tipo: 'diario',
        periodo: date,
        fondoFijo: ff,
        saldoFisico: expected,
        comentarios: 'Verificación diaria rápida (Todo en orden)',
        password: 'N/A' // Se ignora en el backend para cierres diarios
      });
      handleCierreExitoso('diario', date);
    } catch (err) {
      setFeedback(`❌ Error al realizar verificación rápida: ${err.message}`);
      setTimeout(() => setFeedback(''), 5000);
    } finally {
      setActualizando(null);
    }
  };

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

  const esMesFiltroManualCerrado = mesFiltro !== 'general' && cierresRealizados.some(c => c.tipo === 'mensual' && c.periodo === mesFiltro);
  
  const esMesFiltroAutoCerrado = (() => {
    if (mesFiltro === 'general') return false;
    const today = new Date();
    const currentPeriodo = today.toISOString().slice(0, 7); // YYYY-MM
    const [y1, m1] = mesFiltro.split('-').map(Number);
    const [y2, m2] = currentPeriodo.split('-').map(Number);
    const diferenciaMeses = (y2 - y1) * 12 + (m2 - m1);
    return diferenciaMeses >= 2;
  })();

  const esMesFiltroCerrado = esMesFiltroManualCerrado || esMesFiltroAutoCerrado;

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
              {/* Selector de Mes Estilizado */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownAbierto(!dropdownAbierto)}
                  className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold text-gray-700"
                >
                  <span>📅</span>
                  <span>
                    {mesFiltro === 'general' ? '📊 Histórico General' : formatMonthYear(mesFiltro)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownAbierto ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownAbierto && (
                  <>
                    {/* Backdrop invisible para cerrar al hacer click fuera */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setDropdownAbierto(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl shadow-xl z-20 py-1.5 animate-fade-in divide-y divide-gray-100">
                      <div className="py-1">
                        {mesesDisponibles.map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setMesFiltro(m);
                              setDropdownAbierto(false);
                            }}
                            className={`flex items-center w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                              mesFiltro === m 
                                ? 'bg-primary/10 text-primary font-semibold' 
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <span className="mr-2">📅</span>
                            {formatMonthYear(m)}
                          </button>
                        ))}
                      </div>
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setMesFiltro('general');
                            setDropdownAbierto(false);
                          }}
                          className={`flex items-center w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                            mesFiltro === 'general'
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <span className="mr-2">📊</span>
                          Histórico General
                        </button>
                      </div>
                    </div>
                  </>
                )}
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

        {/* Banners de Cierre Pendiente o Periodo Cerrado */}
        {(pendientes || esMesFiltroCerrado) && (
          <div className="space-y-3">
            {/* Banner de Periodo Cerrado */}
            {esMesFiltroCerrado && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-550 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <h4 className="font-bold text-amber-800 text-sm sm:text-base">Periodo Cerrado: {formatMonthYear(mesFiltro)}</h4>
                    <p className="text-xs sm:text-sm text-amber-700">
                      {esMesFiltroAutoCerrado 
                        ? 'Este periodo está cerrado automáticamente por antigüedad (más de 2 meses) y está archivado de forma definitiva.'
                        : 'Este periodo mensual está cerrado. No puedes añadir nuevos movimientos ni modificar los existentes.'}
                    </p>
                  </div>
                </div>
                {!esMesFiltroAutoCerrado && (
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setModalReabrir({ isOpen: true, tipo: 'mensual', periodo: mesFiltro })}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm flex items-center gap-1"
                    >
                      🔓 Reabrir Periodo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Banner de Cierre Mensual Pendiente */}
            {pendientes && pendientes.prevMonth && !pendientes.prevMonth.isClosed && !posponerCierre.prevMonth && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <h4 className="font-bold text-red-800 text-sm sm:text-base">Cierre Mensual Requerido: {formatMonthYear(pendientes.prevMonth.periodo)}</h4>
                    <p className="text-xs sm:text-sm text-red-700">El mes anterior está abierto. Cerrar el mes requiere contraseña y bloqueará sus transacciones de forma segura.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setModalCierre({ isOpen: true, tipo: 'mensual', periodo: pendientes.prevMonth.periodo })}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm"
                  >
                    🔒 Cerrar Mes
                  </button>
                  <button
                    onClick={() => setPosponerCierre({ ...posponerCierre, prevMonth: true })}
                    className="bg-gray-200/80 hover:bg-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs transition-colors"
                  >
                    Posponer
                  </button>
                </div>
              </div>
            )}

            {/* Banner de Cierre Diario Pendiente */}
            {pendientes && pendientes.yesterday && !pendientes.yesterday.isClosed && !posponerCierre.yesterday && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <h4 className="font-bold text-blue-800 text-sm sm:text-base">Arqueo Diario: Ayer ({pendientes.yesterday.date})</h4>
                    <p className="text-xs sm:text-sm text-blue-700 font-medium">
                      Ingresos de ayer: <span className="font-semibold text-green-700 font-bold">+${pendientes.yesterday.resumen?.ingresosTotales || 0}</span> | 
                      Egresos: <span className="font-semibold text-red-700 font-bold">-${pendientes.yesterday.resumen?.egresosTotales || 0}</span>.
                      ¿Todo estuvo en orden?
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    disabled={actualizando === 'verificacion-rapida'}
                    onClick={handleVerificacionRapidaAyer}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm"
                  >
                    {actualizando === 'verificacion-rapida' ? 'Cerrando...' : '✅ Sí, todo cuadra'}
                  </button>
                  <button
                    onClick={() => setModalCierre({ isOpen: true, tipo: 'diario', periodo: pendientes.yesterday.date })}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm"
                  >
                    🔍 No, registrar arqueo
                  </button>
                  <button
                    onClick={() => setPosponerCierre({ ...posponerCierre, yesterday: true })}
                    className="bg-gray-200/80 hover:bg-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs transition-colors"
                  >
                    Posponer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

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
                                  disabled={actualizando === m._id || esMesFiltroCerrado}
                                  className={`${
                                    esMesFiltroCerrado
                                      ? 'bg-gray-100 text-gray-405 cursor-not-allowed border border-gray-200'
                                      : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                                  } px-3 py-1 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium`}
                                >
                                  {actualizando === m._id ? (
                                    <span className="flex items-center">
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-1"></div>
                                      Desactivando...
                                    </span>
                                  ) : esMesFiltroCerrado ? (
                                    '🔒 Cerrado'
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
            balanceTotal={balance}
            onCrearEgreso={async (data) => {
              await createMovimiento(data);
              window.location.reload();
            }}
            onUpdateEgreso={async (id, data) => {
              await updateMovimiento(id, data);
              window.location.reload();
            }}
          />
        )}
      </div>

      {/* Modal de Cierre de Caja */}
      <CajaChicaModal
        isOpen={modalCierre.isOpen}
        onClose={() => setModalCierre({ ...modalCierre, isOpen: false })}
        tipo={modalCierre.tipo}
        periodo={modalCierre.periodo}
        defaultFondoFijo={perfil?.fondoFijo || 0}
        onSuccess={handleCierreExitoso}
      />

      {/* Modal de Reapertura de Periodo */}
      <ReabrirModal
        isOpen={modalReabrir.isOpen}
        onClose={() => setModalReabrir({ ...modalReabrir, isOpen: false })}
        tipo={modalReabrir.tipo}
        periodo={modalReabrir.periodo}
        onSuccess={handleReabrirExitoso}
      />
    </div>
  );
}

export default DashboardPage;
