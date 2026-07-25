import React, { useEffect, useState } from "react";
import { getMovimientos } from "../services/movimientos-adapter";
import { useNavigate } from "react-router-dom";
import {
  GraficoBarras,
  GraficoLinea,
  GraficoCircular,
} from "../components/Graficos";
import logger from "../utils/logger";
import { exportToExcel, exportToPDF } from "../utils/exportUtils";
import PaywallModal from "../components/PaywallModal";
import { getEstadoPlan } from "../services/pagosService";

function ReportesPage() {
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("resumen");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  // Freemium y Paywall State
  const [showPaywall, setShowPaywall] = useState(false);
  const [userPlan, setUserPlan] = useState({
    esPremium: false,
    planTipo: "free",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError("");
        logger.info("Cargando datos de reportes");

        const movimientosData = await getMovimientos();
        setMovimientos(Array.isArray(movimientosData) ? movimientosData : []);

        // Obtener estado de plan del usuario desde JWT / localStorage
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload && payload.email) {
              const plan = await getEstadoPlan(payload.email);
              setUserPlan(plan);
            }
          } catch (e) {
            console.error("Error decodificando token en reportes:", e);
          }
        }

        logger.info("Datos de reportes cargados exitosamente", {
          movimientosCount: Array.isArray(movimientosData)
            ? movimientosData.length
            : 0,
        });
      } catch (e) {
        const errorMessage = "Error al cargar los datos de reportes";
        setError(errorMessage);
        logger.logApiError("getMovimientos", e, { context: "ReportesPage" });
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
          <p className="text-lg font-medium text-gray-600">
            Generando reportes...
          </p>
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
  const movimientosActivos = movimientos.filter((m) => m.estado === "activo");
  const totalIngresos = movimientosActivos
    .filter((m) => m.tipo === "ingreso")
    .reduce((sum, m) => sum + (m.monto || 0), 0);
  const totalEgresos = movimientosActivos
    .filter((m) => m.tipo === "egreso")
    .reduce((sum, m) => sum + (m.monto || 0), 0);
  const balance = totalIngresos - totalEgresos;

  // Filtros
  const movimientosFiltrados = movimientosActivos.filter((m) => {
    const cumpleMes =
      !filtroMes ||
      (m.creadoEn && new Date(m.creadoEn).getMonth() === parseInt(filtroMes));
    const cumpleCategoria = !filtroCategoria || m.categoria === filtroCategoria;
    return cumpleMes && cumpleCategoria;
  });

  const categorias = [
    ...new Set(movimientos.map((m) => m.categoria).filter(Boolean)),
  ];

  const meses = [
    { value: 0, label: "Enero" },
    { value: 1, label: "Febrero" },
    { value: 2, label: "Marzo" },
    { value: 3, label: "Abril" },
    { value: 4, label: "Mayo" },
    { value: 5, label: "Junio" },
    { value: 6, label: "Julio" },
    { value: 7, label: "Agosto" },
    { value: 8, label: "Septiembre" },
    { value: 9, label: "Octubre" },
    { value: 10, label: "Noviembre" },
    { value: 11, label: "Diciembre" },
  ];

  // Procesar datos para gráficos
  const procesarDatosGraficos = () => {
    if (!movimientos || movimientos.length === 0) {
      return {
        gastosPorCategoria: [],
        ingresosPorCategoria: [],
        tendenciaMensual: [],
        balancePorMes: [],
      };
    }

    // Gastos por categoría
    const gastosPorCategoria = movimientosActivos
      .filter((m) => m.tipo === "egreso")
      .reduce((acc, mov) => {
        const categoria = mov.categoria || "Sin categoría";
        acc[categoria] = (acc[categoria] || 0) + Math.abs(mov.monto);
        return acc;
      }, {});

    // Ingresos por categoría
    const ingresosPorCategoria = movimientosActivos
      .filter((m) => m.tipo === "ingreso")
      .reduce((acc, mov) => {
        const categoria = mov.categoria || "Sin categoría";
        acc[categoria] = (acc[categoria] || 0) + mov.monto;
        return acc;
      }, {});

    // Tendencia mensual (últimos 6 meses)
    const ahora = new Date();
    const tendenciaMensual = [];

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const mes = fecha.toLocaleDateString("es-ES", {
        month: "short",
        year: "2-digit",
      });

      const movimientosMes = movimientosActivos.filter((m) => {
        const fechaMov = new Date(m.creadoEn);
        return (
          fechaMov.getMonth() === fecha.getMonth() &&
          fechaMov.getFullYear() === fecha.getFullYear()
        );
      });

      const totalGastos = movimientosMes
        .filter((m) => m.tipo === "egreso")
        .reduce((sum, m) => sum + Math.abs(m.monto), 0);

      const totalIngresos = movimientosMes
        .filter((m) => m.tipo === "ingreso")
        .reduce((sum, m) => sum + m.monto, 0);

      tendenciaMensual.push({
        label: mes,
        gastos: totalGastos,
        ingresos: totalIngresos,
        balance: totalIngresos - totalGastos,
      });
    }

    return {
      gastosPorCategoria: Object.entries(gastosPorCategoria).map(
        ([label, valor]) => ({ label, valor }),
      ),
      ingresosPorCategoria: Object.entries(ingresosPorCategoria).map(
        ([label, valor]) => ({ label, valor }),
      ),
      tendenciaMensual,
      balancePorMes: tendenciaMensual.map((t) => ({
        label: t.label,
        valor: t.balance,
      })),
    };
  };

  const datosGraficos = procesarDatosGraficos();

  return (
    <div className="min-h-[80vh] bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                📊 Reportes y Análisis
              </h1>
              <p className="text-gray-600">
                Resumen completo de tu actividad financiera
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Botones de Exportación Contable */}
              <button
                onClick={() => {
                  if (userPlan?.esPremium) {
                    exportToExcel(
                      movimientosFiltrados,
                      `Reportes-FinanceFlow-${new Date().toISOString().slice(0, 10)}.csv`,
                    );
                  } else {
                    setShowPaywall(true);
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl transition-all duration-200 text-sm font-bold shadow-sm flex items-center gap-1.5"
                title="Exportar movimientos a Microsoft Excel"
              >
                <span>📥 Exportar Excel</span>
              </button>

              <button
                onClick={() => {
                  if (userPlan?.esPremium) {
                    exportToPDF(
                      movimientosFiltrados,
                      { totalIngresos, totalEgresos },
                      "Reporte Financiero Contable",
                    );
                  } else {
                    setShowPaywall(true);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl transition-all duration-200 text-sm font-bold shadow-sm flex items-center gap-1.5"
                title="Imprimir o guardar reporte en PDF"
              >
                <span>📄 Exportar PDF</span>
              </button>

              {!userPlan?.esPremium && (
                <button
                  onClick={() => setShowPaywall(true)}
                  className="bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white px-4 py-2 rounded-xl transition-all duration-200 text-sm font-extrabold shadow-md flex items-center gap-1.5 animate-pulse"
                >
                  <span>⭐ Obtener Pro</span>
                </button>
              )}

              <button
                onClick={() => navigate("/movimiento")}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors duration-200 text-sm font-medium"
              >
                ➕ Nuevo Movimiento
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors duration-200 text-sm font-medium"
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
              { id: "resumen", label: "📈 Resumen General", icon: "📈" },
              { id: "graficos", label: "📊 Gráficos", icon: "📊" },
              { id: "movimientos", label: "💰 Movimientos", icon: "💰" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "resumen" && (
              <div className="space-y-6">
                {/* Resumen Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 font-medium">
                          Total Ingresos
                        </p>
                        <p className="text-2xl font-bold text-green-800">
                          ${totalIngresos.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-3xl text-green-500">📈</div>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 font-medium">
                          Total Egresos
                        </p>
                        <p className="text-2xl font-bold text-red-800">
                          ${totalEgresos.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-3xl text-red-500">📉</div>
                    </div>
                  </div>
                  <div
                    className={`${balance >= 0 ? "bg-blue-50 border-blue-200" : "bg-orange-50 border-orange-200"} border rounded-xl p-6`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`${balance >= 0 ? "text-blue-600" : "text-orange-600"} font-medium`}
                        >
                          Balance
                        </p>
                        <p
                          className={`text-2xl font-bold ${balance >= 0 ? "text-blue-800" : "text-orange-800"}`}
                        >
                          ${balance.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-3xl">
                        {balance >= 0 ? "💰" : "⚠️"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estadísticas por categoría */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    📊 Movimientos por Categoría
                  </h3>
                  {categorias.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorias.map((categoria) => {
                        const movsCat = movimientosActivos.filter(
                          (m) => m.categoria === categoria,
                        );
                        const total = movsCat.reduce(
                          (sum, m) => sum + (m.monto || 0),
                          0,
                        );
                        return (
                          <div
                            key={categoria}
                            className="bg-white rounded-lg p-4 border"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">
                                {categoria}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({movsCat.length})
                              </span>
                            </div>
                            <div className="text-lg font-bold text-gray-800">
                              ${total.toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No hay movimientos categorizados
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "graficos" && (
              <div className="space-y-8">
                {/* Descripción */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-bold text-blue-900 mb-2">
                    📊 Análisis Visual de Finanzas
                  </h3>
                  <p className="text-blue-800 text-sm">
                    Visualiza tus patrones de gastos e ingresos con gráficos
                    interactivos para tomar mejores decisiones financieras.
                  </p>
                </div>

                {movimientos.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-xl font-medium mb-2">
                      No hay datos para mostrar
                    </p>
                    <p>Agrega algunos movimientos para ver los gráficos</p>
                    <button
                      onClick={() => navigate("/movimiento")}
                      className="mt-4 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      ➕ Agregar Movimiento
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Gráfico de gastos por categoría */}
                    {datosGraficos.gastosPorCategoria.length > 0 && (
                      <GraficoCircular
                        datos={datosGraficos.gastosPorCategoria}
                        titulo="💸 Distribución de Gastos por Categoría"
                      />
                    )}

                    {/* Gráfico de ingresos por categoría */}
                    {datosGraficos.ingresosPorCategoria.length > 0 && (
                      <GraficoBarras
                        datos={datosGraficos.ingresosPorCategoria}
                        titulo="💰 Ingresos por Categoría"
                        colorPrimario="#10B981"
                      />
                    )}

                    {/* Tendencia mensual */}
                    {datosGraficos.tendenciaMensual.length > 0 && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <GraficoLinea
                          datos={datosGraficos.tendenciaMensual.map((t) => ({
                            label: t.label,
                            valor: t.gastos,
                          }))}
                          titulo="📉 Tendencia de Gastos (6 meses)"
                          color="#EF4444"
                        />
                        <GraficoLinea
                          datos={datosGraficos.tendenciaMensual.map((t) => ({
                            label: t.label,
                            valor: t.ingresos,
                          }))}
                          titulo="📈 Tendencia de Ingresos (6 meses)"
                          color="#10B981"
                        />
                      </div>
                    )}

                    {/* Balance mensual */}
                    {datosGraficos.balancePorMes.length > 0 && (
                      <GraficoBarras
                        datos={datosGraficos.balancePorMes}
                        titulo="⚖️ Balance Mensual (Últimos 6 meses)"
                        colorPrimario="#3B82F6"
                        colorSecundario="#EF4444"
                      />
                    )}

                    {/* Resumen estadístico */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        📋 Resumen Estadístico
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border">
                          <h4 className="font-semibold text-gray-700 mb-2">
                            💸 Gasto Promedio Mensual
                          </h4>
                          <p className="text-2xl font-bold text-red-600">
                            $
                            {datosGraficos.tendenciaMensual.length > 0
                              ? (
                                  datosGraficos.tendenciaMensual.reduce(
                                    (sum, t) => sum + t.gastos,
                                    0,
                                  ) / datosGraficos.tendenciaMensual.length
                                ).toLocaleString()
                              : 0}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                          <h4 className="font-semibold text-gray-700 mb-2">
                            💰 Ingreso Promedio Mensual
                          </h4>
                          <p className="text-2xl font-bold text-green-600">
                            $
                            {datosGraficos.tendenciaMensual.length > 0
                              ? (
                                  datosGraficos.tendenciaMensual.reduce(
                                    (sum, t) => sum + t.ingresos,
                                    0,
                                  ) / datosGraficos.tendenciaMensual.length
                                ).toLocaleString()
                              : 0}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border">
                          <h4 className="font-semibold text-gray-700 mb-2">
                            ⚖️ Balance Promedio
                          </h4>
                          <p
                            className={`text-2xl font-bold ${
                              datosGraficos.balancePorMes.length > 0 &&
                              datosGraficos.balancePorMes.reduce(
                                (sum, t) => sum + t.valor,
                                0,
                              ) /
                                datosGraficos.balancePorMes.length >=
                                0
                                ? "text-blue-600"
                                : "text-orange-600"
                            }`}
                          >
                            $
                            {datosGraficos.balancePorMes.length > 0
                              ? (
                                  datosGraficos.balancePorMes.reduce(
                                    (sum, t) => sum + t.valor,
                                    0,
                                  ) / datosGraficos.balancePorMes.length
                                ).toLocaleString()
                              : 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "movimientos" && (
              <div className="space-y-6">
                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-xl">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filtrar por mes
                    </label>
                    <select
                      value={filtroMes}
                      onChange={(e) => setFiltroMes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Todos los meses</option>
                      {meses.map((mes) => (
                        <option key={mes.value} value={mes.value}>
                          {mes.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filtrar por categoría
                    </label>
                    <select
                      value={filtroCategoria}
                      onChange={(e) => setFiltroCategoria(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Todas las categorías</option>
                      {categorias.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFiltroMes("");
                        setFiltroCategoria("");
                      }}
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
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Tipo
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Nombre
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Monto
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Categoría
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {movimientosFiltrados.map((m) => (
                          <tr key={m._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  m.tipo === "ingreso"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {m.tipo === "ingreso" ? "💰" : "💸"} {m.tipo}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {m.nombre}
                            </td>
                            <td
                              className={`px-4 py-3 font-semibold ${
                                m.tipo === "ingreso"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              ${(m.monto || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {m.categoria}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  m.estado === "activo"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
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
                    <p className="text-xl font-medium mb-2">
                      No hay movimientos
                    </p>
                    <p>
                      Con los filtros aplicados no se encontraron resultados
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Paywall de Venta y Pago por Yape / BCP */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        title="⭐ Desbloquea Exportaciones y FinanceFlow Pro"
      />
    </div>
  );
}

export default ReportesPage;
