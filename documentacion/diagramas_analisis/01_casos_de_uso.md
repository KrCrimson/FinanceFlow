# Diagrama de Casos de Uso (Fase de Análisis) — FinanceFlow

Este documento es **autoexplicativo**: describe, en lenguaje funcional y sin tecnicismos, qué puede hacer cada tipo de usuario dentro de FinanceFlow. Refleja 1:1 las funciones realmente implementadas en el sistema (no se omite ninguna), agrupadas en 22 casos de uso.

## Actores del sistema

- **Usuario Invitado**: persona sin sesión iniciada (puede registrarse, iniciar sesión o recuperar su contraseña).
- **Usuario Autenticado**: cuenta con sesión activa (plan Free o Pro). Es el actor principal del sistema.
- **Usuario Pro**: especialización del Usuario Autenticado que pagó la suscripción; desbloquea límites ampliados.
- **Administrador**: cuenta interna con rol `admin`, gestiona la plataforma completa.

---

### Diagrama General del Sistema

```mermaid
flowchart LR
    classDef actorInvitado fill:#eff6ff,stroke:#3b82f6,stroke-width:1px,color:#1e3a8a
    classDef actorAutenticado fill:#faefff,stroke:#c084fc,stroke-width:1px,color:#4c1d95
    classDef actorPro fill:#fff7ed,stroke:#f59e0b,stroke-width:1px,color:#7c2d12
    classDef actorAdmin fill:#fef2f2,stroke:#ef4444,stroke-width:1px,color:#7f1d1d
    classDef useCaseNode fill:#ffffff,stroke:#64748b,stroke-width:1px,color:#334155

    subgraph Actores [👤 Actores]
        direction TB
        U_Inv["👤 Usuario Invitado"]:::actorInvitado
        U_Aut["👤 Usuario Autenticado"]:::actorAutenticado
        U_Pro["⭐ Usuario Pro"]:::actorPro
        U_Admin["🛡️ Administrador"]:::actorAdmin
    end

    subgraph Sistema [💰 Sistema FinanceFlow]
        direction TB
        CU01(["CU-01: Registrar Cuenta"]):::useCaseNode
        CU02(["CU-02: Iniciar Sesión"]):::useCaseNode
        CU03(["CU-03: Solicitar Recuperación"]):::useCaseNode
        CU04(["CU-04: Restablecer Contraseña"]):::useCaseNode
        CU05(["CU-05: Consultar Resumen y Balance"]):::useCaseNode
        CU06(["CU-06: Registrar Movimiento Manual"]):::useCaseNode
        CU07(["CU-07: Cargar Comprobante por Imagen"]):::useCaseNode
        CU08(["CU-08: Desactivar Movimientos"]):::useCaseNode
        CU09(["CU-09: Visualizar Reportes y Gráficos"]):::useCaseNode
        CU10(["CU-10: Filtrar Historial Completo"]):::useCaseNode
        CU11(["CU-11: Planificar Ahorro para Compra"]):::useCaseNode
        CU12(["CU-12: Gestionar Información de Perfil"]):::useCaseNode
        CU13(["CU-13: Cerrar Sesión"]):::useCaseNode
        CU14(["CU-14: Realizar Arqueo Diario"]):::useCaseNode
        CU15(["CU-15: Realizar Cierre Mensual"]):::useCaseNode
        CU16(["CU-16: Reabrir Periodo Cerrado"]):::useCaseNode
        CU17(["CU-17: Destacar Ingreso Fijo"]):::useCaseNode
        CU18(["CU-18: Eliminar Cuenta"]):::useCaseNode
        CU19(["CU-19: Suscribirse al Plan Pro"]):::useCaseNode
        CU20(["CU-20: Gestionar Recordatorios de Préstamos"]):::useCaseNode
        CU21(["CU-21: Exportar Reportes en Excel/PDF"]):::useCaseNode
        CU22(["CU-22: Administrar la Plataforma"]):::useCaseNode
    end

    U_Inv --> CU01
    U_Inv --> CU02
    U_Inv --> CU03
    U_Inv --> CU04

    U_Aut --> CU05
    U_Aut --> CU06
    U_Aut --> CU07
    U_Aut --> CU08
    U_Aut --> CU09
    U_Aut --> CU10
    U_Aut --> CU11
    U_Aut --> CU12
    U_Aut --> CU13
    U_Aut --> CU14
    U_Aut --> CU15
    U_Aut --> CU16
    U_Aut --> CU17
    U_Aut --> CU18
    U_Aut --> CU19
    U_Aut --> CU20

    U_Pro --> CU21

    U_Admin --> CU22

    CU07 -.->|"<< extend >>"| CU06
    CU19 -.->|"<< extend >>"| CU21
    CU19 -.->|"<< extend >>"| CU07
    CU22 -.->|"<< include >>"| CU19

    style Actores fill:transparent,stroke:none,stroke-width:0px,color:#333333
    style Sistema fill:#f8fafc,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,stroke-dasharray: 0
```

---

## Descripción de cada caso de uso

| ID | Nombre | Actor | Resumen en lenguaje llano |
|---|---|---|---|
| CU-01 | Registrar Cuenta | Invitado | Crear una cuenta nueva con nombre, correo y contraseña. |
| CU-02 | Iniciar Sesión | Invitado | Ingresar con correo y contraseña para acceder a la app. |
| CU-03 | Solicitar Recuperación | Invitado | Pedir un enlace para restablecer la contraseña olvidada. |
| CU-04 | Restablecer Contraseña | Invitado | Definir una nueva contraseña usando el enlace recibido. |
| CU-05 | Consultar Resumen y Balance | Usuario | Ver en el Dashboard el total de ingresos, egresos y balance disponible. |
| CU-06 | Registrar Movimiento Manual | Usuario | Anotar a mano un ingreso o un egreso (monto, categoría, fecha). |
| CU-07 | Cargar Comprobante por Imagen | Usuario | Subir una foto de una boleta/Yape y que el sistema complete los datos solo. |
| CU-08 | Desactivar Movimientos | Usuario | Borrar (lógicamente) un movimiento que se registró por error. |
| CU-09 | Visualizar Reportes y Gráficos | Usuario | Ver gráficos de gastos por categoría y evolución mensual. |
| CU-10 | Filtrar Historial Completo | Usuario | Buscar movimientos pasados filtrando por fecha, tipo o categoría. |
| CU-11 | Planificar Ahorro para Compra | Usuario | Crear una "meta" de compra y ver en vivo cuánto le falta ahorrar. |
| CU-12 | Gestionar Información de Perfil | Usuario | Cambiar su nombre, correo o moneda preferida. |
| CU-13 | Cerrar Sesión | Usuario | Salir de la cuenta de forma segura. |
| CU-14 | Realizar Arqueo Diario | Usuario | Contar el dinero físico del día y comparar contra lo que el sistema calculó. |
| CU-15 | Realizar Cierre Mensual | Usuario | Cerrar el mes con contraseña para que esos movimientos ya no se puedan alterar. |
| CU-16 | Reabrir Periodo Cerrado | Usuario | Desbloquear un cierre anterior si se cometió un error, usando contraseña. |
| CU-17 | Destacar Ingreso Fijo | Usuario | Marcar un ingreso (ej. sueldo) para que se repita automáticamente cada mes. |
| CU-18 | Eliminar Cuenta | Usuario | Borrar la cuenta y todos sus datos de forma permanente. |
| CU-19 | Suscribirse al Plan Pro | Usuario | Pagar S/ 19.90 con tarjeta (vía Culqi) para desbloquear funciones avanzadas. |
| CU-20 | Gestionar Recordatorios de Préstamos | Usuario | Anotar dinero prestado o por cobrar, con fecha de vencimiento. |
| CU-21 | Exportar Reportes en Excel/PDF | Usuario Pro | Descargar el historial financiero en un archivo contable. |
| CU-22 | Administrar la Plataforma | Administrador | Ver métricas globales, aprobar pagos manuales y gestionar usuarios. |

## Relaciones especiales

- **CU-07 `<<extend>>` CU-06**: cargar un comprobante por imagen extiende el registro manual, ya que al final ambos crean el mismo tipo de movimiento; la imagen solo autocompleta los campos.
- **CU-19 `<<extend>>` CU-21 y CU-07**: pagar la suscripción Pro es lo que habilita (extiende) el acceso a exportar reportes y a usar el OCR sin el límite mensual gratuito.
- **CU-22 `<<include>>` CU-19**: dentro de "Administrar la Plataforma", el administrador puede aprobar manualmente una solicitud de pago (Yape/BCP), lo que equivale a otorgar el mismo resultado que CU-19.
