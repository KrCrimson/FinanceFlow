# Arquitectura y Tecnologías

## Arquitectura General

El sistema sigue el enfoque de Clean Architecture, separando las siguientes capas:

- **Dominio:** Entidades y lógica de negocio pura.
- **Casos de uso (Use Cases):** Orquestación de reglas de negocio y flujos principales.
- **Infraestructura:** Acceso a bases de datos, servicios externos, almacenamiento, etc.
- **Interfaces:** API REST (Express), controladores, validaciones, frontend (React).

Esta separación permite mantenibilidad, escalabilidad y facilidad para pruebas.

## Tecnologías Seleccionadas

### Frontend
- React
- React Router
- Axios / Fetch
- React Hook Form
- Tailwind CSS
- Chart.js / Recharts

### Backend
- Node.js
- Express.js
- Zod / Yup
- Mongoose
- dotenv
- Helmet
- Morgan
- Winston / Pino


### Arquitectura y Patrones
- Clean Architecture
- Repository
- Service / Use Case
- DTO / Mapper
- Dependency Injection (simple)
- Inhabilitación de registros (no borrado lógico): Los registros no se eliminan ni se marcan como "borrados", sino que simplemente se inhabilitan (desactivan) y se excluyen de los cálculos y vistas principales, pero permanecen en la base de datos para auditoría o consulta futura.

### Bases de Datos
- MongoDB (principal, operaciones diarias)
- MySQL (secundaria, reportes complejos)
- Prisma / Sequelize (opcional, acceso SQL)

### Otros
- ETL / Cron Jobs (sincronización Mongo → MySQL)
- Day.js / Luxon (manejo de fechas)
- Markdown / README (documentación)

## Tabla Resumen de Tecnologías

| Capa / Uso         | Tecnología(s)                        |
|--------------------|--------------------------------------|
| Frontend           | React, React Router, Tailwind, etc.  |
| Formularios        | React Hook Form                      |
| Gráficos           | Chart.js / Recharts                  |
| Backend            | Node.js, Express, Zod, Mongoose      |
| Seguridad          | Helmet, CORS, Rate Limit             |
| Logs               | Morgan, Winston / Pino               |
| Validación         | Zod / Yup                            |
| BD Principal       | MongoDB, Mongoose                    |
| BD Secundaria      | MySQL, Prisma / Sequelize            |
| Sincronización     | ETL / Cron Jobs                      |
| Fechas             | Day.js / Luxon                       |
| Documentación      | Markdown / README                    |
