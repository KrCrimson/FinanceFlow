# Estructura y Funcionamiento del Frontend (React)

## Estructura de Carpetas

- **frontend/**
  - **src/**
    - **components/**: Componentes reutilizables (formularios, tablas, botones, etc.)
    - **pages/**: Vistas principales (IngresosPage, EgresosPage, ReportesPage)
    - **services/**: Funciones para consumir la API (usuarios, movimientos, logs)
    - **hooks/**: Hooks personalizados para lógica reutilizable (por ejemplo, manejo de formularios, fetch, etc.)
    - **utils/**: Utilidades y helpers (formateo de fechas, validaciones, etc.)
    - **App.jsx**: Componente principal, define rutas y navegación

## Funcionamiento General

- El usuario navega entre las vistas principales (Ingresos, Egresos, Reportes) usando React Router.
- Cada vista (page) muestra una lista de registros y un formulario para crear/editar movimientos.
- Los componentes de formulario usan React Hook Form para manejo eficiente de datos y validaciones.
- El frontend consume la API del backend usando servicios (con fetch o axios) para crear, listar, editar e inhabilitar registros.
- El estado de la aplicación se maneja localmente en los componentes o con hooks personalizados.
- Los componentes reutilizables (como tablas y formularios) se ubican en la carpeta components/ para facilitar su uso en distintas páginas.
- Los reportes y gráficos se renderizan en la vista ReportesPage usando librerías como Chart.js o Recharts.

## Flujo recomendado de desarrollo
1. Definir rutas y navegación en App.jsx.
2. Crear las páginas principales en pages/.
3. Implementar componentes reutilizables en components/.
4. Desarrollar servicios para consumir la API en services/.
5. Crear hooks personalizados y utilidades según se necesiten.
6. Integrar formularios y lógica de negocio en cada página.
7. Probar la integración completa con el backend.

Esta estructura permite un desarrollo ordenado, mantenible y escalable del frontend.
