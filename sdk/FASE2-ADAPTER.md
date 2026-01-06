# 🔄 FASE 2: Patrón Adaptador - Migración Gradual

> **Objetivo**: Introducir el SDK gradualmente sin romper el frontend existente usando un wrapper de transición.

## 📋 Descripción General

La FASE 2 implementa un **patrón adaptador** que permite una migración suave y controlada del SDK manteniendo 100% de compatibilidad con el código frontend existente.

### 🎯 Beneficios Principales

- ✅ **Migración sin interrupciones**: El frontend sigue funcionando normalmente
- ✅ **Rollback inmediato**: Posibilidad de revertir cambios instantáneamente  
- ✅ **Fallback automático**: Si el SDK falla, usa automáticamente el método original
- ✅ **Control granular**: Habilitar/deshabilitar por servicio o funcionalidad
- ✅ **Nuevas funcionalidades**: Acceso opcional a métodos mejorados del SDK
- ✅ **Monitoreo completo**: Dashboard para supervisar la transición

## 🏗️ Arquitectura del Adaptador

```
Frontend Components
        ↓
   Service Layer (sin cambios)
        ↓
   🔄 ADAPTER LAYER (nuevo)
        ↓
   ┌─────────────────────────┐
   │  SDK habilitado?        │
   │  ┌─── SÍ → Use SDK      │
   │  └─── NO → Use Original │
   └─────────────────────────┘
        ↓              ↓
    SDK Methods    Original Methods
        ↓              ↓
     Backend API    Backend API
```

## 📦 Componentes Implementados

### 1. MovimientosAdapter (`/sdk/adapters/movimientos-adapter.js`)

Adaptador principal que mantiene la interfaz exacta del `movimientosService.js` original:

```javascript
// Métodos originales (interfaz idéntica)
- getMovimientos()
- createMovimiento(data)  
- updateMovimiento(id, data)
- inhabilitarMovimiento(id)

// Métodos nuevos del SDK (opcionales)
- getMovimientoById(id)
- getIngresos(params)
- getEgresos(params)  
- getResumen(params)

// Controles del adaptador
- enableSDK()
- disableSDK()
- updateToken(token)
- getAdapterStats()
```

#### Características clave:

- **Fallback automático**: Si el SDK falla, usa el método original transparentemente
- **Logging detallado**: Registra todas las transiciones para monitoreo
- **Adaptación de respuestas**: Convierte respuestas del SDK al formato esperado
- **Gestión de tokens**: Sincroniza automáticamente los tokens entre SDK y localStorage

### 2. AdapterConfig (`/sdk/adapters/adapter-config.js`)

Sistema de configuración centralizado para controlar toda la migración:

```javascript
// Configuración principal
{
  sdk: {
    enabled: false,              // Habilitar/deshabilitar SDK globalmente
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    debug: false
  },
  
  adapters: {
    movimientos: { enabled: false },  // Control por servicio
    auth: { enabled: false },
    usuarios: { enabled: false },
    reportes: { enabled: false }
  },
  
  migration: {
    phase: 'disabled',          // disabled, testing, partial, full
    rolloutPercentage: 0,       // % de usuarios que usan SDK
    featureFlags: {
      'sdk-movimientos': false  // Flags granulares por funcionalidad
    }
  }
}
```

#### Funciones de configuración:

- **Variables de entorno**: Configuración desde `REACT_APP_*`
- **localStorage**: Configuración persistente del usuario
- **Rollout gradual**: Control por porcentaje de usuarios
- **Feature flags**: Habilitar funcionalidades específicas

### 3. Sistema de Migración (`/sdk/migrate-to-adapter.js`)

Script interactivo para facilitar el proceso de migración:

#### Modos de migración:

1. **🟦 SEGURO**: Solo instala adaptadores sin activarlos
2. **🟨 TESTING**: Habilita para pruebas locales solamente
3. **🟧 GRADUAL**: Rollout automático del 10% de usuarios
4. **🟥 COMPLETO**: Migración inmediata para todos
5. **❓ MANUAL**: Configuración personalizada paso a paso

## 🚀 Guía de Implementación

### Paso 1: Ejecutar Migración

```bash
# Desde el directorio raíz del proyecto
cd sdk
node migrate-to-adapter.js
```

El script te guiará interactivamente a través de:
- Verificación de prerequisitos
- Respaldo automático de servicios originales  
- Instalación de adaptadores
- Configuración según el modo seleccionado
- Pruebas básicas de compatibilidad

### Paso 2: Configuración Manual (Opcional)

Si prefieres configurar manualmente:

```javascript
// En tu código frontend
import adapterConfig from './services/adapter-config.js';

// Habilitar SDK gradualmente
adapterConfig.enableSDK();
adapterConfig.setMigrationPhase('testing');
adapterConfig.setRolloutPercentage(10);

// Feature flags específicos
adapterConfig.setFeatureFlag('sdk-movimientos', true);
```

### Paso 3: Actualizar Imports (Cuando esté listo)

```javascript
// ANTES (servicio original)
import { getMovimientos, createMovimiento } from './movimientosService.js';

// DESPUÉS (adaptador)  
import { getMovimientos, createMovimiento } from './movimientos-adapter.js';

// La interfaz es IDÉNTICA - no se requieren cambios en el código
```

## 🎛️ Control y Monitoreo

### Dashboard de Monitoreo

Abre `/sdk/adapters/monitoring-dashboard.html` para ver:

- Estado actual del SDK (habilitado/deshabilitado)
- Número de requests usando SDK vs fallback
- Tasa de éxito general
- Porcentaje de rollout actual
- Logs de transiciones recientes

### Control Programático

```javascript
// Obtener estadísticas del adaptador
const stats = getAdapterStats();
console.log(stats);
// {
//   sdkEnabled: true,
//   sdkInitialized: true, 
//   fallbackMode: false,
//   sdkStats: { totalRequests: 150, successRate: 0.97 }
// }

// Habilitar/deshabilitar en tiempo real
enableSDK();   // Habilita SDK para este usuario
disableSDK();  // Deshabilita y usa método original

// Actualizar token automáticamente
updateToken(newToken);  // Sincroniza con SDK
```

### Logs y Debugging

```javascript
// Habilitar logging detallado
localStorage.setItem('adapter_debug', 'true');

// Los logs aparecerán en consola:
// ✅ [MovimientosAdapter] SDK inicializado exitosamente
// ℹ️ [MovimientosAdapter] Intentando getMovimientos con SDK  
// ⚠️ [MovimientosAdapter] Fallback a método original para getMovimientos
```

## 🔧 Configuración por Entorno

### Desarrollo

```bash
# .env.development
REACT_APP_SDK_ENABLED=true
REACT_APP_MIGRATION_PHASE=testing  
REACT_APP_SDK_DEBUG=true
REACT_APP_ROLLOUT_PERCENTAGE=100
```

### Staging/Testing

```bash
# .env.staging
REACT_APP_SDK_ENABLED=true
REACT_APP_MIGRATION_PHASE=partial
REACT_APP_ROLLOUT_PERCENTAGE=25
REACT_APP_SDK_DEBUG=false
```

### Producción

```bash
# .env.production  
REACT_APP_SDK_ENABLED=false  # Inicialmente deshabilitado
REACT_APP_MIGRATION_PHASE=disabled
REACT_APP_ROLLOUT_PERCENTAGE=0
```

## 🧪 Testing y Validación

### Pruebas Automáticas

```bash
# Ejecutar tests del adaptador
npm test -- adapters/movimientos-adapter.test.js

# Verificar compatibilidad
npm run test:compatibility
```

### Pruebas Manuales

1. **Verificar fallback**:
   ```javascript
   disableSDK();
   await getMovimientos(); // Debe usar método original
   ```

2. **Verificar SDK**:
   ```javascript
   enableSDK(); 
   await getMovimientos(); // Debe usar SDK con fallback automático
   ```

3. **Verificar nuevas funcionalidades**:
   ```javascript
   const resumen = await getResumen({ mes: 11, año: 2023 });
   const ingresos = await getIngresos({ limite: 10 });
   ```

## 📈 Estrategias de Rollout

### Rollout Conservador (Recomendado)

```
Semana 1: Testing   (0% usuarios - solo desarrollo)
Semana 2: Beta      (5% usuarios seleccionados)  
Semana 3: Parcial   (25% usuarios)
Semana 4: Mayoritario (75% usuarios)
Semana 5: Completo  (100% usuarios)
```

### Rollout Agresivo

```
Día 1: Testing   (0% - desarrollo)
Día 3: Beta      (10% usuarios)
Día 5: Completo  (100% usuarios)  
```

### Control granular por servicio

```javascript
// Migrar un servicio a la vez
adapterConfig.enableAdapter('movimientos');  // Solo movimientos usa SDK
// auth, usuarios, reportes siguen usando método original

// Después de validar movimientos:
adapterConfig.enableAdapter('auth');
// Y así sucesivamente...
```

## 🚨 Troubleshooting

### Problema: SDK no se inicializa

```javascript
// Verificar configuración
console.log(adapterConfig.getSDKConfig());

// Verificar token
console.log(localStorage.getItem('token'));

// Forzar reinicialización  
disableSDK();
enableSDK();
```

### Problema: Respuestas inconsistentes

```javascript
// Verificar adaptación de respuestas
const stats = getAdapterStats();
console.log('SDK Stats:', stats.sdkStats);

// Comparar respuesta SDK vs original
disableSDK();
const original = await getMovimientos();
enableSDK(); 
const sdk = await getMovimientos();
console.log('Original:', original);
console.log('SDK:', sdk);
```

### Problema: Alto rate de fallback

```javascript
// Verificar logs de errores
const logs = JSON.parse(localStorage.getItem('adapter_logs') || '[]');
console.log('Errores recientes:', logs.filter(l => l.level === 'error'));

// Verificar conectividad
const config = adapterConfig.getSDKConfig();
fetch(config.baseURL + '/health')
  .then(r => console.log('Backend disponible'))
  .catch(e => console.error('Backend no disponible:', e));
```

## 📋 Checklist de Migración

### Pre-migración
- [ ] FASE 1 (SDK Base) completada y funcionando
- [ ] Tests del SDK pasando (38/38)
- [ ] Frontend funcionando normalmente
- [ ] Respaldos de servicios originales creados

### Durante migración  
- [ ] Adaptadores instalados correctamente
- [ ] Configuración establecida según estrategia
- [ ] Dashboard de monitoreo funcionando
- [ ] Pruebas básicas de compatibilidad pasando

### Post-migración
- [ ] Monitoreo activo de errores
- [ ] Métricas de performance estables  
- [ ] Rollout progresivo según plan
- [ ] Documentación actualizada
- [ ] Equipo capacitado en uso del adaptador

## 🔄 Rollback Plan

Si surge algún problema:

### Rollback Inmediato (< 1 minuto)
```javascript
disableSDK();  // Instantáneo - vuelve a método original
```

### Rollback Parcial
```javascript  
adapterConfig.setRolloutPercentage(0);  // Solo afecta nuevos usuarios
```

### Rollback Completo
1. Deshabilitar adaptador por completo
2. Restaurar servicios originales desde respaldos
3. Remover imports del adaptador

### Investigación Post-Rollback
- Revisar logs del dashboard
- Analizar errores en localStorage
- Verificar conectividad backend
- Ajustar configuración y reintentar

## 📚 Recursos Adicionales

- **Código fuente**: `/sdk/adapters/`
- **Tests**: `/sdk/tests/movimientos-adapter.test.js`
- **Configuración**: `/frontend/src/services/migration-config.json`
- **Monitoreo**: `/sdk/adapters/monitoring-dashboard.html`
- **Respaldos**: `/frontend/src/services/backup/`
- **Script migración**: `/sdk/migrate-to-adapter.js`

---

## ✅ Estado Actual

🔄 **FASE 2 COMPLETADA**
- ✅ Adaptador de movimientos implementado
- ✅ Sistema de configuración centralizado
- ✅ Script de migración interactivo
- ✅ Dashboard de monitoreo
- ✅ Tests de compatibilidad
- ✅ Documentación completa

**Próximo paso**: Ejecutar migración con `node sdk/migrate-to-adapter.js` y seleccionar el modo que mejor se adapte a tu estrategia.

---

*Para soporte o preguntas sobre la migración, revisa los logs del dashboard o consulta la documentación técnica en el repositorio.*