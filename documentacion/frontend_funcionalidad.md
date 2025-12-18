# Especificación de Funcionalidad y Vistas del Frontend

## Flujo General de la Web

1. **Login y Registro**
   - Pantalla de inicio de sesión (login) y registro de usuario.
   - Tras autenticarse, el usuario accede a su perfil y funcionalidades principales.
   - Opción de cerrar sesión (logout).

2. **Perfil de Usuario**
   - Vista para ver y editar datos del usuario.
   - Acceso a historial de movimientos y logs personales.

3. **Vista de Inicio (Dashboard)**
   - Listado de ingresos y egresos en una sola pantalla.
   - Visualización del balance general (ingresos - egresos).
   - Botón para inhabilitar movimientos (no se eliminan, pero se ven en gris y no afectan el balance ni los montos).

4. **Vista de Registro de Movimiento**
   - Formulario para agregar un movimiento con:
     - Nombre descriptivo
     - Descripción
     - Monto
     - Categoría
   - Opción para agregar una imagen: el sistema extrae automáticamente los datos del movimiento desde la imagen (usando Machine Learning si es posible).

5. **Vista de Reportes**
   - Gráficos y reportes de ingresos, egresos y balance.
   - Filtros por fecha, categoría, etc.

## Notas Técnicas
- Los movimientos inhabilitados siguen visibles pero no afectan cálculos.
- El procesamiento de imágenes para extraer datos puede implementarse con una API de ML o servicio externo.
- El flujo de navegación es: Login/Registro → Dashboard (inicio) → Registro de movimiento/Perfil/Reportes.

Esta especificación servirá como guía para la implementación de las vistas y funcionalidades del frontend.
