## Resumen y Alcance del MVP

Este documento contiene los requerimientos funcionales para el Sistema de Ingresos y Egresos. Se han priorizado y aclarado para asegurar un desarrollo ordenado y sin ambigüedades.

**Alcance del MVP:**
- Registro y gestión de ingresos y egresos (altas, edición, borrado lógico).
- Visualización de registros en tablas.
- Reporte básico de totales y balance.
- Persistencia de datos en base de datos.

**Notas:**
- Todos los requerimientos han sido revisados para evitar ambigüedades.
- Se priorizarán los de mayor importancia y menor dependencia para el desarrollo inicial.
- Cualquier requerimiento no claro o con vacíos será resuelto antes de avanzar a la siguiente fase.


### Tabla de Requerimientos del Sistema de Ingresos y Egresos

| Código  | Nombre del Requerimiento                                 | Importancia (1–10) | Prerrequisito              |
|---------|----------------------------------------------------------|--------------------|----------------------------|
| RQ-01   | Vista de Ingresos                                       | 10                 | —                          |
| RQ-02   | Vista de Egresos                                        | 10                 | —                          |
| RQ-03   | Vista de Reportes                                       | 8                  | RQ-01, RQ-02               |
| RQ-04   | Campo de nombre del ingreso/egreso                      | 10                 | RQ-01, RQ-02               |
| RQ-05   | Campo de monto del ingreso/egreso                       | 10                 | RQ-01, RQ-02               |
| RQ-06   | Lista de registros (tabla)                              | 10                 | RQ-01, RQ-02               |
| RQ-07   | Botón “Nuevo” para limpiar campos                       | 9                  | RQ-04, RQ-05               |
| RQ-08   | Botón “Guardar” para añadir registros                   | 10                 | RQ-04, RQ-05, RQ-06        |
| RQ-09   | Botón “Editar” para modificar un registro               | 8                  | RQ-08                      |
| RQ-10   | Botón “Borrar” (marcar en gris sin eliminar)            | 9                  | RQ-06                      |
| RQ-11   | Estado de registro “inactivo” (gris)                    | 9                  | RQ-10                      |
| RQ-12   | Reporte básico de totales (ingresos, egresos, balance)  | 8                  | RQ-03                      |
| RQ-13   | Filtro por fecha en reportes                            | 6                  | RQ-12                      |
| RQ-14   | Cálculo automático de balance                           | 9                  | RQ-01, RQ-02               |
| RQ-15   | Persistencia de datos (archivo local o BD simple)        | 10                 | RQ-08, RQ-09, RQ-10        |