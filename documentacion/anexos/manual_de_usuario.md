# Manual de Usuario - FinanceFlow

Bienvenido al manual del usuario del **Sistema de Balance y Clasificación Inteligente (FinanceFlow)**. Esta guía le ayudará a entender el funcionamiento del sistema para que pueda administrar eficientemente sus finanzas personales o familiares.

---

## 1. Acceso y Autenticación Segura

Para ingresar a la plataforma, debe contar con una cuenta activa:
1. **Registro:** Si es un usuario nuevo, acceda a la vista de Registro, complete su nombre, correo electrónico y una contraseña de mínimo 6 caracteres.
2. **Inicio de Sesión:** Ingrese su correo electrónico y contraseña registrados. Tras el ingreso exitoso, se generará una sesión activa y será redirigido al Dashboard.
3. **Recuperación de Contraseña:** Si olvidó su clave, use la opción de recuperación de contraseña en la pantalla de login. Ingrese su correo y recibirá un enlace con un token temporal de 10 minutos para restablecer su contraseña de forma segura.

---

## 2. Dashboard Financiero (Panel de Control Principal)

El Dashboard le ofrece una perspectiva global de su situación financiera mensual:
- **Tarjetas de Resumen:** Visualice en tiempo real sus Ingresos Totales, Egresos Totales, Cantidad de Movimientos y el **Balance General Neto** (Ingresos menos Egresos).
  *Nota: La tarjeta de Balance tomará color azul si su saldo es positivo, o color naranja si entra en saldo negativo.*
- **Gráficos Estadísticos:** Se presentan gráficos interactivos que ilustran el comportamiento mensual de sus finanzas y las principales categorías de egresos.
- **Alertas Financieras:** El panel le mostrará notificaciones automáticas si detecta un egreso inusualmente alto (que exceda en 1.2x o 1.5x el promedio de gasto de esa categoría) o si el balance general cae por debajo de cero.
- **Movimientos Recientes:** Una tabla muestra las últimas 10 transacciones guardadas. Puede desactivar movimientos directamente desde aquí presionando el botón `Desactivar` (ícono `⏸️`).

---

## 3. Registro de Movimientos Financieros

Para registrar una nueva transacción, haga clic en la opción de registro de movimientos:
- **Registro Manual:**
  1. Seleccione el Tipo de Movimiento (Ingreso o Egreso).
  2. Ingrese el Monto (debe ser un valor positivo mayor a 0).
  3. Ingrese el Concepto o Nombre (ej. *Salario Quincenal*, *Supermercado Metro*).
  4. Seleccione la Categoría: El menú desplegable se adaptará automáticamente al tipo de movimiento elegido.
     *Nota: Si selecciona la categoría **"Otros"**, se habilitará de forma condicional un campo de texto libre para que registre una categoría personalizada.*
  5. Ingrese una descripción detallada (opcional) y guarde el registro.

- **Carga Inteligente por OCR (Vouchers):**
  1. En el mismo formulario, arrastre o cargue una imagen o captura de pantalla de su comprobante digital (voucher de Yape, Plin o banca móvil).
  2. El sistema enviará la imagen para su binarización y procesamiento OCR automático.
  3. De ser legible, el sistema autocompletará el monto, fecha y concepto del formulario, y asignará la categoría correspondiente mediante clasificación inteligente.
  4. De no poder leerse el monto, el campo se establecerá en 0 y el sistema mostrará una advertencia para que ingrese los datos de forma manual.

---

## 4. Listados y Desactivación de Movimientos (Soft Delete)

Para auditar y editar el estado de sus transacciones, acceda a las páginas especializadas de **Ingresos** o **Egresos**:
- **Búsqueda e Historial:** Visualice todas las transacciones históricas organizadas en tablas.
- **Desactivación Lógica:** Si desea descartar una transacción, haga clic en el botón `Desactivar` (`⏸️`). El registro **no se eliminará físicamente** del servidor para garantizar el historial de auditoría, sino que cambiará a estado `'inactivo'`, sombreándose con opacidad reducida y excluyéndose inmediatamente de los cálculos del balance financiero en tarjetas y gráficos.

---

## 5. Reportes Avanzados y Planificador de Compras

- **Módulo de Reportes:** Ofrece una vista extendida con filtros locales por mes y categoría. Al cambiar los filtros, la tabla se actualiza localmente de inmediato sin generar nuevas llamadas al servidor.
- **Planificador de Compras:** Ubicado en el dashboard, le permite simular metas de compra. Ingrese el nombre del producto que desea adquirir y su precio. El sistema calcula automáticamente el promedio de ahorro mensual histórico y proyecta el número estimado de meses que le tomará cumplir su meta.
