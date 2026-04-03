FROM python:3.10-slim

# Evitar que Python escriba archivos .pyc y forzar logs sin buffer
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instalar dependencias del sistema operativo (Requeridas por OpenCV y Tesseract)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-spa \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Configurar directorio de trabajo
WORKDIR /app

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 8000

# Iniciar FastAPI leyendo la variable PORT que inyecta Render
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"