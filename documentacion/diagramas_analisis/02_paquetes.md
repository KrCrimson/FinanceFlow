# Diagrama de Paquetes (Fase de Análisis) — FinanceFlow

Este diagrama agrupa las funciones del sistema en **módulos conceptuales de negocio** (no en carpetas de código — eso corresponde a la vista de diseño). Es autoexplicativo: cada paquete representa un área temática que cualquier persona, sin conocimientos técnicos, puede reconocer dentro de la app.

```mermaid
flowchart TB
    classDef pkg fill:#f8fafc,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a

    subgraph PKG_Cuenta ["📇 Gestión de Cuenta"]
        direction TB
        d1["Registro e Inicio de Sesión"]
        d2["Recuperación de Contraseña"]
        d3["Perfil de Usuario"]
        d4["Eliminación de Cuenta"]
    end

    subgraph PKG_Movimientos ["💸 Movimientos Financieros"]
        direction TB
        d5["Registro Manual"]
        d6["Carga por Comprobante (OCR)"]
        d7["Desactivación de Movimientos"]
        d8["Ingresos Recurrentes"]
    end

    subgraph PKG_Analisis ["📊 Análisis y Reportes"]
        direction TB
        d9["Dashboard y Balance"]
        d10["Gráficos por Categoría"]
        d11["Historial con Filtros"]
        d12["Exportación Excel / PDF"]
    end

    subgraph PKG_Planificacion ["🏁 Planificación Financiera"]
        direction TB
        d13["Metas de Compra"]
        d14["Recordatorios de Préstamos"]
    end

    subgraph PKG_Cierres ["🔒 Cierres de Caja"]
        direction TB
        d15["Arqueo Diario"]
        d16["Cierre Mensual"]
        d17["Reapertura de Periodo"]
    end

    subgraph PKG_Suscripcion ["⭐ Suscripción Pro"]
        direction TB
        d18["Pago con Tarjeta (Culqi)"]
        d19["Control de Límites Free/Pro"]
    end

    subgraph PKG_Admin ["🛡️ Administración"]
        direction TB
        d20["Métricas Globales"]
        d21["Gestión de Usuarios"]
        d22["Aprobación de Pagos Manuales"]
    end

    PKG_Cuenta --> PKG_Movimientos
    PKG_Movimientos --> PKG_Analisis
    PKG_Movimientos --> PKG_Planificacion
    PKG_Movimientos --> PKG_Cierres
    PKG_Suscripcion -.->|"habilita límites ampliados de"| PKG_Analisis
    PKG_Suscripcion -.->|"habilita límites ampliados de"| PKG_Movimientos
    PKG_Admin -.->|"supervisa"| PKG_Cuenta
    PKG_Admin -.->|"supervisa"| PKG_Suscripcion

    class PKG_Cuenta,PKG_Movimientos,PKG_Analisis,PKG_Planificacion,PKG_Cierres,PKG_Suscripcion,PKG_Admin pkg
```

## Explicación de cada paquete

1. **Gestión de Cuenta**: todo lo relacionado a crear, acceder, recuperar y administrar la identidad del usuario.
2. **Movimientos Financieros**: el corazón de la app — registrar cada ingreso o egreso, a mano o fotografiando un comprobante.
3. **Análisis y Reportes**: convierte los movimientos crudos en información útil (balance, gráficos, historial, exportaciones contables).
4. **Planificación Financiera**: funciones que miran hacia adelante — ahorrar para una compra futura, o llevar cuenta de préstamos dados/recibidos.
5. **Cierres de Caja**: mecanismo de control diario/mensual que "congela" los movimientos pasados para evitar alteraciones.
6. **Suscripción Pro**: el módulo de monetización — procesa el pago único y decide qué límites se levantan para el usuario que paga.
7. **Administración**: panel exclusivo para el equipo de FinanceFlow, para supervisar la salud del negocio y resolver pagos manuales.

La flecha punteada indica una relación de **dependencia de habilitación** (un paquete amplía las capacidades de otro) y la flecha sólida indica **flujo de datos** (un paquete alimenta de información al siguiente).
