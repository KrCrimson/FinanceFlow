import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieBanner() {
  const [aceptado, setAceptado] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("financeflow_cookie_consent");
    if (!consent) {
      setAceptado(false);
    }
  }, []);

  const handleAceptarTodas = () => {
    localStorage.setItem("financeflow_cookie_consent", "todas");
    setAceptado(true);
  };

  const handleSoloEsenciales = () => {
    localStorage.setItem("financeflow_cookie_consent", "esenciales");
    setAceptado(true);
  };

  if (aceptado) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-lg z-50 bg-gray-900/95 border border-gray-800 p-5 rounded-3xl shadow-2xl backdrop-blur-md animate-fade-in text-white space-y-4">
      <div className="flex items-start space-x-3">
        <span className="text-2xl">🍪</span>
        <div className="space-y-1">
          <h4 className="font-bold text-xs text-white">Gestión de Privacidad y Cookies</h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Utilizamos cookies esenciales para mantener tu sesión activa y cifrada. Puedes aceptar todas o elegir solo las cookies estrictamente necesarias. Lee nuestros{" "}
            <Link to="/terminos" className="text-emerald-400 underline font-semibold hover:text-emerald-300">
              Términos
            </Link>{" "}
            y{" "}
            <Link to="/privacidad" className="text-emerald-400 underline font-semibold hover:text-emerald-300">
              Política de Privacidad
            </Link>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={handleSoloEsenciales}
          className="py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl text-xs transition-colors border border-gray-700 text-center"
        >
          Solo Esenciales
        </button>
        <button
          onClick={handleAceptarTodas}
          className="py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 text-center"
        >
          Aceptar Todas
        </button>
      </div>
    </div>
  );
}
