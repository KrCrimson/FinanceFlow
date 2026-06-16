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

**Sprint 6 — Planificador de Compras y Perfil de Usuario (15.06.2026)**

**SPRINT 6 · Planificador de Compras y Perfil de Usuario — Entregable Final · Entrega: 15.06.2026 ★ ENTREGABLE FINAL**

**Nota académica:**
ENTREGABLE FINAL — El presente documento constituye el informe formal de cierre del Sprint 6 para el proyecto FinanceFlow. Se ha logrado la implementación del módulo de Perfil de Usuario (RF-15) de forma completa, incluyendo la sanitización y protección del endpoint en backend y frontend. Asimismo, se ha completado la lógica funcional de cálculo y estimación del Planificador de Compras (RF-12); sin embargo, existen desviaciones respecto a la arquitectura planificada (implementado como componente integrado en lugar de página independiente) y se reportan pendientes críticos relacionados al despliegue de URLs reales de producción y a la cobertura de pruebas unitarias/integración automatizadas en el framework de pruebas.

**Requerimientos (SRS):** RF-12, RF-15

**Objetivo del Sprint:**
Implementar y desplegar el módulo de Planificación de Compras Inteligente basada en la capacidad de ahorro histórica del usuario, y habilitar la administración del perfil personal de usuario autenticado en la plataforma FinanceFlow, garantizando el flujo de datos seguro y de acuerdo a los patrones de diseño establecidos bajo metodología RUP.

**ACTIVIDADES DEL SPRINT**

**Actividades SRS:**
* **RF-12: Planificador de Compras (Implementado como componente integrado):**
  Se ha desarrollado la lógica funcional de estimación financiera de metas de compra en base al ahorro mensual neto. 
  * Se diseñó e implementó el componente de interfaz gráfica `PlanificadorCompras.jsx` ubicado en `frontend/src/components/PlanificadorCompras.jsx`.
  * Dicho componente está integrado en `DashboardPage.jsx` bajo el control de estado reactivo local (`vistaActiva === 'planificador'`), lo cual representa una desviación arquitectónica con respecto a la planeada página independiente (`PlanificadorPage.jsx`).
  * Los campos interactivos expuestos en la interfaz de usuario son:
    1. Selector de periodo: Selector `<select>` etiquetado como `📅 Elegir mes para cálculos`, que permite filtrar los movimientos de un mes específico o bien usar la opción por defecto `📊 Usar promedio general`.
    2. Campo de producto: Entrada de texto `<input type="text">` con la etiqueta `¿Qué quieres comprar? (opcional)`.
    3. Campo de precio: Entrada numérica `<input type="number">` con la etiqueta `Precio (S/)`.
  * La fórmula empleada para calcular los meses estimados es:
    `const mesesNecesarios = Math.ceil(precio / ahorroMensual)`
  * La capacidad de ahorro mensual (`ahorroMensual`) se obtiene dinámicamente de los movimientos financieros reales cargados desde el endpoint `GET /api/movimientos` consumido mediante el hook de React `useMovimientos()`:
    * Si el usuario selecciona un mes en particular, se ejecuta la función helper `calcularDatosPorMes()` que filtra los movimientos por fecha y calcula el ingreso neto mensual restando egresos de ingresos:
      `const ahorroMes = ingresosMes - gastosMes`
    * Si no se selecciona un mes específico, se utiliza la propiedad `ahorroPromedio` generada por la función `calcularResumenMensual` en el hook central `useAnalisisGastos.js` con la fórmula:
      `(totales.ingresos - totales.gastos) / cantidadMeses`
  * Se implementó una cláusula de seguridad para ahorros mensuales nulos o negativos:
    `if (ahorroMensual <= 0) { return { esviable: false, mensaje: 'No es posible con el ahorro actual', sugerencia: 'Necesitas reducir gastos o aumentar ingresos' }; }`
  * El cálculo de la fecha estimada de compra se realiza de la siguiente manera:
    `fechaEstimada.setMonth(fechaEstimada.getMonth() + mesesNecesarios)`
    Y se renderiza en la interfaz local con el formato: `toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })`

* **RF-15: Perfil de Usuario (Totalmente funcional):**
  Se ha diseñado y acoplado el flujo completo para visualizar y actualizar los datos de la cuenta del usuario autenticado.
  * Se implementó la página `ProfilePage.jsx` en `frontend/src/pages/ProfilePage.jsx` mapeada a la ruta protegida `/perfil` mediante el componente `ProtectedRoute`.
  * La página presenta los siguientes controles de formulario de datos personales:
    1. Entrada editable de texto para `👤 Nombre Completo`, enlazada al estado local `nombre` e inicializada desde `perfil.nombre`.
    2. Entrada editable de correo para `📧 Correo Electrónico`, enlazada al estado local `email` e inicializada desde `perfil.email`.
    3. Panel de sólo lectura para `📅 Miembro desde`, que renderiza el atributo `perfil.creadoEn` con formato de localización en español `es-ES`.
  * Carga de datos de perfil: Se efectúa llamando a la función `getProfile()` del servicio `frontend/src/services/userService.js`, la cual realiza una petición HTTP `GET` al endpoint protegido `/api/usuarios/me`. El backend ejecuta el método de servicio `obtenerUsuarioPorId` que excluye de forma estricta el campo `passwordHash`, retornando únicamente: `{ id, nombre, email, estado, creadoEn }`.
  * Guardado de modificaciones de perfil: Se realiza ejecutando `updateProfile(data)` en `userService.js`, el cual envía una solicitud HTTP `PUT` al endpoint `/api/usuarios/me` con el payload `{ nombre, email }`. En la capa de servicios del backend, el método `editarUsuario` realiza una llamada segura a MongoDB mediante `findByIdAndUpdate()` asegurando la protección del campo `passwordHash`, el cual no es editable a través de esta funcionalidad.

**Actividades SAD:**
* Se ha completado la especificación de componentes y se actualizó la arquitectura del sistema para soportar el módulo de perfil e integración del planificador en el dashboard de la aplicación. Las dependencias fueron mapeadas de acuerdo a la capa de adaptadores y lógica del SDK de Balance definida en la Fase 4 de la migración del sistema.

**TRAZABILIDAD**

| Referencia SRS | Referencia SAD |
| :--- | :--- |
| RF-12: Planificador de Compras | Lógica funcional de cálculo en `PlanificadorCompras.jsx` e integración de estadísticas en `useAnalisisGastos.js`. |
| RF-15: Perfil de Usuario | Rutas y endpoints `/api/usuarios/me` acoplados con `ProfilePage.jsx` y control de datos en `userService.js`. |

**Inventario de Componentes:**
1. Componente de Interfaz Gráfica: `frontend/src/components/PlanificadorCompras.jsx` (Integrado en Dashboard en lugar de página).
2. Página de Interfaz Gráfica: `frontend/src/pages/ProfilePage.jsx`
3. Servicio Cliente Frontend: `frontend/src/services/userService.js`
4. Controlador de API Backend: `backend/controllers/usuarios.controller.js`
5. Servicio Lógica Backend: `backend/services/usuarios.service.js`
6. Rutas de Endpoints Backend: `backend/routes/usuarios.js`

**Evidencia de Pruebas (casos esperados):**
1. CP-38: "PlanificadorPage calcula correctamente los meses estimados" → PENDIENTE DE TEST AUTOMATIZADO. La fórmula y comportamiento de cálculo matemático han sido verificados funcionalmente en el código del frontend, pero no existe un archivo de pruebas en Jest para su verificación automatizada.
2. CP-39: "Si el ahorro mensual es 0 o negativo, el planificador muestra un mensaje de advertencia" → PENDIENTE DE TEST AUTOMATIZADO. La cláusula de guarda y advertencia roja en interfaz se ejecutan correctamente en ejecución manual, pero no se ha codificado un test automatizado en el framework de pruebas.
3. CP-40: "GET /api/usuarios/me retorna nombre y email sin exponer el campo password" → PENDIENTE DE TEST AUTOMATIZADO. El servicio del backend tiene implementado el retorno explícito libre del hash del password, pero no se cuenta con un test automatizado en `usuarios.controller.test.js` para asegurar la no exposición.
4. CP-41: "PUT /api/usuarios/me con datos válidos → HTTP 200 OK; cambios reflejados en MongoDB" → PENDIENTE DE TEST AUTOMATIZADO. La actualización funciona mediante la ejecución interactiva en UI y persiste con éxito en la base de datos MongoDB, pero no existe prueba de integración automatizada Jest para este endpoint específico.
5. CP-42: "Flujo completo del sistema desplegado en producción (Vercel + Render + MongoDB Atlas) sin errores" → PENDIENTE DE TEST AUTOMATIZADO Y DOCUMENTACIÓN. Los archivos de despliegue `DEPLOY_FRONTEND.md` y `DEPLOY_BACKEND.md` han sido creados y la aplicación está estructurada para su ejecución productiva, pero las URLs reales del entorno en vivo se encuentran pendientes de documentar formalmente en el repositorio (actualmente configuradas con URLs de plantilla por defecto).

**Evidencia de Funcionalidad en Ejecución:**
* **Funcionalidad demostrable interactivamente:**
  * Se puede ejecutar la aplicación localmente mediante `npm start` tanto en backend como frontend para realizar la demostración en tiempo real de la edición de datos del perfil personal en `ProfilePage.jsx` con persistencia en base de datos.
  * Se puede visualizar la protección contra inyección y el filtrado del hash del password al consumir el endpoint `/me`.
  * Se puede interactuar con el calculador de planes de ahorro dentro de la pestaña del planificador en el Dashboard, verificando los tiempos estimados calculados según el ahorro neto real del mes elegido.
  * Se puede observar el mensaje de advertencia y denegación de viabilidad cuando el saldo neto de ahorros es igual o menor a cero.
* **Funcionalidad no demostrable mediante suite de pruebas o configuración productiva:**
  * No es posible ejecutar un comando `npm test` que valide de manera automatizada las expectativas funcionales de Sprint 6, dado que los archivos de prueba contienen stubs vacíos o no tienen referencias a este sprint.
  * No es posible abrir los enlaces oficiales de producción debido a que las URLs reales del entorno en la nube siguen pendientes de registro en la documentación oficial.
  * La opción de "Eliminar Cuenta" se encuentra deshabilitada y sólo despliega un cuadro de alerta en el cliente.

**Estado General del Sprint 6**
* **Completado Exitosamente:**
  * RF-15 (Perfil de Usuario): Implementación y consumo completo de la visualización y edición segura del perfil del usuario en backend y frontend.
  * Lógica Financiera de RF-12: Algoritmo de cálculo de viabilidad de compra inteligente en base a ingresos y egresos de movimientos reales.
* **Completado de Forma Parcial (Desviaciones):**
  * RF-12 (Planificador): El planificador se implementó como un componente interactivo acoplado en el Dashboard (`PlanificadorCompras.jsx`) en lugar de constituir una página independiente con ruta propia (`PlanificadorPage.jsx`).
* **Pendientes Críticos:**
  * Implementación y codificación de los tests automatizados unitarios e integrados para las pruebas CP-38, CP-39, CP-40 y CP-41.
  * Habilitación de la ruta dedicada `/planificador` mediante la creación de la página independiente en React en una iteración posterior.
  * Programación final del backend y frontend para la eliminación real y segura de cuentas de usuario ("Eliminar Cuenta").
  * Registro y documentación formal de las URLs activas de producción en el repositorio en lugar de los marcadores de posición de plantilla de Render y Vercel.
* **Declaración de Cierre del Proyecto:**
  El sistema FinanceFlow cumple con las especificaciones funcionales básicas programadas para su entrega final con fecha 15 de junio de 2026. La aplicación realiza de forma correcta y segura el cálculo de la planificación de compras y la modificación de datos del perfil, garantizando estabilidad funcional a nivel del usuario final. Los elementos técnicos pendientes identificados han sido añadidos al backlog técnico para su subsanación y perfeccionamiento en el plan de mantenimiento post-entrega.
