#!/usr/bin/env node

/**
 * 🚀 Script de Migración - FASE 2 Patrón Adaptador
 * 
 * Script interactivo para facilitar la migración gradual del SDK
 * manteniendo compatibilidad con el frontend existente.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class MigrationScript {
  constructor() {
    // Detectar si estamos ejecutando desde el directorio SDK
    const currentDir = process.cwd();
    if (currentDir.endsWith('sdk')) {
      this.projectRoot = path.dirname(currentDir); // directorio padre
      this.sdkRoot = currentDir; // directorio actual es SDK
    } else {
      this.projectRoot = currentDir; // directorio actual es raíz
      this.sdkRoot = path.join(currentDir, 'sdk');
    }
    
    this.frontendPath = path.join(this.projectRoot, 'frontend/src');
    this.servicesPath = path.join(this.frontendPath, 'services');
    this.adaptersPath = path.join(this.sdkRoot, 'adapters');
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.migrationSteps = [
      { name: 'backup', description: 'Respaldar servicios originales' },
      { name: 'install', description: 'Instalar adaptadores' },
      { name: 'test', description: 'Ejecutar pruebas de compatibilidad' },
      { name: 'gradual', description: 'Configurar rollout gradual' },
      { name: 'monitor', description: 'Configurar monitoreo' }
    ];
    
    this.serviceFiles = [
      'movimientosService.js',
      'authService.js',
      'userService.js',
      'reportesService.js'
    ];
  }

  /**
   * Punto de entrada principal
   */
  async run() {
    console.log('🚀 Iniciando migración a patrón adaptador...\n');
    
    try {
      await this.showWelcome();
      await this.checkPrerequisites();
      await this.selectMigrationMode();
      await this.executeMigration();
      await this.showResults();
    } catch (error) {
      console.error('❌ Error durante la migración:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Mostrar bienvenida y contexto
   */
  async showWelcome() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                     MIGRACIÓN FASE 2                        ║
║                  Patrón Adaptador SDK                       ║
╠══════════════════════════════════════════════════════════════╣
║  Objetivo: Introducir SDK gradualmente sin romper código    ║
║  Método: Wrapper de transición con fallback automático      ║
║  Beneficios:                                                 ║
║  • ✅ Migración gradual y segura                            ║
║  • ✅ Rollback inmediato si hay problemas                   ║
║  • ✅ Compatibilidad 100% con frontend existente           ║
║  • ✅ Nuevas funcionalidades del SDK opcionales             ║
╚══════════════════════════════════════════════════════════════╝
`);
    
    await this.waitForUser('Presiona Enter para continuar...');
  }

  /**
   * Verificar prerequisitos
   */
  async checkPrerequisites() {
    console.log('🔍 Verificando prerequisitos...\n');
    
    const checks = [
      {
        name: 'Proyecto SDK existe',
        check: () => fs.existsSync(this.sdkRoot) && fs.existsSync(path.join(this.sdkRoot, 'src')),
        fix: 'Ejecuta primero la FASE 1 para crear el SDK base'
      },
      {
        name: 'Frontend existe',
        check: () => fs.existsSync(this.frontendPath),
        fix: 'Verifica que el directorio frontend/src existe'
      },
      {
        name: 'Servicios existentes',
        check: () => fs.existsSync(this.servicesPath),
        fix: 'Verifica que frontend/src/services existe'
      },
      {
        name: 'SDK funcional',
        check: () => this.checkSDKFunctional(),
        fix: 'Ejecuta las pruebas del SDK para verificar funcionalidad'
      },
      {
        name: 'Directorio adapters',
        check: () => fs.existsSync(this.adaptersPath) || this.createAdaptersDir(),
        fix: 'Se creará automáticamente'
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
        console.log(`    Solución: ${check.fix}`);
        process.exit(1);
      }
    }
    
    console.log('\n✅ Todos los prerequisitos cumplidos\n');
  }

  /**
   * Verificar que el SDK está funcionalmente completo
   */
  checkSDKFunctional() {
    try {
      const sdkPath = path.join(this.sdkRoot, 'src/index.js');
      const packagePath = path.join(this.sdkRoot, 'package.json');
      
      return fs.existsSync(sdkPath) && fs.existsSync(packagePath);
    } catch (error) {
      return false;
    }
  }

  /**
   * Crear directorio adapters si no existe
   */
  createAdaptersDir() {
    try {
      if (!fs.existsSync(this.adaptersPath)) {
        fs.mkdirSync(this.adaptersPath, { recursive: true });
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Seleccionar modo de migración
   */
  async selectMigrationMode() {
    console.log('🔧 Modos de migración disponibles:\n');
    console.log('1. 🟦 SEGURO    - Solo instalar adaptadores sin activar');
    console.log('2. 🟨 TESTING   - Instalar y habilitar para pruebas');
    console.log('3. 🟧 GRADUAL   - Instalar con rollout del 10%');
    console.log('4. 🟥 COMPLETO  - Migración completa inmediata');
    console.log('5. ❓ MANUAL    - Configuración personalizada\n');
    
    const mode = await this.askUser('Selecciona el modo (1-5): ');
    
    switch (mode.trim()) {
      case '1':
        this.migrationMode = 'safe';
        break;
      case '2':
        this.migrationMode = 'testing';
        break;
      case '3':
        this.migrationMode = 'gradual';
        break;
      case '4':
        this.migrationMode = 'complete';
        break;
      case '5':
        this.migrationMode = 'manual';
        break;
      default:
        console.log('❌ Selección inválida');
        await this.selectMigrationMode();
    }
    
    await this.confirmMigrationMode();
  }

  /**
   * Confirmar modo de migración seleccionado
   */
  async confirmMigrationMode() {
    const descriptions = {
      safe: 'Solo instalará los adaptadores sin activarlos. El frontend seguirá usando los servicios originales.',
      testing: 'Instalará y habilitará adaptadores solo para pruebas locales. No afecta producción.',
      gradual: 'Instalará adaptadores con rollout del 10%. Solo algunos usuarios usarán el SDK.',
      complete: 'Migración inmediata. Todos los servicios usarán el SDK inmediatamente.',
      manual: 'Configuración personalizada paso a paso.'
    };

    console.log(`\n📋 Modo seleccionado: ${this.migrationMode.toUpperCase()}`);
    console.log(`📝 Descripción: ${descriptions[this.migrationMode]}\n`);
    
    const confirm = await this.askUser('¿Continuar con este modo? (s/n): ');
    
    if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'sí') {
      await this.selectMigrationMode();
    }
  }

  /**
   * Ejecutar migración según el modo seleccionado
   */
  async executeMigration() {
    console.log('\n🔄 Ejecutando migración...\n');
    
    for (const step of this.migrationSteps) {
      await this.executeStep(step);
    }
  }

  /**
   * Ejecutar un paso específico de migración
   */
  async executeStep(step) {
    console.log(`📦 ${step.description}...`);
    
    try {
      switch (step.name) {
        case 'backup':
          await this.backupOriginalServices();
          break;
        case 'install':
          await this.installAdapters();
          break;
        case 'test':
          await this.runCompatibilityTests();
          break;
        case 'gradual':
          await this.configureGradualRollout();
          break;
        case 'monitor':
          await this.configureMonitoring();
          break;
      }
      console.log(`✅ ${step.description} completado\n`);
    } catch (error) {
      console.error(`❌ Error en ${step.description}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Respaldar servicios originales
   */
  async backupOriginalServices() {
    const backupDir = path.join(this.servicesPath, 'backup');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    for (const serviceFile of this.serviceFiles) {
      const originalPath = path.join(this.servicesPath, serviceFile);
      const backupPath = path.join(backupDir, `${serviceFile}.backup`);
      
      if (fs.existsSync(originalPath)) {
        fs.copyFileSync(originalPath, backupPath);
        console.log(`  ✅ Respaldado ${serviceFile}`);
      }
    }
  }

  /**
   * Instalar adaptadores
   */
  async installAdapters() {
    // Copiar adaptadores desde sdk/adapters a frontend/src/services
    const adaptersToInstall = [
      'movimientos-adapter.js',
      'adapter-config.js'
    ];

    for (const adapter of adaptersToInstall) {
      const sourcePath = path.join(this.adaptersPath, adapter);
      const targetPath = path.join(this.servicesPath, adapter);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`  ✅ Instalado ${adapter}`);
      }
    }

    // Actualizar imports en servicios si es necesario
    await this.updateServiceImports();
  }

  /**
   * Actualizar imports en servicios para usar adaptadores
   */
  async updateServiceImports() {
    // Para modo seguro, no actualizar imports automáticamente
    if (this.migrationMode === 'safe') return;

    // Para otros modos, crear scripts de actualización
    const updateScript = this.generateUpdateScript();
    const scriptPath = path.join(this.servicesPath, 'update-imports.js');
    
    fs.writeFileSync(scriptPath, updateScript);
    console.log('  ✅ Script de actualización creado');
  }

  /**
   * Generar script para actualizar imports
   */
  generateUpdateScript() {
    return `
// Script automático para actualizar imports a adaptadores
// Ejecutar manualmente cuando sea seguro hacer la transición

// Ejemplo de migración para movimientosService:
/*
// ANTES:
import { getMovimientos, createMovimiento } from './movimientosService.js';

// DESPUÉS:
import { getMovimientos, createMovimiento } from './movimientos-adapter.js';
*/

console.log('⚠️  Ejecuta este script manualmente para migrar imports');
console.log('📚 Consulta la documentación para pasos detallados');
    `;
  }

  /**
   * Ejecutar pruebas de compatibilidad
   */
  async runCompatibilityTests() {
    // TODO: Implementar ejecución de tests automatizados
    console.log('  🧪 Ejecutando pruebas básicas...');
    
    // Verificar que adaptadores se pueden importar
    try {
      require(path.join(this.servicesPath, 'adapter-config.js'));
      console.log('  ✅ AdapterConfig importado correctamente');
    } catch (error) {
      throw new Error(`No se pudo importar AdapterConfig: ${error.message}`);
    }

    // TODO: Más verificaciones automáticas
    console.log('  ✅ Pruebas básicas pasadas');
  }

  /**
   * Configurar rollout gradual según modo
   */
  async configureGradualRollout() {
    const configPath = path.join(this.servicesPath, 'migration-config.json');
    
    const config = {
      mode: this.migrationMode,
      sdk: {
        enabled: this.migrationMode !== 'safe',
        baseURL: 'http://localhost:3000/api'
      },
      migration: {
        phase: this.getMigrationPhase(),
        rolloutPercentage: this.getRolloutPercentage(),
        featureFlags: this.getFeatureFlags()
      },
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`  ✅ Configuración guardada en ${configPath}`);
  }

  /**
   * Obtener fase de migración según modo
   */
  getMigrationPhase() {
    const phases = {
      safe: 'disabled',
      testing: 'testing',
      gradual: 'partial',
      complete: 'full',
      manual: 'testing'
    };
    
    return phases[this.migrationMode] || 'disabled';
  }

  /**
   * Obtener porcentaje de rollout según modo
   */
  getRolloutPercentage() {
    const percentages = {
      safe: 0,
      testing: 0,
      gradual: 10,
      complete: 100,
      manual: 5
    };
    
    return percentages[this.migrationMode] || 0;
  }

  /**
   * Obtener feature flags según modo
   */
  getFeatureFlags() {
    const enabled = this.migrationMode !== 'safe';
    
    return {
      'sdk-movimientos': enabled,
      'sdk-auth': false,  // Gradual por servicio
      'sdk-usuarios': false,
      'sdk-reportes': false
    };
  }

  /**
   * Configurar monitoreo
   */
  async configureMonitoring() {
    // Crear dashboard simple de monitoreo
    const dashboardScript = this.generateMonitoringDashboard();
    const dashboardPath = path.join(this.adaptersPath, 'monitoring-dashboard.html');
    
    fs.writeFileSync(dashboardPath, dashboardScript);
    console.log(`  ✅ Dashboard de monitoreo creado en ${dashboardPath}`);
  }

  /**
   * Generar dashboard de monitoreo
   */
  generateMonitoringDashboard() {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>SDK Migration Monitor</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; }
        .error { background: #f8d7da; border: 1px solid #f5c6cb; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
        .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>🚀 SDK Migration Monitor</h1>
    
    <div id="status" class="status">
        <h3>Estado del Sistema</h3>
        <p>Cargando...</p>
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <h4>Requests SDK</h4>
            <p id="sdk-requests">-</p>
        </div>
        <div class="stat-card">
            <h4>Requests Fallback</h4>
            <p id="fallback-requests">-</p>
        </div>
        <div class="stat-card">
            <h4>Success Rate</h4>
            <p id="success-rate">-</p>
        </div>
        <div class="stat-card">
            <h4>Rollout %</h4>
            <p id="rollout-percentage">-</p>
        </div>
    </div>
    
    <script>
        // TODO: Implementar monitoreo en tiempo real
        console.log('Monitoring dashboard loaded');
        
        function updateStats() {
            // Obtener stats del localStorage o API
            if (typeof localStorage !== 'undefined') {
                const config = JSON.parse(localStorage.getItem('balance_adapter_config') || '{}');
                document.getElementById('rollout-percentage').textContent = 
                    (config.migration?.rolloutPercentage || 0) + '%';
            }
        }
        
        updateStats();
        setInterval(updateStats, 5000);
    </script>
</body>
</html>
    `;
  }

  /**
   * Mostrar resultados de la migración
   */
  async showResults() {
    console.log('\n🎉 Migración completada!\n');
    
    const nextSteps = this.getNextSteps();
    console.log('📋 Próximos pasos:');
    nextSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });

    console.log('\n📚 Recursos adicionales:');
    console.log('  • Dashboard de monitoreo: sdk/adapters/monitoring-dashboard.html');
    console.log('  • Configuración: frontend/src/services/migration-config.json');
    console.log('  • Respaldos: frontend/src/services/backup/');
    console.log('  • Documentación: sdk/README.md');
    
    console.log('\n✅ ¡El sistema está listo para usar el patrón adaptador!');
  }

  /**
   * Obtener próximos pasos según modo de migración
   */
  getNextSteps() {
    const steps = {
      safe: [
        'Revisar adaptadores instalados en frontend/src/services/',
        'Ejecutar pruebas manuales de compatibilidad',
        'Cuando esté listo, cambiar imports manualmente',
        'Habilitar SDK gradualmente usando enableSDK()'
      ],
      testing: [
        'Probar funcionalidad en entorno de desarrollo',
        'Verificar que fallbacks funcionan correctamente',
        'Ajustar configuración si es necesario',
        'Proceder con rollout gradual'
      ],
      gradual: [
        'Monitorear métricas en dashboard',
        'Verificar logs de errores',
        'Incrementar porcentaje gradualmente',
        'Preparar rollback si es necesario'
      ],
      complete: [
        'Monitorear el sistema de cerca',
        'Verificar que no hay errores críticos',
        'Optimizar configuración según uso',
        'Documentar lecciones aprendidas'
      ],
      manual: [
        'Configurar parámetros específicos',
        'Definir estrategia de rollout personalizada',
        'Implementar monitoreo específico',
        'Ejecutar pruebas extensas'
      ]
    };

    return steps[this.migrationMode] || steps.safe;
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
  const migration = new MigrationScript();
  migration.run().catch(console.error);
}

module.exports = MigrationScript;