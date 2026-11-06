# GUION TÉCNICO DE SUSTENTACIÓN DE 15 MINUTOS
## ASIGNATURA: CONSTRUCCIÓN DE SOFTWARE II
### TRABAJO: CONFIGURACIÓN DE AMBIENTES Y PROCEDIMIENTO DE DESPLIEGUE (FINANCEFLOW)

**Docente:** Mag. Ricardo Eduardo Valcárcel Alvarado  
**Expositores:** Sebastian Arce Bracamonte & Brant Antony Chata Choque  
**Duración Total:** 15 Minutos cronometrados

---

## ⏱️ Cronograma de Exposición (Minuto a Minuto)

| Bloque Temporal | Tema a Sustentar | Diapositivas | Expositor Sugerido |
| :---: | :--- | :---: | :---: |
| **00:00 - 02:00** | Portada, Introducción y Contextualización del Proyecto FinanceFlow | Diapos 1 - 3 | Sebastian Arce |
| **02:00 - 04:30** | Marco Teórico: Despliegue de Software y Estrategias Modernas | Diapos 4 - 6 | Brant Chata |
| **04:30 - 07:00** | Ambientes de Software y Herramientas del Ecosistema DevOps | Diapos 7 - 9 | Brant Chata |
| **07:00 - 10:00** | Arquitectura del Sistema FinanceFlow y Configuración de Ambientes | Diapos 10 - 12 | Sebastian Arce |
| **10:00 - 12:30** | Procedimiento de Despliegue en 6 Fases y Pipeline CI/CD | Diapos 13 - 15 | Brant Chata |
| **12:30 - 14:00** | Plan de Rollback, Seguridad en Capas y Evidencias de Pruebas | Diapos 16 - 18 | Sebastian Arce |
| **14:00 - 15:00** | Conclusiones, Lecciones Aprendidas y Apertura a Preguntas | Diapo 19 - 20 | Ambos |

---

## 🎙️ Guion Narrativo Detallado

### [00:00 - 02:00] BLOQUE 1: Introducción y Contexto (Sebastian Arce)
> *"Buenos días, estimado docente Magíster Ricardo Valcárcel y compañeros. El día de hoy, junto a mi compañero Brant Chata, tenemos el agrado de presentar nuestro trabajo de investigación aplicada y documentación técnica titulado: **'Diseño y Elaboración del Documento de Configuración de Ambientes y Procedimiento de Despliegue para FinanceFlow utilizando prácticas de CI/CD y DevOps'**.*
>
> *FinanceFlow es una solución de gestión financiera y contabilidad inteligente diseñada para resolver el problema del descontrol del flujo de caja personal y familiar. Tradicionalmente, los usuarios abandonan el registro financiero porque transcribir tickets o comprobantes de Yape y Plin es manual y tedioso. FinanceFlow soluciona esto integrando Visión Artificial por IA con Gemini Vision OCR, permitiendo digitalizar comprobantes en segundos.*
>
> *Para que un software de esta naturaleza opere con confiabilidad bancaria, no basta con escribir código que funcione en la máquina del desarrollador; es indispensable implementar una gestión estricta de configuración, aislamiento de ambientes y pipelines de despliegue automatizados y seguros."*

---

### [02:00 - 04:30] BLOQUE 2: Investigación Teórica y Estrategias (Brant Chata)
> *"Gracias, Sebastian. Entrando a la base teórica de nuestra investigación: el despliegue de software es la transición crítica donde el código se transforma en valor tangible para el usuario final.*
>
> *En nuestra investigación analizamos a fondo las estrategias modernas de despliegue:*
> * *El método **Recreate**, aunque simple, genera un downtime inaceptable para servicios financieros.*
> * *El **Rolling Update** permite actualizar instancias de manera escalonada sin interrumpir el servicio.*
> * *Y la estrategia **Blue/Green Deployment**, que es la que adoptamos en FinanceFlow combinando Vercel y Render: mantenemos dos entornos idénticos, validamos la nueva versión en reposo y conmutamos el tráfico en milisegundos a través del DNS y el balanceador. Esto nos permite un rollback instantáneo si se detecta cualquier anomalía.*
>
> *Asimismo, contrastamos el despliegue manual contra el automatizado, demostrando cómo la automatización erradica el error humano, garantiza la reproducibilidad mediante contenedores y reduce los tiempos de liberación de horas a solo minutos."*

---

### [04:30 - 07:00] BLOQUE 3: Ambientes de Software y Ecosistema de Herramientas (Brant Chata)
> *"Un pilar clave del trabajo fue la definición de los cuatro ambientes tecnológicos:*
> * * **DEV:** Nuestro entorno local con Docker Desktop y base de datos de pruebas.*
> * * **QA:** Destinado al aseguramiento de calidad con réplicas de datos sintéticos y ejecución de pruebas de regresión.*
> * * **STAGING:** Entorno espejo idéntico a producción donde se validan certificados SSL reales, pruebas de carga con k6 y pasarelas en modo Sandbox.*
> * * **PRODUCCIÓN:** Entorno de alta disponibilidad con SLA de 99.9%, hardening de seguridad y monitoreo continuo.*
>
> *Para sostener este ciclo seleccionamos las herramientas líderes del mercado: Git y GitHub para control distribuido y gestión de Pull Requests con protección de ramas; Docker para empaquetamiento inmutable; GitHub Actions como orquestador del pipeline; SonarQube para auditoría de código estático; y Postman para pruebas de integración de API."*

---

### [07:00 - 10:00] BLOQUE 4: Arquitectura y Configuración de Ambientes (Sebastian Arce)
> *"Al aplicar estos principios a nuestro proyecto FinanceFlow, diseñamos una arquitectura en tres capas altamente desacoplada y resiliente:*
> * * **Capa Frontend:** Una Single Page Application en React 18 alojada en la red Edge de **Vercel**, con compresión Brotli y routing protegido.*
> * * **Capa Backend:** Una API REST modular en Node.js y Express 5 hospedada en **Render Cloud Services**, con auto-reinicio y health checks continuos.*
> * * **Capa de Persistencia:** Un clúster **MongoDB Atlas M10** distribuido en múltiples zonas de disponibilidad con cifrado en reposo AES-256.*
>
> *En cuanto a la **seguridad de ambientes**, implementamos un modelo de Defensa en Profundidad: autenticación multifactor obligatoria en consolas de gestión, políticas de mínimo privilegio (RBAC), restricción estricta de IPs en la base de datos, cabeceras HTTP seguras con Helmet, Rate Limiting contra ataques de fuerza bruta y un protocolo de respaldo continuo 3-2-1 con capacidad de restauración al minuto."*

---

### [10:00 - 12:30] BLOQUE 5: Procedimiento de Despliegue y Pipeline CI/CD (Brant Chata)
> *"Para garantizar que cada pase a producción sea predecible y sin sorpresas, formalizamos un **Procedimiento de Despliegue en Seis Fases**, respaldado por nuestra Matriz RACI y Checklist interactivo:*
> 1. * **Preparación:** Corte de la rama de release y generación de tag semántico inmutable.*
> 2. * **Pruebas:** Ejecución obligatoria de suites unitarias y de integración.*
> 3. * **Aprobación:** Reunión técnica Go/No-Go del Comité de Cambios (CAB).*
> 4. * **Despliegue:** Migración idempotente de índices en base de datos y conmutación atómica de contenedores.*
> 5. * **Validación:** Smoke Tests automatizados verificando login, balance y escaneo de comprobantes.*
> 6. * **Cierre:** Registro de evidencias y actualización de métricas en Sentry.*
>
> *Todo este flujo fue programado en un pipeline de **GitHub Actions** con compuertas de calidad que rechazan de forma automática cualquier intento de integración que no supere el 75% de cobertura de código o presente vulnerabilidades de seguridad."*

---

### [12:30 - 14:00] BLOQUE 6: Plan de Rollback y Evidencias Reales (Sebastian Arce)
> *"Uno de los anexos más críticos exigidos es el **Plan de Rollback**. Ningún procedimiento está completo sin un mecanismo probado de escape ante fallos.*
> * *Definimos métricas claras: un **RTO menor a 10 minutos** y un **RPO menor a 15 minutos**.*
> * *En caso de emergencia, revertimos el puntero en Vercel en menos de 30 segundos, conmutamos la imagen en Render y restauramos el snapshot de MongoDB Atlas de manera consistente.*
>
> *Para demostrar que esto no es solo teoría, presentamos las evidencias directas de nuestro repositorio Git sincronizado en GitHub y el reporte real de nuestras **12 suites de pruebas automatizadas con 29 tests pasando al 100%**, abarcando controladores, endpoints E2E, criptografía y validaciones de seguridad contra inyección NoSQL."*

---

### [14:00 - 15:00] BLOQUE 7: Conclusiones y Cierre (Ambos)
> *"En conclusión, esta actividad académica nos ha permitido comprobar que la excelencia en la construcción de software trasciende la codificación: radica en la capacidad de diseñar ambientes estables, automatizar la entrega de valor mediante CI/CD y gestionar el riesgo operacional con procedimientos formales de despliegue y contingencia.*
>
> *Agradecemos su atención y quedamos a su entera disposición para absolver cualquier pregunta técnica sobre la arquitectura, el pipeline o las configuraciones presentadas. ¡Muchas gracias!"*
