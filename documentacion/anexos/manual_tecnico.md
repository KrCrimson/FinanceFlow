# Manual Técnico - FinanceFlow

Este manual proporciona las especificaciones e instrucciones detalladas para la instalación, configuración, ejecución y mantenimiento técnico del sistema **FinanceFlow**.

## 1. Requisitos del Entorno

Para ejecutar y compilar el proyecto completo, el servidor host o máquina de desarrollo local debe contar con:
- **Node.js:** Versión 18.x o superior.
- **npm:** Versión 9.x o superior.
- **Python:** Versión 3.10.x para el microservicio de IA.
- **Tesseract OCR:** Binario ejecutable instalado en el sistema operativo y agregado al PATH (requerido por pytesseract para la lectura de caracteres).
- **MongoDB:** Cuenta o cluster en MongoDB Atlas, o instalación local de MongoDB Community Server.

---

## 2. Configuración de Variables de Entorno (`.env`)

Se deben crear y configurar archivos de variables de entorno para los servicios del backend y frontend:

### Backend REST API (`/backend/.env`)
```ini
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/financeflow
JWT_SECRET=tu_clave_secreta_jwt_de_alta_entropia
EMAIL_USER=tu_correo_de_recuperacion@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_nodemailer
```

### Frontend React SPA (`/frontend/.env`)
```ini
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 3. Instalación de Dependencias e Inicio de Servicios

El monorepo está dividido en tres directorios principales. La instalación y ejecución se realiza de manera independiente para cada uno:

### 3.1 Backend REST API (Node/Express)
1. Ingrese al directorio de la API:
   ```bash
   cd backend
   ```
2. Instale los paquetes necesarios:
   ```bash
   npm install
   ```
3. Inicie el servidor (tanto en desarrollo como en producción se utiliza):
   ```bash
   npm start
   ```

### 3.2 Frontend (React SPA)
1. Ingrese al directorio del cliente:
   ```bash
   cd frontend
   ```
2. Instale los paquetes necesarios:
   ```bash
   npm install
   ```
3. Ejecute el servidor de desarrollo local (Create React App):
   ```bash
   npm start
   ```

### 3.3 ML Backend (FastAPI / Python)
1. Ingrese al directorio del microservicio inteligente:
   ```bash
   cd ml_backend
   ```
2. Cree e inicie un entorno virtual e instale los requerimientos:
   ```bash
   python -m venv venv
   # En Windows:
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Levante el servidor FastAPI con Uvicorn:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

---

## 4. Estructura de Directorios del Monorepo

```
FinanceFlow/
├── backend/                  # API REST en Node.js + Express
│   ├── database/             # Esquemas de Mongoose (usuario.model.js, movimiento.model.js)
│   ├── routes/               # Enrutadores Express (usuarios.js, movimientos.js)
│   ├── controllers/          # Controladores MVC (usuarios.controller.js, movimientos.controller.js)
│   ├── services/             # Lógica de negocio (usuarios.service.js, movimientos.service.js)
│   ├── middlewares/          # Interceptores (auth.js, validation.js, errorHandler.js)
│   ├── app.js                # Archivo principal de inicialización de la API
│   └── package.json          # Dependencias y scripts del backend
├── frontend/                 # Aplicación SPA en React 18
│   ├── src/
│   │   ├── components/       # Componentes React (Graficos.jsx, AlertasComponent.jsx, etc.)
│   │   ├── pages/            # Vistas SPA (LoginPage.jsx, DashboardPage.jsx, etc.)
│   │   ├── hooks/            # Hooks de estado (useAuth.js, useAnalisisGastos.js, etc.)
│   │   ├── services/         # Adaptadores HTTP Axios (authService.js, movimientosService.js)
│   │   ├── App.js            # Enrutamiento React Router DOM
│   │   └── index.js          # Punto de entrada de renderizado React
│   └── package.json          # Dependencias y scripts del frontend
├── ml_backend/               # Servidor de Inteligencia Artificial (FastAPI)
│   ├── main.py               # API, OCR OpenCV+Tesseract y predicción Naive Bayes
│   ├── train_model.py        # Script de entrenamiento del clasificador TF-IDF
│   └── requirements.txt      # Librerías de Python (fastapi, scikit-learn, pytesseract, etc.)
└── documentacion/            # Informes y Anexos técnicos del proyecto
```

---

## 5. Pruebas Automáticas y Aseguramiento

El sistema cuenta con una suite formal de **94 casos de prueba** automatizados.
- Para ejecutar las pruebas unitarias y de integración de la API REST del backend:
  ```bash
  cd backend
  npm test
  ```
- Para correr las pruebas unitarias y de simulación de componentes del frontend:
  ```bash
  cd frontend
  npm test
  ```
