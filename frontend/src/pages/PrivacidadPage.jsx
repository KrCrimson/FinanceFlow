import React from "react";
import { Link } from "react-router-dom";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-gray-900/60 p-8 sm:p-12 rounded-3xl border border-gray-800 shadow-2xl backdrop-blur-md">
        
        {/* Header */}
        <div className="border-b border-gray-800 pb-6">
          <Link to="/" className="text-emerald-400 font-bold text-xs uppercase tracking-wider hover:underline">
            ← Volver a FinanceFlow
          </Link>
          <h1 className="text-3xl font-extrabold text-white mt-2">Política de Privacidad y Protección de Datos</h1>
          <p className="text-xs text-gray-400 mt-1">Última actualización: 4 de agosto de 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">1. Compromiso de Privacidad</h2>
            <p>
              En <strong>FinanceFlow</strong> respetamos profundamente su privacidad y nos comprometemos a proteger sus datos personales y financieros de acuerdo con los estándares internacionales de protección de datos.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">2. Información que Recopilamos</h2>
            <p>Para brindarle el servicio de gestión de balance y caja chica, recopilamos la siguiente información:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
              <li><strong>Información de Cuenta:</strong> Nombre, correo electrónico y contraseña cifrada (hash).</li>
              <li><strong>Datos Financieros e Ingresos/Egresos:</strong> Montos, categorías, conceptos y recordatorios de préstamos ingresados voluntariamente por usted.</li>
              <li><strong>Imágenes de Comprobantes (OCR):</strong> Fotografías o archivos enviadas voluntariamente para la extracción automatizada de montos mediante IA.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">3. Uso de la Información</h2>
            <p>Su información se utiliza exclusivamente para:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
              <li>Proporcionar y mantener las funciones de cálculo de balance, alertas y reportes contables.</li>
              <li>Procesar escaneos inteligentes mediante tecnología OCR segura.</li>
              <li>Autenticar su acceso seguro mediante tokens JWT cifrados.</li>
            </ul>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300">
              <strong>🔒 COMPROMISO DE NO COMERCIALIZACIÓN:</strong> Nunca vendemos, alquilamos ni compartimos sus datos financieros o personales con terceros para fines publicitarios ni de marketing.
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">4. Seguridad y Cifrado de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas avanzadas, incluyendo cifrado SSL/TLS en todas las comunicaciones, hash de contraseñas de alta resistencia (Bcrypt) y arquitectura aislada por usuario en nuestras bases de datos MongoDB Atlas.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">5. Derechos del Usuario (Eliminación de Datos)</h2>
            <p>
              Usted conserva la propiedad total de su información. En cualquier momento puede exportar sus datos en formato PDF/Excel o solicitar la eliminación definitiva de su cuenta y todos sus registros enviando un correo a <span className="text-emerald-400 font-semibold">privacidad@financeflow.com</span>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">6. Uso de Cookies</h2>
            <p>
              Utilizamos cookies técnicas y de sesión estrictamente necesarias para mantener su sesión activa de forma segura. Puede consultar más detalles en nuestro Banner de Cookies.
            </p>
          </section>

        </div>

        {/* Footer info */}
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} FinanceFlow SaaS. Todos los derechos reservados.
        </div>

      </div>
    </div>
  );
}
