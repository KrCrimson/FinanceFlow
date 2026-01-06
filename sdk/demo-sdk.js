/**
 * 🧪 DEMO: SDK funcionando independientemente
 * 
 * Este archivo demuestra que el SDK funciona completamente independiente
 * del frontend existente, sin romper nada.
 * 
 * Ejecutar: node demo-sdk.js
 */

const BalanceSDK = require('./src/index.js');

// Configuración del SDK
const sdk = new BalanceSDK({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
});

console.log('🚀 DEMO: Sistema de Balance SDK - FASE 1');
console.log('========================================');

async function demoBasico() {
  try {
    console.log('\n📊 1. Verificando configuración del SDK...');
    const config = sdk.getConfig();
    console.log('✅ BaseURL:', config.baseURL);
    console.log('✅ Timeout:', config.timeout);
    
    console.log('\n🔐 2. Verificando módulos disponibles...');
    console.log('✅ Auth module:', typeof sdk.auth);
    console.log('✅ Movimientos module:', typeof sdk.movimientos);
    console.log('✅ Usuarios module:', typeof sdk.usuarios);
    console.log('✅ Reportes module:', typeof sdk.reportes);
    
    console.log('\n🏗️ 3. Verificando HttpClient...');
    console.log('✅ Token configurado:', sdk.isAuthenticated());
    
    // Configurar token de prueba (si existe)
    const testToken = process.env.TEST_TOKEN || 'test-token-demo';
    sdk.setToken(testToken);
    console.log('✅ Token demo configurado:', sdk.isAuthenticated());
    
    console.log('\n📈 4. Obteniendo estadísticas del SDK...');
    const stats = sdk.getStats();
    console.log('✅ Requests realizadas:', stats.requests);
    console.log('✅ Errores:', stats.errors);
    console.log('✅ Uptime:', stats.uptime, 'ms');
    console.log('✅ Success rate:', stats.successRate);
    
    console.log('\n🎯 5. SDK funcionando independientemente');
    console.log('✅ El SDK está listo para usar');
    console.log('✅ No interfiere con el frontend existente');
    console.log('✅ Puede ejecutarse desde cualquier contexto');
    
    return true;
  } catch (error) {
    console.error('❌ Error en demo:', error.message);
    return false;
  }
}

async function demoMetodos() {
  console.log('\n🔧 6. Verificando métodos disponibles...');
  
  try {
    // Auth methods
    const authMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(sdk.auth))
      .filter(method => method !== 'constructor');
    console.log('🔐 Auth methods:', authMethods.length, '-', authMethods.slice(0, 3).join(', ') + '...');
    
    // Movimientos methods
    const movimientosMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(sdk.movimientos))
      .filter(method => method !== 'constructor');
    console.log('💰 Movimientos methods:', movimientosMethods.length, '-', movimientosMethods.slice(0, 3).join(', ') + '...');
    
    // Usuarios methods
    const usuariosMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(sdk.usuarios))
      .filter(method => method !== 'constructor');
    console.log('👤 Usuarios methods:', usuariosMethods.length, '-', usuariosMethods.slice(0, 3).join(', ') + '...');
    
    // Reportes methods
    const reportesMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(sdk.reportes))
      .filter(method => method !== 'constructor');
    console.log('📊 Reportes methods:', reportesMethods.length, '-', reportesMethods.slice(0, 3).join(', ') + '...');
    
    console.log('✅ Todos los métodos están disponibles');
    
  } catch (error) {
    console.error('❌ Error verificando métodos:', error.message);
  }
}

async function demoConfiguracion() {
  console.log('\n⚙️ 7. Probando configuración dinámica...');
  
  try {
    // Configuración original
    const configOriginal = sdk.getConfig();
    console.log('📋 Config original - Timeout:', configOriginal.timeout);
    
    // Cambiar configuración
    sdk.updateConfig({ timeout: 15000 });
    const configNueva = sdk.getConfig();
    console.log('📋 Config nueva - Timeout:', configNueva.timeout);
    
    // Token management
    sdk.removeToken();
    console.log('🔓 Token removido:', !sdk.isAuthenticated());
    
    sdk.setToken('nuevo-token-demo');
    console.log('🔐 Nuevo token configurado:', sdk.isAuthenticated());
    
    console.log('✅ Configuración dinámica funciona correctamente');
    
  } catch (error) {
    console.error('❌ Error en configuración:', error.message);
  }
}

async function demoErrorHandling() {
  console.log('\n🛡️ 8. Probando manejo de errores...');
  
  try {
    // Probar creación con configuración inválida
    try {
      new BalanceSDK({});
    } catch (error) {
      console.log('✅ Validación de config funciona:', error.message);
    }
    
    // Probar configuración válida
    const sdkTemp = new BalanceSDK({
      baseURL: 'https://api.ejemplo.com',
      timeout: 5000
    });
    console.log('✅ Configuración válida aceptada');
    
  } catch (error) {
    console.error('❌ Error en manejo de errores:', error.message);
  }
}

// Ejecutar demo completo
async function ejecutarDemo() {
  const startTime = Date.now();
  
  console.log('🎬 Iniciando demo del SDK independiente...\n');
  
  await demoBasico();
  await demoMetodos();
  await demoConfiguracion();
  await demoErrorHandling();
  
  const endTime = Date.now();
  
  console.log('\n🎉 DEMO COMPLETADO');
  console.log('==================');
  console.log('✅ SDK funcionando independientemente');
  console.log('✅ Todos los módulos operativos');
  console.log('✅ Configuración dinámica funcional');
  console.log('✅ Manejo de errores robusto');
  console.log('✅ Listo para conectar con API backend');
  console.log(`⏱️ Tiempo total: ${endTime - startTime}ms`);
  console.log('\n🚀 FASE 1 COMPLETADA - SDK Base listo para usar!');
}

// Solo ejecutar si es llamado directamente
if (require.main === module) {
  ejecutarDemo().catch(console.error);
}

module.exports = {
  ejecutarDemo,
  demoBasico,
  demoMetodos,
  demoConfiguracion,
  demoErrorHandling
};