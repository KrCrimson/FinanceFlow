# Sistema de Balance - Backend

> [!NOTE]
> Para una guía exhaustiva paso a paso desde cero (configuración de MongoDB Atlas, arquitectura y diccionario de documentos, catálogo de variables de entorno y troubleshooting), consulte el [MANUAL_DESPLIEGUE.md](file:///c:/Users/HP/Documents/GitHub/FinanceFlow/MANUAL_DESPLIEGUE.md).

## Despliegue Rápido en Render

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
MONGODB_URI=mongodb+srv://<USUARIO>:<PASSWORD>@cluster0.mongodb.net/<NOMBRE_DB>
JWT_SECRET=tu_jwt_secret_personalizado_aqui
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://financeflow-frontend.vercel.app
GEMINI_API_KEY=tu_api_key_de_gemini
CULQI_SECRET_KEY=sk_test_tu_llave_secreta_de_culqi
```

### 3. Configuración de Build
- Build Command: `npm install`
- Start Command: `npm start`
- Node Version: 18.x

### API Endpoints
- Base URL: https://financeflow-backend-4fbw.onrender.com
- Auth: `/api/usuarios/login`, `/api/usuarios/register`
- Movimientos: `/api/movimientos`
- Logs: `/api/logs`