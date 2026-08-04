import React, { useState, useEffect } from "react";
import {
  getRecordatorios,
  crearRecordatorio,
  actualizarRecordatorio,
  eliminarRecordatorio,
} from "../services/recordatoriosService";

export default function RecordatoriosPage() {
  const [recordatorios, setRecordatorios] = useState([]);
  const [filtro, setFiltro] = useState("todos"); // 'todos' | 'prestamos_recibidos' | 'prestamos_otorgados' | 'pagos_pendientes'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  // Form states
  const [tipo, setTipo] = useState("pago_pendiente");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [contacto, setContacto] = useState("");

  // Load recordatorios on mount
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getRecordatorios();
      setRecordatorios(data);
    } catch (err) {
      setError("Error al cargar los recordatorios.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!descripcion.trim() || !monto || !fechaVencimiento) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      const nuevo = await crearRecordatorio({
        tipo,
        descripcion: descripcion.trim(),
        monto: Number(monto),
        fechaVencimiento,
        contacto: contacto.trim(),
      });

      setRecordatorios([nuevo, ...recordatorios]);
      setExito("Recordatorio guardado correctamente.");
      
      // Reset form
      setDescripcion("");
      setMonto("");
      setFechaVencimiento("");
      setContacto("");
    } catch (err) {
      setError(err.message || "Error al crear el recordatorio.");
    }
  };

  const handleToggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === "pendiente" ? "pagado" : "pendiente";
      const actualizado = await actualizarRecordatorio(id, { estado: nuevoEstado });
      setRecordatorios(
        recordatorios.map((r) => (r._id === id ? actualizado : r))
      );
    } catch (err) {
      alert("No se pudo actualizar el estado.");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este recordatorio?")) return;
    try {
      await eliminarRecordatorio(id);
      setRecordatorios(recordatorios.filter((r) => r._id !== id));
    } catch (err) {
      alert("No se pudo eliminar el recordatorio.");
    }
  };

  // Helper to determine status and colors
  const getRecordatorioStatus = (item) => {
    if (item.estado === "pagado") return { text: "Pagado", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vcto = new Date(item.fechaVencimiento);
    vcto.setHours(0, 0, 0, 0);

    if (vcto < hoy) {
      return { text: "Vencido", color: "bg-red-500/10 text-red-400 border-red-500/20 font-bold animate-pulse" };
    }
    
    const diffTime = vcto - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      return { text: `Vence en ${diffDays} día(s)`, color: "bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold" };
    }

    return { text: "Pendiente", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" };
  };

  // Filtered lists
  const recordatoriosFiltrados = recordatorios.filter((item) => {
    if (filtro === "todos") return true;
    if (filtro === "prestamos_recibidos") return item.tipo === "prestamo_recibido";
    if (filtro === "prestamos_otorgados") return item.tipo === "prestamo_otorgado";
    if (filtro === "pagos_pendientes") return item.tipo === "pago_pendiente";
    return true;
  });

  // Calculations
  const prestamosRecibidosTotal = recordatorios
    .filter((r) => r.tipo === "prestamo_recibido" && r.estado === "pendiente")
    .reduce((sum, r) => sum + r.monto, 0);

  const prestamosOtorgadosTotal = recordatorios
    .filter((r) => r.tipo === "prestamo_otorgado" && r.estado === "pendiente")
    .reduce((sum, r) => sum + r.monto, 0);

  const pagosPendientesTotal = recordatorios
    .filter((r) => r.tipo === "pago_pendiente" && r.estado === "pendiente")
    .reduce((sum, r) => sum + r.monto, 0);

  // Reminders notifications box (Upcoming next 3 days or overdue)
  const alertasCriticas = recordatorios.filter((item) => {
    if (item.estado === "pagado") return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vcto = new Date(item.fechaVencimiento);
    vcto.setHours(0, 0, 0, 0);
    
    const diffTime = vcto - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return vcto < hoy || diffDays <= 3;
  });

  return (
    <div className="min-h-[85vh] bg-gray-950 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
              <span>🔔</span>
              <span>Préstamos y Recordatorios</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Controla deudas pendientes, préstamos otorgados y recibe alertas inteligentes de vencimiento.
            </p>
          </div>
        </div>

        {/* Alertas Críticas */}
        {alertasCriticas.length > 0 && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-2.5 animate-pulse">
            <h4 className="font-extrabold text-sm text-red-400 flex items-center space-x-2">
              <span>⚠️</span>
              <span>¡Atención! Tienes {alertasCriticas.length} vencimiento(s) crítico(s) o próximo(s)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
              {alertasCriticas.slice(0, 4).map((item) => (
                <div key={item._id} className="flex justify-between items-center bg-gray-900/60 p-2 rounded-xl border border-red-500/10">
                  <span className="truncate max-w-[180px] font-semibold">{item.descripcion}</span>
                  <span className="font-bold text-red-400">S/ {item.monto.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-3xl space-y-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Me prestaron (Por pagar)</span>
            <div className="text-2xl font-black text-rose-400">S/ {prestamosRecibidosTotal.toFixed(2)}</div>
            <p className="text-[10px] text-gray-500">Monto total de préstamos recibidos pendientes</p>
          </div>

          <div className="p-5 bg-gray-900 border border-gray-800 rounded-3xl space-y-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider font-bold">Presté (Por cobrar)</span>
            <div className="text-2xl font-black text-emerald-400">S/ {prestamosOtorgadosTotal.toFixed(2)}</div>
            <p className="text-[10px] text-gray-500">Monto total que prestaste y está pendiente</p>
          </div>

          <div className="p-5 bg-gray-900 border border-gray-800 rounded-3xl space-y-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider font-bold">Servicios / Pagos Pendientes</span>
            <div className="text-2xl font-black text-amber-400">S/ {pagosPendientesTotal.toFixed(2)}</div>
            <p className="text-[10px] text-gray-500">Cuentas, suscripciones y servicios por vencer</p>
          </div>
        </div>

        {/* Main Grid: Form & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Col */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl h-fit space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>➕</span>
              <span>Nuevo Recordatorio</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">Tipo de Compromiso</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white font-semibold text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="pago_pendiente">Pago / Cuenta Pendiente (Servicios, Arriendos)</option>
                  <option value="prestamo_recibido">Préstamo Recibido (Debes dinero)</option>
                  <option value="prestamo_otorgado">Préstamo Otorgado (Te deben dinero)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">Descripción / Concepto</label>
                <input
                  type="text"
                  placeholder="Ej. Arriendo de Agosto, Deuda con Juan"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400">Monto (S/.)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400">Vencimiento</label>
                  <input
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">Contacto / Persona (Opcional)</label>
                <input
                  type="text"
                  placeholder="Nombre de la persona involucrada"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:border-emerald-500"
                />
              </div>

              {error && <p className="text-xs text-red-400 font-bold">{error}</p>}
              {exito && <p className="text-xs text-emerald-400 font-bold">{exito}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-black rounded-xl transition-all text-xs"
              >
                Guardar Recordatorio
              </button>
            </form>
          </div>

          {/* List Col */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Filter Tabs */}
            <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 overflow-x-auto">
              <button
                onClick={() => setFiltro("todos")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${filtro === "todos" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltro("prestamos_recibidos")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${filtro === "prestamos_recibidos" ? "bg-rose-500/20 text-rose-300" : "text-gray-400 hover:text-white"}`}
              >
                Me prestaron
              </button>
              <button
                onClick={() => setFiltro("prestamos_otorgados")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${filtro === "prestamos_otorgados" ? "bg-emerald-500/20 text-emerald-300" : "text-gray-400 hover:text-white"}`}
              >
                Presté
              </button>
              <button
                onClick={() => setFiltro("pagos_pendientes")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${filtro === "pagos_pendientes" ? "bg-amber-500/20 text-amber-300" : "text-gray-400 hover:text-white"}`}
              >
                Cuentas
              </button>
            </div>

            {/* List */}
            {loading ? (
              <div className="text-center py-12 text-sm text-gray-500">Cargando compromisos...</div>
            ) : recordatoriosFiltrados.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/40 rounded-3xl border border-gray-900">
                <span className="text-4xl block mb-2">🎉</span>
                <p className="text-sm font-semibold text-gray-400">No hay recordatorios pendientes en esta categoría</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recordatoriosFiltrados.map((item) => {
                  const status = getRecordatorioStatus(item);
                  return (
                    <div
                      key={item._id}
                      className={`p-4 bg-gray-900 border border-gray-800/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${item.estado === "pagado" ? "opacity-60" : ""}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] px-2 py-0.5 border rounded-md font-bold uppercase ${status.color}`}>
                            {status.text}
                          </span>
                          <span className="text-xs text-gray-400 font-semibold">
                            {item.tipo === "pago_pendiente" && "💵 Pago de Servicio"}
                            {item.tipo === "prestamo_recibido" && "🔴 Me Prestaron"}
                            {item.tipo === "prestamo_otorgado" && "🟢 Presté"}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-white">
                          {item.descripcion}
                        </h4>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          {item.contacto && (
                            <span>👤 {item.contacto}</span>
                          )}
                          <span>📅 Vence: {new Date(item.fechaVencimiento).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 border-t border-gray-800 md:border-0 pt-3 md:pt-0">
                        <div className="text-right">
                          <span className="text-lg font-black text-white">
                            S/ {item.monto.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleEstado(item._id, item.estado)}
                            className={`p-2.5 rounded-xl text-xs font-bold transition-colors ${item.estado === "pagado" ? "bg-gray-800 text-gray-400 hover:text-white" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"}`}
                            title={item.estado === "pagado" ? "Marcar como pendiente" : "Marcar como pagado"}
                          >
                            {item.estado === "pagado" ? "↩️ Reabrir" : "✔️ Pagado"}
                          </button>
                          <button
                            onClick={() => handleEliminar(item._id)}
                            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
