import React, { useState } from "react";
import { crearCargoCulqi } from "../services/pagosService";

const PRECIO_PRO = { moneda: "PEN", monto: 19.9, desc: "S/ 19.90" };

const CULQI_SCRIPT_URL = "https://checkout.culqi.com/js/v4";

function cargarCulqiScript() {
  return new Promise((resolve, reject) => {
    if (window.Culqi) {
      resolve();
      return;
    }
    const existente = document.querySelector(`script[src="${CULQI_SCRIPT_URL}"]`);
    if (existente) {
      existente.addEventListener("load", () => resolve());
      existente.addEventListener("error", () => reject(new Error("No se pudo cargar Culqi")));
      return;
    }
    const script = document.createElement("script");
    script.src = CULQI_SCRIPT_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Culqi"));
    document.body.appendChild(script);
  });
}

export default function PaywallModal({
  isOpen,
  onClose,
  userEmail,
  userNombre,
  title = "⭐ Desbloquea Exportaciones y FinanceFlow Pro",
}) {
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [paso, setPaso] = useState("beneficios"); // 'beneficios' | 'exito'

  if (!isOpen) return null;

  // Pagar con Culqi (tarjeta, en soles)
  const handlePagarCulqi = async () => {
    setError("");
    const publicKey = process.env.REACT_APP_CULQI_PUBLIC_KEY;
    if (!publicKey) {
      setError("La pasarela de pago aún no está configurada (falta la llave pública de Culqi).");
      return;
    }

    try {
      setProcesando(true);
      await cargarCulqiScript();

      window.Culqi.publicKey = publicKey;
      window.Culqi.settings({
        title: "FinanceFlow Pro",
        currency: PRECIO_PRO.moneda,
        amount: Math.round(PRECIO_PRO.monto * 100),
      });
      window.Culqi.options({
        lang: "auto",
        installments: false,
        paymentMethods: { tarjeta: true, yape: true },
      });

      window.culqi = async function () {
        if (window.Culqi.token) {
          const tokenId = window.Culqi.token.id;
          try {
            await crearCargoCulqi(tokenId, PRECIO_PRO.monto, PRECIO_PRO.moneda);
            setPaso("exito");
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } catch (err) {
            setError(err.message || "El pago con Culqi fue rechazado.");
          } finally {
            setProcesando(false);
          }
        } else if (window.Culqi.order) {
          setError("Este método de pago aún no está soportado.");
          setProcesando(false);
        } else {
          setProcesando(false);
        }
      };

      window.Culqi.open();
    } catch (err) {
      setError(err.message || "No se pudo iniciar Culqi.");
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
                  ⚡ Licencia Profesional Multidispositivo
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

              <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-400">
                    Precio Total:
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400">
                      {PRECIO_PRO.desc}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handlePagarCulqi}
                disabled={procesando}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all text-base flex items-center justify-center space-x-2 group"
              >
                <span>{procesando ? "Iniciando Pago Seguro..." : `Pagar ${PRECIO_PRO.desc} con Culqi (Tarjeta / Yape)`}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <div className="text-center text-[11px] text-gray-500 flex items-center justify-center space-x-1">
                <span>🔒 Procesamiento 100% seguro por</span>
                <strong className="text-gray-300">Culqi</strong>
              </div>
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
