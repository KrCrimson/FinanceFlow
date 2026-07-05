# Estándar de Programación - FinanceFlow

Este documento define las directrices, convenciones y buenas prácticas de codificación aplicadas en los componentes de **FinanceFlow**, con el fin de asegurar la consistencia y facilitar el mantenimiento de la base de código.

---

## 1. Reglas Generales de Estilo

### 1.1 Convenciones de Nombres
- **Archivos y Carpetas:**
  - Componentes e Interfaces React: Usar `PascalCase` (ej. [LoginPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/LoginPage.jsx), [PlanificadorCompras.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/components/PlanificadorCompras.jsx)).
  - Código general Javascript/Python: Usar `camelCase` o `snake_case` de forma consistente con su respectivo entorno de ejecución (ej. `movimientosService.js` en React, `train_model.py` en Python).
- **Variables y Funciones:**
  - Frontend y Backend (JS): Usar `camelCase` (ej. `const totalBalance = 0;`, `function handleInhabilitar() {}`).
  - ML Backend (Python): Usar `snake_case` para variables y funciones locales (ej. `def analyze_receipt():`), y `camelCase` para esquemas de API de FastAPI.
- **Constantes:** Usar `UPPER_SNAKE_CASE` (ej. `const PORT = 5000;`).

### 1.2 Formateo
- Usar sangrado de **2 espacios** para archivos `.js`, `.jsx`, `.json` y `.html`.
- Usar sangrado de **4 espacios** para archivos `.py`.
- Utilizar comillas sencillas (`'`) para strings en JavaScript/Python y comillas dobles (`"`) en atributos JSX y HTML.
- Emplear punto y coma (`;`) al finalizar instrucciones en JavaScript de forma consistente.

---

## 2. Estructura y Estándares por Componente

### 2.1 Backend REST API (Node.js & Express)
El backend sigue el patrón de **Arquitectura de Tres Capas (MVC)**:
- **Rutas:** Mapean endpoints HTTP y delegan la ejecución. Deben importar middlewares de validación tipada y validación de tokens JWT.
- **Controladores:** Capturan peticiones, validan estructuras de datos con Zod DTO y llaman a los servicios correspondientes.
- **Servicios:** Contienen la lógica pura de negocio y se comunican con MongoDB Atlas mediante modelos de Mongoose.
- **Middlewares Centralizados:** Las peticiones deben usar [errorHandler.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/middlewares/errorHandler.js) para capturar excepciones de forma genérica, evitando estructuras `try-catch` anidadas en controladores.

### 2.2 Frontend Client (React)
- **Desacoplamiento Visual:** Las páginas solo orquestan el renderizado y cargan datos. Los componentes se enfocan en ser presentacionales y reactivos.
- **Hooks Personalizados:** Toda la lógica de fetching, consumo de servicios y agregación de balances mensuales debe encapsularse en hooks independientes (ej. [useAnalisisGastos.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/hooks/useAnalisisGastos.js)), aislando la UI del canal de comunicación HTTP.
- **Formularios:** Implementar validación en tiempo de entrada usando esquemas de Zod acoplados a `React Hook Form` en el cliente.

### 2.3 ML Backend (Python / FastAPI)
- **FastAPI Routing:** Rutas definidas con tipados asíncronos (`async def`).
- **OpenCV & PyTesseract:** Estructurar el procesamiento digital de comprobantes en pipelines modulares de lectura lineal.
- **Joblib:** Cargar y serializar modelos entrenados de Scikit-Learn de manera asíncrona al iniciar la API.

---

## 3. Mensajes de Commit y Control de Versiones

Se sigue la convención de **Conventional Commits**:
- `feat: ...` -> Nueva característica de software.
- `fix: ...` -> Corrección de un error o vulnerabilidad.
- `docs: ...` -> Modificaciones en la documentación técnica.
- `refactor: ...` -> Reestructuración de código sin alterar comportamiento.
- `test: ...` -> Adición o corrección de pruebas unitarias o de integración.
