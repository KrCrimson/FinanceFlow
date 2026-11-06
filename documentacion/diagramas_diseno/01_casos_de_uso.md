# Diagrama de Casos de Uso (Vista de Diseño) — FinanceFlow

A diferencia de la vista de análisis, aquí el diagrama incluye los **sistemas externos reales** con los que FinanceFlow se integra, y agrupa los casos de uso por el **endpoint REST** que realmente los implementa.

## Actores

| Actor | Tipo | Detalle técnico |
|---|---|---|
| Usuario Free | Humano | `Usuario.planTipo = "free"`, límite de OCR (`conteoOcrMes`) |
| Usuario Pro | Humano | `Usuario.esPremium = true`, `planTipo = "pro"` |
| Administrador | Humano | `Usuario.rol = "admin"`, validado por `middlewares/isAdmin.js` |
| Culqi | Sistema externo | API REST de cobro con tarjeta (`api.culqi.com/v2/charges`) |
| Google Gemini API | Sistema externo | `@google/generative-ai`, modelo de visión para OCR |
| Servicio ML de respaldo | Sistema externo | FastAPI + Tesseract + Naive Bayes (`ml_backend/`, Render) |
| Resend / Brevo | Sistema externo | Envío de correos (recuperación de contraseña) |
| Sentry | Sistema externo | Observabilidad y captura de errores (frontend + backend) |

```mermaid
flowchart LR
    classDef actor fill:#eff6ff,stroke:#3b82f6,color:#1e3a8a
    classDef extSys fill:#fef3c7,stroke:#d97706,color:#78350f
    classDef uc fill:#ffffff,stroke:#64748b,color:#334155

    UFree["👤 Usuario Free"]:::actor
    UPro["⭐ Usuario Pro"]:::actor
    Admin["🛡️ Administrador"]:::actor
    Culqi["💳 Culqi"]:::extSys
    Gemini["🤖 Google Gemini API"]:::extSys
    MLSvc["🧠 Servicio ML de respaldo"]:::extSys
    Email["✉️ Resend / Brevo"]:::extSys

    subgraph Sistema ["Sistema FinanceFlow"]
        direction TB
        UC01(["POST /api/usuarios/register"]):::uc
        UC02(["POST /api/usuarios/login"]):::uc
        UC03(["POST /api/usuarios/forgot-password"]):::uc
        UC06(["POST /api/movimientos"]):::uc
        UC07(["POST /api/movimientos/ocr"]):::uc
        UC08(["PATCH /api/movimientos/:id/inhabilitar"]):::uc
        UC14(["POST /api/cierres"]):::uc
        UC16(["POST /api/cierres/reabrir"]):::uc
        UC19(["POST /api/pagos/crear-cargo-culqi"]):::uc
        UC20(["CRUD /api/recordatorios"]):::uc
        UC21(["Exportación client-side (sin endpoint, usa GET /api/movimientos)"]):::uc
        UC22(["GET /api/admin/usuarios, POST /api/admin/aprobar-pago"]):::uc
    end

    UFree --> UC01
    UFree --> UC02
    UFree --> UC03
    UFree --> UC06
    UFree --> UC07
    UFree --> UC08
    UFree --> UC14
    UFree --> UC16
    UFree --> UC19
    UFree --> UC20
    UPro --> UC21
    Admin --> UC22

    UC03 -.->|SMTP API| Email
    UC07 -.->|HTTPS primario| Gemini
    UC07 -.->|HTTPS fallback si Gemini falla| MLSvc
    UC19 -.->|HTTPS + token de tarjeta| Culqi
    UC22 -.->|"<< include >>"| UC19

    style Sistema fill:#f8fafc,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a
```

## Notas técnicas de diseño

- `UC-07` implementa un patrón de **fallback de proveedor**: primero intenta `backend/services/ocr.service.js` (Gemini 1.5/2.0 Flash Vision); si la respuesta no es exitosa, `frontend/src/hooks/useImageToMovimiento.js` reintenta contra el microservicio Python desplegado por separado en Render (`financeflow-ml.onrender.com`).
- `UC-19` nunca recibe el número de tarjeta en el backend: el frontend lo tokeniza directamente con el script `checkout.culqi.com/js/v4` (Culqi Checkout) y solo el `source_id` (token) viaja al endpoint `crear-cargo-culqi`, protegido con `auth`.
- `UC-22` usa `req.user.id` del JWT + `middlewares/isAdmin.js`, nunca un rol enviado por el cliente.
