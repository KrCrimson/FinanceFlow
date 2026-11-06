/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/ocr.service.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de ocr.service: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-15  (módulos: Comprobantes)
 * Calidad (RNF) ...: RNF-06
 * Casos de uso ....: CU-07 Cargar comprobante por imagen
 * Reglas de negocio : RN-15
 * Depende de ......: backend/services/ocr.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// El OCR con Gemini es el único camino de lectura de comprobantes: se prueba su parseo y sus fallos.
const mockGenerateContent = jest.fn();

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn(() => ({ generateContent: mockGenerateContent })),
  })),
}));

const cargarServicio = (apiKey) => {
  jest.resetModules();
  if (apiKey) process.env.GEMINI_API_KEY = apiKey;
  else delete process.env.GEMINI_API_KEY;
  return require('../services/ocr.service');
};

const respuestaGemini = (texto) => ({ response: { text: () => texto } });
const IMAGEN = 'data:image/png;base64,QUJDREVGRw==';

describe('ocr.service.analizarComprobante', () => {
  const claveOriginal = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    mockGenerateContent.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
    if (claveOriginal) process.env.GEMINI_API_KEY = claveOriginal;
    else delete process.env.GEMINI_API_KEY;
  });

  it('falla con un mensaje claro si el servidor no tiene la API key de Gemini', async () => {
    const ocr = cargarServicio(null);
    await expect(ocr.analizarComprobante(IMAGEN)).rejects.toThrow('API Key de Gemini no configurada');
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it('interpreta el JSON de Gemini y normaliza los campos', async () => {
    const ocr = cargarServicio('clave-test');
    mockGenerateContent.mockResolvedValue(
      respuestaGemini('{"monto": "25.5", "nombre": "Bodega Pepe", "categoria": "Comida", "fecha": "2026-10-20", "tipo": "egreso"}')
    );
    await expect(ocr.analizarComprobante(IMAGEN, 'image/png')).resolves.toEqual({
      monto: 25.5,
      nombre: 'Bodega Pepe',
      categoria: 'Comida',
      fecha: '2026-10-20',
      tipo: 'egreso',
    });
  });

  it('acepta la respuesta envuelta en bloques markdown', async () => {
    const ocr = cargarServicio('clave-test');
    mockGenerateContent.mockResolvedValue(respuestaGemini('```json\n{"monto": 10, "nombre": "Taxi"}\n```'));
    const r = await ocr.analizarComprobante(IMAGEN);
    expect(r.monto).toBe(10);
    expect(r.nombre).toBe('Taxi');
  });

  it('usa valores por defecto cuando Gemini no devuelve un campo', async () => {
    const ocr = cargarServicio('clave-test');
    mockGenerateContent.mockResolvedValue(respuestaGemini('{}'));
    const r = await ocr.analizarComprobante(IMAGEN);
    expect(r).toMatchObject({ monto: 0, nombre: 'Movimiento extraído con IA', categoria: 'Otros', tipo: 'egreso' });
    expect(r.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('envía solo el contenido base64 (sin el prefijo data:) y un mimeType de imagen válido', async () => {
    const ocr = cargarServicio('clave-test');
    mockGenerateContent.mockResolvedValue(respuestaGemini('{}'));
    await ocr.analizarComprobante(IMAGEN, 'application/pdf');
    const [, imagePart] = mockGenerateContent.mock.calls[0][0];
    expect(imagePart.inlineData.data).toBe('QUJDREVGRw==');
    expect(imagePart.inlineData.mimeType).toBe('image/jpeg');
  });

  it('si Gemini devuelve algo que no es JSON, lanza un error descriptivo', async () => {
    const ocr = cargarServicio('clave-test');
    mockGenerateContent.mockResolvedValue(respuestaGemini('no pude leer la imagen'));
    await expect(ocr.analizarComprobante(IMAGEN)).rejects.toThrow('No se pudo analizar la imagen con Gemini Vision');
  });

  it('si el SDK falla, reintenta con la API HTTP directa', async () => {
    const ocr = cargarServicio('clave-test');
    mockGenerateContent.mockRejectedValue(new Error('sdk roto'));
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: '{"monto": 7, "nombre": "Menú"}' }] } }] }),
    });
    const r = await ocr.analizarComprobante(IMAGEN);
    expect(r.monto).toBe(7);
    const [url, opciones] = global.fetch.mock.calls[0];
    expect(url).toMatch(/generativelanguage\.googleapis\.com/);
    expect(opciones.headers['X-goog-api-key']).toBe('clave-test');
  });

  it('si el SDK y la API HTTP fallan, propaga el error de Gemini', async () => {
    const ocr = cargarServicio('clave-test');
    mockGenerateContent.mockRejectedValue(new Error('sdk roto'));
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: { message: 'cuota agotada' } }) });
    await expect(ocr.analizarComprobante(IMAGEN)).rejects.toThrow('cuota agotada');
  });
});
