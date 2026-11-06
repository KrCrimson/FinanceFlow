# Diagrama de Base de Datos (Entidad-Relación) — FinanceFlow

MongoDB Atlas, modelado con Mongoose. Refleja 1:1 los 6 esquemas reales en `backend/database/*.model.js`.

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
        String rol
        Number fondoFijo
        String resetPasswordToken
        Date resetPasswordExpires
        Boolean esPremium
        String planTipo
        Number conteoOcrMes
        Date ultimoReinicioOcr
        String lastPaymentId
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
        Boolean esRecurrente
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

    pagos {
        ObjectId _id PK
        ObjectId usuario FK
        String email
        String metodo
        String nroOperacion
        Number monto
        String estado
        Date creadoEn
        Date actualizadoEn
        Number __v
    }

    recordatorios {
        ObjectId _id PK
        ObjectId userId FK
        String tipo
        String descripcion
        Number monto
        Date fechaVencimiento
        String contacto
        String estado
        Date creadoEn
        Date actualizadoEn
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
    usuarios ||--o{ pagos : "realiza"
    usuarios ||--o{ recordatorios : "registra"
    usuarios ||--o{ logs : "genera"
    movimientos ||--o{ logs : "referencia (opcional)"
```

## Restricciones e índices reales

- `usuarios.email`: índice único (`unique: true`), siempre en minúsculas (`lowercase: true`).
- `cierres`: índice compuesto único `{ userId: 1, tipo: 1, periodo: 1 }` — impide crear dos cierres del mismo tipo para el mismo periodo (evita doble cierre mensual).
- `movimientos.estado`: enum estricto `['activo', 'inactivo', 'planificado']` — el valor `'planificado'` es el que sostiene la funcionalidad del Planificador de Compras (CU-11).
- `pagos.metodo`: enum `['yape', 'bcp', 'culqi', 'card']` — ampliado para soportar el cobro automático con Culqi y el flujo de desarrollo `checkout-directo`, además de las solicitudes manuales por Yape/BCP.
- `logs.movimientoId`: `required: false` — un log puede existir sin estar atado a un movimiento específico (ej. acciones de perfil o de sesión).
