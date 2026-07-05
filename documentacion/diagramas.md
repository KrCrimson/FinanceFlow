# Diagramas de Casos de Uso (Mermaid - Estilo Personalizado)

A continuación se presentan los diagramas de caso de uso con el diseño visual solicitado (Subgrafo de Actores, Subgrafo del Sistema, nodos estilo píldora y uso de iconos/emojis).

### Diagrama General del Sistema

```mermaid
flowchart LR
    %% Definición de estilos
    classDef actorInvitado fill:#eff6ff,stroke:#3b82f6,stroke-width:1px,color:#1e3a8a
    classDef actorAutenticado fill:#faefff,stroke:#c084fc,stroke-width:1px,color:#4c1d95
    classDef useCaseNode fill:#ffffff,stroke:#64748b,stroke-width:1px,color:#334155

    subgraph Actores [👤 Actores]
        direction TB
        U_Inv["👤 Usuario<br/>Invitado"]:::actorInvitado
        U_Aut["👤 Usuario<br/>Autenticado"]:::actorAutenticado
    end
    
    subgraph Sistema [💰 Sistema FinanceFlow]
        direction TB
        
        %% Use Cases Invitado
        CU04(["CU-04: Restablecer Contraseña"]):::useCaseNode
        CU05(["CU-05: Consultar Resumen y Balance"]):::useCaseNode
        CU09(["CU-09: Visualizar Reportes y Gráficos"]):::useCaseNode
        CU07(["CU-07: Cargar Comprobante por Imagen"]):::useCaseNode
        CU11(["CU-11: Planificar Ahorro para Compra"]):::useCaseNode
        CU01(["CU-01: Registrar Cuenta"]):::useCaseNode
        CU03(["CU-03: Solicitar Recuperación"]):::useCaseNode
        CU13(["CU-13: Cerrar Sesión"]):::useCaseNode
        CU10(["CU-10: Filtrar Historial Completo"]):::useCaseNode
        CU12(["CU-12: Gestionar Información de Perfil"]):::useCaseNode
        CU08(["CU-08: Desactivar Movimientos"]):::useCaseNode
        CU02(["CU-02: Iniciar Sesión"]):::useCaseNode
        CU06(["CU-06: Registrar Movimiento Manual"]):::useCaseNode
        
        %% Use Cases Adicionales
        CU14(["CU-14: Realizar Arqueo Diario"]):::useCaseNode
        CU15(["CU-15: Realizar Cierre Mensual"]):::useCaseNode
        CU16(["CU-16: Reabrir Periodo Cerrado"]):::useCaseNode
        CU17(["CU-17: Destacar Ingreso Fijo"]):::useCaseNode
        CU18(["CU-18: Eliminar Cuenta"]):::useCaseNode
    end

    %% Relaciones Usuario Invitado
    U_Inv --> CU04
    U_Inv --> CU01
    U_Inv --> CU03
    U_Inv --> CU02

    %% Relaciones Usuario Autenticado
    U_Aut --> CU05
    U_Aut --> CU09
    U_Aut --> CU07
    U_Aut --> CU11
    U_Aut --> CU13
    U_Aut --> CU10
    U_Aut --> CU12
    U_Aut --> CU08
    U_Aut --> CU06
    U_Aut --> CU14
    U_Aut --> CU15
    U_Aut --> CU16
    U_Aut --> CU17
    U_Aut --> CU18

    %% Relaciones Internas (Extends/Includes)
    CU07 -.->|"<< extend >>"| CU06

    %% Estilos de los Subgrafos
    style Actores fill:transparent,stroke:none,stroke-width:0px,color:#333333
    style Sistema fill:#f8fafc,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,stroke-dasharray: 0
```

---


### CU-14: Realizar Arqueo Diario

```mermaid
flowchart LR
    %% Estilos
    classDef actorNode fill:#faefff,stroke:#c084fc,stroke-width:1px,color:#4c1d95
    classDef useCaseNode fill:#ffffff,stroke:#64748b,stroke-width:1px,color:#334155

    subgraph Actores [👤 Actores]
        U[👤 Usuario Autenticado <br/>(Cliente)]:::actorNode
    end
    
    subgraph Sistema [💰 Sistema FinanceFlow]
        direction TB
        CU14([CU-14: Realizar Arqueo Diario]):::useCaseNode
        INC1([Ingresar Dinero Físico]):::useCaseNode
        EXT1([Mostrar Alerta de Campo Vacío]):::useCaseNode
        EXT2([Manejar Falla de Conexión]):::useCaseNode
    end

    U --> CU14
    CU14 -.->|"<< include >>"| INC1
    EXT1 -.->|"<< extend >>"| CU14
    EXT2 -.->|"<< extend >>"| CU14

    style Actores fill:transparent,stroke:#c084fc,stroke-width:2px,color:#4c1d95,stroke-dasharray: 0
    style Sistema fill:transparent,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,stroke-dasharray: 0
```

---

### CU-15: Realizar Cierre Mensual

```mermaid
flowchart LR
    %% Estilos
    classDef actorNode fill:#faefff,stroke:#c084fc,stroke-width:1px,color:#4c1d95
    classDef useCaseNode fill:#ffffff,stroke:#64748b,stroke-width:1px,color:#334155

    subgraph Actores [👤 Actores]
        U[👤 Usuario Autenticado <br/>(Cliente)]:::actorNode
    end
    
    subgraph Sistema [💰 Sistema FinanceFlow]
        direction TB
        CU15([CU-15: Realizar Cierre Mensual]):::useCaseNode
        INC1([Autenticar mediante Contraseña]):::useCaseNode
        EXT1([Rechazar Contraseña Incorrecta]):::useCaseNode
    end

    U --> CU15
    CU15 -.->|"<< include >>"| INC1
    EXT1 -.->|"<< extend >>"| CU15

    style Actores fill:transparent,stroke:#c084fc,stroke-width:2px,color:#4c1d95,stroke-dasharray: 0
    style Sistema fill:transparent,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,stroke-dasharray: 0
```

---

### CU-16: Reabrir Periodo Cerrado

```mermaid
flowchart LR
    %% Estilos
    classDef actorNode fill:#faefff,stroke:#c084fc,stroke-width:1px,color:#4c1d95
    classDef useCaseNode fill:#ffffff,stroke:#64748b,stroke-width:1px,color:#334155

    subgraph Actores [👤 Actores]
        U[👤 Usuario Autenticado <br/>(Cliente)]:::actorNode
    end
    
    subgraph Sistema [💰 Sistema FinanceFlow]
        direction TB
        CU16([CU-16: Reabrir Periodo Cerrado]):::useCaseNode
        INC1([Autenticar mediante Contraseña]):::useCaseNode
        EXT1([Cancelar Operación de Seguridad]):::useCaseNode
    end

    U --> CU16
    CU16 -.->|"<< include >>"| INC1
    EXT1 -.->|"<< extend >>"| CU16

    style Actores fill:transparent,stroke:#c084fc,stroke-width:2px,color:#4c1d95,stroke-dasharray: 0
    style Sistema fill:transparent,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,stroke-dasharray: 0
```

---

### CU-17: Destacar Ingreso Fijo

```mermaid
flowchart LR
    %% Estilos
    classDef actorNode fill:#faefff,stroke:#c084fc,stroke-width:1px,color:#4c1d95
    classDef useCaseNode fill:#ffffff,stroke:#64748b,stroke-width:1px,color:#334155

    subgraph Actores [👤 Actores]
        U["👤 Usuario Autenticado <br/>(Cliente)"]:::actorNode
    end
    
    subgraph Sistema [💰 Sistema FinanceFlow]
        direction TB
        CU17([CU-17: Destacar Ingreso Fijo]):::useCaseNode
        INC1([Actualizar Panel Lateral]):::useCaseNode
        EXT1([Revocar Constancia de Ingreso]):::useCaseNode
    end

    U --> CU17
    CU17 -.->|"<< include >>"| INC1
    EXT1 -.->|"<< extend >>"| CU17

    style Actores fill:transparent,stroke:#c084fc,stroke-width:2px,color:#4c1d95,stroke-dasharray: 0
    style Sistema fill:transparent,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,stroke-dasharray: 0
```

---

### CU-18: Eliminar Cuenta

```mermaid
flowchart LR
    %% Estilos
    classDef actorNode fill:#faefff,stroke:#c084fc,stroke-width:1px,color:#4c1d95
    classDef useCaseNode fill:#ffffff,stroke:#64748b,stroke-width:1px,color:#334155

    subgraph Actores [👤 Actores]
        U["👤 Usuario Autenticado <br/>(Cliente)"]:::actorNode
    end
    
    subgraph Sistema [💰 Sistema FinanceFlow]
        direction TB
        CU18([CU-18: Eliminar Cuenta]):::useCaseNode
        INC1([Confirmar Acción Irreversible]):::useCaseNode
        INC2([Ejecutar Borrado Lógico]):::useCaseNode
        EXT1([Bloquear Intento de Acceso Futuro]):::useCaseNode
    end

    U --> CU18
    CU18 -.->|"<< include >>"| INC1
    CU18 -.->|"<< include >>"| INC2
    EXT1 -.->|"<< extend >>"| CU18

    style Actores fill:transparent,stroke:#c084fc,stroke-width:2px,color:#4c1d95,stroke-dasharray: 0
    style Sistema fill:transparent,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,stroke-dasharray: 0
```
