/**
 * 🔄 Wrapper ES6 para Movimientos - FASE 3
 * 
 * Este archivo redirige las llamadas al adaptador CommonJS
 * manteniendo la compatibilidad con ES6 modules del frontend.
 */

// Importar adaptador CommonJS usando dynamic import
let adapterInstance = null;

async function getAdapter() {
  if (!adapterInstance) {
    try {
      const adapter = await import('./movimientos-adapter.js');
      adapterInstance = adapter.default || adapter;
    } catch (error) {
      console.error('Error cargando adaptador Movimientos:', error);
      throw new Error('Adaptador Movimientos no disponible');
    }
  }
  return adapterInstance;
}

// Exportar métodos principales

export async function getMovimientos(...args) {
  const adapter = await getAdapter();
  return adapter.getMovimientos(...args);
}

export async function createMovimiento(...args) {
  const adapter = await getAdapter();
  return adapter.createMovimiento(...args);
}

export async function updateMovimiento(...args) {
  const adapter = await getAdapter();
  return adapter.updateMovimiento(...args);
}

export async function inhabilitarMovimiento(...args) {
  const adapter = await getAdapter();
  return adapter.inhabilitarMovimiento(...args);
}

// Exportar métodos adicionales si están disponibles
export async function updateToken(token) {
  try {
    const adapter = await getAdapter();
    if (adapter.updateToken) {
      return adapter.updateToken(token);
    }
  } catch (error) {
    console.warn('updateToken no disponible en adaptador Movimientos');
  }
}

export async function getAdapterStats() {
  try {
    const adapter = await getAdapter();
    if (adapter.getAdapterStats) {
      return adapter.getAdapterStats();
    }
  } catch (error) {
    console.warn('getAdapterStats no disponible en adaptador Movimientos');
  }
}
