import React from "react";
import { Link } from "react-router-dom";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-gray-900/60 p-8 sm:p-12 rounded-3xl border border-gray-800 shadow-2xl backdrop-blur-md">
        
        {/* Header */}
        <div className="border-b border-gray-800 pb-6">
          <Link to="/" className="text-emerald-400 font-bold text-xs uppercase tracking-wider hover:underline">
            ← Volver a FinanceFlow
          </Link>
          <h1 className="text-3xl font-extrabold text-white mt-2">Términos y Condiciones de Uso</h1>
          <p className="text-xs text-gray-400 mt-1">Última actualización: 4 de agosto de 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">1. Aceptación de los Términos</h2>
            <p>
              Al acceder, registrarse o utilizar la plataforma <strong>FinanceFlow</strong> (en adelante, "la Aplicación" o "el Servicio"), usted acepta expresamente quedar vinculado por estos Términos y Condiciones de Uso. Si no está de acuerdo con alguna parte de estos términos, no deberá utilizar nuestros servicios.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">2. Naturaleza Informativa y Herramienta Organizacional (Descargo de Responsabilidad)</h2>
            <p>
              FinanceFlow es una herramienta tecnológica diseñada exclusivamente para la organización personal, registro de movimientos financieros, cálculo de balances y escaneo automatizado de comprobantes.
            </p>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 space-y-1">
              <strong>⚠️ AVISO IMPORTANTE DE EXENCIÓN DE RESPONSABILIDAD FINANCIERA Y FISCAL:</strong>
              <p>
                FinanceFlow <strong>NO es una entidad bancaria, ni asesora financiera, ni firma contable legalmente acreditada</strong>. La Aplicación no proporciona asesoramiento fiscal, tributario ni de inversiones. El usuario es el único responsable de la exactitud de los datos ingresados y del cumplimiento de sus obligaciones tributarias ante las autoridades fiscales de su respectivo país (como SUNAT u organismos equivalentes).
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">3. Limitación de Responsabilidad</h2>
            <p>
              En la máxima medida permitida por la ley aplicable, FinanceFlow, sus desarrolladores, propietarios y colaboradores <strong>no serán responsables</strong> bajo ninguna circunstancia por:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
              <li>Pérdidas de ingresos, ganancias simuladas, datos o interrupción del negocio.</li>
              <li>Errores de cálculo u omisiones derivadas de información mal ingresada por el usuario.</li>
              <li>Fallos, retrasos o errores de procesamiento de pagos gestionados por pasarelas externas (como Flow.cl, Mercado Pago o Stripe).</li>
              <li>Interrupciones temporales del servicio derivadas de mantenimientos o fallas imprevistas en los proveedores de infraestructura en la nube.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">4. Uso Aceptable y Cuenta de Usuario</h2>
            <p>
              El usuario se compromete a utilizar el Servicio de manera legal y ética. Queda estrictamente prohibido intentar acceder de forma no autorizada al código fuente, realizar ingeniería inversa, inyectar código malicioso o vulnerar la seguridad de la plataforma.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">5. Planes, Cobros y Pasarelas de Pago</h2>
            <p>
              Los cobros por suscripciones o licencias de FinanceFlow Pro son procesados por pasarelas externas seguras (Flow.cl, Mercado Pago o Stripe). FinanceFlow <strong>nunca almacena ni procesa números de tarjetas de crédito o débito</strong> en sus propios servidores.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">6. Modificaciones de los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar o actualizar estos Términos en cualquier momento. El uso continuado del Servicio tras la publicación de los cambios constituirá la aceptación implícita de los mismos.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">7. Contacto</h2>
            <p>
              Para cualquier consulta sobre estos Términos, puede comunicarse a través del correo oficial de soporte: <span className="text-emerald-400 font-semibold">soporte@financeflow.com</span>.
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
