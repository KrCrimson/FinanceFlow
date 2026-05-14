# Mapeo Arquitectónico: FinanceFlow v1.0
## Alineación entre SAD y Estructura del Repositorio Real

**Versión:** 1.0 | **Sprint:** 1  
**Objetivo:** Documentar la correspondencia exacta entre los componentes descritos en el SAD y los archivos reales en el repositorio GitHub

---

## 1. Estructura del Repositorio (Realidad)

```
FinanceFlow/
├── backend/                          # Backend: Express.js + Node.js
│   ├── app.js                        # Punto de entrada del servidor
│   ├── package.json                  # Dependencias backend
│   ├── controllers/
│   │   ├── usuarios.controller.js    # Lógica autenticación
│   │   ├── movimientos.controller.js # Lógica CRUD movimientos
│   │   └── logs.controller.js        # Lógica logging
│   ├── services/
│   │   ├── usuarios.service.js       # Servicios autenticación
│   │   ├── movimientos.service.js    # Servicios movimientos
│   │   └── logs.service.js           # Servicios logging
│   ├── middlewares/
│   │   ├── auth.js                   # JWT validation
│   │   ├── errorHandler.js           # Global error handler
│   │   └── validation.js             # Input validation
│   ├── routes/
│   │   ├── index.js                  # Router principal
│   │   ├── usuarios.js               # Rutas autenticación
│   │   ├── movimientos.js            # Rutas CRUD movimientos
│   │   └── logs.js                   # Rutas logging
│   ├── database/
│   │   ├── usuario.model.js          # Modelo Mongoose Usuario
│   │   ├── movimiento.model.js       # Modelo Mongoose Movimiento
│   │   ├── log.model.js              # Modelo Mongoose Log
│   │   └── database.js               # Configuración MongoDB
│   ├── __tests__/
│   │   ├── usuarios.controller.test.js
│   │   ├── movimientos.controller.test.js
│   │   └── e2e.test.js
│   ├── jest.config.js                # Configuración Jest
│   └── .env.example                  # Variables de entorno
│
├── frontend/                         # Frontend: React.js
│   ├── public/
│   │   └── index.html                # HTML raíz
│   ├── src/
│   │   ├── App.jsx                   # Componente raíz
│   │   ├── index.js                  # Punto entrada React
│   │   ├── index.css                 # Estilos globales
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx    # Protección de rutas
│   │   │   ├── Navbar.jsx            # Navegación
│   │   │   ├── Graficos.jsx          # Gráficos Recharts
│   │   │   ├── AlertasComponent.jsx  # Sistema alertas
│   │   │   ├── LogoutButton.jsx      # Botón logout
│   │   │   └── DevLogger.jsx         # Logger desarrollo
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx         # Vista login
│   │   │   ├── RegisterPage.jsx      # Vista registro
│   │   │   ├── DashboardPage.jsx     # Dashboard análisis
│   │   │   ├── IngresosPage.jsx      # Vista ingresos
│   │   │   ├── EgresosPage.jsx       # Vista egresos
│   │   │   ├── MovimientoFormPage.jsx# Formulario universal
│   │   │   ├── ReportesPage.jsx      # Vista reportes
│   │   │   ├── ProfilePage.jsx       # Perfil usuario
│   │   │   ├── ForgotPasswordPage.jsx# Reset password
│   │   │   ├── ResetPasswordPage.jsx # Recuperar password
│   │   │   └── NotFoundPage.jsx      # 404
│   │   ├── hooks/
│   │   │   ├── useAuth.js            # Hook autenticación
│   │   │   ├── useFetch.js           # Hook HTTP client
│   │   │   ├── useMovimientos.js     # Hook movimientos
│   │   │   ├── useAnalisisGastos.js  # Hook análisis
│   │   │   └── useImageToMovimiento.js # Hook OCR
│   │   ├── services/
│   │   │   ├── authService.js        # Servicio autenticación
│   │   │   ├── movimientosService.js # Servicio movimientos
│   │   │   ├── reportesService.js    # Servicio reportes
│   │   │   └── userService.js        # Servicio usuario
│   │   ├── sdk/                      # 🆕 Capa SDK
│   │   │   ├── index.js              # Entrada SDK
│   │   │   ├── adapter.js            # Patrón adaptador
│   │   │   ├── featureFlags.js       # Feature flags
│   │   │   └── logger.js             # Logger SDK
│   │   ├── utils/                    # Utilidades
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   ├── __tests__/
│   │   │   └── [tests unitarios]
│   │   └── setupTests.js             # Configuración Jest
│   ├── package.json                  # Dependencias frontend
│   ├── tailwind.config.js            # Configuración Tailwind CSS
│   └── .env.example
│
├── ml_backend/                       # Microservicio ML: Python + FastAPI
│   ├── main.py                       # Servidor FastAPI
│   ├── train_model.py                # Script entrenamiento
│   ├── Dockerfile                    # Containerización
│   ├── requirements.txt              # Dependencias Python
│   └── [módulos OCR, clasificador]
│
├── sdk/                              # 🔴 NOTA: Carpeta raíz /sdk (puede estar duplicada)
│   ├── adapters/
│   ├── examples/
│   ├── src/
│   ├── tests/
│   └── [otros archivos de migración]
│
├── mobile/                           # App móvil (scaffold, no implementada)
│   ├── App.js
│   └── package.json
│
├── database/                         # 🔴 NOTA: Duplicado backend/database
│   ├── usuario.model.js
│   ├── movimiento.model.js
│   └── [otros modelos]
│
├── documentacion/                    # Documentación adicional
│   ├── arquitectura_tecnologias.md
│   ├── backend_estructura.md
│   ├── frontend_estructura.md
│   └── [otros docs]
│
├── G03-FinanceFlow-FD03-Documento de SRS/    # 📋 SRS oficial
│   ├── G03-FinanceFlow-FD03-Documento de SRS.md
│   └── GUIA_CLIENTE_FINANCEFLOW.md           # 🆕 Guía cliente
│
├── G03-FinanceFlow-FD04-Documento SAD/       # 📋 SAD oficial
│   └── G03-FinanceFlow-FD04-Documento SAD.md
│
├── Planificación de Sprints Backlog/         # 📋 Planificación
│   └── Planificación de Sprints Backlog.md
│
└── [otros archivos de proyecto]
```

---

## 2. Mapeo: Componentes SAD ↔ Archivos Reales

### **2.1 Vista de Implementación (Desarrollo)**

| Componente SAD | Archivo Real | Tipo | Estado |
|---|---|---|---|
| **Frontend SPA (React)** | `frontend/src/App.jsx` | Componente raíz | ✅ Implementado |
| Pages (Vistas) | `frontend/src/pages/*.jsx` | Vista React | ✅ Implementado |
| Components (Componentes) | `frontend/src/components/*.jsx` | Componente React | ✅ Implementado |
| Hooks (Lógica React) | `frontend/src/hooks/*.js` | Custom hooks | ✅ Implementado |
| Services (Capa HTTP) | `frontend/src/services/*.js` | Cliente API | ✅ Implementado |
| **SDK / Adaptador** | `frontend/src/sdk/adapter.js` | Patrón adaptador | ✅ Implementado |
| Feature Flags | `frontend/src/sdk/featureFlags.js` | Configuración | ✅ Implementado |
| **Backend API (Express)** | `backend/app.js` | Servidor Express | ✅ Implementado |
| Controladores | `backend/controllers/*.js` | Controlador (handlers) | ✅ Implementado |
| Servicios Backend | `backend/services/*.js` | Lógica negocio | ✅ Implementado |
| Rutas API | `backend/routes/*.js` | Enrutador Express | ✅ Implementado |
| Middlewares | `backend/middlewares/*.js` | Middleware Express | ✅ Implementado |
| **Modelos Mongoose** | `backend/database/*.model.js` | ODM Mongoose | ✅ Implementado |
| Configuración BD | `backend/database/database.js` | Conexión MongoDB | ✅ Implementado |
| **Microservicio ML** | `ml_backend/main.py` | FastAPI app | ✅ Implementado |
| Motor OCR | `ml_backend/[ocr_module]` | Tesseract + regex | ✅ Implementado |
| Clasificador ML | `ml_backend/classifier.py` | Scikit-Learn Naive Bayes | ✅ Implementado |

### **2.2 Vista de Casos de Uso**

| Caso de Uso | Componentes Implicados | Archivos |
|---|---|---|
| **CU-01: Registrar Usuario** | Frontend + Backend Auth | `RegisterPage.jsx`, `usuarios.controller.js`, `usuarios.service.js`, `usuario.model.js` |
| **CU-02: Iniciar Sesión** | Frontend + Backend Auth | `LoginPage.jsx`, `usuarios.controller.js`, `auth.js (middleware)` |
| **CU-03: Registrar Movimiento** | Frontend + Backend | `MovimientoFormPage.jsx`, `movimientos.controller.js`, `movimiento.model.js` |
| **CU-04: Ver Dashboard** | Frontend | `DashboardPage.jsx`, `useAnalisisGastos.js`, `Graficos.jsx` |
| **CU-05: Listar Movimientos** | Frontend + Backend | `IngresosPage.jsx`, `EgresosPage.jsx`, `movimientos.controller.js` |
| **CU-08: Generar Reportes** | Frontend + Backend | `ReportesPage.jsx`, `reportesService.js` |
| **CU-13: Escanear Recibo (OCR)** | Frontend + ML Backend | `MovimientoFormPage.jsx`, `ml_backend/main.py` |

### **2.3 Vista Lógica (Modelos de Dominio)**

| Entidad | Modelo Mongoose | Ubicación | Campos Principales |
|---|---|---|---|
| **Usuario** | `Usuario` | `backend/database/usuario.model.js` | id, nombre, email, passwordHash, estado, creadoEn, actualizadoEn |
| **Movimiento** | `Movimiento` | `backend/database/movimiento.model.js` | id, userId, nombre, monto, tipo, categoría, fecha, estado |
| **Log** | `Log` | `backend/database/log.model.js` | id, level, message, stack, endpoint, method, statusCode, userId, timestamp |

### **2.4 Vista de Procesos (Flujos de Ejecución)**

| Proceso | Componentes Orquestadores | Archivo de Control |
|---|---|---|
| **Flujo Registro** | React → SDK → Express → bcryptjs → MongoDB | `RegisterPage.jsx` + `usuarios.service.js` |
| **Flujo Registro Movimiento** | React → Express → Mongoose → MongoDB | `MovimientoFormPage.jsx` + `movimientos.service.js` |
| **Flujo OCR** | React → ml_backend → Tesseract → regex | `useImageToMovimiento.js` + `ml_backend/main.py` |
| **Flujo Silent Training** | Express → ml_backend → Scikit-Learn → model.pkl | `movimientos.service.js` → `/retrain` (async) |

### **2.5 Vista de Despliegue (Infraestructura)**

| Componente | Plataforma | Configuración | Archivos |
|---|---|---|---|
| **Frontend** | Vercel | Build: `npm run build` (create-react-app) | `.env`, `package.json` |
| **Backend** | Render | Node.js 18, Deploy from GitHub | `backend/.env`, `backend/package.json` |
| **ML Backend** | Render | Python 3.10, FastAPI Dockerfile | `ml_backend/Dockerfile`, `requirements.txt` |
| **Base de Datos** | MongoDB Atlas | Cluster M0 gratuito | `backend/database/database.js` |

---

## 3. Inconsistencias Identificadas y Recomendaciones

### ⚠️ **Inconsistencia 1: Duplicación de /sdk**
- **Problema:** Existe `frontend/src/sdk/` Y una carpeta raíz `/sdk/`
- **Realidad:** El SDK activo está en `frontend/src/sdk/`
- **Recomendación:** 
  - Mantener `frontend/src/sdk/` como SDK de producción
  - Usar `/sdk/` para ejemplos, migraciones y documentación
  - Aclarar en el README que `frontend/src/sdk/adapter.js` es el SDK activo

### ⚠️ **Inconsistencia 2: Duplicación de /database**
- **Problema:** Existe `backend/database/` Y una carpeta raíz `/database/`
- **Realidad:** Los modelos activos están en `backend/database/`
- **Recomendación:**
  - Usar `backend/database/` como fuente de verdad
  - Carpeta raíz `/database/` puede ser referencia histórica
  - En futuras migraciones, eliminar duplicado

### ⚠️ **Inconsistencia 3: Modelos Backend vs Estructura SAD**
- **Problema:** SAD menciona `usuario.model.js` pero no documenta `resetPasswordToken` y `resetPasswordExpires`
- **Realidad:** Campos existen en `usuario.model.js` para recuperación de password
- **Recomendación:** 
  - Actualizar diagrama de clases en SAD para reflejar todos los campos
  - Documentar campos opcionales (estado `['activo', 'inactivo']`)

### ⚠️ **Inconsistencia 4: Servicios Frontend vs Backend**
- **Problema:** SAD diferencia entre `servicios frontend` y `servicios backend`, pero nombrado inconsistentemente
- **Realidad:** 
  - Frontend: `authService.js`, `movimientosService.js`, `reportesService.js`
  - Backend: `usuarios.service.js`, `movimientos.service.js`, `logs.service.js`
- **Recomendación:** Documentar claramente la diferencia (Frontend = HTTP wrapper, Backend = Lógica negocio)

---

## 4. Correspondencia: SRS → SAD → Código Real

### **Ejemplo: RF-16 (Registro de Usuario)**

```
┌─────────────────────────────────────┐
│ SRS §V.c                            │
│ RF-16: Autenticación y seguridad   │
│ - Registro con email único         │
│ - Hash bcryptjs                    │
│ - JWT firmado                      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ SAD §2.1.1                          │
│ RF-01: Registro con email único    │
│ - bcryptjs 10 salt rounds          │
│ - Mongoose ODM                     │
│ - Express API                      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ CÓDIGO REAL (Repo)                  │
│                                     │
│ Frontend:                           │
│ └─ RegisterPage.jsx                 │
│    └─ authService.register()        │
│       └─ POST /api/auth/register    │
│                                     │
│ Backend:                            │
│ └─ usuarios.controller.js           │
│    └─ usuarios.service.register()   │
│       └─ bcrypt.hash()              │
│       └─ Usuario.create()           │
│                                     │
│ BD:                                 │
│ └─ usuario.model.js                 │
│    └─ { nombre, email, passwordHash } │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. Recomendaciones para Mejora de Documentación

### 📌 **Para el SAD**
1. Actualizar diagramas de clases para incluir ALL campos reales de Mongoose
2. Documentar explícitamente que `/sdk/` es histórico vs `frontend/src/sdk/` activo
3. Agregar tabla de trazabilidad SRS → Archivos reales
4. Incluir rutas exactas de API endpoints con ejemplos curl

### 📌 **Para el SRS**
1. Crear diagrama de flujo paso a paso para CU-01 (ya hecho)
2. Documentar campos opcionales y por defecto en cada entidad
3. Especificar valores de enumeración de "Categoría" en RN-08

### 📌 **Para la Planificación de Sprints**
1. Actualizar inventario de componentes con rutas exactas
2. Mapear componentes a archivos en PR evidencia
3. Definir criterios de aceptación basados en archivos modificados

---

## 6. Script de Validación de Arquitectura

```bash
# Verificar que los archivos del SAD existen en el repo
ARCHIVOS_ESPERADOS=(
  "backend/app.js"
  "backend/controllers/usuarios.controller.js"
  "backend/services/usuarios.service.js"
  "backend/database/usuario.model.js"
  "frontend/src/pages/RegisterPage.jsx"
  "frontend/src/services/authService.js"
  "frontend/src/sdk/adapter.js"
  "ml_backend/main.py"
)

for archivo in "${ARCHIVOS_ESPERADOS[@]}"; do
  if [ -f "$archivo" ]; then
    echo "✅ $archivo"
  else
    echo "❌ FALTA: $archivo"
  fi
done
```

---

## 7. Conclusión

La arquitectura real del repositorio FinanceFlow alinea muy bien con los componentes descritos en el SAD v1.0. Las inconsistencias identificadas son menores (duplicación de carpetas para referencias históricas) y no afectan la operación del sistema. 

**Recomendación:** Mantener el SAD como documento de referencia arquitectónica, pero crear este mapeo como documento vivo que se actualice con cada sprint para garantizar que el SAD siga siendo fuente de verdad.

---

**Versión:** 1.0  
**Última actualización:** 13 de Mayo, 2026  
**Responsable:** Equipo FinanceFlow
