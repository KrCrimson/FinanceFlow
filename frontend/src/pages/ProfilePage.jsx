import React, { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  deleteAccount as deleteProfile,
} from "../services/usuarios-adapter";
import { logout } from "../services/auth-adapter";
import { useNavigate } from "react-router-dom";
import {
  CURRENCIES,
  getCurrencySymbol,
  setCurrencySymbol,
} from "../utils/currency";

function ProfilePage() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [moneda, setMoneda] = useState(getCurrencySymbol());
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNovedades, setShowNovedades] = useState(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProfile();
        setPerfil(data);
        setNombre(data.nombre || "");
        setEmail(data.email || "");
      } catch (err) {
        setError(err.message || "Error al cargar el perfil");
        console.error("Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    cargarPerfil();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      setError("Por favor complete todos los campos");
      return;
    }

    setUpdating(true);
    setSuccess("");
    setError("");
    try {
      const updatedProfile = await updateProfile({
        nombre: nombre.trim(),
        email: email.trim(),
      });
      setPerfil(updatedProfile);
      setSuccess("✅ Perfil actualizado exitosamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");
      await deleteProfile();
      setSuccess("Cuenta eliminada correctamente. Redirigiendo...");
      setShowDeleteConfirm(false);
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Error al eliminar la cuenta");
      setShowDeleteConfirm(false);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const resetForm = () => {
    if (perfil) {
      setNombre(perfil.nombre || "");
      setEmail(perfil.email || "");
      setError("");
      setSuccess("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  if (error && !perfil) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="font-semibold">Error al cargar el perfil</p>
          <p className="text-sm mt-2">{error}</p>
          <div className="flex gap-2 mt-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
                <p className="text-gray-600">
                  Gestiona tu información personal
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              ← Dashboard
            </button>
          </div>
        </div>

        {/* Formulario de Perfil */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Información Personal
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Nombre Completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔤 Moneda de la Cuenta
              </label>
              <select
                value={moneda}
                onChange={(e) => {
                  const newSym = e.target.value;
                  setMoneda(newSym);
                  setCurrencySymbol(newSym);
                  setSuccess(`✅ Moneda principal cambiada a '${newSym}'`);
                  setTimeout(() => setSuccess(""), 3000);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white font-bold text-gray-800"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.symbol}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {perfil?.creadoEn && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Miembro desde
                </label>
                <div className="bg-gray-50 px-4 py-3 rounded-xl text-gray-600">
                  {new Date(perfil.creadoEn).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                🔄 Restablecer
              </button>
              <button
                type="submit"
                disabled={updating || !nombre.trim() || !email.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  <>💾 Guardar Cambios</>
                )}
              </button>
            </div>

            {/* Mensajes */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl animate-fade-in">
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  {success}
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl animate-fade-in">
                <div className="flex items-center">
                  <span className="mr-2">❌</span>
                  {error}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Estadísticas del Usuario */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📊 Estadísticas de Cuenta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="text-2xl text-blue-500 mb-2">👤</div>
              <div className="text-sm text-blue-600 font-medium">Estado</div>
              <div className="text-lg font-bold text-blue-800">
                {perfil?.estado === "activo" ? "Activo" : "Inactivo"}
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="text-2xl text-green-500 mb-2">🔐</div>
              <div className="text-sm text-green-600 font-medium">
                Seguridad
              </div>
              <div className="text-lg font-bold text-green-800">Protegido</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
              <div className="text-2xl text-purple-500 mb-2">💳</div>
              <div className="text-sm text-purple-600 font-medium">Tipo</div>
              <div className="text-lg font-bold text-purple-800">Usuario</div>
            </div>
          </div>
        </div>

        {/* Modo Desarrollador (Dev Controls) & Novedades */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-gray-900 rounded-2xl shadow-xl p-6 mb-6 text-white border border-emerald-500/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-amber-400 text-gray-950 text-[10px] font-black rounded-full uppercase tracking-wider mb-2">
                🛠️ Panel de Desarrollador
              </span>
              <h2 className="text-xl font-bold text-white">
                Controles Dev & Novedades
              </h2>
              <p className="text-xs text-emerald-200">
                Prueba instantánea de planes y consulta de actualizaciones del
                sistema.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const { toggleDevPlan } =
                      await import("../services/pagosService");
                    const res = await toggleDevPlan(email);
                    setSuccess(`✅ ${res.message}`);
                    setTimeout(() => setSuccess(""), 3500);
                  } catch (err) {
                    setError("Error alternando modo desarrollador");
                  }
                }}
                className="bg-amber-400 hover:bg-amber-300 text-gray-950 px-4 py-2.5 rounded-xl font-black text-xs shadow-lg transition-all"
              >
                ⚡ Alternar Plan (Free ↔ Pro)
              </button>

              <button
                type="button"
                onClick={() => setShowNovedades(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-lg transition-all"
              >
                📢 Ver Novedades
              </button>
            </div>
          </div>
        </div>

        {/* Acciones de Cuenta */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ⚙️ Configuración de Cuenta
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div>
                <h3 className="font-semibold text-yellow-800">
                  🔓 Cerrar Sesión
                </h3>
                <p className="text-sm text-yellow-600">
                  Salir de tu cuenta de forma segura
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
              <div>
                <h3 className="font-semibold text-red-800">
                  🗑️ Eliminar Cuenta
                </h3>
                <p className="text-sm text-red-600">
                  Eliminar permanentemente tu cuenta y todos los datos
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-100 hover:bg-red-200 text-red-800 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  ¿Eliminar cuenta?
                </h3>
                <p className="text-gray-600 mb-6">
                  Esta acción no se puede deshacer. Se eliminarán todos tus
                  datos permanentemente.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={updating}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {updating ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Novedades del Sistema */}
        {showNovedades && (
          <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 text-white rounded-3xl p-6 max-w-lg w-full border border-gray-800 shadow-2xl space-y-5 animate-fade-in max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📢</span>
                  <h3 className="font-extrabold text-lg">
                    Novedades y Actualizaciones
                  </h3>
                </div>
                <button
                  onClick={() => setShowNovedades(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-800/60 p-4 rounded-2xl border border-gray-700/60 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-emerald-400">
                      v2.5.0 • Julio 2026
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      NUEVO
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    💳 Pasarela Vercel Checkout + QR Yape con Monto
                  </h4>
                  <p className="text-xs text-gray-300">
                    Nueva experiencia de pago estilo Vercel Checkout con
                    auto-detección de país (LATAM/USD) y QR de Yape con el monto
                    S/ 19.90 precargado automáticamente.
                  </p>
                </div>

                <div className="bg-gray-800/60 p-4 rounded-2xl border border-gray-700/60 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-blue-400">
                      v2.4.0 • Julio 2026
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    📸 Escaneo OCR de Recibos con IA Gemini
                  </h4>
                  <p className="text-xs text-gray-300">
                    Escaneo inteligente de comprobantes físicos utilizando IA
                    multimodal para extraer monto, fecha y categoría
                    automáticamente.
                  </p>
                </div>

                <div className="bg-gray-800/60 p-4 rounded-2xl border border-gray-700/60 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-purple-400">
                      v2.3.0 • Julio 2026
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    📥 Exportaciones PDF / Excel & Cierres de Caja
                  </h4>
                  <p className="text-xs text-gray-300">
                    Descarga reportes contables oficiales en PDF/Excel y bloquea
                    meses cerrados con clave de seguridad.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowNovedades(false)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black rounded-xl text-sm transition-all"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
