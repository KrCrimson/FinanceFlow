**UNIVERSIDAD PRIVADA DE TACNA**
**Facultad de Ingeniería**
**Escuela Profesional de Ingeniería de Sistemas**
**Curso: Construcción de Software I**
**Docente: Mag. Ricardo Eduardo Valcárcel Alvarado**
**Integrantes del Grupo de Desarrollo:**
* Sebastian Arce Bracamonte (Código: 2019062886)
* Brant Antony Chata Choque (Código: 2020067577)
**Tacna, Perú**
**Año 2026**

# Plan de Iteración — Sprint 7 (Mantenimiento Post-Entrega)

> Aplicación práctica de la guía de clase "Plan de Iteración" (Construcción de Software I) al proyecto **FinanceFlow**, versión actual `1.3.0`.

---

## 0. Contexto: ¿por qué necesitamos esta iteración?

El **Sprint 6** se cerró el 15.06.2026 con la etiqueta de "entregable final" (`sprint_6_report.md`). Sin embargo, ese mismo informe es explícito sobre algo que suele pasar en cualquier proyecto real: **el software funcionaba, pero no todo cumplía la Definición de Hecho (DoD)** que el propio equipo se impuso en `documento_metodologia_scrum.md` (sección 6). Concretamente, el informe de cierre deja registradas cuatro deudas bajo el título "Pendientes Críticos":

1. Cinco casos de prueba (CP-38 a CP-42) quedaron **verificados solo manualmente**, sin un test automatizado en Jest que los respalde.
2. El Planificador de Compras se entregó como un **componente embebido** dentro del Dashboard, en lugar de la página independiente (`/planificador`) que estaba planificada originalmente.
3. La opción "Eliminar Cuenta" existe en la interfaz, pero **no hace nada real** — solo dispara un `alert()` del navegador.
4. Los archivos `DEPLOY_FRONTEND.md` y `DEPLOY_BACKEND.md` siguen con **URLs de plantilla**, no con los enlaces reales del entorno productivo.

La guía de clase (slide 02) lo resume bien: *"cuando un proyecto es grande o incierto, avanzar 'todo de una vez' aumenta el riesgo"*. Declarar el Sprint 6 como cierre total sin un plan explícito para estos cuatro puntos es justamente ese riesgo: pendientes que quedan "flotando" sin dueño, sin fecha y sin criterio de verificación, hasta que alguien los olvida o el profesor los encuentra primero en la revisión de código.

Este documento existe para cerrar esa brecha de forma controlada: en vez de una lista suelta de TODOs, un ciclo corto (10 días hábiles) con objetivo, alcance, actividades verificables, responsables y fechas — exactamente la estructura que propone la guía de clase en su slide 06 (Objetivo, Alcance, Actividades, Responsables, Fechas, Criterios de aceptación).

---

## 1. Objetivo del Sprint

**Cerrar, uno por uno, los cuatro pendientes críticos heredados del Sprint 6**, sin tocar ni arriesgar funcionalidades que ya fueron aceptadas y están en producción (RF-12 Planificador, RF-15 Perfil de Usuario).

En términos de versión semántica, este Sprint mueve FinanceFlow de **v1.3.0 a v1.4.0**: no se agregan Requerimientos Funcionales nuevos, se **completa** la calidad técnica de los que ya existen. Es un sprint de *hardening*, no de features — la meta no es "que se vea más funcionalidad", sino "que lo que ya existe se pueda demostrar y confiar sin depender de que alguien lo pruebe a mano cada vez".

Criterio de éxito en una frase: **si al terminar el Sprint 7 alguien corre `npm test` y abre las URLs documentadas, todo lo que el Sprint 6 prometió debe poder verificarse solo, sin intervención manual.**

---

## 2. Alcance

### 2.1. Qué entra (in scope)

| Ítem | Estado actual (qué hace hoy) | Qué se hará |
|---|---|---|
| Tests del Planificador (CP-38, CP-39) | La lógica corre y funciona en la UI (`Math.ceil(precio / ahorroMensual)`, guardia `ahorroMensual <= 0`), pero **no existe** ningún archivo de test que lo verifique automáticamente. | Crear `PlanificadorCompras.test.jsx` con casos para el cálculo normal y para el caso de ahorro nulo/negativo. |
| Tests del Perfil (CP-40, CP-41) | `GET /api/usuarios/me` y `PUT /api/usuarios/me` funcionan y ya excluyen `passwordHash` en el retorno (verificado leyendo `usuarios.service.js`), pero de nuevo, **solo probado a mano**. | Crear/extender `usuarios.controller.test.js` con un test que falle si `passwordHash` aparece alguna vez en la respuesta, y uno que confirme la persistencia real del `PUT` en MongoDB (o un mock equivalente). |
| Ruta `/planificador` | `PlanificadorCompras.jsx` vive dentro de `DashboardPage.jsx`, controlado por un estado local `vistaActiva === 'planificador'` — **no tiene URL propia**, no se puede compartir un enlace directo ni recargar la página sin perder el contexto. | Extraer el componente a `frontend/src/pages/PlanificadorPage.jsx` y registrar la ruta `/planificador` en el router, protegida igual que `/perfil` con `ProtectedRoute`. |
| Eliminar cuenta | El botón "Eliminar Cuenta" existe en `ProfilePage.jsx` pero solo ejecuta un `alert()` — **no hay endpoint, no hay lógica de backend**. | Implementar `DELETE /api/usuarios/me` en el backend (controlador + servicio + ruta) y conectar el botón real, con una confirmación explícita antes de ejecutar. |
| URLs de producción | `DEPLOY_FRONTEND.md` y `DEPLOY_BACKEND.md` documentan el *proceso* de despliegue, pero las URLs que aparecen son **placeholders de plantilla** (ej. `https://tu-proyecto.vercel.app`), no los enlaces reales activos. | Confirmar que el deploy en Vercel/Render sigue activo, capturar las URLs reales y reemplazar los placeholders en ambos documentos. |

### 2.2. Qué NO entra (out of scope)

Siguiendo la recomendación de la guía de clase (slide 13: *"alcance demasiado grande → dividir en entregables pequeños"*), este sprint deja **fuera** deliberadamente:

- **Nuevos Requerimientos Funcionales** no priorizados todavía en el Product Backlog (ver `documento_metodologia_scrum.md`, sección 4).
- **CI/CD con GitHub Actions**: mencionado como "próximo paso" en la sección 12.2 del mismo documento, pero es un cambio de infraestructura independiente que merece su propia iteración — no debería bloquear el cierre de las 4 deudas ya identificadas.
- **Cliente React Native**: el `scaffold` inicial ya existe (`chore: scaffold inicial para cliente React Native`), pero desarrollarlo es un esfuerzo de otro orden de magnitud que necesita su propio Plan de Iteración.

Marcar explícitamente lo que **no** se hará es tan importante como definir lo que sí — evita que el equipo (o el evaluador) asuma compromisos que este sprint nunca prometió cumplir.

---

## 3. Actividades (priorizadas y detalladas)

La guía de clase (slide 07) plantea el plan como un proceso de 6 pasos, de izquierda a derecha: *definir objetivo → priorizar trabajo → estimar esfuerzo → asignar responsables → fijar fechas → acordar validación*. Las actividades siguientes ya están priorizadas siguiendo la estrategia **"Risk-First"** que el equipo usa desde sprints anteriores: primero lo que tiene mayor riesgo de quedar "invisible" si no se automatiza (pruebas y seguridad del endpoint de perfil), después lo estructural (la ruta), y al final lo operativo (documentación de URLs), que depende de que el resto ya esté estable.

### Actividad 1 — Automatizar CP-38 y CP-39 (Planificador de Compras)

**Qué existe hoy:** la fórmula de cálculo vive en `PlanificadorCompras.jsx` y ya fue verificada manualmente durante el Sprint 6 (`mesesNecesarios = Math.ceil(precio / ahorroMensual)`), incluyendo la cláusula de guardia para ahorro nulo o negativo (`if (ahorroMensual <= 0) { return { esViable: false, ... } }`).

**Qué se hará:** escribir `PlanificadorCompras.test.jsx` con Jest + React Testing Library, cubriendo como mínimo:
- Caso normal: dado un precio y un ahorro mensual positivo, el componente calcula y muestra los meses esperados correctamente.
- Caso límite: ahorro mensual igual a 0 → se muestra el mensaje "No es posible con el ahorro actual".
- Caso límite: ahorro mensual negativo → mismo comportamiento que el caso anterior (no debe crashear ni mostrar un número negativo de meses).

**Resultado verificable:** `npm test` ejecuta y aprueba estos casos sin intervención manual.

### Actividad 2 — Automatizar CP-40 y CP-41 (Perfil de Usuario)

**Qué existe hoy:** el servicio `usuarios.service.js` ya excluye explícitamente `passwordHash` en el objeto que retorna `obtenerUsuarioPorId` (`{ id, nombre, email, estado, creadoEn }`), y `editarUsuario` usa `findByIdAndUpdate()` para persistir cambios de `nombre`/`email` sin tocar la contraseña. Este comportamiento es correcto, pero hoy depende 100% de que un desarrollador lo revise a ojo.

**Qué se hará:** extender `usuarios.controller.test.js` con:
- Un test de integración para `GET /api/usuarios/me` que haga un *assert* explícito de que `passwordHash` (o cualquier campo de contraseña) **no** está presente en el JSON de respuesta — no basta con que "no se vea en Postman", el test debe fallar si algún día alguien reintroduce el campo por error.
- Un test para `PUT /api/usuarios/me` que confirme que, tras enviar `{ nombre, email }` válidos, el registro en la base de datos (o el mock de repositorio) refleja el cambio.

**Resultado verificable:** ambos tests fallan intencionalmente si se revierte la protección del `passwordHash` o si el `PUT` deja de persistir — es decir, funcionan como red de seguridad real, no solo como documentación.

### Actividad 3 — Extraer el Planificador a una página independiente (`/planificador`)

**Qué existe hoy:** `PlanificadorCompras.jsx` está montado dentro de `DashboardPage.jsx`, visible solo cuando el estado local `vistaActiva === 'planificador'` está activo. Esto significa que no se puede acceder directo por URL, no se puede recargar sin perder el estado, y no aparece en el historial de navegación del navegador — una desviación respecto a la arquitectura planeada originalmente (`PlanificadorPage.jsx` como página propia, igual que ya existe para `/perfil`).

**Qué se hará:**
1. Crear `frontend/src/pages/PlanificadorPage.jsx`, reutilizando la lógica ya probada de `PlanificadorCompras.jsx` (no reescribirla desde cero — mover, no duplicar).
2. Registrar la ruta `/planificador` en `react-router-dom`, protegida con el mismo componente `ProtectedRoute` que ya usa `/perfil`.
3. Actualizar la navegación del Dashboard para que el enlace al planificador apunte a la nueva ruta en vez de cambiar un estado local.

**Resultado verificable:** navegar directamente a `/planificador` (por URL, o recargando la página) muestra el planificador funcional, sin pasar por el Dashboard.

### Actividad 4 — Implementar "Eliminar Cuenta" de forma real

**Qué existe hoy:** el botón en `ProfilePage.jsx` ejecuta únicamente `alert('Función no disponible')` (o equivalente) — no hay endpoint `DELETE` en `backend/routes/usuarios.js`, ni lógica en `usuarios.service.js` ni en `usuarios.controller.js` para esta operación.

**Qué se hará:**
1. Backend: agregar `DELETE /api/usuarios/me` en `backend/routes/usuarios.js`, protegido por el middleware `auth.js` (igual que el resto de rutas privadas de perfil).
2. Servicio: implementar la lógica de borrado en `usuarios.service.js`. El equipo decidirá entre **borrado físico** o **soft-delete** (marcar `estado: 'eliminado'`), priorizando lo segundo si se quiere mantener trazabilidad para auditoría — coherente con el patrón que el sistema ya usa para archivar movimientos financieros (auto-archivado M-2, ver `entregable.md`, CR-03).
3. Frontend: reemplazar el `alert()` por un diálogo de confirmación real, y conectar la acción a un nuevo método `deleteAccount()` en `userService.js` que llame al endpoint y cierre la sesión del usuario tras el éxito.

**Resultado verificable:** una cuenta de prueba, tras usar la opción, deja de poder iniciar sesión con sus credenciales originales.

### Actividad 5 — Documentar URLs reales de producción

**Qué existe hoy:** `DEPLOY_FRONTEND.md` y `DEPLOY_BACKEND.md` explican correctamente el *procedimiento* de despliegue (variables de entorno, comandos, plataformas), pero los ejemplos de URL son placeholders de plantilla, no enlaces reales navegables.

**Qué se hará:** confirmar que el despliegue continuo (Vercel para frontend, Render para backend) sigue activo y respondiendo, capturar las URLs reales asignadas, y actualizar ambos documentos con:
- El enlace real de la aplicación en producción.
- El enlace real de la API/backend (útil para healthchecks).
- La fecha de la última verificación de que el enlace responde (para que el documento no quede "mudo" si el free tier de Render entra en cold start o se cae).

**Resultado verificable:** cualquier persona ajena al equipo (incluido el evaluador del curso) puede abrir los enlaces documentados y ver la aplicación funcionando, sin depender de que alguien del equipo se la muestre en vivo.

---

## 4. Responsables

| Actividad | Responsable | Validador | Por qué esta asignación |
|---|---|---|---|
| 1, 2 (automatización de tests) | Brant Antony Chata Choque | Sebastian Arce Bracamonte | Brant fue quien documentó la línea base de configuración (`entregable.md`) y tiene contexto directo sobre la suite de 94 pruebas existente — extenderla es continuidad natural de ese trabajo. |
| 3 (`/planificador`) | Sebastian Arce Bracamonte | Brant Antony Chata Choque | Sebastian implementó originalmente `PlanificadorCompras.jsx` y `ProfilePage.jsx` durante el Sprint 6 (ver `sprint_6_report.md`), por lo que conoce mejor el componente que se va a extraer. |
| 4 (eliminar cuenta) | Brant Antony Chata Choque | Sebastian Arce Bracamonte | Requiere tocar backend (rutas, servicios, controladores) — área donde Brant es responsable según la tabla de Elementos de Configuración (`FF-SW-BE`) en `entregable.md`. |
| 5 (URLs de deploy) | Sebastian Arce Bracamonte | Mag. Ricardo Valcárcel (en Sprint Review) | Sebastian es responsable de `FF-SW-FE` y de la documentación de despliegue frontend; la validación final la hace el stakeholder externo, no el propio equipo, para evitar sesgo de "a mí me funciona". |

El rol de Scrum Master (remover bloqueos técnicos) sigue rotando entre ambos integrantes, como se define en `documento_metodologia_scrum.md` sección 3.1.2 — no es una asignación fija de este sprint.

---

## 5. Fechas

Iteración de **10 días hábiles**, replicando el mismo formato de bloque usado para el Sprint 6 y para el "Mini ejemplo aplicado" de la guía de clase (slide 12).

| Día | Fecha | Actividad | Detalle |
|---|---|---|---|
| Día 1 | 10-09-2026 | Planificación | Redacción y validación de este documento; confirmación de alcance y responsables con ambos integrantes. |
| Días 2–6 | 11-09 al 17-09-2026 | Ejecución | Actividades 1 a 4 avanzan en paralelo — tests y backend no dependen entre sí, por lo que no hay motivo para serializarlas. |
| Día 7 | 18-09-2026 | Revisión parcial | Daily de checkpoint: cada responsable demuestra su avance al otro integrante. Si alguna actividad está bloqueada, aquí se decide si se reduce alcance (ver slide 11: "reducir alcance no crítico" es una decisión rápida válida). |
| Días 8–9 | 21-09 al 22-09-2026 | Cierre técnico | Actividad 5 (deploy y documentación) y corrección de cualquier hallazgo detectado en la revisión parcial. |
| Día 10 | 23-09-2026 | Entrega | Sprint Review con el docente (demostración de software funcionando, no diapositivas — siguiendo la práctica ya establecida en `documento_metodologia_scrum.md` 5.4.3) y retrospectiva del equipo. |

El tiempo es fijo (10 días hábiles); lo que se ajusta, si hace falta, es el alcance — no la fecha de entrega.

---

## 6. Criterios de aceptación

Este sprint se considera **cerrado y aceptado** únicamente si se cumplen, de forma verificable y no solo declarada, los siguientes puntos:

- [ ] `npm test` ejecuta las 5 pruebas nuevas (CP-38 a CP-42) y todas aprueban, junto con la suite existente de 94 pruebas — **sin romper ninguna prueba previa**.
- [ ] La ruta `/planificador` es navegable directamente por URL (no solo accesible como un estado interno del Dashboard) y está protegida por `ProtectedRoute` igual que `/perfil`.
- [ ] Una cuenta de prueba puede eliminarse desde la interfaz de usuario, y tras la eliminación **no puede volver a iniciar sesión** con las mismas credenciales.
- [ ] `DEPLOY_FRONTEND.md` y `DEPLOY_BACKEND.md` contienen URLs reales, navegables y verificadas — no placeholders de plantilla.
- [ ] Se entrega evidencia demostrable para cada punto anterior: capturas de pantalla de los tests en verde (consola), captura de la ruta `/planificador` cargando directo por URL, log o captura del intento de login fallido tras eliminar la cuenta, y las URLs finales documentadas — siguiendo el mismo estándar de evidencia que ya estableció `sprint_6_report.md` en su sección "Evidencia de Pruebas".

Como recuerda la guía de clase (slide 13): *"si al terminar la iteración nadie puede demostrar qué cambió, el plan no tuvo criterios de validación suficientes"* — por eso cada criterio de esta lista exige una evidencia concreta, no una afirmación de que "ya quedó listo".

---

## 7. Checklist final (previo a declarar la iteración cerrada)

- [ ] Objetivo concreto y medible
- [ ] Alcance definido y priorizado (con lo que explícitamente queda fuera)
- [ ] Actividades claras, con estado actual documentado y resultado verificable
- [ ] Responsables asignados, con justificación de por qué cada quien
- [ ] Fechas realistas, con tiempo fijo y alcance ajustable
- [ ] Criterios de aceptación exigibles con evidencia, no solo declarativos
- [ ] Evidencias y seguimiento planificados desde antes de empezar, no improvisados al final

*"Un buen Plan de Iteración convierte una meta grande en avances pequeños, visibles y controlables."*
