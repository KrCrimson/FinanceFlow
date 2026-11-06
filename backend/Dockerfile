FROM node:20-alpine

WORKDIR /app

# Copiar manifiestos de paquetes
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --omit=dev

# Copiar el código fuente
COPY . .

# Exponer el puerto del backend
EXPOSE 5000

# Ejecutar backend
CMD ["node", "app.js"]
