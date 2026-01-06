/**
 * 🔄 Ejemplo de Migración al SDK
 * 
 * Este archivo muestra cómo migrar gradualmente desde el sistema actual
 * usando servicios directos hacia el SDK wrapper.
 */

import BalanceSDK from '../src/index.js';

// Configuración del SDK
const sdk = new BalanceSDK({
  baseURL: 'http://localhost:3000/api',
  timeout: 15000
});

/**
 * ============================================================================
 * ANTES: Usando movimientosService directamente
 * ============================================================================
 */

// Método anterior con fetch manual
const movimientosServiceOld = {
  async getAll(filtros = {}) {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams(filtros);
    
    try {
      const response = await fetch(`http://localhost:3000/api/movimientos?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      throw error;
    }
  }
};

/**
 * ============================================================================
 * DESPUÉS: Usando SDK
 * ============================================================================
 */

// Nuevo método con SDK
const movimientosServiceNew = {
  async getAll(filtros = {}) {
    try {
      const result = await sdk.movimientos.getAll(filtros);
      return result;
    } catch (error) {
      console.error('Error al obtener movimientos:', error.message);
      throw error;
    }
  }
};

/**
 * ============================================================================
 * PATRÓN ADAPTADOR para Migración Gradual
 * ============================================================================
 */

class MovimientosAdapter {
  constructor(useSDK = false) {
    this.useSDK = useSDK;
    this.sdk = sdk;
  }

  async getAll(filtros = {}) {
    if (this.useSDK) {
      // Usar SDK nuevo
      const result = await this.sdk.movimientos.getAll(filtros);
      return result.movimientos; // Adaptar respuesta
    } else {
      // Usar método anterior
      return await movimientosServiceOld.getAll(filtros);
    }
  }

  async create(movimiento) {
    if (this.useSDK) {
      const result = await this.sdk.movimientos.create(movimiento);
      return result.movimiento;
    } else {
      // Implementación anterior...
      return await this.createOldWay(movimiento);
    }
  }

  // Método para cambiar entre implementaciones
  enableSDK() {
    this.useSDK = true;
    console.log('🚀 SDK habilitado');
  }

  disableSDK() {
    this.useSDK = false;
    console.log('🔄 Volviendo al método anterior');
  }

  async createOldWay(movimiento) {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:3000/api/movimientos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movimiento)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      throw error;
    }
  }
}

/**
 * ============================================================================
 * EJEMPLO DE USO EN COMPONENTE REACT
 * ============================================================================
 */

// Hook personalizado para usar en React
export function useMovimientosSDK() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configurar token en el SDK cuando esté disponible
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      sdk.setToken(token);
    }
  }, []);

  const obtenerMovimientos = async (filtros = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await sdk.movimientos.getAll(filtros);
      setMovimientos(result.movimientos);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const crearMovimiento = async (movimiento) => {
    try {
      const result = await sdk.movimientos.create(movimiento);
      // Actualizar lista local
      await obtenerMovimientos();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    movimientos,
    loading,
    error,
    obtenerMovimientos,
    crearMovimiento,
    sdk // Exponer SDK para operaciones avanzadas
  };
}

/**
 * ============================================================================
 * MIGRACIÓN STEP-BY-STEP
 * ============================================================================
 */

export class MigrationManager {
  constructor() {
    this.features = {
      auth: false,
      movimientos: false,
      usuarios: false,
      reportes: false
    };
  }

  // Habilitar SDK para un módulo específico
  enableSDKForModule(module) {
    if (this.features.hasOwnProperty(module)) {
      this.features[module] = true;
      console.log(`✅ SDK habilitado para: ${module}`);
      
      // Guardar en localStorage para persistir
      localStorage.setItem('sdk_features', JSON.stringify(this.features));
    }
  }

  // Deshabilitar SDK para rollback
  disableSDKForModule(module) {
    if (this.features.hasOwnProperty(module)) {
      this.features[module] = false;
      console.log(`🔄 SDK deshabilitado para: ${module}`);
      
      localStorage.setItem('sdk_features', JSON.stringify(this.features));
    }
  }

  // Verificar si un módulo debe usar SDK
  shouldUseSDK(module) {
    return this.features[module] || false;
  }

  // Cargar configuración guardada
  loadConfiguration() {
    const saved = localStorage.getItem('sdk_features');
    if (saved) {
      this.features = { ...this.features, ...JSON.parse(saved) };
    }
  }

  // Migración completa
  enableAllModules() {
    Object.keys(this.features).forEach(module => {
      this.enableSDKForModule(module);
    });
    console.log('🚀 Migración completa al SDK');
  }

  // Rollback completo
  disableAllModules() {
    Object.keys(this.features).forEach(module => {
      this.disableSDKForModule(module);
    });
    console.log('🔄 Rollback completo - usando métodos anteriores');
  }
}

/**
 * ============================================================================
 * EJEMPLO DE IMPLEMENTACIÓN EN FRONTEND
 * ============================================================================
 */

// Instancia global del manager
export const migrationManager = new MigrationManager();

// Función para inicializar SDK en la app
export async function initializeSDK() {
  try {
    // Cargar configuración de migración
    migrationManager.loadConfiguration();
    
    // Configurar token si existe
    const token = localStorage.getItem('token');
    if (token) {
      sdk.setToken(token);
      
      // Verificar que el token sea válido
      const userInfo = await sdk.auth.me();
      console.log('✅ SDK inicializado con usuario:', userInfo.user.nombre);
    }
    
    console.log('🚀 SDK configurado exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando SDK:', error.message);
    return false;
  }
}

// Exportar SDK configurado
export { sdk };