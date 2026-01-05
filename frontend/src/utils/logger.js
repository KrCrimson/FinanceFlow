// Sistema de logging para errores y debugging
class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logs = [];
    this.maxLogs = 1000; // Máximo de logs en memoria
  }

  // Log de errores (siempre se registra)
  error(message, error = null, context = {}) {
    const logEntry = {
      level: 'ERROR',
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : null,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.addToMemory(logEntry);
    
    // En desarrollo, mostrar en consola
    if (this.isDevelopment) {
      console.error('🔴 ERROR:', message, error, context);
    }

    // En producción, podrías enviar a un servicio de logging externo
    // this.sendToExternalService(logEntry);
  }

  // Log de advertencias (solo en desarrollo)
  warn(message, context = {}) {
    const logEntry = {
      level: 'WARN',
      message,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.addToMemory(logEntry);

    if (this.isDevelopment) {
      console.warn('🟡 WARNING:', message, context);
    }
  }

  // Log de información (solo en desarrollo)
  info(message, context = {}) {
    const logEntry = {
      level: 'INFO',
      message,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.addToMemory(logEntry);

    if (this.isDevelopment) {
      console.info('🔵 INFO:', message, context);
    }
  }

  // Log de debugging (solo en desarrollo)
  debug(message, data = null) {
    if (this.isDevelopment) {
      console.log('🟢 DEBUG:', message, data);
    }
  }

  // Agregar log a memoria
  addToMemory(logEntry) {
    this.logs.unshift(logEntry);
    
    // Mantener solo los últimos maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Guardar en localStorage para persistencia
    try {
      const logsToStore = this.logs.slice(0, 100); // Solo los últimos 100
      localStorage.setItem('app_logs', JSON.stringify(logsToStore));
    } catch (e) {
      // Si localStorage está lleno, limpiar logs antiguos
      localStorage.removeItem('app_logs');
    }
  }

  // Obtener logs de la sesión actual
  getLogs(level = null, limit = 50) {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }
    
    return filteredLogs.slice(0, limit);
  }

  // Limpiar logs
  clearLogs() {
    this.logs = [];
    localStorage.removeItem('app_logs');
  }

  // Obtener resumen de errores
  getErrorSummary() {
    const errors = this.logs.filter(log => log.level === 'ERROR');
    const groupedErrors = {};
    
    errors.forEach(error => {
      const key = error.message;
      if (!groupedErrors[key]) {
        groupedErrors[key] = {
          message: error.message,
          count: 0,
          firstOccurrence: error.timestamp,
          lastOccurrence: error.timestamp
        };
      }
      groupedErrors[key].count++;
      groupedErrors[key].lastOccurrence = error.timestamp;
    });

    return Object.values(groupedErrors).sort((a, b) => b.count - a.count);
  }

  // Funciones de utilidad para diferentes tipos de errores
  logApiError(endpoint, error, requestData = null) {
    this.error(`Error en API: ${endpoint}`, error, {
      type: 'API_ERROR',
      endpoint,
      requestData
    });
  }

  logUserAction(action, data = null) {
    this.info(`Acción de usuario: ${action}`, {
      type: 'USER_ACTION',
      action,
      data
    });
  }

  logComponentError(componentName, error, props = null) {
    this.error(`Error en componente: ${componentName}`, error, {
      type: 'COMPONENT_ERROR',
      componentName,
      props
    });
  }

  logNavigationError(route, error) {
    this.error(`Error de navegación: ${route}`, error, {
      type: 'NAVIGATION_ERROR',
      route
    });
  }

  // Método para enviar logs a servicio externo (para implementar en futuro)
  async sendToExternalService(logEntry) {
    // Aquí podrías integrar con servicios como:
    // - Sentry
    // - LogRocket
    // - Rollbar
    // - Tu propio endpoint de logging
    
    // Ejemplo básico:
    /*
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });
    } catch (e) {
      // Error enviando log - no hacer nada para evitar loop infinito
    }
    */
  }
}

// Crear instancia singleton
const logger = new Logger();

// Capturar errores no manejados
window.addEventListener('error', (event) => {
  logger.error('Error no capturado', event.error, {
    type: 'UNHANDLED_ERROR',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Capturar promesas rechazadas no manejadas
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Promesa rechazada no manejada', event.reason, {
    type: 'UNHANDLED_REJECTION'
  });
});

export default logger;