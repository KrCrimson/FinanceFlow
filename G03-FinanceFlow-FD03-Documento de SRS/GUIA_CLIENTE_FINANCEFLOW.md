# FinanceFlow - Guía para el Cliente
**Versión 1.0 | Sprint 1 | Mayo 2026**

---

## ¿Qué es FinanceFlow?

FinanceFlow es una **plataforma web fácil de usar** que te ayuda a gestionar tu dinero de forma inteligente. Con esta herramienta puedes:

✅ **Registrar tus gastos e ingresos** — Anota cada compra, pago o entrada de dinero  
✅ **Ver tu balance** — Conoce en tiempo real cuánto dinero tienes disponible  
✅ **Visualizar reportes** — Entiende en dónde gastas más tu dinero  
✅ **Recibir alertas** — Te avisamos cuando gastas demasiado  
✅ **Analizar con IA** — El sistema aprende de tus patrones de gasto  

---

## Funcionalidades Principales

### 1️⃣ **Acceso Seguro - Crea tu Cuenta**
- **¿Por qué?** Cada usuario tiene su propia cuenta protegida
- **¿Cómo?** Regístrate con tu nombre, email y contraseña
- **Seguridad:** Tu contraseña está encriptada (cifrada) y nunca es visible para nadie
- **Resultado:** Obtienes un acceso exclusivo a tu información financiera

### 2️⃣ **Registra tus Ingresos y Gastos**
- **Ingresos:** Dinero que recibes (sueldo, bonos, ingresos extras)
- **Egresos:** Dinero que gastas (compras, servicios, suscripciones)
- **Campos:**
  - Concepto/Nombre: ¿Qué es? (ej: "Almuerzo en restaurante")
  - Monto: ¿Cuánto? (ej: $50.00)
  - Categoría: ¿En qué rubro? (ej: "Alimentación")
  - Fecha: ¿Cuándo? (automática al día actual)

### 3️⃣ **Dashboard - Tu Resumen Financiero**
- **Saldo Actual:** Tu balance en tiempo real (ingresos - gastos)
- **Gráficos Visuales:** 
  - Comparación de ingresos vs gastos
  - Distribución de gastos por categoría
- **Actualización en Vivo:** Los datos se actualizan automáticamente sin recargar

### 4️⃣ **Reportes - Analiza Tu Dinero**
- **Totales Globales:** Suma de todos tus ingresos y gastos
- **Historial Detallado:** Lista completa de todos tus movimientos
- **Filtros por Fecha:** Analiza períodos específicos (mes actual, trimestre, año)
- **Exportación:** (Disponible en futuras versiones)

### 5️⃣ **Características Avanzadas (Próximas)**
- **Escanea Recibos:** Toma foto de un comprobante y el sistema extrae automáticamente la información
- **Sugerencias Inteligentes:** La IA sugiere la categoría correcta basada en el nombre del gasto
- **Alertas Personalizadas:** Te avisa si gastas más de lo planeado

---

## Casos de Uso - Lo Que Puedes Hacer

### 📝 **Caso 1: Registrarse y Crear tu Cuenta**
```
1. Abres FinanceFlow
2. Haces clic en "¿No tienes cuenta? Regístrate"
3. Completas: Nombre, Email, Contraseña
4. Haces clic en "Registrarse"
5. El sistema verifica que el email sea único
6. ¡Listo! Tu cuenta está creada, ahora inicia sesión
```

### 💳 **Caso 2: Registrar un Gasto**
```
1. Inicia sesión con tu email y contraseña
2. Vas a "Egresos" (gastos)
3. Completas los campos:
   - Concepto: "Compra en supermercado"
   - Monto: 75.50
   - Categoría: "Alimentación"
4. Haces clic en "Guardar"
5. El gasto aparece inmediatamente en la tabla
6. Tu balance se actualiza automáticamente
```

### 💰 **Caso 3: Registrar un Ingreso**
```
1. Vas a "Ingresos"
2. Completas:
   - Concepto: "Pago de salario"
   - Monto: 1500.00
   - Categoría: "Salario"
3. Haces clic en "Guardar"
4. Tu balance aumenta automáticamente
```

### 📊 **Caso 4: Ver tu Dashboard**
```
1. Haces clic en "Dashboard"
2. Ves:
   - Tu saldo actual en grande
   - Gráfico de barras: ingresos vs gastos
   - Gráfico de pastel: distribución de gastos
3. Todos los datos están al día sin recargar
```

### 📈 **Caso 5: Generar un Reporte**
```
1. Vas a "Reportes"
2. Ves:
   - Totales: suma de ingresos, suma de egresos, saldo
   - Tabla: historial completo de movimientos
3. Opcionalmente, filtras por fecha
4. El sistema actualiza la tabla según el rango
```

---

## Campos y Datos que Necesitas Saber

### 🔐 **Campos de Autenticación**
| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Nombre** | Tu nombre completo | Juan Pérez García |
| **Email** | Tu correo electrónico único | juan@example.com |
| **Contraseña** | Mínimo 6 caracteres | Segura123 |

### 💵 **Campos de Movimientos**
| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Concepto** | Descripción breve del movimiento | Almuerzo |
| **Monto** | Cantidad de dinero (números con decimales) | 50.00 |
| **Tipo** | Ingreso o Egreso | Egreso |
| **Categoría** | Clasificación del movimiento | Alimentación |
| **Fecha** | Día del movimiento | 2026-05-13 |
| **Estado** | Activo (visible) o Inactivo (borrado lógico) | Activo |

### 📂 **Categorías Disponibles**
- Alimentación
- Transporte
- Salud
- Entretenimiento
- Servicios
- Compras
- Otros
- Salario (solo para ingresos)

---

## Reglas Importantes ⚠️

1. **Email Único** — No puedes registrar dos cuentas con el mismo email
2. **Contraseña Segura** — Mínimo 6 caracteres, no lo compartas con nadie
3. **Montos Positivos** — No puedes registrar montos negativos
4. **Fechas Válidas** — No puedes registrar movimientos del futuro lejano
5. **Borrado Lógico** — Cuando "borras" un gasto, el sistema lo marca como inactivo pero no lo elimina (para auditoría)

---

## Seguridad - Tu Información Está Protegida

🔒 **Encriptación de Contraseña**  
- Tu contraseña se transforma en un código especial (hash)
- Ni siquiera nosotros podemos ver tu contraseña

🔒 **Tokens JWT**  
- Tu sesión está protegida con tokens seguros
- Expiran automáticamente después de 7 días

🔒 **HTTPS**  
- Toda comunicación entre tu navegador y nuestros servidores está cifrada

🔒 **Base de Datos Segura**  
- Tu información se almacena en MongoDB Atlas (base de datos en la nube con seguridad de nivel empresarial)

---

## Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| "El correo ya está en uso" | Ese email ya está registrado | Usa otro email o inicia sesión si ya tienes cuenta |
| "Email inválido" | Formato incorrecto | Asegúrate de incluir @ y el dominio (ej: usuario@ejemplo.com) |
| "Mínimo 6 caracteres" | Contraseña muy corta | Usa una contraseña más larga |
| "Nombre muy corto" | Nombre menor a 2 letras | Escribe tu nombre completo |
| "Monto inválido" | Número negativo o vacío | Ingresa un número positivo |
| "Error de conexión" | Sin internet o servidor caído | Verifica tu conexión e intenta de nuevo |

---

## Estructura del Sistema (Lo que ocurre detrás de cámaras)

```
┌─────────────────────────────────────────────────────────┐
│                    TU NAVEGADOR                         │
│         (Frontend: React, HTML, CSS, JavaScript)       │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Pantalla de Registro / Login / Dashboard       │  │
│  │  Formularios de Ingreso/Egreso                  │  │
│  │  Gráficos y Tablas de Datos                     │  │
│  └──────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────┬──┘
         │  Solicitudes HTTPS                          │
         │  (Datos cifrados)                           │
         ▼                                             │
┌──────────────────────────────────────────────────────────┐
│              SERVIDOR FinanceFlow (Express.js)          │
│  Backend: Procesa lógica, valida datos, maneja BD      │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API REST: /api/auth, /api/movimientos, etc.    │  │
│  │  Validaciones, Seguridad, Lógica de Negocio    │  │
│  └──────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│         BASE DE DATOS (MongoDB Atlas - La Nube)         │
│                                                        │
│  Colecciones:                                         │
│  - usuarios (tu cuenta)                               │
│  - movimientos (tus gastos/ingresos)                  │
│  - logs (registro de errores)                         │
└──────────────────────────────────────────────────────────┘

         ▲
         │  (Futuro)
         ▼
┌──────────────────────────────────────────────────────────┐
│    INTELIGENCIA ARTIFICIAL (Python / Machine Learning)   │
│                                                        │
│  - OCR: Escanea tus recibos y extrae información     │
│  - Clasificación: Sugiere categoría automáticamente  │
│  - Análisis: Identifica patrones en tus gastos       │
└──────────────────────────────────────────────────────────┘
```

---

## Hoja de Ruta - Lo Que Viene

### ✅ **Sprint 1 (Completado: 11.05.2026)**
- Autenticación y registro de usuarios
- Vistas de ingresos y egresos
- Validaciones básicas

### ✅ **Sprint 2 (Completado: 18.05.2026)**
- Tabla de movimientos
- Guardar movimientos en base de datos
- Conexión con MongoDB

### ✅ **Sprint 3 (Completado: 25.05.2026)**
- Botón "Nuevo" para limpiar formulario
- Editar movimientos existentes
- Borrar movimientos (borrado lógico)
- Movimientos inactivos en gris

### ✅ **Sprint 4 (Completado: 01.06.2026) - ENTREGABLE UNIDAD 2**
- Dashboard con cálculo de balance
- Gráficos de ingresos vs egresos
- Gráfico de distribución por categoría

### ⏳ **Sprint 5 (Próximo: 08.06.2026)**
- Reportes con totales globales
- Historial consolidado
- Filtros por fecha

### ⏳ **Sprint 6-8 (Funcionalidades Avanzadas)**
- Escaneo de recibos (OCR)
- Sugerencias de categoría (IA)
- Sistema de alertas personalizadas
- SDK para desarrolladores

---

## Preguntas Frecuentes (FAQ)

### ❓ **¿Es seguro registrar mis datos financieros?**
Sí. Usamos encriptación de nivel empresarial y tu información está en servidores seguros en la nube.

### ❓ **¿Puedo acceder desde mi celular?**
Sí, la plataforma es responsiva. En futuras versiones habrá una aplicación móvil nativa.

### ❓ **¿Qué pasa si olvido mi contraseña?**
Puedes usar la opción "Olvidé mi contraseña" para resetearla vía email.

### ❓ **¿Puedo descargar mis datos?**
Sí, en futuras versiones tendrás opción de exportar tus reportes en PDF/Excel.

### ❓ **¿Cuántos movimientos puedo registrar?**
Ilimitados. El sistema está optimizado para manejar miles de registros.

### ❓ **¿Hay costo?**
FinanceFlow estará disponible en versión gratuita (MVP) y premium con funcionalidades adicionales.

---

## Contacto y Soporte

📧 **Email:** soporte@financeflow.com  
💬 **Chat:** Disponible en la aplicación  
📱 **Teléfono:** +51 XXX-XXX-XXXX  
🌐 **Web:** www.financeflow.com

---

**Versión:** 1.0 | **Última actualización:** 13 de Mayo, 2026
