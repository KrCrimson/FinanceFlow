/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/utils/totp.js
 * Capa / módulo ...: Backend · Seguridad (MFA)
 * Función .........: Núcleo de la verificación en dos pasos: contraseñas de un solo uso por tiempo (TOTP, RFC 6238) compatibles con Google/Microsoft Authenticator y Authy; cifra el secreto en la base de datos y genera y consume los códigos de recuperación.
 * Requerimientos ..: RF-41, RF-42, RF-43  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-01, RNF-02, RNF-05
 * Casos de uso ....: CU-02 Iniciar sesión
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-26, RN-27, RN-29
 * Lo usan .........: backend/integration/flujo-completo.itest.js
 *                    backend/services/usuarios.service.js
 * Pruebas .........: backend/__tests__/mfa.test.js
 *                    backend/__tests__/totp.test.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
'use strict';
/**
 * Verificación en dos pasos (MFA) con contraseñas de un solo uso basadas en el tiempo (TOTP, RFC 6238).
 * Compatible con Google Authenticator, Microsoft Authenticator, Authy y similares.
 *
 * Solo usa el módulo crypto de Node: no agrega dependencias.
 */
const crypto = require('crypto');

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // base32 (RFC 4648)
const PASO_SEGUNDOS = 30;
const DIGITOS = 6;
const EMISOR = 'FinanceFlow';

// ---------------------------------------------------------------- base32
function base32Codificar(buf) {
  let bits = 0, valor = 0, salida = '';
  for (const byte of buf) {
    valor = ((valor << 8) | byte) & 0xffffff;
    bits += 8;
    while (bits >= 5) {
      salida += ALFABETO[(valor >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) salida += ALFABETO[(valor << (5 - bits)) & 31];
  return salida;
}

function base32Decodificar(texto) {
  const limpio = String(texto).replace(/=+$/, '').replace(/[\s-]+/g, '').toUpperCase();
  let bits = 0, valor = 0;
  const salida = [];
  for (const c of limpio) {
    const i = ALFABETO.indexOf(c);
    if (i < 0) throw new Error('Base32 inválido');
    valor = ((valor << 5) | i) & 0xffffff;
    bits += 5;
    if (bits >= 8) {
      salida.push((valor >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(salida);
}

// ---------------------------------------------------------------- HOTP / TOTP
function hotp(secretoBuf, contador, digitos = DIGITOS, algoritmo = 'sha1') {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(contador));
  const h = crypto.createHmac(algoritmo, secretoBuf).update(msg).digest();
  const desplazamiento = h[h.length - 1] & 0x0f;
  const binario = ((h[desplazamiento] & 0x7f) << 24) | (h[desplazamiento + 1] << 16) | (h[desplazamiento + 2] << 8) | h[desplazamiento + 3];
  return String(binario % 10 ** digitos).padStart(digitos, '0');
}

const pasoDe = (ms, paso = PASO_SEGUNDOS) => Math.floor(ms / 1000 / paso);

function totp(secretoB32, { tiempo = Date.now(), paso = PASO_SEGUNDOS, digitos = DIGITOS, algoritmo = 'sha1' } = {}) {
  return hotp(base32Decodificar(secretoB32), pasoDe(tiempo, paso), digitos, algoritmo);
}

const iguales = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

/**
 * Verifica un código de 6 dígitos. Acepta el paso actual y los vecinos (ventana ±1 = ±30 s) para tolerar
 * diferencias de reloj, y rechaza cualquier paso ya usado (ultimoPaso) para impedir reutilizar un código.
 * @returns {number|null} el paso que coincidió, o null si el código no es válido.
 */
function verificarTotp(secretoB32, codigo, { tiempo = Date.now(), ventana = 1, ultimoPaso = 0 } = {}) {
  const limpio = String(codigo == null ? '' : codigo).replace(/\s+/g, '');
  if (!/^\d{6}$/.test(limpio)) return null;
  const secreto = base32Decodificar(secretoB32);
  const actual = pasoDe(tiempo);
  let coincide = null;
  for (let d = -ventana; d <= ventana; d += 1) {
    const paso = actual + d;
    const esperado = hotp(secreto, paso);
    if (iguales(esperado, limpio) && paso > ultimoPaso && coincide === null) coincide = paso; // sin cortocircuito: tiempo constante
  }
  return coincide;
}

const generarSecreto = () => base32Codificar(crypto.randomBytes(20)); // 160 bits

function urlOtpauth({ email, secreto, emisor = EMISOR }) {
  const etiqueta = `${encodeURIComponent(emisor)}:${encodeURIComponent(email)}`;
  return `otpauth://totp/${etiqueta}?secret=${secreto}&issuer=${encodeURIComponent(emisor)}&algorithm=SHA1&digits=${DIGITOS}&period=${PASO_SEGUNDOS}`;
}

// ---------------------------------------------------------------- cifrado del secreto en la base de datos
function claveDeCifrado() {
  const dedicada = process.env.MFA_ENCRYPTION_KEY;
  if (dedicada) {
    if (!/^[0-9a-fA-F]{64}$/.test(dedicada)) throw new Error('MFA_ENCRYPTION_KEY debe tener 64 caracteres hexadecimales (32 bytes)');
    return Buffer.from(dedicada, 'hex');
  }
  const base = process.env.JWT_SECRET;
  if (!base) throw new Error('No hay clave para cifrar el secreto MFA (defina MFA_ENCRYPTION_KEY o JWT_SECRET)');
  return crypto.createHash('sha256').update('financeflow-mfa:' + base).digest();
}

function cifrar(texto) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', claveDeCifrado(), iv);
  const cifrado = Buffer.concat([c.update(String(texto), 'utf8'), c.final()]);
  return ['v1', iv.toString('base64'), c.getAuthTag().toString('base64'), cifrado.toString('base64')].join(':');
}

function descifrar(valor) {
  const [version, iv, tag, cifrado] = String(valor).split(':');
  if (version !== 'v1' || !iv || !tag || !cifrado) throw new Error('Formato de secreto MFA no válido');
  const d = crypto.createDecipheriv('aes-256-gcm', claveDeCifrado(), Buffer.from(iv, 'base64'));
  d.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([d.update(Buffer.from(cifrado, 'base64')), d.final()]).toString('utf8');
}

// ---------------------------------------------------------------- códigos de recuperación
const normalizarRecuperacion = (c) => String(c || '').replace(/[\s-]+/g, '').toUpperCase();
const hashRecuperacion = (c) => crypto.createHash('sha256').update('rec:' + normalizarRecuperacion(c)).digest('hex');
const pareceRecuperacion = (c) => /^[A-Z2-7]{10}$/.test(normalizarRecuperacion(c));

/** Genera n códigos de un solo uso con formato XXXXX-XXXXX (50 bits cada uno). */
function generarCodigosRecuperacion(n = 8) {
  const claros = [];
  for (let i = 0; i < n; i += 1) {
    const b = crypto.randomBytes(10);
    let s = '';
    for (let k = 0; k < 10; k += 1) s += ALFABETO[b[k] & 31];
    claros.push(`${s.slice(0, 5)}-${s.slice(5)}`);
  }
  return { claros, hashes: claros.map(hashRecuperacion) };
}

/** Busca el código en la lista de hashes. Devuelve la lista sin ese código si coincide, o null. */
function consumirCodigoRecuperacion(hashes, codigo) {
  if (!pareceRecuperacion(codigo)) return null;
  const buscado = hashRecuperacion(codigo);
  let indice = -1;
  (hashes || []).forEach((h, i) => { if (iguales(h, buscado) && indice === -1) indice = i; });
  return indice === -1 ? null : hashes.filter((_, i) => i !== indice);
}

module.exports = {
  PASO_SEGUNDOS, DIGITOS, EMISOR,
  base32Codificar, base32Decodificar, hotp, totp, pasoDe, verificarTotp, generarSecreto, urlOtpauth,
  cifrar, descifrar, generarCodigosRecuperacion, consumirCodigoRecuperacion, pareceRecuperacion, hashRecuperacion,
};
