/**
 * 🔄 Wrapper ES6 para Movimientos - FASE 3
 * 
 * Este archivo redirige las llamadas al adaptador CommonJS
 * manteniendo la compatibilidad con ES6 modules del frontend.
 */

// Import estático directo del adaptador
import movimientosAdapter from './movimientos-adapter.js';

// Exportar métodos principales directamente
export async function getMovimientos(...args) {
  try {
    return await movimientosAdapter.getMovimientos(...args);
  } catch (error) {
    console.error('Error en getMovimientos:', error);
    throw error;
  }
}

export async function createMovimiento(...args) {
  try {
    return await movimientosAdapter.createMovimiento(...args);
  } catch (error) {
    console.error('Error en createMovimiento:', error);
    throw error;
  }
}

export async function updateMovimiento(...args) {
  try {
    return await movimientosAdapter.updateMovimiento(...args);
  } catch (error) {
    console.error('Error en updateMovimiento:', error);
    throw error;
  }
}

export async function inhabilitarMovimiento(...args) {
  try {
    return await movimientosAdapter.inhabilitarMovimiento(...args);
  } catch (error) {
    console.error('Error en inhabilitarMovimiento:', error);
    throw error;
  }
}

// Métodos adicionales
export async function getMovimientoById(...args) {
  try {
    return await movimientosAdapter.getMovimientoById(...args);
  } catch (error) {
    console.error('Error en getMovimientoById:', error);
    throw error;
  }
}

export async function getIngresos(...args) {
  try {
    return await movimientosAdapter.getIngresos(...args);
  } catch (error) {
    console.error('Error en getIngresos:', error);
    throw error;
  }
}

export async function getEgresos(...args) {
  try {
    return await movimientosAdapter.getEgresos(...args);
  } catch (error) {
    console.error('Error en getEgresos:', error);
    throw error;
  }
}

export async function getResumen(...args) {
  try {
    return await movimientosAdapter.getResumen(...args);
  } catch (error) {
    console.error('Error en getResumen:', error);
    throw error;
  }
}

// Exportar métodos de control
export async function updateToken(token) {
  try {
    return movimientosAdapter.updateToken(token);
  } catch (error) {
    console.warn('updateToken no disponible en adaptador Movimientos');
  }
}

export async function getAdapterStats() {
  try {
    return movimientosAdapter.getAdapterStats();
  } catch (error) {
    console.warn('getAdapterStats no disponible en adaptador Movimientos');
  }
}
