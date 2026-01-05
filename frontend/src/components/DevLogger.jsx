import React, { useState, useEffect } from 'react';
import logger from '../utils/logger';

function DevLogger() {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [isMinimized, setIsMinimized] = useState(false);

  // Solo mostrar en desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isDevelopment) return;

    // Combinación de teclas para activar/desactivar: Ctrl+Shift+L
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        setIsVisible(!isVisible);
        if (!isVisible) {
          refreshLogs();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isDevelopment]);

  const refreshLogs = () => {
    const allLogs = logger.getLogs(filter === 'ALL' ? null : filter, 100);
    setLogs(allLogs);
  };

  useEffect(() => {
    if (isVisible) {
      refreshLogs();
      // Actualizar logs cada 5 segundos
      const interval = setInterval(refreshLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible, filter]);

  if (!isDevelopment || !isVisible) {
    return null;
  }

  const getLogColor = (level) => {
    switch (level) {
      case 'ERROR': return 'text-red-600 bg-red-50';
      case 'WARN': return 'text-yellow-600 bg-yellow-50';
      case 'INFO': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'ERROR': return '🔴';
      case 'WARN': return '🟡';
      case 'INFO': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-300 ${
      isMinimized ? 'w-64 h-12' : 'w-96 h-96'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700">🔧 Dev Logger</span>
          <span className="ml-2 text-xs text-gray-500">({logs.length} logs)</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-500 hover:text-gray-700 text-xs p-1"
            title={isMinimized ? 'Expandir' : 'Minimizar'}
          >
            {isMinimized ? '⬆️' : '⬇️'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-xs p-1"
            title="Cerrar"
          >
            ❌
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Controls */}
          <div className="p-2 bg-gray-50 border-b border-gray-200">
            <div className="flex gap-2 text-xs">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-xs"
              >
                <option value="ALL">Todos</option>
                <option value="ERROR">Errores</option>
                <option value="WARN">Advertencias</option>
                <option value="INFO">Info</option>
              </select>
              <button
                onClick={refreshLogs}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                🔄 Refrescar
              </button>
              <button
                onClick={() => {
                  logger.clearLogs();
                  setLogs([]);
                }}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                🗑️ Limpiar
              </button>
            </div>
          </div>

          {/* Logs */}
          <div className="h-80 overflow-y-auto p-2 space-y-1">
            {logs.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No hay logs disponibles
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`text-xs p-2 rounded border-l-4 ${getLogColor(log.level)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span>{getLogIcon(log.level)}</span>
                        <span className="font-medium">{log.level}</span>
                        <span className="text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="mt-1">{log.message}</div>
                      {log.error && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-red-600">
                            Error Details
                          </summary>
                          <div className="mt-1 text-red-600 font-mono text-xs">
                            {log.error.stack || log.error.message}
                          </div>
                        </details>
                      )}
                      {log.context && Object.keys(log.context).length > 0 && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-blue-600">
                            Context
                          </summary>
                          <pre className="mt-1 text-blue-600 font-mono text-xs overflow-x-auto">
                            {JSON.stringify(log.context, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Instrucciones */}
      {!isVisible && isDevelopment && (
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white text-xs p-2 rounded opacity-75">
          Presiona Ctrl+Shift+L para ver logs de desarrollo
        </div>
      )}
    </div>
  );
}

export default DevLogger;