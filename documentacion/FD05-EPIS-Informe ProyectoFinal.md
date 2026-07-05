# FD05 — Informe Proyecto Final (Version 2.0)

# Informe Proyecto Final: Sistema de Balance y Clasificación Inteligente

Este informe final documenta el proceso de investigación, diseño, desarrollo e implementación del **Sistema de Balance y Clasificación Financiera Inteligente** (FinanceFlow / Sistema de Balance). El proyecto tiene como propósito principal proveer a los usuarios de una plataforma centralizada y automatizada para el control presupuestario, reduciendo sustancialmente el trabajo operativo de registro manual mediante técnicas de reconocimiento óptico de caracteres y aprendizaje automático.

---

## Antecedentes (Pág. 1)
En el contexto actual de la economía familiar y personal, la planificación financiera y el control riguroso de los flujos de efectivo representan pilares fundamentales para garantizar la estabilidad a largo plazo. No obstante, la gran mayoría de las personas carecen de una disciplina constante para documentar sus operaciones financieras diarias. Las alternativas tradicionales, que abarcan desde el registro físico en agendas de papel hasta la transcripción manual de datos en hojas de cálculo electrónicas como Microsoft Excel, conllevan una alta fricción de uso. Esta naturaleza manual y repetitiva del ingreso de datos provoca un rápido abandono de las herramientas por parte del usuario, dejando las finanzas familiares sin supervisión.

Paralelamente, la transformación digital en el sector financiero y el surgimiento del Open Banking han cambiado la manera en que los usuarios interactúan con sus fondos, propiciando el uso de billeteras electrónicas como Yape y Plin, y aplicaciones de banca móvil para microtransacciones cotidianas. Si bien esto simplifica los pagos, también genera un gran volumen de transacciones fragmentadas difíciles de rastrear de forma individual. Diversas investigaciones en finanzas personales de mercado demuestran que la automatización de la captura de transacciones y su posterior categorización disminuye significativamente la carga cognitiva del usuario y fomenta el ahorro. El presente proyecto nace para mitigar esta problemática combinando el desarrollo web contemporáneo con inteligencia artificial, aportando una solución automatizada, segura y de alto valor para el usuario final.

---

## Planteamiento del Problema (Pág. 4)

### Problema
El descontrol financiero y la falta de visibilidad del flujo de caja (ingresos y egresos) a nivel personal y familiar. Este escenario es ocasionado directamente por la alta fricción operativa que demanda el registro manual de cada transacción económica diaria. La carencia de herramientas que automaticen la recopilación de datos y la clasificación de conceptos de compra desencadena un desconocimiento generalizado de la capacidad de ahorro real, promoviendo el endeudamiento y la toma de decisiones financieras desacertadas.

### Justificación
La conceptualización y puesta en marcha de este sistema se justifica por la necesidad de simplificar la captura de movimientos financieros diarios. Al integrar un motor de reconocimiento óptico de caracteres (OCR) y modelos de clasificación basados en Machine Learning, el usuario final ya no se ve obligado a escribir manualmente descripciones, montos o fechas de sus gastos. Le basta con subir una imagen o captura de pantalla de su comprobante de pago digital (como un voucher de Yape o Plin) para que el aplicativo procese la imagen, identifique el monto exacto mediante patrones predefinidos de búsqueda y asigne la categoría correspondiente de forma automática. Este flujo automatizado no solo optimiza la gestión del tiempo, sino que eleva la precisión de los datos guardados y promueve la educación financiera.

### Alcance
El alcance tecnológico del proyecto comprende tres componentes esenciales completamente operativos:
1. **Frontend (Aplicativo Cliente):** Una SPA (Single Page Application) construida en React 18 que presenta interfaces intuitivas para iniciar sesión, gestionar perfiles de usuario, visualizar resúmenes financieros mensuales interactivos con gráficos del balance y registrar ingresos o egresos a través de formularios validados.
2. **Backend API (Servidor de Aplicación):** Una API REST robusta en Node.js y Express estructurada bajo un patrón arquitectónico de tres capas (MVC). Su responsabilidad radica en gestionar el flujo de datos transaccionales, realizar autenticación basada en JWT, encriptar credenciales de acceso con bcryptjs y persistir la información en una base de datos única basada en MongoDB Atlas.
3. **ML Backend (Servidor de Inteligencia Artificial):** Un servicio web en Python 3.10 con FastAPI que expone interfaces para la extracción de texto a partir de imágenes de vouchers (OpenCV y Tesseract OCR) y la clasificación predictiva de descripciones basada en un modelo de Naive Bayes de reentrenamiento continuo.

---

## Objetivos (Pág. 6)

### Objetivo General
Desarrollar e implementar un sistema web inteligente de control de ingresos y egresos personales y familiares que reduzca el registro manual mediante el uso de aprendizaje automático e integración bancaria simulada.

### Objetivos Específicos
1. **Diseñar una interfaz interactiva y adaptiva:** Construir componentes visuales reutilizables en React 18 y Tailwind CSS que garanticen una navegación intuitiva y una visualización gráfica clara de las finanzas del usuario a través de gráficos de pastel, líneas y barras.
2. **Implementar un backend seguro y estructurado:** Desarrollar una API REST en Node.js que emplee una arquitectura en capas (rutas, controladores, servicios y modelos) para organizar el código y asegurar una comunicación fluida con MongoDB Atlas utilizando Mongoose ODM.
3. **Construir un clasificador financiero inteligente:** Desarrollar un servicio en Python 3.10 con FastAPI que emplee un clasificador Multinomial Naive Bayes y análisis de texto (TF-IDF) para predecir las categorías de egresos en función de sus descripciones escritas.
4. **Implementar procesamiento OCR y visión artificial:** Diseñar un pipeline de visión computacional con OpenCV y Tesseract OCR que binarice y limpie imágenes de comprobantes de pago digitales para extraer automáticamente la información transaccional (monto, descripción, fecha).

---

## Marco Teórico
- **Arquitectura de Tres Capas (MVC):** Este enfoque organiza el código del backend en tres niveles de responsabilidad: la capa de rutas capta las peticiones HTTP; la capa de controladores mapea y valida las entradas de datos (empleando Zod); la capa de servicios resuelve la lógica de negocio y se comunica con la base de datos a través de modelos definidos mediante Mongoose ODM. Esto facilita el mantenimiento, desacoplamiento y pruebas del sistema.
- **Aprendizaje Automático (Naive Bayes):** El algoritmo Multinomial Naive Bayes es un clasificador probabilístico basado en el teorema de Bayes. En combinación con la vectorización de palabras TF-IDF (Term Frequency-Inverse Document Frequency), permite evaluar y clasificar textos cortos en tiempo real con baja latencia y mínimos requisitos de memoria en el servidor.
- **Procesamiento de Imágenes y OCR:** Mediante el uso de la biblioteca OpenCV, se aplican técnicas de binarización y reducción de ruido a las imágenes recibidas antes de ser procesadas por Tesseract OCR. Esto optimiza la legibilidad de caracteres y mejora la exactitud en la extracción de texto de capturas de vouchers digitales.
- **Bases de Datos NoSQL en la Nube:** MongoDB Atlas provee almacenamiento basado en documentos JSON. Al ser un esquema flexible, se acopla a las variaciones en las estructuras de los movimientos financieros (ingresos/egresos) e historial de logs, garantizando a la vez escalabilidad y seguridad de cifrado en tránsito.

---

## Desarrollo de la Solución (Pág. 9)

### Análisis de Factibilidad
- **Factibilidad Técnica:** El desarrollo se fundamenta en plataformas estables y de uso extendido. El frontend SPA utiliza React 18, la API REST transaccional se apoya en Node.js, y el backend inteligente se ejecuta en Python 3.10 con FastAPI. La madurez de librerías como OpenCV, Scikit-learn y Mongoose garantizan la viabilidad técnica del desarrollo.
- **Factibilidad Económica:** Los costos de infraestructura operativa se reducen a cero gracias a las capas de hosting gratuitas de Vercel (frontend), Render (servidores de backend Express y FastAPI) y MongoDB Atlas (base de datos en la nube).
- **Factibilidad Operativa:** El flujo de la aplicación se diseña para requerir la menor interacción manual posible del usuario. La inclusión de un extractor automático de datos de vouchers (OCR) reduce la tasa de abandono de la aplicación al simplificar el registro de transacciones.
- **Factibilidad Social:** El sistema busca generar un impacto positivo en la economía de los usuarios mediante la concienciación de gastos y el fomento de una cultura de ahorro personal guiada por visualizaciones financieras interactivas.
- **Factibilidad Legal:** Cumplimiento de la Ley de Protección de Datos Personales (Ley N° 29733 en el Perú). Los datos transaccionales se asocian de manera exclusiva al perfil de usuario mediante tokens de autenticación JWT y contraseñas cifradas con bcryptjs. Asimismo, el módulo de sincronización bancaria funciona mediante datos locales simulados, evitando la manipulación de credenciales bancarias reales.
- **Factibilidad Ambiental:** Al binarizar y almacenar vouchers de forma digital, disminuye la necesidad de imprimir comprobantes en papel térmico contaminante.

### Tecnología de Desarrollo
El sistema está construido sobre el siguiente stack de software verificado:
- **Componente Frontend (SPA):**
  - React (v18.0.0) como motor de interfaz de usuario.
  - React Router DOM (v7.11.0) para ruteo interno de la SPA.
  - React Hook Form (v7.68.0) y @hookform/resolvers (v5.2.2) para gestión de formularios.
  - Zod (v4.2.1) para la validación tipada de inputs en cliente.
  - Axios (v1.13.2) para el consumo de endpoints REST del backend.
  - Recharts (v3.8.1) para renderizar gráficos de tipo `BarChart`, `LineChart` y `PieChart` (donut).
  - Tesseract.js (v5.1.1) como librería de soporte OCR en el navegador.
- **Componente Backend API:**
  - Node.js (v18.x) como entorno de ejecución.
  - Express.js (v5.2.1) para la infraestructura de enrutamiento y middleware.
  - Mongoose (v9.0.2) para interactuar con MongoDB.
  - jsonwebtoken (v9.0.3) para tokens de sesión.
  - bcryptjs (v3.0.3) para encriptar contraseñas.
  - helmet (v8.1.0) para implementar cabeceras HTTP de seguridad.
  - cors (v2.8.5) para control de accesos.
  - nodemailer (v6.9.8) para el envío de correos de recuperación de cuenta.
  - dotenv (v17.2.3) para la administración de variables del entorno.
  - Jest (v29.0.0) y Supertest (v6.0.0) para pruebas automáticas.
- **Componente Backend ML (Python):**
  - Python (v3.10) para el pipeline de Inteligencia Artificial.
  - FastAPI para exponer la API asíncrona de predicción y procesamiento de imágenes.
  - OpenCV (opencv-python-headless) para manipulación digital de imágenes.
  - pytesseract para traducción OCR.
  - scikit-learn para el modelo de Naive Bayes y transformador de palabras TF-IDF.
  - pandas y joblib para la manipulación y persistencia en disco del modelo entrenado.
  - python-multipart para recibir flujos de archivos pesados.
- **Persistencia:** MongoDB Atlas en su capa gratuita en la nube.

---

### Metodología de Implementación

#### 1. Introducción
El ciclo de desarrollo y construcción del sistema **FinanceFlow** se rige por un marco de trabajo ágil e incremental, diseñado para asegurar la entrega sistemática de valor a través de iteraciones semanales denominadas sprints. Esta metodología iterativa facilita la detección temprana de inconsistencias técnicas y permite una adaptación dinámica de los componentes de software frente a posibles contingencias durante la fase de desarrollo.

La planificación de cada sprint toma como fundamento inequívoco el Cuadro de Requerimientos Funcionales Final del Documento de Especificación de Requerimientos de Software (SRS v2.0) y el diseño de la arquitectura modular de tres capas (MVC) descrito en el Documento de Arquitectura de Software (SAD v1.0). Se establece una trazabilidad bidireccional estricta que conecta de manera directa cada Requerimiento Funcional (del `RF-01` al `RF-15`) con los componentes del repositorio oficial en GitHub ([Repositorio FinanceFlow](https://github.com/KrCrimson/FinanceFlow.git)) y las suites de pruebas automatizadas correspondientes.

El proyecto está organizado en 6 sprints semanales agrupados en dos fases conceptuales:
1. **Fase de Núcleo Transaccional (Sprints 1 al 4):** Enfocada en construir y consolidar el Producto Mínimo Viable (MVP core). Esta fase abarca la autenticación robusta mediante tokens JWT, la persistencia transaccional de ingresos y egresos, y el diseño de la interfaz del Dashboard Analítico con alertas automáticas.
2. **Fase de Alcance Extendido e Inteligencia (Sprints 5 y 6):** Dedicada a implementar la digitalización automatizada de comprobantes de pago mediante visión computacional y OCR, el cálculo de metas en el planificador financiero y la personalización avanzada del perfil.

#### 2. Criterio de Planificación
La priorización y ordenamiento de las tareas dentro del Product Backlog obedecen a un riguroso análisis de dependencias de datos y viabilidad técnica. Los criterios que orientan la distribución de los 15 requerimientos funcionales en los sprints correspondientes son:

- **Consistencia y Alineación Literal:** Para garantizar la coherencia en las auditorías de calidad y en las pruebas de aceptación académica, los requerimientos programados se corresponden con la nomenclatura oficial `RF-01` a `RF-15` establecida en el SRS v2.0, evitando cualquier ambigüedad en los objetivos del sprint.
- **Resolución de Dependencias Técnicas:** El desarrollo respeta una secuencia lógica de persistencia de datos. Los flujos de autenticación segura (`RF-01`, `RF-02`, `RF-03`) se priorizan en el Sprint 1 como base imprescindible, ya que el registro de movimientos transaccionales (`RF-04`) requiere obligatoriamente asociarse al identificador del usuario autenticado (`userId`). Asimismo, la desactivación lógica de transacciones (`RF-08`) y la agregación del balance financiero (`RF-09`) dependen de la existencia previa del registro de movimientos (`RF-04`, `RF-07`). Los reportes avanzados (`RF-13`), el planificador de compras (`RF-12`) y el procesamiento OCR (`RF-05`) se ubican en los sprints finales al requerir datos consolidados e integración de microservicios externos.
- **Clasificación por Nivel de Prioridad:** Se asigna prioridad **Alta** a las funcionalidades clave de administración y control del flujo de caja que conforman el MVP core, asegurando que estén completamente desarrolladas e integradas al término del Sprint 4. Las prioridades **Media** (inactivación lógica, alertas, reportes y OCR) y **Baja** (filtros locales y edición del perfil) se distribuyen estratégicamente a lo largo del cronograma de acuerdo con su nivel de complejidad.
- **Suite de Pruebas como Criterio de Aceptación:** Para cada incremento de sprint se asocian de forma anticipada casos de prueba específicos (`CP-01` a `CP-42`). Estos casos actúan como especificación de requisitos ejecutable y definen los criterios de aceptación formales que el código fuente debe satisfacer antes de considerarse finalizado.

#### 3. Resultado Esperado por Sprint
A continuación, se detalla el incremento de software funcional esperado y los entregables comprometidos para cada una de las 6 iteraciones de desarrollo del sistema:

- **Sprint 1 (11.05.2026) — Módulo de Autenticación Segura:**
  El resultado esperado consiste en una capa de seguridad operativa tanto en el backend como en el frontend. Se entrega la interfaz de registro de usuarios en [RegisterPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/RegisterPage.jsx), el inicio de sesión basado en tokens JWT con un tiempo de vida (TTL) de 7 días en [LoginPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/LoginPage.jsx), y las vistas de recuperación de contraseña en [ForgotPasswordPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/ForgotPasswordPage.jsx) y [ResetPasswordPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/ResetPasswordPage.jsx). Las contraseñas de los usuarios se almacenan cifradas en la base de datos de MongoDB Atlas mediante hashes generados con bcryptjs (10 salt rounds) a través del esquema [usuario.model.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/database/usuario.model.js) y las operaciones expuestas en [usuarios.controller.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/controllers/usuarios.controller.js). Las pruebas `CP-01` a `CP-09` validan el flujo de autenticación, el control de accesos protegidos y la revocación de tokens al cerrar sesión.

- **Sprint 2 (18.05.2026) — Captura y Visualización de Movimientos:**
  El resultado es el motor transaccional básico que permite el almacenamiento de movimientos financieros. Se entrega el formulario interactivo en [MovimientoFormPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/MovimientoFormPage.jsx) para registrar ingresos y egresos, implementando un selector dropdown de categorías que cambia dinámicamente según el tipo de movimiento y un input opcional de texto para categorías personalizadas ("Otros"). La información se almacena utilizando el esquema de Mongoose [movimiento.model.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/database/movimiento.model.js) y se expone a través de endpoints REST en [movimientos.controller.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/controllers/movimientos.controller.js). Las transacciones activas se visualizan en tablas estructuradas en [IngresosPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/IngresosPage.jsx) and [EgresosPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/EgresosPage.jsx). Las pruebas `CP-10` a `CP-17` comprueban la validación de montos positivos y el aislamiento de datos por usuario (`userId`).

- **Sprint 3 (25.05.2026) — Desactivación Lógica e Inhabilitación:**
  El resultado esperado es la funcionalidad de borrado lógico (Soft Delete) de transacciones para fines de auditoría sin pérdida de historial. Se entrega el botón de inactivación integrado en los listados del frontend, el cual envía peticiones HTTP PATCH a `/api/movimientos/:id/inhabilitar` (con alias `/inactivar` para compatibilidad) procesadas por el controlador [movimientos.controller.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/controllers/movimientos.controller.js). Los movimientos desactivados cambian su estado a `'inactivo'` en MongoDB Atlas y se renderizan con opacidad reducida en las tablas. El cálculo del balance se actualiza en el hook [useAnalisisGastos.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/hooks/useAnalisisGastos.js) para omitir automáticamente todos los movimientos inhabilitados. Además, se añade la funcionalidad de limpieza de formularios en el cliente React. Las pruebas `CP-18` a `CP-23` comprueban el recálculo automático del saldo neto de caja tras inactivar egresos e ingresos.

- **Sprint 4 (01.06.2026) — Dashboard Analítico y Alertas (Entregable Unidad 2):**
  El entregable es la consolidación del MVP core del sistema completamente operativo. Se entrega la página de control interactiva [DashboardPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/DashboardPage.jsx) que resume los ingresos y egresos netos del mes actual calculados localmente a través de [useAnalisisGastos.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/hooks/useAnalisisGastos.js), y despliega visualizaciones gráficas interactivas desarrolladas con la librería Recharts en [Graficos.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/components/Graficos.jsx) (gráficos de barras y líneas para evolución mensual). Asimismo, se incluye el componente [AlertasComponent.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/components/AlertasComponent.jsx) que dispara advertencias en la UI ante gastos que exceden 1.2x ("elevado") o 1.5x ("muy elevado") el promedio histórico de la categoría del usuario. Las pruebas `CP-24` a `CP-31` validan el dinamismo del balance general, la actualización inmediata de los gráficos tras nuevos registros y el disparo de las alertas financieras.

- **Sprint 5 (08.06.2026) — Reportes Avanzados e Integración OCR:**
  El resultado es la incorporación de la inteligencia de extracción de datos y análisis avanzado de transacciones. Se entrega la vista estructurada [ReportesPage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/ReportesPage.jsx) que agrupa resúmenes históricos e incluye filtros locales de búsqueda rápida por mes y categoría para optimizar el rendimiento de la base de datos. Se integra el procesamiento digital de comprobantes en el frontend mediante el hook [useImageToMovimiento.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/hooks/useImageToMovimiento.js), que carga imágenes de vouchers de Yape o Plin y las envía en base64 hacia el microservicio en Python (FastAPI) detallado en [main.py](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/ml_backend/main.py). Este procesa la imagen usando filtros Gaussianos y binarización con OpenCV, extrae el texto mediante Tesseract OCR, y clasifica automáticamente el concepto de compra en categorías financieras utilizando un modelo predictivo de Multinomial Naive Bayes y TF-IDF entrenado mediante el script [train_model.py](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/ml_backend/train_model.py). Las pruebas `CP-32` a `CP-37` verifican la correcta extracción del monto desde la imagen y el manejo de errores ante imágenes ilegibles o servidores offline.

- **Sprint 6 (15.06.2026) — Planificador de Compras, Perfil y Despliegue Final:**
  El resultado esperado es el cierre del alcance del sistema FinanceFlow con su puesta en producción. Se entrega el componente del planificador en [PlanificadorCompras.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/components/PlanificadorCompras.jsx) que proyecta el número de meses necesarios para realizar una compra basándose en la tasa de ahorro promedio mensual calculada a partir de los datos históricos transaccionales. Se incluye la página de administración de cuenta en [ProfilePage.jsx](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/frontend/src/pages/ProfilePage.jsx) para actualizar el nombre e email de forma segura. Se realiza el control de calidad ejecutando de forma íntegra los **94 casos de prueba** automatizados en el entorno de pruebas, y finalmente se despliega el monorepo en producción (el cliente React en Vercel, y los servicios de backend Express y FastAPI en Render). Las pruebas `CP-38` a `CP-42` validan la precisión matemática de la proyección de ahorro, el bloqueo ante ahorro nulo o negativo, y la estabilidad general de la conexión remota con MongoDB Atlas.

---

### Documentos de Ingeniería (Visión, SRS, SAD)
- **Documento de Visión:** Define la necesidad de negocio, perfil de usuarios e integraciones principales.
- **Documento de Especificación de Requisitos de Software (SRS):** Detalla los requerimientos funcionales (registro, edición, inhabilitación lógica, reportes, OCR) y no funcionales.
- **Documento de Arquitectura de Software (SAD):** Describe los diagramas de componentes, despliegue, flujo de datos y el modelo de datos relacional de MongoDB bajo la arquitectura en capas MVC.

---

## Cronograma (Pág. 11)
El cronograma de actividades se dividió en 6 hitos cronológicos distribuidos en 12 semanas de desarrollo:
- **Semanas 1-2 (Sprint 1):** Definición de especificaciones funcionales, estructuración física de esquemas NoSQL en MongoDB Atlas y configuración de repositorios Git.
- **Semanas 3-4 (Sprint 2):** Desarrollo del backend REST en Node.js, validación JWT, encriptación bcryptjs y estructuración básica del frontend React.
- **Semanas 5-6 (Sprint 3):** Implementación de formularios de captura React Hook Form y vistas de transacciones.
- **Semanas 7-8 (Sprint 4):** Modelado de IA en Python, pipeline OpenCV + Tesseract OCR y entrenamiento Naive Bayes en FastAPI.
- **Semanas 9-10 (Sprint 5):** Desarrollo del componente `PlanificadorCompras.jsx` e integración de las visualizaciones interactivas `Recharts`.
- **Semanas 11-12 (Sprint 6):** Automatización de pruebas con Jest, auditorías de dependencias y despliegue público del monorepo en Render y Vercel.

---

## Presupuesto (Pág. 12)
El presupuesto del proyecto se estimó considerando el costo de desarrollo bajo el supuesto académico de 2 personas a tiempo parcial:
- **Costos de Personal:** S/. 12,000 (S/. 2,000 mensuales por integrante del equipo durante 3 meses, para un total de 2 integrantes: Sebastian Rodrigo Arce Bracamonte y Brant Antony Chata Choque).
- **Servicios Cloud (Infraestructura):** S/. 0.00 (Capas de hosting gratuitas provistas por Render para servidores web y Docker, Vercel para estáticos del cliente y MongoDB Atlas para base de datos NoSQL).
- **Licencias de Software:** S/. 0.00 (Se optó exclusivamente por herramientas y librerías de código abierto y libres de regalías).
- **Costo Total Estimado:** S/. 12,000.

---

## Conclusiones (Pág. 13)
1. La integración de una arquitectura en capas MVC en el backend en Express posibilitó una separación limpia de rutas, controladores y servicios, facilitando el desarrollo independiente y mantenibilidad del sistema.
2. La implementación de visión artificial y el clasificador predictivo (Naive Bayes) permitieron una reducción estimada del tiempo de registro manual mediante la automatización del flujo OCR.
3. El módulo de digitalización de vouchers de pago (Yape/Plin) ofrece una tasa de extracción exitosa en comprobantes con buena calidad de imagen, facilitando el procesamiento dinámico.

---

## Recomendaciones (Pág. 14)
1. Integrar el endpoint del simulador local `/sync/{bank}` con pasarelas de conexión bancaria autorizadas reales (como Belvo o Prometeo) para permitir una sincronización directa de las transacciones financieras en tiempo real.
2. Incorporar un middleware de limitación de solicitudes (por ejemplo, `express-rate-limit`) en el backend REST en Express. Esto mitigará potenciales amenazas de denegación de servicio (DoS) y blindará los endpoints críticos como `/api/usuarios/login` y `/api/usuarios/forgot-password` contra ataques de fuerza bruta.
3. Configurar un servicio de persistencia física de imágenes (como un bucket cifrado de AWS S3) para almacenar de manera permanente los comprobantes escaneados, mejorando el control de auditoría de los usuarios.

---

## Bibliografía (Pág. 15)
1. Fowler, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley Professional.
2. Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. *Journal of Machine Learning Research*, 12, 2825-2830.
3. McKinney, W. (2012). *Python for Data Analysis*. O'Reilly Media.

---

## Anexos (Pág. 16)
Este apartado incluye las referencias a los documentos técnicos del proyecto:

- **Anexo 01: Informe de Factibilidad**
  *Se detalla el análisis de viabilidad técnica y económica que justifica el uso de infraestructuras serverless gratuitas para el despliegue del monorepo.*
- **Anexo 02: Documento de Visión**
  *Define el alcance, objetivos funcionales del aplicativo financiero e identificación de los usuarios objetivos dentro de la comunidad universitaria.*
- **Anexo 03: Documento SRS (Especificación de Requisitos de Software)**
  *Detalla formalmente los requisitos funcionales de la aplicación de ingresos y egresos, incluyendo diagramas de casos de uso y restricciones según el estándar IEEE 830.*
- **Anexo 04: Documento SAD (Documento de Arquitectura de Software)**
  *Documento detallado que incluye diagramas de componentes, flujos de secuencia y el modelado de datos de MongoDB Atlas estructurado bajo la arquitectura en capas MVC.*
- **Anexo 05: Manuales y Reporte de Pruebas**
  *Contiene las instrucciones de despliegue, el manual operativo del usuario final y el reporte de aseguramiento de la calidad. El software está validado mediante una suite formal de 94 casos de prueba distribuidos en 18 archivos (12 backend, 16 frontend y 66 en la biblioteca del SDK) desarrollados sobre Jest y React Testing Library. Adicionalmente, el SDK integra un panel de control de simulación de testing paralelo con 50 iteraciones registradas de stress con una tasa de éxito del 100%.*
