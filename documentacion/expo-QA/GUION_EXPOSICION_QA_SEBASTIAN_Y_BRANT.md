# 🎙️ GUION DE EXPOSICIÓN Y DEFENSA TÉCNICA DE QA (FINANCEFLOW)
## Construcción de Software II (Sec. A) — Universidad Privada de Tacna
**Docente:** Mag. Ricardo Eduardo Valcárcel Alvarado  
**Integrantes (Grupo G03):**
* 👤 **Brant Antony Chata Choque** (2020067577)
* 👤 **Sebastian Rodrigo Arce Bracamonte** (2019062786)
**Directorio de Ejecución en Terminal:** `Sistema de balance/`

---

## ⏱️ Estructura y Distribución de Tiempo (Total: 4 a 5 minutos)

| Bloque | Tema | Responsable | Tiempo |
|---|---|:---:|:---:|
| **1** | Apertura, Métricas Globales y Backend (Seguridad & Transacciones) | **Brant Chata** | ~1:15 min |
| **2** | Backend (Controladores, Precisión Matemática y Cobertura Istanbul) | **Sebastian Arce** | ~1:15 min |
| **3** | Frontend (React Testing Library, UI y Tolerancia a Fallos) | **Sebastian Arce** | ~1:00 min |
| **4** | Arquitectura SDK Desacoplado y Demostración del Defecto D-01 | **Brant Chata** | ~0:50 min |
| **5** | DevSecOps (CI/CD, npm audit), Conexión con Gantt y Cierre | **Ambos** | ~0:40 min |

---

# 🎬 GUION DIÁLOGO PASO A PASO (QUÉ DECIR, QUÉ CORRER Y QUÉ SE PROBÓ)

---

### 🟢 BLOQUE 1: APERTURA Y BACKEND (SEGURIDAD Y TRANSACCIONES)
**Expone:** 👤 **Brant Antony Chata Choque**  
**Diapositivas de apoyo:** Slide 1 y Slide 2 / 3

#### 🗣️ Lo que dice Brant:
> *"Buenos días, Ingeniero Valcárcel y compañeros. Hoy junto a Sebastian Arce vamos a sustentar el Aseguramiento de Calidad (QA) de **FinanceFlow**, nuestro sistema de gestión financiera con inteligencia artificial.*  
> 
> *Para este proyecto implementamos un enfoque riguroso de pruebas automatizadas en tres capas: Backend, Frontend y un SDK desacoplado. En total ejecutamos **80 pruebas automatizadas**, logrando el 100% de éxito en todas las pruebas funcionales.*  
> 
> *Comenzamos con la capa de Backend, que cuenta con **12 suites y 29 pruebas unitarias y de integración** desarrolladas con Jest y Supertest."*

#### 💻 Acción en Terminal (Brant o Sebastian corre):
```powershell
npm run test:backend
```
*(O comando alternativo: `npm --prefix backend test`)*

#### 🔍 Qué explica Brant al docente mientras corren los tests (~2.4 segundos):
> *"Ingeniero, aquí estamos probando aspectos críticos que no se ven a simple vista en la interfaz:*
> 1. **Seguridad y Caos (`security.unit.test.js`):** *Probamos defensas contra **inyecciones NoSQL**. Enviamos objetos como `{ "$gt": "" }` en el login para intentar saltarnos la contraseña; el sistema sanitiza el payload y rechaza la petición con HTTP 400 sin vulnerar la autenticación. También probamos ataques de **contaminación de prototipos (`__proto__`)** para asegurar que nadie pueda auto-asignarse permisos de administrador inyectando propiedades en el JSON global.*
> 2. **Cierres Contables y Transacciones Pasadas (`cierres.test.js` y `movimientos.unit.test.js`):** *Un usuario no puede alterar el balance histórico ni registrar transacciones con fecha anterior a menos que confirme su contraseña válida. Si no la envía o es incorrecta, la prueba valida que el sistema bloquea la operación con HTTP 401.*
> 3. **Pasarela de Pagos Sandbox (`pagos.unit.test.js`):** *Validamos las intenciones de pago hacia Yape y Plin, y la activación inmediata en el entorno de pruebas.*
> 
> *Como se observa en consola, las **12 suites y las 29 pruebas aprobaron al 100%** en solo 2.4 segundos. Ahora le doy el pase a Sebastian para la precisión financiera y la cobertura."*

---

### 🟢 BLOQUE 2: PRECISIÓN FINANCIERA Y COBERTURA DE CÓDIGO
**Expone:** 👤 **Sebastian Rodrigo Arce Bracamonte**  
**Diapositivas de apoyo:** Slide 3 y Slide 4

#### 🗣️ Lo que dice Sebastian:
> *"Gracias, Brant. Continuando con el backend, uno de los desafíos más grandes en sistemas financieros en JavaScript es la **precisión aritmética de punto flotante**.*
> 
> *En nuestra suite `finance.unit.test.js` probamos específicamente casos como sumar `0.1 + 0.2`. En JavaScript por defecto esto arroja `0.30000000000000004`, lo que en contabilidad causaría descuadres de céntimos. Nuestra prueba verifica que FinanceFlow normaliza y redondea estrictamente a dos decimales (`0.30`). Además, probamos la normalización de zonas horarias a **UTC-5 (hora de Lima)** para que los reportes de ingresos y egresos no se desfasen de día si el servidor corre en la nube.*  
> 
> *También validamos el ciclo de vida completo en `e2e.test.js`: desde el registro de usuario, generación de JWT, creación de un movimiento, hasta su borrado lógico (*soft delete*).*
> 
> *Ahora pasamos a auditar la **cobertura de código del Backend** con Jest Istanbul."*

#### 💻 Acción en Terminal (Sebastian corre):
```powershell
npm run test:backend:coverage
```
*(O comando alternativo: `npm --prefix backend test -- --coverage`)*

#### 🔍 Qué explica Sebastian sobre los números de cobertura:
> *"Ingeniero, al analizar la tabla de cobertura por capas obtenemos **43.61% de líneas totales**:*
> * 🟢 **Esquemas Zod (`backend/schemas/`):** **100% de cobertura**. Toda la validación de entrada está completamente blindada.
> * 🟢 **Modelos de Mongoose (`backend/database/`):** **75.51% de cobertura**. Los esquemas de datos están sólidamente cubiertos.
> * 🟡 **Middlewares (`backend/middlewares/`):** **57.14%**. Los controles de rate-limiting (100%) y autenticación JWT (87.5%) están probados; la brecha radica en el manejador general de excepciones `errorHandler.js` (6.25%).
> * 🔴 **Capa de Servicios (`backend/services/`):** **22.84%**. Hemos identificado que los controladores sí tienen pruebas pero la lógica interna de algunos servicios auxiliares requiere más casos alternativos. Por eso, en nuestro Gantt del Sprint 7 tenemos programado elevar esta cobertura a más del 70%."*

---

### 🟢 BLOQUE 3: PRUEBAS DE FRONTEND Y TOLERANCIA A FALLOS
**Expone:** 👤 **Sebastian Rodrigo Arce Bracamonte**  
**Diapositiva de apoyo:** Slide 5

#### 🗣️ Lo que dice Sebastian:
> *"A continuación pasamos a la capa de **Frontend**, donde evaluamos la experiencia de usuario y la reactividad de la interfaz. Contamos con **9 suites y 13 pruebas** ejecutadas mediante React Testing Library bajo un entorno virtual de DOM llamado JSDOM."*

#### 💻 Acción en Terminal (Sebastian corre):
```powershell
npm run test:frontend
```
*(O comando alternativo: `npm --prefix frontend run test:ci`)*

#### 🔍 Qué explica Sebastian mientras corren los tests (~2 segundos):
> *"¿Qué validamos en el Frontend?*
> 1. **Formularios de Autenticación (`LoginPage` y `RegisterPage`):** *Comprobamos que los botones estén deshabilitados ante campos vacíos y que los mensajes de error sean accesibles.*
> 2. **Formulario de Movimientos (`MovimientoFormPage`):** *Validamos que no permita enviar montos vacíos o negativos y que los selectores de categorías cambien dinámicamente si el usuario selecciona Ingreso o Egreso.*
> 3. **Dashboard y Reportes (`DashboardPage` y `ReportesPage`):** *Renderizamos los gráficos de Recharts en el DOM virtual para asegurar que no se produzcan excepciones de renderizado en blanco si el usuario aún no tiene transacciones registradas.*
> 4. **Rutas 404 (`NotFoundPage`):** *Probamos que ante cualquier URL errónea se despliegue un aviso amigable y un botón de retorno al inicio.*
> 
> *El resultado es **9 suites de 9 aprobadas al 100%**.*
> 
> ⚠️ **Aclaración sobre las líneas rojas en consola:**  
> *Ingeniero, si observa esas líneas rojas de `console.error: Network request failed`, **no es un fallo de la prueba**, sino una demostración de **tolerancia a fallos de red**. Al correr en JSDOM no hay servidor levantado; nuestro servicio `pagosService.js` atrapa la desconexión en un bloque `try/catch` y asigna de inmediato el plan de contingencia gratuito (`free`), evitando que la pantalla se congele. Por eso la prueba marca `PASS`.*  
> 
> *Le devuelvo la palabra a Brant para explicar nuestra capa de desacoplamiento SDK."*

---

### 🟢 BLOQUE 4: SDK DESACOPLADO Y DEFECTO D-01 (TRANSPARENCIA)
**Expone:** 👤 **Brant Antony Chata Choque**  
**Diapositiva de apoyo:** Slide 6

#### 🗣️ Lo que dice Brant:
> *"Una decisión arquitectónica clave en FinanceFlow fue no acoplar el frontend web directamente a la API, sino crear un **SDK de integración (`@sistema-balance/sdk`)**. Esto permite que la misma lógica de consumo de API sea compartida entre la web en React, la aplicación móvil en React Native / Expo y scripts automatizados.*  
> 
> *Para el SDK ejecutamos **38 pruebas automatizadas** de integración y configuración."*

#### 💻 Acción en Terminal (Brant corre):
```powershell
npm run test:sdk
```
*(O comando alternativo: `npm --prefix sdk test -- tests/sdk.test.js tests/sdk-integration.test.js`)*

#### 🔍 Qué explica Brant:
> *"Aquí validamos: persistencia del token JWT, construcción dinámica de query strings, cálculo de métricas de disponibilidad (uptime, successRate) y aislamiento del ámbito global. Como se observa, **las 38 pruebas pasaron al 100%**.*
> 
> *Sin embargo, el aseguramiento de la calidad exige **transparencia técnica**. Al correr la suite completa del SDK descubrimos un hallazgo formal:"*

#### 💻 Demostración del Defecto D-01 (Opcional si el docente pide ver el hallazgo):
```powershell
npm run test:sdk:all
```
> *"Al correr todas las suites, `movimientos-adapter.test.js` arroja `SyntaxError: Cannot use import statement outside a module`. Esto se debe a que el adaptador fue escrito con módulos ES modernos (`import/export`), mientras que Jest en esa carpeta ejecuta CommonJS sin Babel transpiler.*  
> *En lugar de ocultar este error, lo tipificamos formalmente en nuestro informe como **Defecto D-01 (Prioridad P1)** y está asignado a Sebastian en el Gantt para configurar Babel en el Sprint 7."*

---

### 🟢 BLOQUE 5: DEVSECOPS, MATRIZ GANTT Y CONCLUSIONES
**Exponen:** 👤 **Brant Chata** & 👤 **Sebastian Arce**  
**Diapositiva de apoyo:** Slide 7

#### 🗣️ Lo que dice Brant:
> *"A nivel de DevSecOps, todo este conjunto de pruebas no se corre solo en nuestras laptops. Hemos configurado un **pipeline de Integración Continua en GitHub Actions (`.github/workflows/ci.yml`)** que se dispara en cada commit y pull request bajo Node.js 20, con tres fases:*
> 1. *Auditoría estática de vulnerabilidades (`npm audit`).*
> 2. *Ejecución de las 12 suites de Backend.*
> 3. *Ejecución de las 9 suites de Frontend.*
> 
> *En la auditoría de dependencias detectamos 1 aviso en `nodemailer` en el backend (por caché DNS), cuya actualización está planificada en el Sprint 7."*

#### 🗣️ Lo que dice Sebastian (Cierre final):
> *"Para finalizar, todos los 8 hallazgos detectados (desde el defecto de Babel D-01 hasta la meta de cobertura D-02) están vinculados formalmente en nuestro archivo Excel **`G03_FinanceFlow_5W1H_Gantt.xlsx`** bajo el ciclo PDCA (Planificar, Hacer, Verificar y Actuar).*  
> 
> *En conclusión: FinanceFlow cuenta con **80 pruebas automatizadas funcionales aprobadas**, protección demostrada contra inyecciones NoSQL y Prototype Pollution, precisión de punto flotante corregida, y un plan de acción medible para elevar la cobertura a más del 70%.*  
> 
> *Quedamos a su disposición para cualquier pregunta o para profundizar en el código de alguna prueba. Muchas gracias."*

---

# 🧠 BANCO DE PREGUNTAS TRAMPA DEL DOCENTE (CÓMO RESPONDER)

### ❓ Pregunta 1: *"¿Por qué la cobertura de líneas de Backend es 43.6% y no 80% como se suele pedir?"*
* **Quién responde:** 👤 **Sebastian Arce**
* **Respuesta exacta:**
  > *"Ingeniero, la cobertura del 43.6% es la línea base real de esta entrega. Lo importante es dónde está concentrado ese porcentaje: la capa de **Validación con Zod está al 100%** y la capa de **Modelos de datos al 75.5%**, lo que garantiza que ninguna petición con datos maliciosos o mal formateados llega a la base de datos. La brecha está en la capa de servicios auxiliares, donde en el Sprint 7 del Gantt tenemos la tarea S3 asignada para incorporar los casos de prueba de CP-38 a CP-42 y superar el 70%."*

---

### ❓ Pregunta 2: *"En el informe dice 94 pruebas y aquí me mostraron 80 pruebas aprobadas. ¿Dónde están las 14 pruebas que faltan?"*
* **Quién responde:** 👤 **Brant Chata**
* **Respuesta exacta:**
  > *"Excelente observación, Ingeniero. Las 94 pruebas corresponden al catálogo teórico total diseñado en el plan de aseguramiento. De esas 94, **80 pruebas ya están codificadas y pasan al 100%** (29 en Backend, 13 en Frontend y 38 en SDK). Las 14 restantes corresponden a los módulos de exportación avanzada a PDF/Excel y vistas secundarias que están tipificados en el Hallazgo D-06 y programados para su codificación final en el Sprint 7."*

---

### ❓ Pregunta 3: *"¿Sus pruebas de integración tocan la base de datos de producción o cómo hacen con MongoDB?"*
* **Quién responde:** 👤 **Brant Chata**
* **Respuesta exacta:**
  > *"Actualmente las pruebas unitarias y de integración usan funciones `mock` de Jest para aislar la base de datos y correr en 2 segundos sin depender de internet. Sin embargo, como identificamos en el Hallazgo D-03 del informe, para el Sprint 7 estamos incorporando la librería `mongodb-memory-server`, que levanta una base de datos temporal en la memoria RAM durante la prueba y se destruye al terminar, logrando pruebas de integración 100% reales sin ensuciar la base de datos."*

---

### ❓ Pregunta 4: *"¿Cómo probaron la inyección NoSQL si usan Mongoose?"*
* **Quién responde:** 👤 **Sebastian Arce**
* **Respuesta exacta:**
  > *"En la prueba `security.unit.test.js` simulamos un ataque enviando en el cuerpo del JSON `{ email: { "$gt": "" }, password: { "$gt": "" } }`. Si el backend no validara tipos, MongoDB interpretaría '$gt' (mayor que) y devolvería el primer usuario de la base de datos sin saber la clave. Nuestra prueba demuestra que el validador Zod y la capa de sanitización rechazan el objeto porque exige estrictamente un tipo `string`, respondiendo HTTP 400 y frustrando el ataque."*
