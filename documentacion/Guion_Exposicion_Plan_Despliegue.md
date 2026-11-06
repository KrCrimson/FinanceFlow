# GUION MAESTRO DE EXPOSICIÓN — PLAN DE DESPLIEGUE (FINANCEFLOW v1.3.0)
**Curso:** Construcción de Software II (Sec. A)  
**Docente:** Mag. Ricardo Eduardo Valcárcel Alvarado  
**Expositores:**
- **Sebastian Rodrigo Arce Bracamonte (2019062986)** — *Líder de Despliegue & DevOps*
- **Brant Antony Chata Choque (2020067577)** — *Infraestructura, Seguridad & QA*

---

## 🎯 ESTRATEGIA DE PRESENTACIÓN (REGLAS CLAVE)
1. **Duración objetivo:** 7 a 9 minutos en total.
2. **Dinámica:** La diapositiva muestra los conceptos clave en tarjetas limpias; el expositor explica la **lógica técnica profunda**, la **arquitectura interna** y las **decisiones de ingeniería** que no se leen en el texto de la pantalla.
3. **Manejo del Ingeniero:** Si el docente interrumpe con preguntas de seguridad o arquitectura, este guion incluye las respuestas exactas al final de cada diapositiva.

---

## DIAPOSITIVA 1: PORTADA & PROPÓSITO DEL PLAN

### 🎙️ Lo que dice SEBASTIAN:
> "Buenos días Ingeniero y compañeros. El día de hoy mi compañero Brant Chata y mi persona vamos a sustentar el **Plan de Despliegue en Producción de FinanceFlow versión 1.3.0**."
>
> "Antes de entrar a la parte técnica, es fundamental aclarar el objetivo de este documento: muchas veces se confunde 'desplegar' con simplemente hacer un `git push` o subir archivos a un hosting. En FinanceFlow, al ser un software contable y financiero que maneja dinero real, arqueos de caja chica y lectura inteligente de recibos, un error en producción significa pérdida de datos o inconsistencias contables irreversibles. Por eso, este plan de 18 páginas establece un procedimiento **controlado, auditable, reproducible y con tiempo de inactividad cero** para llevar la versión 1.3.0 a la nube de manera segura."

### 🎙️ Lo que complementa BRANT:
> "Exacto. Para lograrlo, definimos una ventana de cambio programada en horario de bajo tráfico, establecimos roles formales de DevOps, Infraestructura y QA, y redactamos planes de contingencia con reversión inmediata o *rollback* en caso de que ocurra cualquier imprevisto crítico."

💡 **Lo que NO está en la diapositiva (Contexto Clave para el Ing.):**
- El plan sigue estándares de gestión de cambios (ITIL / ISO 20000) adaptado a un flujo CI/CD ágil.
- El tag en GitHub es `v1.3.0` inmutable (no se despliega sobre la rama desarrollo suelta).

---

## DIAPOSITIVA 2: ARQUITECTURA Y TOPOLOGÍA CLOUD DISTRIBUIDA

### 🎙️ Lo que dice SEBASTIAN:
> "Pasando a la arquitectura, como pueden apreciar en el diagrama central de la diapositiva, FinanceFlow no es un monolito empaquetado en un solo servidor. Implementamos una **topología distribuida multi-cloud desacoplada**, diseñada para alta disponibilidad y resiliencia:"
>
> 1. "En la capa de presentación tenemos el **Frontend Web SPA en React 18**, alojado en **Vercel Edge Network**. Esto nos da una CDN global Anycast: los usuarios descargan la interfaz desde el nodo más cercano a su ubicación física, con carga en milisegundos."
> 2. "En la capa de lógica de negocio tenemos el **Backend Core en Node.js y Express**, desplegado como Web Service en **Render PaaS** bajo un modelo sin estado (*stateless*)."
> 3. "Y en la base tenemos la persistencia en **MongoDB Atlas**, operando en la región `us-east-1` de Amazon Web Services con clúster NoSQL replicado."

### 🎙️ Lo que complementa BRANT (Explicando lo que NO está en la diapo):
> "Aquí hay dos decisiones de diseño de software e ingeniería cruciales que queremos resaltar:
>
> Primero: **¿Cómo garantizamos Zero-Downtime en Render?**
> Render utiliza una estrategia de *Rolling Update*. Cuando liberamos la versión 1.3.0, Render no apaga el contenedor viejo. Levanta un contenedor nuevo en paralelo y comienza a consultar periódicamente nuestro endpoint `/api/health`. Solamente cuando este endpoint responde HTTP 200 confirmando que la base de datos está conectada y las variables están cargadas, el balanceador conmuta el tráfico hacia el nuevo contenedor y apaga el anterior. Los usuarios nunca experimentan pantalla en blanco ni caída de servicio.
>
> Segundo: **Nuestra Arquitectura Híbrida de Inteligencia Artificial:**
> Para el escaneo de comprobantes y tickets tenemos dos motores redundantes:
> - **Motor 1 (Primario Cloud):** La API de Google Gemini Vision, que utiliza un modelo multimodal para extraer de forma estructurada los montos y categorías con gran precisión semántica.
> - **Motor 2 (Fallback Local en Docker):** Un microservicio en Python FastAPI con la librería Tesseract OCR corriendo en un contenedor Docker en Render. Si la API de Gemini se cae o agota su cuota, el backend conmuta automáticamente al motor Docker. Hay cero riesgo de parada operativa."

💡 **Pregunta típica del Ing.:** *"¿Por qué usan Vercel para frontend y Render para backend en vez de todo en una sola máquina virtual?"*  
**Respuesta:** *"Porque desacopla los ciclos de vida. Si el backend se reinicia por una actualización, el frontend sigue disponible en la CDN mostrando estados de carga limpios. Además, el despliegue en Vercel es atómico: cambia un puntero de alias en menos de 10 segundos con soporte de Blue-Green nativo."*

---

## DIAPOSITIVA 3: PROCEDIMIENTO OPERATIVO PASO A PASO Y SEGURIDAD

### 🎙️ Lo que dice BRANT:
> "En esta tercera diapositiva resumimos la secuencia operativa de despliegue desde cero, dividida en 6 pasos técnicos:
>
> En el **Paso 1**, aprovisionamos el clúster en MongoDB Atlas. Creamos un usuario de aplicación `financeflow_app` y aquí surge un punto clave de seguridad:
> Render y Vercel utilizan direcciones IP públicas dinámicas que cambian continuamente. Para permitir la conexión, en MongoDB Atlas se habilita la regla de red `0.0.0.0/0`."
>
> "Ahora bien: ¿esto es inseguro? **Categóricamente no.** En nuestro plan aplicamos el estándar de **Defensa en Profundidad (Defense-in-Depth)**:
> 1. Exigimos autenticación criptográfica obligatoria con **SCRAM-SHA-256**.
> 2. Todo el túnel de transporte viaja estrictamente cifrado por **TLS 1.3** con certificados X.509 validados.
> 3. El usuario `financeflow_app` tiene privilegios de mínimo acceso: solo puede leer y escribir en la base `financeflow`, no puede administrar el servidor ni tocar otras bases."

### 🎙️ Lo que continúa SEBASTIAN:
> "En el **Paso 2**, generamos los secretos criptográficos en la terminal usando `crypto.randomBytes(32).toString('hex')`. Esto nos genera tokens pseudoaleatorios de 64 caracteres con máxima entropía para el `JWT_SECRET`. Ningún secreto se sube a GitHub; todos se inyectan como variables de entorno directamente en los dashboards de Render y Vercel.
>
> En los **Pasos 3, 4 y 5**, se vinculan los repositorios y se configuran las variables cruzadas: `CORS_ORIGIN` en el backend apuntando al dominio de Vercel para mitigar ataques CSRF y orígenes no autorizados, y `REACT_APP_API_URL` en el frontend.
>
> Y finalmente en el **Paso 6**, ejecutamos el script de **Bootstrap del Superadministrador**. Este script corre directamente sobre el backend en la consola segura, comprueba que la base esté limpia y crea al administrador principal encriptando su clave con **bcrypt a 10 rondas de sal**, asegurando que jamás exista una contraseña en texto plano en la base de datos."

💡 **Lo que NO está en la diapositiva:**
- El archivo `vercel.json` tiene la instrucción `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]` para que el enrutamiento de React Router no lance error 404 al refrescar páginas.

---

## DIAPOSITIVA 4: VALIDACIÓN AUTOMÁTICA, PRECHEQUEO Y CRITERIOS GO/NO-GO

### 🎙️ Lo que dice SEBASTIAN:
> "Para no depender del factor humano o de la memoria durante el despliegue, desarrollamos un script de prechequeo automatizado llamado **`deploy-preflight.js`** ubicado en la carpeta `scripts/` de nuestro repositorio.
>
> Este script actúa como una **compuerta bloqueante o *Quality Gate*** previa al despliegue. Lo ejecutamos con `node scripts/deploy-preflight.js` y valida en menos de 20 segundos 4 dimensiones críticas:
> 1. **Entorno:** Que Node.js sea versión 18 o superior (detectó v24 en nuestro servidor).
> 2. **Archivos críticos:** Verifica la existencia de `package.json`, `app.js`, `database.js` y `vercel.json`.
> 3. **Variables de entorno:** Confirma que `MONGODB_URI`, `JWT_SECRET`, `PORT` y `CORS_ORIGIN` estén presentes y con longitud adecuada.
> 4. **Pruebas Automatizadas:** Ejecuta las **19 suites de pruebas unitarias y de integración de Jest con 170 pruebas**, aprobadas al 100%.
>
> Si el script detecta un solo fallo, finaliza con código de error 1 y aborta el despliegue de inmediato."

### 🎙️ Lo que complementa BRANT:
> "Una vez superado el pre-vuelo y desplegados los contenedores, aplicamos la **Matriz Go / No-Go**.
> Para que el Líder de Despliegue y el área de QA autoricen la apertura del sistema al público, se deben cumplir obligatoriamente 5 criterios de aceptación:
> 1. Que `/api/health` responda HTTP 200 en menos de 800 milisegundos.
> 2. Que las **7 colecciones NoSQL** de MongoDB estén inicializadas (incluyendo la colección `presupuestos` con su índice compuesto único para evitar duplicidades).
> 3. Que las cabeceras de seguridad HTTP de **Helmet** y las políticas de CORS bloqueen peticiones externas maliciosas.
> 4. Que las pruebas de humo funcionales en vivo (login, registro de gasto, arqueo de caja y cobro de membresía Pro con Culqi) se completen con cero errores.
> 5. Y finalmente, activamos la **observabilidad en tiempo real con Sentry**: cualquier error 500 no capturado en producción dispara una alerta inmediata a nuestro canal técnico para su contención."

💡 **Lo que NO está en la diapositiva:**
- En Anexo B del documento se documentaron las 7 colecciones: `usuarios`, `movimientos`, `cierres`, `pagos`, `recordatorios`, `logs` y `presupuestos`.
- La colección `cierres` posee un índice compuesto `{ userId: 1, tipo: 1, periodo: 1 }` que impide físicamente que un cajero cierre dos veces el mismo día en caja chica.

---

## DIAPOSITIVA 5: PLAN DE CONTINGENCIA, ROLLBACK Y CIERRE

### 🎙️ Lo que dice BRANT:
> "Para finalizar, ningún plan de despliegue profesional está completo si no define con exactitud **cómo regresar al estado anterior si todo sale mal**.
>
> En la Diapositiva 5 establecemos los **Activadores de Reversión**:
> Si se presenta una incompatibilidad grave de librerías, si la base de datos no conecta tras 15 minutos, si falla el arqueo de caja chica o si la tasa de error HTTP 5xx supera el 0.1%, el Líder de Despliegue declara inmediatamente el **NO-GO** y se activa el Rollback."

### 🎙️ Lo que complementa SEBASTIAN:
> "El procedimiento de Rollback toma **menos de 5 minutos** gracias a la arquitectura que elegimos:
>
> 1. **En Vercel (Frontend):** Con un solo clic en el panel o vía CLI se activa el *Instant Rollback*, conmutando el alias de producción a la versión anterior en menos de 10 segundos.
> 2. **En Render (Backend):** Desde la pestaña 'Events', se redepliega el commit previo estable sin necesidad de recompilar desde cero.
> 3. **En MongoDB (Base de datos):** En caso de corrupción de esquemas, tenemos el comando oficial documentado con `mongorestore --uri="..." --archive="backup.gz" --gzip --drop`.
>
> Pero aquí hay una regla de oro que enfatizamos en el informe: **La restauración de base de datos no se ejecuta a ciegas**, porque sobreescribir con `--drop` borraría transacciones que usuarios legítimos pudieron registrar en esos minutos. Esa decisión requiere la firma expresa del Propietario del Servicio (Product Owner).
>
> Con esto concluye nuestro Plan de Despliegue de FinanceFlow v1.3.0, garantizando un software robusto, resiliente y preparado para operar en la nube. Muchas gracias y quedamos atentos a sus preguntas."

---

## 🛡️ GUÍA RÁPIDA DE RESPUESTAS A PREGUNTAS DIFÍCILES DEL PROFESOR

| Pregunta del Ingeniero | Respuesta Técnica Inmediata |
| :--- | :--- |
| **"¿Por qué no usaron Docker para todo el sistema?"** | *"Para el frontend y backend aprovechamos las ventajas nativas serverless de Vercel y Render (CDN Anycast global y Rolling Updates gestionados). Sin embargo, para la IA sí usamos Docker con FastAPI y Tesseract OCR porque requeríamos dependencias del sistema operativo C++ que no vienen en un runtime estándar de Node.js."* |
| **"¿Qué pasa si un usuario entra a la app justo cuando están haciendo el deploy?"** | *"No percibe ninguna interrupción. Vercel conmuta atómicamente el CDN sin estado intermedio. Y en Render, el contenedor viejo sigue respondiendo peticiones hasta que el contenedor nuevo pasa con éxito la sonda de salud en `/api/health`."* |
| **"¿Cómo protegen las contraseñas y datos sensibles?"** | *"Las contraseñas se almacenan con bcrypt con factor de costo 10. Las variables y secretos JWT se inyectan en tiempo de ejecución en la memoria del contenedor, nunca en archivos estáticos ni en el control de versiones."* |
| **"¿Quién autoriza el paso a producción?"** | *"El Líder de Despliegue en conjunto con el Responsable de QA y el Product Owner tras validar el 100% del checklist de aceptación y el script de pre-vuelo."* |
