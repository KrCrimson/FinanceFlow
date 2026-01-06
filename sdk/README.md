# 🚀 Sistema de Balance SDK

SDK oficial para el Sistema de Balance. Simplifica el consumo de la API con una interfaz limpia y consistente.

## 🏗️ Instalación

```bash
npm install @sistema-balance/sdk
```

## ⚡ Uso Rápido

```javascript
import BalanceSDK from '@sistema-balance/sdk';

// Configurar el SDK
const sdk = new BalanceSDK({
  baseURL: 'http://localhost:3000/api',
  token: 'tu-jwt-token' // Opcional
});

// Login y configuración automática del token
const { user, token } = await sdk.login('email@ejemplo.com', 'password');

// Usar los módulos
const movimientos = await sdk.movimientos.getAll();
const balance = await sdk.reportes.getBalance();
```

## 📦 Módulos Disponibles

### 🔐 Autenticación (`sdk.auth`)
```javascript
// Login
const result = await sdk.auth.login('email', 'password');

// Registro
const user = await sdk.auth.register({
  nombre: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  password: 'password123'
});

// Recuperar contraseña
await sdk.auth.forgotPassword('email@ejemplo.com');

// Reset contraseña
await sdk.auth.resetPassword('token', 'nuevaPassword');
```

### 💰 Movimientos (`sdk.movimientos`)
```javascript
// Obtener todos los movimientos
const movimientos = await sdk.movimientos.getAll();

// Filtrar por tipo y fecha
const ingresos = await sdk.movimientos.getIngresos({
  fechaInicio: '2024-01-01',
  fechaFin: '2024-12-31'
});

// Crear nuevo movimiento
const nuevoMovimiento = await sdk.movimientos.create({
  tipo: 'ingreso',
  categoria: 'Salario',
  monto: 5000,
  descripcion: 'Salario enero'
});

// Resumen financiero
const resumen = await sdk.movimientos.getResumen({ mes: '2024-01' });
```

### 👤 Usuarios (`sdk.usuarios`)
```javascript
// Obtener perfil
const perfil = await sdk.usuarios.getProfile();

// Actualizar perfil
await sdk.usuarios.updateProfile({
  nombre: 'Nuevo Nombre'
});

// Cambiar contraseña
await sdk.usuarios.changePassword('actual', 'nueva');

// Obtener estadísticas
const stats = await sdk.usuarios.getStats();
```

### 📊 Reportes (`sdk.reportes`)
```javascript
// Dashboard principal
const dashboard = await sdk.reportes.getDashboard();

// Reporte mensual
const reporteMensual = await sdk.reportes.getReporteMensual('2024', '01');

// Análisis por categorías
const analisis = await sdk.reportes.getGastosPorCategoria();

// Tendencias temporales
const tendencias = await sdk.reportes.getTendencias({
  periodo: '6m',
  granularidad: 'mes'
});
```

## ⚙️ Configuración Avanzada

```javascript
const sdk = new BalanceSDK({
  baseURL: 'https://api.midominio.com',
  timeout: 15000,
  headers: {
    'X-Custom-Header': 'valor'
  }
});

// Configurar token después de la inicialización
sdk.setToken('jwt-token');

// Verificar autenticación
if (sdk.isAuthenticated()) {
  console.log('Usuario autenticado');
}

// Obtener estadísticas del SDK
const stats = sdk.getStats();
console.log(`Requests realizadas: ${stats.requests}`);
```

## 🔄 Manejo de Errores

```javascript
try {
  const movimientos = await sdk.movimientos.getAll();
  console.log('✅ Éxito:', movimientos.data);
} catch (error) {
  console.error('❌ Error:', error.message);
  
  // Información detallada del error
  console.log('Status:', error.status);
  console.log('Tipo:', error.type);
  console.log('URL:', error.url);
}
```

## 🏗️ Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Ejecutar en modo desarrollo
npm run dev

# Generar documentación
npm run docs
```

## 📝 Características

- ✅ **Interfaz Consistente**: API unificada para todos los endpoints
- ✅ **Manejo de Errores**: Errores estructurados y informativos
- ✅ **TypeScript Ready**: Tipado completo para mejor DX
- ✅ **Interceptors**: Logging automático y manejo de requests/responses
- ✅ **Estadísticas**: Métricas de uso del SDK
- ✅ **Configuración Flexible**: Adaptable a diferentes entornos
- ✅ **Modular**: Usa solo lo que necesitas

## 🚦 Estados de Respuesta

Todas las respuestas del SDK siguen este formato:

```javascript
// Éxito
{
  success: true,
  data: {...}, // Datos específicos según el endpoint
  message: "Descripción de la operación"
}

// Error
{
  success: false,
  message: "Descripción del error",
  status: 400,
  type: "response_error"
}
```

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.