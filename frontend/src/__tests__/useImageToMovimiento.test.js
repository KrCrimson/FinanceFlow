/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/useImageToMovimiento.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de useImageToMovimiento: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-15, RF-16  (módulos: Comprobantes)
 * Casos de uso ....: CU-07 Cargar comprobante por imagen
 * Reglas de negocio : RN-15
 * Depende de ......: frontend/src/hooks/useImageToMovimiento.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { renderHook, act } from '@testing-library/react';
import { useImageToMovimiento } from '../hooks/useImageToMovimiento';

const archivo = () => new File(['contenido-de-imagen'], 'boleta.png', { type: 'image/png' });
const respuesta = (status, cuerpo) => ({ ok: status >= 200 && status < 300, status, json: async () => cuerpo });

async function procesar(file = archivo()) {
  const hook = renderHook(() => useImageToMovimiento());
  await act(async () => {
    await hook.result.current.processImage(file);
  });
  return hook.result;
}

beforeEach(() => {
  global.fetch = jest.fn();
  localStorage.setItem('token', 'jwt-abc');
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe('useImageToMovimiento (OCR con Gemini a través del backend)', () => {
  it('envía la imagen al backend con la sesión y devuelve los datos detectados', async () => {
    global.fetch.mockResolvedValue(
      respuesta(200, { success: true, data: { monto: 25.5, nombre: 'Bodega', categoria: 'Comida', fecha: '2026-10-20T10:00:00Z', tipo: 'egreso' } })
    );
    const r = await procesar();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, opciones] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/api\/movimientos\/ocr$/);
    expect(opciones.headers.Authorization).toBe('Bearer jwt-abc');
    const cuerpo = JSON.parse(opciones.body);
    expect(cuerpo.mimeType).toBe('image/png');
    expect(cuerpo.imageBase64).toMatch(/^data:image\/png;base64,/);
    expect(r.current.result).toEqual({ monto: 25.5, nombre: 'Bodega', categoria: 'Comida', fecha: '2026-10-20', tipo: 'egreso' });
    expect(r.current.error).toBeNull();
    expect(r.current.loading).toBe(false);
  });

  it('completa con valores por defecto lo que Gemini no detecte', async () => {
    global.fetch.mockResolvedValue(respuesta(200, { success: true, data: {} }));
    const r = await procesar();
    expect(r.current.result).toMatchObject({ monto: '', nombre: 'Movimiento detectado', categoria: 'Otros', tipo: 'egreso' });
  });

  it('al agotar la cuota del plan gratuito muestra el aviso del servidor y NO usa otro servicio', async () => {
    global.fetch.mockResolvedValue(
      respuesta(403, { error: 'Has alcanzado el límite mensual de 5 escaneos.', limiteAlcanzado: true })
    );
    const r = await procesar();
    expect(r.current.error).toBe('Has alcanzado el límite mensual de 5 escaneos.');
    expect(r.current.result).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('si el backend falla muestra un error genérico y no intenta ningún respaldo', async () => {
    global.fetch.mockResolvedValue(respuesta(500, { error: 'Gemini caído' }));
    const r = await procesar();
    expect(r.current.error).toMatch(/No se pudo procesar la imagen/);
    expect(r.current.result).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('si no hay red muestra el error genérico', async () => {
    global.fetch.mockRejectedValue(new Error('sin red'));
    const r = await procesar();
    expect(r.current.error).toMatch(/No se pudo procesar la imagen/);
    expect(r.current.loading).toBe(false);
  });

  it('una respuesta 200 sin datos también se trata como error', async () => {
    global.fetch.mockResolvedValue(respuesta(200, { success: false }));
    const r = await procesar();
    expect(r.current.error).toMatch(/No se pudo procesar la imagen/);
  });
});
