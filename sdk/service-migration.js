#!/usr/bin/env node

/**
 * 🎯 FASE 3: Migración Real de Imports por Servicios
 * 
 * Script para migrar servicios uno a la vez cambiando los imports reales
 * en el frontend, reemplazando servicios originales con adaptadores.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class ServiceMigration {
  constructor() {
    // Detectar rutas del proyecto
    const currentDir = process.cwd();
    if (currentDir.endsWith('sdk')) {
      this.projectRoot = path.dirname(currentDir);
      this.sdkRoot = currentDir;
    } else {
      this.projectRoot = currentDir;
      this.sdkRoot = path.join(currentDir, 'sdk');
    }
    
    this.frontendPath = path.join(this.projectRoot, 'frontend/src');
    this.servicesPath = path.join(this.frontendPath, 'services');
    this.componentsPath = path.join(this.frontendPath, 'components');
    this.pagesPath = path.join(this.frontendPath, 'pages');
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Servicios a migrar con detalles de archivos
    this.services = [
      {
        id: 'reportes',
        name: 'Reportes',
        description: 'Generación de reportes financieros',
        originalFile: 'reportesService.js',
        adapterFile: 'reportes-adapter.js',
        priority: 1,
        riskLevel: 'BAJO',
        affectedFiles: [
          'pages/ReportesPage.jsx',
          'components/ReporteComponent.jsx'
        ],
        imports: [
          'getReportes'
        ]
      },
      {
        id: 'movimientos',
        name: 'Movimientos', 
        description: 'Gestión de ingresos y egresos',
        originalFile: 'movimientosService.js',
        adapterFile: 'movimientos-adapter.js',
        priority: 2,
        riskLevel: 'MEDIO',
        affectedFiles: [
          'pages/DashboardPage.jsx',
          'pages/MovimientoFormPage.jsx', 
          'pages/IngresosPage.jsx',
          'pages/EgresosPage.jsx',
          'components/MovimientosList.jsx'
        ],
        imports: [
          'getMovimientos',
          'createMovimiento', 
          'updateMovimiento',
          'inhabilitarMovimiento'
        ]
      },
      {
        id: 'usuarios',
        name: 'Usuarios',
        description: 'Perfil y gestión de usuarios',
        originalFile: 'userService.js',
        adapterFile: 'usuarios-adapter.js', 
        priority: 3,
        riskLevel: 'MEDIO',
        affectedFiles: [
          'pages/ProfilePage.jsx',
          'components/UserProfile.jsx'
        ],
        imports: [
          'getProfile',
          'updateProfile'
        ]
      },
      {
        id: 'auth',
        name: 'Autenticación',
        description: 'Login, registro y gestión de sesiones',
        originalFile: 'authService.js',
        adapterFile: 'auth-adapter.js',
        priority: 4,
        riskLevel: 'ALTO',
        affectedFiles: [
          'pages/LoginPage.jsx',
          'pages/RegisterPage.jsx',
          'components/ProtectedRoute.jsx',
          'hooks/useAuth.js'
        ],
        imports: [
          'login',
          'register', 
          'logout',
          'getToken',
          'isTokenValid',
          'onAuthChange'
        ]
      }
    ];
    
    this.migrationState = this.loadMigrationState();
  }

  /**
   * Cargar estado actual
   */
  loadMigrationState() {
    try {
      const configPath = path.join(this.servicesPath, 'migration-phase3.json');
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    } catch (error) {
      this.log('Creando nuevo estado para FASE 3', 'info');
    }
    
    return {
      phase: 3,
      startTime: new Date().toISOString(),
      services: {},
      backups: {},
      currentService: null
    };
  }

  /**
   * Guardar estado
   */
  saveMigrationState() {
    try {
      const configPath = path.join(this.servicesPath, 'migration-phase3.json');
      this.migrationState.lastUpdate = new Date().toISOString();
      fs.writeFileSync(configPath, JSON.stringify(this.migrationState, null, 2));
    } catch (error) {
      console.error('❌ Error guardando estado:', error.message);
    }
  }

  /**
   * Logging
   */
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    }[level] || 'ℹ️';
    
    console.log(`[${timestamp.split('T')[1].split('.')[0]}] ${prefix} [FASE3] ${message}`);
  }

  /**
   * Punto de entrada principal
   */
  async run() {
    console.log('🚀 Iniciando FASE 3: Migración Real de Imports\n');
    
    try {
      await this.showWelcome();
      await this.checkPrerequisites();
      await this.showCurrentStatus();
      await this.selectMigrationTarget();
      await this.executeMigration();
      await this.showFinalResults();
    } catch (error) {
      console.error('❌ Error durante FASE 3:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Mostrar bienvenida
   */
  async showWelcome() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                      FASE 3 - FINAL                         ║
║               Migración Real de Imports                      ║
╠══════════════════════════════════════════════════════════════╣
║  🎯 Objetivo: Cambiar imports reales en el frontend         ║
║  🔄 Estrategia: Servicio por servicio, menos riesgo primero ║
║  📋 Proceso:                                                 ║
║    • Respaldar archivos originales                          ║
║    • Cambiar imports en componentes                         ║
║    • Reemplazar servicio original con adaptador             ║
║    • Validar funcionamiento                                  ║
║    • Rollback automático si hay problemas                   ║
╚══════════════════════════════════════════════════════════════╝
`);
    
    await this.waitForUser('Presiona Enter para continuar...');
  }

  /**
   * Verificar prerequisitos
   */
  async checkPrerequisites() {
    console.log('🔍 Verificando prerequisitos para FASE 3...\n');
    
    const checks = [
      {
        name: 'FASE 2 completada',
        check: () => this.checkPhase2Completed(),
        fix: 'Ejecuta component-migration.js primero'
      },
      {
        name: 'Adaptadores funcionando',
        check: () => this.checkAdaptersWorking(),
        fix: 'Verifica que los adaptadores estén habilitados'
      },
      {
        name: 'Respaldos disponibles',
        check: () => fs.existsSync(path.join(this.servicesPath, 'backup')),
        fix: 'Los respaldos son necesarios para rollback'
      },
      {
        name: 'Frontend operativo',
        check: () => this.checkFrontendFiles(),
        fix: 'Verifica archivos de componentes y páginas'
      }
    ];

    for (const check of checks) {
      process.stdout.write(`  ${check.name}... `);
      
      try {
        const result = await check.check();
        if (result) {
          console.log('✅');
        } else {
          console.log('❌');
          console.log(`    Solución: ${check.fix}`);
          process.exit(1);
        }
      } catch (error) {
        console.log('❌');
        console.log(`    Error: ${error.message}`);
        process.exit(1);
      }
    }
    
    console.log('\n✅ Todos los prerequisitos cumplidos\n');
  }

  /**
   * Verificar FASE 2 completada
   */
  checkPhase2Completed() {
    try {
      const configPath = path.join(this.servicesPath, 'migration-config.json');
      if (!fs.existsSync(configPath)) return false;
      
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const flags = config.migration?.featureFlags || {};
      
      // Verificar que todos los servicios estén migrados en FASE 2
      return ['sdk-movimientos', 'sdk-auth', 'sdk-usuarios', 'sdk-reportes']
        .every(flag => flags[flag]);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verificar adaptadores funcionando
   */
  checkAdaptersWorking() {
    return this.services.every(service => {
      const adapterPath = path.join(this.servicesPath, service.adapterFile);
      return fs.existsSync(adapterPath);
    });
  }

  /**
   * Verificar archivos frontend
   */
  checkFrontendFiles() {
    return fs.existsSync(this.componentsPath) && 
           fs.existsSync(this.pagesPath);
  }

  /**
   * Mostrar estado actual
   */
  async showCurrentStatus() {
    console.log('📊 Estado actual FASE 3:\n');
    
    const statusTable = this.services.map(service => {
      const isMigrated = this.migrationState.services[service.id]?.completed || false;
      const status = isMigrated ? '🟢 Migrado' : '🔵 Pendiente';
      const risk = this.getRiskColor(service.riskLevel);
      
      return `  ${service.name.padEnd(15)} │ ${status.padEnd(12)} │ ${risk} │ Prioridad ${service.priority}`;
    });

    console.log('  Servicio       │ Estado       │ Riesgo │ Info');
    console.log('  ──────────────────────────────────────────────────────');
    statusTable.forEach(row => console.log(row));
    
    const progress = this.calculateProgress();
    console.log(`\n  📈 Progreso FASE 3: ${progress}% completado`);
    console.log(`  🎯 Servicio actual: ${this.migrationState.currentService || 'Ninguno'}`);
    console.log();
  }

  /**
   * Obtener color de riesgo
   */
  getRiskColor(risk) {
    const colors = {
      'BAJO': '🟢 BAJO',
      'MEDIO': '🟡 MEDIO', 
      'ALTO': '🔴 ALTO'
    };
    return colors[risk] || '⚪ N/A';
  }

  /**
   * Calcular progreso
   */
  calculateProgress() {
    const completedCount = this.services.filter(service => 
      this.migrationState.services[service.id]?.completed
    ).length;
    
    return Math.round((completedCount / this.services.length) * 100);
  }

  /**
   * Seleccionar servicio a migrar
   */
  async selectMigrationTarget() {
    console.log('🎯 Servicios disponibles para migración (orden recomendado):\n');
    
    const pendingServices = this.services
      .filter(s => !this.migrationState.services[s.id]?.completed)
      .sort((a, b) => a.priority - b.priority);
    
    if (pendingServices.length === 0) {
      console.log('🎉 ¡Todos los servicios ya están migrados!');
      return;
    }
    
    pendingServices.forEach((service, index) => {
      const riskColor = this.getRiskColor(service.riskLevel);
      console.log(`  ${index + 1}. ${service.name} (${riskColor})`);
      console.log(`     📝 ${service.description}`);
      console.log(`     📁 Archivos: ${service.affectedFiles.length}`);
      console.log(`     🔧 Imports: ${service.imports.join(', ')}`);
      console.log();
    });
    
    // Recomendar el primero por prioridad
    const recommended = pendingServices[0];
    console.log(`💡 Recomendado: ${recommended.name} (${recommended.riskLevel} riesgo)\n`);
    
    const choice = await this.askUser(`Selecciona servicio (1-${pendingServices.length}) o Enter para recomendado: `);
    
    if (choice.trim() === '') {
      this.selectedService = recommended;
    } else {
      const serviceIndex = parseInt(choice) - 1;
      if (serviceIndex >= 0 && serviceIndex < pendingServices.length) {
        this.selectedService = pendingServices[serviceIndex];
      } else {
        console.log('❌ Selección inválida');
        await this.selectMigrationTarget();
        return;
      }
    }
    
    await this.confirmMigration();
  }

  /**
   * Confirmar migración
   */
  async confirmMigration() {
    const service = this.selectedService;
    
    console.log(`\n📋 Resumen de migración seleccionada:`);
    console.log(`   🎯 Servicio: ${service.name}`);
    console.log(`   ⚠️ Riesgo: ${service.riskLevel}`);
    console.log(`   📁 Archivos afectados: ${service.affectedFiles.length}`);
    console.log(`   🔧 Imports a cambiar: ${service.imports.length}`);
    console.log(`\n📝 Proceso que se ejecutará:`);
    console.log(`   1. Respaldar archivos originales`);
    console.log(`   2. Analizar imports en ${service.affectedFiles.length} archivos`);
    console.log(`   3. Cambiar imports del servicio original al adaptador`);
    console.log(`   4. Reemplazar ${service.originalFile} con ${service.adapterFile}`);
    console.log(`   5. Validar funcionamiento`);
    console.log(`   6. Rollback automático si hay errores\n`);
    
    const confirm = await this.askUser('¿Proceder con esta migración? (s/n): ');
    
    if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'sí') {
      console.log('⏭️ Migración cancelada');
      await this.selectMigrationTarget();
    }
  }

  /**
   * Ejecutar migración
   */
  async executeMigration() {
    if (!this.selectedService) {
      console.log('ℹ️ No hay servicio seleccionado para migrar');
      return;
    }

    const service = this.selectedService;
    console.log(`\n🔄 Iniciando migración de ${service.name}...\n`);
    
    this.migrationState.currentService = service.id;
    this.saveMigrationState();

    try {
      // Paso 1: Respaldar archivos
      await this.backupFiles(service);
      
      // Paso 2: Analizar archivos afectados
      const affectedFiles = await this.analyzeAffectedFiles(service);
      
      // Paso 3: Cambiar imports
      await this.updateImports(service, affectedFiles);
      
      // Paso 4: Reemplazar servicio original
      await this.replaceOriginalService(service);
      
      // Paso 5: Validar migración
      await this.validateMigration(service);
      
      // Paso 6: Marcar como completado
      this.migrationState.services[service.id] = {
        completed: true,
        timestamp: new Date().toISOString(),
        filesChanged: affectedFiles.length,
        importsChanged: service.imports.length
      };
      
      this.migrationState.currentService = null;
      this.saveMigrationState();
      
      console.log(`\n🎉 ¡Migración de ${service.name} completada exitosamente!\n`);
      
    } catch (error) {
      console.error(`\n❌ Error en migración de ${service.name}: ${error.message}`);
      await this.rollbackService(service);
      throw error;
    }
  }

  /**
   * Respaldar archivos
   */
  async backupFiles(service) {
    console.log('📦 Respaldando archivos...');
    
    const backupDir = path.join(this.servicesPath, 'phase3-backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Respaldar servicio original
    const originalPath = path.join(this.servicesPath, service.originalFile);
    if (fs.existsSync(originalPath)) {
      const backupPath = path.join(backupDir, `${service.originalFile}.backup`);
      fs.copyFileSync(originalPath, backupPath);
      this.log(`Respaldado ${service.originalFile}`, 'success');
    }

    // Respaldar archivos afectados que existen
    for (const file of service.affectedFiles) {
      const filePath = path.join(this.frontendPath, file);
      if (fs.existsSync(filePath)) {
        const backupPath = path.join(backupDir, `${file.replace('/', '_')}.backup`);
        fs.copyFileSync(filePath, backupPath);
        this.log(`Respaldado ${file}`, 'info');
      }
    }

    console.log('✅ Respaldos completados\n');
  }

  /**
   * Analizar archivos afectados
   */
  async analyzeAffectedFiles(service) {
    console.log('🔍 Analizando archivos afectados...');
    
    const actualFiles = [];
    
    for (const file of service.affectedFiles) {
      const filePath = path.join(this.frontendPath, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar si el archivo contiene imports del servicio
        const hasImports = service.imports.some(importName => 
          content.includes(importName) && content.includes(service.originalFile)
        );
        
        if (hasImports) {
          actualFiles.push({ path: filePath, relativePath: file });
          this.log(`Encontrado: ${file}`, 'info');
        }
      }
    }

    console.log(`✅ Análisis completado: ${actualFiles.length} archivos requieren cambios\n`);
    return actualFiles;
  }

  /**
   * Actualizar imports
   */
  async updateImports(service, affectedFiles) {
    console.log('🔄 Actualizando imports...');
    
    for (const file of affectedFiles) {
      let content = fs.readFileSync(file.path, 'utf8');
      let changed = false;
      
      // Cambiar import del servicio original al adaptador
      const oldImportRegex = new RegExp(
        `from\\s+['"]\\.\\/.*${service.originalFile.replace('.js', '')}['"]`,
        'g'
      );
      
      if (content.match(oldImportRegex)) {
        content = content.replace(
          oldImportRegex,
          `from './${service.adapterFile.replace('.js', '')}'`
        );
        changed = true;
      }

      // También buscar imports relativos desde diferentes directorios
      const relativeImportRegex = new RegExp(
        `from\\s+['"][./]*services/${service.originalFile.replace('.js', '')}['"]`,
        'g'
      );
      
      if (content.match(relativeImportRegex)) {
        content = content.replace(
          relativeImportRegex,
          `from '../services/${service.adapterFile.replace('.js', '')}'`
        );
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(file.path, content);
        this.log(`Actualizado: ${file.relativePath}`, 'success');
      }
    }

    console.log('✅ Imports actualizados\n');
  }

  /**
   * Reemplazar servicio original
   */
  async replaceOriginalService(service) {
    console.log('🔄 Configurando redirección de servicio...');
    
    // En lugar de reemplazar el archivo, vamos a crear un wrapper que redirija al adaptador
    const originalPath = path.join(this.servicesPath, service.originalFile);
    const adapterPath = path.join(this.servicesPath, service.adapterFile);
    
    if (fs.existsSync(originalPath) && fs.existsSync(adapterPath)) {
      // Renombrar original a .old
      const oldPath = path.join(this.servicesPath, `${service.originalFile}.old`);
      fs.renameSync(originalPath, oldPath);
      
      // Crear wrapper ES6 que importe el adaptador CommonJS
      const wrapperContent = this.createES6Wrapper(service);
      fs.writeFileSync(originalPath, wrapperContent);
      
      this.log(`${service.originalFile} reemplazado con wrapper ES6`, 'success');
    }

    console.log('✅ Servicio configurado\n');
  }

  /**
   * Crear wrapper ES6 compatible
   */
  createES6Wrapper(service) {
    const adapterName = service.adapterFile.replace('.js', '');
    
    return `/**
 * 🔄 Wrapper ES6 para ${service.name} - FASE 3
 * 
 * Este archivo redirige las llamadas al adaptador CommonJS
 * manteniendo la compatibilidad con ES6 modules del frontend.
 */

// Importar adaptador CommonJS usando dynamic import
let adapterInstance = null;

async function getAdapter() {
  if (!adapterInstance) {
    try {
      const adapter = await import('./${adapterName}.js');
      adapterInstance = adapter.default || adapter;
    } catch (error) {
      console.error('Error cargando adaptador ${service.name}:', error);
      throw new Error('Adaptador ${service.name} no disponible');
    }
  }
  return adapterInstance;
}

// Exportar métodos principales
${service.imports.map(methodName => `
export async function ${methodName}(...args) {
  const adapter = await getAdapter();
  return adapter.${methodName}(...args);
}`).join('\n')}

// Exportar métodos adicionales si están disponibles
export async function updateToken(token) {
  try {
    const adapter = await getAdapter();
    if (adapter.updateToken) {
      return adapter.updateToken(token);
    }
  } catch (error) {
    console.warn('updateToken no disponible en adaptador ${service.name}');
  }
}

export async function getAdapterStats() {
  try {
    const adapter = await getAdapter();
    if (adapter.getAdapterStats) {
      return adapter.getAdapterStats();
    }
  } catch (error) {
    console.warn('getAdapterStats no disponible en adaptador ${service.name}');
  }
}
`;
  }

  /**
   * Validar migración
   */
  async validateMigration(service) {
    console.log('🧪 Validando migración...');
    
    // Verificar que el wrapper ES6 se puede cargar
    const originalPath = path.join(this.servicesPath, service.originalFile);
    if (fs.existsSync(originalPath)) {
      const content = fs.readFileSync(originalPath, 'utf8');
      
      // Verificar sintaxis básica del wrapper
      if (!content.includes('export async function') || !content.includes('getAdapter')) {
        throw new Error('El wrapper ES6 no tiene la estructura esperada');
      }
      
      // Verificar que el adaptador CommonJS existe
      const adapterPath = path.join(this.servicesPath, service.adapterFile);
      if (!fs.existsSync(adapterPath)) {
        throw new Error(`Adaptador ${service.adapterFile} no encontrado`);
      }
      
      this.log('Estructura del wrapper ES6 OK', 'success');
      this.log('Adaptador CommonJS disponible', 'success');
    }

    console.log('✅ Validación técnica completada\n');
    
    // Solicitar validación manual
    console.log('🎮 Validación manual requerida:');
    console.log('  1. Abre el frontend en el navegador');
    console.log('  2. Navega a las secciones que usan este servicio');
    console.log('  3. Verifica que todo funciona correctamente');
    console.log('  4. Revisa la consola por errores');
    console.log('  5. El sistema ahora usa el SDK a través del adaptador\n');
    
    const manualTest = await this.askUser('¿La validación manual fue exitosa? (s/n): ');
    
    if (manualTest.toLowerCase() !== 's' && manualTest.toLowerCase() !== 'sí') {
      throw new Error('Validación manual falló');
    }
  }

  /**
   * Rollback de servicio
   */
  async rollbackService(service) {
    console.log(`\n🔄 Ejecutando rollback para ${service.name}...`);
    
    try {
      const backupDir = path.join(this.servicesPath, 'phase3-backup');
      
      // Restaurar servicio original
      const originalBackup = path.join(backupDir, `${service.originalFile}.backup`);
      const originalPath = path.join(this.servicesPath, service.originalFile);
      
      if (fs.existsSync(originalBackup)) {
        fs.copyFileSync(originalBackup, originalPath);
        this.log(`Restaurado ${service.originalFile}`, 'success');
      }

      // Restaurar archivos afectados
      for (const file of service.affectedFiles) {
        const backupPath = path.join(backupDir, `${file.replace('/', '_')}.backup`);
        const filePath = path.join(this.frontendPath, file);
        
        if (fs.existsSync(backupPath)) {
          fs.copyFileSync(backupPath, filePath);
          this.log(`Restaurado ${file}`, 'info');
        }
      }

      console.log('✅ Rollback completado');
      
    } catch (error) {
      console.error('❌ Error durante rollback:', error.message);
    }
  }

  /**
   * Mostrar resultados finales
   */
  async showFinalResults() {
    const progress = this.calculateProgress();
    
    console.log('\n🎉 Sesión FASE 3 completada!\n');
    console.log(`📊 Progreso actual: ${progress}% de servicios migrados`);
    
    const completed = this.services.filter(s => this.migrationState.services[s.id]?.completed);
    const pending = this.services.filter(s => !this.migrationState.services[s.id]?.completed);
    
    if (completed.length > 0) {
      console.log('\n✅ Servicios completamente migrados:');
      completed.forEach(service => {
        const info = this.migrationState.services[service.id];
        console.log(`   • ${service.name} (${info.filesChanged} archivos, ${info.importsChanged} imports)`);
      });
    }
    
    if (pending.length > 0) {
      console.log('\n⏳ Servicios pendientes:');
      pending.forEach(service => {
        console.log(`   • ${service.name} (${service.riskLevel})`);
      });
    }
    
    console.log('\n📋 Estado final:');
    if (progress === 100) {
      console.log('   🎯 ¡MIGRACIÓN COMPLETA! Todos los servicios usan adaptadores');
      console.log('   📊 El frontend ahora usa 100% el SDK a través de adaptadores');
      console.log('   🔧 Los servicios originales han sido reemplazados');
      console.log('   📚 Respaldos disponibles en services/phase3-backup/');
    } else {
      console.log(`   🚀 Continuar migración: ejecutar nuevamente para próximo servicio`);
      console.log(`   📊 Progreso actual: ${completed.length}/${this.services.length} servicios`);
    }
    
    console.log('\n📚 Recursos:');
    console.log('   • Estado: frontend/src/services/migration-phase3.json');
    console.log('   • Respaldos: frontend/src/services/phase3-backup/');
    console.log('   • Rollback: Ejecutar script nuevamente y seleccionar rollback');
    
    if (progress === 100) {
      console.log('\n🏆 ¡FASE 3 COMPLETADA EXITOSAMENTE!');
    }
  }

  /**
   * Utilidades de interfaz
   */
  async askUser(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  async waitForUser(message) {
    return new Promise((resolve) => {
      this.rl.question(message, resolve);
    });
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const migration = new ServiceMigration();
  migration.run().catch(console.error);
}

module.exports = ServiceMigration;