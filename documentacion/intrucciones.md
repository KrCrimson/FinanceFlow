PROMPT

Diseña e implementa un sistema web sencillo de control de ingresos y egresos para uso personal/familiar, enfocado en facilidad de uso, mantenibilidad y escalabilidad futura.

El sistema contará con tres vistas principales: Ingresos, Egresos y Reportes.

En las vistas de Ingresos y Egresos, el usuario podrá registrar movimientos financieros ingresando un nombre descriptivo y un monto numérico. Cada vista mostrará una lista de registros existentes y contará con los botones Nuevo, Guardar, Editar y Borrar. El botón de Borrar no eliminará físicamente el registro, sino que lo marcará como inactivo (soft delete), mostrándolo en color gris y excluyéndolo de los cálculos financieros, conservándolo para auditoría o consultas futuras.

El sistema aplicará una arquitectura Clean Architecture, separando claramente las capas de dominio, casos de uso, infraestructura e interfaces. La lógica de negocio se implementará mediante casos de uso y servicios, desacoplados de la base de datos mediante el patrón Repository.

La base de datos principal será MongoDB, utilizada para las operaciones diarias del sistema (CRUD de movimientos, estados, auditoría, logs). Para reportes financieros complejos y análisis históricos avanzados, se empleará MySQL como base de datos secundaria orientada a consultas analíticas, alimentada mediante procesos de sincronización desde MongoDB (ETL o jobs programados).

El backend será desarrollado en Node.js con Express, exponiendo una API REST segura y validada, mientras que el frontend será construido con React, utilizando componentes reutilizables, hooks personalizados y consumo de la API mediante servicios.

El sistema considerará validaciones robustas de datos, manejo correcto de fechas y estados, seguridad básica, registro de logs, manejo centralizado de errores y preparación para futuras extensiones como exportación de reportes, dashboards gráficos y crecimiento funcional.


TABLA DE TECNOLOGÍAS A UTILIZAR
Capa	Tecnología	Uso
Frontend	React	Interfaz de usuario
Frontend	React Router	Navegación entre vistas
Frontend	Axios / Fetch	Consumo de API
Frontend	React Hook Form	Manejo de formularios
Frontend	Tailwind CSS	Estilos
Frontend	Chart.js / Recharts	Gráficos de reportes
Backend	Node.js	Entorno de ejecución
Backend	Express.js	API REST
Backend	Zod / Yup	Validación de datos (DTOs)
Backend	Mongoose	ODM para MongoDB
Backend	dotenv	Variables de entorno
Backend	Helmet	Seguridad básica
Backend	Morgan	Logs HTTP
Backend	Winston / Pino	Logs del sistema
Arquitectura	Clean Architecture	Separación de capas
Patrones	Repository	Abstracción de BD
Patrones	Service / Use Case	Lógica de negocio
Patrones	DTO / Mapper	Control de entrada/salida
Patrones	Dependency Injection (simple)	Desacoplamiento
Patrones	Soft Delete	Eliminación lógica
BD Principal	MongoDB	Operaciones diarias
BD Secundaria	MySQL	Reportes complejos
BD Secundaria	Prisma / Sequelize (opcional)	Acceso SQL
Reportes	ETL / Cron Jobs	Sincronización Mongo → MySQL
Fechas	Day.js / Luxon	Manejo de fechas
Documentación	Markdown / README	Documentación técnica


Base de Datos – MongoDB Atlas (FREE)
🔹 Servicio

MongoDB Atlas – Tier M0 (Gratis)

(ya tengo el cluster)

Backend – Render (FREE)

Frontend – Vercel

Control de Versiones – GitHub

Monitoreo básico

UptimeRobot (FREE)

Pings cada 5 minutos

Evita que el backend se duerma

eguridad (FREE)

Incluido con librerías:

Helmet

CORS

Rate Limit

Validación con Zod

Reportes y Gráficos (FREE)

Chart.js / Recharts

Renderizados desde React

Consultas directas a MongoDB vía API