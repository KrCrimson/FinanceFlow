# Diagrama de Arquitectura del Sistema (Componentes) — FinanceFlow

```mermaid
flowchart TD
    subgraph Frontend ["Frontend (Navegador / App Móvil)"]
        ReactApp["«component»<br>React Application (SPA)"]
        ExpoApp["«component»<br>Expo Mobile App"]
        SDKAdapter["«component»<br>SDK Adapter<br>frontend/src/sdk + *-adapter.js"]
        PaywallUI["«component»<br>PaywallModal.jsx"]
        ReactApp --> SDKAdapter
        ReactApp --> PaywallUI
    end

    subgraph Backend ["Backend API (Node.js / Express)"]
        Router["«component»<br>Routers (usuarios, movimientos, cierres, logs, pagos, admin, recordatorios)"]
        AuthMw["«component»<br>middlewares/auth.js"]
        AdminMw["«component»<br>middlewares/isAdmin.js"]
        ValidateMw["«component»<br>middlewares/validate.js (Zod)"]

        UsuariosCtrl["«component»<br>usuarios.controller.js"]
        MovimientosCtrl["«component»<br>movimientos.controller.js"]
        CierresCtrl["«component»<br>cierres.controller.js"]
        LogsCtrl["«component»<br>logs.controller.js"]
        PagosHandlers["«component»<br>pagos.router.js (handlers inline)"]
        AdminHandlers["«component»<br>admin.router.js (handlers inline)"]
        RecordatoriosHandlers["«component»<br>recordatorios.js (handlers inline)"]

        UsuariosSvc["«component»<br>usuarios.service.js"]
        MovimientosSvc["«component»<br>movimientos.service.js"]
        CierresSvc["«component»<br>cierres.service.js"]
        LogsSvc["«component»<br>logs.service.js"]
        OcrSvc["«component»<br>ocr.service.js (Gemini)"]

        MongooseModels["«component»<br>Mongoose Models<br>(Usuario, Movimiento, Cierre, Pago, Recordatorio, Log)"]

        Router --> AuthMw
        Router --> ValidateMw
        AuthMw --> AdminMw
        AuthMw --> UsuariosCtrl
        AuthMw --> MovimientosCtrl
        AuthMw --> CierresCtrl
        AuthMw --> LogsCtrl
        AuthMw --> PagosHandlers
        AdminMw --> AdminHandlers
        AuthMw --> RecordatoriosHandlers

        UsuariosCtrl --> UsuariosSvc
        MovimientosCtrl --> MovimientosSvc
        MovimientosCtrl --> OcrSvc
        CierresCtrl --> CierresSvc
        LogsCtrl --> LogsSvc

        UsuariosSvc --> MongooseModels
        MovimientosSvc --> MongooseModels
        CierresSvc --> MongooseModels
        LogsSvc --> MongooseModels
        PagosHandlers --> MongooseModels
        AdminHandlers --> MongooseModels
        RecordatoriosHandlers --> MongooseModels
    end

    subgraph MLService ["Servicio de Respaldo OCR (Python)"]
        FastAPIRouter["«component»<br>FastAPI Router (main.py)"]
        TesseractOCR["«component»<br>Tesseract OCR Engine"]
        NaiveBayes["«component»<br>Naive Bayes Classifier<br>(modelo_clasificador.pkl)"]
        FastAPIRouter --> TesseractOCR
        FastAPIRouter --> NaiveBayes
    end

    subgraph Database ["Capa de Datos"]
        CollUsuarios[("«collection»<br>usuarios")]
        CollMovimientos[("«collection»<br>movimientos")]
        CollCierres[("«collection»<br>cierres")]
        CollPagos[("«collection»<br>pagos")]
        CollRecordatorios[("«collection»<br>recordatorios")]
        CollLogs[("«collection»<br>logs")]
    end

    subgraph Externos ["Sistemas Externos"]
        Gemini["«external»<br>Google Gemini API"]
        Culqi["«external»<br>Culqi (Checkout.js + API REST)"]
    end

    SDKAdapter -- "POST /api/usuarios/login" --> Router
    SDKAdapter -- "GET /api/movimientos" --> Router
    SDKAdapter -- "POST /api/movimientos/ocr" --> Router
    SDKAdapter -- "POST /api/cierres" --> Router
    ExpoApp -- "HTTP REST" --> Router
    PaywallUI -- "tokeniza tarjeta" --> Culqi
    PaywallUI -- "POST /api/pagos/crear-cargo-culqi" --> Router
    SDKAdapter -. "POST /analyze-receipt (fallback)" .-> FastAPIRouter

    OcrSvc -- "generateContent()" --> Gemini
    PagosHandlers -- "POST /v2/charges" --> Culqi

    MongooseModels --> CollUsuarios
    MongooseModels --> CollMovimientos
    MongooseModels --> CollCierres
    MongooseModels --> CollPagos
    MongooseModels --> CollRecordatorios
    MongooseModels --> CollLogs
```

## Notas

- Los tres componentes marcados como **"handlers inline"** (`pagos.router.js`, `admin.router.js`, `recordatorios.js`) no siguen la separación Controller/Service del resto del sistema — es deuda técnica real documentada, no un error de este diagrama.
- `OcrSvc` (Gemini) y `FastAPIRouter` (servicio de respaldo) son **mutuamente independientes**: ninguno conoce al otro. La decisión de usar uno u otro vive enteramente en el frontend (`useImageToMovimiento.js`), no en el backend.
- `PaywallUI` es el único componente de frontend con una conexión HTTPS directa a un sistema externo (Culqi), por el requisito de tokenización segura de tarjetas que exige esa pasarela.
