# Sistema de Balance - Frontend

## Despliegue en Vercel

### 1. Preparar el proyecto
1. Asegúrate de que el build funcione: `npm run build`
2. Configura las variables de entorno

### 2. Variables de entorno en Vercel
Ve a tu proyecto en Vercel → Settings → Environment Variables:

```
REACT_APP_API_URL=https://tu-backend.onrender.com
```

### 3. Configuración automática
Vercel detecta automáticamente proyectos React. Configuración por defecto:
- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

### 4. Desplegar
1. Conecta tu repositorio de GitHub a Vercel
2. Selecciona la carpeta `frontend` como root directory
3. Añade las variables de entorno
4. ¡Deploy!

### 5. Configurar dominio personalizado (opcional)
En Vercel → Settings → Domains → Add

### URLs importantes
- Frontend: https://tu-app.vercel.app
- Backend API: configurado en REACT_APP_API_URL