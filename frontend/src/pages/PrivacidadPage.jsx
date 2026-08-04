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
          <p className="text-xs text-gray-400 mt-1">
            Conforme a la Ley N° 29733 (Ley de Protección de Datos Personales del Perú) • Última actualización: 4 de agosto de 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">1. Marco Legal y Titularidad</h2>
            <p>
              En <strong>FinanceFlow</strong> (en adelante, "la Aplicación"), tratamos sus datos personales en cumplimiento con la <strong>Ley N° 29733 (Ley de Protección de Datos Personales de la República del Perú)</strong> y su Reglamento aprobado por <strong>D.S. 003-2013-JUS</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">2. Datos Personales Recopilados y Finalidad del Tratamiento</h2>
            <p>Recopilamos y tratamos los siguientes datos personales indispensables:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
              <li><strong>Datos de Identificación y Contacto:</strong> Nombre completo, correo electrónico y contraseña encriptada (hash Bcrypt).</li>
              <li><strong>Datos Financieros y Registros:</strong> Transacciones de ingresos, egresos, categorías, arqueos y deudas pendientes ingresadas por el usuario.</li>
              <li><strong>Comprobantes y Capturas (OCR):</strong> Fotografías de comprobantes enviadas voluntariamente por el usuario para la extracción automatizada de montos mediante Inteligencia Artificial.</li>
            </ul>
            <p className="text-xs text-gray-400 mt-1">
              <strong>Finalidad del Tratamiento:</strong> Los datos se tratan exclusivamente para la gestión de su cuenta, análisis presupuestario, generación de reportes y envío de comunicaciones operativas o restablecimiento de contraseña.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">3. Permisos de la Aplicación Móvil</h2>
            <p>La versión móvil de FinanceFlow podrá solicitar los siguientes permisos estrictamente justificados:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
              <li><strong>Cámara y Galería de Fotos:</strong> Utilizado únicamente cuando el usuario elige escanear una boleta o factura física mediante el OCR de la app. No se accede a imágenes ajenas al proceso de escaneo.</li>
              <li><strong>Notificaciones:</strong> Utilizado opcionalmente para enviar alertas locales sobre vencimiento de préstamos o cuentas pendientes.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">4. Transferencia Internacional de Datos a Terceros Encargados</h2>
            <p>
              Para prestar el servicio, transferimos ciertos datos a los siguientes proveedores tecnológicos internacionales que cumplen estrictos estándares de seguridad:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-300 border border-gray-800 rounded-xl">
                <thead className="bg-gray-800 text-emerald-400 uppercase font-bold">
                  <tr>
                    <th className="p-2.5">Proveedor</th>
                    <th className="p-2.5">País Destino</th>
                    <th className="p-2.5">Finalidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr>
                    <td className="p-2.5 font-semibold">Flow.cl / Mercado Pago / Stripe</td>
                    <td className="p-2.5">Chile / México / EE.UU.</td>
                    <td className="p-2.5">Procesamiento seguro de suscripciones Pro</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">MongoDB Atlas</td>
                    <td className="p-2.5">Estados Unidos / EE.UU.</td>
                    <td className="p-2.5">Almacenamiento seguro cifrado en la nube</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Google Gemini API</td>
                    <td className="p-2.5">Estados Unidos / EE.UU.</td>
                    <td className="p-2.5">Lectura automatizada OCR de comprobantes</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Resend Inc.</td>
                    <td className="p-2.5">Estados Unidos / EE.UU.</td>
                    <td className="p-2.5">Envío de emails operacionales de recuperación</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">5. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h2>
            <p>
              De conformidad con la Ley N° 29733, usted tiene derecho a ejercer sus <strong>Derechos ARCO</strong> en cualquier momento:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
              <li><strong>Acceso:</strong> Obtener información sobre sus datos tratados.</li>
              <li><strong>Rectificación:</strong> Corregir o actualizar datos inexactos.</li>
              <li><strong>Cancelación:</strong> Solicitar la eliminación total de su cuenta y registros de la base de datos.</li>
              <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos para fines específicos.</li>
            </ul>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300">
              <strong>📧 Procedimiento ARCO:</strong> Para ejercer cualquiera de sus derechos, envíe una solicitud firmada adjuntando copia de su documento de identidad (DNI o Pasaporte) a la dirección de correo: <span className="font-bold underline">privacidad@financeflow.com</span>. Responderemos a su solicitud en los plazos legales establecidos.
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">6. Plazo de Conservación de Datos</h2>
            <p>
              Los datos personales se conservarán mientras la cuenta de usuario permanezca activa o hasta que el usuario ejerza su derecho de cancelación de datos, tras lo cual se procederá a su supresión segura.
            </p>
          </section>

        </div>

        {/* Footer info */}
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} FinanceFlow SaaS. Conforme a la Ley N° 29733 del Perú.
        </div>

      </div>
    </div>
  );
}
