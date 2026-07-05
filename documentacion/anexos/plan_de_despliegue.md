# Plan de Despliegue - FinanceFlow

Este documento describe la arquitectura física de producción y el procedimiento paso a paso para realizar el despliegue de los servicios de **FinanceFlow** en la nube, garantizando disponibilidad e integridad de los datos.

## 1. Arquitectura de Producción en la Nube

El sistema se aloja bajo un esquema de microservicios y despliegues serverless independientes:

```
+---------------------+       HTTPS REST       +-----------------------+
|  CLIENTE REACT SPA  |  ------------------->  |      BACKEND API      |
|    (Hosting Vercel) |  <-------------------  |  (Render Web Service) |
+---------------------+                        +-----------------------+
           |                                               |
      (HTTPS REST)                                   (Mongoose ODM)
           |                                               |
           v                                               v
+---------------------+                        +-----------------------+
|   ML BACKEND (IA)   |                        |  BASE DE DATOS NOSQL  |
| (Render Web Service) |                        | (MongoDB Atlas Cloud) |
+---------------------+                        +-----------------------+
```

---

## 2. Preparación y Configuración del Despliegue

### 2.1 Base de Datos (MongoDB Atlas)
1. Inicie sesión en MongoDB Atlas y cree un Cluster en la capa gratuita (Shared Tier M0).
2. Configure el acceso de red (Network Access) para permitir conexiones de red (`0.0.0.0/0` requerido temporalmente por Render).
3. Cree un usuario administrador en Database Access, asigne permisos de lectura y escritura, y guarde la URI de conexión (`MONGO_URI`).

### 2.2 Backend API (Render)
1. Cree un nuevo **Web Service** en Render conectando su repositorio GitHub.
2. Ingrese las siguientes configuraciones de repositorio:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Agregue las variables de entorno de producción en la pestaña **Environment**:
   - `MONGO_URI`: (Cadena de conexión de MongoDB Atlas)
   - `JWT_SECRET`: (Secreto aleatorio para cifrado JWT)
   - `EMAIL_USER` y `EMAIL_PASS`: (Credenciales SMTP de nodemailer para recuperación de cuenta)
4. Guarde y despliegue. Copie la URL pública generada por Render (ej. `https://financeflow-api.onrender.com`).

### 2.3 ML Backend (Render)
1. Cree otro **Web Service** en Render conectando el mismo repositorio GitHub.
2. Ingrese las siguientes configuraciones de repositorio:
   - **Root Directory:** `ml_backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. *Importante:* En la configuración del entorno o Dockerfile de Render, asegúrese de instalar el paquete del sistema `tesseract-ocr` y los datos del idioma español (`tesseract-ocr-spa`) para permitir la binarización de caracteres por pytesseract.
4. Despliegue y copie la URL pública del servicio de IA (ej. `https://financeflow-ml.onrender.com`).

### 2.4 Frontend React SPA (Vercel)
1. Conecte su cuenta de Vercel con el repositorio de GitHub.
2. Cree un nuevo proyecto seleccionando el monorepo y defina la configuración:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Create React App`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
3. Agregue la variable de entorno en el panel de configuración de Vercel:
   - `REACT_APP_API_URL`: (La URL del backend en Render copiada en el paso 2.2 con sufijo `/api`)
4. Presione **Deploy**. Vercel se encargará de compilar los estáticos e inicializar la CDN.

---

## 3. Pruebas de Humo Post-Despliegue (Smoke Tests)

Una vez completados los despliegues, realice las siguientes comprobaciones para garantizar la operatividad:
1. **Acceso Inicial:** Ingrese a la URL del frontend en Vercel y confirme que la vista redirige a la pantalla de Login al no detectar sesión.
2. **Registro e Ingreso:** Cree una cuenta de prueba y acceda. Verifique en MongoDB Atlas que el documento de usuario se guardó con el password cifrado mediante hash.
3. **Registro Transaccional:** Guarde un ingreso de S/. 2000 y confirme su listado en la tabla de ingresos y en la tarjeta de balance neto del Dashboard.
4. **Prueba del OCR:** Suba una imagen de voucher de Yape a través del formulario de movimientos y verifique que FastAPI responde con el monto extraído y la categoría asignada.
5. **Borrado Lógico:** Inactive la transacción registrada y verifique que el balance se reduce a cero, el registro se visualiza sombreado y el estado en base de datos cambia a `'inactivo'`.
