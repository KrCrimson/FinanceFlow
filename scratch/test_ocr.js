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
