# Diccionario de Datos - FinanceFlow

Este documento describe de forma exhaustiva el modelado de datos persistido en el cluster en la nube de **MongoDB Atlas** para el funcionamiento transaccional de **FinanceFlow**.

---

## 1. Esquema de Base de Datos NoSQL (MongoDB)

El sistema define dos colecciones principales estructuradas a través de esquemas de Mongoose ODM:

### 1.1 Colección: `usuarios`
Almacena la información de registro, credenciales y estados de recuperación de contraseñas de los usuarios de la plataforma.
- Definido en el archivo [usuario.model.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/database/usuario.model.js).

| Campo Mongoose | Tipo en MongoDB | Descripción | Restricciones / Reglas de Negocio |
|---|---|---|---|
| `_id` | ObjectId | Identificador único del usuario autogenerado por MongoDB. | Clave Primaria (PK) |
| `nombre` | String | Nombre completo del usuario. | Requerido |
| `email` | String | Dirección de correo electrónico. | Requerido, Índice Único |
| `password` | String | Contraseña de acceso a la cuenta. | Requerido, Almacenada como Hash (bcryptjs) |
| `resetPasswordToken` | String | Token criptográfico temporal para reestablecer clave. | Nullable / Opcional |
| `resetPasswordExpire` | Date | Fecha y hora de expiración del token de restablecimiento. | Nullable / Opcional (TTL de 10 minutos) |
| `createdAt` | Date | Fecha y hora en que se registró la cuenta. | Autogenerado por timestamps de Mongoose |
| `updatedAt` | Date | Fecha y hora de la última modificación de los datos. | Autogenerado por timestamps de Mongoose |

---

### 1.2 Colección: `movimientos`
Almacena el historial transaccional de ingresos y egresos registrados manualmente o mediante extracción OCR.
- Definido en el archivo [movimiento.model.js](file:///c:/Users/windows11/Documents/GitHub/Sistema%20de%20balance/backend/database/movimiento.model.js).

| Campo Mongoose | Tipo en MongoDB | Descripción | Restricciones / Reglas de Negocio |
|---|---|---|---|
| `_id` | ObjectId | Identificador único de la transacción. | Clave Primaria (PK) |
| `userId` | ObjectId | Clave foránea que referencia al usuario creador. | Requerido, Referencia a Colección `usuarios` |
| `tipo` | String | Tipo de movimiento financiero. | Requerido, Valores: `['ingreso', 'egreso']` |
| `monto` | Number | Monto numérico de la transacción. | Requerido, Validación: Mayor a 0 (`RN-04`) |
| `concepto` | String | Concepto o título del movimiento (ej. Yape, Luz). | Requerido |
| `categoria` | String | Categoría asignada (ej. Alimentos, Salario). | Requerido (Soporta valor personalizado si tipo = "Otros") |
| `descripcion` | String | Nota o descripción aclaratoria del registro. | Opcional |
| `fecha` | Date | Fecha en que ocurrió la transacción. | Requerido, Por defecto: `Date.now` |
| `estado` | String | Estado del registro para inhabilitación lógica. | Requerido, Valores: `['activo', 'inactivo']`, Default: `'activo'` |
| `imagen` | String | Ruta o contenido serializado en base64 del voucher. | Opcional / Nullable |
| `createdAt` | Date | Fecha y hora en que se creó el registro. | Autogenerado por timestamps de Mongoose |
| `updatedAt` | Date | Fecha de la última modificación. | Autogenerado por timestamps de Mongoose |
