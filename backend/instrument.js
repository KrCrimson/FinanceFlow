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
