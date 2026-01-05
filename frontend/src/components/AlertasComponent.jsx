import React from 'react';

function AlertasComponent({ alertas }) {
  if (!alertas || alertas.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <div className="flex items-center">
          <span className="text-2xl mr-3">✅</span>
          <div>
            <h3 className="font-semibold text-green-800">¡Todo bajo control!</h3>
            <p className="text-green-600 text-sm">Tus gastos están dentro de los patrones normales.</p>
          </div>
        </div>
      </div>
    );
  }

  const alertasAltas = alertas.filter(a => a.severidad === 'alta');
  const alertasMedias = alertas.filter(a => a.severidad === 'media');

  return (
    <div className="space-y-4 mb-6">
      {alertasAltas.map((alerta, index) => (
        <div key={index} className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-4 shadow-sm">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🚨</span>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">{alerta.mensaje}</h3>
              <p className="text-red-600 text-sm mb-2">{alerta.descripcion}</p>
              {alerta.porcentaje && (
                <div className="bg-red-100 px-3 py-1 rounded-full text-xs font-medium text-red-700 inline-block">
                  {alerta.porcentaje}% del promedio
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {alertasMedias.map((alerta, index) => (
        <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-4 shadow-sm">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-1">{alerta.mensaje}</h3>
              <p className="text-yellow-600 text-sm mb-2">{alerta.descripcion}</p>
              {alerta.porcentaje && (
                <div className="bg-yellow-100 px-3 py-1 rounded-full text-xs font-medium text-yellow-700 inline-block">
                  {alerta.porcentaje}% del promedio
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlertasComponent;