# Diagrama de Arquitectura Software (Paquetes) — FinanceFlow

```mermaid
flowchart LR
    subgraph Repositorio ["Monorepo: FinanceFlow"]
        direction LR

        subgraph FrontendPkg ["/frontend"]
            SPA[React SPA]
            subgraph SDKLocal ["/frontend/src/sdk (módulo local, no workspace npm)"]
                SDKCore[Módulos: auth, movimientos, cierres]
            end
            subgraph Adapters ["/frontend/src/services/*-adapter.js"]
                Adapter[Patrón Adapter + Fallback]
            end
            SPA --> Adapter
            Adapter --> SDKCore
            Adapter -. "fallback si el SDK falla" .-> Original["servicios *Service.js originales"]
        end

        backend["/backend (Express API)"]
        ml_backend["/ml_backend (FastAPI)"]
        mobile["/mobile (Expo / React Native)"]

        FrontendPkg -- "HTTP REST" --> backend
        FrontendPkg -. "HTTP REST (fallback OCR)" .-> ml_backend
        mobile -- "HTTP REST" --> backend
    end

    database[("MongoDB Atlas")]
    culqi[("Culqi API")]
    gemini[("Google Gemini API")]

    backend -- "Mongoose ODM" --> database
    backend -- "HTTPS" --> culqi
    backend -- "HTTPS" --> gemini
```

## Explicación

- El **SDK no es un paquete npm publicado**: es una carpeta local (`frontend/src/sdk`) importada por rutas relativas. La raíz del repositorio (`/sdk`) contiene documentación de fases de una migración (`FASE1-COMPLETADA.md` … `FASE5-PLAN.md`) hacia convertirlo en un paquete real, pero **el código en producción usa la copia local dentro de `/frontend`**, no el paquete de la raíz.
- El patrón **Adapter + Fallback** (`movimientos-adapter.js`, `auth-adapter.js`, etc.) permite activar o desactivar el SDK nuevo con una bandera, sin romper el comportamiento ya probado del servicio original.
- `/backend` es el único paquete que posee credenciales de los servicios externos (Culqi, Gemini) — el frontend nunca llama a estas APIs directamente, con la única excepción de la tokenización de tarjeta de Culqi (por diseño de seguridad PCI del propio proveedor).
- `/ml_backend` es un paquete **desacoplado en su propio lenguaje (Python)**, consumido únicamente como contingencia cuando el backend de Node no puede resolver el OCR con Gemini.
