# 🗺️ MAPA MAESTRO DE COORDENADAS: EXCEL G03 vs PRUEBAS DE QA
### Archivo: `G03_FinanceFlow_5W1H_Gantt.xlsx`

Este documento es tu "chuleta rápida" si el docente te pide abrir el Excel o señalar con el mouse dónde está cada prueba y cada decisión de QA.

---

## 📌 LAS 4 HOJAS PRINCIPALES DEL EXCEL

### 1. Hoja `Gantt 5W+1H` (Matriz de Control Operativo)
Contiene las 7 filas de trabajo del Sprint 7 (14 al 24 de octubre) con las 6 preguntas metodológicas:
* **Columna A:** WHAT (Qué se hace)
* **Columna B:** WHY (Por qué se hace)
* **Columnas C-D:** Fechas de Inicio y Fin
* **Columnas E-O:** Gráfico visual de Gantt por días
* **Columna P:** WHERE (Dónde está en el código)
* **Columna Q:** WHO (Quién es el responsable: Brant o Sebastian)
* **Columna R:** HOW (Cómo se implementa técnicamente)
* **Columna S:** Duración en días
* **Columna T:** Entregable formal del curso
* **Columna U:** Fecha límite oficial
* **Columna V:** Margen de seguridad en días

---

## 📍 RELACIÓN EXACTA: PRUEBAS $\rightarrow$ PUNTOS DEL EXCEL (S1 A S6)

### 🔹 Punto S1 (Fila 6 del Gantt / Fila 5 de Oportunidades)
* **Nombre en Excel:** `S1. Método verificarPassword en el modelo Usuario y reemplazo de las 3 comparaciones`
* **Responsable:** 👤 **Brant Chata** (14 al 15 de octubre - 2 días)
* **¿Qué prueba de QA respalda esto?:**
  * `cierres.test.js` (exige contraseña para cerrar mes).
  * `movimientos.unit.test.js` (exige contraseña para transacciones pasadas).
* **Evidencia en repo:** `movimientos.service.js:196`, `cierres.service.js:74 y :217`.

---

### 🔹 Punto S2 (Fila 7 del Gantt / Fila 6 de Oportunidades)
* **Nombre en Excel:** `S2. Archivo business.constants.js con constantes nombradas`
* **Responsable:** 👤 **Sebastian Arce** (14 al 16 de octubre - 3 días)
* **¿Qué prueba de QA respalda esto?:**
  * `finance.unit.test.js` (límites de transacciones, decimales exactos y normalización).
* **Evidencia en repo:** Números mágicos eliminados de `cierres.service.js:89` y `usuarios.controller.js:28`.

---

### 🔹 Punto S3 (Fila 8 del Gantt / Fila 7 de Oportunidades / Hoja PDCA)
* **Nombre en Excel:** `S3. Automatizar en Jest CP-38 a CP-42 (Planificador y Perfil)`
* **Responsable:** 👤 **Sebastian Arce** (16 al 21 de octubre - 6 días)
* **¿Qué prueba de QA respalda esto?:**
  * **La Cobertura de Código (43.61% en Backend y 17.89% en Frontend).**
  * Esta es la tarea clave que responde al **Hallazgo D-02** para elevar la cobertura a más del 70%.
  * Desglosado en las 4 fases de la hoja **`PDCA`**: Planificar (P), Hacer (D), Verificar (C) y Actuar (A).

---

### 🔹 Punto S4 (Fila 9 del Gantt / Fila 8 de Oportunidades)
* **Nombre en Excel:** `S4. Ruta /planificador y DELETE /api/usuarios/me con persistencia real`
* **Responsable:** 👤 **Brant Chata** (17 al 22 de octubre - 6 días)
* **¿Qué prueba de QA respalda esto?:**
  * `e2e.test.js` (borrado lógico de cuenta) y `ProfilePage.test.jsx`.
* **Evidencia en repo:** Cumplimiento de requisitos funcionales RF-12 y RF-15.

---

### 🔹 Punto S5 (Fila 10 del Gantt / Fila 9 de Oportunidades)
* **Nombre en Excel:** `S5. Retirar el fallback apiCall y unificar el SDK Balance`
* **Responsable:** 👤 **Brant Chata** (21 al 23 de octubre - 3 días)
* **¿Qué prueba de QA respalda esto?:**
  * **El Defecto D-01 en `movimientos-adapter.test.js`.**
  * Las 38 pruebas aprobadas de `sdk.test.js` y `sdk-integration.test.js`.
* **Evidencia en repo:** Desacoplamiento del SDK `@sistema-balance/sdk`.

---

### 🔹 Punto S6 (Fila 11 del Gantt / Fila 10 de Oportunidades)
* **Nombre en Excel:** `S6. Logger central en lugar de console.log y JSDoc`
* **Responsable:** 👤 **Sebastian Arce** (22 al 24 de octubre - 3 días)
* **¿Qué prueba de QA respalda esto?:**
  * Los mensajes de `console.error` en las pruebas de Frontend (`ProfilePage` / `pagosService.js`).
  * Reemplazo por un logger formal para que la terminal de Jest en CI quede completamente limpia.

---

### 🔹 Cierre v1.4.0 (Fila 12 del Gantt / Fila 11 de Verificación)
* **Nombre en Excel:** `Cierre: verificación final y versión v1.4.0`
* **Responsables:** 👥 **Ambos integrantes** (24 de octubre)
* **¿Qué prueba de QA respalda esto?:**
  * `npm test` global (21 suites y 42 pruebas aprobadas al 100%).
  * El pipeline de GitHub Actions (`ci.yml`) en verde.
