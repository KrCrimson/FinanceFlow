# Diagramas Mermaid para SAD FD04 - FinanceFlow (Actualizado Final - Correcciones Estrictas)

Este archivo contiene los diagramas generados estrictamente con las reglas proporcionadas (Nombres reales de los esquemas, dependencias exactas y SDK como módulo interno).

---

### 1. Diagrama de Subsistemas (Paquetes Lógicos)
```mermaid
flowchart TD
    subgraph Monorepo ["Monorepo FinanceFlow"]
        subgraph Frontend ["/frontend (Browser)"]
            SPA[React Views & Components]
            FFSDK[SDK @sistema-balance/sdk]
            SPA -- "importa localmente" --> FFSDK
        end
        subgraph Backend ["/backend (Express API)"]
            API[Express Routes]
            Mid[Middlewares]
            Ctrl[Controllers]
            Svc[Services]
            API --> Mid --> Ctrl --> Svc
        end
        subgraph ML ["/ml_backend (FastAPI)"]
            FastAPI[FastAPI Router]
            OCR[Tesseract Engine]
            NLP[NaiveBayes Classifier]
            FastAPI --> OCR
            FastAPI --> NLP
        end
        subgraph DB ["MongoDB Atlas"]
            Models[Mongoose Models]
        end
    end

    Frontend -- "HTTP REST (via SDK)" --> Backend
    Svc -- "Mongoose ODM" --> DB
    Frontend -- "HTTP REST (via SDK)" --> ML
    Backend -- "Async HTTP" --> ML
```

---

### 2. Secuencia 1: Autenticación de Usuario
```mermaid
sequenceDiagram
    actor Usuario
    participant UI as frontend/src/pages/LoginPage.jsx
    participant Auth as sdk/src/modules/auth.js
    participant API as backend/controllers/usuarios.controller.js
    participant Svc as backend/services/usuarios.service.js
    participant DB as MongoDB (usuarios)

    Usuario->>UI: Ingresa credenciales y envía
    UI->>Auth: login(credentials)
    Auth->>API: POST /api/usuarios/login
    API->>Svc: autenticarUsuario(email, password)
    
    Svc->>DB: findOne({ email })
    DB-->>Svc: Retorna Usuario Document
    
    Svc->>Svc: bcrypt.compare(password, passwordHash)
    Svc->>Svc: jwt.sign(payload, secret)
    
    Svc-->>API: { token, user }
    API-->>Auth: HTTP 200 OK + JSON
    Auth-->>UI: Guarda token y retorna exitoso
    UI-->>Usuario: Redirige al Dashboard
```

---

### 3. Secuencia 2: Visualización del Dashboard
```mermaid
sequenceDiagram
    actor Usuario
    participant UI as frontend/src/pages/DashboardPage.jsx
    participant Hook as frontend/src/hooks/useAnalisisGastos.js
    participant SDK as sdk/src/modules/movimientos.js
    participant API as backend/controllers/movimientos.controller.js
    participant DB as MongoDB (movimientos)

    Usuario->>UI: Ingresa al Dashboard
    UI->>Hook: ejecuta useEffect()
    Hook->>SDK: getMovimientos()
    SDK->>API: GET /api/movimientos
    API->>DB: find({ userId })
    DB-->>API: Array de Movimientos
    API-->>SDK: HTTP 200 { movimientos }
    SDK-->>Hook: Retorna lista de movimientos
    Hook->>Hook: calcularEstadisticasPorCategoria()
    Hook->>Hook: calcularResumenMensual()
    Hook-->>UI: Actualiza estado local con resumen
    UI->>UI: Renderiza Gráficos
    UI-->>Usuario: Muestra Dashboard actualizado
```

---

### 4. Secuencia 3: Cierre Mensual
```mermaid
sequenceDiagram
    actor Usuario
    participant Banner as frontend/src/components/AlertasComponent.jsx
    participant Modal as frontend/src/components/CajaChicaModal.jsx
    participant SDK as sdk/src/modules/cierres.js
    participant Ctrl as backend/controllers/cierres.controller.js
    participant Svc as backend/services/cierres.service.js
    participant DB_Usuarios as MongoDB (usuarios)
    participant DB_Cierres as MongoDB (cierres)

    Usuario->>Banner: Click en "Realizar Cierre Mensual"
    Banner->>Modal: Abre modal de cierre
    Usuario->>Modal: Ingresa saldo físico y contraseña
    Modal->>SDK: crearCierre(datos)
    SDK->>Ctrl: POST /api/cierres/mensual
    
    Ctrl->>Svc: procesarCierre(datos)
    Svc->>DB_Usuarios: Verificar passwordHash del Usuario
    Svc->>DB_Cierres: aggregate (sumar ingresos/egresos del periodo)
    
    Svc->>Svc: Calcular diferencia (saldoFisico - saldoEsperado)
    Svc->>DB_Cierres: insert({ ...datosCierre })
    DB_Cierres-->>Svc: Documento creado
    
    Svc-->>Ctrl: HTTP 201 Created
    Ctrl-->>SDK: Success
    SDK-->>Modal: Retorna JSON
    
    Modal->>Modal: Actualizar estado UI
    Modal->>Banner: Actualiza notificación
```

---

### 5. Diagrama de Colaboración (Vista de Diseño)
```mermaid
flowchart LR
    Usuario[Usuario] -->|1: input| UI[frontend/src/pages/MovimientoFormPage.jsx]
    UI -.->|2a: analyzeReceipt| SDK_ML[sdk/src/modules/ml.js]
    SDK_ML -.->|2b: /analyze-receipt| ML[ml_backend/main.py]
    UI -->|3: submit| SDK[sdk/src/modules/movimientos.js]
    SDK -->|4: POST /api/movimientos| Ctrl[backend/controllers/movimientos.controller.js]
    Ctrl -->|5: llama| Svc[backend/services/movimientos.service.js]
    Svc -->|6: save| Model[backend/models/movimiento.model.js]
    Model -->|7: insert| DB[(MongoDB)]
```

---

### 6. Diagrama de Objetos (Sesión de Usuario)
```mermaid
classDiagram
    class juan_perez_Usuario {
        _id: "6643de...12"
        nombre: "Juan Pérez"
        email: "juan@test.com"
        estado: "activo"
        creadoEn: "2024-01-01T10:00:00Z"
    }
    
    class mov_01_Movimiento {
        _id: "6643de...f1"
        tipo: "egreso"
        monto: 45.50
        categoria: "Comida"
        estado: "activo"
    }
    
    class mov_02_Movimiento {
        _id: "6643de...f2"
        tipo: "ingreso"
        monto: 1500.00
        categoria: "Salario"
        estado: "activo"
    }

    juan_perez_Usuario --> mov_01_Movimiento : userId
    juan_perez_Usuario --> mov_02_Movimiento : userId
```

---

### 7. Diagrama de Clases
```mermaid
classDiagram
    class Usuario {
        +ObjectId _id
        +String nombre
        +String email
        +String passwordHash
        +String estado
    }

    class FinanceFlowSDK {
        +AuthModule auth
        +MovimientosModule movimientos
        +CierresModule cierres
    }

    class Movimiento {
        +ObjectId _id
        +ObjectId userId
        +String tipo
        +Number monto
        +String categoria
        +String estado
    }

    class Cierre {
        +ObjectId _id
        +ObjectId userId
        +String tipo
        +Number saldoEsperado
        +Number saldoFisico
        +Number diferencia
    }

    Usuario "1" -- "*" Movimiento : posee
    Usuario "1" -- "*" Cierre : realiza
    
    FinanceFlowSDK ..> Movimiento : <<use>>
    FinanceFlowSDK ..> Cierre : <<use>>
```

---

### 8. Diagrama de Base de Datos (Entidad-Relación)
```mermaid
erDiagram
    usuarios {
        ObjectId _id PK
        String nombre
        String email UK
        String passwordHash
        Date creadoEn
        Date actualizadoEn
        String estado
        String resetPasswordToken
        Date resetPasswordExpires
        Number __v
    }

    movimientos {
        ObjectId _id PK
        String tipo
        String nombre
        Number monto
        String categoria
        ObjectId userId FK
        Date fecha
        String estado
        Date creadoEn
        Date actualizadoEn
        Number __v
    }

    cierres {
        ObjectId _id PK
        ObjectId userId FK
        String tipo
        String periodo
        Number fondoFijo
        Number ingresosTotales
        Number egresosTotales
        Number saldoEsperado
        Number saldoFisico
        Number diferencia
        String comentarios
        Date creadoEn
        Number __v
    }

    logs {
        ObjectId _id PK
        String accion
        ObjectId usuarioId FK
        ObjectId movimientoId FK
        Date fecha
        String descripcion
        Number __v
    }

    usuarios ||--o{ movimientos : "registra"
    usuarios ||--o{ cierres : "ejecuta"
    usuarios ||--o{ logs : "genera"
    movimientos ||--o{ logs : "referencia"
```

---

### 9. Diagrama de Arquitectura Software (Paquetes)
```mermaid
flowchart LR
    subgraph Repositorio ["Monorepo: FinanceFlow"]
        direction LR
        
        subgraph /sdk [workspace package]
            SDK_Core[@sistema-balance/sdk]
        end
        
        subgraph Frontend ["/frontend"]
            SPA[React SPA]
            subgraph /frontend/src/sdk [adaptador local]
                Adapter[SDK Adapter]
            end
            SPA --> Adapter
            Adapter --> SDK_Core
        end
        
        backend["/backend (Express API)"]
        ml_backend["/ml_backend (FastAPI)"]
        
        Frontend -- "HTTP REST (via SDK)" --> backend
        Frontend -. "HTTP REST (via SDK)" .-> ml_backend
        backend -. "Async HTTP" .-> ml_backend
    end
    database[("MongoDB Atlas")]
    backend -- "Mongoose ODM" --> database
```

---

### 10. Diagrama de Arquitectura del Sistema (Componentes)
```mermaid
flowchart TD
    subgraph Frontend ["Frontend (Navegador)"]
        Browser["«component»<br>Browser Runtime"]
        ReactApp["«component»<br>React Application"]
        SDKAdapter["«component»<br>SDK Adapter<br>@sistema-balance/sdk"]
        Browser --> ReactApp
        ReactApp --> SDKAdapter
    end

    subgraph Backend ["Backend API (Node.js)"]
        Router["«component»<br>Router / Routes"]
        AuthMiddleware["«component»<br>auth.middleware.js"]
        
        UsuariosCtrl["«component»<br>usuarios.controller.js"]
        MovimientosCtrl["«component»<br>movimientos.controller.js"]
        CierresCtrl["«component»<br>cierres.controller.js"]
        
        UsuariosSvc["«component»<br>usuarios.service.js"]
        MovimientosSvc["«component»<br>movimientos.service.js"]
        CierresSvc["«component»<br>cierres.service.js"]
        
        MongooseModels["«component»<br>Mongoose Models<br>(Usuario, Movimiento, Cierre, Log)"]
        
        Router --> AuthMiddleware
        AuthMiddleware --> UsuariosCtrl
        AuthMiddleware --> MovimientosCtrl
        AuthMiddleware --> CierresCtrl
        
        UsuariosCtrl --> UsuariosSvc
        MovimientosCtrl --> MovimientosSvc
        CierresCtrl --> CierresSvc
        
        UsuariosSvc --> MongooseModels
        MovimientosSvc --> MongooseModels
        CierresSvc --> MongooseModels
    end

    subgraph ML_Service ["Servicio de Machine Learning (Python)"]
        FastAPIRouter["«component»<br>FastAPI Router<br>main.py"]
        TesseractOCR["«component»<br>Tesseract OCR Engine"]
        NaiveBayes["«component»<br>NaiveBayes Classifier<br>modelo_clasificador.pkl"]
        
        FastAPIRouter --> TesseractOCR
        FastAPIRouter --> NaiveBayes
    end

    subgraph Database ["Capa de Datos"]
        CollUsuarios[("«collection»<br>usuarios")]
        CollMovimientos[("«collection»<br>movimientos")]
        CollCierres[("«collection»<br>cierres")]
        CollLogs[("«collection»<br>logs")]
    end

    %% Interfaces y Comunicación
    SDKAdapter -- "POST /api/usuarios/login" --> Router
    SDKAdapter -- "GET /api/movimientos" --> Router
    SDKAdapter -- "POST /api/cierres/mensual" --> Router
    SDKAdapter -- "POST /analyze-receipt" --> FastAPIRouter
    
    MovimientosSvc -. "POST /retrain<br>(fire-and-forget)" .-> FastAPIRouter
    
    MongooseModels --> CollUsuarios
    MongooseModels --> CollMovimientos
    MongooseModels --> CollCierres
    MongooseModels --> CollLogs
```

---

### 11. Actividad 1: OCR y categorización ML
```mermaid
sequenceDiagram
    participant U as Usuario
    participant UI as frontend/src/pages/MovimientoFormPage.jsx
    participant SDK as sdk/src/modules/ml.js
    participant IA as ml_backend/main.py
    participant ML as ml_backend/modelo_clasificador.pkl

    U->>UI: Sube imagen del comprobante
    UI->>SDK: analyzeReceipt(imageFile)
    SDK->>IA: POST /analyze-receipt
    IA->>ML: predict(extracted_text)
    ML-->>IA: return category
    IA-->>SDK: JSON { monto, categoria_sugerida }
    SDK-->>UI: Retorna datos
    UI-->>U: Autocompleta formulario
```

---

### 12. Actividad 2: Flujo de Silent Training
```mermaid
sequenceDiagram
    participant API as backend/services/movimientos.service.js
    participant DB as MongoDB (movimientos)
    participant IA as ml_backend/main.py
    participant ML as ml_backend/modelo_clasificador.pkl

    API->>DB: insert(movimiento)
    
    Note over API, IA: Fire-and-forget
    API->>IA: POST /retrain { texto, categoria_real }
    IA->>ML: partial_fit()
    ML-->>IA: Sobreescribe .pkl en disco
    IA-->>API: HTTP 202 Accepted
```

---

### 13. Diagrama de Despliegue
```mermaid
flowchart TD
    subgraph Client ["Dispositivo Cliente"]
        Browser["Navegador Web (Ejecuta Frontend + SDK)"]
    end

    subgraph Vercel ["Vercel (Edge Network)"]
        CDN["CDN Global (Hosting Archivos Estáticos React)"]
    end

    subgraph Render ["Render PaaS"]
        direction TB
        NodeSrv["Node.js Web Service (Backend)"]
        PythonSrv["Python Web Service (ML Backend)"]
        NodeSrv -. "Llamada interna asíncrona" .-> PythonSrv
    end

    subgraph MongoCloud ["MongoDB Cloud"]
        Cluster[("Atlas Cluster M0")]
    end

    Browser -- "Descarga Assets HTTPS" --> CDN
    Browser -- "API Requests HTTPS" --> NodeSrv
    Browser -- "OCR Requests HTTPS" --> PythonSrv
    NodeSrv -- "Conexión MongoDB Wire Protocol" --> Cluster
```
