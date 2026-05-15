# Guía Maestra de Diagramas Corregidos - FinanceFlow

Este documento presenta la versión definitiva y corregida de los diagramas técnicos para el SRS y SAD de FinanceFlow. Cada sección incluye el código Mermaid optimizado, una descripción funcional y la lógica técnica aplicada para su construcción.

---

## S1 — ORGANIGRAMA ORGANIZACIONAL
**Descripción:** Representa la estructura de mando y ejecución de FinanceFlow Solutions S.A.C.
**Lógica aplicada:** Se eliminó el uso de subgraphs aislados que causaban errores de renderizado. Se utilizó una nota técnica conectada mediante una línea punteada (`-.-`) al nodo de Gerencia General para indicar que, aunque existen roles definidos, la ejecución recayó en un único desarrollador full-stack, manteniendo la integridad visual del flujo.

```mermaid
graph TD
    GG[Gerencia General] --> DS[Área de Desarrollo de Software]
    GG --> DX[Área de Diseño UX/UI]
    DS --> BE[Backend / Node.js]
    DS --> FE[Frontend / React]
    DS --> SDK[SDK / Pruebas / Adapters]
    DX --> UI[Interfaz de Usuario / Vanilla CSS]
    BE --> DB[Base de Datos / MongoDB]
    DEV[Un desarrollador asumió todos los roles] -.- GG
```

---

## S5 — DIAGRAMA DE CASOS DE USO (ESTÁNDAR UML)
**Descripción:** Mapea las funcionalidades del sistema (CU) frente a los actores externos.
**Lógica aplicada:** Se aplicó estrictamente la notación UML en Mermaid: actores en forma de estadio (`([ ])`) y casos de uso en elipses de doble paréntesis (`(( ))`). Se definió un límite de sistema (`subgraph Sistema`) para separar los procesos internos del sistema de los agentes externos, mejorando la semántica visual.

```mermaid
graph TD
    subgraph Sistema["Sistema FinanceFlow"]
        CU01((CU-01: Registrar Usuario))
        CU02((CU-02: Iniciar Sesión))
        CU03((CU-03: Registrar Mov. Manual))
        CU04((CU-04: Escanear Recibo))
        CU05((CU-05: Ver Dashboard))
        CU06((CU-06: Modificar Movimiento))
        CU07((CU-07: Inhabilitar Movimiento))
        CU08((CU-08: Filtrar Reportes))
        CU09((CU-09: Cerrar Sesión))
        CU10((CU-10: Reentrenar IA))
        CU11((CU-11: Recuperar Contraseña))
        CU13((CU-13: Consultar Logs))
    end
    UN([Usuario No Autenticado]) --> CU01
    UN --> CU02
    UN --> CU11
    UA([Usuario Autenticado]) --> CU03
    UA --> CU04
    UA --> CU05
    UA --> CU06
    UA --> CU07
    UA --> CU08
    UA --> CU09
    ADM([Administrador]) --> CU13
    MIA([Motor IA Python]) -.-> CU04
    MIA -.-> CU10
```

---

## S6 — SECUENCIA DE AUTENTICACIÓN (LOGIN)
**Descripción:** Detalla el flujo de mensajes y validaciones desde la UI hasta la base de datos.
**Lógica aplicada:** Se expandió el bloque `alt` (alternativa) para modelar con precisión las tres respuestas posibles del backend: error por usuario inexistente (404), error por contraseña incorrecta (401) y éxito con generación de JWT. Esto refleja la lógica real implementada en `usuarios.service.js`.

```mermaid
sequenceDiagram
    autonumber
    participant U as Usuario
    participant LP as LoginPage (React)
    participant AS as authService (ES6)
    participant SDK as SDK.auth
    participant HC as HttpClient (axios)
    participant BE as Backend Router
    participant UC as usuarios.controller
    participant US as usuarios.service
    participant DB as MongoDB
    U->>LP: Ingresa credenciales + clic Ingresar
    LP->>AS: login(email, pass)
    AS->>SDK: login(email, pass)
    SDK->>HC: post('/api/usuarios/login', data)
    HC->>BE: POST /api/usuarios/login
    BE->>UC: call login()
    UC->>US: validate(email, pass)
    US->>DB: findOne({ email })
    DB-->>US: retorna usuario (o null)
    alt Usuario no encontrado en DB
        US-->>UC: null → Error 404
        UC-->>HC: HTTP 404 Usuario no encontrado
    else Contraseña incorrecta
        US-->>UC: bcrypt false → Error 401
        UC-->>HC: HTTP 401 Credenciales inválidas
    else Credenciales válidas
        US->>US: jwt.sign()
        UC-->>HC: HTTP 200 token+user
        HC-->>SDK: retorna datos
        SDK-->>AS: retorna datos
        AS-->>LP: Login Exitoso
        LP->>U: Redirige al Dashboard
    end
```

---

## S8 — DIAGRAMA DE CLASES (ESTRUCTURA DEL SDK)
**Descripción:** Define las entidades de datos y los módulos de la capa SDK.
**Lógica aplicada:** Se incluyeron declaraciones explícitas para `AuthModule`, `MovimientosModule` y `ReportesModule` con sus métodos principales. Esto permite que Mermaid renderice correctamente la relación de composición (`*--`), asegurando que todos los tipos referenciados estén definidos en el diagrama.

```mermaid
classDiagram
    class AuthModule {
        +login()
        +register()
        +resetPassword()
    }
    class MovimientosModule {
        +create()
        +list()
        +update()
        +deactivate()
    }
    class ReportesModule {
        +getByPeriod()
        +getByCategory()
    }
    class Usuario {
        +ObjectId _id
        +String nombre
        +String email
        +String password
        +String resetPasswordToken
        +save()
        +comparePassword()
    }
    class Movimiento {
        +ObjectId _id
        +ObjectId userId
        +Enum tipo
        +Number monto
        +String categoria
        +Date fecha
        +Enum estado
    }
    class Log {
        +String nivel
        +String mensaje
        +String endpoint
        +Number statusCode
    }
    class FinanceFlowSDK {
        +HttpClient httpClient
        +AuthModule auth
        +MovimientosModule movimientos
        +ReportesModule reportes
        +setToken(token)
    }
    Usuario "1" -- "*" Movimiento : "posee"
    Usuario "1" -- "*" Log : "genera"
    FinanceFlowSDK *-- AuthModule
    FinanceFlowSDK *-- MovimientosModule
    FinanceFlowSDK *-- ReportesModule
```

---

## S10 — SECUENCIA DE PROCESAMIENTO OCR
**Descripción:** Flujo de extracción de datos mediante IA y reentrenamiento asíncrono.
**Lógica aplicada:** Se corrigió la sintaxis del bloque `par` (paralelo) para modelar correctamente el "Silent Training". En esta arquitectura, el sistema guarda el movimiento en el hilo principal mientras dispara el reentrenamiento del modelo en segundo plano, optimizando el tiempo de respuesta al usuario.

```mermaid
sequenceDiagram
    Usuario->>OCRPage: Sube imagen (voucher Yape/Plin)
    OCRPage->>SDK: POST /analyze-receipt (Multipart)
    SDK->>FastAPI: Forward to Python Service
    FastAPI->>Tesseract: Extraer Texto Raw
    FastAPI->>FastAPI: Regex (monto/fecha/comercio)
    FastAPI->>NaiveBayes: Predecir Categoría
    NaiveBayes-->>FastAPI: retorna 'Comida'
    FastAPI-->>OCRPage: retorna JSON sugerido
    OCRPage-->>Usuario: Muestra formulario lleno
    Usuario->>OCRPage: Confirma (Guardar)
    par Guardar movimiento
        OCRPage->>Backend: POST /api/movimientos
        Backend-->>OCRPage: HTTP 201 Created
    and Silent Training async
        OCRPage->>FastAPI: POST /retrain metadata
        FastAPI->>NaiveBayes: partial_fit()
    end
```

---

## S11 — SECUENCIA DEL DASHBOARD Y ALERTAS
**Descripción:** Proceso de carga de datos financieros y validación de umbrales de gasto.
**Lógica aplicada:** Se integró la lógica de negocio del "Umbral de Alerta". Tras calcular el balance, el sistema evalúa si el gasto supera el límite configurado por el usuario, disparando un evento visual específico en el dashboard, cumpliendo así con los requerimientos de usabilidad del SRS.

```mermaid
sequenceDiagram
    autonumber
    Usuario->>Dashboard: Carga página
    Dashboard->>useBalance: Hook init
    useBalance->>SDK: GET /movimientos?estado=activo
    SDK-->>useBalance: retorna Array de movimientos
    useBalance->>useBalance: calcular balance total
    alt Balance supera umbral configurado
        useBalance->>Dashboard: triggerAlerta(categoria, monto)
        Dashboard->>Dashboard: renderizar AlertaGasto
    else Dentro del límite
        useBalance->>Dashboard: update balance silencioso
    end
    Dashboard->>Recharts: Inyecta datos gráficos
```

---

## S13 — DIAGRAMA DE OBJETOS (ESTADO EN RUNTIME)
**Descripción:** Representa una instantánea de datos concretos cargados en el sistema.
**Lógica aplicada:** Se utilizó la notación de instancia UML (`nombre:Clase`) mediante etiquetas personalizadas en las clases de Mermaid. Esto permite visualizar el estado real de la aplicación con IDs, montos y estados específicos, transformando un diagrama de clases genérico en uno de objetos de ejecución.

```mermaid
classDiagram
    class juan_perez["juan_perez : Usuario"] {
        _id: "6643de...12"
        nombre: "Juan Pérez"
        email: "juan@test.com"
    }
    class mov_egreso_45["mov_egreso_45 : Movimiento"] {
        _id: "6643de...f1"
        tipo: "egreso"
        monto: 45.50
        categoria: "Comida"
        estado: "activo"
    }
    class mov_ingreso_3000["mov_ingreso_3000 : Movimiento"] {
        _id: "6643de...f2"
        tipo: "ingreso"
        monto: 3000.00
        categoria: "Sueldo"
        estado: "activo"
    }
    class mov_inactivo["mov_inactivo : Movimiento"] {
        _id: "6643de...f3"
        tipo: "egreso"
        monto: 15.00
        categoria: "Transporte"
        estado: "inactivo"
    }
    class log_jwt_error["log_jwt_error : Log"] {
        nivel: "error"
        mensaje: "JWT Expired"
        statusCode: 401
    }
    juan_perez --> mov_egreso_45
    juan_perez --> mov_ingreso_3000
    juan_perez --> mov_inactivo
    juan_perez --> log_jwt_error
```

---

## S14 — DIAGRAMA ENTIDAD-RELACIÓN (ERD)
**Descripción:** Esquema físico de la base de datos MongoDB Atlas.
**Lógica aplicada:** Se sincronizaron los campos con el modelo real de Mongoose, añadiendo los tokens de recuperación de contraseña. Se corrigió la cardinalidad de la relación con `LOGS` a opcional (`|o--o{`), reconociendo que el sistema genera logs técnicos que no siempre están vinculados a un usuario autenticado.

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string nombre
        string email UK
        string password
        string resetPasswordToken "nullable"
        date resetPasswordExpire "nullable"
        date createdAt
    }
    MOVIMIENTOS {
        ObjectId _id PK
        ObjectId userId FK
        string tipo
        number monto
        string categoria
        string estado
        date fecha
    }
    LOGS {
        ObjectId _id PK
        string nivel
        string mensaje
        string endpoint
        number statusCode
        date createdAt
    }
    USERS ||--o{ MOVIMIENTOS : "registra"
    USERS |o--o{ LOGS : "genera opcionalmente"
```

---

## S15 — DIAGRAMA DE COMPONENTES
**Descripción:** Organización lógica de los artefactos de software y sus interfaces.
**Lógica aplicada:** Se encapsuló el archivo de modelo serializado (`ModelPKL`) dentro del nodo de servicio de IA. Esto clarifica que el modelo es una dependencia de datos local del microservicio de Python, evitando nodos huérfanos y mejorando la jerarquía de la vista física.

```mermaid
graph TB
    subgraph UI_Layer
        Navegador[Navegador Usuario]
        Vercel[Vercel CDN / React Bundle]
    end
    subgraph Logic_Layer
        SDK[FinanceFlow SDK JS]
        NodeJS[Render Node.js / Express]
    end
    subgraph AI_Layer
        Python[Render Python / FastAPI]
        ModelPKL[Modelo .pkl en disco]
    end
    subgraph Data_Layer
        Atlas[(MongoDB Atlas Cluster M0)]
    end
    Navegador -- "HTTPS (443)" --> Vercel
    Navegador -- "REST HTTPS (443)" --> NodeJS
    Navegador -- "REST HTTPS (443)" --> Python
    NodeJS -- "MongoDB Protocol (27017)" --> Atlas
    Python -- "File I/O lectura/escritura" --> ModelPKL
```

---

## S16 — DIAGRAMA DE ACTIVIDAD (OCR + TRAINING)
**Descripción:** Flujo de procesos desde la carga de imagen hasta la actualización del modelo.
**Lógica aplicada:** Se utilizó un nodo de bifurcación (`FORK`) y líneas punteadas (`-.->`) para modelar la asincronía. El hilo principal garantiza la respuesta al usuario, mientras que el proceso de reentrenamiento se ejecuta de forma no bloqueante, reflejando el diseño de alto rendimiento del sistema.

```mermaid
flowchart LR
    Start[Sube Imagen] --> ValidImg[Valida Formato]
    ValidImg --> ShowLoading[Muestra Spinner]
    ShowLoading --> OCR[Ejecuta Tesseract]
    OCR --> Classify[Naive Bayes Predict]
    Classify --> RecibeData[Carga Formulario]
    RecibeData --> SaveDB[Guardar Movimiento]
    SaveDB --> FORK{ }
    FORK --> |hilo principal| ResponseOK[HTTP 201 → Frontend actualiza UI]
    FORK -.-> |async silencioso| Retrain[Silent Training: POST /retrain]
    Retrain -.-> NB[NaiveBayes partial_fit]
```

---

## S17 — DIAGRAMA DE DESPLIEGUE (INFRAESTRUCTURA)
**Descripción:** Distribución física de los servicios en proveedores cloud.
**Lógica aplicada:** Se enriquecieron los nodos con metadatos técnicos (stack, dominio, rol). Esto transforma un diagrama de red simple en una hoja de ruta de despliegue real, especificando qué artefacto (SPA, API, Microservicio) corre en cada nodo y bajo qué protocolo se comunican.

```mermaid
graph TB
    subgraph Client_Device
        Browser[Chrome/Firefox/Safari]
    end
    subgraph Vercel_Cloud
        Frontend["Vercel CDN\nReact 18 SPA Bundle\nfinanceflow-frontend.vercel.app"]
    end
    subgraph Render_PaaS
        Backend["Render Node.js\nExpress API REST\nfinanceflow-backend.onrender.com"]
        ML["Render Python\nFastAPI + Tesseract + NaiveBayes\nfinanceflow-ml-service.onrender.com"]
    end
    subgraph MongoDB_Atlas
        DB[("MongoDB Atlas M0\nCluster AWS/GCP\n3 colecciones")]
    end
    Browser -- "HTTPS" --> Frontend
    Browser -- "HTTPS/TLS" --> Backend
    Browser -- "HTTPS/TLS" --> ML
    Backend -- "MongoDB Wire Protocol" --> DB
    Backend -.-> |"invoca /retrain"| ML
```
