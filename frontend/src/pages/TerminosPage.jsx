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
            <h2 className="text-lg font-bold text-emerald-400">1. Aceptación de los Términos y Edad Mínima</h2>
            <p>
              Al registrarse, acceder o utilizar la plataforma <strong>FinanceFlow</strong> (en adelante, "la Aplicación" o "el Servicio"), usted declara tener al menos <strong>18 años de edad</strong> (o la mayoría de edad legal aplicable en su jurisdicción) y acepta de forma libre, expresa e informada quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con estos términos, deberá abstenerse de utilizar el Servicio.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">2. Naturaleza del Servicio y Deslinde Fiscal/Contable</h2>
            <p>
              FinanceFlow es una herramienta tecnológica de software como servicio (SaaS) destinada exclusivamente a la organización personal, gestión presupuestaria de caja chica y escaneo automatizado de comprobantes.
            </p>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 space-y-1">
              <strong>⚠️ AVISO SOBRE REGULACIÓN Y ASESORÍA FISCAL:</strong>
              <p>
                FinanceFlow <strong>NO es una entidad financiera supervisada por la SBS (Superintendencia de Banca, Seguros y AFP), ni una firma de auditoría o asesoría tributaria autorizada ante la SUNAT</strong> u organismos equivalentes. La Aplicación no emite dictámenes fiscales ni declaraciones juradas oficiales. El usuario es el único responsable de verificar la exactitud de sus registros y de cumplir sus obligaciones tributarias vigentes.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">3. Limitación de Responsabilidad (Conformidad con el Código Civil Peruano)</h2>
            <p>
              En cumplimiento del Código Civil del Perú (Arts. 1328 y 1986) y del Código de Protección y Defensa del Consumidor (Ley N° 29571):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
              <li>
                La Aplicación responde conforme a ley por daños directos probados provenientes de dolo o culpa grave imputable a sus desarrolladores o titulares.
              </li>
              <li>
                La Aplicación <strong>no se hace responsable por daños indirectos, lucro cesante o pérdidas derivadas de culpa leve, error de digitación del usuario o eventos de caso fortuito o fuerza mayor</strong>.
              </li>
              <li>
                Tampoco responde por interrupciones temporales causadas por fallas de terceros proveedores de pasarelas de pago (Flow.cl, Mercado Pago, Stripe) o caídas fortuitas de servidores en la nube.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">4. Pasarelas de Pago y Contratación de Licencias</h2>
            <p>
              Los pagos para la activación del plan Pro se procesan mediante pasarelas externas seguras (Flow.cl, Mercado Pago o Stripe). FinanceFlow <strong>nunca almacena ni procesa directamente datos de tarjetas bancarias</strong>. Cualquier reclamación sobre procesamiento o devoluciones derivadas del proveedor de pago se sujetará a las políticas vigentes de la pasarela correspondiente.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">5. Uso Aceptable y Suspensión de Cuenta</h2>
            <p>
              El usuario acepta no utilizar el Servicio para fines ilícitos, lavado de activos o vulneración de derechos de terceros. Nos reservamos el derecho de suspender o cancelar cuentas de usuario ante violaciones graves a la ley o intentos de hacking e ingeniería inversa del código.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">6. Propiedad Intelectual</h2>
            <p>
              Todos los derechos de propiedad intelectual sobre el código fuente, diseño de interfaz, marcas, logotipos y algoritmos de FinanceFlow pertenecen exclusivamente a sus titulares. Se otorga una licencia de uso personal, no exclusiva e intransferible.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">7. Modificaciones de los Términos</h2>
            <p>
              Nos reservamos la facultad de modificar estos Términos. Notificaremos cambios significativos a través de correo electrónico o alertas dentro de la Aplicación con al menos 7 días de anticipación antes de su entrada en vigor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-emerald-400">8. Ley Aplicable y Jurisdicción (Perú)</h2>
            <p>
              Estos Términos se rigen por las leyes de la República del Perú. Para cualquier controversia no resuelta por conciliación directa, las partes se someten a la competencia territorial de los jueces y tribunales del Distrito Judicial de <strong>Tacna, Perú</strong>.
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
