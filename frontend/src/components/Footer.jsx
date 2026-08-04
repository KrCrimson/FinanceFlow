import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-900 py-8 px-4 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        
        {/* Brand Copyright */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gray-300">FinanceFlow SaaS</span>
          <span>© {new Date().getFullYear()} Todos los derechos reservados.</span>
        </div>

        {/* Legal Links */}
        <div className="flex items-center space-x-6">
          <Link to="/terminos" className="hover:text-emerald-400 transition-colors">
            Términos y Condiciones
          </Link>
          <Link to="/privacidad" className="hover:text-emerald-400 transition-colors">
            Política de Privacidad
          </Link>
          <span className="text-gray-700">|</span>
          <span className="text-gray-600">Herramienta de Control Financiero</span>
        </div>

      </div>
    </footer>
  );
}
