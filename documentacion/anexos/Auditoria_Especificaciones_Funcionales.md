# Auditoría de Especificaciones Funcionales — Sistema de Balance (FinanceFlow)

CSW-2 · Laboratorio: Especificaciones Funcionales y su correspondencia en Análisis, Diseño e Implementación.

## 1. Las 3 etapas del ciclo de vida + Factibilidad

### a. Análisis de Requisitos
**Objetivo de la auditoría:** verificar que los requisitos funcionales estén claramente definidos y alineados con las expectativas del usuario final.

**Actividades de auditoría:**
- Revisar que los requisitos sean completos y cubran todos los aspectos del sistema.
- Comprobar que no haya ambigüedades (usando ejemplos o escenarios concretos).
- Asegurar que los requisitos sean verificables y medibles.
- Verificar la trazabilidad: cada requisito debe poder rastrearse hasta la necesidad del usuario final.
- Validar la viabilidad técnica y económica de los requisitos (**esto es la Factibilidad**, ver abajo).

**Aplicado a FinanceFlow:** el Documento de Requisitos, los Casos de Uso (Registrar Usuario, Iniciar Sesión, Registrar Movimiento, Recuperar Contraseña...) y el Modelo de Procesos.

### b. Diseño
**Objetivo de la auditoría:** asegurar que el diseño propuesto refleje correctamente las especificaciones funcionales.

**Actividades de auditoría:**
- Revisar la arquitectura y los diagramas de diseño frente a los requisitos.
- Validar que las interfaces y la interacción entre módulos se alineen con las necesidades del usuario.
- Comprobar que el diseño permita una implementación eficiente, escalable y mantenible.
- Verificar que esté libre de errores previsibles de implementación (rendimiento, seguridad).
- Validar la trazabilidad entre especificaciones y componentes del diseño.

**Aplicado a FinanceFlow:** los Diagramas UML (Paquete, Caso de Uso, Secuencia, Clases, Proceso) y el Modelo de Base de Datos (esquemas Mongoose) de cada caso de uso.

### c. Implementación
**Objetivo de la auditoría:** verificar que la implementación refleje fielmente las especificaciones funcionales y el diseño aprobado.

**Actividades de auditoría:**
- Asegurar que el código cumpla los requisitos funcionales establecidos.
- Ejecutar pruebas de validación (el código coincide con lo especificado).
- Verificar que la documentación del código sea clara.
- Comprobar la calidad mediante pruebas unitarias, de integración y de aceptación.

**Aplicado a FinanceFlow:** el código real (`usuarios.controller.js`, `movimientos.controller.js`, etc.) y la suite Jest en `backend/__tests__/` (12 archivos, corridos en CI).

### Factibilidad
No es una 4ta etapa separada del ciclo de vida — es un **entregable de la etapa de Análisis** (el "Informe de Factibilidad") que valida si el requisito es viable técnica y económicamente *antes* de pasar a Diseño. En la matriz de trazabilidad se relaciona así:

```
Informe de Factibilidad  --Define-->  Arquitectura del Software  --Define-->  Integración de Módulos
   (Análisis)                              (Diseño)                            (Implementación)
```

Es decir: la Factibilidad no genera un diagrama UML por caso de uso como los demás entregables, sino que **condiciona la arquitectura general** (p. ej., en FinanceFlow: usar MongoDB/Mongoose por costo y velocidad de desarrollo, JWT en vez de sesiones server-side por ser stateless y económico de escalar, tres pasarelas de pago —MercadoPago/Stripe/Flow— evaluadas por factibilidad económica de comisión y cobertura regional).

## 2. Los componentes

"Componente" aquí es cada **entregable auditable** en la matriz de trazabilidad SRS → SAD → Implementación. Por etapa:

| Etapa | Componentes (entregables) |
|---|---|
| Análisis | Documento de Requisitos, Casos de Uso, Modelo de Procesos, Informe de Factibilidad, Validación con Stakeholders |
| Diseño | Diagramas UML, Diseño de Interfaces, Modelo de Base de Datos, Arquitectura del Software, Prototipos UI/UX |
| Implementación | Desarrollo del Código, Desarrollo de la UI, Implementación de la BD, Integración de Módulos, Manual de Usuario |

Y por cada Caso de Uso, los componentes que exige la plantilla (`Trazabilidad Implementación.xlsx`) son 5 diagramas espejados en Análisis y Diseño (Paquete, Caso de Uso, Secuencia, Clases, Proceso) más los objetos de programación reales en Implementación. El detalle completo, aplicado a 4 casos de uso de FinanceFlow, está en [Trazabilidad_Implementacion_FinanceFlow.xlsx](Trazabilidad_Implementacion_FinanceFlow.xlsx).

## 3. Revisar el aula (Excel guía)

Pendiente del alumno — requiere acceso al campus virtual UPT, no es algo verificable desde el código del repositorio.
