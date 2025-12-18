# Sistema de Balance - Backend

## Despliegue en Render

### 1. Crear cuenta en MongoDB Atlas
1. Ve a https://cloud.mongodb.com
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (elige la región más cercana)
4. En "Database Access" → Crea un usuario con contraseña
5. En "Network Access" → Añade "0.0.0.0/0" (permitir todas las IPs)
6. En "Connect" → Copia la connection string

### 2. Configurar variables de entorno en Render
1. Ve a https://render.com
2. Conecta tu repositorio de GitHub
3. En "Environment Variables" añade:

```
MONGODB_URI=tu_connection_string_de_atlas
JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://tu-frontend.vercel.app
```

### 3. Configuración de Build
- Build Command: `npm install`
- Start Command: `npm start`
- Node Version: 18.x

### API Endpoints
- Base URL: https://tu-backend.onrender.com
- Auth: `/api/usuarios/login`, `/api/usuarios/register`
- Movimientos: `/api/movimientos`
- Logs: `/api/logs`