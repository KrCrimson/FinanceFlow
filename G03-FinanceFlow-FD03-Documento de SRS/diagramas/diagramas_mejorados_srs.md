# Diagramas Mejorados SRS

Este archivo contiene 35 diagramas en Mermaid, alineados con la cantidad de imagenes originales ubicadas en la carpeta principal del SRS.

## 01. Visión general de FinanceFlow
```mermaid
flowchart TD
    A[Usuario no registrado] --> B[Registro]
    B --> C[Usuario autenticado]
    C --> D[Dashboard]
    C --> E[Movimientos]
    C --> F[Reportes]
    C --> G[Perfil]
    C --> H[Logout]
    E --> I[OCR / IA]
    I --> E
    F --> J[Analisis financiero]
    D --> J
```

## 02. Proceso actual de finanzas personales
```mermaid
flowchart TD
    A[Notas manuales / Excel] --> B[Datos dispersos]
    B --> C[Errores de captura]
    C --> D[Falta de analisis]
    D --> E[Sin alertas]
    E --> F[Decisiones tardias]
```

## 03. Proceso propuesto con FinanceFlow
```mermaid
flowchart TD
    A[Usuario] --> B[Registro seguro]
    B --> C[Sesion JWT]
    C --> D[Registro de movimientos]
    D --> E[Dashboard en tiempo real]
    E --> F[Reportes y filtros]
    D --> G[IA OCR]
    G --> D
```

## 04. Flujo de autenticacion
```mermaid
flowchart TD
    A[LoginPage] --> B[Validacion cliente]
    B --> C[authService]
    C --> D[Backend Express]
    D --> E[usuarios.service]
    E --> F[(MongoDB)]
    E --> G[JWT]
    G --> H[Dashboard]
```

## 05. Flujo de registro de usuario
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as RegisterPage
    participant S as authService
    participant B as usuarios.controller
    participant SV as usuarios.service
    participant DB as MongoDB
    U->>UI: Completa formulario
    UI->>S: register(datos)
    S->>B: POST /api/auth/register
    B->>SV: validar y registrar
    SV->>DB: buscar email unico
    SV->>DB: guardar usuario
    DB-->>SV: ok
    SV-->>B: usuario creado
    B-->>S: 201 Created
    S-->>UI: exito
```

## 06. Flujo de inicio de sesion
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as LoginPage
    participant S as authService
    participant B as usuarios.controller
    participant SV as usuarios.service
    participant DB as MongoDB
    U->>UI: Envía email y password
    UI->>S: login(datos)
    S->>B: POST /api/auth/login
    B->>SV: autenticar
    SV->>DB: buscar usuario
    DB-->>SV: documento
    SV-->>B: JWT
    B-->>S: 200 OK
    S-->>UI: guardar sesion
```

## 07. Recuperacion de contraseña
```mermaid
flowchart TD
    A[Login] --> B[Olvide mi contrasena]
    B --> C[Solicitud de correo]
    C --> D[Validar usuario]
    D --> E[Crear token temporal]
    E --> F[Enviar enlace]
    F --> G[Usuario restablece acceso]
```

## 08. Restablecimiento de contraseña
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as ResetPage
    participant S as authService
    participant B as usuarios.controller
    participant SV as usuarios.service
    participant DB as MongoDB
    U->>UI: Ingresa nueva contrasena
    UI->>S: resetPassword(token, pass)
    S->>B: POST /api/auth/reset
    B->>SV: validar token
    SV->>DB: actualizar hash
    DB-->>SV: ok
    SV-->>B: contrasena actualizada
    B-->>S: 200 OK
    S-->>UI: volver a login
```

## 09. Registro manual de movimiento
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as MovimientoFormPage
    participant S as movimientosService
    participant B as movimientos.controller
    participant SV as movimientos.service
    participant DB as MongoDB
    U->>UI: Ingresa monto y categoria
    UI->>S: crearMovimiento(datos)
    S->>B: POST /api/movimientos
    B->>SV: validar datos
    SV->>DB: guardar movimiento
    DB-->>SV: ok
    SV-->>B: movimiento creado
    B-->>S: 201 Created
    S-->>UI: actualizar dashboard
```

## 10. OCR para comprobantes
```mermaid
flowchart TD
    A[Usuario] --> B[Sube imagen]
    B --> C[Frontend]
    C --> D[Microservicio Python]
    D --> E[Tesseract OCR]
    E --> F[Extraer texto]
    F --> G[Prediccion ML]
    G --> H[Autocompletar formulario]
```

## 11. Visualizacion del dashboard
```mermaid
flowchart TD
    A[Usuario autenticado] --> B[DashboardPage]
    B --> C[Consultar movimientos]
    C --> D[Calcular saldo]
    C --> E[Agrupar por categoria]
    D --> F[Graficos]
    E --> F
    F --> G[Indicadores financieros]
```

## 12. Edicion de movimiento
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as ReportesPage
    participant S as movimientosService
    participant B as movimientos.controller
    participant SV as movimientos.service
    participant DB as MongoDB
    U->>UI: Selecciona editar
    UI->>S: updateMovimiento(id)
    S->>B: PUT /api/movimientos/:id
    B->>SV: validar propiedad
    SV->>DB: actualizar documento
    DB-->>SV: ok
    SV-->>B: actualizado
    B-->>S: 200 OK
```

## 13. Inactivacion de movimiento
```mermaid
flowchart TD
    A[Usuario] --> B[Confirmar eliminacion]
    B --> C[Validar ownership]
    C --> D[Cambiar estado a inactivo]
    D --> E[Recalcular balance]
    E --> F[Actualizar vista]
```

## 14. Filtro de reportes
```mermaid
flowchart TD
    A[ReportesPage] --> B[Seleccionar rango]
    B --> C[Enviar filtros]
    C --> D[Consultar movimientos]
    D --> E[Filtrar por fecha y categoria]
    E --> F[Renderizar tabla y graficos]
```

## 15. Reentrenamiento silencioso
```mermaid
sequenceDiagram
    participant BE as Backend
    participant AI as Microservicio Python
    participant ML as Modelo Naive Bayes
    BE->>AI: /retrain
    AI->>ML: partial_fit(datos)
    ML-->>AI: modelo actualizado
    AI-->>BE: ok
```

## 16. Cierre de sesion
```mermaid
flowchart TD
    A[Usuario] --> B[Cerrar sesion]
    B --> C[Eliminar token local]
    C --> D[Limpiar contexto]
    D --> E[Redirigir a login]
```

## 17. Perfil de usuario
```mermaid
flowchart TD
    A[Usuario] --> B[Perfil]
    B --> C[Consultar datos]
    C --> D[Editar nombre o avatar]
    D --> E[Guardar cambios]
    E --> F[Refrescar sesion]
```

## 18. Auditoria y logs
```mermaid
flowchart TD
    A[Administrador] --> B[GET /api/logs]
    B --> C[logs.controller]
    C --> D[logs.service]
    D --> E[(Coleccion logs)]
    E --> F[Visualizar trazas]
```

## 19. Modelo de usuario
```mermaid
classDiagram
    class Usuario {
      +ObjectId _id
      +String nombre
      +String email
      +String passwordHash
      +String estado
      +Date creadoEn
      +Date actualizadoEn
    }
```

## 20. Modelo de movimiento
```mermaid
classDiagram
    class Movimiento {
      +ObjectId _id
      +ObjectId userId
      +Number monto
      +String descripcion
      +String categoria
      +Date fecha
      +String estado
    }
    Usuario "1" --> "many" Movimiento
```

## 21. Modelo de log
```mermaid
classDiagram
    class Log {
      +ObjectId _id
      +String nivel
      +String mensaje
      +String stack
      +String endpoint
      +String metodo
      +Number statusCode
    }
```

## 22. Relacion de entidades
```mermaid
flowchart LR
    U[(Usuario)] --> M[(Movimiento)]
    U --> L[(Log)]
    M --> D[Dashboard]
    M --> R[Reportes]
    L --> A[Auditoria]
```

## 23. Validacion de formulario
```mermaid
flowchart TD
    A[Usuario escribe] --> B[React Hook Form]
    B --> C[Zod schema]
    C -->|Valido| D[Enviar solicitud]
    C -->|Invalido| E[Mostrar error inline]
```

## 24. Secuencia de registro con validacion
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as RegisterPage
    participant SDK as authService
    participant API as Backend
    U->>UI: Rellena datos
    UI->>SDK: submit
    SDK->>API: register
    API-->>SDK: response
    SDK-->>UI: mostrar estado
```

## 25. Secuencia de dashboard en tiempo real
```mermaid
sequenceDiagram
    participant UI as DashboardPage
    participant S as movimientosService
    participant API as Backend
    participant DB as MongoDB
    UI->>S: cargarResumen()
    S->>API: GET /dashboard
    API->>DB: consultar datos
    DB-->>API: resumen
    API-->>S: datos
    S-->>UI: renderizar graficos
```

## 26. Secuencia de OCR y autocompletado
```mermaid
sequenceDiagram
    participant UI as MovimientoFormPage
    participant AI as Microservicio Python
    participant ML as Modelo ML
    UI->>AI: enviar imagen
    AI->>ML: extraer categoria
    ML-->>AI: categoria sugerida
    AI-->>UI: autocompletar campos
```

## 27. Secuencia de eliminacion logica
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as ReportesPage
    participant API as Backend
    participant DB as MongoDB
    U->>UI: confirma eliminar
    UI->>API: PATCH /movimientos/:id
    API->>DB: estado=inactivo
    DB-->>API: ok
    API-->>UI: actualizar lista
```

## 28. Secuencia de filtros y reportes
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as ReportesPage
    participant API as Backend
    participant DB as MongoDB
    U->>UI: aplica filtros
    UI->>API: GET /reportes?filtro
    API->>DB: consultar datos filtrados
    DB-->>API: resultados
    API-->>UI: graficos y tabla
```

## 29. Secuencia de cambio de contrasena
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as RecoveryPage
    participant API as Backend
    participant DB as MongoDB
    U->>UI: ingresa nueva clave
    UI->>API: POST /reset-password
    API->>DB: actualizar hash
    DB-->>API: ok
    API-->>UI: acceso renovado
```

## 30. Secuencia de cierre de sesion
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as Navbar
    participant SDK as authService
    participant Router as React Router
    U->>UI: clic en cerrar sesion
    UI->>SDK: logout()
    SDK-->>UI: token eliminado
    UI->>Router: navigate('/login')
```

## 31. Secuencia de perfil
```mermaid
sequenceDiagram
    actor U as Usuario
    participant UI as ProfilePage
    participant API as Backend
    participant DB as MongoDB
    U->>UI: cambia nombre o avatar
    UI->>API: PUT /profile
    API->>DB: actualizar usuario
    DB-->>API: ok
    API-->>UI: perfil actualizado
```

## 32. Secuencia de logs
```mermaid
sequenceDiagram
    actor A as Administrador
    participant UI as LogsPage
    participant API as Backend
    participant DB as MongoDB
    A->>UI: abrir auditoria
    UI->>API: GET /logs
    API->>DB: obtener eventos
    DB-->>API: logs
    API-->>UI: mostrar trazas
```

## 33. Ciclo de vida de un movimiento
```mermaid
stateDiagram-v2
    [*] --> Borrador
    Borrador --> Activo: guardar
    Activo --> Inactivo: eliminar logico
    Inactivo --> [*]
```

## 34. Despliegue logico del sistema
```mermaid
flowchart LR
    subgraph Frontend
        A[React SPA]
    end
    subgraph Backend
        B[Express API]
        C[Servicios]
    end
    subgraph Datos
        D[(MongoDB Atlas)]
    end
    subgraph IA
        E[FastAPI OCR]
    end
    A --> B
    B --> C
    C --> D
    A --> E
```

## 35. Resumen de calidad del sistema
```mermaid
mindmap
  root((FinanceFlow))
    Seguridad
      JWT
      bcrypt
      Helmet
    Usabilidad
      Formularios validos
      Interfaz responsiva
    Rendimiento
      172ms promedio
      100 req concurrentes
    Mantenibilidad
      SDK adaptador
      66 tests
```
