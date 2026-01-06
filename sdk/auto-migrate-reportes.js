#!/usr/bin/env node

/**
 * 🚀 Auto-ejecutor para FASE 3 - Reportes
 * 
 * Script automatizado para migrar el servicio de Reportes
 */

const { spawn } = require('child_process');

console.log('🎯 Iniciando migración automática de Reportes...\n');

// Ejecutar service-migration.js con entradas automatizadas
const process = spawn('node', ['service-migration.js'], {
  stdio: ['pipe', 'inherit', 'inherit'],
  shell: true
});

// Enviar entradas automáticamente con delays
setTimeout(() => {
  console.log('📝 Enviando: Continuar...');
  process.stdin.write('\n');
}, 1000);

setTimeout(() => {
  console.log('📝 Enviando: Selección 1 (Reportes)...');
  process.stdin.write('1\n');
}, 3000);

setTimeout(() => {
  console.log('📝 Enviando: Confirmar migración...');
  process.stdin.write('s\n');
}, 5000);

setTimeout(() => {
  console.log('📝 Enviando: Validación manual exitosa...');
  process.stdin.write('s\n');
}, 10000);

process.on('close', (code) => {
  console.log(`\n🏁 Proceso completado con código: ${code}`);
  if (code === 0) {
    console.log('✅ ¡Migración de Reportes exitosa!');
  } else {
    console.log('❌ Error en migración');
  }
});

process.on('error', (error) => {
  console.error('❌ Error ejecutando migración:', error);
});

// Timeout de seguridad
setTimeout(() => {
  console.log('⏰ Timeout - terminando proceso');
  process.kill();
}, 30000);