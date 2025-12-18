// Utilidades avanzadas para preprocesar imágenes antes del OCR
export const preprocessImageForOCR = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Escalar imagen para mejor OCR (mínimo 300 DPI equivalente)
      const scale = Math.max(1, 1200 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      // Configurar canvas para mejor calidad
      ctx.imageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      
      // Dibujar imagen escalada
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Obtener datos de píxeles
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // MEJORA AVANZADA: Procesamiento especializado para vouchers morados
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Detectar si es fondo morado (alta componente azul/roja, baja verde)
        const isMorado = (r > 100 && b > 150 && g < 100);
        
        if (isMorado) {
          // Fondo morado → convertir a blanco
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          // Texto/contenido → mejorar contraste y convertir a negro/blanco
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          
          // Contraste agresivo para texto claro sobre fondo morado
          const enhanced = gray < 200 ? 0 : 255;
          
          data[i] = enhanced;
          data[i + 1] = enhanced;
          data[i + 2] = enhanced;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Convertir canvas a blob
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 1.0);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// MEJORA ESPECIALIZADA: Recortar zona específica del monto para Yape
export const cropAmountRegion = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Para vouchers de Yape: el monto está en la parte superior-central
      const cropHeight = Math.floor(img.height * 0.25); // Solo 25% superior donde está "S/60"
      const cropWidth = Math.floor(img.width * 0.6);    // 60% del ancho, centrado
      const startX = Math.floor(img.width * 0.2);       // Centrado horizontalmente
      const startY = Math.floor(img.height * 0.15);     // Empezar un poco más abajo del "¡Yapeaste!"
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      // Configurar para máxima nitidez
      ctx.imageSmoothingEnabled = false;
      
      // Recortar exactamente la zona del monto
      ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 1.0);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// NUEVA: Función combinada - preprocesar Y recortar en un solo paso
export const preprocessAndCropAmount = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Dimensiones de recorte para la zona del monto
      const cropHeight = Math.floor(img.height * 0.25);
      const cropWidth = Math.floor(img.width * 0.6);
      const startX = Math.floor(img.width * 0.2);
      const startY = Math.floor(img.height * 0.15);
      
      // Escalar para mejor OCR
      const scale = Math.max(2, 800 / Math.max(cropWidth, cropHeight));
      canvas.width = cropWidth * scale;
      canvas.height = cropHeight * scale;
      
      ctx.imageSmoothingEnabled = false;
      
      // Dibujar la región recortada y escalada
      ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
      
      // Aplicar preprocesamiento a la región recortada
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Detectar fondo morado y texto
        const isMorado = (r > 100 && b > 150 && g < 100);
        
        if (isMorado) {
          // Fondo morado → blanco
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          // Texto → negro puro
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          const enhanced = gray < 180 ? 0 : 255;
          
          data[i] = enhanced;
          data[i + 1] = enhanced;
          data[i + 2] = enhanced;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 1.0);
    };
    
    img.src = URL.createObjectURL(file);
  });
};