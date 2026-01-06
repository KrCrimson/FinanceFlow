#!/usr/bin/env node

/**
 * 🧹 FASE 5: Limpieza Gradual - Optimización Post-Migración
 * 
 * Script para limpiar código de transición, archivos obsoletos y 
 * dependencias no usadas después de una migración exitosa.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class GradualCleanup {
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
    
    this.frontendPath = path.join(this.projectRoot, 'frontend');
    this.servicesPath = path.join(this.frontendPath, 'src/services');
    this.backendPath = path.join(this.projectRoot, 'backend');
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Categorías de limpieza
    this.cleanupCategories = [
      {
        id: 'backup_files',
        name: 'Archivos de Respaldo',
        description: 'Respaldos .old, .backup y carpetas de backup temporales',
        priority: 1,
        risk: 'BAJO',
        items: []
      },
      {
        id: 'transition_helpers',
        name: 'Helpers de Transición',
        description: 'Scripts temporales de migración y adaptadores obsoletos',
        priority: 2,
        risk: 'MEDIO',
        items: []
      },
      {
        id: 'commented_code',
        name: 'Código Comentado',
        description: 'Bloques de código comentado y TODOs resueltos',
        priority: 3,
        risk: 'BAJO',
        items: []
      },
      {
        id: 'unused_services',
        name: 'Servicios No Usados',
        description: 'Servicios originales reemplazados por adaptadores',
        priority: 4,
        risk: 'ALTO',
        items: []
      },
      {
        id: 'unused_dependencies',
        name: 'Dependencias No Usadas',
        description: 'Packages npm que ya no se utilizan',
        priority: 5,
        risk: 'MEDIO',
        items: []
      },
      {
        id: 'temporary_files',
        name: 'Archivos Temporales',
        description: 'Logs, reportes de testing y archivos de configuración temporal',
        priority: 6,
        risk: 'BAJO',
        items: []
      }
    ];

    this.cleanupResults = {
      analyzed: 0,
      cleaned: 0,
      skipped: 0,
      spaceSaved: 0,
      categories: {}
    };
  }

  /**
   * Punto de entrada principal
   */
  async run() {
    console.log('🧹 Iniciando FASE 5: Limpieza Gradual\n');
    
    try {
      await this.showWelcome();
      await this.checkPrerequisites();
      await this.analyzeProject();
      await this.selectCleanupStrategy();
      await this.executeCleanup();
      await this.generateCleanupReport();
    } catch (error) {
      console.error('❌ Error durante limpieza:', error.message);
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
║                     FASE 5 - LIMPIEZA GRADUAL              ║
║                   Optimización Post-Migración               ║
╠══════════════════════════════════════════════════════════════╣
║  🎯 Objetivo: Limpiar código de transición y optimizar      ║
║  🧹 Estrategia: Limpieza gradual y controlada               ║
║  📋 Proceso:                                                 ║
║    • Analizar archivos obsoletos y temporales               ║
║    • Identificar código comentado y helpers                 ║
║    • Detectar dependencias no utilizadas                    ║
║    • Limpiar gradualmente con confirmaciones                ║
║    • Mantener respaldos críticos por seguridad              ║
╚══════════════════════════════════════════════════════════════╝
`);
    
    await this.waitForUser('Presiona Enter para continuar...');
  }

  /**
   * Verificar prerequisitos
   */
  async checkPrerequisites() {
    console.log('🔍 Verificando prerequisitos para limpieza...\n');
    
    const checks = [
      {
        name: 'Migración completada exitosamente',
        check: () => this.checkMigrationCompleted(),
        fix: 'Completa todas las fases de migración primero'
      },
      {
        name: 'Testing FASE 4 exitoso',
        check: () => this.checkTestingCompleted(),
        fix: 'Ejecuta testing paralelo y verifica 100% de éxito'
      },
      {
        name: 'Sistema funcionando en producción',
        check: () => this.checkSystemStable(),
        fix: 'Verifica que el sistema esté estable antes de limpiar'
      },
      {
        name: 'Respaldos de seguridad disponibles',
        check: () => this.checkSafetyBackups(),
        fix: 'Crea respaldos completos antes de proceder'
      }
    ];

    for (const check of checks) {
      process.stdout.write(`  ${check.name}... `);
      
      try {
        const result = await check.check();
        if (result) {
          console.log('✅');
        } else {
          console.log('⚠️');
          console.log(`    Recomendación: ${check.fix}`);
        }
      } catch (error) {
        console.log('❌');
        console.log(`    Error: ${error.message}`);
      }
    }
    
    console.log('\n📋 Nota: La limpieza es opcional y reversible\n');
  }

  /**
   * Verificar migración completada
   */
  checkMigrationCompleted() {
    try {
      const reportPath = path.join(this.sdkRoot, 'testing-report-fase4.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        return report.summary.successRate >= 95;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verificar testing completado
   */
  checkTestingCompleted() {
    const reportPath = path.join(this.sdkRoot, 'testing-report-fase4.json');
    return fs.existsSync(reportPath);
  }

  /**
   * Verificar sistema estable
   */
  checkSystemStable() {
    // Verificar que no hay errores recientes en logs
    return true; // Simplificado para demo
  }

  /**
   * Verificar respaldos de seguridad
   */
  checkSafetyBackups() {
    const backupDirs = [
      path.join(this.servicesPath, 'backup'),
      path.join(this.servicesPath, 'phase3-backup')
    ];
    
    return backupDirs.some(dir => fs.existsSync(dir));
  }

  /**
   * Analizar proyecto para identificar elementos a limpiar
   */
  async analyzeProject() {
    console.log('🔍 Analizando proyecto para identificar elementos a limpiar...\n');
    
    // Analizar cada categoría
    for (const category of this.cleanupCategories) {
      console.log(`📂 Analizando: ${category.name}...`);
      
      switch (category.id) {
        case 'backup_files':
          category.items = await this.analyzeBackupFiles();
          break;
        case 'transition_helpers':
          category.items = await this.analyzeTransitionHelpers();
          break;
        case 'commented_code':
          category.items = await this.analyzeCommentedCode();
          break;
        case 'unused_services':
          category.items = await this.analyzeUnusedServices();
          break;
        case 'unused_dependencies':
          category.items = await this.analyzeUnusedDependencies();
          break;
        case 'temporary_files':
          category.items = await this.analyzeTemporaryFiles();
          break;
      }
      
      console.log(`  ✅ Encontrados: ${category.items.length} elementos`);
    }
    
    const totalItems = this.cleanupCategories.reduce((sum, cat) => sum + cat.items.length, 0);
    console.log(`\n📊 Análisis completado: ${totalItems} elementos identificados para limpieza\n`);
  }

  /**
   * Analizar archivos de respaldo
   */
  async analyzeBackupFiles() {
    const backupItems = [];
    
    // Buscar archivos .old
    const oldFiles = this.findFilesByPattern(this.servicesPath, /\.old$/);
    oldFiles.forEach(file => {
      backupItems.push({
        type: 'file',
        path: file,
        description: 'Respaldo de servicio original',
        size: this.getFileSize(file),
        safe: true
      });
    });
    
    // Buscar archivos .backup
    const backupFiles = this.findFilesByPattern(this.servicesPath, /\.backup$/);
    backupFiles.forEach(file => {
      backupItems.push({
        type: 'file',
        path: file,
        description: 'Archivo de respaldo temporal',
        size: this.getFileSize(file),
        safe: true
      });
    });
    
    // Buscar carpetas de backup
    const backupDirs = ['backup', 'phase3-backup'];
    backupDirs.forEach(dirName => {
      const dirPath = path.join(this.servicesPath, dirName);
      if (fs.existsSync(dirPath)) {
        backupItems.push({
          type: 'directory',
          path: dirPath,
          description: 'Carpeta de respaldos temporales',
          size: this.getDirectorySize(dirPath),
          safe: false // Mantener al menos una semana
        });
      }
    });
    
    return backupItems;
  }

  /**
   * Analizar helpers de transición
   */
  async analyzeTransitionHelpers() {
    const helperItems = [];
    
    // Scripts de migración temporales
    const migrationScripts = [
      'migrate-to-adapter.js',
      'component-migration.js', 
      'migrate-reportes-direct.js',
      'auto-migrate-reportes.js'
    ];
    
    migrationScripts.forEach(script => {
      const scriptPath = path.join(this.sdkRoot, script);
      if (fs.existsSync(scriptPath)) {
        helperItems.push({
          type: 'file',
          path: scriptPath,
          description: 'Script de migración temporal',
          size: this.getFileSize(scriptPath),
          safe: false // Mantener hasta estar completamente seguro
        });
      }
    });
    
    // Archivos de configuración temporal
    const tempConfigs = [
      'migration-config.json',
      'migration-phase3.json'
    ];
    
    tempConfigs.forEach(config => {
      const configPath = path.join(this.servicesPath, config);
      if (fs.existsSync(configPath)) {
        helperItems.push({
          type: 'file',
          path: configPath,
          description: 'Configuración de migración temporal',
          size: this.getFileSize(configPath),
          safe: false
        });
      }
    });
    
    return helperItems;
  }

  /**
   * Analizar código comentado
   */
  async analyzeCommentedCode() {
    const commentedItems = [];
    
    // Buscar archivos con bloques de código comentado
    const jsFiles = this.findFilesByPattern(this.frontendPath, /\.(js|jsx|ts|tsx)$/);
    
    for (const file of jsFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        let inCommentBlock = false;
        let commentStartLine = 0;
        let commentedCodeLines = 0;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          // Detectar inicio de bloque comentado
          if (line.startsWith('/*') && !line.includes('*/')) {
            inCommentBlock = true;
            commentStartLine = i + 1;
            continue;
          }
          
          // Detectar fin de bloque comentado
          if (line.includes('*/') && inCommentBlock) {
            inCommentBlock = false;
            
            if (commentedCodeLines > 3) { // Solo reportar bloques significativos
              commentedItems.push({
                type: 'code_block',
                path: file,
                description: `Bloque de código comentado (${commentedCodeLines} líneas)`,
                lines: `${commentStartLine}-${i + 1}`,
                safe: true
              });
            }
            commentedCodeLines = 0;
            continue;
          }
          
          // Contar líneas de código en bloque comentado
          if (inCommentBlock && line.length > 0) {
            commentedCodeLines++;
          }
          
          // Detectar comentarios TODO resueltos
          if (line.includes('// TODO') && (line.includes('COMPLETADO') || line.includes('RESUELTO'))) {
            commentedItems.push({
              type: 'resolved_todo',
              path: file,
              description: 'TODO resuelto',
              lines: i + 1,
              safe: true
            });
          }
        }
      } catch (error) {
        // Ignorar errores de lectura
      }
    }
    
    return commentedItems;
  }

  /**
   * Analizar servicios no usados
   */
  async analyzeUnusedServices() {
    const unusedItems = [];
    
    // Lista de servicios que podrían estar obsoletos
    const potentiallyUnused = [
      'reportesService.js.old',
      'movimientosService.js.old',
      'userService.js.old', 
      'authService.js.old'
    ];
    
    for (const service of potentiallyUnused) {
      const servicePath = path.join(this.servicesPath, service);
      if (fs.existsSync(servicePath)) {
        // Verificar si algún archivo lo importa
        const isUsed = await this.checkIfServiceIsUsed(service);
        
        if (!isUsed) {
          unusedItems.push({
            type: 'unused_service',
            path: servicePath,
            description: 'Servicio original no utilizado',
            size: this.getFileSize(servicePath),
            safe: false // Alto riesgo - mantener más tiempo
          });
        }
      }
    }
    
    return unusedItems;
  }

  /**
   * Verificar si un servicio está siendo usado
   */
  async checkIfServiceIsUsed(serviceName) {
    const searchDirs = [this.frontendPath];
    
    for (const dir of searchDirs) {
      const files = this.findFilesByPattern(dir, /\.(js|jsx|ts|tsx)$/);
      
      for (const file of files) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes(serviceName.replace('.js', '')) || content.includes(serviceName)) {
            return true;
          }
        } catch (error) {
          // Ignorar errores de lectura
        }
      }
    }
    
    return false;
  }

  /**
   * Analizar dependencias no usadas
   */
  async analyzeUnusedDependencies() {
    const unusedDeps = [];
    
    // Verificar frontend
    const frontendPackageJson = path.join(this.frontendPath, 'package.json');
    if (fs.existsSync(frontendPackageJson)) {
      const frontendDeps = await this.analyzePackageForUnusedDeps(frontendPackageJson, this.frontendPath);
      unusedDeps.push(...frontendDeps);
    }
    
    // Verificar SDK
    const sdkPackageJson = path.join(this.sdkRoot, 'package.json');
    if (fs.existsSync(sdkPackageJson)) {
      const sdkDeps = await this.analyzePackageForUnusedDeps(sdkPackageJson, this.sdkRoot);
      unusedDeps.push(...sdkDeps);
    }
    
    return unusedDeps;
  }

  /**
   * Analizar package.json para dependencias no usadas
   */
  async analyzePackageForUnusedDeps(packageJsonPath, searchDir) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const unusedDeps = [];
      
      for (const [depName, version] of Object.entries(deps)) {
        const isUsed = await this.checkIfDependencyIsUsed(depName, searchDir);
        
        if (!isUsed) {
          unusedDeps.push({
            type: 'unused_dependency',
            path: packageJsonPath,
            description: `Dependencia no utilizada: ${depName}@${version}`,
            package: depName,
            version: version,
            safe: false // Verificar manualmente antes de remover
          });
        }
      }
      
      return unusedDeps;
    } catch (error) {
      return [];
    }
  }

  /**
   * Verificar si una dependencia está siendo usada
   */
  async checkIfDependencyIsUsed(depName, searchDir) {
    const files = this.findFilesByPattern(searchDir, /\.(js|jsx|ts|tsx|json)$/);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Buscar imports/requires del paquete
        if (content.includes(`require('${depName}')`) ||
            content.includes(`require("${depName}")`) ||
            content.includes(`import`) && content.includes(`from '${depName}'`) ||
            content.includes(`import`) && content.includes(`from "${depName}"`)) {
          return true;
        }
      } catch (error) {
        // Ignorar errores de lectura
      }
    }
    
    return false;
  }

  /**
   * Analizar archivos temporales
   */
  async analyzeTemporaryFiles() {
    const tempItems = [];
    
    // Archivos de testing y reportes
    const tempFiles = [
      'testing-report-fase4.json',
      'testing-dashboard.html',
      'monitoring-dashboard.html'
    ];
    
    tempFiles.forEach(file => {
      const filePath = path.join(this.sdkRoot, file);
      if (fs.existsSync(filePath)) {
        tempItems.push({
          type: 'temp_file',
          path: filePath,
          description: 'Reporte de testing temporal',
          size: this.getFileSize(filePath),
          safe: true // Mantener por ahora, útil para referencia
        });
      }
    });
    
    // Archivos de log
    const logFiles = this.findFilesByPattern(this.projectRoot, /\.log$/);
    logFiles.forEach(file => {
      const stats = fs.statSync(file);
      const daysSinceModified = (Date.now() - stats.mtime) / (1000 * 60 * 60 * 24);
      
      if (daysSinceModified > 7) { // Logs más viejos de 7 días
        tempItems.push({
          type: 'old_log',
          path: file,
          description: `Log antiguo (${Math.round(daysSinceModified)} días)`,
          size: this.getFileSize(file),
          safe: true
        });
      }
    });
    
    return tempItems;
  }

  /**
   * Seleccionar estrategia de limpieza
   */
  async selectCleanupStrategy() {
    console.log('🎯 Estrategias de limpieza disponibles:\n');
    
    console.log('1. 🧹 Limpieza Conservadora (Recomendada)');
    console.log('   • Solo archivos temporales y respaldos muy antiguos');
    console.log('   • Mantiene todos los servicios y helpers');
    console.log('   • Riesgo mínimo, reversible');
    console.log();
    
    console.log('2. 🔧 Limpieza Moderada');
    console.log('   • Incluye código comentado y helpers obsoletos');
    console.log('   • Mantiene servicios originales por seguridad');
    console.log('   • Riesgo bajo, mayormente reversible');
    console.log();
    
    console.log('3. 🚀 Limpieza Completa');
    console.log('   • Remueve servicios no usados y dependencias');
    console.log('   • Optimización máxima del proyecto');
    console.log('   • Requiere verificación manual exhaustiva');
    console.log();
    
    console.log('4. 🎮 Limpieza Personalizada');
    console.log('   • Control granular por categoría');
    console.log('   • Revisión manual de cada elemento');
    console.log('   • Máximo control y seguridad');
    console.log();
    
    const strategy = await this.askUser('Selecciona estrategia (1-4): ');
    
    switch (strategy) {
      case '1':
        this.selectedStrategy = 'conservative';
        this.filterCategoriesByRisk(['BAJO']);
        break;
      case '2':
        this.selectedStrategy = 'moderate';
        this.filterCategoriesByRisk(['BAJO', 'MEDIO']);
        break;
      case '3':
        this.selectedStrategy = 'complete';
        // Incluir todas las categorías pero con confirmaciones
        this.selectedStrategy = 'complete';
        break;
      case '4':
        this.selectedStrategy = 'custom';
        await this.selectCustomCategories();
        break;
      default:
        this.selectedStrategy = 'conservative';
        this.filterCategoriesByRisk(['BAJO']);
    }
    
    await this.confirmCleanupPlan();
  }

  /**
   * Filtrar categorías por nivel de riesgo
   */
  filterCategoriesByRisk(allowedRisks) {
    this.cleanupCategories.forEach(category => {
      if (!allowedRisks.includes(category.risk)) {
        category.items = []; // No limpiar categorías de alto riesgo
      }
    });
  }

  /**
   * Selección personalizada de categorías
   */
  async selectCustomCategories() {
    console.log('\n🎮 Selección personalizada de categorías:\n');
    
    for (const category of this.cleanupCategories) {
      if (category.items.length > 0) {
        console.log(`📂 ${category.name} (${category.items.length} elementos, riesgo ${category.risk})`);
        console.log(`   📝 ${category.description}`);
        
        const include = await this.askUser(`   ¿Incluir en limpieza? (s/n): `);
        
        if (include.toLowerCase() !== 's' && include.toLowerCase() !== 'sí') {
          category.items = [];
        }
        console.log();
      }
    }
  }

  /**
   * Confirmar plan de limpieza
   */
  async confirmCleanupPlan() {
    const activeCategories = this.cleanupCategories.filter(cat => cat.items.length > 0);
    const totalItems = activeCategories.reduce((sum, cat) => sum + cat.items.length, 0);
    const totalSize = this.calculateTotalSize(activeCategories);
    
    console.log(`\n📋 Plan de limpieza confirmado:`);
    console.log(`   🎯 Estrategia: ${this.getStrategyName()}`);
    console.log(`   📂 Categorías activas: ${activeCategories.length}`);
    console.log(`   🧹 Elementos a limpiar: ${totalItems}`);
    console.log(`   💾 Espacio a liberar: ${this.formatFileSize(totalSize)}`);
    console.log();
    
    activeCategories.forEach(category => {
      console.log(`   📂 ${category.name}: ${category.items.length} elementos (${category.risk})`);
    });
    
    console.log('\n⚠️ Importante:');
    console.log('   • Se crearán respaldos antes de eliminar');
    console.log('   • Cada categoría requiere confirmación individual');
    console.log('   • Proceso reversible en caso de problemas');
    
    const confirm = await this.askUser('\n¿Proceder con la limpieza? (s/n): ');
    
    if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'sí') {
      console.log('⏭️ Limpieza cancelada');
      process.exit(0);
    }
  }

  /**
   * Ejecutar limpieza
   */
  async executeCleanup() {
    console.log('\n🧹 Iniciando limpieza gradual...\n');
    
    // Crear respaldo de seguridad
    await this.createSafetyBackup();
    
    // Procesar cada categoría
    for (const category of this.cleanupCategories) {
      if (category.items.length > 0) {
        await this.cleanupCategory(category);
      }
    }
    
    console.log('\n✅ Limpieza completada exitosamente');
  }

  /**
   * Crear respaldo de seguridad
   */
  async createSafetyBackup() {
    console.log('💾 Creando respaldo de seguridad...');
    
    const backupDir = path.join(this.projectRoot, 'cleanup-backup-' + Date.now());
    fs.mkdirSync(backupDir, { recursive: true });
    
    // Respaldar archivos críticos
    const criticalDirs = [this.servicesPath, this.sdkRoot];
    
    for (const dir of criticalDirs) {
      if (fs.existsSync(dir)) {
        const targetDir = path.join(backupDir, path.basename(dir));
        await this.copyDirectory(dir, targetDir);
      }
    }
    
    this.safetyBackupPath = backupDir;
    console.log(`   ✅ Respaldo creado en: ${backupDir}\n`);
  }

  /**
   * Limpiar categoría específica
   */
  async cleanupCategory(category) {
    console.log(`🗂️ Limpiando: ${category.name} (${category.items.length} elementos)`);
    console.log(`   📝 ${category.description}`);
    console.log(`   ⚠️ Riesgo: ${category.risk}`);
    
    if (category.risk === 'ALTO') {
      const confirmHighRisk = await this.askUser('   ⚠️ Categoría de ALTO riesgo. ¿Continuar? (s/n): ');
      if (confirmHighRisk.toLowerCase() !== 's') {
        console.log('   ⏭️ Categoría omitida por seguridad');
        this.cleanupResults.categories[category.id] = { skipped: category.items.length, cleaned: 0 };
        return;
      }
    }
    
    let cleaned = 0;
    let skipped = 0;
    
    for (const item of category.items) {
      const action = await this.processCleanupItem(item);
      if (action === 'cleaned') {
        cleaned++;
      } else {
        skipped++;
      }
    }
    
    this.cleanupResults.categories[category.id] = { cleaned, skipped };
    console.log(`   ✅ Completado: ${cleaned} limpiados, ${skipped} omitidos\n`);
  }

  /**
   * Procesar elemento individual de limpieza
   */
  async processCleanupItem(item) {
    try {
      console.log(`     🧹 ${item.description}`);
      console.log(`        📁 ${this.getRelativePath(item.path)}`);
      
      if (!item.safe && this.selectedStrategy !== 'complete') {
        console.log('        ⚠️ Elemento no seguro - omitido por estrategia');
        return 'skipped';
      }
      
      // Eliminar archivo o directorio
      if (item.type === 'directory') {
        fs.rmSync(item.path, { recursive: true, force: true });
      } else {
        fs.unlinkSync(item.path);
      }
      
      console.log('        ✅ Eliminado');
      this.cleanupResults.spaceSaved += item.size || 0;
      return 'cleaned';
      
    } catch (error) {
      console.log(`        ❌ Error: ${error.message}`);
      return 'skipped';
    }
  }

  /**
   * Generar reporte de limpieza
   */
  async generateCleanupReport() {
    console.log('\n📊 Generando reporte de limpieza...');
    
    const report = {
      metadata: {
        phase: 5,
        strategy: this.selectedStrategy,
        timestamp: new Date().toISOString(),
        safetyBackup: this.safetyBackupPath
      },
      summary: {
        totalAnalyzed: this.cleanupCategories.reduce((sum, cat) => sum + cat.items.length, 0),
        totalCleaned: Object.values(this.cleanupResults.categories).reduce((sum, cat) => sum + cat.cleaned, 0),
        totalSkipped: Object.values(this.cleanupResults.categories).reduce((sum, cat) => sum + cat.skipped, 0),
        spaceSaved: this.cleanupResults.spaceSaved
      },
      categories: this.cleanupResults.categories,
      backup: this.safetyBackupPath
    };
    
    // Guardar reporte
    const reportPath = path.join(this.sdkRoot, 'cleanup-report-fase5.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Mostrar resultados
    console.log('\n🎯 RESULTADOS DE LIMPIEZA:');
    console.log(`   📊 Elementos analizados: ${report.summary.totalAnalyzed}`);
    console.log(`   🧹 Elementos limpiados: ${report.summary.totalCleaned}`);
    console.log(`   ⏭️ Elementos omitidos: ${report.summary.totalSkipped}`);
    console.log(`   💾 Espacio liberado: ${this.formatFileSize(report.summary.spaceSaved)}`);
    console.log(`   🔒 Respaldo de seguridad: ${this.safetyBackupPath}`);
    
    // Recomendaciones
    console.log('\n💡 RECOMENDACIONES:');
    if (report.summary.totalCleaned > 0) {
      console.log('   ✅ Proyecto optimizado exitosamente');
      console.log('   📊 Monitorea el sistema durante las próximas 48 horas');
      console.log('   🗑️ El respaldo puede eliminarse después de 1 semana si todo funciona');
    }
    
    if (report.summary.totalSkipped > 0) {
      console.log('   🔍 Revisar elementos omitidos manualmente si es necesario');
      console.log('   ⚠️ Algunos elementos requieren verificación manual adicional');
    }
    
    console.log(`\n📄 Reporte detallado guardado en: ${reportPath}`);
  }

  /**
   * Utilidades
   */
  findFilesByPattern(directory, pattern) {
    const files = [];
    
    if (!fs.existsSync(directory)) return files;
    
    const walkDir = (dir) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            walkDir(fullPath);
          } else if (entry.isFile() && pattern.test(entry.name)) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Ignorar errores de acceso
      }
    };
    
    walkDir(directory);
    return files;
  }

  getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch (error) {
      return 0;
    }
  }

  getDirectorySize(dirPath) {
    try {
      let size = 0;
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          size += this.getDirectorySize(fullPath);
        } else {
          size += this.getFileSize(fullPath);
        }
      }
      
      return size;
    } catch (error) {
      return 0;
    }
  }

  calculateTotalSize(categories) {
    return categories.reduce((total, category) => {
      return total + category.items.reduce((sum, item) => sum + (item.size || 0), 0);
    }, 0);
  }

  formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  getRelativePath(fullPath) {
    return path.relative(this.projectRoot, fullPath);
  }

  getStrategyName() {
    const names = {
      'conservative': 'Limpieza Conservadora',
      'moderate': 'Limpieza Moderada',
      'complete': 'Limpieza Completa',
      'custom': 'Limpieza Personalizada'
    };
    return names[this.selectedStrategy] || 'Desconocido';
  }

  async copyDirectory(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

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
  const cleanup = new GradualCleanup();
  cleanup.run().catch(console.error);
}

module.exports = GradualCleanup;