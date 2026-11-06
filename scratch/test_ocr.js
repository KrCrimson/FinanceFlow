/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: scratch/test_ocr.js
 * Capa / módulo ...: Utilitario de desarrollo
 * Función .........: Prueba manual de la lectura de comprobantes. No forma parte del sistema entregado.
 * Requerimientos ..: RF-15  (módulos: Comprobantes)
 * Casos de uso ....: CU-07 Cargar comprobante por imagen
 * Depende de ......: backend/services/ocr.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const ocrService = require('../backend/services/ocr.service');

async function test() {
  console.log('Testing updated ocrService with gemini-flash-latest...');
  const dummyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  try {
    const res = await ocrService.analizarComprobante(dummyBase64, 'image/png');
    console.log('SUCCESS Result:', res);
  } catch (err) {
    console.error('FAIL Error:', err.message);
  }
}

test();
