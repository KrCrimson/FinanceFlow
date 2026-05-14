# Diagramas Mejorados SAD

Este archivo contiene 15 diagramas en Mermaid, alineados con la cantidad de imagenes originales ubicadas en la carpeta principal del SAD.

## 01. Modelo 4+1
```mermaid
mindmap
  root((FinanceFlow))
    Casos de uso
      Usuario autenticado
      Administrador
      Motor Python IA
    Logica
      Modelos
      Servicios
      SDK
    Implementacion
      Frontend
      Backend
      ML backend
    Procesos
      OCR
      Silent Training
      JWT
    Despliegue
      Vercel
      Render
      MongoDB Atlas
```

## 02. Vista de casos de uso
```mermaid
flowchart TD
    A[Usuario autenticado] --> B[Registro / Login]
    A --> C[Movimientos]
    A --> D[Dashboard]
    A --> E[Reportes]
    F[Administrador] --> G[Logs]
    H[Motor Python] --> I[OCR y ML]
```

## 03. Vista logica de subsistemas
```mermaid
flowchart LR
    FE[Frontend React] --> SDK[SDK / Adaptadores]
    SDK --> BE[Backend Express]
    BE --> DB[(MongoDB Atlas)]
    FE --> AI[FastAPI OCR]
    BE --> AI
```

## 04. Secuencia de autenticacion
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as LoginPage
    participant SDK as authService
    participant API as Express
    participant SV as usuarios.service
    participant DB as MongoDB
    U->>UI: credenciales
    UI->>SDK: login()
    SDK->>API: POST /login
    API->>SV: autenticar
    SV->>DB: findOne(email)
    DB-->>SV: usuario
    SV-->>API: JWT
    API-->>SDK: 200 OK
    SDK-->>UI: sesion activa
```

## 05. Secuencia OCR
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as MovimientoForm
    participant AI as FastAPI
    participant OCR as Tesseract
    participant ML as Naive Bayes
    U->>UI: sube recibo
    UI->>AI: enviar imagen
    AI->>OCR: extraer texto
    OCR-->>AI: contenido
    AI->>ML: predecir categoria
    ML-->>AI: categoria
    AI-->>UI: autocompletar
```

## 06. Secuencia dashboard
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as DashboardPage
    participant API as Backend
    participant DB as MongoDB
    U->>UI: abre dashboard
    UI->>API: GET /dashboard
    API->>DB: consultar movimientos
    DB-->>API: datos agregados
    API-->>UI: saldo y graficos
```

## 07. Colaboracion entre objetos
```mermaid
flowchart TD
    U[Usuario] --> UI[LoginPage]
    UI --> S[authService]
    S --> SDK[SDK.auth]
    SDK --> API[Backend]
    API --> C[usuarios.controller]
    C --> SV[usuarios.service]
    SV --> DB[(MongoDB)]
```

## 08. Diagrama de objetos
```mermaid
classDiagram
    class UsuarioSesion {
      +string token
      +string nombre
      +string email
    }
    class MovimientoActivo {
      +number monto
      +string categoria
      +string estado
    }
    UsuarioSesion "1" --> "many" MovimientoActivo
```

## 09. Diagrama de clases
```mermaid
classDiagram
    class Usuario {
      +register()
      +login()
    }
    class Movimiento {
      +create()
      +update()
      +softDelete()
    }
    class Log {
      +create()
    }
    class AuthService {
      +login()
      +register()
    }
    class MovimientoService {
      +listar()
      +guardar()
    }
    Usuario --> AuthService
    MovimientoService --> Movimiento
    Usuario --> Log
```

## 10. Base de datos
```mermaid
erDiagram
    USERS ||--o{ MOVIMIENTOS : tiene
    USERS ||--o{ LOGS : genera
    USERS {
      string nombre
      string email
      string passwordHash
      string estado
    }
    MOVIMIENTOS {
      number monto
      string descripcion
      string categoria
      string estado
    }
    LOGS {
      string nivel
      string mensaje
      string endpoint
      number statusCode
    }
```

## 11. Arquitectura de software por paquetes
```mermaid
flowchart TB
    D[documentacion] --- F[frontend]
    F --- S[sdk]
    S --- B[backend]
    B --- DB[database]
    B --- ML[ml_backend]
```

## 12. Arquitectura de componentes
```mermaid
flowchart LR
    Browser --> Frontend[React App]
    Frontend --> SDK[SDK Adapter]
    SDK --> API[Node Express API]
    API --> Models[Mongoose Models]
    API --> Logs[Logging]
    Frontend --> AI[FastAPI OCR]
    AI --> ML[Scikit-Learn]
```

## 13. Proceso OCR y registro
```mermaid
flowchart TD
    A[Subir comprobante] --> B[OCR]
    B --> C[Extraer datos]
    C --> D[Validar campos]
    D --> E[Guardar movimiento]
    E --> F[Actualizar dashboard]
```

## 14. Proceso de silent training
```mermaid
flowchart TD
    A[Movimiento confirmado] --> B[Enviar datos corregidos]
    B --> C[Endpoint /retrain]
    C --> D[partial_fit]
    D --> E[Persistir modelo]
    E --> F[Sin detener UI]
```

## 15. Despliegue fisico
```mermaid
flowchart LR
    U[Usuario] --> Vercel[Vercel Frontend]
    Vercel --> RenderNode[Render Node.js]
    Vercel --> RenderPy[Render Python]
    RenderNode --> Atlas[(MongoDB Atlas)]
    RenderPy --> Atlas
```
