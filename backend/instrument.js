/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/instrument.js
 * Capa / módulo ...: Backend · Observabilidad
 * Función .........: Inicia el monitoreo de errores y rendimiento (Sentry) cuando hay una clave configurada.
 * Requerimientos ..: RF-37  (módulos: Administración)
 * Calidad (RNF) ...: RNF-14
 * Casos de uso ....: CU-22 Administrar la plataforma
 * Reglas de negocio : RN-22
 * Lo usan .........: backend/app.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const Sentry = require("@sentry/node");

// Inicialización de Sentry para Observabilidad y Monitoreo en Tiempo Real
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    // Trazabilidad de rendimiento (20% en prod para no saturar, 100% en dev)
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
  });
  console.log("📡 [Sentry] Observabilidad y captura de errores en tiempo real activada.");
} else {
  console.log("ℹ️ [Sentry] SENTRY_DSN no configurado (modo sin telemetría remota).");
}
