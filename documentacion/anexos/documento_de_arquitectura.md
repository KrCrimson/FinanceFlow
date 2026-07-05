# Documento de Arquitectura de Software - FinanceFlow

Este documento describe formalmente la arquitectura del sistema **FinanceFlow**, detallando la organización de sus componentes, la distribución física del monorepo, la organización de capas en el backend y frontend, y la integración de servicios de Inteligencia Artificial.

## 1. Vista General de Componentes

La arquitectura de FinanceFlow se organiza en tres servicios independientes que operan en un monorepo, comunicados mediante APIs REST:

```
+------------------------------------+
|            FRONTEND SPA            |
|       (React 18 / Recharts)        |
+------------------------------------+
       |                      |
(Axios REST)             (Axios REST)
       |                      |
       v                      v
+--------------+       +--------------+
| BACKEND API  |       |  ML BACKEND  |
| (Node/Express|       | (FastAPI/IA) |
+--------------+       +--------------+
       |                      |
(Mongoose ODM)           (PyTesseract)
       v                      v
+--------------+       +--------------+
| MONGO DB     |       | LOCAL FILES  |
| (Atlas Cloud)|       |  (Vouchers)  |
+--------------+       +--------------+
```

## 2. Arquitectura del Backend API (Patrón MVC por Capas)

El servidor transaccional en Node.js y Express se estructura bajo una arquitectura clásica de **tres capas (MVC)**, garantizando el desacoplamiento lógico y la facilidad de mantenimiento:

1. **Capa de Enrutamiento:** Captura las peticiones HTTP y aplica middlewares globales o específicos de seguridad y validación.
   - Definidas en [routes/usuarios.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/routes/usuarios.js) y [routes/movimientos.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/routes/movimientos.js).
2. **Capa de Controladores:** Valida los datos recibidos mediante middlewares de validación tipada y delega la ejecución de la lógica de negocio a la capa de servicios.
   - Implementadas en [usuarios.controller.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/controllers/usuarios.controller.js) y [movimientos.controller.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/controllers/movimientos.controller.js).
3. **Capa de Servicios y Acceso a Datos:** Resuelve las reglas de negocio y realiza consultas a MongoDB Atlas usando los modelos definidos con Mongoose ODM.
   - Desarrolladas en [usuarios.service.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/services/usuarios.service.js), [movimientos.service.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/services/movimientos.service.js), [usuario.model.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/database/usuario.model.js) y [movimiento.model.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/database/movimiento.model.js).

## 3. Arquitectura del Frontend SPA (React)

El frontend se construye como una Single Page Application (SPA) modular:
- **Vistas y Páginas:** Componentes React estructurados en la carpeta `pages` que representan las pantallas accesibles a través de React Router (ej. [LoginPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/LoginPage.jsx), [DashboardPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/DashboardPage.jsx)).
- **Componentes Reutilizables:** Piezas visuales desacopladas alojadas en `components` (ej. [Graficos.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/components/Graficos.jsx), [PlanificadorCompras.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/components/PlanificadorCompras.jsx)).
- **Hooks Personalizados:** Encapsulan el estado lógico, las suscripciones y la integración de datos del cliente (ej. [useAnalisisGastos.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/hooks/useAnalisisGastos.js), [useMovimientos.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/hooks/useMovimientos.js)).
- **Servicios:** Adaptadores Axios encargados de realizar las llamadas HTTP REST a la API (ej. [movimientosService.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/services/movimientosService.js)).

## 4. Arquitectura del Servicio de Inteligencia Artificial (FastAPI)

El backend de Machine Learning y OCR opera de forma asíncrona:
- **FastAPI:** Expone endpoints ligeros para recepción de multipart data (imágenes de comprobantes).
- **OpenCV Pipeline:** Aplica escala de grises, filtrado Gaussiano y binarización de Otsu sobre el buffer de la imagen del voucher.
- **PyTesseract OCR:** Traduce los contornos de la imagen procesada a texto legible en base a patrones definidos.
- **Naive Bayes Classifier:** Un pipeline de `scikit-learn` entrenado con TF-IDF categoriza las descripciones extraídas asociándolas a las categorías financieras del sistema.

## 5. Persistencia y Seguridad
- **MongoDB Atlas:** Motor de almacenamiento NoSQL flexible en la nube para documentos JSON de movimientos y usuarios.
- **Seguridad en API:** Autenticación por firma de tokens JWT, encriptación unidireccional de claves con bcryptjs (10 salt rounds) y middlewares Helmet y CORS estricto.
- **Borrado Lógico:** Las desactivaciones de transacciones son registradas mediante el estado `'inactivo'` en base de datos, manteniéndolas en persistencia para auditorías pero ocultándolas en balances netos y vistas.
