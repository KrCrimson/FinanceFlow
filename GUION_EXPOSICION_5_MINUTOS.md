# GUION DE EXPOSICIÓN EJECUTIVA (MENOS DE 5 MINUTOS)
## Proyecto: FinanceFlow (v1.3.0) — Sistema de Gestión Financiera & Inteligencia con IA
**Archivo de Diapositivas:** [`PRESENTACION_EJECUTIVA_FINANCEFLOW.pptx`](file:///c:/Users/HP/Documents/GitHub/FinanceFlow/PRESENTACION_EJECUTIVA_FINANCEFLOW.pptx)  
**Tiempo Máximo:** 4 minutos con 45 segundos (dejando 15s de margen de seguridad)  
**Tono:** Seguro, directo, corporativo y con foco en resultados cuantitativos e ingeniería.

---

### ⏱️ Cronómetro Global de la Presentación
* **Diapositiva 1:** [0:00 - 0:25] — Portada e Introducción (25s)
* **Diapositiva 2:** [0:25 - 1:00] — Resumen Ejecutivo y Avance (92%) (35s)
* **Diapositiva 3:** [1:00 - 1:35] — Cronograma de Desarrollo & Diagrama de Gantt (35s)
* **Diapositiva 4:** [1:35 - 2:15] — Arquitectura y Stack Tecnológico (40s)
* **Diapositiva 5:** [2:15 - 3:00] — Estado de Abstracción y Patrones de Diseño (45s)
* **Diapositiva 6:** [3:00 - 3:45] — Diagnóstico de Abstracción y Fugas Detectadas (45s)
* **Diapositiva 7:** [3:45 - 4:25] — Calidad, Pruebas y Plan de Hardening (Sprint 7) (40s)
* **Diapositiva 8:** [4:25 - 4:45] — Conclusión Ejecutiva y Cierre (20s)

---

## 🎙️ Guion Paso a Paso por Diapositiva

---

### 🎬 Diapositiva 1: Portada Ejecutiva
**Tiempo asignado:** 0:00 - 0:25 (25 segundos)  
**Objetivo:** Establecer contexto académico, nombres de los autores y propósito central.

> **Qué decir:**
> *"Buenos días docente y compañeros. Presentamos el informe ejecutivo y el estado de abstracción de **FinanceFlow (v1.3.0)**, desarrollado por Sebastian Arce y mi persona, Brant Chata, para el curso de Construcción de Software I de la EPIS - Universidad Privada de Tacna.*
> 
> *FinanceFlow es una solución de gestión financiera personal y empresarial potenciada con visión artificial por IA, pasarelas de pago y desacoplamiento enterprise mediante un SDK propio."*

---

### 📊 Diapositiva 2: Resumen Ejecutivo & Avance General (92%)
**Tiempo asignado:** 0:25 - 1:00 (35 segundos)  
**Objetivo:** Transmitir métricas de éxito contundentes y eficiencia presupuestal.

> **Qué decir:**
> *"El proyecto registra un **92% de avance general consolidado**. Hemos completado el 100% de los 15 requerimientos funcionales del SRS, incluyendo el escaneo OCR inteligente y el planificador de compras.*
> 
> *En calidad, la migración a SDK cuenta con **66/66 pruebas exitosas** (172 ms) y el 100% de las 12 vulnerabilidades de seguridad remediadas y certificadas. Todo esto con un costo cloud de **S/. 0.00**, maximizando las capas gratuitas de MongoDB Atlas, Vercel y Render."*

---

### 📅 Diapositiva 3: Cronograma de Desarrollo (Diagrama de Gantt)
**Tiempo asignado:** 1:00 - 1:35 (35 segundos)  
**Objetivo:** Explicar visualmente la evolución temporal de los 7 sprints y el estado actual.

> **Qué decir:**
> *"En pantalla observamos el cronograma oficial de 15 semanas estructurado en 7 sprints consecutivos:*
> * *Los **Sprints 1 al 6** (en verde esmeralda) completaron con éxito el núcleo transaccional, las alertas con Recharts, el motor Gemini OCR y las pasarelas de pago.*
> * *El **Hito de Migración del SDK Balance** consolidó la arquitectura desacoplada entre las semanas 12 y 13.*
> * *Actualmente nos ubicamos en la línea vertical cian: el **Sprint 7 de Hardening**, con un 70% de avance para cerrar deudas de pruebas y formalizar el pase a producción definitiva v1.4.0."*

---

### 🏗️ Diapositiva 4: Arquitectura Tecnológica & Stack
**Tiempo asignado:** 1:35 - 2:15 (40 segundos)  
**Objetivo:** Demostrar el dominio técnico del ecosistema distribuido.

> **Qué decir:**
> *"Nuestra solución opera bajo un ecosistema full-stack distribuido en 4 frentes:*
> 
> 1. *En el **Frontend y Móvil**, contamos con una SPA en React 18 con Tailwind y Recharts, complementada con un aplicativo móvil en React Native Expo.*
> 2. *En el **Backend**, una API REST en Node.js y Express 5 estructurada en tres capas limpias con validaciones tipadas con Zod y seguridad JWT estricta.*
> 3. *En el **Motor de Inteligencia Artificial**, implementamos un pipeline híbrido: Google Gemini Pro Vision API para digitalizar tickets complejos en la nube, y un microservicio en FastAPI Python con OpenCV, Tesseract y un clasificador probabilístico Naive Bayes para inferencia continua.*
> 4. *Y en **Monetización y Persistencia**, operamos con MongoDB Atlas y una pasarela de pagos integrada para Stripe, Mercado Pago y Flow.cl con webhooks criptográficos HMAC en modo Fail-Closed."*

---

### 🏛️ Diapositiva 4: Estado de Abstracción: Jerarquía & Patrones
**Tiempo asignado:** 2:00 - 2:50 (50 segundos)  
**Objetivo:** Sustentar teórica y arquitectónicamente la madurez del software.

> **Qué decir:**
> *"Al evaluar el estado de abstracción, el sistema se organiza en una **jerarquía rigurosa de 6 niveles**: desde el Nivel 5 de Presentación (UI), pasando por el Nivel 4 de Hooks de estado, el Nivel 3 de Consumo del SDK, hasta llegar a la Capa de Dominio en el Nivel 1 donde residen los servicios puros que no tocan HTTP, y la persistencia en el Nivel 0.*
> 
> *Destacamos 4 patrones de diseño fundamentales:*
> * *El patrón **Fachada (Facade)** en la clase `BalanceSDK`, que encapsula tokens, reintentos y clientes HTTP.*
> * *El patrón **Adaptador (Adapter)**, que permitió una migración gradual sin romper el frontend existente mediante Feature Flags.*
> * *El patrón **Gateway / Strategy**, que unifica múltiples pasarelas bancarias bajo un mismo contrato.*
> * *Y el patrón **State & Soft Delete**, que garantiza la inmutabilidad contable y el cierre definitivo de periodos en caja chica."*

---

### ⚠️ Diapositiva 5: Diagnóstico de Calidad: Fugas de Abstracción
**Tiempo asignado:** 2:50 - 3:40 (50 segundos)  
**Objetivo:** Mostrar madurez y autocrítica técnica identificando la deuda del código.

> **Qué decir:**
> *"Una buena ingeniería exige identificar objetivamente las fugas de abstracción. Hemos detectado 5 puntos clave:*
> 
> 1. *La más importante: la **Dualidad de Red en Frontend**, donde servicios como `movimientosService` conservan un script de fallback de emergencia con `fetch` directo, omitiendo momentáneamente la capa del SDK.*
> 2. *El **acoplamiento a localStorage**, que debe sustituirse por un `TokenStorageProvider` abstracto.*
> 3. *La **validación duplicada**, presente tanto en los esquemas Zod de entrada como de forma imperativa en los servicios.*
> 4. *La violación del principio DRY en la verificación de contraseñas, que resolveremos encapsulando `bcrypt.compare` en el modelo `Usuario`.*
> 5. *Y la presencia de **números mágicos** que deben trasladarse a un archivo central de constantes de negocio.*
> 
> *A pesar de ello, el sistema obtiene una calificación global de madurez de **8.6 sobre 10**."*

---

### 🧪 Diapositiva 6: Gestión de Calidad, Pruebas & Sprint 7
**Tiempo asignado:** 3:40 - 4:20 (40 segundos)  
**Objetivo:** Explicar cómo se cierran los pendientes mediante un sprint controlado.

> **Qué decir:**
> *"Actualmente respaldan al sistema 12 suites de backend y 66 pruebas de integración y carga en el SDK con observabilidad en vivo mediante Sentry.*
> 
> *Para subsanar las deudas identificadas, definimos el **Sprint 7 (Hardening v1.4.0)**, con una duración de 10 días para:*
> * *Automatizar en Jest los casos de prueba del Planificador y Perfil (`CP-38` a `CP-42`).*
> * *Exponer la ruta canónica independiente `/planificador`.*
> * *Conectar la persistencia real para la eliminación de cuenta (`DELETE /api/usuarios/me`).*
> * *Y retirar definitivamente el fallback de emergencia para unificar el SDK Balance."*

---

### 🏆 Diapositiva 7: Conclusión Ejecutiva & Cierre
**Tiempo asignado:** 4:20 - 4:45 (25 segundos)  
**Objetivo:** Remate firme y agradecimiento al jurado/docente.

> **Qué decir:**
> *"En conclusión: FinanceFlow es un sistema funcionalmente terminado, arquitectónicamente estructurado y con estándares de seguridad bancarios certificados.*
> 
> *La culminación del Sprint 7 nos permitirá alcanzar la versión definitiva 1.4.0 con 100% de cobertura automatizada, consolidando una plataforma sólida, escalable y lista para producción continua.*
> 
> *Muchas gracias. Quedamos atentos a sus preguntas."*

---
*Fin de la exposición: 4 minutos 45 segundos.*
