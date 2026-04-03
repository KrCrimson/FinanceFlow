import { useState } from 'react';

export function useImageToMovimiento() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const processImage = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('?? Enviando imagen al microservicio ML Python:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const API_URL = process.env.REACT_APP_ML_URL || 'http://localhost:8000';
      
      const response = await fetch(`${API_URL}/analyze-receipt`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al procesar la imagen con Machine Learning');
      }
      
      const res = await response.json();
      const data = res.data;
      
      console.log('? Respuesta del modelo ML:', data);
      
      setResult({
        monto: data.monto || '',
        nombre: data.descripcion || 'Movimiento detectado',
        categoria: data.categoria_ml || 'Otros',
        fecha: data.fecha.split('T')[0],
        origen: 'bcp',
        tipo: data.tipo || 'egreso'
      });
      
    } catch (e) {
      console.error('? Error en el OCR basado en ML:', e);
      setError('No se pudo procesar la imagen con el servicio ML avanzado. ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return { processImage, loading, result, error };
}
