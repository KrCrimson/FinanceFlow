# 📊 Modelo Business Model Canvas - FinanceFlow

En este documento se detalla el diseño estratégico de **FinanceFlow** utilizando la plantilla estándar del **Business Model Canvas (BMC)**, pero estructurado bajo un enfoque metodológico donde el análisis inicia en la **Propuesta de Valor (Resolución del Problema)** en lugar del Segmento de Clientes tradicional.

---

## 🗺️ Mapa de Bloques y Flujo Lógico de Creación

Siguiendo las indicaciones académicas, el orden numérico de llenado y análisis prioriza la propuesta de valor para resolver el problema financiero del usuario:

```mermaid
grid-layout
  rect 8: Socios Clave (8)
  rect 6: Actividades Clave (6)
  rect 7: Recursos Clave (7)
  rect 1: Propuesta de Valor (1)
  rect 4: Relaciones con Clientes (4)
  rect 3: Canales (3)
  rect 2: Segmentos de Clientes (2)
  rect 9: Estructura de Costos (9)
  rect 5: Fuentes de Ingresos (5)
```

---

## 📝 Detalle de los 9 Módulos del Business Model Canvas

### 1. Propuesta de Valor (Value Proposition)
*¿Qué valor proporcionamos a nuestros clientes? ¿Qué problemas resolvemos?*
* **Resolución del problema central:** Ofrece una solución inalterable de ingresos y egresos familiares que previene pérdidas accidentales gracias al borrado lógico (*soft delete*) y al bloqueo de transacciones por cierres contables mensuales.
* **Planificación de metas con datos reales:** Un planificador de compras inteligente ([PlanificadorCompras.jsx](file:///c:/Users/HP/Documents/GitHub/FinanceFlow/frontend/src/components/PlanificadorCompras.jsx)) que calcula la viabilidad y plazos reales de compra según el comportamiento y capacidad de ahorro histórica del usuario.
* **Experiencia de usuario premium y simplificada:** Control financiero sin la complejidad de sistemas contables empresariales tradicionales ni publicidad intrusiva.

---

### 2. Segmentos de Clientes (Customer Segments)
*¿Para quiénes estamos creando valor? ¿Quiénes son nuestros clientes más importantes?*
* **Familias y Hogares:** Que necesitan ordenar sus finanzas para evitar sobregastos y planificar compras compartidas.
* **Administradores de Caja Chica / Micro-negocios:** Que buscan un control transaccional ágil sin configuraciones complejas de un ERP.
* **Jóvenes y Estudiantes (Early Adopters):** Nativos digitales que administran sus primeros presupuestos y desean simular plazos para metas de consumo específicas.

---

### 3. Canales (Channels)
*¿A través de qué canales quieren ser contactados nuestros segmentos de clientes?*
* **Plataforma Web Responsive:** Acceso unificado e interactivo desde navegadores de escritorio y dispositivos móviles.
* **Nube e Internet:** Despliegue en servidores públicos de Vercel (frontend) y Render (backend).
* **Recomendación Directa (Boca a boca):** Redes familiares y académicas de desarrollo.

---

### 4. Relaciones con Clientes (Customer Relationships)
*¿Qué tipo de relación espera cada uno de nuestros segmentos de clientes?*
* **Servicio Automatizado e Interactivo:** Autoservicio donde el usuario gestiona sus cuentas de forma autónoma con retroalimentación instantánea (alertas visuales de saldos negativos o inviabilidad en planes de ahorro).
* **Certeza Contable:** Garantía de inalterabilidad y control sobre sus datos mediante bloqueos temporales que generan confianza y transparencia.

---

### 5. Fuentes de Ingresos (Revenue Streams)
*¿Por qué valor están realmente dispuestos a pagar nuestros clientes?*
* **Ahorro por Eficiencia (Valor indirecto):** Reducción de sobrecostos, intereses por deudas o compras impulsivas gracias al monitoreo del saldo neto.
* **Suscripción Premium (Modelo Freemium proyectado):** Cargos mensuales por sincronización bancaria automática, soporte multi-moneda, visualizaciones avanzadas de reportes y alertas predictivas basadas en IA.

---

### 6. Actividades Clave (Key Activities)
*¿Qué actividades clave requieren nuestras propuestas de valor?*
* **Mantenimiento y Refactorización del Software:** Optimización de servicios y seguridad de endpoints en la API.
* **Garantía de Consistencia Financiera:** Procesamiento contable de cierres de mes fijos, auditorías de movimientos y auto-archivado automático M-2 en base de datos.
* **Monitoreo de Pruebas:** Ejecución de suites de prueba automatizadas mediante el SDK Balance.

---

### 7. Recursos Clave (Key Resources)
*¿Qué recursos clave requieren nuestras propuestas de valor?*
* **Infraestructura Cloud:** Base de datos relacional y NoSQL (MongoDB Atlas / esquemas locales).
* **SDK Balance Independiente:** Componente desacoplado en [/sdk](file:///c:/Users/HP/Documents/GitHub/FinanceFlow/sdk) que unifica la lógica de transacciones permitiendo escalar fácilmente a aplicaciones móviles nativas compartiendo código.
* **Repositorio de Código y Pipelines:** Repositorio controlado mediante Git para asegurar versiones estables como la base `v1.3.0`.

---

### 8. Socios Clave (Key Partners)
*¿Quiénes son nuestros socios clave? ¿Quiénes son nuestros proveedores clave?*
* **Proveedores de Nube e Infraestructura:** Render (servidor backend), Vercel (aplicación cliente) y MongoDB Atlas (almacenamiento de base de datos).
* **Servicios de Envío de Email:** Brevo (servicio SMTP transaccional para recuperación de contraseñas de usuarios).
* **Comunidad Open Source:** Frameworks y librerías que soportan el sistema (React, Express, Chart.js/Recharts).

---

### 9. Estructura de Costos (Cost Structure)
*¿Cuáles son los costos más importantes inherentes a nuestro modelo de negocio?*
* **Render (Backend API):** Tier Gratuito ($0/mes) para desarrollo académico. Plan Starter de producción: $7/mes (para evitar el apagado de la instancia por inactividad).
* **Vercel (Frontend Web):** Tier Hobby/Personal ($0/mes) para despliegue ágil. Plan Pro comercial: $20/usuario/mes.
* **MongoDB Atlas (Base de Datos):** Tier Gratuito M0 compartido ($0/mes con 512MB de almacenamiento). Plan M10 dedicado inicial: ~$19/mes (10GB de almacenamiento y RAM dedicada).
* **Brevo (Servicio SMTP):** Tier Gratuito ($0/mes con límite de 300 correos al día para recuperación de contraseñas). Plan Starter: ~$9/mes (hasta 20,000 correos mensuales).
* **Desarrollo, Testing y Soporte:** Esfuerzo de ingeniería de software en mantenimiento, ejecución de pruebas del SDK y soporte técnico.

