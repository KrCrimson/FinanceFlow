# Diagrama de Despliegue — FinanceFlow

```mermaid
flowchart TD
    subgraph ClienteWeb ["Dispositivo Cliente (Web)"]
        Browser["Navegador<br/>(Ejecuta React SPA + SDK local)"]
    end

    subgraph ClienteMobile ["Dispositivo Cliente (Móvil)"]
        App["App FinanceFlow<br/>(Expo / React Native, build EAS)"]
    end

    subgraph VercelEdge ["Vercel (Edge Network)"]
        CDN["CDN Global<br/>Hosting de /frontend/build (React estático)"]
    end

    subgraph RenderPaaS ["Render (PaaS)"]
        direction TB
        NodeSrv["Web Service: Node.js<br/>financeflow-backend-4fbw.onrender.com<br/>(/backend, Express)"]
        PythonSrv["Web Service: Python<br/>financeflow-ml.onrender.com<br/>(/ml_backend, FastAPI)"]
    end

    subgraph MongoCloud ["MongoDB Atlas"]
        Cluster[("Cluster M0<br/>Base de datos: SistemaBalance")]
    end

    subgraph ExternosCloud ["Servicios Cloud de Terceros"]
        GeminiAPI["Google Gemini API<br/>(generativelanguage.googleapis.com)"]
        CulqiAPI["Culqi<br/>(api.culqi.com + checkout.culqi.com)"]
        ResendAPI["Resend / Brevo<br/>(envío transaccional de correo)"]
        SentryAPI["Sentry<br/>(ingest.sentry.io)"]
    end

    Browser -- "HTTPS: descarga assets" --> CDN
    Browser -- "HTTPS: /api/*" --> NodeSrv
    Browser -- "HTTPS: tokenización de tarjeta" --> CulqiAPI
    Browser -. "HTTPS: /analyze-receipt (fallback OCR)" .-> PythonSrv
    Browser -. "eventos de error" .-> SentryAPI

    App -- "HTTPS: /api/*" --> NodeSrv

    NodeSrv -- "Wire Protocol (Mongoose)" --> Cluster
    NodeSrv -- "HTTPS" --> GeminiAPI
    NodeSrv -- "HTTPS" --> CulqiAPI
    NodeSrv -- "HTTPS" --> ResendAPI
    NodeSrv -. "eventos de error" .-> SentryAPI
```

## Notas de despliegue reales

- **Frontend**: desplegado en **Vercel**, `buildCommand: cd frontend && npm run build`, `outputDirectory: frontend/build`. Variables de entorno clave: `REACT_APP_API_URL`, `REACT_APP_CULQI_PUBLIC_KEY`, `REACT_APP_ML_URL`, `REACT_APP_SENTRY_DSN`.
- **Backend**: desplegado en **Render** como Web Service de Node.js independiente. Variables de entorno: `MONGODB_URI`, `JWT_SECRET`, `CULQI_SECRET_KEY`, `GEMINI_API_KEY`, `RESEND_API_KEY`/`BREVO_API_KEY`, `SENTRY_DSN`, `CORS_ORIGIN`.
- **ml_backend**: desplegado en Render como un **segundo y separado** Web Service de Python (tiene su propio `Dockerfile`), independiente del ciclo de vida del backend Node — puede caerse sin afectar el resto del sistema, ya que el frontend lo trata como respaldo opcional.
- **MongoDB Atlas**: clúster compartido M0 con "Network Access" abierto a `0.0.0.0/0` (según `DEPLOY_BACKEND.md`); el acceso real se restringe por usuario/contraseña de la cadena de conexión.
- **Mobile**: la app Expo se compila con **EAS Build** (`mobile/eas.json`) y consume la misma URL pública del backend en Render — no tiene despliegue propio de servidor.
- Todos los servicios de terceros (Gemini, Culqi, Resend/Brevo, Sentry) son **SaaS externos**, fuera de la infraestructura propia; FinanceFlow no aloja ninguno de ellos.
