# Gestión de Configuración - FinanceFlow

Este documento describe las políticas y estrategias definidas para la administración de la configuración del software, el control de versiones, el versionamiento semántico y el resguardo de la información de **FinanceFlow**.

---

## 1. Estrategia de Ramificación (GitFlow Simplificado)

Para garantizar un flujo de trabajo ordenado e integraciones estables en el monorepo, se implementan las siguientes directrices en Git:

- **`main`**: Alberga la versión actual del código en producción. Todo merge aquí gatilla el despliegue automático en Render y Vercel. Solo recibe fusiones de la rama `develop` mediante Pull Requests evaluados.
- **`develop`**: Rama base para la integración. Recibe los incrementos de las características finalizadas.
- **`feature/*`**: Ramas de desarrollo temporal dedicadas a implementar requerimientos específicos (ej. `feature/ocr-extraction`, `feature/soft-delete`). Se crean a partir de `develop` y se reintegran mediante Pull Requests.
- **`hotfix/*`**: Ramas de corrección rápida creadas directamente de `main` para resolver bugs críticos en el entorno de producción.

---

## 2. Gestión de Configuraciones y Secretos

Los secretos y variables de entorno **nunca** deben subirse al control de versiones.
- El archivo `.gitignore` del proyecto excluye de manera explícita:
  - Archivos de entorno: `.env`, `.env.local`, `.env.development.local`
  - Carpetas de dependencias: `node_modules/`
  - Compilados estáticos y temporales: `/build`, `/dist`, `.babelcache`
- En el entorno de producción, las variables críticas (`MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `REACT_APP_API_URL`) se configuran directamente en los paneles de control de **Render** (para la REST API y FastAPI) y **Vercel** (para la SPA React).

---

## 3. Versionamiento Semántico (SemVer)

El sistema de versiones sigue el estándar `MAJOR.MINOR.PATCH`:
- **MAJOR (Mayor):** Versiones mayores que presentan cambios significativos en el esquema NoSQL o APIs incompatibles con versiones previas (ej. migración de versionamientos de tokens).
- **MINOR (Menor):** Incrementos de funcionalidad compatibles (ej. integración del planificador de metas financieras en el dashboard).
- **PATCH (Parche):** Correcciones de bugs, ajustes de estilos o parches de dependencias de seguridad.

---

## 4. Backups de Datos y Recuperación

- **Persistencia en la Nube (MongoDB Atlas):** Al estar alojada la base de datos transaccional en un clúster administrado, Atlas gestiona instantáneas periódicas (backups automáticos diarios) y proporciona redundancia de réplicas en la nube para mitigar fallas críticas de infraestructura.
- **Resguardo Local Manual:** Para auditorías o backups fuera de la nube, se ejecutan utilidades de consola de MongoDB para exportar colecciones JSON estructuradas:
  ```bash
  mongodump --uri="mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/financeflow" --out=./backup_db/
  ```
