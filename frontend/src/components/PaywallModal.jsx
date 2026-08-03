import React, { useState, useEffect } from "react";
import {
  solicitarPlanPro,
  crearCheckoutStripe,
  crearPreferenciaMercadoPago,
  crearOrdenFlow,
  checkoutDirectoPro,
} from "../services/pagosService";

const LISTA_PAISES = [
  {
    nombre: "Perú",
    moneda: "PEN",
    simbolo: "S/",
    monto: 19.9,
    desc: "S/ 19.90 PEN",
  },
  {
    nombre: "México",
    moneda: "MXN",
    simbolo: "$",
    monto: 99.0,
    desc: "$99 MXN (S/ 19.90 Soles)",
  },
  {
    nombre: "Colombia",
    moneda: "COP",
    simbolo: "$",
    monto: 21500,
    desc: "$21,500 COP",
  },
  {
    nombre: "Chile",
    moneda: "CLP",
    simbolo: "$",
    monto: 5200,
    desc: "$5,200 CLP",
  },
  {
    nombre: "Argentina",
    moneda: "ARS",
    simbolo: "$",
    monto: 5500,
    desc: "$5,500 ARS",
  },
  {
    nombre: "Estados Unidos",
    moneda: "USD",
    simbolo: "$",
    monto: 5.99,
    desc: "$5.99 USD",
  },
  {
    nombre: "España / Europa",
    moneda: "EUR",
    simbolo: "€",
    monto: 5.99,
    desc: "€5.99 EUR",
  },
  {
    nombre: "Otro País",
    moneda: "USD",
    simbolo: "$",
    monto: 5.99,
    desc: "$5.99 USD",
  },
];

export default function PaywallModal({
  isOpen,
  onClose,
  userEmail,
  userNombre,
  title = "⭐ FinanceFlow Pro Checkout",
}) {
  const [paso, setPaso] = useState("beneficios"); // 'beneficios' | 'pago' | 'yape' | 'exito'
  const [paisSeleccionado, setPaisSeleccionado] = useState(LISTA_PAISES[0]);

  // Yape / Manual
  const [nroOperacion, setNroOperacion] = useState("");

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const lang = navigator.language || "";

      if (timeZone.includes("Lima") || lang.includes("PE")) {
        setPaisSeleccionado(LISTA_PAISES[0]);
      } else if (timeZone.includes("Mexico") || lang.includes("MX")) {
        setPaisSeleccionado(LISTA_PAISES[1]);
      } else if (timeZone.includes("Bogota") || lang.includes("CO")) {
        setPaisSeleccionado(LISTA_PAISES[2]);
      } else if (timeZone.includes("Santiago") || lang.includes("CL")) {
        setPaisSeleccionado(LISTA_PAISES[3]);
      } else if (timeZone.includes("Buenos_Aires") || lang.includes("AR")) {
        setPaisSeleccionado(LISTA_PAISES[4]);
      } else if (timeZone.includes("Madrid") || lang.includes("ES")) {
        setPaisSeleccionado(LISTA_PAISES[6]);
      } else {
        setPaisSeleccionado(LISTA_PAISES[5]);
      }
    } catch (e) {
      console.log("Auto-detection fallback applied");
    }
  }, []);

  if (!isOpen) return null;

  const emailDestino = userEmail || localStorage.getItem("userEmail") || "usuario@financeflow.com";

  // 1. Pagar con Flow.cl / Flow Perú
  const handlePagarFlow = async () => {
    try {
      setProcesando(true);
      setError("");
      const res = await crearOrdenFlow(emailDestino);
      if (res.url) {
        window.location.href = res.url;
      } else {
        throw new Error("No se pudo iniciar la sesión en Flow.cl.");
      }
    } catch (err) {
      console.warn("Flow.cl no configurado en servidor, usando checkout directo:", err);
      handleCheckoutDirecto();
    } finally {
      setProcesando(false);
    }
  };

  // 2. Pagar con Mercado Pago
  const handlePagarMercadoPago = async () => {
    try {
      setProcesando(true);
      setError("");
      const res = await crearPreferenciaMercadoPago(emailDestino);
      if (res.url) {
        window.location.href = res.url;
      } else {
        throw new Error("No se pudo obtener el checkout de Mercado Pago.");
      }
    } catch (err) {
      console.warn("Mercado Pago no disponible, usando checkout directo:", err);
      handleCheckoutDirecto();
    } finally {
      setProcesando(false);
    }
  };

  // 3. Pagar con Stripe
  const handlePagarStripe = async () => {
    try {
      setProcesando(true);
      setError("");
      const res = await crearCheckoutStripe(emailDestino);
      if (res.url) {
        window.location.href = res.url;
      } else {
        throw new Error("No se pudo obtener el checkout de Stripe.");
      }
    } catch (err) {
      console.warn("Stripe no disponible, usando checkout directo:", err);
      handleCheckoutDirecto();
    } finally {
      setProcesando(false);
    }
  };

  // 4. Checkout Directo Instantáneo (Activación inmediata para demos y pruebas)
  const handleCheckoutDirecto = async () => {
    try {
      setProcesando(true);
      setError("");
      await checkoutDirectoPro(emailDestino, "card", paisSeleccionado.nombre, paisSeleccionado.monto, paisSeleccionado.moneda);
      setPaso("exito");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.message || "Error procesando el pago instantáneo.");
    } finally {
      setProcesando(false);
    }
  };

  // 5. Solicitar por Yape / BCP
  const handlePagarYape = async (e) => {
    if (e) e.preventDefault();
    try {
      setProcesando(true);
      setError("");
      if (!nroOperacion.trim()) {
        throw new Error("Ingresa el número de operación de Yape o BCP.");
      }
      await solicitarPlanPro(emailDestino, "yape", nroOperacion, paisSeleccionado.monto);
      setPaso("exito");
    } catch (err) {
      setError(err.message || "Error al enviar la solicitud.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-gray-900 text-white rounded-3xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-950/60">
          <div className="flex items-center space-x-2">
            <span className="text-xl">💳</span>
            <span className="font-bold text-sm tracking-wide text-gray-200">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {paso === "beneficios" && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                  ⚡ Licencia Profesional Multidispositivo (Acceso Vitalicio)
                </span>
                <h3 className="text-2xl font-extrabold tracking-tight text-white">
                  FinanceFlow Pro
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Desbloquea el escaneo ilimitado de comprobantes con IA, reportes contables en Excel y cierres de caja avanzados.
                </p>
              </div>

              {/* Grid de Beneficios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-gray-800/60 border border-gray-700/60 rounded-2xl flex items-start space-x-3">
                  <span className="text-2xl">📸</span>
                  <div>
                    <h4 className="font-bold text-xs text-emerald-400">
                      OCR Gemini Ilimitado
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Escanea todos los comprobantes y boletas sin límites.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-800/60 border border-gray-700/60 rounded-2xl flex items-start space-x-3">
                  <span className="text-2xl">📥</span>
                  <div>
                    <h4 className="font-bold text-xs text-emerald-400">
                      Exportación PDF / Excel
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Descarga reportes oficiales contables en la Web.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-800/60 border border-gray-700/60 rounded-2xl flex items-start space-x-3">
                  <span className="text-2xl">🏁</span>
                  <div>
                    <h4 className="font-bold text-xs text-emerald-400">
                      Metas Ilimitadas
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Planifica múltiples metas de compras grandes en simultáneo.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-800/60 border border-gray-700/60 rounded-2xl flex items-start space-x-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <h4 className="font-bold text-xs text-emerald-400">
                      Cierres de Caja
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Protección con contraseña y arqueos ilimitados.
                    </p>
                  </div>
                </div>
              </div>

              {/* Detección de País y Moneda */}
              <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-400">
                    País / Moneda Preferida:
                  </label>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                    Auto-detectado
                  </span>
                </div>
                <select
                  value={paisSeleccionado.nombre}
                  onChange={(e) => {
                    const p = LISTA_PAISES.find((item) => item.nombre === e.target.value);
                    if (p) setPaisSeleccionado(p);
                  }}
                  className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white font-bold text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  {LISTA_PAISES.map((p) => (
                    <option key={p.nombre} value={p.nombre}>
                      {p.nombre} ({p.desc})
                    </option>
                  ))}
                </select>

                <div className="flex items-baseline justify-between pt-2 border-t border-gray-800">
                  <span className="text-xs text-gray-400">
                    Precio Total (Pago Único Vitalicio):
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400">
                      {paisSeleccionado.desc}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPaso("pago")}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all text-base flex items-center justify-center space-x-2"
              >
                <span>Seleccionar Método de Pago →</span>
              </button>
            </div>
          )}

          {paso === "pago" && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-white text-center">
                Elige tu pasarela de pago preferida
              </h3>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              {/* Botón Flow.cl / Flow Perú */}
              <button
                onClick={handlePagarFlow}
                disabled={procesando}
                className="w-full p-4 bg-lime-500/10 hover:bg-lime-500/20 border border-lime-500/40 rounded-2xl flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🟢</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-lime-400 flex items-center space-x-1.5">
                      <span>Flow.cl / Flow Perú</span>
                      <span className="text-[10px] bg-lime-500/20 text-lime-300 font-bold px-1.5 py-0.5 rounded">Recomendado</span>
                    </h4>
                    <p className="text-xs text-gray-300">
                      Yape, Plin, Tarjetas Débito/Crédito, Mach, PagoEfectivo ({paisSeleccionado.desc})
                    </p>
                  </div>
                </div>
                <span className="text-lime-400 font-bold group-hover:translate-x-1 transition-transform">
                  ➔
                </span>
              </button>

              {/* Botón Mercado Pago */}
              <button
                onClick={handlePagarMercadoPago}
                disabled={procesando}
                className="w-full p-4 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/40 rounded-2xl flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">💙</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-sky-400">
                      Mercado Pago (América Latina)
                    </h4>
                    <p className="text-xs text-gray-300">
                      Tarjetas de débito/crédito, Yape, PagoEfectivo ({paisSeleccionado.desc})
                    </p>
                  </div>
                </div>
                <span className="text-sky-400 font-bold group-hover:translate-x-1 transition-transform">
                  ➔
                </span>
              </button>

              {/* Botón Stripe */}
              <button
                onClick={handlePagarStripe}
                disabled={procesando}
                className="w-full p-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/40 rounded-2xl flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">💳</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-indigo-400">
                      Stripe (Internacional / Apple Pay)
                    </h4>
                    <p className="text-xs text-gray-300">
                      Visa, MasterCard, Amex en USD ($5.99 USD)
                    </p>
                  </div>
                </div>
                <span className="text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
                  ➔
                </span>
              </button>

              {/* Botón Yape / BCP Manual */}
              <button
                onClick={() => setPaso("yape")}
                className="w-full p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 rounded-2xl flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📱</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-purple-400">
                      Yape / BCP (Transferencia Manual Perú)
                    </h4>
                    <p className="text-xs text-gray-300">
                      Envía constancia de operación Yape o BCP (S/. 19.90 PEN)
                    </p>
                  </div>
                </div>
                <span className="text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                  ➔
                </span>
              </button>

              {/* Acceso Directo Instantáneo */}
              <div className="pt-2">
                <button
                  onClick={handleCheckoutDirecto}
                  disabled={procesando}
                  className="w-full py-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>⚡ Activar Modo Pro Instantáneo (Acceso Rápido)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPaso("beneficios")}
                className="w-full py-2 text-xs text-gray-400 hover:text-white font-bold"
              >
                ← Volver a beneficios
              </button>
            </div>
          )}

          {paso === "yape" && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-2xl text-center space-y-2">
                <span className="text-4xl inline-block">📱</span>
                <h4 className="font-bold text-sm text-purple-300">
                  Transferencia Directa Yape / BCP
                </h4>
                <p className="text-xs text-gray-300">
                  Transfiere <strong className="text-emerald-400">S/. 19.90 PEN</strong> e ingresa el número de operación a continuación.
                </p>
              </div>

              <form onSubmit={handlePagarYape} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">
                    Número de Operación Yape / BCP
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 12345678"
                    value={nroOperacion}
                    onChange={(e) => setNroOperacion(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white font-bold text-sm focus:border-purple-500"
                    required
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400 font-bold">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={procesando}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
                >
                  {procesando ? "Enviando..." : "Confirmar y Enviar Solicitud"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setPaso("pago")}
                className="w-full py-2 text-xs text-gray-400 hover:text-white font-bold"
              >
                ← Cambiar método de pago
              </button>
            </div>
          )}

          {paso === "exito" && (
            <div className="text-center space-y-4 py-6 animate-fade-in">
              <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 text-emerald-400 rounded-full text-5xl mb-2">
                🎉
              </div>
              <h3 className="text-2xl font-black text-white">
                ¡Cuenta Pro Activada con Éxito!
              </h3>
              <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                Tu suscripción a <strong className="text-emerald-400">FinanceFlow Pro</strong> está lista. Ya tienes acceso ilimitado a todas las funciones avanzadas.
              </p>
              <button
                onClick={onClose}
                className="py-3.5 px-8 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black rounded-xl shadow-lg transition-all text-sm"
              >
                ¡Comenzar a Usar Pro!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
