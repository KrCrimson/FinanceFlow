/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/App.jsx
 * Capa / módulo ...: Frontend · Navegación
 * Función .........: Define las pantallas y sus direcciones, protege las privadas con ProtectedRoute y coloca la barra superior, el pie y el aviso de cookies.
 * Requerimientos ..: RF-38  (módulos: Información legal y ayuda)
 * Calidad (RNF) ...: RNF-02, RNF-09
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-04 Restablecer contraseña
 *                    CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-06 Registrar movimiento manual
 *                    CU-07 Cargar comprobante por imagen
 *                    CU-08 Desactivar movimiento
 *                    CU-09 Visualizar reportes y gráficos
 *                    CU-10 Filtrar historial de movimientos
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-12 Gestionar información de perfil
 *                    CU-13 Cerrar sesión
 *                    CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 *                    CU-17 Marcar y quitar ingreso constante
 *                    CU-18 Eliminar cuenta
 *                    CU-19 Contratar el Plan Pro
 *                    CU-20 Gestionar préstamos y recordatorios
 *                    CU-21 Exportar reportes a Excel y PDF
 *                    CU-22 Administrar la plataforma
 * Depende de ......: frontend/src/components/CookieBanner.jsx
 *                    frontend/src/components/DevLogger.jsx
 *                    frontend/src/components/ErrorBoundary.jsx
 *                    frontend/src/components/Footer.jsx
 *                    frontend/src/components/Navbar.jsx
 *                    frontend/src/components/ProtectedRoute.jsx
 *                    frontend/src/pages/AdminDashboardPage.jsx
 *                    frontend/src/pages/DashboardPage.jsx
 *                    frontend/src/pages/ForgotPasswordPage.jsx
 *                    frontend/src/pages/LandingPage.jsx
 *                    frontend/src/pages/LoginPage.jsx
 *                    frontend/src/pages/MovimientoFormPage.jsx
 *                    frontend/src/pages/NotFoundPage.jsx
 *                    frontend/src/pages/PlanificadorPage.jsx
 *                    frontend/src/pages/PrivacidadPage.jsx
 *                    frontend/src/pages/ProfilePage.jsx
 *                    frontend/src/pages/RecordatoriosPage.jsx
 *                    frontend/src/pages/RegisterPage.jsx
 *                    frontend/src/pages/ReportesPage.jsx
 *                    frontend/src/pages/ResetPasswordPage.jsx
 *                    frontend/src/pages/TerminosPage.jsx
 * Lo usan .........: frontend/src/index.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import MovimientoFormPage from "./pages/MovimientoFormPage";
import ReportesPage from "./pages/ReportesPage";
import PlanificadorPage from "./pages/PlanificadorPage";
import RecordatoriosPage from "./pages/RecordatoriosPage";
import TerminosPage from "./pages/TerminosPage";
import PrivacidadPage from "./pages/PrivacidadPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import DevLogger from "./components/DevLogger";
import ErrorBoundary from "./components/ErrorBoundary";

function MainRoutes() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isPortalAdmin = searchParams.get("portal") === "admin" || location.pathname === "/admin-portal-privado";

  if (isPortalAdmin) {
    return <AdminDashboardPage />;
  }

  return (
    <>
      <Navbar />
      <ErrorBoundary debug={process.env.NODE_ENV === "development"}>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movimiento"
            element={
              <ProtectedRoute>
                <MovimientoFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <ReportesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planificador"
            element={
              <ProtectedRoute>
                <PlanificadorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recordatorios"
            element={
              <ProtectedRoute>
                <RecordatoriosPage />
              </ProtectedRoute>
            }
          />
          <Route path="/terminos" element={<TerminosPage />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />
          <Route path="/admin-portal-privado" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
      <CookieBanner />
    </>
  );
}

function App() {
  return (
    <Router>
      <MainRoutes />
      <DevLogger />
    </Router>
  );
}

export default App;
