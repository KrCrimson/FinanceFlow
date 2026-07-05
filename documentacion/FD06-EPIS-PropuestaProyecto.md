# FD06 — Propuesta de Proyecto (Version 2.0)

# Propuesta de Proyecto: Sistema de Balance y Clasificación Inteligente Seguro

---

## 1. Planteamiento del problema (Pág. 4)
En la sociedad contemporánea, la digitalización acelerada de las transacciones económicas ha transformado la gestión financiera diaria. El advenimiento y masificación de billeteras electrónicas (como Yape y Plin) y aplicaciones de banca móvil han multiplicado el número de microtransacciones cotidianas. A pesar de la agilidad en los pagos, los usuarios carecen de herramientas centralizadas y eficientes para consolidar esta información. La administración de finanzas personales suele realizarse de manera fragmentada e insegura, recurriendo a notas de texto sin cifrar, hojas de cálculo compartidas o aplicaciones móviles comerciales de terceros que no garantizan la privacidad de los datos. Esta fragmentación de datos expone al usuario a dos problemas críticos:
1. **Dificultad de control y categorización:** Pérdida de tiempo en clasificar manualmente cada movimiento financiero (ingresos/egresos), lo que genera fricción operativa y desencadena el abandono temprano del seguimiento presupuestario.
2. **Riesgos de seguridad y privacidad:** Fugas de información financiera sensible debido al uso de almacenamiento no estructurado y la exposición inadvertida de patrones de consumo.

Este proyecto propone el desarrollo de un aplicativo de balance financiero inteligente que solucione la complejidad del registro transaccional automatizando la captura de datos mediante Machine Learning (clasificación de textos y visión artificial OCR) bajo una arquitectura en capas MVC rigurosamente segura.

---

## 2. Justificación del proyecto (Pág. 5)

### 2.1. Vulnerabilidad Creciente y Amenazas Activas
Con la digitalización de las finanzas y la proliferación de microtransacciones móviles, los vectores de ataque dirigidos al robo de información financiera personal han aumentado significativamente. El almacenamiento de comprobantes y balances en formatos desprotegidos (como archivos de texto plano o capturas de pantalla en carpetas compartidas) representa una vulnerabilidad crítica ante accesos no autorizados. Desarrollar un sistema de control de balances estructurado resulta indispensable para mitigar riesgos cibernéticos activos mediante la implementación de cabeceras de seguridad web (Helmet), validación tipada de solicitudes y control estricto del tráfico de red (CORS).

### 2.2. Protección de Datos Sensibles y Cumplimiento Legal
La Ley de Protección de Datos Personales (Ley N° 29733 en el Perú) dictamina la obligatoriedad de resguardar con estricta confidencialidad los datos de carácter económico y personal. El presente sistema responde directamente a esta exigencia legal. Toda información transaccional y credenciales se guardan de forma cifrada en la nube utilizando MongoDB Atlas. La seguridad de acceso se blinda mediante tokens de sesión basados en JSON Web Tokens (JWT) con un tiempo de expiración estricto de 7 días (`expiresIn: '7d'`) y contraseñas protegidas con hashes de alta entropía (bcryptjs con 10 rondas de sal).

### 2.3. Insuficiencia de las Soluciones Tradicionales
Las metodologías de registro financiero tradicionales (como los cuadernos contables o las planillas locales de Microsoft Excel) carecen de mecanismos integrados de auditoría, cifrado seguro o automatización contextual. Además, no disponen de algoritmos capaces de procesar descripciones semánticas o digitalizar vouchers. El aplicativo propuesto solventa estas deficiencias ofreciendo un clasificador inteligente basado en Naive Bayes y un motor OCR local/remoto que elimina la carga operativa del copiado manual de datos.

### 2.4. Impacto Económico Directo y Retorno de Inversión (ROI)
La implementación del sistema faculta al usuario para mapear analíticamente su flujo de caja y detectar "gastos hormiga" o ineficiencias presupuestarias mensuales. Se estima que el control preciso provisto por la plataforma puede traducirse en una reducción de gastos innecesarios de entre el 10% y el 15% mensual. Dado que el costo marginal de infraestructura del software en producción es cero (gracias a los planes de hosting gratuitos), el retorno de inversión (ROI) es directo y se traduce en una mayor capacidad de ahorro a corto plazo.

### 2.5. Ventaja Competitiva y Posicionamiento Institucional
El diseño y despliegue de un desarrollo de software local que une la automatización con inteligencia artificial (FastAPI, scikit-learn, OpenCV) y altos estándares de seguridad en NodeJS posiciona al equipo técnico a la vanguardia de la innovación regional en sistemas FinTech seguros.

### 2.6. Desarrollo de Capacidades Locales y Concienciación
La introducción de la herramienta en el día a día universitario y familiar no solo promueve una cultura de planificación financiera saludable, sino que introduce buenas prácticas de seguridad informática en los usuarios (como la gestión segura de contraseñas y el manejo controlado de vouchers bancarios).

### 2.7. Alineamiento con Estrategias Nacionales de Digitalización
Esta propuesta tecnológica se alinea con la Estrategia Nacional de Transformación Digital e Inteligencia Artificial del país, promoviendo la inclusión financiera, la cultura de datos y la soberanía del software nacional libre mediante el uso de herramientas de código abierto.

---

## 3. Objetivo del proyecto (Pág. 6)

### 3.1. Objetivo General
Desarrollar una propuesta de sistema web seguro de gestión de balance financiero que automatice la clasificación de ingresos y egresos a través de algoritmos de Machine Learning y procesamiento OCR de comprobantes bancarios.

### 3.2. Objetivos Específicos
- **Diseñar la interfaz de usuario segura:** Crear una interfaz responsiva en React 18 que consuma la API a través de servicios HTTP estructurados y maneje formularios de entrada validados en cliente con Zod.
- **Implementar el motor predictivo de clasificación:** Construir un servidor web en Python 3.10 con FastAPI que aloje un pipeline de Machine Learning (`TfidfVectorizer` + `MultinomialNB`) entrenado para deducir categorías de gastos a partir del texto de la descripción.
- **Desarrollar una API transaccional robusta:** Programar una API REST en Node.js y Express usando un patrón en capas MVC que centralice la gestión de transacciones e implemente cifrado bcryptjs y verificación JWT de 7 días.
- **Construir el pipeline de visión artificial:** Desarrollar un sistema de preprocesamiento de imágenes en OpenCV y lectura OCR con Tesseract para digitalizar comprobantes de pago móviles.

---

## 4. Beneficios (Pág. 7)

### 4.1. Beneficios Tangibles (Cuantificables)
- **Reducción de Tiempo:** Ahorro directo de tiempo operativo mediante la extracción automatizada de datos a partir de imágenes de vouchers (monto, descripción, fecha) en comparación con el copiado de datos a mano.
- **Detección de Pérdidas:** Mitigación de fugas de dinero (gastos innecesarios) gracias al análisis analítico mensual de categorías.

### 4.2. Beneficios Intangibles (Estratégicos)

#### 4.2.1. Fortalecimiento de la Seguridad
Tranquilidad del usuario final de que su información transaccional sensible no es expuesta a redes públicas, viajando en canales HTTPS cifrados y protegidos por Helmet.js.

#### 4.2.2. Ventaja Competitiva Institucional
Establecimiento de una base tecnológica reutilizable en el ámbito académico para investigaciones futuras en procesamiento de lenguaje natural y visión artificial aplicados a finanzas.

#### 4.2.3. Cumplimiento Normativo
Garantizar la protección de los datos de carácter financiero de los usuarios de acuerdo con las normativas peruanas de privacidad de la información (Ley N° 29733).

### 4.3. Beneficios Operativos

#### 4.3.1. Eficiencia Operativa
Optimización del flujo de categorización inteligente mediante reentrenamientos en segundo plano automáticos. El aplicativo detecta cuando el historial de transacciones supera los 5 registros y ejecuta de forma transparente una petición POST asíncrona hacia `/retrain` con el fin de actualizar el modelo Naive Bayes local.

#### 4.3.2. Capacitación y Conocimiento
Desarrollo de competencias de ingeniería de software avanzada en el equipo mediante el uso de arquitectura en capas MVC, pipelines de NLP, visión artificial y pruebas automáticas en Jest/RTL.

### 4.4. Beneficios Sociales y Educativos

#### 4.4.1. Impacto en la Comunidad Educativa
Puesta a disposición de una herramienta ágil y gratuita para la comunidad universitaria de la EPIS, apoyando la organización de presupuestos estudiantiles.

#### 4.4.2. Desarrollo de Capacidades Locales
Fomento de hábitos económicos saludables mediante talleres interactivos de control de gastos personales sustentados en el aplicativo.

### 4.5. Beneficios Estratégicos Nacionales

#### 4.5.1. Alineamiento con Políticas Públicas
Promover la educación e inclusión financiera tecnológica en la población a través de aplicativos de uso diario intuitivos y libres de costo.

#### 4.5.2. Sostenibilidad del Proyecto
Código fuente de carácter modular, abierto y documentado, permitiendo adiciones funcionales colaborativas de la comunidad.

### 4.6. Resumen de Valor Total
El proyecto FinanceFlow consolida una respuesta de software segura y automatizada para la gestión financiera personal. A través de la combinación de visión artificial, Machine Learning y una arquitectura web moderna, reduce el esfuerzo operativo de los usuarios finales a la vez que resguarda rigurosamente la privacidad de su información financiera.

---

## 5. Alcance (Pág. 10)

### 1. Desarrollo del Aplicativo Web
Codificación del frontend SPA en React 18 y el backend Express, implementando inicio de sesión, recuperación de contraseña por email (con Nodemailer), inhabilitación lógica (Soft Delete) de registros modificando el campo `estado` a `'inactivo'`, y visualizaciones en Recharts (`BarChart` para balances generales, `LineChart` para tendencias y `PieChart` en formato donut para categorías de consumo).

### 2. Implementación de Machine Learning
Modelado en Python con FastAPI del clasificador probabilístico Naive Bayes. El preprocesamiento OCR para imágenes de vouchers incluye la conversión a escala de grises, remoción de ruido con Gaussian Blur ($5 \times 5$) y binarización con umbralización OTSU de OpenCV, extrayendo textos con Tesseract y parseando montos mediante patrones de expresiones regulares preestablecidos.

### 3. Capacitación y Sensibilización
Redacción de guías de usuario explicativas, manuales técnicos de instalación y recomendaciones de seguridad de la información.

### 4. Monitoreo y Evaluación
Implementación de monitoreo en la nube con UptimeRobot y estructuración de un sistema de logging de errores en el backend (guardado en la colección de logs en MongoDB Atlas).

### 5. Alcance Geográfico
Implementación inicial proyectada para la comunidad estudiantil y administrativa de la escuela profesional EPIS.

---

## 6. Resultados Esperados (Pág. 11)
- Aplicativo web completo desplegado en las plataformas de Render y Vercel.
- Modelo clasificador Naive Bayes integrado en el backend de FastAPI que asigna categorías de egresos en función de descripciones, redirigiendo a la categoría por defecto "Otros" cuando la probabilidad resultante del modelo matemático se sitúa por debajo del 35% de confianza.
- Pipeline de lectura OCR que extrae de forma automática los datos financieros de imágenes de comprobantes.

## 6. Requerimientos del sistema
- **Hardware:** Instancias de servidor virtuales en la nube (capa gratuita de Render). Dispositivo cliente con navegador web compatible con JavaScript.
- **Software:** Entorno de Node.js v18.x, Python 3.10 y clúster de base de datos NoSQL MongoDB Atlas.

## 7. Restricciones
- La capa gratuita de alojamiento de Render introduce un retardo de arranque en frío de hasta 50 segundos en las peticiones iniciales tras periodos prolongados de inactividad de la API.
- La precisión de la lectura automática del OCR depende de la calidad fotográfica, enfoque y resolución de la imagen del voucher.
- **Seguridad:** En esta versión actual de la base de código **no está implementado un middleware de rate limiting** (como `express-rate-limit`), representando una restricción de protección ante ataques reiterados y un hito crítico recomendado para implementaciones futuras de endurecimiento del backend.

## 8. Supuestos
- Los usuarios finales disponen de un acceso a internet estable para comunicarse con los servidores.
- Las imágenes de comprobantes compartidos por los usuarios finales mantienen un formato legible y un diseño de texto compatible con las expresiones regulares definidas en la API para montos (`r'(?:s|5|g)[\/\.\s]*(\d+(?:[\.\,]\d{1,2})?)'` y su backup `r'\b(\d+(?:[\.\,]\d{1,2})?)\b'`). Variaciones drásticas en la tipografía o formato de salida de las aplicaciones bancarias representan un supuesto de error para la captura automática.

## 9. Resultados Esperados
- Centralización estructurada del balance del usuario en MongoDB Atlas.
- Sugerencia de categorías de egresos y cálculo del tiempo de ahorro necesario para compras deseadas mediante la interacción con el componente `PlanificadorCompras.jsx`.

## 10. Metodología de implementación
Se adoptará una metodología de implementación ágil estructurada, asegurando hitos de entrega periódicos y entregando documentación de software de ingeniería que valida el cumplimiento de las normativas de calidad en las fases de análisis, construcción, aseguramiento de la calidad y transición.

## 11. Actores claves
- **Usuarios Finales:** Estudiantes y familias de la comunidad EPIS.
- **Equipo de Desarrollo:** 2 integrantes técnicos de desarrollo (Sebastian Rodrigo Arce Bracamonte y Brant Antony Chata Choque).
- **Product Owner:** Coordinación de la Escuela Profesional de Ingeniería de Sistemas.

## 12. Papel y responsabilidad personal (Pág. 12)
El proyecto es llevado a cabo por un equipo técnico de 2 integrantes con responsabilidades delimitadas de la siguiente manera:
- **Integrante 1 (Sebastian Rodrigo Arce Bracamonte):** Responsable de la arquitectura backend transaccional en Node.js y Express estructurada en tres capas (MVC), de la base de datos MongoDB Atlas (diseño de esquemas Mongoose) y de la interfaz responsiva del cliente en React 18 (integración de la lógica de servicios y Recharts).
- **Integrante 2 (Brant Antony Chata Choque):** Responsable de la ingeniería de datos e inteligencia artificial, abarcando el pipeline de visión artificial en OpenCV + Tesseract OCR, la estructuración del servidor en FastAPI y el entrenamiento de los pipelines de clasificación de textos con scikit-learn.

## 13. Plan de monitoreo y evaluación (Pág. 12)
- Vigilancia continua del estado de disponibilidad de los servidores en la nube con UptimeRobot.
- Auditoría interna y control de errores por base de datos alimentada por el controlador de logs.
- Validación del correcto funcionamiento de la API y vistas mediante la ejecución de la suite de 94 casos de prueba automatizados distribuidos en 18 archivos utilizando Jest y React Testing Library.

## 14. Cronograma del proyecto (Pág. 13)
- **Mes 1:** Especificación de requisitos. Definición lógica de esquemas de colecciones en MongoDB y diseño de prototipos e interfaces UI/UX.
- **Mes 2:** Programación de la API REST MVC en Express, lógica de autenticación JWT y encriptación bcryptjs. Implementación de los servicios HTTP e interfaces en React. Construcción del backend de Machine Learning y OCR en FastAPI.
- **Mes 3:** Pruebas de integración del monorepo, desarrollo de la suite de pruebas unitarias y de integración de Jest/RTL, pruebas de compatibilidad y despliegue final en producción.

## 15. Hitos de entregable (Pág. 13)
- **Hito 1 (Fin del Mes 1):** Backend REST Express y base NoSQL MongoDB Atlas operando localmente (Semana 4).
- **Hito 2 (Fin del Mes 2):** Integración del pipeline OCR de vouchers y el modelo predictivo de FastAPI con el frontend React, y renderizado de gráficos de consumo (Semana 8).
- **Hito 3 (Fin del Mes 3):** Conclusión de pruebas automáticas, verificación de seguridad del monorepo y despliegue público en Render y Vercel (Semana 12).

---

## RESUMEN EJECUTIVO (Pág. 15)
El **Sistema de Balance y Clasificación Inteligente Seguro** representa una solución de software orientada a resolver el descontrol de las finanzas personales y familiares en la comunidad. Utilizando técnicas de visión artificial (OpenCV + Tesseract OCR) y modelos predictivos (Multinomial Naive Bayes) en FastAPI, el aplicativo extrae y clasifica automáticamente los movimientos financieros a partir de comprobantes digitales (vouchers de Yape/Plin), reduciendo drásticamente la fricción y el tiempo del registro manual. Estructurado bajo una arquitectura de desarrollo web contemporánea de tres capas (MVC) en Node.js y Express con almacenamiento centralizado en MongoDB Atlas, el sistema ofrece una plataforma segura, robusta y escalable. El proyecto es desarrollado por 2 integrantes técnicos del equipo con una factibilidad económica optimizada a través del uso de infraestructuras serverless gratuitas, alineándose con las políticas públicas de inclusión y transformación digital del país.
