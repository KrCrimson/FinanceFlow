# 🎙️ GUION DE EXPOSICIÓN (SOLO DIÁLOGOS + REFERENCIAS AL EXCEL)
**Integrantes:** Brant Antony Chata Choque & Sebastian Rodrigo Arce Bracamonte  
**Archivo Excel de Referencia:** `G03_FinanceFlow_5W1H_Gantt.xlsx`  
**Directorio raíz de ejecución:** `Sistema de balance/`

---

### **BRANT:**
Buenos días, Ingeniero Valcárcel. Hoy junto a mi compañero Sebastian Arce vamos a sustentar el Aseguramiento de Calidad de FinanceFlow, nuestro sistema de gestión financiera con inteligencia artificial.

Para este proyecto diseñamos una batería de pruebas automatizadas en tres capas: Backend, Frontend y un SDK desacoplado. En total tenemos 80 pruebas automatizadas codificadas, con una tasa de éxito del 100% en todas las suites funcionales.

Iniciamos con el Backend. Ejecutamos nuestras 12 suites de API con Jest y Supertest.

> **Comando:**  
> `npm run test:backend`

*(Mientras corren los tests):*  
Como puede ver en pantalla, pasaron las 12 suites y las 29 pruebas al 100% en solo 2.4 segundos. Aquí garantizamos tres puntos críticos:

Primero, seguridad contra Inyecciones NoSQL: en la suite `security.unit.test.js` intentamos vulnerar el login enviando operadores como `$gt` en lugar de texto. El validador Zod y la sanitización detectan el ataque y responden HTTP 400 sin comprometer la base de datos. También probamos ataques de contaminación de prototipos (`__proto__`) para que nadie pueda autoasignarse rol de administrador.

Segundo, integridad contable: en `cierres.test.js` y `movimientos.unit.test.js` bloqueamos con HTTP 401 cualquier intento de registrar transacciones pasadas o cerrar periodos contables si el usuario no envía su contraseña de confirmación válida. Esto se conecta directamente con el **Punto S1 del Excel** sobre verificación de contraseñas.

Tercero, validamos la pasarela de pagos con Yape y Plin en entorno sandbox. Ahora le cedo la palabra a Sebastian para ver la precisión financiera y la cobertura.

---

### **SEBASTIAN:**
Gracias, Brant. Ingeniero, un problema muy común en sistemas financieros desarrollados en JavaScript es la precisión de punto flotante. Si en Node.js sumas `0.1 + 0.2`, el resultado nativo es `0.30000000000000004`, lo que en contabilidad genera descuadres de céntimos en los balances anuales.

En nuestra suite `finance.unit.test.js` demostramos que FinanceFlow normaliza y redondea estrictamente todas las operaciones a dos decimales (`0.30`). Además, fijamos la zona horaria en UTC-5, hora de Lima, para que una transacción hecha a las 11 de la noche no aparezca registrada al día siguiente por culpa del servidor.

Ahora pasamos a auditar la estructura del código con la herramienta de cobertura de Jest Istanbul.

> **Comando:**  
> `npm run test:backend:coverage`

*(Al salir la tabla):*  
La cobertura total de líneas en el Backend es de 43.61%. Pero lo fundamental en QA es analizar la calidad por capas:
* La capa de Validación con Zod tiene 100% de cobertura. Ninguna petición entra al sistema sin ser validada.
* Los Modelos de Mongoose tienen 75.51%.
* Y los Middlewares de Seguridad están en 57.14%, con rate limiting al 100% y autenticación JWT al 87.5%.
* La brecha está en la capa de servicios auxiliares con 22.8%, la cual corresponde exactamente al **Punto S3 del Excel (Fila 8 del Gantt y hoja PDCA)**, asignado a mi persona para automatizar los casos CP-38 a CP-42 y superar el 70% de cobertura.

Pasamos ahora a la capa de Frontend. Aquí evaluamos la interfaz de usuario con React Testing Library dentro de un navegador virtual en memoria llamado JSDOM. Son 9 suites y 13 pruebas.

> **Comando:**  
> `npm run test:frontend`

*(Al salir los resultados):*  
Validamos que los formularios de Login y Registro bloqueen envíos vacíos, que el formulario de movimientos alterne dinámicamente entre Ingresos y Egresos, y que los gráficos de Recharts se rendericen en el DOM virtual sin crashear.

Ingeniero, un detalle muy importante: si observa esas líneas rojas de `console.error: Network request failed`, no es un error de la prueba. Al contrario, es la demostración de la alta tolerancia a fallos de red del sistema.

Como en JSDOM no hay un servidor backend prendido, la llamada de red falla, pero nuestro servicio `pagosService.js` la captura en un bloque `try/catch`, activa automáticamente el plan gratuito de contingencia (`free`) y permite que la interfaz se dibuje sin colgarse. Por eso la prueba marca un rotundo PASS en las 9 suites. Reemplazar estos logs por un logger centralizado corresponde al **Punto S6 del Excel**.

Le devuelvo la palabra a Brant para explicar nuestra capa de arquitectura desacoplada.

---

### **BRANT:**
Para garantizar que la lógica de consumo de API no estuviera amarrada solo a la web, creamos el SDK `@sistema-balance/sdk`, que también será consumido por nuestra aplicación móvil en Expo. Corremos las pruebas del SDK:

> **Comando:**  
> `npm run test:sdk`

*(Al salir los resultados):*  
Las 38 pruebas del SDK aprueban al 100%, validando persistencia de tokens JWT, cálculo de uptime y formateo de URLs.

Sin embargo, el aseguramiento de calidad exige honestidad y rigor. Al ejecutar la suite completa del SDK descubrimos un problema de transpilación que registramos formalmente como el Defecto D-01: el archivo `movimientos-adapter.js` utiliza módulos ES modernos (`import`), mientras que el ejecutor de Jest en esa carpeta corre en CommonJS sin Babel.

En el Excel, este hallazgo está mapeado en el **Punto S5 (Fila 10 del Gantt)** para retirar fallbacks y unificar el SDK, con solución técnica planificada para el Sprint 7.

Para asegurar que ninguna regresión llegue a producción, tenemos configurado un pipeline de Integración Continua en GitHub Actions que corre en Node.js 20 con cada commit, ejecutando auditoría de dependencias con `npm audit`, las 12 suites de Backend y las 9 de Frontend.

---

### **SEBASTIAN:**
Para cerrar, Ingeniero: cada uno de los 8 hallazgos identificados en las pruebas está respaldado en nuestro archivo Excel `G03_FinanceFlow_5W1H_Gantt.xlsx` a través de los **puntos S1 al S6 más el cierre v1.4.0**, organizados bajo las 4 fases del ciclo PDCA.

FinanceFlow cuenta con 80 pruebas automatizadas aprobadas, blindaje de seguridad contra inyecciones y un plan de calidad medible y auditable.

Muchísimas gracias. Quedamos a su disposición para cualquier pregunta o para inspeccionar el código de cualquier prueba.

---

# 🎯 RESPUESTAS EXACTAS CUANDO EL ING. PREGUNTE:
### "¿Y eso en qué parte del Excel está o a cuál punto pertenece?"

| Si el Ingeniero pregunta por... | Quién responde | Respuesta exacta con coordenadas del Excel |
|---|:---:|---|
| **Contraseñas duplicadas, cierres o seguridad de movimientos** | **BRANT** | *"Está en la hoja **`Gantt 5W+1H` fila 6** y en la hoja **`Oportunidades` fila 5**, como el punto **S1**. Asignado a mi persona (Brant Chata), del 14 al 15 de octubre. Resuelve el método `verificarPassword` centralizado."* |
| **Números mágicos en el código o montos fijos (1000, 2, 5)** | **SEBASTIAN** | *"Está en la hoja **`Gantt 5W+1H` fila 7** y en **`Oportunidades` fila 6**, como el punto **S2**. Asignado a Sebastian Arce, del 14 al 16 de octubre, centralizado en `business.constants.js`."* |
| **La Cobertura de Backend (43.6%) o ampliar pruebas a >=70%** | **SEBASTIAN** | *"Está en la hoja **`Gantt 5W+1H` fila 8**, en **`Verificación` fila 7** y detallado en la hoja **`PDCA`**, como el punto **S3**. Asignado a Sebastian Arce del 16 al 21 de octubre, para automatizar CP-38 a CP-42."* |
| **Rutas del planificador o eliminar cuenta (DELETE /me)** | **BRANT** | *"Está en la hoja **`Gantt 5W+1H` fila 9**, como el punto **S4**. Asignado a Brant Chata del 17 al 22 de octubre, para completar RF-12 y RF-15."* |
| **El Defecto D-01, errores de import en SDK o unificar SDK Balance** | **BRANT** | *"Está en la hoja **`Gantt 5W+1H` fila 10** y en **`Oportunidades` fila 9**, como el punto **S5**. Asignado a Brant Chata del 21 al 23 de octubre para retirar el fallback `apiCall` y transpolar el SDK."* |
| **Los `console.error`, letras rojas en terminal o falta de JSDoc** | **SEBASTIAN** | *"Está en la hoja **`Gantt 5W+1H` fila 11**, como el punto **S6** ('Logger central en lugar de console.log y JSDoc'). Asignado a Sebastian Arce del 22 al 24 de octubre."* |
| **La entrega final de la versión o verificación del Sprint 7** | **AMBOS** | *"Está en la hoja **`Gantt 5W+1H` fila 12** y **`Verificación` fila 11**, como el hito de **Cierre v1.4.0** del 24 de octubre, a cargo de ambos integrantes."* |
| **El calendario de entregas de la universidad** | **BRANT** | *"Está en la hoja **`Calendario`**, donde la fila 10 marca el hito de hoy (17 de octubre: 'Gestión de Configuración') y la fila 11 el del 24 de octubre ('Plan de Pruebas')."* |
