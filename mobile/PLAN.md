# Plan de Desarrollo Mobile (FinanceFlow App) 📱

Este documento traza la ruta para construir la versión móvil nativa de FinanceFlow reutilizando la lógica de la plataforma web.

## FASE 1: Configuración Base y Navegación
- [ ] Inicializar dependencias clave (`@react-navigation/native`, `expo-image-picker` para la cámara, `axios` o `fetch` para la API).
- [ ] Configurar el enrutador principal (`AppNavigator`) con navegación tipo *Tabs* (Dashboard, Nuevo Movimiento, Reportes).
- [ ] Configurar variables de entorno (URL del backend y de ML).

## FASE 2: Migración de Servicios y Lógica (Cerebro)
- [ ] Adaptar `movimientosService.js`: Reemplazar `localStorage` (Web) por `AsyncStorage` (React Native) para manejar los tokens de sesión.
- [ ] Migrar los hooks personalizados: `useMovimientos.js` y `useAnalisisGastos.js`. Como es lógica 100% JS pura, se copiarán casi sin modificaciones.

## FASE 3: Desarrollo de Pantallas Core (UI)
- [ ] **DashboardScreen**: Replicar la lista de movimientos recientes y el resumen mensual.
- [ ] **MovimientoFormScreen**: Construir el formulario de Nuevo Movimiento. Adaptar los `<input>` a `<TextInput>` y los select a Modal/Picker.
- [ ] **Integración OCR**: Usar `expo-image-picker` para permitir al usuario tomar una foto al voucher o subirla de la galería y enviarla al `ml_backend`.

## FASE 4: Gráficos y Visualización
- [ ] Incluir una librería de gráficos móvil (ej. `react-native-chart-kit` o `react-native-gifted-charts`).
- [ ] Replicar los componentes `GraficoBarras`, `GraficoLinea` y `GraficoCircular` adaptando la data que ya emite `useAnalisisGastos.js`.

## FASE 5: Pulido y Entorno de Producción
- [ ] Migrar la lógica de "Continuous Learning" silencioso al crear movimientos en el móvil.
- [ ] Pruebas finales en emulador Android / iOS.
- [ ] Preparación para generación de APK.