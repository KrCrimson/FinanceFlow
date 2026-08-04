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

  const handleAceptar = () => {
    localStorage.setItem("financeflow_cookie_consent", "true");
    setAceptado(true);
  };

  if (aceptado) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 bg-gray-900/95 border border-gray-800 p-5 rounded-3xl shadow-2xl backdrop-blur-md animate-fade-in text-white space-y-3">
      <div className="flex items-start space-x-3">
        <span className="text-2xl">🍪</span>
        <div className="space-y-1">
          <h4 className="font-bold text-xs text-white">Aviso de Privacidad y Cookies</h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Utilizamos cookies esenciales para mantener tu sesión segura y personalizar tu experiencia. Al continuar navegando, aceptas nuestros{" "}
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

      <div className="flex justify-end space-x-2 pt-1">
        <button
          onClick={handleAceptar}
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
        >
          Aceptar y Continuar
        </button>
      </div>
    </div>
  );
}
