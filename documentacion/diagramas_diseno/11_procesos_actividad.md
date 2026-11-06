# Diagrama de Procesos del Sistema (Diagrama de Actividad) — FinanceFlow

Dos procesos asíncronos reales que corren en segundo plano, con nombres técnicos exactos.

---

## Proceso 1 — OCR con fallback de proveedor

```mermaid
flowchart TD
    Start([Usuario sube una imagen]) --> A1["frontend: useImageToMovimiento.js → processImage(file)"]
    A1 --> A2["fileToBase64(file)"]
    A2 --> A3["fetch POST /api/movimientos/ocr<br/>(backend/controllers/movimientos.controller.js)"]
    A3 --> A4["backend/services/ocr.service.js → analizarComprobante()"]
    A4 --> D1{"¿GEMINI_API_KEY configurada<br/>y responde en &lt; 20s?"}
    D1 -->|Sí| A5["Gemini devuelve JSON {monto, nombre, categoria, fecha, tipo}"]
    A5 --> A6["HTTP 200 { success: true, data }"]
    D1 -->|No / timeout / error| A7["HTTP no-ok o excepción"]
    A7 --> A8["frontend: fetch POST https://financeflow-ml.onrender.com/analyze-receipt<br/>(FormData con la imagen)"]
    A8 --> A9["ml_backend/main.py: Tesseract extrae texto"]
    A9 --> A10["modelo_clasificador.pkl predice la categoría (Naive Bayes)"]
    A10 --> A11["HTTP 200 { data: {monto, descripcion, categoria_ml, fecha, tipo} }"]
    A6 --> A12["setResult() → autocompleta el formulario"]
    A11 --> A12
    A12 --> End([Fin: usuario revisa y guarda])
```

---

## Proceso 2 — Silent Training (reentrenamiento silencioso en segundo plano)

```mermaid
flowchart TD
    Start([Usuario guarda un Movimiento]) --> A1["frontend/src/pages/MovimientoFormPage.jsx: handleSubmit()"]
    A1 --> A2["await createMovimiento(data) — guardado principal, bloqueante"]
    A2 --> A3["Movimiento guardado con éxito (HTTP 201)"]
    A3 --> A4["navigate('/') programado con setTimeout(1500ms)"]
    A3 -.->|"en paralelo, fire-and-forget"| B1["getMovimientos() — trae todo el historial"]
    B1 --> B2["filtra movimientos con nombre y categoría válidos"]
    B2 --> D1{"¿Hay más de 5<br/>registros de entrenamiento?"}
    D1 -->|Sí| B3["fetch POST https://financeflow-ml.onrender.com/retrain<br/>{ data: trainingData }"]
    B3 --> B4["ml_backend: modelo.partial_fit(nuevos_datos)"]
    B4 --> B5["Sobrescribe modelo_clasificador.pkl en disco"]
    B5 --> B6["HTTP 202 Accepted"]
    D1 -->|No| B7["No se dispara reentrenamiento (muy pocos datos)"]
    B6 -.-> End2([Fin del proceso en segundo plano])
    B7 -.-> End2
    A4 --> End([Usuario ya fue redirigido al Dashboard])
```

## Notas de diseño

- Ambos procesos son **"fire-and-forget"** desde la perspectiva del usuario: el proceso 2 nunca bloquea la navegación — su resultado (éxito o fallo del reentrenamiento) se registra solo en la consola del navegador (`console.warn`), nunca se muestra en la interfaz.
- El proceso 1 tiene un **límite duro de 20 segundos** (`AbortController` + `setTimeout`) en el lado de Gemini antes de considerar que falló y activar el camino de respaldo — evita que el usuario quede esperando indefinidamente.
- El modelo `modelo_clasificador.pkl` del proceso 2 es el **mismo archivo** que usa el motor de respaldo del proceso 1 (`NaiveBayes` en `ml_backend`) — es decir, cada movimiento que el usuario guarda mejora silenciosamente la precisión del OCR de respaldo para futuras boletas.
