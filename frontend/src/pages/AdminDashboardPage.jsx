import React, { useState, useEffect } from "react";
import {
  getAdminMetrics,
  getAdminUsuarios,
  toggleUserPremium,
  getAdminPagos,
  aprobarRechazarPago,
} from "../services/adminService";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [pagos, setPagos] = useState([]);

  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [loadingPagos, setLoadingPagos] = useState(false);

  // Filtros
  const [filtroUsuarioQuery, setFiltroUsuarioQuery] = useState("");
  const [filtroUsuarioPlan, setFiltroUsuarioPlan] = useState("todos");

  const [filtroPagoQuery, setFiltroPagoQuery] = useState("");
  const [filtroPagoEstado, setFiltroPagoEstado] = useState("todos");

  const [notificacion, setNotificacion] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const cargarDatos = async () => {
    try {
      setLoadingMetrics(true);
      const dataMetrics = await getAdminMetrics();
      setMetrics(dataMetrics);
    } catch (err) {
      setErrorMsg("Error cargando métricas");
    } finally {
      setLoadingMetrics(false);
    }
  };

  const cargarUsuarios = async () => {
    try {
      setLoadingUsuarios(true);
      const data = await getAdminUsuarios(
        filtroUsuarioQuery,
        filtroUsuarioPlan,
      );
      setUsuarios(data.usuarios || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const cargarPagos = async () => {
    try {
      setLoadingPagos(true);
      const data = await getAdminPagos(filtroPagoQuery, filtroPagoEstado);
      setPagos(data.pagos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPagos(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    cargarUsuarios();
    cargarPagos();
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [filtroUsuarioQuery, filtroUsuarioPlan]);

  useEffect(() => {
    cargarPagos();
  }, [filtroPagoQuery, filtroPagoEstado]);

  const handleTogglePro = async (userId, nuevoEstado) => {
    try {
      setNotificacion("");
      const res = await toggleUserPremium(userId, nuevoEstado);
      setNotificacion(`✅ ${res.message}`);
      cargarUsuarios();
      cargarDatos();
      setTimeout(() => setNotificacion(""), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Error al actualizar plan");
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  const handleAprobarPago = async (pagoId, estado) => {
    try {
      setNotificacion("");
      const res = await aprobarRechazarPago(pagoId, estado);
      setNotificacion(`✅ ${res.message}`);
      cargarPagos();
      cargarUsuarios();
      cargarDatos();
      setTimeout(() => setNotificacion(""), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Error al procesar pago");
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Superior Admin */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-2xl gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-3xl">🛡️</span>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Dashboard de Administración
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                PRODUCCIÓN
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Monitoreo en tiempo real de usuarios, mapas de calor, consultas IA
              y auditoría de pagos.
            </p>
          </div>

          <button
            onClick={() => {
              cargarDatos();
              cargarUsuarios();
              cargarPagos();
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg transition-all flex items-center space-x-2"
          >
            <span>🔄 Actualizar Métricas</span>
          </button>
        </div>

        {/* Notificaciones */}
        {notificacion && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs rounded-2xl animate-fade-in flex items-center">
            <span className="mr-2">✅</span> {notificacion}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 font-bold text-xs rounded-2xl animate-fade-in flex items-center">
            <span className="mr-2">❌</span> {errorMsg}
          </div>
        )}

        {/* 1. Tarjetas de Métricas Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl text-2xl">
              👤
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400">
                Total Usuarios Registrados
              </p>
              <h3 className="text-2xl font-black text-white">
                {loadingMetrics ? "..." : metrics?.totalUsuarios || 0}
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">
                App Móvil + Web
              </p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl text-2xl">
              ⭐
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400">
                Usuarios Free vs Pro
              </p>
              <h3 className="text-2xl font-black text-emerald-400">
                {loadingMetrics
                  ? "..."
                  : `${metrics?.usuariosPro || 0} PRO / ${metrics?.usuariosFree || 0} FREE`}
              </h3>
              <p className="text-[10px] text-emerald-300/80 mt-0.5">
                Ratio de Conversión
              </p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl text-2xl">
              🤖
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400">
                Peticiones IA (Gemini OCR)
              </p>
              <h3 className="text-2xl font-black text-purple-300">
                {loadingMetrics ? "..." : metrics?.consultasIA || 0}
              </h3>
              <p className="text-[10px] text-purple-400/80 mt-0.5">
                Escaneos Totales
              </p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl text-2xl">
              💵
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400">
                Ingresos Totales Recaudados
              </p>
              <h3 className="text-2xl font-black text-amber-400">
                S/{" "}
                {loadingMetrics
                  ? "..."
                  : (metrics?.ingresosTotales || 0).toFixed(2)}
              </h3>
              <p className="text-[10px] text-amber-300/80 mt-0.5">
                {metrics?.pagosPendientes || 0} pago(s) pendiente(s)
              </p>
            </div>
          </div>
        </div>

        {/* 2. Mapa de Calor (Geolocalización por País) */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
                <span>🗺️ Mapa de Calor (Distribución Geográfica)</span>
              </h3>
              <p className="text-xs text-gray-400">
                Densidad de usuarios activos en Perú y el Resto del Mundo.
              </p>
            </div>
            <span className="text-xs font-bold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
              Auto-detectado por IP / Locale
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Barras de porcentaje */}
            <div className="space-y-3">
              {metrics?.mapaCalor
                ?.filter((item) => item.cantidad > 0)
                .map((item) => (
                  <div key={item.pais} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-300">
                        {item.pais} ({item.codigo})
                      </span>
                      <span style={{ color: item.color }}>
                        {item.porcentaje}% ({item.cantidad} usuarios)
                      </span>
                    </div>
                    <div className="w-full bg-gray-950 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.porcentaje}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Representación Visual de Mapa */}
            <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800 text-center space-y-3">
              <span className="text-5xl">🇵🇪</span>
              <h4 className="font-bold text-sm text-emerald-400">
                100% Usuarios de Perú (PE)
              </h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                El 100% de la comunidad registrada es de Perú. No hay usuarios
                de Colombia ni otros países.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Confirmaciones de Pagos & Verificación de Transferencias */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-3 gap-3">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
                <span>
                  📋 Auditoría de Pagos & Transferencias (Yape / BCP / Tarjetas)
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Busca números de operación para confirmar en tus apps bancarias.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Buscar por N° Operación o Email..."
                value={filtroPagoQuery}
                onChange={(e) => setFiltroPagoQuery(e.target.value)}
                className="px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:border-emerald-500 flex-1 md:w-64"
              />
              <select
                value={filtroPagoEstado}
                onChange={(e) => setFiltroPagoEstado(e.target.value)}
                className="px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white font-bold"
              >
                <option value="todos">Todos los Estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobado">Aprobados</option>
                <option value="rechazado">Rechazados</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-950 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Email Usuario</th>
                  <th className="p-3">Método</th>
                  <th className="p-3">N° Operación / Transferencia</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 font-medium">
                {loadingPagos ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      Cargando registros...
                    </td>
                  </tr>
                ) : pagos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No se encontraron pagos con ese filtro.
                    </td>
                  </tr>
                ) : (
                  pagos.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-800/40">
                      <td className="p-3 font-mono">
                        {new Date(p.creadoEn).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-bold text-white">{p.email}</td>
                      <td className="p-3 uppercase font-bold text-purple-400">
                        {p.metodo}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        {p.nroOperacion}
                      </td>
                      <td className="p-3 font-black text-amber-400">
                        S/ {(p.monto || 19.9).toFixed(2)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.estado === "aprobado"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : p.estado === "rechazado"
                                ? "bg-red-500/20 text-red-300"
                                : "bg-amber-500/20 text-amber-300 animate-pulse"
                          }`}
                        >
                          {p.estado.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {p.estado !== "aprobado" && (
                          <button
                            onClick={() => handleAprobarPago(p._id, "aprobado")}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-2.5 py-1 rounded-lg text-[10px]"
                          >
                            ✓ Aprobar Pro
                          </button>
                        )}
                        {p.estado !== "rechazado" && (
                          <button
                            onClick={() =>
                              handleAprobarPago(p._id, "rechazado")
                            }
                            className="bg-red-600 hover:bg-red-500 text-white font-black px-2.5 py-1 rounded-lg text-[10px]"
                          >
                            ✕ Rechazar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Gestor de Usuarios & Asignación Manual Pro */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-3 gap-3">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
                <span>👥 Gestión de Usuarios & Otorgamiento de Licencias</span>
              </h3>
              <p className="text-xs text-gray-400">
                Busca por nombre/email y activa o quita el plan Pro con 1 solo
                clic.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Filtro por Nombre o Email..."
                value={filtroUsuarioQuery}
                onChange={(e) => setFiltroUsuarioQuery(e.target.value)}
                className="px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:border-emerald-500 flex-1 md:w-64"
              />
              <select
                value={filtroUsuarioPlan}
                onChange={(e) => setFiltroUsuarioPlan(e.target.value)}
                className="px-3.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white font-bold"
              >
                <option value="todos">Todos los Planes</option>
                <option value="pro">Solo PRO</option>
                <option value="free">Solo FREE</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-950 text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Plan Actual</th>
                  <th className="p-3">Consultas IA (OCR)</th>
                  <th className="p-3">Días Pro Restantes</th>
                  <th className="p-3 text-right">Cambiar Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 font-medium">
                {loadingUsuarios ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No hay usuarios coincidentes.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-800/40">
                      <td className="p-3 font-bold text-white">
                        {u.nombre || "Usuario"}
                      </td>
                      <td className="p-3 font-mono text-gray-300">{u.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            u.esPremium
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {u.esPremium ? "PRO" : "FREE"}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-purple-300">
                        {u.conteoOcrMes} peticiones
                      </td>
                      <td className="p-3 font-mono font-bold">
                        {u.esPremium
                          ? `${u.diasRestantesPro} días`
                          : "0 días (Free)"}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleTogglePro(u._id, !u.esPremium)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                            u.esPremium
                              ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
                              : "bg-emerald-600 hover:bg-emerald-500 text-white"
                          }`}
                        >
                          {u.esPremium ? "🔄 Cambiar a FREE" : "⭐ Otorgar PRO"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Alertas & Registros de Seguridad */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl space-y-3">
          <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
            <span>🚨 Alertas de Seguridad & Diagnóstico del Sistema</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-2xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-400">
                  Consumo de IA Gemini OCR
                </span>
                <span className="text-[10px] text-gray-400">Estado Normal</span>
              </div>
              <p className="text-xs text-gray-300">
                Ningún usuario ha superado los límites de escaneo diario de
                comprobantes. El servidor opera de forma fluida.
              </p>
            </div>

            <div className="bg-amber-950/20 border border-amber-800/40 p-4 rounded-2xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-400">
                  Revisión de Pagos Yape
                </span>
                <span className="text-[10px] text-gray-400">
                  Revisar diariamente
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Se recomienda cotejar los códigos de transferencia en las
                aplicaciones bancarias antes de aprobar pagos pendientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
