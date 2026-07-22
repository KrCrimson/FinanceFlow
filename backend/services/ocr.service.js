const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const ocrService = {
  analizarComprobante: async (base64Image, mimeType = 'image/jpeg') => {
    if (!genAI) {
      throw new Error('API Key de Gemini no configurada en el servidor');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Limpiar prefijo data:image/...;base64, si viene incluido
      const cleanBase64 = base64Image.includes(',') 
        ? base64Image.split(',')[1] 
        : base64Image;

      const imagePart = {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg'
        }
      };

      const prompt = `Analiza detenidamente esta imagen de un comprobante de pago, boleta, factura o voucher digital (ej: Yape, Plin, BCP, BBVA, Interbank, Yape QR).
Extrae exactamente los siguientes campos financieros y responde ÚNICAMENTE en formato JSON plano válido sin marcas de markdown:

{
  "monto": number,
  "nombre": string,
  "categoria": string,
  "fecha": string,
  "tipo": string
}`;

      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text().trim();

      // Limpiar cualquier envoltura markdown ```json ... ```
      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(jsonString);

      return {
        monto: Number(parsedData.monto) || 0,
        nombre: parsedData.nombre || 'Movimiento extraído con IA',
        categoria: parsedData.categoria || 'Otros',
        fecha: parsedData.fecha || new Date().toISOString().slice(0, 10),
        tipo: parsedData.tipo || 'egreso'
      };
    } catch (error) {
      console.error('Error procesando imagen con Gemini Vision:', error);
      throw new Error('No se pudo analizar la imagen con Gemini Vision: ' + error.message);
    }
  }
};

module.exports = ocrService;
