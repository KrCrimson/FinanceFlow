# 🎭 GUION TEATRAL / TELEPROMPTER DE EXPOSICIÓN (QA FINANCEFLOW)
### Para leer o practicar palabra por palabra
* **Curso:** Construcción de Software II (Sec. A) — UPT
* **Docente:** Mag. Ricardo Eduardo Valcárcel Alvarado
* **Personajes:**
  * 👤 **BRANT:** Brant Antony Chata Choque
  * 👤 **SEBASTIAN:** Sebastian Rodrigo Arce Bracamonte
* **Ubicación en Terminal:** `C:\...\Sistema de balance\` (Directorio raíz)
* **Tiempo estimado:** 4 minutos exactos

---

## 🎬 ESCENA 1: INTRODUCCIÓN Y ARRANQUE (45 segundos)

**[PANTALLA: Diapositiva 1 - Portada Ejecutiva]**  
**[ACCIÓN: Brant se para frente al docente y toma la palabra. Sebastian está al lado frente a la laptop con la terminal de PowerShell abierta en la carpeta `Sistema de balance/`]**

**BRANT:**  
> *"Buenos días, Ingeniero Valcárcel. Hoy junto a mi compañero Sebastian Arce vamos a sustentar la fase de Aseguramiento de Calidad (QA) de **FinanceFlow**, nuestro sistema de gestión financiera con inteligencia artificial.*  
> 
> *Para este proyecto no nos limitamos a probar que los botones funcionen: diseñamos una batería de pruebas automatizadas en tres capas: **Backend, Frontend y un SDK desacoplado**. En total tenemos **80 pruebas automatizadas codificadas**, con una tasa de éxito del 100% en todas las suites funcionales.*  
> 
> *Para que la demostración sea completamente transparente y técnica, vamos a ejecutar cada una de las pruebas en vivo directamente desde la raíz del proyecto."*

---

## 🎬 ESCENA 2: PRUEBAS DE BACKEND Y SEGURIDAD (1 minuto)

**[PANTALLA: Cambiar a Diapositiva 3 - Pruebas de Backend]**  
**[ACCIÓN: Brant señala la terminal. Sebastian escribe y ejecuta el comando]**

**BRANT:**  
> *"Iniciamos con el Backend. Ejecutamos nuestras 12 suites de API con Jest y Supertest."*

**[ACCIÓN: Sebastian presiona ENTER en la terminal ejecutando:]**
```powershell
npm run test:backend
```

**[PANTALLA: La terminal empieza a correr y en ~2.4 segundos imprime: `Test Suites: 12 passed, 12 total` | `Tests: 29 passed, 29 total`]**

**BRANT:** *(Habla con seguridad mientras la terminal termina de arrojar los checks verdes)*  
> *"Como puede ver en pantalla, pasaron las **12 suites y las 29 pruebas al 100%**. ¿Qué estamos garantizando aquí? Tres cosas críticas:*
> 
> *Primero, **Seguridad contra Inyecciones NoSQL**: en la suite `security.unit.test.js` intentamos romper el login enviando operadores como `$gt` en lugar de texto. El validador Zod y la sanitización detectan el ataque y responden HTTP 400 sin comprometer la base de datos. También probamos ataques de contaminación de prototipos (`__proto__`) para que nadie pueda autoasignarse rol de administrador.*  
> 
> *Segundo, **Integridad Contable**: en `cierres.test.js` y `movimientos.unit.test.js` bloqueamos con HTTP 401 cualquier intento de registrar transacciones pasadas o cerrar periodos contables si el usuario no envía su contraseña de confirmación válida.*  
> 
> *Tercero, validamos la pasarela de pagos con Yape y Plin en entorno sandbox. Ahora le cedo la palabra a Sebastian para ver la precisión financiera y la cobertura."*

---

## 🎬 ESCENA 3: PRECISIÓN MATEMÁTICA Y COBERTURA (1 minuto)

**[PANTALLA: Cambiar a Diapositiva 4 - Cobertura de Código Backend]**  
**[ACCIÓN: Sebastian toma la palabra y habla con tono analítico]**

**SEBASTIAN:**  
> *"Gracias, Brant. Ingeniero, un problema muy común en sistemas financieros desarrollados en JavaScript es la **precisión de punto flotante**. Si en Node.js sumas `0.1 + 0.2`, el resultado nativo es `0.30000000000000004`, lo que en contabilidad genera descuadres de céntimos en los balances anuales.*  
> 
> *En nuestra suite `finance.unit.test.js` demostramos que FinanceFlow normaliza y redondea estrictamente todas las operaciones a dos decimales (`0.30`). Además, fijamos la zona horaria en **UTC-5 (Lima)** para que una transacción hecha a las 11 de la noche no aparezca registrada al día siguiente por culpa del servidor.*  
> 
> *Ahora pasamos a auditar la estructura del código con la herramienta de cobertura de Jest Istanbul."*

**[ACCIÓN: Sebastian ejecuta en la terminal:]**
```powershell
npm run test:backend:coverage
```

**[PANTALLA: La terminal imprime la tabla con porcentajes por carpetas]**

**SEBASTIAN:** *(Señala las filas de la tabla con la mano o el cursor)*  
> *"La cobertura total de líneas en el Backend es de **43.61%**. Pero lo fundamental en QA es analizar la calidad por capas:*  
> * *Mire la capa de **Validación con Zod (`schemas/`)**: tiene **100% de cobertura**. Ninguna petición entra al sistema sin ser validada.*  
> * *Los **Modelos de Mongoose (`database/`)** tienen **75.51%**.*  
> * *Y los **Middlewares de Seguridad** están en **57.14%** (rate limiting al 100% y autenticación JWT al 87.5%).*  
> * *La brecha está en la capa de servicios auxiliares con 22.8%, la cual tenemos tipificada en nuestro Gantt del Sprint 7 para elevarla por encima del 70%."*

---

## 🎬 ESCENA 4: FRONTEND Y LA TOLERANCIA A FALLOS (1 minuto)

**[PANTALLA: Cambiar a Diapositiva 5 - Pruebas de Frontend]**  
**[ACCIÓN: Sebastian continúa hablando y se prepara para correr los tests de React]**

**SEBASTIAN:**  
> *"Pasamos ahora a la capa de **Frontend**. Aquí evaluamos la interfaz de usuario con **React Testing Library** dentro de un navegador virtual en memoria llamado JSDOM. Son **9 suites y 13 pruebas**."*

**[ACCIÓN: Sebastian ejecuta en la terminal:]**
```powershell
npm run test:frontend
```

**[PANTALLA: La terminal corre las pruebas de React, salen unos textos de consola y finaliza con: `Test Suites: 9 passed, 9 total` | `Tests: 13 passed, 13 total` en verde]**

**SEBASTIAN:** *(Antes de que el profesor pregunte por las letras rojas, toma la iniciativa de inmediato)*  
> *"Validamos que los formularios de Login y Registro bloqueen envíos vacíos, que el formulario de movimientos alterne dinámicamente entre Ingresos y Egresos, y que los gráficos de Recharts se rendericen en el DOM virtual sin crashear.*  
> 
> *Ingeniero, un detalle muy importante: si observa esas líneas rojas de `console.error: Network request failed`, **no es un error de la prueba**. Al contrario, es la demostración de la **alta tolerancia a fallos de red** del sistema.*  
> 
> *Como en JSDOM no hay un servidor backend prendido, la llamada de red falla, pero nuestro servicio `pagosService.js` la captura en un bloque `try/catch`, activa automáticamente el plan gratuito de contingencia (`free`) y permite que la interfaz se dibuje sin colgarse. Por eso la prueba marca un rotundo **PASS** en las 9 suites.*  
> 
> *Le devuelvo la palabra a Brant para explicar nuestra capa de arquitectura desacoplada."*

---

## 🎬 ESCENA 5: SDK DESACOPLADO Y DEFECTO D-01 (40 segundos)

**[PANTALLA: Cambiar a Diapositiva 6 - SDK y Defecto D-01]**  
**[ACCIÓN: Brant retoma el micrófono]**

**BRANT:**  
> *"Para garantizar que la lógica de consumo de API no estuviera amarrada solo a la web, creamos el **SDK `@sistema-balance/sdk`**, que también será consumido por nuestra aplicación móvil en Expo. Corremos las pruebas del SDK:"*

**[ACCIÓN: Sebastian ejecuta en la terminal:]**
```powershell
npm run test:sdk
```

**[PANTALLA: La terminal imprime: `Test Suites: 2 passed, 2 total` | `Tests: 38 passed, 38 total`]**

**BRANT:**  
> *"Las **38 pruebas del SDK aprueban al 100%**, validando persistencia de tokens JWT, cálculo de uptime y formateo de URLs.*  
> 
> *Sin embargo, el aseguramiento de calidad exige honestidad y rigor. Al ejecutar la suite completa del SDK descubrimos un problema de transpilación que registramos formalmente como el **Defecto D-01**: el archivo `movimientos-adapter.js` utiliza módulos ES modernos (`import`), mientras que el ejecutor de Jest en esa carpeta corre en CommonJS sin Babel.*  
> 
> *En lugar de esconderlo, lo incluimos en nuestro informe como un hallazgo de prioridad P1 y ya está programado en el Gantt para resolverse en el Sprint 7."*

---

## 🎬 ESCENA 6: CI/CD, GANTT Y CIERRE FINAL (35 segundos)

**[PANTALLA: Cambiar a Diapositiva 7 - DevSecOps y Plan Sprint 7]**  
**[ACCIÓN: Brant habla sobre el pipeline y luego Sebastian cierra]**

**BRANT:**  
> *"Para asegurar que ninguna regresión llegue a producción, tenemos configurado un pipeline de **Integración Continua en GitHub Actions (`ci.yml`)** que corre en Node.js 20 con cada commit, ejecutando auditoría de vulnerabilidades con `npm audit`, las 12 suites de Backend y las 9 de Frontend."*

**SEBASTIAN:** *(Concluye con voz firme mirando al profesor)*  
> *"Para cerrar, Ingeniero: cada uno de los 8 hallazgos identificados en las pruebas está respaldado en nuestro archivo Excel **`G03_FinanceFlow_5W1H_Gantt.xlsx`** bajo el ciclo PDCA, con fechas y responsables asignados.*  
> 
> *FinanceFlow cuenta con **80 pruebas automatizadas aprobadas**, blindaje de seguridad contra inyecciones y un plan de calidad medible y auditable.*  
> 
> *Muchísimas gracias. Quedamos a su disposición para cualquier pregunta o para inspeccionar el código de cualquier prueba."*

---

# 🛑 RESPUESTAS RÁPIDAS SI EL PROFESOR INTERRUMPE O PREGUNTA

### 💥 Si el profesor dice: *"A ver, córranme todas las pruebas juntas de un solo golpe"*
**[ACCIÓN: Sebastian escribe en la terminal y presiona Enter:]**
```powershell
npm test
```
**SEBASTIAN:**  
> *"Listo Ingeniero. `npm test` encadena secuencialmente el backend y el frontend. Como ve: 21 suites y 42 pruebas aprobadas en solo 4.5 segundos."*

---

### 💥 Si el profesor pregunta: *"¿Por qué la cobertura total es 43% y no 80%?"*
**SEBASTIAN:**  
> *"Porque 43.6% es la línea base real de la primera iteración de QA. No quisimos inflar números con pruebas vacías. Lo crítico es que la capa de entrada (Zod) está al 100% y los modelos al 75.5%. La tarea S3 de nuestro Gantt ya tiene asignadas las pruebas restantes para superar el 70% en el Sprint 7."*

---

### 💥 Si el profesor pregunta: *"¿En qué consiste el defecto D-01 que mencionaron del SDK?"*
**BRANT:**  
> *"Es una incompatibilidad de empaquetado: el adaptador del SDK usa sintaxis `import * as service` (ES Modules), pero Jest en esa carpeta no tiene el preset de Babel `@babel/preset-env` para traducirlo a CommonJS. Es un error de configuración de build, no de lógica de negocio, y está en el plan del Sprint 7."*

---

### 💥 Si el profesor pregunta: *"¿Cómo prueban si no tienen MongoDB prendido?"*
**BRANT:**  
> *"Actualmente usamos `mocks` de Jest para aislar la base de datos y que las pruebas corran en 2 segundos en cualquier máquina. Para el Sprint 7 (Hallazgo D-03) estamos incorporando `mongodb-memory-server`, que levanta un motor real en memoria RAM durante la prueba y se destruye al terminar."*
