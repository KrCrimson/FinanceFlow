const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const ocrService = {
  analizarComprobante: async (base64Image, mimeType = 'image/jpeg') => {
    if (!apiKey) {
      throw new Error('API Key de Gemini no configurada en el servidor');
    }

    try {
      // Limpiar prefijo data:image/...;base64, si viene incluido
      const cleanBase64 = base64Image.includes(',') 
        ? base64Image.split(',')[1] 
        : base64Image;

      const cleanMimeType = mimeType && mimeType.startsWith('image/') ? mimeType : 'image/jpeg';

      const prompt = `Analiza detenidamente esta imagen de un comprobante de pago, boleta, factura o voucher digital (ej: Yape, Plin, BCP, BBVA, Interbank, Yape QR).
Extrae exactamente los siguientes campos financieros y responde ÚNICAMENTE en formato JSON plano válido sin marcas de markdown:

{
  "monto": number,
  "nombre": string,
  "categoria": string,
  "fecha": string,
  "tipo": string
}`;

      let jsonText = '';
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        const imagePart = {
          inlineData: {
            data: cleanBase64,
            mimeType: cleanMimeType
          }
        };
        const result = await model.generateContent([prompt, imagePart]);
        jsonText = result.response.text().trim();
      } catch (sdkError) {
        console.warn('SDK falló, intentando petición HTTP directa a Gemini API...', sdkError.message);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: cleanMimeType,
                      data: cleanBase64
                    }
                  }
                ]
              }
            ]
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error?.message || 'Error de respuesta en la API de Gemini');
        }
        const resJson = await res.json();
        jsonText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }

      // Limpiar cualquier envoltura markdown ```json ... ```
      const jsonString = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
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
