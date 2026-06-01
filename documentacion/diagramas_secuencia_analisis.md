# Diagramas de Secuencia (Fase de Análisis) — FinanceFlow

Este documento contiene las especificaciones lógicas y los **Diagramas de Secuencia** para todos los casos de uso confirmados del sistema **FinanceFlow**. 

Al corresponder a la **Fase de Análisis**, todos los diagramas han sido diseñados de forma conceptual y agnóstica a la tecnología física de base de datos o frameworks. Para ello, se utiliza el patrón formal **BCE (Boundary-Control-Entity)** o **Borde-Control-Entidad** representado mediante la sintaxis correcta y validada de Mermaid:
* **Vista (Borde/Boundary):** Interfaz visual o frontera de interacción directa con el Actor.
* **Gestor (Control/Controlador):** Módulo encargado de gestionar las reglas del negocio y coordinar el caso de uso.
* **Entidad (Entity/Entidad):** Representa los objetos de datos del negocio en el dominio.

---

### **CU-01: Registrar Cuenta**

```mermaid
sequenceDiagram
    actor Invitado as "Usuario Invitado"
    participant Vista as "VistaRegistro (Borde)"
    participant Gestor as "GestorRegistro (Control)"
    participant Entidad as "EntidadUsuario (Entidad)"

    Invitado->>Vista: 1. Ingresar datos (Nombre, Email, Clave)
    Invitado->>Vista: 2. Presionar "Registrarse"
    activate Vista
    Vista->>Vista: 3. Validar formatos de datos locales
    Vista->>Gestor: 4. Solicitar creación de cuenta(nombre, email, clave)
    activate Gestor
    Gestor->>Entidad: 5. Validar existencia previa de correo(email)
    activate Entidad
    Entidad-->>Gestor: 6. Correo no registrado (Disponible)
    deactivate Entidad
    Gestor->>Gestor: 7. Encriptar contraseña de forma segura
    Gestor->>Entidad: 8. Guardar nuevo registro(nombre, email, clave_cifrada)
    activate Entidad
    Entidad-->>Gestor: 9. Registro de usuario creado con éxito
    deactivate Entidad
    Gestor-->>Vista: 10. Confirmación de cuenta registrada
    deactivate Gestor
    Vista-->>Invitado: 11. Mostrar mensaje de éxito y transferir al Login
    deactivate Vista
```

* **Excepción 1: Datos inválidos en formulario:** Si la validación en el paso `3` falla, `VistaRegistro` interrumpe el flujo, muestra los errores en color rojo e impide la ejecución del paso `4`.
* **Excepción 2: Correo electrónico ya registrado:** Si en el paso `6` la `EntidadUsuario` determina que el correo ya existe, retorna un error de conflicto al `GestorRegistro`. Este desiste de guardar los datos, e informa a la `VistaRegistro` para que muestre la alerta al Actor en el correo.

---

### **CU-02: Iniciar Sesión**

```mermaid
sequenceDiagram
    actor Invitado as "Usuario Invitado"
    participant Vista as "VistaLogin (Borde)"
    participant Gestor as "GestorAutenticacion (Control)"
    participant Entidad as "EntidadUsuario (Entidad)"

    Invitado->>Vista: 1. Ingresar credenciales (Email, Clave)
    Invitado->>Vista: 2. Presionar "Ingresar"
    activate Vista
    Vista->>Vista: 3. Validar formato de entrada
    Vista->>Gestor: 4. Solicitar inicio de sesión(email, clave)
    activate Gestor
    Gestor->>Entidad: 5. Buscar datos de usuario(email)
    activate Entidad
    Entidad-->>Gestor: 6. Devolver datos y hash de contraseña
    deactivate Entidad
    Gestor->>Gestor: 7. Comparar y validar contraseña
    Gestor->>Gestor: 8. Generar credencial de acceso temporal (Token)
    Gestor-->>Vista: 9. Devolver credencial y perfil de usuario
    deactivate Gestor
    Vista->>Vista: 10. Almacenar credencial localmente
    Vista-->>Invitado: 11. Autorizar ingreso y transferir al Dashboard
    deactivate Vista
```

* **Excepción 1: Error de formato en los campos:** Si en el paso `3` la validación de entrada falla (correo mal estructurado o clave muy corta), la `VistaLogin` detiene el proceso y muestra los errores directamente sin enviar datos al Gestor.
* **Excepción 2: Credenciales incorrectas:** Si en el paso `6` el usuario no es encontrado, o en el paso `7` la contraseña comparada no es correcta, el `GestorAutenticacion` desiste del inicio de sesión, responde un fallo genérico por seguridad, e instruye a la `VistaLogin` a alertar al Actor.

---

### **CU-03: Solicitar Recuperación**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Registrado"
    participant Vista as "VistaRecuperacion (Borde)"
    participant Gestor as "GestorContraseñas (Control)"
    participant Entidad as "EntidadUsuario (Entidad)"

    Cliente->>Vista: 1. Ingresar correo electrónico
    Cliente->>Vista: 2. Presionar "Enviar Enlace de Recuperación"
    activate Vista
    Vista->>Vista: 3. Validar formato del correo
    Vista->>Gestor: 4. Solicitar recuperación de clave(email)
    activate Gestor
    Gestor->>Entidad: 5. Validar existencia del correo(email)
    activate Entidad
    Entidad-->>Gestor: 6. Correo verificado en el sistema
    deactivate Entidad
    Gestor->>Gestor: 7. Generar token temporal con expiración de 1 hora
    Gestor->>Entidad: 8. Guardar token and expiración en base de datos
    activate Entidad
    Entidad-->>Gestor: 9. Token guardado correctamente
    deactivate Entidad
    Gestor->>Gestor: 10. Enviar email al usuario con enlace y token
    Gestor-->>Vista: 11. Notificar envío exitoso
    deactivate Gestor
    Vista-->>Cliente: 12. Mostrar mensaje verde de éxito
    deactivate Vista
```

* **Excepción 1: Formato de correo inválido:** Si en el paso `3` no se detecta estructura de correo, la `VistaRecuperacion` interrumpe la ejecución localmente y despliega la advertencia.
* **Excepción 2: Correo electrónico no registrado:** Si en el paso `6` la entidad responde que no existe ese registro, el `GestorContraseñas` detiene el flujo y responde una alerta que se visualiza en la vista.

---

### **CU-04: Restablecer Contraseña**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Registrado"
    participant Vista as "VistaCambioClave (Borde)"
    participant Gestor as "GestorContraseñas (Control)"
    participant Entidad as "EntidadUsuario (Entidad)"

    Cliente->>Vista: 1. Abrir enlace recibido en el correo
    activate Vista
    Vista->>Vista: 2. Capturar token de la URL
    Vista->>Gestor: 3. Solicitar validación del token(token)
    activate Gestor
    Gestor->>Entidad: 4. Validar vigencia e integridad del token(token)
    activate Entidad
    Entidad-->>Gestor: 5. Token verificado y vigente
    deactivate Entidad
    Gestor-->>Vista: 6. Habilitar formulario de cambio
    deactivate Gestor
    Cliente->>Vista: 7. Escribir nueva clave y confirmarla
    Cliente->>Vista: 8. Presionar "Actualizar Contraseña"
    Vista->>Vista: 9. Validar coincidencia y longitud de claves
    Vista->>Gestor: 10. Solicitar actualización de contraseña(token, clave)
    activate Gestor
    Gestor->>Gestor: 11. Encriptar nueva clave de forma segura
    Gestor->>Entidad: 12. Actualizar clave del usuario(clave_cifrada)
    activate Entidad
    Entidad-->>Gestor: 13. Clave actualizada exitosamente
    deactivate Entidad
    Gestor->>Entidad: 14. Invalidar token de recuperación usado
    activate Entidad
    Entidad-->>Gestor: 15. Token invalidado
    deactivate Entidad
    Gestor-->>Vista: 16. Confirmación de restablecimiento exitoso
    deactivate Gestor
    Vista-->>Cliente: 17. Mostrar mensaje y transferir al Login
    deactivate Vista
```

* **Excepción 1: Token inválido o expirado:** Si en el paso `5` el token no coincide o ha expirado, el `GestorContraseñas` deniega la validación e instruye a la `VistaCambioClave` a bloquear el formulario y renderizar la pantalla de error.
* **Excepción 2: Contraseñas no coinciden o cortas:** Si la validación local en el paso `9` falla, la vista detiene el envío informando del error bajo los inputs.

---

### **CU-05: Consultar Resumen y Balance**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaDashboard (Borde)"
    participant Gestor as "GestorMovimientos (Control)"
    participant Entidad as "EntidadMovimiento (Entidad)"

    Cliente->>Vista: 1. Ingresar al Dashboard
    activate Vista
    Vista->>Gestor: 2. Solicitar lista de movimientos activos
    activate Gestor
    Gestor->>Entidad: 3. Recuperar transacciones activas de usuario
    activate Entidad
    Entidad-->>Gestor: 4. Array de movimientos devuelto
    deactivate Entidad
    Gestor-->>Vista: 5. Devolver listado de movimientos
    deactivate Gestor
    Vista->>Vista: 6. Sumar ingresos, egresos y calcular balance neto
    Vista->>Vista: 7. Ejecutar análisis y detección de alertas de consumo
    Vista-->>Cliente: 8. Renderizar tarjetas de balance, alertas y tabla reciente
    deactivate Vista
```

* **Excepción 1: Pérdida de conexión o sesión expirada:** Si el paso `2` falla debido a una caída de comunicación o token JWT vencido, la vista captura el error y plasma la advertencia en rojo.
* **Excepción 2: Ausencia absoluta de transacciones registradas:** Si en el paso `5` el listado de movimientos es de tamaño cero, el frontend dibuja en pantalla el contenedor especial de estado vacío con la llamada a la acción.

---

### **CU-06: Registrar Movimiento Manual**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaMovimiento (Borde)"
    participant Gestor as "GestorMovimientos (Control)"
    participant Entidad as "EntidadMovimiento (Entidad)"

    Cliente->>Vista: 1. Navegar a /movimiento
    activate Vista
    Vista->>Gestor: 2. Solicitar categorías habituales
    activate Gestor
    Gestor->>Entidad: 3. Consultar frecuencia de uso
    activate Entidad
    Entidad-->>Gestor: 4. Lista ordenada de categorías
    deactivate Entidad
    Gestor-->>Vista: 5. Devolver categorías ordenadas
    deactivate Gestor
    Vista->>Vista: 6. Cargar dropdown con orden preferente
    Cliente->>Vista: 7. Seleccionar tipo, ingresar monto, nombre y elegir categoría
    Cliente->>Vista: 8. Presionar "💾 Guardar Movimiento"
    Vista->>Vista: 9. Validar que los campos requeridos cumplan
    Vista->>Gestor: 10. Enviar datos del movimiento(tipo, monto, nombre, categoria)
    activate Gestor
    Gestor->>Entidad: 11. Registrar nuevo movimiento en base de datos
    activate Entidad
    Entidad-->>Gestor: 12. Movimiento registrado con éxito
    deactivate Entidad
    Gestor-->>Vista: 13. Confirmar registro exitoso
    deactivate Gestor
    Vista-->>Cliente: 14. Mostrar aviso verde de éxito
    Vista->>Gestor: 15. Disparar sincronización silenciosa (Segundo plano)
    activate Gestor
    Gestor->>Gestor: 16. Reentrenar modelos predictivos con el historial
    deactivate Gestor
    Vista-->>Cliente: 17. Redirigir automáticamente al Dashboard
    deactivate Vista
```

* **Excepción 1: Omisión de campos obligatorios en el formulario:** Si en el paso `9` la validación de la interfaz encuentra errores, la `VistaMovimiento` bloquea el envío y muestra la alerta en rojo.
* **Excepción 2: Error al guardar en base de datos:** Si el paso `11` falla por indisponibilidad, el Gestor responde un error de servidor y la vista desactiva la pantalla de progreso mostrando el aviso rojo.

---

### **CU-07: Cargar Comprobante por Imagen**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaMovimiento (Borde)"
    participant Gestor as "GestorOCR (Control)"
    participant Entidad as "ClasificadorIA (Entidad)"

    Cliente->>Vista: 1. Seleccionar archivo de imagen de boleta
    activate Vista
    Vista->>Vista: 2. Mostrar indicador "Analizando imagen..."
    Vista->>Gestor: 3. Enviar archivo de imagen para análisis(imagen)
    activate Gestor
    Gestor->>Gestor: 4. Limpiar y binarizar imagen
    Gestor->>Gestor: 5. Extraer texto digitalizado (OCR)
    Gestor->>Entidad: 6. Solicitar clasificación predictiva e importes
    activate Entidad
    Entidad-->>Gestor: 7. Devolver monto, nombre y categoría
    deactivate Entidad
    Gestor-->>Vista: 8. Devolver JSON estructurado con datos
    deactivate Gestor
    Vista->>Vista: 9. Autocompletar campos reactivos en formulario
    Vista-->>Cliente: 10. Mostrar aviso verde "OCR Exitoso" y habilitar inputs
    deactivate Vista
```

* **Excepción 1: El sistema no logra deducir importes (Imagen borrosa):** Si en el paso `7` el motor predictivo no halla importes válidos, el `GestorOCR` devuelve campos vacíos y la vista avisa con una tarjeta naranja para que el Actor complete la información a mano.
* **Excepción 2: Formato de archivo incompatible:** Si en el paso `1` el Actor sube un formato no admitido, la vista detecta el error en el paso `2` y detiene el flujo localmente informando de la incompatibilidad.

---

### **CU-08: Desactivar Movimientos**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaDashboard (Borde)"
    participant Gestor as "GestorMovimientos (Control)"
    participant Entidad as "EntidadMovimiento (Entidad)"

    Cliente->>Vista: 1. Localizar fila y presionar "Desactivar"
    activate Vista
    Vista->>Vista: 2. Deshabilitar botón de la fila y mostrar "Desactivando..."
    Vista->>Gestor: 3. Solicitar inhabilitación de movimiento(id)
    activate Gestor
    Gestor->>Entidad: 4. Modificar estado lógico a "inactivo"(id)
    activate Entidad
    Entidad-->>Gestor: 5. Estado actualizado en base de datos
    deactivate Entidad
    Gestor-->>Vista: 6. Confirmación de desactivación exitosa
    deactivate Gestor
    Vista->>Gestor: 7. Solicitar actualización del listado
    activate Gestor
    Gestor->>Entidad: 8. Recuperar movimientos activos restantes
    activate Entidad
    Entidad-->>Gestor: 9. Devolver lista modificada
    deactivate Entidad
    Gestor-->>Vista: 10. Devolver nueva lista
    deactivate Gestor
    Vista->>Vista: 11. Recalcular balance general e indicadores
    Vista-->>Cliente: 12. Mostrar mensaje verde de éxito y tachar fila inactiva
    deactivate Vista
```

* **Excepción 1: Falla de red o sesión expirada al desactivar:** Si en el paso `3` la llamada al Gestor falla por vencimiento de sesión o red caída, la vista captura el error, reactiva el botón de desactivación y despliega la advertencia en rojo.

---

### **CU-09: Visualizar Reportes y Gráficos**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaReportes (Borde)"
    participant Gestor as "GestorReportes (Control)"
    participant Entidad as "EntidadMovimiento (Entidad)"

    Cliente->>Vista: 1. Ingresar al módulo de Reportes
    activate Vista
    Vista->>Gestor: 2. Solicitar todo el historial de movimientos
    activate Gestor
    Gestor->>Entidad: 3. Obtener transacciones registradas del usuario
    activate Entidad
    Entidad-->>Gestor: 4. Devolver array de transacciones
    deactivate Entidad
    Gestor-->>Vista: 5. Devolver listado histórico
    deactivate Gestor
    Vista->>Vista: 6. Agregar montos por categorías de ingresos/egresos
    Vista->>Vista: 7. Agrupar datos en intervalos para tendencias (6 meses)
    Vista->>Vista: 8. Calcular promedios mensuales y balances
    Vista-->>Cliente: 9. Renderizar la pestaña de Resumen General
    Cliente->>Vista: 10. Hacer clic en la pestaña "Gráficos"
    Vista-->>Cliente: 11. Renderizar gráficos de barras, líneas y circular interactivos
    deactivate Vista
```

* **Excepción 1: Falta de datos de transacciones en la cuenta:** Si el listado retornado en el paso `5` es vacío, la `VistaReportes` frena el renderizado de gráficos en el paso `6` y presenta en pantalla la vista especial de estado vacío con el botón para agregar un movimiento.

---

### **CU-10: Filtrar Historial Completo**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaReportes (Borde)"
    participant Gestor as "GestorReportes (Control)"

    Cliente->>Vista: 1. Hacer clic sobre la pestaña "💰 Movimientos"
    activate Vista
    Vista-->>Cliente: 2. Mostrar la tabla de movimientos e inicializar controles
    Cliente->>Vista: 3. Seleccionar mes específico en filtro "Filtrar por mes"
    Vista->>Vista: 4. Filtrar en memoria las transacciones por mes seleccionado
    Vista-->>Cliente: 5. Actualizar filas de la tabla de inmediato
    Cliente->>Vista: 6. Seleccionar categoría en filtro "Filtrar por categoría"
    Vista->>Vista: 7. Aplicar filtro combinado de mes y categoría en memoria
    Vista-->>Cliente: 8. Actualizar filas mostrando solo las transacciones que cumplen ambos criterios
    Cliente->>Vista: 9. Presionar "Limpiar Filtros"
    Vista->>Vista: 10. Restablecer controles a vacíos y recargar lista completa
    Vista-->>Cliente: 11. Mostrar tabla original restaurada
    deactivate Vista
```

* **Excepción 1: Filtros sin resultados:** Si al aplicar los filtros en memoria en los pasos `4` o `7` el listado de resultados queda vacío, la `VistaReportes` oculta la tabla y muestra el recuadro gris explicativo indicando: `"No hay movimientos - Con los filtros aplicados no se encontraron resultados"`.

---

### **CU-11: Planificar Ahorro para Compra**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaDashboard (Borde)"
    participant Gestor as "GestorPlanificador (Control)"
    participant Entidad as "HistorialConsumo (Entidad)"

    Cliente->>Vista: 1. Hacer clic sobre pestaña "🎯 Planificador de Compras"
    activate Vista
    Vista-->>Cliente: 2. Renderizar formulario de ingreso e inputs de precio
    Cliente->>Vista: 3. Ingresar nombre del artículo, precio y seleccionar mes para promedio
    Cliente->>Vista: 4. Presionar botón "Calcular Plan de Ahorro"
    Vista->>Gestor: 5. Solicitar cálculo de plan de ahorro(precio, mes_elegido)
    activate Gestor
    Gestor->>Entidad: 6. Obtener promedios de ingresos, egresos y ahorro neto
    activate Entidad
    Entidad-->>Gestor: 7. Datos de promedios netos mensuales devueltos
    deactivate Entidad
    Gestor->>Gestor: 8. Evaluar que la tasa de ahorro neta mensual sea mayor que cero
    Gestor->>Gestor: 9. Dividir precio total entre ahorro para estimar los meses de meta
    Gestor->>Gestor: 10. Proyectar la fecha aproximada de adquisición del producto
    Gestor-->>Vista: 11. Devolver plan de ahorro estructurado
    deactivate Gestor
    Vista-->>Cliente: 12. Mostrar recuadro verde con la fecha de meta, cuota mensual y sugerencias de ahorro
    deactivate Vista
```

* **Excepción 1: Capacidad de ahorro nula o negativa:** Si en el paso `8` el `GestorPlanificador` calcula que el saldo de ahorro neto mensual es menor o igual a cero, interrumpe la división para evitar valores nulos, responde con un fallo de inviabilidad y la vista dibuja una tarjeta en rojo alertando: `"No es posible con el ahorro actual"`.
* **Excepción 2: Entrada de precio vacía o errónea:** Si la validación local en la vista en el paso `4` detecta un precio nulo o menor a cero, detiene la solicitud de red al Gestor y muestra una alerta roja: `"Por favor ingresa un precio válido"`.

---

### **CU-12: Gestionar Información de Perfil**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaPerfil (Borde)"
    participant Gestor as "GestorPerfil (Control)"
    participant Entidad as "EntidadUsuario (Entidad)"

    Cliente->>Vista: 1. Acceder a la ruta /perfil
    activate Vista
    Vista->>Gestor: 2. Solicitar perfil del usuario activo
    activate Gestor
    Gestor->>Entidad: 3. Recuperar datos del usuario de base de datos
    activate Entidad
    Entidad-->>Gestor: 4. Devolver datos (Nombre, Email, Fecha de creación)
    deactivate Entidad
    Gestor-->>Vista: 5. Devolver objeto de perfil
    deactivate Gestor
    Vista->>Vista: 6. Rellenar inputs del formulario de información personal
    Vista-->>Cliente: 7. Renderizar formulario cargado y estadísticas de cuenta
    Cliente->>Vista: 8. Editar el Nombre o Email y presionar "💾 Guardar Cambios"
    Vista->>Vista: 9. Validar que los campos obligatorios contengan datos
    Vista->>Gestor: 10. Enviar actualización del perfil(nombre, email)
    activate Gestor
    Gestor->>Entidad: 11. Verificar que el nuevo email no esté tomado por otro usuario
    activate Entidad
    Entidad-->>Gestor: 12. Correo disponible para actualización
    deactivate Entidad
    Gestor->>Entidad: 13. Actualizar campos de usuario en base de datos
    activate Entidad
    Entidad-->>Gestor: 14. Perfil actualizado con éxito
    deactivate Entidad
    Gestor-->>Vista: 15. Devolver perfil modificado
    deactivate Gestor
    Vista->>Vista: 16. Refrescar el contexto global de sesión
    Vista-->>Cliente: 17. Mostrar mensaje verde de éxito
    deactivate Vista
```

* **Excepción 1: Omisión de datos obligatorios en perfil:** Si en el paso `9` la vista detecta campos vacíos en el formulario, detiene la llamada al Gestor y alerta al Actor que todos los campos son requeridos.
* **Excepción 2: Correo electrónico tomado por otra cuenta:** Si en el paso `12` el Gestor detecta que el nuevo email ya pertenece a otro registro diferente, rechaza la edición y retorna un conflicto al frontend. La vista despliega el mensaje de error en rojo.

---

### **CU-13: Cerrar Sesión**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaNavegacion (Borde)"
    participant Gestor as "GestorAutenticacion (Control)"

    Cliente->>Vista: 1. Presionar el botón "Cerrar Sesión"
    activate Vista
    Vista->>Gestor: 2. Solicitar desconexión del usuario (Logout)
    activate Gestor
    Gestor->>Gestor: 3. Destruir e invalidar credenciales locales del navegador
    Gestor->>Gestor: 4. Restablecer contexto global de sesión a nulo
    Gestor-->>Vista: 5. Confirmación de sesión destruida
    deactivate Gestor
    Vista-->>Cliente: 6. Redirigir forzadamente al Login e impedir el retorno
    deactivate Vista
```
