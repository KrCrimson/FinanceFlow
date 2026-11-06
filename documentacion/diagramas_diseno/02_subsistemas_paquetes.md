# Diagrama de Subsistemas (Paquetes Lógicos) — Vista de Diseño — FinanceFlow

```mermaid
flowchart TD
    subgraph Monorepo ["Monorepo FinanceFlow (GitHub: KrCrimson/FinanceFlow)"]
        subgraph Frontend ["/frontend (React 18, Create React App)"]
            SPA[React Views & Components]
            LocalSDK["/frontend/src/sdk (módulo local)"]
            Adapter["/frontend/src/services/*-adapter.js<br/>(fallback automático a servicio original)"]
            SPA --> Adapter
            Adapter --> LocalSDK
        end

        subgraph Backend ["/backend (Node 18, Express)"]
            API[Express Routes]
            Mid["Middlewares (auth, isAdmin, validate, rateLimit)"]
            Ctrl[Controllers]
            Svc[Services]
            API --> Mid --> Ctrl --> Svc
        end

        subgraph ML ["/ml_backend (Python, FastAPI) — servicio de respaldo"]
            FastAPI[FastAPI Router]
            OCR[Tesseract Engine]
            NLP["Naive Bayes Classifier (modelo_clasificador.pkl)"]
            FastAPI --> OCR
            FastAPI --> NLP
        end

        subgraph Mobile ["/mobile (Expo / React Native)"]
            RNApp[App React Native]
        end

        subgraph AdminLegacy ["/admin-dashboard (estático, legado)"]
            StaticHTML["index.html — superado por AdminDashboardPage.jsx"]
        end
    end

    subgraph DB ["MongoDB Atlas"]
        Models["Mongoose Models<br/>Usuario, Movimiento, Cierre, Pago, Recordatorio, Log"]
    end

    subgraph Externos ["Servicios Externos"]
        Gemini["Google Gemini API<br/>(OCR primario)"]
        Culqi["Culqi<br/>(cobro con tarjeta)"]
        EmailSvc["Resend / Brevo<br/>(envío de correos)"]
        SentrySvc["Sentry<br/>(observabilidad)"]
    end

    Frontend -- "HTTP REST (fetch, vía adapter/SDK)" --> Backend
    Mobile -- "HTTP REST" --> Backend
    Frontend -. "HTTP REST (fallback OCR)" .-> ML
    Backend -- "Mongoose ODM" --> DB
    Backend -- "HTTPS" --> Gemini
    Backend -- "HTTPS" --> Culqi
    Backend -- "HTTPS" --> EmailSvc
    Backend -. "SDK de errores" .-> SentrySvc
    Frontend -. "SDK de errores" .-> SentrySvc
```

## Explicación

- **`/frontend`** es una SPA de React servida estáticamente desde **Vercel**. No llama directamente a `fetch` en la mayoría de los módulos: pasa por un **adaptador** (`*-adapter.js`) que intenta usar el `sdk` local y cae de vuelta (fallback) al servicio original si el SDK falla — patrón de migración gradual, no un paquete npm externo real.
- **`/backend`** es la API REST única (Express) desplegada en **Render**, responsable de toda la lógica de negocio, autenticación y persistencia.
- **`/ml_backend`** es un **segundo servicio independiente**, también en Render, con su propio `Dockerfile`. Solo se usa como **respaldo** del OCR cuando Gemini no está disponible o la cuenta no tiene cuota.
- **`/mobile`** es una app Expo/React Native que consume la **misma** API REST del backend — no tiene lógica de negocio propia.
- **`/admin-dashboard`** es un artefacto estático legado; el panel de administración realmente usado hoy es `frontend/src/pages/AdminDashboardPage.jsx`, servido como parte de la SPA.
- Los 4 servicios externos (Gemini, Culqi, Resend/Brevo, Sentry) son llamados exclusivamente desde el backend, **excepto** la tokenización de tarjeta de Culqi, que ocurre en el navegador del cliente antes de llegar al backend (por requerimiento de PCI-DSS de Culqi).
