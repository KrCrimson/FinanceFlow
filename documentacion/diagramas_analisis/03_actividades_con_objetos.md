# Diagramas de Actividades con Objetos (Fase de Análisis) — FinanceFlow

Estos diagramas muestran, paso a paso y en lenguaje simple, **qué hace el usuario, qué decide el sistema, y en qué "estado" queda cada objeto de negocio** a lo largo del proceso. Cada objeto aparece entre corchetes mostrando su estado (ej. `[Movimiento: borrador]` → `[Movimiento: guardado]`).

---

## Actividad 1 — Registrar un Movimiento (manual o por foto)

```mermaid
flowchart TD
    Start([Inicio]) --> A1[/"Usuario abre el formulario<br/>Objeto: Movimiento [vacío]"/]
    A1 --> D1{"¿Va a subir una foto<br/>del comprobante?"}

    D1 -->|Sí| A2["Usuario selecciona la imagen<br/>Objeto: Imagen [seleccionada]"]
    A2 --> A3["Sistema analiza la imagen con IA (Gemini)<br/>Objeto: Imagen [en análisis]"]
    A3 --> D2{"¿La IA pudo leer<br/>el comprobante?"}
    D2 -->|No| A4["Sistema usa el servicio de respaldo (ML local)<br/>Objeto: Imagen [reintentando]"]
    A4 --> A5["Sistema autocompleta el formulario<br/>Objeto: Movimiento [autocompletado]"]
    D2 -->|Sí| A5

    D1 -->|No| A6["Usuario llena el formulario a mano<br/>Objeto: Movimiento [borrador manual]"]

    A5 --> A7
    A6 --> A7["Usuario revisa y confirma los datos<br/>Objeto: Movimiento [confirmado]"]
    A7 --> D3{"¿Los datos<br/>son válidos?"}
    D3 -->|No| A8["Sistema muestra el campo con error<br/>Objeto: Movimiento [rechazado]"]
    A8 --> A7
    D3 -->|Sí| A9["Sistema guarda el movimiento<br/>Objeto: Movimiento [guardado]"]
    A9 --> A10["Sistema actualiza el balance del Dashboard<br/>Objeto: Balance [recalculado]"]
    A10 --> End([Fin])
```

---

## Actividad 2 — Planificar una Meta de Compra hasta completarla

```mermaid
flowchart TD
    Start([Inicio]) --> A1["Usuario crea una meta: nombre y monto objetivo<br/>Objeto: MetaDeCompra [planificada]"]
    A1 --> A2["Sistema calcula el % de avance contra el balance actual<br/>Objeto: MetaDeCompra [en progreso]"]
    A2 --> D1{"¿El balance alcanza<br/>el monto objetivo?"}
    D1 -->|No, sigue ahorrando| A3["Usuario sigue registrando ingresos/egresos<br/>Objeto: Balance [cambiando]"]
    A3 --> A2
    D1 -->|Sí| A4["Sistema marca la meta como lista para comprar<br/>Objeto: MetaDeCompra [alcanzada]"]
    A4 --> D2{"¿Usuario confirma<br/>la compra?"}
    D2 -->|Cancela la meta| A5["Sistema borra la planificación<br/>Objeto: MetaDeCompra [cancelada]"]
    D2 -->|Compra el producto| A6["Sistema convierte la meta en un egreso real<br/>Objeto: MetaDeCompra [convertida en Movimiento]"]
    A5 --> End([Fin])
    A6 --> End
```

---

## Actividad 3 — Realizar el Cierre Mensual de Caja

```mermaid
flowchart TD
    Start([Inicio]) --> A1["Usuario inicia el cierre del mes<br/>Objeto: Cierre [iniciado]"]
    A1 --> A2["Sistema suma todos los ingresos y egresos activos del periodo<br/>Objeto: Cierre [totales calculados]"]
    A2 --> A3["Usuario cuenta su dinero físico real y lo ingresa<br/>Objeto: Cierre [saldo físico ingresado]"]
    A3 --> A4["Usuario ingresa su contraseña para confirmar<br/>Objeto: Cierre [pendiente de validación]"]
    A4 --> D1{"¿La contraseña<br/>es correcta?"}
    D1 -->|No| A5["Sistema rechaza el cierre<br/>Objeto: Cierre [rechazado]"]
    A5 --> A4
    D1 -->|Sí| A6["Sistema calcula la diferencia (saldo físico vs esperado)<br/>Objeto: Cierre [diferencia calculada]"]
    A6 --> A7["Sistema guarda el cierre de forma permanente<br/>Objeto: Cierre [cerrado]"]
    A7 --> A8["Sistema bloquea la edición de movimientos de ese periodo<br/>Objeto: Movimiento [congelado]"]
    A8 --> End([Fin])
```
