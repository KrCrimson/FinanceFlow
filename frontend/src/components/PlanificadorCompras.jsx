import React, { useState } from 'react';

function PlanificadorCompras({ resumenMensual, movimientos, balanceTotal, onCrearEgreso }) {
  const [comprasPlanificadas, setComprasPlanificadas] = useState([
    { id: '1', item: 'Laptop Nueva', montoObjetivo: 3500 },
    { id: '2', item: 'Ram', montoObjetivo: 900 }
  ]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState('');

  const handleAgregarMeta = (e) => {
    e.preventDefault();
    const amount = parseFloat(nuevoMonto);
    if (!nuevoNombre.trim() || isNaN(amount) || amount <= 0) {
      alert('Por favor ingresa un nombre y un monto válido.');
      return;
    }

    setComprasPlanificadas([
      ...comprasPlanificadas,
      { id: Date.now().toString(), item: nuevoNombre.trim(), montoObjetivo: amount }
    ]);
    setNuevoNombre('');
    setNuevoMonto('');
    setMostrarModal(false);
  };

  const handleMarcarComprado = async (compra) => {
    if (window.confirm(`¿Deseas cerrar "${compra.item}" y registrar el egreso por S/${compra.montoObjetivo}?`)) {
      if (onCrearEgreso) {
        await onCrearEgreso({
          nombre: compra.item,
          monto: compra.montoObjetivo,
          tipo: 'egreso',
          categoria: 'Otros',
          descripcion: 'Compra finalizada desde el Planificador de Compras'
        });
      }
      setComprasPlanificadas(prev => prev.filter(c => c.id !== compra.id));
    }
  };

  const handleCancelarCompra = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de cancelar la planificación de "${nombre}"?`)) {
      setComprasPlanificadas(prev => prev.filter(c => c.id !== id));
    }
  };

  // CÁLCULO DINÁMICO DE METAS BASADO EN EL BALANCE REAL EN LA WEB
  let saldoDisponible = Math.max(0, balanceTotal || 0);
  const comprasConAvance = comprasPlanificadas.map((compra) => {
    const asignado = Math.min(saldoDisponible, compra.montoObjetivo);
    saldoDisponible = Math.max(0, saldoDisponible - asignado);
    const porcentaje = compra.montoObjetivo > 0 ? (asignado / compra.montoObjetivo) * 100 : 0;
    return {
      ...compra,
      montoAhorrado: asignado,
      porcentaje
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🛍️</span>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Planificador de Compras</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Gestiona y monitorea tus metas vinculadas a tu balance real</p>
          </div>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
        >
          <span>➕</span>
          <span>Nueva Meta</span>
        </button>
      </div>

      {/* Lista de Metas Planificadas */}
      <div className="space-y-4">
        {comprasConAvance.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-3xl">🛍️</span>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2">No tienes compras planificadas activas.</p>
          </div>
        ) : (
          comprasConAvance.map((compra) => (
            <div key={compra.id} className="p-4 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">{compra.item}</h3>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    S/ {compra.montoAhorrado.toLocaleString('es-PE', { minimumFractionDigits: 2 })} / S/ {compra.montoObjetivo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMarcarComprado(compra)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm flex items-center gap-1"
                  >
                    <span>🛒</span> Comprado
                  </button>
                  <button
                    onClick={() => handleCancelarCompra(compra.id, compra.item)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                    title="Cancelar Planificación"
                  >
                    ❌
                  </button>
                </div>
              </div>

              {/* Barra de Progreso */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${compra.porcentaje}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-xs text-gray-400">Avance según balance actual</span>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{compra.porcentaje.toFixed(0)}% Completado</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nueva Meta */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">🛍️ Nueva Meta de Compra</h3>
            <form onSubmit={handleAgregarMeta} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Producto o Meta</label>
                <input
                  type="text"
                  placeholder="Ej: Laptop Nueva"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Monto Objetivo (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1500.00"
                  value={nuevoMonto}
                  onChange={(e) => setNuevoMonto(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Añadir Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanificadorCompras;