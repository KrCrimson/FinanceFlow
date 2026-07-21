import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💰</span>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              FinanceFlow
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-300">
            <a href="#quienes-somos" className="hover:text-emerald-400 transition-colors">Quiénes Somos</a>
            <a href="#ofrecemos" className="hover:text-emerald-400 transition-colors">Qué Ofrecemos</a>
            <a href="#beneficios" className="hover:text-emerald-400 transition-colors">Beneficios</a>
            <a href="#porque-nosotros" className="hover:text-emerald-400 transition-colors">Por Qué Elegirnos</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-bold text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>🚀 Gestión Financiera Inteligente</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Toma el <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">Control Absoluto</span> de tu Dinero.
            </h1>

            <p className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-xl">
              Administra tus ingresos y egresos, programa cierres diarios sin estrés y compite en vivo con la <strong className="text-emerald-400 font-semibold">Carrera de Compras Planificadas</strong> directamente con el saldo de tu bolsillo.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-black text-center text-lg px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>🚀 Comenzar Gratis Ahora</span>
              </Link>
              <Link
                to="/login"
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-center text-lg px-8 py-4 rounded-2xl border border-gray-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>🔑 Acceder a mi Cuenta</span>
              </Link>
            </div>

            <div className="flex items-center space-x-6 pt-4 text-xs font-semibold text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">✓</span>
                <span>Sin tarjetas de crédito requeridas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">✓</span>
                <span>Web y App Móvil Sincronizadas</span>
              </div>
            </div>
          </div>

          {/* Dynamic Mockup Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative bg-gray-800/90 border border-gray-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              {/* Top Card Bar */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-400 font-mono ml-2">FinanceFlow Dashboard Live</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">🟢 En Vivo</span>
              </div>

              {/* Metrics preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-4">
                  <p className="text-xs text-emerald-300 font-medium">Total Ingresos</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">S/ 3,062.00</p>
                </div>
                <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-4">
                  <p className="text-xs text-red-300 font-medium">Total Egresos</p>
                  <p className="text-2xl font-bold text-red-400 mt-1">S/ 800.00</p>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-4">
                <p className="text-xs text-blue-300 font-medium">Balance Total Disponible</p>
                <p className="text-3xl font-extrabold text-blue-400 mt-1">S/ 2,262.00</p>
              </div>

              {/* Goal Race Preview */}
              <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-200">🏁 Carrera de Compras</span>
                  <span className="text-emerald-400 font-semibold">2 Metas Activas</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span>Laptop Nueva</span>
                    <span className="text-emerald-400">65% (S/ 2,262 / 3,500)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-emerald-400 h-2 rounded-full w-[65%]"></div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span>Ram 🎉</span>
                    <span className="text-emerald-400 font-bold">100% (¡Listo para comprar!)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section id="quienes-somos" className="py-20 bg-gray-800/50 border-y border-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">¿Quiénes Somos?</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-100">
            Nacidos para transformar la forma en que manejas tu dinero diario.
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            En <strong>FinanceFlow</strong> revolucionamos la gestión financiera personal. Olvídate de planillas confusas de Excel o cuadernos extraviados. Creamos una plataforma en la nube intuitiva, moderna y con sincronización en tiempo real para que tengas tranquilidad total al tomar decisiones de gasto o ahorro.
          </p>
        </div>
      </section>

      {/* Qué Ofrecemos */}
      <section id="ofrecemos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Qué Ofrecemos</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-100">
            Herramientas creadas para tu tranquilidad financiera
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/60 border border-gray-700/80 rounded-2xl p-6 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center text-2xl mb-4">
              🏁
            </div>
            <h4 className="text-xl font-bold text-gray-100 mb-2">Carrera de Compras</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tus metas de compra avanzan en tiempo real según el saldo acumulado en tu balance. Sabrás exactamente qué producto ya puedes comprar hoy.
            </p>
          </div>

          <div className="bg-gray-800/60 border border-gray-700/80 rounded-2xl p-6 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center text-2xl mb-4">
              🔄
            </div>
            <h4 className="text-xl font-bold text-gray-100 mb-2">Ingresos Constantes</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Autogeneración automática de tus sueldos y cobros recurrentes al cumplir el día de pago del mes, sin tener que volverlos a escribir.
            </p>
          </div>

          <div className="bg-gray-800/60 border border-gray-700/80 rounded-2xl p-6 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-4">
              🔒
            </div>
            <h4 className="text-xl font-bold text-gray-100 mb-2">Arqueos y Cierres Seguros</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Registra arqueos diarios y cierres mensuales protegidos con contraseña para asegurar la inmutabilidad de tus saldos pasados.
            </p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="py-20 bg-gray-800/30 border-t border-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Beneficios Exclusivos</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-100">
                Diseñado para simplificar tu estilo de vida
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 bg-gray-800/80 border border-gray-700 p-4 rounded-2xl">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h4 className="font-bold text-gray-100">Cero Complicaciones</h4>
                    <p className="text-xs text-gray-400 mt-1">Interfaz ultrarrápida sin configuraciones complejas ni fórmulas difíciles.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-gray-800/80 border border-gray-700 p-4 rounded-2xl">
                  <span className="text-2xl">📱</span>
                  <div>
                    <h4 className="font-bold text-gray-100">100% Multiplataforma</h4>
                    <p className="text-xs text-gray-400 mt-1">Usa FinanceFlow desde tu navegador web o desde la App Móvil oficial.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-gray-800/80 border border-gray-700 p-4 rounded-2xl">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h4 className="font-bold text-gray-100">Reportes Ejecutivos a 1 Clic</h4>
                    <p className="text-xs text-gray-400 mt-1">Gráficos de barras por categorías e histogramas mensuales de evolución.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Box */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-3xl p-8 text-center space-y-6">
              <span className="text-6xl">💎</span>
              <h4 className="text-2xl font-bold text-white">¿Listo para dar el paso hacia la libertad financiera?</h4>
              <p className="text-gray-300 text-sm max-w-md mx-auto">
                Únete a la plataforma elegida por usuarios que buscan claridad absoluta en sus cuentas personales.
              </p>
              <Link
                to="/register"
                className="inline-block bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-black px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Crear mi Cuenta Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section id="porque-nosotros" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Por qué Elegirnos</h2>
        <h3 className="text-3xl font-extrabold text-gray-100 mb-12">FinanceFlow vs Métodos Tradicionales</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-gray-800/80 border border-gray-700 rounded-2xl overflow-hidden text-sm">
            <thead className="bg-gray-800 text-emerald-400 uppercase text-xs">
              <tr>
                <th className="p-4">Característica</th>
                <th className="p-4 font-bold text-emerald-300">FinanceFlow 💰</th>
                <th className="p-4 text-gray-400">Excel / Cuaderno</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-gray-300">
              <tr>
                <td className="p-4 font-semibold">Cálculo de Metas en Vivo</td>
                <td className="p-4 text-emerald-400 font-bold">✓ En tiempo real contra saldo real</td>
                <td className="p-4 text-red-400">✗ Manual y propenso a errores</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Ingresos Constantes</td>
                <td className="p-4 text-emerald-400 font-bold">✓ Autogenerados cada mes</td>
                <td className="p-4 text-red-400">✗ Escribir cada mes a mano</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Acceso Móvil + Web</td>
                <td className="p-4 text-emerald-400 font-bold">✓ Sincronizado instantáneamente</td>
                <td className="p-4 text-red-400">✗ Solo en una máquina o archivo</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Cierres de Caja Seguros</td>
                <td className="p-4 text-emerald-400 font-bold">✓ Protegidos con clave</td>
                <td className="p-4 text-red-400">✗ Cualquiera puede borrar datos</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12 px-4 text-center text-xs text-gray-500 space-y-4">
        <div className="flex items-center justify-center space-x-2 text-lg font-bold text-gray-200">
          <span>💰</span>
          <span>FinanceFlow</span>
        </div>
        <p>© 2026 FinanceFlow Inc. Todos los derechos reservados. Sistema de Balance y Gestión Financiera Personal.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
