# Modelado de Dominio y Colecciones MongoDB


## Colecciones Principales

### 1. movimientos
Registra todos los ingresos y egresos.
- _id (ObjectId)
- tipo ("ingreso" | "egreso")
- nombre (string)
- monto (number)
- fecha (date)
- estado ("activo" | "inactivo")
- creadoEn (date)
- actualizadoEn (date)

### 2. usuarios
Gestión de usuarios del sistema (para multiusuario, autenticación y control de acceso).
- _id (ObjectId)
- nombre (string)
- email (string)
- passwordHash (string)
- creadoEn (date)
- actualizadoEn (date)
- estado ("activo" | "inactivo")

### 3. logs
Auditoría y registro de acciones relevantes en el sistema.
- _id (ObjectId)
- accion (string)
- usuarioId (ObjectId, ref: usuarios)
- movimientoId (ObjectId, ref: movimientos)
- fecha (date)
- descripcion (string)

## Notas
- Las colecciones principales son movimientos, usuarios y logs.
- El campo estado permite inhabilitar registros sin borrarlos.
- Se recomienda indexar por fecha y tipo para reportes eficientes.
