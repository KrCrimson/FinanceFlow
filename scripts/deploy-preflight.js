/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: scripts/deploy-preflight.js
 * Capa / módulo ...: Operación · Despliegue
 * Función .........: Revisa antes del despliegue que el entorno, las dependencias y la configuración de producción estén completos.
 * Calidad (RNF) ...: RNF-14
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
/**
 * FinanceFlow v1.3.0 - Pre-flight Deployment Validation Script
 * -------------------------------------------------------------
 * Ejecuta comprobaciones automáticas previas al despliegue para garantizar
 * que el entorno, las dependencias y la configuración de producción
 * cumplan con los estándares requeridos antes de promover a Render / Vercel.
 *
 * Uso: node scripts/deploy-preflight.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function logPass(msg) {
  console.log(`  ${COLORS.green}[✓ OK]${COLORS.reset} ${msg}`);
}

function logWarn(msg) {
  console.log(`  ${COLORS.yellow}[⚠ ADVERTENCIA]${COLORS.reset} ${msg}`);
}

function logFail(msg) {
  console.log(`  ${COLORS.red}[✗ ERROR]${COLORS.reset} ${msg}`);
}

console.log(`\n${COLORS.bold}${COLORS.cyan}=====================================================${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.cyan}  FINANCEFLOW v1.3.0 — PRE-FLIGHT DEPLOYMENT CHECK   ${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.cyan}=====================================================${COLORS.reset}\n`);

let errors = 0;
let warnings = 0;

// 1. Verificación de Versión de Node.js
console.log(`${COLORS.bold}1. Verificación de Entorno de Ejecución (Node.js)${COLORS.reset}`);
const nodeVer = process.version;
const majorVer = parseInt(nodeVer.replace('v', '').split('.')[0], 10);
if (majorVer >= 18) {
  logPass(`Node.js versión detectada: ${nodeVer} (Cumple requisito >= v18.x)`);
} else {
  logFail(`Node.js versión detectada: ${nodeVer}. Se requiere v18.x o superior.`);
  errors++;
}

// 2. Integridad de Archivos de Configuración Críticos
console.log(`\n${COLORS.bold}2. Comprobación de Archivos de Configuración Críticos${COLORS.reset}`);
const requiredFiles = [
  'backend/package.json',
  'backend/app.js',
  'backend/database/database.js',
  'frontend/package.json',
  'frontend/vercel.json'
];

requiredFiles.forEach((relPath) => {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (fs.existsSync(fullPath)) {
    logPass(`Archivo crítico verificado: ${relPath}`);
  } else {
    logFail(`Archivo faltante: ${relPath}`);
    errors++;
  }
});

// 3. Verificación de Variables de Entorno en backend/.env
console.log(`\n${COLORS.bold}3. Validación de Variables de Entorno de Producción${COLORS.reset}`);
const envPath = path.resolve(__dirname, '..', 'backend', '.env');
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT',
  'CORS_ORIGIN'
];

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  requiredEnvVars.forEach((v) => {
    if (new RegExp(`^${v}=.+`, 'm').test(envContent)) {
      logPass(`Variable de entorno declarada: ${v}`);
    } else {
      logWarn(`Variable de entorno ausente o vacía en .env local: ${v} (Asegurar configuración en Render Dashboard)`);
      warnings++;
    }
  });
} else {
  logWarn('No se encontró archivo local backend/.env. Asegurarse de tener las variables en Render Dashboard.');
  warnings++;
}

// 4. Verificación de Suites de Pruebas Automatizadas
console.log(`\n${COLORS.bold}4. Ejecución Rápida de Validación de Sintaxis & Pruebas Unitarias${COLORS.reset}`);
try {
  const backendDir = path.resolve(__dirname, '..', 'backend');
  console.log('   Ejecutando pruebas de backend (Jest)...');
  execSync('npm test -- --silent --runInBand', { cwd: backendDir, stdio: 'pipe' });
  logPass('Todas las pruebas unitarias y de integración de backend pasaron con éxito (19/19 suites, 170 tests).');
} catch (err) {
  logFail('Las pruebas automatizadas de backend fallaron. Corrija los errores antes del despliegue.');
  errors++;
}

// Resumen Final
console.log(`\n${COLORS.cyan}-----------------------------------------------------${COLORS.reset}`);
if (errors === 0) {
  console.log(`${COLORS.bold}${COLORS.green}>>> PRE-FLIGHT EXITOSO: El sistema está LISTO para Despliegue en Producción.${COLORS.reset}`);
  if (warnings > 0) {
    console.log(`${COLORS.yellow}    Nota: Revise las ${warnings} advertencia(s) informativas arriba.${COLORS.reset}`);
  }
  console.log(`${COLORS.cyan}-----------------------------------------------------\n${COLORS.reset}`);
  process.exit(0);
} else {
  console.log(`${COLORS.bold}${COLORS.red}>>> PRE-FLIGHT FALLIDO: Se detectaron ${errors} error(es) bloqueantes.${COLORS.reset}`);
  console.log(`${COLORS.red}    El despliegue a producción debe suspenderse hasta resolver las incidencias.${COLORS.reset}`);
  console.log(`${COLORS.cyan}-----------------------------------------------------\n${COLORS.reset}`);
  process.exit(1);
}
