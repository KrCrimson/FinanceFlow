## Resumen y Alcance del MVP

Este documento contiene los requerimientos funcionales para el Sistema de Ingresos y Egresos. Se han priorizado y aclarado para asegurar un desarrollo ordenado y sin ambigüedades.

**Alcance del MVP:**
- Autenticación segura de usuarios (Login/Registro con JWT).
- Escaneo inteligente de recibos mediante OCR e Inteligencia Artificial.
- Registro y gestión de ingresos y egresos (manual y automatizado).
- Visualización de registros y Dashboard Analítico con gráficos avanzados.
- Persistencia de datos en base de datos en la nube (MongoDB).

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
| RQ-15   | Persistencia de datos en Base de Datos (MongoDB)        | 10                 | RQ-08, RQ-09, RQ-10        |
| RQ-16   | Autenticación de Usuarios (Login/Registro con JWT)      | 10                 | —                          |
| RQ-17   | Carga y procesamiento de imágenes de comprobantes (OCR) | 9                  | RQ-08                      |
| RQ-18   | Sugerencia automática de Categoría, Monto y Fecha (IA)  | 9                  | RQ-17                      |
| RQ-19   | Reentrenamiento silencioso del modelo IA (Feedback Loop)| 8                  | RQ-18, RQ-08               |
| RQ-20   | Dashboard Analítico con Gráficos (Barras, Pastel, etc.) | 8                  | RQ-03, RQ-12               |

<br>

### Detalle de Requerimientos y Prioridades

**Leyenda de Prioridad:**
*   **Alta:** Sin esto el sistema no funciona.
*   **Media:** Sin esto el sistema no tiene mucho sentido.
*   **Baja:** Sin esto es un poco complicado de usar.

| Código | Requerimiento Funcional | Descripción | Prioridad |
| :--- | :--- | :--- | :--- |
| RQ-01 | Vista de Ingresos | Pantalla principal para visualizar y registrar exclusivamente las entradas de dinero. | Alta |
| RQ-02 | Vista de Egresos | Pantalla transaccional para visualizar y asentar todos los gastos realizados. | Alta |
| RQ-03 | Vista de Reportes | Sección destinada a revisar la salud financiera e histórico de movimientos consolidados. | Media |
| RQ-04 | Campo Nombre | Entrada obligatoria de texto para identificar el concepto o comercio del gasto/ingreso. | Alta |
| RQ-05 | Campo Monto | Dato monetario fundamental para establecer el impacto del movimiento en el balance. | Alta |
| RQ-06 | Lista de registros | Despliegue en formato de tabla o lista de los últimos movimientos del usuario. | Alta |
| RQ-07 | Botón "Nuevo" | Atajo rápido para limpiar el formulario en pantalla y proceder con otro registro. | Baja |
| RQ-08 | Botón "Guardar" | Acción vital que envía el payload al servidor para asentar definitivamente el registro. | Alta |
| RQ-09 | Botón "Editar" | Capacidad de alterar datos ingresados por error en movimientos del pasado continuo. | Media |
| RQ-10 | Botón "Borrar" | Exclusión mediante "Borrado lógico" para ocultar errores sin alterar auditorías duras. | Media |
| RQ-11 | Estado "inactivo" | Representación visual diferenciada (gris) en UI indicando que una transacción fue anulada. | Baja |
| RQ-12 | Reporte Totales | Cálculo global que procesa todos los movimientos sumando ingresos y restando egresos. | Alta |
| RQ-13 | Filtro por fecha | Control en la interfaz para discriminar resultados analíticos a un mes o día específico. | Baja |
| RQ-14 | Cálculo automático | Función matemática silenciosa que re-evalúa en vivo el capital sin requerir recargar la app. | Alta |
| RQ-15 | Persistencia en BD | Conexión e inserción de datos hacia el Cloud de MongoDB (NoSQL) garantizando estado. | Alta |
| RQ-16 | Autenticación JWT | Blindaje del sistema, creación de cuentas y provisión de tokens para cada sesión humana. | Alta |
| RQ-17 | Procesamiento OCR | Lógica para aceptar fotos del usuario y enviarlas al analizador Tesseract de Python. | Media |
| RQ-18 | Sugerencias IA | Empleo de Scikit-Learn (Naive Bayes) para evitar trabajo manual deduciendo campos clave. | Media |
| RQ-19 | Feedback Loop IA | Comunicación en segundo plano del usuario hacia la IA para advertirle sobre sus fallos. | Baja |
| RQ-20 | Dashboard Analítico | Panel sofisticado provisto de representaciones visuales (React Recharts) del gasto general. | Media |