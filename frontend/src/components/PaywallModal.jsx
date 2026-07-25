import React, { useState } from "react";
import { solicitarPlanPro } from "../services/pagosService";

export default function PaywallModal({
  isOpen,
  onClose,
  userEmail,
  userNombre,
  title = "⭐ Desbloquea FinanceFlow Pro",
}) {
  const [paso, setPaso] = useState("beneficios"); // 'beneficios' | 'pago' | 'exito'
  const [metodo, setMetodo] = useState("yape"); // 'yape' | 'bcp'
  const [nroOperacion, setNroOperacion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState("");

  if (!isOpen) return null;

  const handleCopiarText = (txt, label) => {
    navigator.clipboard.writeText(txt);
    setCopiado(label);
    setTimeout(() => setCopiado(""), 2500);
  };

  const handleEnviarConstancia = async (e) => {
    e.preventDefault();
    if (!nroOperacion.trim()) {
      setError(
        "Por favor ingresa el número de operación o referencia del pago.",
      );
      return;
    }

    try {
      setEnviando(true);
      setError("");
      await solicitarPlanPro(
        userEmail || "usuario@financeflow.com",
        metodo,
        nroOperacion.trim(),
        19.9,
      );
      setPaso("exito");
    } catch (err) {
      setError(err.message || "Error al registrar el comprobante.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Decorativo */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors text-lg"
          >
            ✕
          </button>
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-3 border border-white/20 shadow-inner">
            <span className="text-3xl">👑</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            Lleva el control de tus finanzas al siguiente nivel sin límites
          </p>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-gray-800 dark:text-gray-100">
          {paso === "beneficios" && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl flex items-start space-x-3">
                  <span className="text-2xl">📸</span>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
                      OCR Gemini Ilimitado
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Escaneo ilimitado de comprobantes y facturas.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl flex items-start space-x-3">
                  <span className="text-2xl">📥</span>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
                      Exportación PDF / Excel
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Descarga reportes contables oficiales en la Web.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl flex items-start space-x-3">
                  <span className="text-2xl">🏁</span>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
                      Metas Ilimitadas
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Planifica múltiples compras y sueños en simultáneo.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl flex items-start space-x-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
                      Cierres de Caja Avanzados
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Bloqueo seguro con contraseña e historial total.
                    </p>
                  </div>
                </div>
              </div>

              {/* Oferta de Precio */}
              <div className="p-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-2xl text-white text-center shadow-lg border border-emerald-500/40 relative overflow-hidden">
                <span className="absolute top-2 right-3 bg-amber-400 text-gray-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                  Promoción Lanzamiento
                </span>
                <p className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                  Plan Pro de Oferta
                </p>
                <div className="flex items-baseline justify-center space-x-2 my-1">
                  <span className="text-3xl font-black text-white">
                    S/ 19.90
                  </span>
                  <span className="text-sm text-emerald-400 line-through">
                    S/ 49.00
                  </span>
                  <span className="text-xs text-emerald-200">/ pago único</span>
                </div>
                <p className="text-[11px] text-emerald-200">
                  Acceso vitalicio a todas las funciones premium
                </p>
              </div>

              <button
                onClick={() => setPaso("pago")}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all duration-200 text-base flex items-center justify-center space-x-2"
              >
                <span>🚀 Obtener FinanceFlow Pro Ahora</span>
              </button>
            </div>
          )}

          {paso === "pago" && (
            <div className="space-y-5 animate-fade-in">
              {/* Selector de Método de Pago */}
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setMetodo("yape")}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                    metodo === "yape"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                  }`}
                >
                  <span>📱 Yape (QR)</span>
                </button>
                <button
                  onClick={() => setMetodo("bcp")}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                    metodo === "bcp"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                  }`}
                >
                  <span>🏛️ Transferencia BCP</span>
                </button>
              </div>

              {metodo === "yape" ? (
                <div className="text-center space-y-3 bg-purple-50 dark:bg-purple-950/20 p-4 rounded-2xl border border-purple-200 dark:border-purple-800/50">
                  <p className="text-xs font-bold text-purple-900 dark:text-purple-300">
                    Escanea el código QR desde tu app de Yape:
                  </p>
                  <div className="flex justify-center">
                    <img
                      src="/yape-qr.png"
                      alt="Yape QR Sebastian Arce"
                      className="h-56 w-auto object-contain rounded-xl border-2 border-purple-300 shadow-md"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Titular:{" "}
                    <span className="font-extrabold text-purple-700 dark:text-purple-400">
                      Sebastian Rodrigo Arce Bracamonte
                    </span>
                  </p>
                </div>
              ) : (
                <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/50 text-xs">
                  <p className="font-bold text-blue-900 dark:text-blue-300 text-sm text-center mb-2">
                    Cuentas Bancarias Oficiales BCP
                  </p>

                  <div className="space-y-2 bg-white dark:bg-gray-800 p-3 rounded-xl border border-blue-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                      Cuenta BCP Soles:
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-sm text-gray-800 dark:text-gray-200">
                        54008582045056
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopiarText("54008582045056", "cuenta")
                        }
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
                      >
                        {copiado === "cuenta" ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 bg-white dark:bg-gray-800 p-3 rounded-xl border border-blue-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                      Código de Cuenta Interbancario (CCI):
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-xs text-gray-800 dark:text-gray-200">
                        00254010858204505637
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopiarText("00254010858204505637", "cci")
                        }
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
                      >
                        {copiado === "cci" ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                  </div>

                  <p className="text-center font-semibold text-gray-700 dark:text-gray-300 pt-1">
                    Titular:{" "}
                    <span className="font-bold text-blue-700 dark:text-blue-400">
                      Sebastian Rodrigo Arce Bracamonte
                    </span>
                  </p>
                </div>
              )}

              {/* Formulario de confirmación */}
              <form
                onSubmit={handleEnviarConstancia}
                className="space-y-3 pt-2"
              >
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Ingresa tu Número de Operación / Código de Yape:
                </label>
                <input
                  type="text"
                  placeholder="Ej: 0491820"
                  value={nroOperacion}
                  onChange={(e) => setNroOperacion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono font-bold text-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />

                {error && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                    {error}
                  </p>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaso("beneficios")}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm"
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition-colors text-sm disabled:opacity-50"
                  >
                    {enviando ? "Verificando..." : "Confirmar Pago"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {paso === "exito" && (
            <div className="text-center space-y-4 py-6 animate-fade-in">
              <div className="inline-flex items-center justify-center p-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full text-4xl mb-2">
                🎉
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                ¡Solicitud Registrada con Éxito!
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
                Registramos tu número de operación{" "}
                <span className="font-mono font-bold text-emerald-600">
                  {nroOperacion}
                </span>
                . Verificaremos tu Yape/BCP y activaremos el estado Pro en tu
                cuenta de inmediato.
              </p>
              <button
                onClick={onClose}
                className="py-3 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
              >
                Entendido, Continuar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
