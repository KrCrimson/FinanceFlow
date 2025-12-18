# Diseño de API y Casos de Uso

## Endpoints REST Principales

### Movimientos (Ingresos/Egresos)
- `GET /api/movimientos` — Listar todos los movimientos (activos/inactivos, con filtros opcionales)
- `POST /api/movimientos` — Crear un nuevo movimiento
- `PUT /api/movimientos/:id` — Editar un movimiento existente
- `PATCH /api/movimientos/:id/estado` — Inhabilitar (desactivar) un movimiento

### Reportes
- `GET /api/reportes/totales` — Obtener totales de ingresos, egresos y balance
- `GET /api/reportes?fechaInicio&fechaFin` — Reporte filtrado por rango de fechas

### Usuarios (para autenticación y control de acceso)
- `POST /api/usuarios` — Registrar usuario
- `POST /api/login` — Iniciar sesión
- `GET /api/usuarios/me` — Obtener datos del usuario autenticado

### Logs (auditoría)
- `GET /api/logs` — Listar logs del sistema (opcional, solo admin)

## Casos de Uso Principales (según requerimientos)
- Registrar ingreso/egreso
- Editar ingreso/egreso
- Inhabilitar (desactivar) ingreso/egreso
- Listar movimientos
- Calcular totales y balance
- Filtrar movimientos por fecha
- Registrar usuario e iniciar sesión
- Visualizar logs de acciones

## Notas
- Todos los endpoints validan datos de entrada y gestionan errores.
- Los endpoints de usuarios y logs pueden omitirse en el MVP si no se requiere autenticación ni auditoría avanzada.
- El endpoint de inhabilitación reemplaza al borrado lógico tradicional.
