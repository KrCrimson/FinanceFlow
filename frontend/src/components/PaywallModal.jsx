import React, { useState, useEffect } from "react";
import { solicitarPlanPro, checkoutDirectoPro } from "../services/pagosService";

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
  const [paso, setPaso] = useState("beneficios"); // 'beneficios' | 'pago' | 'exito'
  const [metodo, setMetodo] = useState("card"); // 'card' | 'gpay' | 'yape'
  const [paisSeleccionado, setPaisSeleccionado] = useState(LISTA_PAISES[0]);

  // Campos de tarjeta
  const [numTarjeta, setNumTarjeta] = useState("");
  const [caducidad, setCaducidad] = useState("");
  const [cvc, setCvc] = useState("");
  const [nombreTitular, setNombreTitular] = useState(userNombre || "");
  const [nroOperacionYape, setNroOperacionYape] = useState("");

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  // Detección automática de País por Zona Horaria / Navegador
  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const lang = navigator.language || "";

      if (timeZone.includes("Lima") || lang.includes("PE")) {
        setPaisSeleccionado(LISTA_PAISES[0]); // Perú
      } else if (timeZone.includes("Mexico") || lang.includes("MX")) {
        setPaisSeleccionado(LISTA_PAISES[1]); // México
      } else if (timeZone.includes("Bogota") || lang.includes("CO")) {
        setPaisSeleccionado(LISTA_PAISES[2]); // Colombia
      } else if (timeZone.includes("Santiago") || lang.includes("CL")) {
        setPaisSeleccionado(LISTA_PAISES[3]); // Chile
      } else if (timeZone.includes("Buenos_Aires") || lang.includes("AR")) {
        setPaisSeleccionado(LISTA_PAISES[4]); // Argentina
      } else if (timeZone.includes("Madrid") || lang.includes("ES")) {
        setPaisSeleccionado(LISTA_PAISES[6]); // España
      } else if (!timeZone.includes("America/")) {
        setPaisSeleccionado(LISTA_PAISES[5]); // EE.UU. / Resto
      }
    } catch (e) {
      console.log("Auto-detection fallback applied");
    }
  }, []);

  if (!isOpen) return null;

  // URL del QR dinámico de Yape con monto de S/ 19.90 pre-cargado
  const yapeQrMontoUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent("https://yape.pe/pay?amount=19.90&ref=FinanceFlowPro")}&color=7C3AED`;

  // Procesar pago automático con Tarjeta o Google Pay (Opción B)
  const handlePagarCheckoutDirecto = async (e) => {
    if (e) e.preventDefault();
    try {
      setProcesando(true);
      setError("");

      if (metodo === "card" && (!numTarjeta || !caducidad || !cvc)) {
        throw new Error("Por favor completa los datos de la tarjeta.");
      }

      await checkoutDirectoPro(
        userEmail || "usuario@financeflow.com",
        metodo,
        paisSeleccionado.nombre,
        paisSeleccionado.monto,
        paisSeleccionado.moneda,
      );

      setPaso("exito");
    } catch (err) {
      setError(err.message || "Error procesando el pago.");
    } finally {
      setProcesando(false);
    }
  };

  // Procesar constancia Yape con monto
  const handleEnviarYape = async (e) => {
    e.preventDefault();
    if (!nroOperacionYape.trim()) {
      setError("Por favor ingresa el número de operación.");
      return;
    }

    try {
      setProcesando(true);
      setError("");
      await solicitarPlanPro(
        userEmail || "usuario@financeflow.com",
        "yape",
        nroOperacionYape.trim(),
        19.9,
      );
      setPaso("exito");
    } catch (err) {
      setError(err.message || "Error al enviar comprobante.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-gray-900 text-white rounded-3xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Bar / Bar de Cierre */}
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
                  Automatiza tu control financiero con Inteligencia Artificial,
                  exportaciones contables y reportes ejecutivos en tiempo real.
                </p>
              </div>

              {/* Beneficios */}
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
                      Planifica múltiples metas de compras grandes en
                      simultáneo.
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
                    País / Región Detectado:
                  </label>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                    Auto-detectado
                  </span>
                </div>
                <select
                  value={paisSeleccionado.nombre}
                  onChange={(e) => {
                    const p = LISTA_PAISES.find(
                      (item) => item.nombre === e.target.value,
                    );
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
                    Precio Total (Pago Único):
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
                <span>Continuar al Pago →</span>
              </button>
            </div>
          )}

          {paso === "pago" && (
            <div className="space-y-5 animate-fade-in">
              {/* Vercel/Stripe Checkout Tab Bar */}
              <div className="grid grid-cols-3 gap-2 bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
                <button
                  onClick={() => setMetodo("card")}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    metodo === "card"
                      ? "bg-blue-600/20 border border-blue-500 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="text-lg">💳</span>
                  <span>Tarjeta</span>
                </button>

                <button
                  onClick={() => setMetodo("gpay")}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    metodo === "gpay"
                      ? "bg-white text-gray-950 shadow-md font-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="text-base font-black tracking-tighter">
                    GPay
                  </span>
                  <span>Google Pay</span>
                </button>

                <button
                  onClick={() => setMetodo("yape")}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    metodo === "yape"
                      ? "bg-purple-600/20 border border-purple-500 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="text-lg">📱</span>
                  <span>Yape (QR)</span>
                </button>
              </div>

              {/* Formulario Estilo Vercel Checkout (Image 1) */}
              {metodo === "card" && (
                <form
                  onSubmit={handlePagarCheckoutDirecto}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">
                      Número De Tarjeta
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="1234 1234 1234 1234"
                        value={numTarjeta}
                        onChange={(e) => setNumTarjeta(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white font-mono font-bold text-sm focus:border-blue-500"
                        required
                      />
                      <div className="absolute right-3 top-3 flex space-x-1">
                        <span className="bg-blue-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white">
                          VISA
                        </span>
                        <span className="bg-red-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white">
                          MC
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-1">
                        Fecha De Caducidad
                      </label>
                      <input
                        type="text"
                        placeholder="MM / AA"
                        value={caducidad}
                        onChange={(e) => setCaducidad(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white font-mono font-bold text-sm focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-1">
                        Código De Seguridad
                      </label>
                      <input
                        type="password"
                        placeholder="CVC 123"
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white font-mono font-bold text-sm focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Tu nombre en la tarjeta"
                      value={nombreTitular}
                      onChange={(e) => setNombreTitular(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white font-bold text-sm focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">
                      País O Región
                    </label>
                    <select
                      value={paisSeleccionado.nombre}
                      onChange={(e) => {
                        const p = LISTA_PAISES.find(
                          (item) => item.nombre === e.target.value,
                        );
                        if (p) setPaisSeleccionado(p);
                      }}
                      className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white font-bold text-xs"
                    >
                      {LISTA_PAISES.map((p) => (
                        <option key={p.nombre} value={p.nombre}>
                          {p.nombre} ({p.desc})
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 font-bold">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={procesando}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
                  >
                    {procesando
                      ? "Procesando Pago Seguro..."
                      : `Pagar ${paisSeleccionado.desc} y Activar Pro Instantáneamente`}
                  </button>
                </form>
              )}

              {/* Pestaña Google Pay */}
              {metodo === "gpay" && (
                <div className="space-y-4 text-center py-4 bg-gray-950 p-6 rounded-2xl border border-gray-800">
                  <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl mb-2 shadow">
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">
                      GPay
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    Pago Rápido con Google Pay
                  </h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Paga de forma rápida y segura utilizando tus tarjetas
                    guardadas en tu cuenta de Google.
                  </p>

                  <div className="p-3 bg-gray-900 rounded-xl border border-gray-800 text-xs text-emerald-400 font-mono font-bold">
                    Monto Total: {paisSeleccionado.desc}
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 font-bold">{error}</p>
                  )}

                  <button
                    onClick={handlePagarCheckoutDirecto}
                    disabled={procesando}
                    className="w-full py-3.5 bg-white hover:bg-gray-100 text-gray-950 font-black rounded-xl shadow-xl transition-all text-base flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>
                      {procesando
                        ? "Procesando GPay..."
                        : "Pagar ahora con Google Pay 🚀"}
                    </span>
                  </button>
                </div>
              )}

              {/* Pestaña Yape con QR de Monto Automático (SIN BCP) */}
              {metodo === "yape" && (
                <div className="space-y-4 bg-purple-950/20 p-5 rounded-2xl border border-purple-800/50 text-center">
                  <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 font-bold text-xs rounded-full">
                    QR de Yape con Monto Automático (S/ 19.90)
                  </span>

                  <p className="text-xs text-purple-200">
                    Al escanear el QR desde tu Yape,{" "}
                    <b>
                      el monto de S/ 19.90 aparecerá precargado automáticamente
                    </b>{" "}
                    en tu pantalla.
                  </p>

                  <div className="flex justify-center py-2">
                    <img
                      src={yapeQrMontoUrl}
                      alt="QR Yape con Monto"
                      className="h-56 w-56 object-contain rounded-2xl border-2 border-purple-500/50 shadow-2xl bg-white p-2"
                    />
                  </div>

                  <form
                    onSubmit={handleEnviarYape}
                    className="space-y-3 pt-2 text-left"
                  >
                    <label className="block text-xs font-bold text-gray-300">
                      Ingresa tu Número de Operación de Yape:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 0491820"
                      value={nroOperacionYape}
                      onChange={(e) => setNroOperacionYape(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white font-mono font-bold text-sm focus:border-purple-500"
                      required
                    />

                    {error && (
                      <p className="text-xs text-red-400 font-bold">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={procesando}
                      className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
                    >
                      {procesando
                        ? "Enviando Comprobante..."
                        : "Confirmar Comprobante Yape"}
                    </button>
                  </form>
                </div>
              )}

              <button
                type="button"
                onClick={() => setPaso("beneficios")}
                className="w-full py-2 text-xs text-gray-400 hover:text-white font-bold"
              >
                ← Volver a los beneficios
              </button>
            </div>
          )}

          {paso === "exito" && (
            <div className="text-center space-y-4 py-6 animate-fade-in">
              <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 text-emerald-400 rounded-full text-5xl mb-2">
                🎉
              </div>
              <h3 className="text-2xl font-black text-white">
                ¡Suscripción FinanceFlow Pro Activada!
              </h3>
              <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                Tu pago ha sido procesado exitosamente. Tu cuenta ahora cuenta
                con{" "}
                <span className="text-emerald-400 font-bold">
                  Licencia Pro Ilimitada
                </span>{" "}
                para Web y Móvil.
              </p>
              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
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
