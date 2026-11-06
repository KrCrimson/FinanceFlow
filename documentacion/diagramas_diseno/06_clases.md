# Diagrama de Clases (Vista de Diseño) — FinanceFlow

Clases técnicas con los **tipos de dato exactos** de los esquemas Mongoose (`backend/database/*.model.js`) y los módulos de la capa Controller/Service que los manipulan.

```mermaid
classDiagram
    class Usuario {
        +ObjectId _id
        +String nombre
        +String email
        +String passwordHash
        +String estado
        +String rol
        +Number fondoFijo
        +String resetPasswordToken
        +Date resetPasswordExpires
        +Boolean esPremium
        +String planTipo
        +Number conteoOcrMes
        +Date ultimoReinicioOcr
        +String lastPaymentId
        +Date creadoEn
        +Date actualizadoEn
    }

    class Movimiento {
        +ObjectId _id
        +String tipo
        +String nombre
        +Number monto
        +String categoria
        +ObjectId userId
        +Date fecha
        +String estado
        +Boolean esRecurrente
        +Date creadoEn
        +Date actualizadoEn
    }

    class Cierre {
        +ObjectId _id
        +ObjectId userId
        +String tipo
        +String periodo
        +Number fondoFijo
        +Number ingresosTotales
        +Number egresosTotales
        +Number saldoEsperado
        +Number saldoFisico
        +Number diferencia
        +String comentarios
        +Date creadoEn
    }

    class Pago {
        +ObjectId _id
        +ObjectId usuario
        +String email
        +String metodo
        +String nroOperacion
        +Number monto
        +String estado
        +Date creadoEn
        +Date actualizadoEn
    }

    class Recordatorio {
        +ObjectId _id
        +ObjectId userId
        +String tipo
        +String descripcion
        +Number monto
        +Date fechaVencimiento
        +String contacto
        +String estado
        +Date creadoEn
        +Date actualizadoEn
    }

    class Log {
        +ObjectId _id
        +String accion
        +ObjectId usuarioId
        +ObjectId movimientoId
        +Date fecha
        +String descripcion
    }

    class UsuariosController {
        <<controller>>
        +register(req, res)
        +login(req, res)
        +getProfile(req, res)
        +updateProfile(req, res)
        +deleteProfile(req, res)
        +forgotPassword(req, res)
        +resetPassword(req, res)
    }
    class MovimientosController {
        <<controller>>
        +crearMovimiento(req, res)
        +listarMovimientos(req, res)
        +editarMovimiento(req, res)
        +inhabilitarMovimiento(req, res)
        +analizarComprobante(req, res)
    }
    class CierresController {
        <<controller>>
        +crearCierre(req, res)
        +obtenerResumen(req, res)
        +listarCierres(req, res)
        +reabrirCierre(req, res)
    }
    class LogsController {
        <<controller>>
        +crearLog(req, res)
        +listarLogs(req, res)
        +inhabilitarLog(req, res)
    }
    class PagosRouterHandlers {
        <<route-handler>>
        +crearCargoCulqi(req, res)
        +estadoPlan(req, res)
        +solicitarPro(req, res)
    }
    class AdminRouterHandlers {
        <<route-handler>>
        +metrics(req, res)
        +toggrarPremium(req, res)
        +aprobarPago(req, res)
    }
    class RecordatoriosRouterHandlers {
        <<route-handler>>
    }

    class OcrService {
        <<service>>
        +analizarComprobante(base64Image, mimeType) Promise
    }

    UsuariosController --> Usuario : CRUD
    MovimientosController --> Movimiento : CRUD
    MovimientosController --> OcrService : usa
    CierresController --> Cierre : CRUD
    CierresController --> Movimiento : agrega totales de
    LogsController --> Log : CRUD
    PagosRouterHandlers --> Usuario : actualiza plan de
    PagosRouterHandlers --> Pago : CRUD
    AdminRouterHandlers --> Usuario : administra
    AdminRouterHandlers --> Pago : aprueba
    RecordatoriosRouterHandlers --> Recordatorio : CRUD

    Usuario "1" -- "*" Movimiento : posee
    Usuario "1" -- "*" Cierre : ejecuta
    Usuario "1" -- "*" Pago : realiza
    Usuario "1" -- "*" Recordatorio : registra
    Usuario "1" -- "*" Log : genera
    Movimiento "1" -- "0..*" Log : referencia
```

## Enums, valores por defecto y claves foráneas (detalle)

El diagrama mantiene los nombres de campo limpios para que las cajas no se desborden; aquí está el detalle completo de cada restricción real del esquema Mongoose:

| Clase | Campo | Detalle |
|---|---|---|
| Usuario | `email` | único (`unique: true`), en minúsculas |
| Usuario | `estado` | enum `activo \| inactivo` |
| Usuario | `rol` | enum `user \| admin` |
| Usuario | `fondoFijo` | default `1000` |
| Usuario | `esPremium` | default `false` |
| Usuario | `planTipo` | enum `free \| pro` |
| Usuario | `conteoOcrMes` | default `0` |
| Movimiento | `tipo` | enum `ingreso \| egreso` |
| Movimiento | `userId` | FK → `Usuario._id` |
| Movimiento | `estado` | enum `activo \| inactivo \| planificado` |
| Movimiento | `esRecurrente` | default `false` |
| Cierre | `userId` | FK → `Usuario._id` |
| Cierre | `tipo` | enum `diario \| mensual` |
| Cierre | `periodo` | formato `YYYY-MM-DD` (diario) o `YYYY-MM` (mensual) |
| Cierre | — | índice único compuesto: `{ userId, tipo, periodo }` |
| Pago | `usuario` | FK → `Usuario._id` |
| Pago | `metodo` | enum `yape \| bcp \| culqi \| card` |
| Pago | `monto` | default `19.90` |
| Pago | `estado` | enum `pendiente \| aprobado \| rechazado` |
| Recordatorio | `userId` | FK → `Usuario._id` |
| Recordatorio | `tipo` | enum `prestamo_recibido \| prestamo_otorgado \| pago_pendiente` |
| Recordatorio | `estado` | enum `pendiente \| pagado` |
| Log | `usuarioId` | FK → `Usuario._id` |
| Log | `movimientoId` | FK → `Movimiento._id`, opcional (`required: false`) |

## Nota de arquitectura (deuda técnica real)

A diferencia de `usuarios`, `movimientos`, `cierres` y `logs` — que sí separan **Router → Controller → Service → Model** — los módulos **`pagos.router.js`**, **`admin.router.js`** y **`recordatorios.js`** implementan la lógica **directamente en el archivo de rutas**, sin un Controller ni Service dedicados. Esto se documenta tal cual está en el código (no se idealiza), ya que refleja fielmente el estado real del sistema.
