# 🚀 Estrategia de Monetización Freemium para FinanceFlow

Para destacar en la Google Play Store frente a la competencia (como Mobills, Spendee o Wallet), es clave ofrecer una versión gratuita sumamente útil que genere confianza, pero reservando las funciones automáticas, avanzadas o de alto coste (como la IA) para el plan premium.

A continuación, se detalla la estructura propuesta para equilibrar valor gratuito y rentabilidad:

---

## 🟢 Versión Gratuita (Gancho de Adquisición)
El objetivo de la versión gratuita es que el usuario organice sus finanzas diarias sin fricciones y se enamore de la interfaz limpia y rápida.

- **Registro Ilimitado de Movimientos:** Entrada manual sin límites de ingresos y egresos.
- **Gráficos Básicos de Dashboard:** Visualización del balance mensual e historial de transacciones recientes.
- **Categorías Dinámicas y Personalizadas:** El flujo dinámico por tipo y la creación de categorías propias (como implementamos hoy) deben ser gratuitos para garantizar una buena experiencia base.
- **Modo Claro / Modo Oscuro:** Personalización visual de la interfaz.

---

## 👑 Versión Premium (FinanceFlow Pro)
Funciones automatizadas, análisis inteligente y herramientas de planificación avanzada por las que los usuarios están dispuestos a pagar una suscripción mensual/anual o un pago único.

### 1. Escaneo de Comprobantes con IA (OCR Gemini)
- **Por qué cobrarlo:** Cada consulta al modelo de visión (`gemini-flash-latest`) tiene un coste de API para ti. 
- **Estrategia:** Ofrece **3 escaneos gratuitos al mes** para que prueben el "efecto WOW" y requieres suscripción Premium para escaneos ilimitados.

### 2. Carrera de Compras Planificadas Completa
- **Gratis:** Permitir crear un máximo de **1 o 2 metas activas**.
- **Premium:** Metas ilimitadas, histogramas de proyección de tiempo estimado para cumplir la meta y consejos personalizados de ahorro basados en el comportamiento del usuario.

### 3. Arqueos y Cierres Seguros de Caja Chica
- **Gratis:** Visualizar el estado actual.
- **Premium:** Bloqueo histórico con contraseña, exportación de reportes de arqueos en PDF/Excel para contabilidad y cierres mensuales automáticos ilimitados.

### 4. Sincronización en la Nube y Exportación de Datos
- **Premium:** Descarga de reportes financieros consolidados en PDF y Excel, y la posibilidad de sincronizar la cuenta con múltiples dispositivos en tiempo real.

---

## 📈 Tabla Comparativa

| Función | Plan Gratuito | Plan Premium (Pro) |
| :--- | :---: | :---: |
| Registro de Ingresos/Egresos | Ilimitado | Ilimitado |
| Categorías Personalizadas | ✓ | ✓ |
| Escaneo con IA (Gemini OCR) | 3/mes | Ilimitado |
| Metas de Compra Activas | Máximo 2 | Ilimitadas |
| Proyección de Tiempo para Metas | ✗ | ✓ |
| Arqueos y Cierres con Clave | Básico | Completo + Historial |
| Exportación PDF/Excel | ✗ | ✓ |
| Soporte Multidispositivo | ✗ | ✓ |

---

## 💡 Recomendaciones para la Play Store

1. **Prueba Gratuita de 7 Días:** Activa una prueba de la versión Premium dentro de la app mediante Google Play Billing para reducir la barrera de entrada.
2. **Precio Localizado:** Ajusta el coste de la suscripción según el país del usuario (las tarifas en moneda local de Latinoamérica convierten mejor que un precio fijo en dólares).
3. **Destaca la Privacidad:** Promociona que FinanceFlow no vende los datos financieros de los usuarios, algo muy valorado frente a alternativas gratuitas llenas de anuncios invasivos.
