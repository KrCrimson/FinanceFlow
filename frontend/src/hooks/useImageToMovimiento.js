import { useState } from 'react';

export function useImageToMovimiento() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });

  const processImage = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const base64 = await fileToBase64(file);
      const API_BASE = process.env.REACT_APP_API_URL || 'https://financeflow-backend-4fbw.onrender.com';
      const token = localStorage.getItem('token');

      // 1. Potenciado con Gemini 1.5 Flash Vision mediante el Backend
      const response = await fetch(`${API_BASE}/api/movimientos/ocr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: file.type || 'image/jpeg'
        })
      });

      if (response.ok) {
        const res = await response.json();
        if (res.success && res.data) {
          setResult({
            monto: res.data.monto || '',
            nombre: res.data.nombre || 'Movimiento detectado',
            categoria: res.data.categoria || 'Otros',
            fecha: res.data.fecha ? res.data.fecha.split('T')[0] : new Date().toISOString().slice(0, 10),
            tipo: res.data.tipo || 'egreso'
          });
          return;
        }
      }

      // 2. Fallback: Microservicio ML de Render
      const formData = new FormData();
      formData.append('file', file);
      const ML_URL = process.env.REACT_APP_ML_URL || 'https://financeflow-ml.onrender.com';
      const mlResponse = await fetch(`${ML_URL}/analyze-receipt`, {
        method: 'POST',
        body: formData,
      });

      if (!mlResponse.ok) {
        throw new Error('No se pudo analizar el comprobante');
      }

      const mlRes = await mlResponse.json();
      const data = mlRes.data;

      setResult({
        monto: data.monto || '',
        nombre: data.descripcion || 'Movimiento detectado',
        categoria: data.categoria_ml || 'Otros',
        fecha: data.fecha ? data.fecha.split('T')[0] : new Date().toISOString().slice(0, 10),
        tipo: data.tipo || 'egreso'
      });
    } catch (e) {
      console.error('Error en OCR inteligente:', e);
      setError('No se pudo procesar la imagen. Verifica que sea una captura o boleta clara.');
    } finally {
      setLoading(false);
    }
  };

  return { processImage, loading, result, error };
}
