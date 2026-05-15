# 📱 FinanceFlow Mobile

Aplicación móvil nativa construida con **React Native** y **Expo** para el ecosistema FinanceFlow.

## 🏗️ Arquitectura Monorepo
Esta aplicación es un cliente más dentro de nuestro ecosistema. Funciona como una capa de presentación nativa que se conecta directamente a:
1. **API Principal (Node.js/Express):** Para la gestión en tiempo real de transacciones, presupuestos y usuarios de MongoDB.
2. **Brain API (Python/FastAPI):** Para la lectura inteligente de vouchers (OCR) y categorización con Machine Learning continuo.

## 🚀 Cómo Iniciar el Proyecto

1. Posiciónate en la carpeta `mobile/`:
   ```bash
   cd mobile
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo de Expo:
   ```bash
   npx expo start
   ```

4. **Para probar la App:**
   - Instala la app **"Expo Go"** en tu celular (iOS / Android).
   - Escanea el código QR que aparecerá en tu terminal o en la ventana del navegador.
   - ¡Verás la app nativa corriendo directamente en tu dispositivo físico en tiempo real!

## 🧩 Estructura de Directorios
* `/assets`: Imágenes estáticas, iconos y fuentes.
* `/src/components`: Componentes visuales reutilizables (Botones, Tarjetas, Gráficos).
* `/src/screens`: Las pantallas completas (Dashboard, Perfil, OCR).
* `/src/hooks`: Reglas de negocio e Inteligencia Matemática (Portados directamente de la Web).
* `/src/services`: Conexiones a nuestros microservicios Rest.