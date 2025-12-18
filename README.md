# 💰 Sistema de Balance - Sistema de Gestión Financiera Personal

Un sistema completo de gestión financiera personal desarrollado con React y Node.js que permite llevar un control detallado de ingresos, egresos y generar reportes financieros.

## 🌟 Características Principales

- ✅ **Autenticación segura** con JWT y encriptación de contraseñas
- 💰 **Gestión de movimientos financieros** (ingresos y egresos)
- 📊 **Dashboard interactivo** con estadísticas en tiempo real
- 📈 **Reportes y análisis detallados** por categorías y períodos
- 👤 **Gestión de perfil de usuario**
- 📱 **Diseño responsive** para móviles y escritorio
- 🔍 **Filtros avanzados** para búsqueda y análisis
- 📝 **Sistema de logs** para auditoría
- 🖼️ **Subida de imágenes** para comprobantes (funcionalidad preparada)

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Habilitación de requests cross-origin
- **Helmet** - Seguridad HTTP
- **Jest** - Testing framework

### Frontend
- **React 18** - Librería de UI
- **React Router** - Navegación SPA
- **Tailwind CSS** - Framework de estilos
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** (v16 o superior)
- **MongoDB** (local o en la nube)
- **Git**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/sistema-de-balance.git
cd sistema-de-balance
```

### 2. Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/sistema-balance
# o para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/sistema-balance

# JWT Secret (cambiar por una clave segura)
JWT_SECRET=tu_clave_secreta_super_segura_aqui

# Puerto del servidor (opcional, por defecto 3000)
PORT=3000

# Entorno
NODE_ENV=development
```

### 3. Instalar Dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 4. Configurar Base de Datos

#### Opción A: MongoDB Local
1. Instalar MongoDB Community Edition
2. Iniciar el servicio MongoDB
3. La base de datos se creará automáticamente

#### Opción B: MongoDB Atlas (Recomendado)
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito
3. Obtener la cadena de conexión
4. Actualizar `MONGODB_URI` en el archivo `.env`

### 5. Ejecutar la Aplicación

#### Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
El backend estará disponible en: `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
El frontend estará disponible en: `http://localhost:3001`

#### Producción

```bash
# Construir el frontend
cd frontend
npm run build

# El backend servirá los archivos estáticos del frontend
cd ../backend
npm start
```

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📁 Estructura del Proyecto

```
sistema-de-balance/
├── backend/
│   ├── app.js                 # Aplicación principal
│   ├── package.json
│   ├── jest.config.js
│   ├── babel.config.js
│   ├── controllers/           # Controladores de rutas
│   │   ├── usuarios.controller.js
│   │   ├── movimientos.controller.js
│   │   └── logs.controller.js
│   ├── services/              # Lógica de negocio
│   │   ├── usuarios.service.js
│   │   ├── movimientos.service.js
│   │   └── logs.service.js
│   ├── routes/                # Definición de rutas
│   │   ├── index.js
│   │   ├── usuarios.js
│   │   ├── movimientos.js
│   │   └── logs.js
│   ├── middlewares/           # Middlewares personalizados
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   └── __tests__/             # Pruebas
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx            # Componente principal
│   │   ├── index.js           # Punto de entrada
│   │   ├── index.css          # Estilos globales
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── LogoutButton.jsx
│   │   ├── pages/             # Páginas de la aplicación
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── MovimientoFormPage.jsx
│   │   │   ├── ReportesPage.jsx
│   │   │   ├── IngresosPage.jsx
│   │   │   ├── EgresosPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/          # Servicios de API
│   │   │   ├── authService.js
│   │   │   ├── movimientosService.js
│   │   │   ├── userService.js
│   │   │   └── reportesService.js
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useMovimientos.js
│   │   │   ├── useFetch.js
│   │   │   └── useImageToMovimiento.js
│   │   └── __tests__/         # Pruebas del frontend
├── database/
│   ├── database.js            # Configuración de conexión
│   ├── usuario.model.js       # Modelo de usuario
│   ├── movimiento.model.js    # Modelo de movimiento
│   ├── log.model.js          # Modelo de logs
│   └── crear_usuario.js       # Script de utilidad
└── documentacion/             # Documentación adicional
```

## 🔐 API Endpoints

### Autenticación
- `POST /api/usuarios/register` - Registro de usuario
- `POST /api/usuarios/login` - Inicio de sesión
- `GET /api/usuarios/me` - Obtener perfil (requiere auth)
- `PUT /api/usuarios/me` - Actualizar perfil (requiere auth)

### Movimientos
- `GET /api/movimientos` - Listar movimientos (requiere auth)
- `POST /api/movimientos` - Crear movimiento (requiere auth)
- `PUT /api/movimientos/:id` - Actualizar movimiento (requiere auth)
- `PATCH /api/movimientos/:id/inactivar` - Inactivar movimiento (requiere auth)

### Logs
- `GET /api/logs` - Obtener logs del sistema (requiere auth)

## 👥 Uso del Sistema

### 1. Registro y Autenticación
1. Acceder a `http://localhost:3001`
2. Crear una cuenta nueva en "Registro"
3. Iniciar sesión con credenciales

### 2. Dashboard Principal
- Ver resumen de ingresos, egresos y balance
- Acceso rápido a todas las funcionalidades
- Tabla con movimientos recientes

### 3. Gestión de Movimientos
- **Nuevo Movimiento**: Crear ingresos o egresos con categorías
- **Ingresos**: Ver y gestionar todos los ingresos
- **Egresos**: Análizar gastos por categorías

### 4. Reportes y Análisis
- Filtrar por períodos y categorías
- Ver estadísticas detalladas
- Analizar tendencias de gastos

### 5. Perfil de Usuario
- Actualizar información personal
- Ver estadísticas de la cuenta
- Configuración de seguridad

## 🐛 Solución de Problemas Comunes

### Error de conexión a MongoDB
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solución**: Verificar que MongoDB esté ejecutándose o usar MongoDB Atlas.

### Puerto ya en uso
```bash
Error: listen EADDRINUSE :::3000
```
**Solución**: 
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :3000
# Matar proceso
taskkill /PID <PID> /F
```

### Problemas de CORS
**Solución**: Verificar que el frontend esté corriendo en puerto 3001 y backend en 3000.

### Variables de entorno no cargadas
**Solución**: Verificar que el archivo `.env` esté en la raíz del proyecto y tenga el formato correcto.

## 📝 Scripts Disponibles

### Backend
- `npm start` - Iniciar servidor
- `npm test` - Ejecutar pruebas
- `npm run dev` - Modo desarrollo (si se configura nodemon)

### Frontend
- `npm start` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm test` - Ejecutar pruebas
- `npm run eject` - Exponer configuración de webpack

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📋 Roadmap

- [ ] Implementar gráficos interactivos
- [ ] Exportar reportes a PDF/Excel
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Metas de ahorro
- [ ] Integración con bancos
- [ ] Aplicación móvil

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com

## 🙏 Agradecimientos

- React team por la excelente documentación
- MongoDB por la base de datos flexible
- Tailwind CSS por el sistema de diseño
- La comunidad open source

---

⭐ Si este proyecto te fue útil, ¡dale una estrella en GitHub!