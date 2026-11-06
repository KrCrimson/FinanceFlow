/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/hooks/useImageToMovimiento.js
 * Capa / módulo ...: Frontend · Hook
 * Función .........: Envía la imagen del comprobante para su lectura y entrega los datos propuestos o el error.
 * Requerimientos ..: RF-15, RF-16  (módulos: Comprobantes)
 * Casos de uso ....: CU-07 Cargar comprobante por imagen
 * Reglas de negocio : RN-15
 * Lo usan .........: frontend/src/pages/MovimientoFormPage.jsx
 * Pruebas .........: frontend/src/__tests__/useImageToMovimiento.test.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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

      // El OCR lo hace el backend con Gemini Vision (la clave nunca llega al navegador)
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

      const res = await response.json().catch(() => ({}));

      if (response.ok && res.success && res.data) {
        setResult({
          monto: res.data.monto || '',
          nombre: res.data.nombre || 'Movimiento detectado',
          categoria: res.data.categoria || 'Otros',
          fecha: res.data.fecha ? res.data.fecha.split('T')[0] : new Date().toISOString().slice(0, 10),
          tipo: res.data.tipo || 'egreso'
        });
        return;
      }

      // Límite mensual del plan gratuito: se muestra el aviso del servidor (no hay otro servicio de respaldo).
      if (response.status === 403 && res.limiteAlcanzado) {
        setError(res.error || 'Alcanzaste el límite mensual de escaneos. Actualiza a Pro para uso ilimitado.');
        return;
      }

      throw new Error(res.error || 'No se pudo analizar el comprobante');
    } catch (e) {
      console.error('Error en OCR inteligente:', e);
      setError('No se pudo procesar la imagen. Verifica que sea una captura o boleta clara.');
    } finally {
      setLoading(false);
    }
  };

  return { processImage, loading, result, error };
}
