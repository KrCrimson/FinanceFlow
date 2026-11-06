# Diagramas de Secuencia (Fase de Análisis) — FinanceFlow

Un diagrama de secuencia por cada uno de los 22 casos de uso del sistema. Son conceptuales y agnósticos a la tecnología (no mencionan frameworks ni nombres de archivo — eso es la vista de diseño), usando el patrón **BCE (Borde-Control-Entidad)**:
- **Vista (Borde):** pantalla con la que interactúa el Actor.
- **Gestor (Control):** módulo que aplica las reglas de negocio.
- **Entidad:** el dato persistente del dominio.

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

* **Excepción 1:** Datos inválidos → la Vista detiene el flujo antes del paso 4.
* **Excepción 2:** Correo ya registrado → el Gestor desiste y la Vista alerta en el campo correo.

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

* **Excepción 1:** Formato inválido → se detiene en la Vista.
* **Excepción 2:** Credenciales incorrectas → el Gestor responde fallo genérico por seguridad.

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
    Gestor->>Entidad: 8. Guardar token y expiración en base de datos
    activate Entidad
    Entidad-->>Gestor: 9. Token guardado correctamente
    deactivate Entidad
    Gestor->>Gestor: 10. Enviar email al usuario con enlace y token
    Gestor-->>Vista: 11. Notificar envío exitoso
    deactivate Gestor
    Vista-->>Cliente: 12. Mostrar mensaje verde de éxito
    deactivate Vista
```

* **Excepción 1:** Formato de correo inválido → bloqueo local en la Vista.
* **Excepción 2:** Correo no registrado → el Gestor detiene el flujo sin revelar si la cuenta existe.

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

* **Excepción 1:** Token inválido/expirado → formulario bloqueado.
* **Excepción 2:** Contraseñas no coinciden → detenido localmente.

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

* **Excepción 1:** Sesión expirada → advertencia en rojo.
* **Excepción 2:** Sin transacciones → estado vacío con llamada a la acción.

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
    Cliente->>Vista: 6. Seleccionar tipo, monto, nombre y categoría
    Cliente->>Vista: 7. Presionar "Guardar Movimiento"
    Vista->>Vista: 8. Validar que los campos requeridos cumplan
    Vista->>Gestor: 9. Enviar datos del movimiento(tipo, monto, nombre, categoria)
    activate Gestor
    Gestor->>Entidad: 10. Registrar nuevo movimiento
    activate Entidad
    Entidad-->>Gestor: 11. Movimiento registrado con éxito
    deactivate Entidad
    Gestor-->>Vista: 12. Confirmar registro exitoso
    deactivate Gestor
    Vista-->>Cliente: 13. Mostrar aviso verde y redirigir al Dashboard
    deactivate Vista
```

* **Excepción 1:** Campos obligatorios vacíos → bloqueo local.
* **Excepción 2:** Falla al guardar → aviso rojo de error de servidor.

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
    Gestor->>Entidad: 4. Solicitar lectura inteligente del comprobante
    activate Entidad
    Entidad-->>Gestor: 5. Devolver monto, nombre, fecha y categoría
    deactivate Entidad
    alt El servicio principal de IA no responde
        Gestor->>Entidad: 6. Reintentar con motor de respaldo
        activate Entidad
        Entidad-->>Gestor: 7. Devolver datos del motor de respaldo
        deactivate Entidad
    end
    Gestor-->>Vista: 8. Devolver JSON estructurado con datos
    deactivate Gestor
    Vista->>Vista: 9. Autocompletar campos reactivos en formulario
    Vista-->>Cliente: 10. Mostrar aviso verde "OCR Exitoso"
    deactivate Vista
```

* **Excepción 1:** Ningún motor logra leer la imagen → campos vacíos, aviso naranja para completar a mano.
* **Excepción 2:** Usuario Free alcanzó su límite mensual gratuito de escaneos → el Gestor rechaza la solicitud y ofrece el Plan Pro.

---

### **CU-08: Desactivar Movimientos**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaDashboard (Borde)"
    participant Gestor as "GestorMovimientos (Control)"
    participant Entidad as "EntidadMovimiento (Entidad)"

    Cliente->>Vista: 1. Presionar "Desactivar" en una fila
    activate Vista
    Vista->>Gestor: 2. Solicitar inhabilitación de movimiento(id)
    activate Gestor
    Gestor->>Entidad: 3. Modificar estado lógico a "inactivo"(id)
    activate Entidad
    Entidad-->>Gestor: 4. Estado actualizado en base de datos
    deactivate Entidad
    Gestor-->>Vista: 5. Confirmación de desactivación exitosa
    deactivate Gestor
    Vista->>Vista: 6. Recalcular balance general e indicadores
    Vista-->>Cliente: 7. Mostrar mensaje verde y tachar fila inactiva
    deactivate Vista
```

* **Excepción 1:** Movimiento pertenece a un periodo ya cerrado → el Gestor rechaza la desactivación.

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
    Vista->>Vista: 6. Agregar montos por categorías
    Vista->>Vista: 7. Agrupar datos para tendencias mensuales
    Vista-->>Cliente: 8. Renderizar gráficos de barras, líneas y circular
    deactivate Vista
```

* **Excepción 1:** Sin datos de transacciones → vista especial de estado vacío.

---

### **CU-10: Filtrar Historial Completo**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaReportes (Borde)"

    Cliente->>Vista: 1. Abrir la pestaña "Movimientos"
    activate Vista
    Vista-->>Cliente: 2. Mostrar tabla completa
    Cliente->>Vista: 3. Seleccionar filtro de mes
    Vista->>Vista: 4. Filtrar transacciones por mes en memoria
    Vista-->>Cliente: 5. Actualizar filas de inmediato
    Cliente->>Vista: 6. Seleccionar filtro de categoría
    Vista->>Vista: 7. Combinar filtros de mes y categoría
    Vista-->>Cliente: 8. Mostrar solo las filas que cumplen ambos criterios
    Cliente->>Vista: 9. Presionar "Limpiar Filtros"
    Vista-->>Cliente: 10. Restaurar tabla original
    deactivate Vista
```

* Este caso de uso no involucra al Gestor/Control: el historial completo ya fue cargado previamente (CU-09) y el filtrado ocurre enteramente en memoria, dentro del propio navegador.
* **Excepción 1:** Filtros sin resultados → recuadro explicativo de "sin movimientos".

---

### **CU-11: Planificar Ahorro para Compra**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaPlanificador (Borde)"
    participant Gestor as "GestorPlanificacion (Control)"
    participant Entidad as "EntidadMetaDeCompra (Entidad)"

    Cliente->>Vista: 1. Ingresar nombre del artículo y precio objetivo
    Cliente->>Vista: 2. Presionar "Nueva Meta"
    activate Vista
    Vista->>Gestor: 3. Solicitar creación de meta(nombre, monto)
    activate Gestor
    Gestor->>Entidad: 4. Guardar meta como "planificada"
    activate Entidad
    Entidad-->>Gestor: 5. Meta creada con éxito
    deactivate Entidad
    Gestor-->>Vista: 6. Confirmar creación
    deactivate Gestor
    Vista->>Vista: 7. Calcular % de avance contra el balance actual disponible
    Vista-->>Cliente: 8. Mostrar barra de progreso en tiempo real
    deactivate Vista
```

* **Excepción 1:** El balance ya alcanza el monto → la meta se marca "¡Lista para comprar!" automáticamente.
* **Excepción 2:** Nombre o monto inválido → bloqueo local antes de enviar al Gestor.

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
    Gestor->>Entidad: 3. Recuperar datos del usuario
    activate Entidad
    Entidad-->>Gestor: 4. Devolver datos del perfil
    deactivate Entidad
    Gestor-->>Vista: 5. Devolver objeto de perfil
    deactivate Gestor
    Vista-->>Cliente: 6. Renderizar formulario y estadísticas de cuenta
    Cliente->>Vista: 7. Editar datos y presionar "Guardar Cambios"
    Vista->>Gestor: 8. Enviar actualización del perfil(nombre, email)
    activate Gestor
    Gestor->>Entidad: 9. Verificar que el email no esté tomado
    activate Entidad
    Entidad-->>Gestor: 10. Correo disponible
    deactivate Entidad
    Gestor->>Entidad: 11. Actualizar datos del usuario
    activate Entidad
    Entidad-->>Gestor: 12. Perfil actualizado
    deactivate Entidad
    Gestor-->>Vista: 13. Devolver perfil modificado
    deactivate Gestor
    Vista-->>Cliente: 14. Mostrar mensaje verde de éxito
    deactivate Vista
```

* **Excepción 1:** Campos vacíos → bloqueo local.
* **Excepción 2:** Correo ya usado por otra cuenta → conflicto, mensaje rojo.

---

### **CU-13: Cerrar Sesión**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaNavegacion (Borde)"
    participant Gestor as "GestorAutenticacion (Control)"

    Cliente->>Vista: 1. Presionar "Cerrar Sesión"
    activate Vista
    Vista->>Gestor: 2. Solicitar desconexión del usuario
    activate Gestor
    Gestor->>Gestor: 3. Destruir credenciales locales
    Gestor-->>Vista: 4. Confirmación de sesión destruida
    deactivate Gestor
    Vista-->>Cliente: 5. Redirigir forzadamente al Login
    deactivate Vista
```

---

### **CU-14: Realizar Arqueo Diario**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaCierre (Borde)"
    participant Gestor as "GestorCierres (Control)"
    participant Entidad as "EntidadCierre (Entidad)"

    Cliente->>Vista: 1. Abrir el modal de arqueo diario
    activate Vista
    Cliente->>Vista: 2. Ingresar el monto de dinero físico contado
    Cliente->>Vista: 3. Presionar "Confirmar Arqueo"
    Vista->>Gestor: 4. Solicitar cierre diario(saldoFisico)
    activate Gestor
    Gestor->>Entidad: 5. Calcular ingresos y egresos del día
    activate Entidad
    Entidad-->>Gestor: 6. Totales del día devueltos
    deactivate Entidad
    Gestor->>Gestor: 7. Calcular diferencia (saldo físico vs esperado)
    Gestor->>Entidad: 8. Guardar el arqueo diario
    activate Entidad
    Entidad-->>Gestor: 9. Arqueo guardado con éxito
    deactivate Entidad
    Gestor-->>Vista: 10. Confirmar arqueo registrado
    deactivate Gestor
    Vista-->>Cliente: 11. Mostrar resumen con la diferencia encontrada
    deactivate Vista
```

* **Excepción 1:** Campo de monto vacío → bloqueo local.
* **Excepción 2:** Ya existe un arqueo para el día → el Gestor rechaza el duplicado.

---

### **CU-15: Realizar Cierre Mensual**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaCierre (Borde)"
    participant Gestor as "GestorCierres (Control)"
    participant Entidad as "EntidadUsuario (Entidad)"

    Cliente->>Vista: 1. Presionar "Realizar Cierre Mensual"
    activate Vista
    Cliente->>Vista: 2. Ingresar saldo físico y contraseña de confirmación
    Vista->>Gestor: 3. Solicitar cierre mensual(saldoFisico, clave)
    activate Gestor
    Gestor->>Entidad: 4. Validar la contraseña del usuario
    activate Entidad
    Entidad-->>Gestor: 5. Contraseña correcta
    deactivate Entidad
    Gestor->>Gestor: 6. Calcular totales y diferencia del mes
    Gestor->>Entidad: 7. Guardar cierre mensual de forma permanente
    activate Entidad
    Entidad-->>Gestor: 8. Cierre guardado
    deactivate Entidad
    Gestor-->>Vista: 9. Confirmar cierre exitoso
    deactivate Gestor
    Vista-->>Cliente: 10. Mostrar aviso y bloquear edición del periodo
    deactivate Vista
```

* **Excepción 1:** Contraseña incorrecta → el Gestor rechaza el cierre.

---

### **CU-16: Reabrir Periodo Cerrado**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaCierre (Borde)"
    participant Gestor as "GestorCierres (Control)"
    participant Entidad as "EntidadCierre (Entidad)"

    Cliente->>Vista: 1. Seleccionar un periodo cerrado
    activate Vista
    Cliente->>Vista: 2. Presionar "Reabrir Periodo" e ingresar contraseña
    Vista->>Gestor: 3. Solicitar reapertura(periodo, clave)
    activate Gestor
    Gestor->>Gestor: 4. Validar la contraseña del usuario
    Gestor->>Entidad: 5. Eliminar el registro de cierre del periodo
    activate Entidad
    Entidad-->>Gestor: 6. Cierre eliminado
    deactivate Entidad
    Gestor-->>Vista: 7. Confirmar reapertura
    deactivate Gestor
    Vista-->>Cliente: 8. Mostrar aviso y habilitar edición del periodo nuevamente
    deactivate Vista
```

* **Excepción 1:** Contraseña incorrecta → se cancela la operación de seguridad.

---

### **CU-17: Destacar Ingreso Fijo**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaMovimiento (Borde)"
    participant Gestor as "GestorMovimientos (Control)"
    participant Entidad as "EntidadMovimiento (Entidad)"

    Cliente->>Vista: 1. Marcar la casilla "Es un ingreso recurrente"
    activate Vista
    Vista->>Gestor: 2. Marcar el movimiento como recurrente(id)
    activate Gestor
    Gestor->>Entidad: 3. Actualizar bandera esRecurrente a verdadero
    activate Entidad
    Entidad-->>Gestor: 4. Actualización guardada
    deactivate Entidad
    Gestor-->>Vista: 5. Confirmar cambio
    deactivate Gestor
    Vista-->>Cliente: 6. Mostrar el ingreso destacado en el panel lateral
    deactivate Vista
```

* **Excepción 1:** El usuario revoca la constancia → se repite el flujo invirtiendo la bandera a falso.

---

### **CU-18: Eliminar Cuenta**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaPerfil (Borde)"
    participant Gestor as "GestorPerfil (Control)"
    participant Entidad as "EntidadUsuario (Entidad)"

    Cliente->>Vista: 1. Presionar "Eliminar mi cuenta"
    activate Vista
    Vista-->>Cliente: 2. Mostrar advertencia de acción irreversible
    Cliente->>Vista: 3. Confirmar la eliminación
    Vista->>Gestor: 4. Solicitar borrado de cuenta
    activate Gestor
    Gestor->>Entidad: 5. Eliminar el registro del usuario y sus datos asociados
    activate Entidad
    Entidad-->>Gestor: 6. Cuenta eliminada
    deactivate Entidad
    Gestor-->>Vista: 7. Confirmar eliminación
    deactivate Gestor
    Vista-->>Cliente: 8. Cerrar sesión y redirigir a la página de inicio
    deactivate Vista
```

* **Excepción 1:** El usuario cancela la confirmación → no ocurre ninguna acción.

---

### **CU-19: Suscribirse al Plan Pro**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaSuscripcion (Borde)"
    participant Gestor as "GestorPagos (Control)"
    participant Pasarela as "PasarelaDePago (Entidad Externa)"
    participant Entidad as "EntidadUsuario (Entidad)"

    Cliente->>Vista: 1. Presionar "Hazte Pro"
    activate Vista
    Vista-->>Cliente: 2. Mostrar beneficios y precio (S/ 19.90)
    Cliente->>Vista: 3. Ingresar datos de tarjeta y confirmar
    Vista->>Pasarela: 4. Tokenizar los datos de la tarjeta de forma segura
    Pasarela-->>Vista: 5. Devolver un token de un solo uso
    Vista->>Gestor: 6. Solicitar el cobro(token, monto)
    activate Gestor
    Gestor->>Pasarela: 7. Procesar el cargo con el token
    activate Pasarela
    Pasarela-->>Gestor: 8. Confirmar pago aprobado
    deactivate Pasarela
    Gestor->>Entidad: 9. Activar el plan Pro del usuario
    activate Entidad
    Entidad-->>Gestor: 10. Usuario actualizado a Pro
    deactivate Entidad
    Gestor-->>Vista: 11. Confirmar suscripción exitosa
    deactivate Gestor
    Vista-->>Cliente: 12. Mostrar mensaje de bienvenida a Pro
    deactivate Vista
```

* **Excepción 1:** La tarjeta es rechazada → la Pasarela informa el motivo y no se activa el plan.
* **Excepción 2:** La pasarela no está disponible → el Gestor informa que el pago no pudo iniciarse.

---

### **CU-20: Gestionar Recordatorios de Préstamos**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Autenticado"
    participant Vista as "VistaRecordatorios (Borde)"
    participant Gestor as "GestorRecordatorios (Control)"
    participant Entidad as "EntidadRecordatorio (Entidad)"

    Cliente->>Vista: 1. Ingresar descripción, monto, tipo y fecha de vencimiento
    activate Vista
    Vista->>Gestor: 2. Solicitar creación del recordatorio
    activate Gestor
    Gestor->>Entidad: 3. Guardar el recordatorio como "pendiente"
    activate Entidad
    Entidad-->>Gestor: 4. Recordatorio creado
    deactivate Entidad
    Gestor-->>Vista: 5. Confirmar creación
    deactivate Gestor
    Vista-->>Cliente: 6. Mostrar el recordatorio en la lista
    Cliente->>Vista: 7. Marcar un recordatorio como "Pagado"
    Vista->>Gestor: 8. Solicitar actualización de estado
    activate Gestor
    Gestor->>Entidad: 9. Cambiar estado a "pagado"
    activate Entidad
    Entidad-->>Gestor: 10. Estado actualizado
    deactivate Entidad
    Gestor-->>Vista: 11. Confirmar actualización
    deactivate Gestor
    Vista-->>Cliente: 12. Quitar el recordatorio de la lista de pendientes
    deactivate Vista
```

* **Excepción 1:** Fecha de vencimiento ya pasada → la Vista advierte pero permite continuar.

---

### **CU-21: Exportar Reportes en Excel/PDF**

```mermaid
sequenceDiagram
    actor Cliente as "Usuario Pro"
    participant Vista as "VistaReportes (Borde)"
    participant Gestor as "GestorReportes (Control)"
    participant Entidad as "EntidadMovimiento (Entidad)"

    Cliente->>Vista: 1. Presionar "Exportar Excel" o "Exportar PDF"
    activate Vista
    Vista->>Gestor: 2. Verificar que el usuario tenga el Plan Pro activo
    activate Gestor
    Gestor-->>Vista: 3. Confirmar que el plan es Pro
    deactivate Gestor
    Vista->>Entidad: 4. Obtener los movimientos actualmente filtrados
    activate Entidad
    Entidad-->>Vista: 5. Devolver listado de movimientos
    deactivate Entidad
    Vista->>Vista: 6. Generar el archivo (Excel o PDF) en el propio navegador
    Vista-->>Cliente: 7. Descargar el archivo contable generado
    deactivate Vista
```

* **Excepción 1:** El usuario no tiene el Plan Pro → en lugar de exportar, se muestra el aviso para suscribirse (CU-19).

---

### **CU-22: Administrar la Plataforma**

```mermaid
sequenceDiagram
    actor Admin as "Administrador"
    participant Vista as "VistaAdmin (Borde)"
    participant Gestor as "GestorAdministracion (Control)"
    participant Entidad as "EntidadUsuario / EntidadPago (Entidad)"

    Admin->>Vista: 1. Ingresar al Panel de Administración
    activate Vista
    Vista->>Gestor: 2. Solicitar métricas globales y lista de usuarios
    activate Gestor
    Gestor->>Entidad: 3. Consultar usuarios, pagos y totales del sistema
    activate Entidad
    Entidad-->>Gestor: 4. Devolver datos agregados
    deactivate Entidad
    Gestor-->>Vista: 5. Devolver panel de control completo
    deactivate Gestor
    Vista-->>Admin: 6. Mostrar métricas, usuarios y pagos pendientes
    Admin->>Vista: 7. Aprobar un pago manual (Yape/BCP) pendiente
    Vista->>Gestor: 8. Solicitar aprobación del pago(idPago)
    activate Gestor
    Gestor->>Entidad: 9. Marcar el pago como aprobado y activar el Plan Pro
    activate Entidad
    Entidad-->>Gestor: 10. Usuario actualizado
    deactivate Entidad
    Gestor-->>Vista: 11. Confirmar aprobación
    deactivate Gestor
    Vista-->>Admin: 12. Actualizar la lista de pagos pendientes
    deactivate Vista
```

* **Excepción 1:** El usuario autenticado no tiene rol de Administrador → el sistema le niega el acceso al panel.
