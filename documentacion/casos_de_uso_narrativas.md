# Narrativas Detalladas de los Casos de Uso — FinanceFlow

Este documento contiene las especificaciones formales y narrativas detalladas de los casos de uso de **FinanceFlow**. Cada caso de uso está representado en una única e integrada tabla en formato HTML, la cual es 100% compatible con Markdown. Tanto el **Flujo Principal** como las **Excepciones** están estructurados en columnas separadas de **ACTOR** y **SISTEMA** con pasos alternados en saltos para visualizar con máxima precisión el flujo de interacción real del sistema.

---

### **CU-01: Registrar Cuenta**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-01</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Registrar Cuenta (Sign Up)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario No Registrado (Invitado)</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario accede a la pantalla de registro y cuenta con conexión activa a internet.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema crea un nuevo documento de usuario en la base de datos MongoDB con el correo electrónico único, la contraseña encriptada con bcryptjs y devuelve una respuesta de registro exitoso. Luego, el usuario queda listo para iniciar sesión.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Flujo Principal</b></td>
  </tr>
  <tr >
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario visualiza la pantalla de login de FinanceFlow. Al no tener cuenta, hace clic en el enlace "¿No tienes cuenta? Regístrate" ubicado en la parte inferior del formulario.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El frontend monta el componente `RegisterPage.jsx` y visualiza el formulario de registro con tres campos: Nombre completo, Correo electrónico y Contraseña.</td>
  </tr>
  <tr>
    <td>3</td>
    <td>Completa los campos: ingresa su nombre completo, una dirección de correo electrónico válida y una contraseña de su elección.</td>
    <td></td>
  </tr>
  <tr>
    <td>4</td>
    <td>Presiona el botón "Registrarse".</td>
    <td></td>
  </tr>
  <tr>
    <td>5</td>
    <td></td>
    <td>React Hook Form valida en tiempo real: nombre con mínimo 2 caracteres, correo con formato válido (regex), contraseña con mínimo 6 caracteres. Si algún campo no cumple, muestra el error inline sin permitir el envío.</td>
  </tr>
  <tr>
    <td>6</td>
    <td></td>
    <td>Al pasar la validación del frontend, envía la solicitud POST `/api/usuarios/register` al backend con los datos del formulario.</td>
  </tr>
  <tr>
    <td>7</td>
    <td></td>
    <td>El backend valida nuevamente los campos recibidos: nombre, email y contraseña no vacíos y con formato correcto.</td>
  </tr>
  <tr>
    <td>8</td>
    <td></td>
    <td>Consulta en MongoDB si ya existe un documento en la colección users con el mismo email (case-insensitive).</td>
  </tr>
  <tr>
    <td>9</td>
    <td></td>
    <td>Al confirmar que el email no está registrado, encripta la contraseña con bcryptjs usando 10 salt rounds.</td>
  </tr>
  <tr>
    <td>10</td>
    <td></td>
    <td>Crea el documento de Usuario en MongoDB con los campos: nombre, email, password (hash), estado='activo', createdAt y updatedAt automáticos.</td>
  </tr>
  <tr>
    <td>11</td>
    <td></td>
    <td>Retorna HTTP 201 con los datos del usuario creado, excluyendo el campo password.</td>
  </tr>
  <tr>
    <td>12</td>
    <td></td>
    <td>El frontend muestra el mensaje de éxito: "Registro exitoso. Ahora puedes iniciar sesión." y redirige automáticamente a la pantalla de login.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: Datos inválidos en el formulario</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario ingresa un nombre de un solo carácter, un correo sin el símbolo "@" o una contraseña de solo 3 caracteres, e intenta enviar el formulario.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>React Hook Form detecta el incumplimiento de las reglas de validación antes de realizar cualquier petición HTTP.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Muestra los mensajes de error directamente bajo el campo correspondiente: "El nombre debe tener al menos 2 caracteres", "Ingresa un correo válido" o "La contraseña debe tener al menos 6 caracteres".</td>
  </tr>
  <tr>
    <td>4</td>
    <td>El botón "Registrarse" permanece bloqueado hasta que todos los campos cumplan las reglas. No se realiza ninguna petición al backend.</td>
    <td></td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 2: Correo electrónico ya registrado</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario ingresa un correo electrónico que ya pertenece a una cuenta existente en el sistema y presiona "Registrarse".</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El frontend pasa la validación de formato y envía la solicitud al backend.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El backend consulta MongoDB y encuentra un documento existente con el mismo email.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>Cancela la operación y retorna HTTP 409 Conflict con el mensaje: "El email ya está registrado".</td>
  </tr>
  <tr>
    <td>5</td>
    <td>El frontend muestra el error bajo el campo de correo. El usuario puede ingresar un correo diferente o ir a la pantalla de login si ya tiene cuenta.</td>
    <td></td>
  </tr>
</table>

---

### **CU-02: Iniciar Sesión**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-02</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Iniciar Sesión (Login)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Registrado (Invitado)</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario accede al sistema, visualiza la pantalla de login y cuenta con conexión activa a internet.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema valida las credenciales ingresadas, genera un token de sesión JWT firmado, almacena el estado del usuario en el navegador y permite la navegación segura al Dashboard.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Flujo Principal</b></td>
  </tr>
  <tr >
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario visualiza la pantalla de login de FinanceFlow con los campos Correo electrónico y Contraseña. Ingresa sus credenciales registradas.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td>Presiona el botón "Ingresar".</td>
    <td></td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>React Hook Form valida en cliente: formato de email y longitud mínima de contraseña (6 caracteres). Si no pasa, muestra errores inline sin enviar la petición.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>Al pasar la validación, authService.js delega la llamada a la ruta `/api/usuarios/login` enviando el JSON `{ email, password }` en el cuerpo de la solicitud HTTP POST de forma pública.</td>
  </tr>
  <tr>
    <td>5</td>
    <td></td>
    <td>El backend busca al usuario en MongoDB. Al encontrarlo, compara la clave con bcryptjs. Si coincide, genera un token JWT firmado y retorna un estado HTTP 200 OK con el token y el perfil.</td>
  </tr>
  <tr>
    <td>6</td>
    <td></td>
    <td>El frontend almacena el token y los datos de sesión en useAuth/localStorage y redirige automáticamente al usuario al Dashboard (/).</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: Error de formato en los campos</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario escribe un correo sin estructura formal (ej. "usuario") o una clave menor a 6 caracteres y presiona "Ingresar".</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>React Hook Form y Zod detectan el error antes de enviar la petición y bloquean la transmisión HTTP.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Despliega inmediatamente en color rojo bajo cada campo los textos: "Email inválido" o "Mínimo 6 caracteres". El flujo se congela hasta su corrección.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 2: Credenciales de acceso incorrectas</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario ingresa un correo no registrado o una contraseña que no corresponde a su cuenta y presiona "Ingresar".</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El servicio del backend busca en MongoDB y al no encontrar el usuario o fallar bcrypt.compare, cancela la autenticación.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Por razones de seguridad, retorna el mismo mensaje genérico en ambos casos: HTTP 401 "Credenciales inválidas", sin revelar si el error es el correo o la contraseña.</td>
  </tr>
  <tr>
    <td>4</td>
    <td>El frontend muestra el mensaje de error debajo del formulario en un aviso rojo. El usuario puede corregir sus datos e intentar nuevamente.</td>
    <td></td>
  </tr>
</table>

---

### **CU-03: Solicitar Recuperación**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-03</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Solicitar Recuperación (Forgot Password)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Registrado</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario no recuerda su contraseña y accede a la interfaz de recuperación de credenciales.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema genera un token de seguridad temporal con expiración, lo asocia al usuario en MongoDB y le envía un correo electrónico con un enlace de recuperación único.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Flujo Principal</b></td>
  </tr>
  <tr >
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario hace clic en "¿Olvidaste tu contraseña?" en el login o ingresa directamente a la ruta `/forgot-password`.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>Monta la pantalla desplegando un cuadro descriptivo explicativo, un campo para ingresar el Email y el botón "Enviar Enlace de Recuperación".</td>
  </tr>
  <tr>
    <td>3</td>
    <td>Escribe su correo electrónico registrado.</td>
    <td></td>
  </tr>
  <tr>
    <td>4</td>
    <td>Presiona el botón "Enviar Enlace de Recuperación".</td>
    <td></td>
  </tr>
  <tr>
    <td>5</td>
    <td></td>
    <td>El frontend valida localmente que el correo contenga al menos el caracter @ y que no esté vacío.</td>
  </tr>
  <tr>
    <td>6</td>
    <td></td>
    <td>Inicia el indicador de carga y envía un POST HTTP a `/api/usuarios/forgot-password` transmitiendo `{ email }` en JSON.</td>
  </tr>
  <tr>
    <td>7</td>
    <td></td>
    <td>El backend consulta MongoDB, verifica que la cuenta existe, genera un token criptográfico temporal y le define una expiración de una hora.</td>
  </tr>
  <tr>
    <td>8</td>
    <td></td>
    <td>Actualiza el documento del usuario en MongoDB guardando el token y la fecha de expiración.</td>
  </tr>
  <tr>
    <td>9</td>
    <td></td>
    <td>Despacha un correo electrónico al buzón del usuario que contiene la URL con el token dinámico: `${FRONTEND_URL}/reset-password?token={TOKEN}`.</td>
  </tr>
  <tr>
    <td>10</td>
    <td></td>
    <td>Al confirmarse el despacho, el servidor responde HTTP 200 OK.</td>
  </tr>
  <tr>
    <td>11</td>
    <td></td>
    <td>El frontend recibe el código 200 y renderiza en pantalla un recuadro verde con el texto: "Se ha enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada."</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: Formato de correo inválido</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario presiona "Enviar Enlace de Recuperación" dejando el campo vacío o ingresando un texto sin formato de email.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El frontend intercepta y congela el envío antes de realizar cualquier comunicación de red.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Muestra de inmediato bajo el input el mensaje: "Por favor ingresa tu email" o "Por favor ingresa un email válido".</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 2: Correo electrónico no registrado</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario escribe una dirección de correo electrónico que no existe en el sistema y presiona "Enviar Enlace de Recuperación".</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El frontend valida la estructura del campo y envía la solicitud POST al servidor.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El backend busca en MongoDB y al no encontrar ninguna coincidencia, cancela el flujo.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>Retorna un código de error HTTP 404 Not Found o HTTP 400 Bad Request con el mensaje descriptivo: "El email no está registrado".</td>
  </tr>
  <tr>
    <td>5</td>
    <td>El frontend captura el error de red, finaliza la animación del cargador y plasma bajo el formulario en color rojo el mensaje: "El email no está registrado".</td>
    <td></td>
  </tr>
</table>

---

### **CU-04: Restablecer Contraseña**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-04</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Restablecer Contraseña (Reset Password)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Registrado</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario cuenta con un token vigente de recuperación en la URL de acceso proporcionada por su correo.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema encripta la nueva clave en la base de datos MongoDB, invalida el token de recuperación temporal y redirige al usuario a la pantalla de login.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Flujo Principal</b></td>
  </tr>
  <tr >
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario abre el enlace de su correo que apunta a la URL `/reset-password?token={TOKEN}` en su navegador.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>La pantalla monta mostrando un spinner y captura automáticamente el token de los parámetros de la URL para enviar un POST a `/api/usuarios/verify-reset-token`.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El backend verifica que el token esté vigente y que pertenezca a un usuario real. Si es correcto, devuelve HTTP 200 OK.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>El frontend recibe la verificación del token, desbloquea la interfaz y renderiza el formulario con dos inputs: "Nueva Contraseña" y "Confirmar Contraseña".</td>
  </tr>
  <tr>
    <td>5</td>
    <td>Escribe su nueva contraseña en ambos inputs asegurándose de que coincidan exactamente.</td>
    <td></td>
  </tr>
  <tr>
    <td>6</td>
    <td>Presiona el botón "Actualizar Contraseña".</td>
    <td></td>
  </tr>
  <tr>
    <td>7</td>
    <td></td>
    <td>El frontend valida localmente que los campos no estén vacíos, que la longitud de la clave sea de mínimo 6 caracteres y que ambos coincidan.</td>
  </tr>
  <tr>
    <td>8</td>
    <td></td>
    <td>Envía una solicitud HTTP POST a `/api/usuarios/reset-password` enviando el JSON `{ token, newPassword: password }`.</td>
  </tr>
  <tr>
    <td>9</td>
    <td></td>
    <td>El backend vuelve a validar la vigencia del token. Cifra la nueva contraseña con bcryptjs a 10 rondas e impacta el campo `password` del usuario en MongoDB.</td>
  </tr>
  <tr>
    <td>10</td>
    <td></td>
    <td>Borra e invalida el token temporal de los registros de MongoDB para impedir reutilizaciones y responde HTTP 200 OK.</td>
  </tr>
  <tr>
    <td>11</td>
    <td></td>
    <td>El frontend captura el éxito y plasma en verde: "Contraseña actualizada exitosamente. Redirigiendo al login...". Tras 2 segundos, redirige al usuario a `/login` pasando el mensaje de éxito.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: Token inválido, expirado o alterado al montar la interfaz</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario abre un enlace manipulado o que ya expiró (más de una hora) desde su bandeja.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>Durante el montaje, el backend deniega la validación del token respondiendo con un error HTTP 400 Bad Request.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El frontend detecta la respuesta 400, congela el formulario e imprime en rojo la pantalla de error: "Enlace No Válido - Token no válido o expirado".</td>
  </tr>
  <tr>
    <td>4</td>
    <td>El usuario visualiza la pantalla de error y tiene accesos directos para presionar "Solicitar Nuevo Enlace" o "Volver al Login".</td>
    <td></td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 2: Contraseñas no coinciden o son cortas</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario escribe claves diferentes en ambos campos o una clave menor a 6 caracteres y presiona "Actualizar Contraseña".</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El frontend detiene la ejecución del envío antes de realizar cualquier petición de red.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Muestra de inmediato en color rojo las leyendas correspondientes: "La contraseña debe tener al menos 6 caracteres" o "Las contraseñas no coinciden".</td>
  </tr>
</table>

---

### **CU-05: Consultar Resumen y Balance**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-05</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Consultar Resumen y Balance (Dashboard)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Autenticado</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario cuenta con una sesión activa en el sistema y ha ingresado al Dashboard.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema recupera el historial de movimientos activos de MongoDB, calcula los balances acumulados y presenta en pantalla tarjetas de métricas, alertas por desvíos y una tabla con los últimos movimientos.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Flujo Principal</b></td>
  </tr>
  <tr >
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario navega hacia la ruta raíz `/` de la aplicación.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El componente `DashboardPage` monta desplegando la animación de carga: "Cargando movimientos..." e inicia una solicitud HTTP GET a `/api/movimientos` inyectando el token JWT.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El backend valida el token, busca en MongoDB los movimientos vinculados al `userId` y con estado "activo", respondiendo HTTP 200 OK con la lista completa.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>El frontend recibe la lista y calcula reactivamente los acumulados: Total de ingresos, Total de egresos, el Balance general (ingresos - egresos) y el conteo total.</td>
  </tr>
  <tr>
    <td>5</td>
    <td></td>
    <td>Envía las transacciones al hook `useAnalisisGastos` para computar los promedios e identificar anomalías de consumo (gastos elevados en categorías).</td>
  </tr>
  <tr>
    <td>6</td>
    <td></td>
    <td>Renderiza en pantalla las 4 tarjetas principales: Total Ingresos (verde), Total Egresos (rojo), Balance Total (azul o naranja dinámico) y Conteo de Movimientos.</td>
  </tr>
  <tr>
    <td>7</td>
    <td></td>
    <td>Carga el componente `<AlertasComponent />`. Si no hay desvíos muestra el mensaje verde: "¡Todo bajo control!", de lo contrario, lista las alertas en color rojo o amarillo detallando los porcentajes de desvío.</td>
  </tr>
  <tr>
    <td>8</td>
    <td></td>
    <td>Dibuja la lista de "Movimientos Recientes" ordenando las últimas 10 transacciones con el botón amarillo "Desactivar" disponible en cada fila activa.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: Pérdida de conexión o sesión expirada al cargar datos</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario ingresa al Dashboard pero expira su token de sesión o se desconecta de internet en el proceso.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>La llamada HTTP GET al servidor falla retornando un código de error HTTP 401 o 500, o un fallo físico de conexión.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El frontend intercepta el fallo, detiene la animación de progreso y renderiza un aviso en color rojo con el mensaje de error: "Error: [Detalle del Servidor]".</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 2: Ausencia absoluta de transacciones registradas</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>Un usuario que no tiene movimientos registrados ingresa al Dashboard.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El frontend recibe de MongoDB un listado de movimientos vacío.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>En lugar de mostrar gráficos o métricas nulas, dibuja un contenedor especial con el icono 📊, informando: "No hay movimientos. Comienza agregando tu primer movimiento financiero".</td>
  </tr>
  <tr>
    <td>4</td>
    <td>El usuario hace clic en el botón "Agregar primer movimiento" para redirigirse a la pantalla del formulario (/movimiento).</td>
    <td></td>
  </tr>
</table>

---

### **CU-06: Registrar Movimiento Manual**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-06</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Registrar Movimiento Manual (Create Movement)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Autenticado</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario accede al formulario de creación y cuenta con una sesión activa en la aplicación.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema almacena la nueva transacción en MongoDB, actualiza el ordenamiento por uso de las categorías y gatilla en segundo plano una sincronización silenciosa para entrenar los modelos inteligentes del servidor.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Flujo Principal</b></td>
  </tr>
  <tr >
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario hace clic en "Nuevo Movimiento" del menú de navegación o accede a `/movimiento`.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>Carga el componente `MovimientoFormPage.jsx` y ejecuta una lectura de transacciones históricas para reordenar dinámicamente el dropdown de categorías de mayor a menor uso, dejando "Otros" de última opción.</td>
  </tr>
  <tr>
    <td>3</td>
    <td>Elige el Tipo de Movimiento: "💰 Ingreso" o "💸 Egreso".</td>
    <td></td>
  </tr>
  <tr>
    <td>4</td>
    <td>Completa los campos ingresando el Monto (monto decimal positivo), el Nombre y elige una Categoría del selector.</td>
    <td></td>
  </tr>
  <tr>
    <td>5</td>
    <td>* (Opcional) * Si selecciona la categoría "Otros", el sistema habilita un input de texto libre. El usuario escribe allí una categoría personalizada.</td>
    <td></td>
  </tr>
  <tr>
    <td>6</td>
    <td>* (Opcional) * Ingresa aclaraciones adicionales en el cuadro de "Descripción".</td>
    <td></td>
  </tr>
  <tr>
    <td>7</td>
    <td>Presiona el botón verde "💾 Guardar Movimiento".</td>
    <td></td>
  </tr>
  <tr>
    <td>8</td>
    <td></td>
    <td>El frontend valida que el monto sea mayor que cero, que el nombre contenga texto y que se haya seleccionado o escrito una categoría.</td>
  </tr>
  <tr>
    <td>9</td>
    <td></td>
    <td>Activa la pantalla de progreso y realiza un POST a `/api/movimientos` enviando `{ tipo, nombre, monto, categoria, descripcion }`.</td>
  </tr>
  <tr>
    <td>10</td>
    <td></td>
    <td>El backend recibe los datos, obtiene el `userId` del JWT, pone la fecha actual, guarda el nuevo documento en MongoDB con estado "activo" y responde HTTP 201 Created.</td>
  </tr>
  <tr>
    <td>11</td>
    <td></td>
    <td>El frontend despliega un aviso verde en el formulario: "¡Movimiento registrado exitosamente!".</td>
  </tr>
  <tr>
    <td>12</td>
    <td></td>
    <td><b>Sincronización Silenciosa:</b> Sin bloquear la interfaz, si el usuario cuenta con más de 5 movimientos guardados, envía un POST a `/api/retrain` (puerto 8000) con el historial para reentrenar de forma automática los modelos predictivos.</td>
  </tr>
  <tr>
    <td>13</td>
    <td></td>
    <td>Tras 1.5 segundos, redirige de forma automática al usuario al Dashboard (/).</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: Omisión de campos obligatorios en el formulario</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario intenta guardar el movimiento dejando en blanco el nombre, ingresando un monto en cero o negativo, o sin elegir una categoría.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El frontend intercepta el envío y detiene la llamada antes de realizar consultas de red.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Despliega inmediatamente una alerta en color rojo indicando: "Por favor complete todos los campos requeridos correctamente".</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 2: Fallo al guardar en la base de datos</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario rellena los campos y presiona guardar, pero ocurre una caída del servicio de la base de datos MongoDB.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El backend no logra guardar el registro y retorna una respuesta con código de error HTTP 500 Internal Server Error con el detalle del fallo.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El frontend intercepta el código de error, desactiva la animación del cargador y renderiza un recuadro de aviso rojo detallando el fallo del servidor para permitir reintentos.</td>
  </tr>
</table>

---

### **CU-07: Cargar Comprobante por Imagen**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-07</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Cargar Comprobante por Imagen (OCR scan)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Autenticado</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario se encuentra en la pantalla de registro y tiene un archivo de imagen legible de una boleta de compra.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema analiza la imagen adjunta mediante OCR, extrae la información financiera relevante y autocompleta los campos obligatorios del formulario del movimiento.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Flujo Principal</b></td>
  </tr>
  <tr >
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario localiza la sección superior del formulario titulada "📷 Extraer datos de comprobante (OCR)" y selecciona un archivo de imagen (PNG o JPG) de su boleta.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El frontend recibe el archivo e inicia la animación de carga desplegando la leyenda: "Analizando imagen con OCR...".</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El hook `useImageToMovimiento` empaqueta la imagen en un objeto FormData y dispara una llamada HTTP POST a la ruta del servicio de OCR.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>El backend procesa la imagen para extraer texto plano y analiza sintácticamente las cadenas en busca de importes numéricos totales y nombres de comercios.</td>
  </tr>
  <tr>
    <td>5</td>
    <td></td>
    <td>El servidor responde con código de estado HTTP 200 OK retornando un JSON estructurado con los datos: `{ tipo, nombre, monto, categoria, descripcion }`.</td>
  </tr>
  <tr>
    <td>6</td>
    <td></td>
    <td>El frontend captura la respuesta y actualiza automáticamente las entradas reactivas en pantalla del formulario: tipo, nombre, monto, categoría y descripción.</td>
  </tr>
  <tr>
    <td>7</td>
    <td></td>
    <td>Despliega un aviso verde en el formulario: "¡OCR exitoso! Detectado: [Establecimiento] - S/[Importe]", dejando el formulario listo para ser guardado.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: El sistema no logra deducir importes (Imagen borrosa)</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario sube una imagen de una boleta que está desenfocada, tiene mala luz o caracteres ilegibles.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El backend de visión procesa la imagen pero es incapaz de encontrar importes o textos con un patrón de precio total.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Retorna un JSON con montos en cero o vacío. El frontend captura la respuesta e inserta un cuadro naranja advirtiendo: "Monto no detectado, ingrésalo manualmente".</td>
  </tr>
  <tr>
    <td>4</td>
    <td>El usuario revisa los campos en blanco e ingresa los valores de forma manual sobre los inputs del formulario.</td>
    <td></td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 2: Formato de archivo incompatible o corrupto</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario intenta subir un archivo incompatible (como un audio, una planilla de cálculo o un archivo superior al peso admitido).</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El frontend evalúa el tipo de archivo y cancela de forma inmediata el proceso de subida antes de enviar datos al servidor.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Muestra una advertencia roja en pantalla indicando: "Error OCR: Formato de archivo no soportado. Sube una imagen".</td>
  </tr>
</table>

---

### **CU-08: Desactivar Movimientos**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-08</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Desactivar Movimientos (Deactivate Movement)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Autenticado</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario visualiza la lista de transacciones en la interfaz del Dashboard o la pantalla de reportes.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema cambia lógicamente el estado de la transacción a "inactivo" en MongoDB y recalcula de inmediato los balances acumulados en la pantalla.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Flujo Principal</b></td>
  </tr>
  <tr >
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario busca la transacción en la tabla de "Movimientos Recientes" del Dashboard.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td>Presiona el botón amarillo "⏸️ Desactivar" de la fila seleccionada.</td>
    <td></td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Deshabilita temporalmente el botón de esa fila bloqueando clics y cambia su texto por "Desactivando..." junto a una animación de progreso.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>Realiza una solicitud HTTP PATCH a `/api/movimientos/{id}/inhabilitar` enviando las credenciales JWT.</td>
  </tr>
  <tr>
    <td>5</td>
    <td></td>
    <td>El backend busca la transacción en MongoDB por su `_id` y comprueba que corresponda al usuario autenticado.</td>
  </tr>
  <tr>
    <td>6</td>
    <td></td>
    <td>Realiza un cambio lógico modificando la propiedad `estado` del documento a "inactivo", actualiza el registro en MongoDB y responde HTTP 200 OK.</td>
  </tr>
  <tr>
    <td>7</td>
    <td></td>
    <td>El frontend captura el código 200 y despliega en pantalla un mensaje informativo en color verde indicando: "Movimiento desactivado correctamente".</td>
  </tr>
  <tr>
    <td>8</td>
    <td></td>
    <td>Dispara una recarga general de los datos de la cuenta refrescando el listado.</td>
  </tr>
  <tr>
    <td>9</td>
    <td></td>
    <td>El Dashboard recalcula los balances generales y atenúa visualmente la fila del movimiento con una apariencia opaca y tachada, mostrando el texto de inactivo.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: Falla de red o sesión expirada al desactivar</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario presiona desactivar pero expira su sesión o pierde el acceso a internet.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>La petición al backend falla retornando un error HTTP 401 o una interrupción física de la red.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El frontend intercepta el fallo, cancela la animación del cargador en la fila, vuelve a habilitar el botón y muestra una alerta roja: "Error al desactivar el movimiento".</td>
  </tr>
</table>

---

### **CU-09: Visualizar Reportes y Gráficos**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-09</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Visualizar Reportes y Gráficos (View Reports)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Autenticado</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario cuenta con una sesión activa en la aplicación.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema procesa el historial completo de movimientos del usuario, calcula las clasificaciones por categorías y renderiza múltiples gráficos dinámicos en la pantalla de análisis.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Flujo Principal</b></td>
  </tr>
  <tr >
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario hace clic en el enlace "Reportes" de la barra de navegación superior o presiona "Ver Reportes" en el Dashboard.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>Carga el componente en `/reportes` y despliega la animación de progreso con la leyenda: "Generando reportes...".</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Dispara una solicitud HTTP GET a `/api/movimientos` inyectando el token JWT.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>El backend busca y recupera todas las transacciones vinculadas en MongoDB y responde con HTTP 200 OK transmitiendo los datos.</td>
  </tr>
  <tr>
    <td>5</td>
    <td></td>
    <td>El frontend calcula los totales de ingresos y egresos para la cabecera, agrega egresos por categorías, ingresos por categorías y consolida la tendencia mes a mes de los últimos 6 meses.</td>
  </tr>
  <tr>
    <td>6</td>
    <td></td>
    <td>Carga la vista de la pestaña predeterminada "Resumen General" visualizando las métricas de ingresos, egresos y balance, junto al bloque de categorías.</td>
  </tr>
  <tr>
    <td>7</td>
    <td>El usuario hace clic sobre la pestaña intermedia "Gráficos".</td>
    <td></td>
  </tr>
  <tr>
    <td>8</td>
    <td></td>
    <td>Dibuja en pantalla los cinco elementos gráficos interactivos alimentados por las estructuras: distribución de gastos, ingresos, tendencias históricas e historial de balances.</td>
  </tr>
  <tr>
    <td>9</td>
    <td></td>
    <td>Dibuja en la parte inferior el "Resumen Estadístico" calculando promedios de gastos, ingresos y balances en base a las tendencias.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: Falta de datos de transacciones en la cuenta</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>Un usuario nuevo o sin transacciones ingresa al módulo de reportes.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>Al consultar la base de datos, el servidor devuelve un listado vacío de movimientos.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El frontend detecta la ausencia de datos e impide la renderización de los gráficos para evitar fallas visuales o pantallas en blanco.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>Dibuja un contenedor explicativo con el icono 📊 y el texto: "No hay datos para mostrar. Agrega algunos movimientos para ver los gráficos".</td>
  </tr>
  <tr>
    <td>5</td>
    <td>El usuario hace clic en el botón verde "Agregar Movimiento" para ingresar transacciones al sistema.</td>
    <td></td>
  </tr>
</table>

---

### **CU-11: Planificar Ahorro para Compra**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-11</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Planificar Ahorro para Compra (Savings Planner)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Autenticado</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario posee un historial con movimientos activos y una sesión activa en la aplicación.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema calcula el promedio de ahorro neto real del usuario, estima la viabilidad y proyecta la fecha aproximada de adquisición junto con los planes mensuales de ahorro sugeridos.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Flujo Principal</b></td>
  </tr>
  <tr >
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario ingresa al Dashboard y hace clic en la pestaña "🎯 Planificador de Compras".</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>Oculta el balance habitual y renderiza en pantalla el componente del asistente `<PlanificadorCompras />`.</td>
  </tr>
  <tr>
    <td>3</td>
    <td>Escribe el nombre del artículo a cotizar e introduce el valor total en el casillero obligatorio "Precio (S/)".</td>
    <td></td>
  </tr>
  <tr>
    <td>4</td>
    <td>* (Opcional) * Despliega "Elegir mes para cálculos" y selecciona un mes específico para basar la simulación en ese periodo en lugar del promedio histórico general.</td>
    <td></td>
  </tr>
  <tr>
    <td>5</td>
    <td>Presiona el botón azul "📊 Calcular Plan de Ahorro".</td>
    <td></td>
  </tr>
  <tr>
    <td>6</td>
    <td></td>
    <td>El frontend calcula el promedio de ahorro neto neto mensual del usuario (Ingresos - Gastos). Si es positivo, divide el precio total del producto entre el ahorro.</td>
  </tr>
  <tr>
    <td>7</td>
    <td></td>
    <td>Obtiene el total de meses necesarios redondeando con Math.ceil y calcula la fecha estimada de compra sumando ese valor a la fecha actual.</td>
  </tr>
  <tr>
    <td>8</td>
    <td></td>
    <td>Renderiza una tarjeta verde con el icono ✅ indicando: "Podrías comprarlo en X meses", la Fecha estimada, el Ahorro mensual necesario y un consejo financiero.</td>
  </tr>
  <tr>
    <td>9</td>
    <td></td>
    <td>Despliega de forma complementaria la sección "Sugerencias para ahorrar más rápido", listando consejos reales basados en reducir egresos en sus categorías de mayor consumo.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: Capacidad de ahorro nula o negativa en el periodo</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>Un usuario que tiene gastos mayores a sus ingresos o ahorro mensual promedio de cero presiona "Calcular Plan de Ahorro".</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El sistema detecta que el promedio de ahorro mensual neto es menor o igual a cero.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Cancela la proyección del tiempo para evitar divisiones matemáticas inválidas e inyecta una tarjeta roja indicando: "No es posible con el ahorro actual".</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>Despliega la advertencia: "Sugerencia: Necesitas reducir gastos o aumentar ingresos" junto con las recomendaciones de ahorro personalizadas.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 2: Entrada de precio inválida o vacía</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario deja en blanco el campo de precio o ingresa un número menor o igual a cero y presiona "Calcular".</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El frontend intercepta la acción cancelando el procesamiento y los cálculos matemáticos del simulador.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Renderiza bajo el botón una alerta roja explícita: "Por favor ingresa un precio válido".</td>
  </tr>
</table>

---

### **CU-10: Filtrar Historial Completo**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-10</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Filtrar Historial Completo (Filter Transactions)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Autenticado</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario cuenta con una sesión activa en la aplicación y se encuentra en el módulo de Reportes (pestaña Movimientos).</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema filtra dinámicamente y despliega en pantalla la lista de transacciones del usuario que coinciden con los criterios de mes y categoría seleccionados.</td>
  </tr>
  <tr>
    <td colspan="3" align="center"><b>Flujo Principal</b></td>
  </tr>
  <tr>
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario hace clic sobre la pestaña titulada "💰 Movimientos" en la pantalla de Reportes.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>Carga la vista montando los controles de filtro: "Filtrar por mes", "Filtrar por categoría", el botón "Limpiar Filtros" y la lista de todos sus movimientos activos en una tabla.</td>
  </tr>
  <tr>
    <td>3</td>
    <td>Despliega el selector "Filtrar por mes" y elige un mes específico de la lista (ej. "Mayo").</td>
    <td></td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>Captura el mes seleccionado, procesa localmente el listado de movimientos activos y filtra aquellos cuya fecha de creación coincida con el mes seleccionado, refrescando de inmediato la tabla con los resultados parciales.</td>
  </tr>
  <tr>
    <td>5</td>
    <td>Despliega el selector "Filtrar por categoría" y elige una categoría del listado (ej. "Comida").</td>
    <td></td>
  </tr>
  <tr>
    <td>6</td>
    <td></td>
    <td>Captura la categoría seleccionada, la aplica de forma combinada al filtro de mes y actualiza de inmediato la tabla visualizando únicamente los movimientos que cumplan ambas condiciones.</td>
  </tr>
  <tr>
    <td>7</td>
    <td>Hace clic sobre el botón "Limpiar Filtros".</td>
    <td></td>
  </tr>
  <tr>
    <td>8</td>
    <td></td>
    <td>Restablece los selectores de mes y categoría a sus valores vacíos originales ("Todos los meses" y "Todas las categorías") y vuelve a renderizar el listado completo de movimientos activos.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: Filtros sin resultados</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario selecciona una combinación de filtros (ej. Mes: "Diciembre", Categoría: "Freelance") en la cual no posee transacciones registradas.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>Aplica el filtrado sobre la colección en memoria y determina que el tamaño del array resultante es cero.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Oculta la tabla y despliega en el centro un recuadro gris explicativo con el icono 📝, la advertencia "No hay movimientos" y el subtext "Con los filtros aplicados no se encontraron resultados".</td>
  </tr>
</table>

---

### **CU-12: Gestionar Información de Perfil**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-12</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Gestionar Información de Perfil (Profile management)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Autenticado</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario se encuentra en la pantalla de perfil (/perfil) con una sesión activa.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema actualiza de forma permanente el nombre y el correo electrónico del usuario en MongoDB, refrescando los datos en toda la interfaz de la aplicación.</td>
  </tr>
  <tr>
    <td colspan="3" align="center"><b>Flujo Principal</b></td>
  </tr>
  <tr>
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario hace clic sobre el enlace "Perfil" en la barra de navegación superior o digita la ruta `/perfil`.</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>Carga el componente `ProfilePage.jsx` y activa el spinner de carga. Despacha una solicitud HTTP GET a `/api/usuarios/perfil` con el token JWT de autorización.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El backend valida la sesión, busca al usuario en MongoDB por su `_id` y devuelve su información personal (nombre, email, creadoEn, estado) con HTTP 200 OK.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>El frontend detiene el cargador, autocompleta los campos del formulario con los datos recuperados ("Nombre Completo" y "Correo Electrónico") y expone los bloques de auditoría y estadísticas de la cuenta.</td>
  </tr>
  <tr>
    <td>5</td>
    <td>Edita el contenido de sus campos de información personal, por ejemplo, cambiando su nombre completo en el casillero correspondiente.</td>
    <td></td>
  </tr>
  <tr>
    <td>6</td>
    <td>Presiona el botón verde "💾 Guardar Cambios".</td>
    <td></td>
  </tr>
  <tr>
    <td>7</td>
    <td></td>
    <td>Valida que ninguno de los dos campos obligatorios de texto esté vacío.</td>
  </tr>
  <tr>
    <td>8</td>
    <td></td>
    <td>Muestra un spinner de progreso en el botón y despacha una solicitud HTTP PUT a `/api/usuarios/perfil` enviando `{ nombre, email }` en formato JSON.</td>
  </tr>
  <tr>
    <td>9</td>
    <td></td>
    <td>El backend valida los datos, busca al usuario, realiza una consulta para asegurar que el nuevo correo no esté tomado por otro usuario diferente, actualiza los campos en MongoDB y devuelve HTTP 200 OK con el perfil modificado.</td>
  </tr>
  <tr>
    <td>10</td>
    <td></td>
    <td>El frontend actualiza los estados locales y el contexto de autenticación global (`useAuth`) y visualiza en pantalla un recuadro verde con la leyenda: "✅ Perfil actualizado exitosamente".</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 1: Omisión de datos obligatorios en perfil</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario borra por completo el texto de su Nombre o de su Correo e intenta presionar "Guardar Cambios".</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El frontend desactiva el botón de guardado y detiene el proceso antes de conectarse al servidor.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Muestra inmediatamente una alerta indicando que todos los campos son obligatorios.</td>
  </tr>
  <tr>
    <td colspan="3" align="center" ><b>Excepción 2: Correo electrónico tomado por otro usuario</b></td>
  </tr>
  <tr >
    <td><b>Paso</b></td>
    <td><b>ACTOR</b></td>
    <td><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario cambia su correo electrónico por una dirección que ya le pertenece a otra cuenta activa diferente y presiona "Guardar Cambios".</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>Pasa la validación visual y envía la solicitud HTTP PUT de actualización.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>El backend detecta la colisión en la base de datos de MongoDB al buscar otros usuarios con ese mismo correo electrónico y cancela la operación de guardado.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>Devuelve un código de error HTTP 400 Bad Request o 409 Conflict. El frontend captura la respuesta y plasma una alerta roja detallando el fallo del servidor para que el usuario pueda corregirlo.</td>
  </tr>
</table>

---

### **CU-13: Cerrar Sesión**

<table>
  <tr>
    <td width="20%"><b>Identificador</b></td>
    <td colspan="2"><b>CU-13</b></td>
  </tr>
  <tr>
    <td><b>Nombre</b></td>
    <td colspan="2">Cerrar Sesión (Logout)</td>
  </tr>
  <tr>
    <td><b>Actor Principal</b></td>
    <td colspan="2">Usuario Autenticado</td>
  </tr>
  <tr>
    <td><b>Precondición</b></td>
    <td colspan="2">El usuario se encuentra autenticado en el sistema.</td>
  </tr>
  <tr>
    <td><b>Postcondición</b></td>
    <td colspan="2">El sistema destruye el token de sesión JWT almacenado en el frontend, limpia el contexto reactivo y redirige al usuario a la pantalla pública de login.</td>
  </tr>
  <tr>
    <td colspan="3" align="center"><b>Flujo Principal</b></td>
  </tr>
  <tr>
    <td width="10%"><b>Paso</b></td>
    <td width="45%"><b>ACTOR</b></td>
    <td width="45%"><b>SISTEMA</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td>El usuario presiona el botón "Cerrar Sesión" (en el extremo derecho de la barra de navegación superior o dentro de la tarjeta de perfil).</td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td></td>
    <td>El sistema captura el clic, detiene cualquier acción en curso e invoca la función de desconexión `logout()` desde el servicio de autenticación.</td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>Remueve de manera permanente el token de seguridad y el objeto de datos del usuario guardados en el `localStorage` del navegador.</td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>Resetea el estado del contexto de autenticación global (`useAuth`) a valores nulos.</td>
  </tr>
  <tr>
    <td>5</td>
    <td></td>
    <td>Redirige al usuario de forma inmediata y forzada a la página de login (`/login`) impidiendo su retorno mediante el historial del navegador (`replace: true`).</td>
  </tr>
</table>

