# Diagrama de Objetos (Vista de Diseño) — FinanceFlow

Fotografía de una instancia real del sistema en un momento dado: un usuario Pro, con movimientos, una meta de compra, un cierre y un pago ya procesado.

```mermaid
classDiagram
    class juan_perez_Usuario {
        _id: "6643de...12"
        nombre: "Juan Pérez"
        email: "juan@test.com"
        rol: "user"
        esPremium: true
        planTipo: "pro"
        conteoOcrMes: 3
        lastPaymentId: "ch_live_abc123"
        estado: "activo"
    }

    class mov_01_Movimiento {
        _id: "6643de...f1"
        tipo: "egreso"
        nombre: "Supermercado"
        monto: 85.50
        categoria: "Comida"
        estado: "activo"
        esRecurrente: false
    }

    class mov_02_Movimiento {
        _id: "6643de...f2"
        tipo: "ingreso"
        nombre: "Sueldo"
        monto: 1500.00
        categoria: "Salario"
        estado: "activo"
        esRecurrente: true
    }

    class mov_03_Movimiento {
        _id: "6643de...f3"
        tipo: "egreso"
        nombre: "Laptop Nueva"
        monto: 3500.00
        categoria: "Otros"
        estado: "planificado"
    }

    class cierre_sept_Cierre {
        _id: "6643de...c1"
        tipo: "mensual"
        periodo: "2026-09"
        saldoEsperado: 1414.50
        saldoFisico: 1410.00
        diferencia: -4.50
    }

    class pago_001_Pago {
        _id: "6643de...p1"
        metodo: "culqi"
        monto: 19.90
        estado: "aprobado"
        nroOperacion: "ch_live_abc123"
    }

    juan_perez_Usuario --> mov_01_Movimiento : userId
    juan_perez_Usuario --> mov_02_Movimiento : userId
    juan_perez_Usuario --> mov_03_Movimiento : userId
    juan_perez_Usuario --> cierre_sept_Cierre : userId
    juan_perez_Usuario --> pago_001_Pago : usuario
```

## Lectura del estado

- `juan_perez_Usuario.esPremium = true` porque `pago_001_Pago.estado = "aprobado"` fue el que disparó la actualización (ver secuencia de diseño #4).
- `mov_03_Movimiento.estado = "planificado"` es la meta de compra "Laptop Nueva" — todavía no se convirtió en un egreso real porque su `estado` no es `"activo"`.
- `mov_02_Movimiento.esRecurrente = true` indica que este ingreso se volverá a crear automáticamente cada mes (CU-17).
- `cierre_sept_Cierre.diferencia = -4.50` es negativa, lo que indica un faltante de caja de S/ 4.50 encontrado en el arqueo de septiembre 2026.
