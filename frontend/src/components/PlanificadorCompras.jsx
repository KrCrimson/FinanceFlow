import React, { useState } from 'react';

function PlanificadorCompras({ resumenMensual, estadisticasPorCategoria, calcularTiempoParaCompra, obtenerSugerenciasAhorro }) {
  const [precioDeseado, setPrecioDeseado] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [resultado, setResultado] = useState(null);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  const handleCalcular = () => {
    if (!precioDeseado || precioDeseado <= 0) {
      setResultado({ error: 'Por favor ingresa un precio válido' });
      return;
    }

    const calculo = calcularTiempoParaCompra(Number(precioDeseado));
    setResultado({
      ...calculo,
      precio: Number(precioDeseado),
      producto: nombreProducto || 'Producto deseado'
    });
    setMostrarSugerencias(true);
  };

  const sugerenciasAhorro = obtenerSugerenciasAhorro();

  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-PE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <span className="text-3xl mr-3">🎯</span>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Planificador de Compras</h2>
          <p className="text-gray-600 text-sm">Calcula cuánto tiempo necesitas para comprar algo</p>
        </div>
      </div>

      {/* Formulario de entrada */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Qué quieres comprar? (opcional)
          </label>
          <input
            type="text"
            placeholder="Ej: Laptop nueva, Viaje a Cusco..."
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio (S/)
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={precioDeseado}
            onChange={(e) => setPrecioDeseado(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-6"
      >
        📊 Calcular Plan de Ahorro
      </button>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600">Ingresos Promedio</p>
          <p className="text-lg font-bold text-green-600">S/{resumenMensual.ingresoPromedio.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Gastos Promedio</p>
          <p className="text-lg font-bold text-red-600">S/{resumenMensual.gastoPromedio.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Ahorro Actual</p>
          <p className={`text-lg font-bold ${resumenMensual.ahorroPromedio >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            S/{resumenMensual.ahorroPromedio.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Resultado del cálculo */}
      {resultado && (
        <div className="border-t pt-6">
          {resultado.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              ❌ {resultado.error}
            </div>
          ) : (
            <div className={`rounded-lg p-6 ${resultado.esviable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start mb-4">
                <span className="text-3xl mr-3">{resultado.esviable ? '✅' : '❌'}</span>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    {resultado.producto} - S/{resultado.precio.toLocaleString()}
                  </h3>
                  <p className={`text-lg ${resultado.esviable ? 'text-green-700' : 'text-red-700'}`}>
                    {resultado.mensaje}
                  </p>
                </div>
              </div>

              {resultado.esviable ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Fecha estimada</p>
                      <p className="font-semibold text-green-700">{formatearFecha(resultado.fechaEstimada)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600">Ahorro mensual necesario</p>
                      <p className="font-semibold text-green-700">S/{resultado.ahorroMensualNecesario.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-gray-600">Consejo</p>
                    <p className="font-semibold text-green-700">{resultado.sugerencia}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Sugerencia</p>
                  <p className="font-semibold text-red-700">{resultado.sugerencia}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sugerencias de ahorro */}
      {mostrarSugerencias && sugerenciasAhorro.length > 0 && resultado && !resultado.error && (
        <div className="border-t pt-6 mt-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">
            💡 Sugerencias para ahorrar más rápido
          </h3>
          <div className="space-y-3">
            {sugerenciasAhorro.slice(0, 3).map((sugerencia, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-blue-800">{sugerencia.mensaje}</p>
                    <p className="text-sm text-blue-600">Categoría: {sugerencia.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-800">+S/{sugerencia.ahorroEstimado.toFixed(2)}</p>
                    <p className="text-xs text-blue-600">ahorro mensual</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {resultado.esviable && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💰 <strong>¡Con estas mejoras podrías comprar tu {resultado.producto.toLowerCase()} en menos tiempo!</strong>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PlanificadorCompras;