/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/totp.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas del TOTP con los vectores oficiales del RFC 6238, el cifrado del secreto y los códigos de recuperación.
 * Requerimientos ..: RF-41, RF-42, RF-43  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-01, RNF-02, RNF-05
 * Casos de uso ....: CU-02 Iniciar sesión
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-26, RN-27, RN-29
 * Depende de ......: backend/utils/totp.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const t = require('../utils/totp');

// Vectores oficiales del RFC 6238 (Apéndice B), SHA-1, secreto ASCII "12345678901234567890"
const SECRETO_RFC = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

describe('TOTP (RFC 6238)', () => {
  test.each([
    [59, '94287082'],
    [1111111109, '07081804'],
    [1111111111, '14050471'],
    [1234567890, '89005924'],
    [2000000000, '69279037'],
    [20000000000, '65353130'],
  ])('vector oficial: t=%i → %s', (segundos, esperado) => {
    expect(t.totp(SECRETO_RFC, { tiempo: segundos * 1000, digitos: 8 })).toBe(esperado);
  });

  test('base32 ida y vuelta conserva los bytes', () => {
    const bytes = Buffer.from('FinanceFlow-MFA 2026 ñ');
    expect(t.base32Decodificar(t.base32Codificar(bytes)).equals(bytes)).toBe(true);
    expect(t.base32Codificar(Buffer.from('12345678901234567890'))).toBe(SECRETO_RFC);
  });

  test('base32 rechaza caracteres inválidos', () => {
    expect(() => t.base32Decodificar('ABC1')).toThrow('Base32 inválido');
  });

  test('el secreto generado tiene 32 caracteres base32 y es distinto cada vez', () => {
    const a = t.generarSecreto(); const b = t.generarSecreto();
    expect(a).toMatch(/^[A-Z2-7]{32}$/);
    expect(a).not.toBe(b);
  });
});

describe('verificarTotp', () => {
  const ahora = 1700000000000;
  const codigoEn = (ms) => t.totp(SECRETO_RFC, { tiempo: ms });

  test('acepta el código del paso actual y devuelve el paso', () => {
    expect(t.verificarTotp(SECRETO_RFC, codigoEn(ahora), { tiempo: ahora })).toBe(t.pasoDe(ahora));
  });

  test('acepta el paso anterior y el siguiente (ventana ±1) pero no dos pasos de distancia', () => {
    expect(t.verificarTotp(SECRETO_RFC, codigoEn(ahora - 30000), { tiempo: ahora })).toBe(t.pasoDe(ahora) - 1);
    expect(t.verificarTotp(SECRETO_RFC, codigoEn(ahora + 30000), { tiempo: ahora })).toBe(t.pasoDe(ahora) + 1);
    expect(t.verificarTotp(SECRETO_RFC, codigoEn(ahora - 90000), { tiempo: ahora })).toBeNull();
    expect(t.verificarTotp(SECRETO_RFC, codigoEn(ahora + 90000), { tiempo: ahora })).toBeNull();
  });

  test('rechaza reutilizar un paso ya usado (ultimoPaso)', () => {
    const paso = t.pasoDe(ahora);
    expect(t.verificarTotp(SECRETO_RFC, codigoEn(ahora), { tiempo: ahora, ultimoPaso: paso })).toBeNull();
    expect(t.verificarTotp(SECRETO_RFC, codigoEn(ahora), { tiempo: ahora, ultimoPaso: paso - 1 })).toBe(paso);
  });

  test.each([['', 'vacío'], [null, 'nulo'], ['12345', '5 dígitos'], ['1234567', '7 dígitos'], ['abcdef', 'letras'], ['12 34x6', 'con basura']])(
    'rechaza formato no válido (%s: %s)', (valor) => {
      expect(t.verificarTotp(SECRETO_RFC, valor, { tiempo: ahora })).toBeNull();
    });

  test('tolera espacios dentro del código (123 456)', () => {
    const c = codigoEn(ahora);
    expect(t.verificarTotp(SECRETO_RFC, `${c.slice(0, 3)} ${c.slice(3)}`, { tiempo: ahora })).toBe(t.pasoDe(ahora));
  });

  test('un código de otro secreto no sirve', () => {
    const otro = t.generarSecreto();
    expect(t.verificarTotp(SECRETO_RFC, t.totp(otro, { tiempo: ahora }), { tiempo: ahora })).toBeNull();
  });
});

describe('urlOtpauth', () => {
  test('arma la dirección que leen las apps autenticadoras', () => {
    const url = t.urlOtpauth({ email: 'ana+test@correo.com', secreto: 'ABC234' });
    expect(url).toBe('otpauth://totp/FinanceFlow:ana%2Btest%40correo.com?secret=ABC234&issuer=FinanceFlow&algorithm=SHA1&digits=6&period=30');
  });
});

describe('cifrado del secreto', () => {
  const original = { ...process.env };
  afterEach(() => { process.env = { ...original }; });

  test('descifrar(cifrar(x)) devuelve x y el resultado no contiene el secreto', () => {
    const c = t.cifrar(SECRETO_RFC);
    expect(c).toMatch(/^v1:/);
    expect(c).not.toContain(SECRETO_RFC);
    expect(t.descifrar(c)).toBe(SECRETO_RFC);
  });

  test('cada cifrado es distinto (IV aleatorio)', () => {
    expect(t.cifrar('x')).not.toBe(t.cifrar('x'));
  });

  test('un valor alterado no se puede descifrar', () => {
    const partes = t.cifrar('secreto').split(':');
    partes[3] = Buffer.from('alterado!!').toString('base64');
    expect(() => t.descifrar(partes.join(':'))).toThrow();
  });

  test('con otra clave no se puede descifrar', () => {
    const c = t.cifrar('secreto');
    process.env.MFA_ENCRYPTION_KEY = 'a'.repeat(64);
    expect(() => t.descifrar(c)).toThrow();
  });

  test('MFA_ENCRYPTION_KEY con formato incorrecto da error claro', () => {
    process.env.MFA_ENCRYPTION_KEY = 'corta';
    expect(() => t.cifrar('x')).toThrow('64 caracteres hexadecimales');
  });

  test('sin ninguna clave configurada no cifra', () => {
    delete process.env.MFA_ENCRYPTION_KEY; delete process.env.JWT_SECRET;
    expect(() => t.cifrar('x')).toThrow('No hay clave');
  });
});

describe('códigos de recuperación', () => {
  test('genera 8 códigos únicos con formato XXXXX-XXXXX y sus hashes', () => {
    const { claros, hashes } = t.generarCodigosRecuperacion();
    expect(claros).toHaveLength(8);
    expect(new Set(claros).size).toBe(8);
    claros.forEach((c) => expect(c).toMatch(/^[A-Z2-7]{5}-[A-Z2-7]{5}$/));
    expect(hashes).toHaveLength(8);
    expect(hashes.join('')).not.toContain(claros[0].replace('-', ''));
  });

  test('un código se acepta una sola vez (se retira de la lista)', () => {
    const { claros, hashes } = t.generarCodigosRecuperacion();
    const restantes = t.consumirCodigoRecuperacion(hashes, claros[3]);
    expect(restantes).toHaveLength(7);
    expect(t.consumirCodigoRecuperacion(restantes, claros[3])).toBeNull();
  });

  test('acepta minúsculas, espacios y sin guion', () => {
    const { claros, hashes } = t.generarCodigosRecuperacion();
    const raro = ` ${claros[0].replace('-', '').toLowerCase()} `;
    expect(t.consumirCodigoRecuperacion(hashes, raro)).toHaveLength(7);
  });

  test('rechaza códigos inventados o con formato incorrecto', () => {
    const { hashes } = t.generarCodigosRecuperacion();
    expect(t.consumirCodigoRecuperacion(hashes, 'AAAAA-AAAAA')).toBeNull();
    expect(t.consumirCodigoRecuperacion(hashes, '123456')).toBeNull();
    expect(t.consumirCodigoRecuperacion(hashes, '')).toBeNull();
    expect(t.consumirCodigoRecuperacion([], 'AAAAA-AAAAA')).toBeNull();
  });
});
