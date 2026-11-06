#!/usr/bin/env node
/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: scripts/secret-scan.js
 * Capa / módulo ...: Operación · Seguridad
 * Función .........: Detector de secretos que corre en los hooks pre-commit y pre-push: bloquea archivos .env, comprimidos y llaves, y claves con formato conocido (Mongo, Google, Culqi, Brevo, Sentry, etc.).
 * Calidad (RNF) ...: RNF-01, RNF-02
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
/**
 * FinanceFlow · Detector de secretos (sin dependencias)
 *
 * Bloquea commits y pushes que incluyan claves, contraseñas, archivos .env o paquetes comprimidos.
 *
 * Uso:
 *   node scripts/secret-scan.js --staged            revisa lo que está en el área de preparación (pre-commit)
 *   node scripts/secret-scan.js --push              revisa los commits que se van a subir; lee las líneas que Git envía por stdin (pre-push)
 *   node scripts/secret-scan.js --all               revisa todos los archivos rastreados (calibración / auditoría)
 *
 * Permitir un caso legítimo:
 *   - Línea: agregar al final del renglón el comentario  secretscan:allow
 *   - Archivo o carpeta: agregar su ruta (admite * y **) a  .secretscan-allow
 * Emergencia (queda bajo tu responsabilidad):  SKIP_SECRET_SCAN=1 git commit ...   o   git commit --no-verify
 */
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MAX_BYTES = 2 * 1024 * 1024;
const git = (args, opts = {}) =>
  execFileSync('git', args, { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'], ...opts });

const root = git(['rev-parse', '--show-toplevel']).trim();

// ---------------------------------------------------------------- permitidos
function globToRegex(g) {
  const esc = g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*');
  return new RegExp('^' + esc + '$');
}
let allowRes = [];
try {
  allowRes = fs.readFileSync(path.join(root, '.secretscan-allow'), 'utf8')
    .split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map(globToRegex);
} catch (_) { /* sin archivo de permitidos */ }
const permitido = (f) => allowRes.some((r) => r.test(f));

// ---------------------------------------------------------------- reglas por nombre de archivo
const REGLAS_NOMBRE = [
  { id: 'archivo-env', re: /(^|\/)\.env(\.(?!example$|sample$|template$|dist$)[^/]+)?$/i, msg: 'Archivo de variables de entorno (.env): nunca se sube; usa .env.example con valores de relleno.' },
  { id: 'archivo-comprimido', re: /\.(zip|rar|7z|tar|tgz|gz|bz2|xz|jar|war)$/i, msg: 'Archivo comprimido: puede esconder .env y claves. Si es legítimo, agrégalo a .secretscan-allow.' },
  { id: 'llave-privada', re: /\.(pem|key|p12|pfx|jks|keystore|ppk)$/i, msg: 'Archivo de llave privada o certificado.' },
  { id: 'ssh', re: /(^|\/)id_(rsa|dsa|ecdsa|ed25519)$/, msg: 'Llave SSH privada.' },
  { id: 'credenciales-nube', re: /(^|\/)(service[-_]?account.*\.json|credentials\.json|client_secret.*\.json|\.npmrc|\.pypirc|\.netrc)$/i, msg: 'Archivo de credenciales.' },
];

// ---------------------------------------------------------------- reglas por contenido
const RELLENO = /(password|tu[-_ ]|your|changeme|example|ejemplo|xxxx|\*{3,}|<[^>]+>|\$\{|{{|usuario:|placeholder|dummy|fake|secret_here|clave|contrase)/i;
const REGLAS = [
  { id: 'mongodb-uri', re: /mongodb(?:\+srv)?:\/\/([^\s:@/'"`<>]+):([^\s@'"`<>]+)@/i, ok: (m) => RELLENO.test(m[0]) || /^(user|usuario|admin|root)$/i.test(m[1]) && RELLENO.test(m[2]), msg: 'Cadena de conexión de MongoDB con usuario y contraseña.' },
  { id: 'google-api', re: /(AIza[0-9A-Za-z_-]{35}|AQ\.[0-9A-Za-z_-]{30,})/, msg: 'Clave de API de Google/Gemini.' },
  { id: 'culqi-secreta', re: /sk_(live|test)_[0-9A-Za-z]{10,}/, msg: 'Llave secreta de Culqi.' },
  { id: 'resend', re: /\bre_[A-Za-z0-9]{20,}\b/, msg: 'Clave de Resend.' },
  { id: 'brevo', re: /xkeysib-[a-f0-9]{30,}-[A-Za-z0-9]+/, msg: 'Clave de API de Brevo.' },
  { id: 'sendgrid', re: /SG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}/, msg: 'Clave de SendGrid.' },
  { id: 'sentry-dsn', re: /https:\/\/[0-9a-f]{32}@[a-z0-9.-]*sentry\.io\/\d+/i, msg: 'DSN de Sentry.' },
  { id: 'github-token', re: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/, msg: 'Token de GitHub.' },
  { id: 'aws-key', re: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/, msg: 'Clave de acceso de AWS.' },
  { id: 'slack', re: /\bxox[baprs]-[0-9A-Za-z-]{10,}/, msg: 'Token de Slack.' },
  { id: 'llave-privada-texto', re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY(?: BLOCK)?-----/, msg: 'Llave privada en texto.' },
  {
    id: 'secreto-asignado',
    // NOMBRE_SECRETO = valor  (o "nombre": "valor") con un valor largo y literal
    re: /\b([A-Z][A-Z0-9_]*(?:SECRET|PASSWORD|PASSWD|TOKEN|API_?KEY|PRIVATE_?KEY|DSN|CLIENT_SECRET)[A-Z0-9_]*|jwtSecret|secretKey|apiKey|accessToken)\b["']?\s*[:=]\s*["']?([A-Za-z0-9+/_\-.!@#$%^&*=]{16,})["']?/,
    ok: (m, linea) => {
      const v = m[2];
      if (RELLENO.test(v) || /test|mock|jest|demo|local|process\.env|import\.meta|req\.|\.body|config\.|env\./i.test(v)) return true;
      if (/process\.env|import\.meta|\$\{|os\.environ|getenv/i.test(linea)) return true;
      if (!/\d/.test(v) || !/[A-Za-z]/.test(v)) return true; // sin mezcla de letras y números: probablemente nombre de variable o texto
      if (/^[A-Za-z]+(\.[A-Za-z]+)+$/.test(v)) return true;   // algo.como.esto
      return false;
    },
    msg: 'Posible secreto escrito directamente (clave, token o contraseña).',
  },
];

const enmascarar = (s) => (s.length <= 10 ? '****' : s.slice(0, 4) + '…' + '*'.repeat(4) + ' (' + s.length + ' car.)');

// ---------------------------------------------------------------- análisis
const hallazgos = [];
function revisarNombre(archivo, origen) {
  if (permitido(archivo)) return;
  for (const r of REGLAS_NOMBRE) {
    if (r.re.test(archivo)) hallazgos.push({ archivo, linea: 0, regla: r.id, msg: r.msg, muestra: '', origen });
  }
}
function revisarLinea(archivo, nLinea, texto, origen) {
  if (texto.length > 4000 || /secretscan:allow/.test(texto) || permitido(archivo)) return;
  for (const r of REGLAS) {
    const m = r.re.exec(texto);
    if (!m) continue;
    if (r.ok && r.ok(m, texto)) continue;
    hallazgos.push({ archivo, linea: nLinea, regla: r.id, msg: r.msg, muestra: enmascarar(m[0]), origen });
  }
}

// Recorre un diff unificado (-U0) y revisa solo las líneas agregadas
function revisarDiff(diffTexto, origen) {
  let archivo = null, n = 0;
  for (const ln of diffTexto.split('\n')) {
    if (ln.startsWith('+++ ')) { archivo = ln.slice(4).replace(/^b\//, ''); if (archivo === '/dev/null') archivo = null; continue; }
    const h = /^@@ -\S+ \+(\d+)/.exec(ln);
    if (h) { n = parseInt(h[1], 10) - 1; continue; }
    if (ln.startsWith('+') && !ln.startsWith('+++') && archivo) { n += 1; revisarLinea(archivo, n, ln.slice(1), origen); }
    else if (!ln.startsWith('-') && !ln.startsWith('\\')) n += 1;
  }
}

function nombresAgregados(args) {
  // A (agregado), M (modificado), R/C (renombrado/copiado)
  const out = git(['diff', ...args, '--name-status', '--diff-filter=AMRC', '-z']);
  const partes = out.split('\0').filter(Boolean);
  const res = [];
  for (let i = 0; i < partes.length;) {
    const st = partes[i];
    if (/^[RC]/.test(st)) { res.push(partes[i + 2]); i += 3; } else { res.push(partes[i + 1]); i += 2; }
  }
  return res;
}

function modoStaged() {
  for (const f of nombresAgregados(['--cached'])) revisarNombre(f, 'preparado');
  revisarDiff(git(['diff', '--cached', '-U0', '--no-color', '--no-ext-diff']), 'preparado');
}

function modoPush(stdin) {
  const CERO = /^0+$/;
  const vistos = new Set();
  for (const linea of stdin.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const [, localSha, , remoteSha] = linea.split(/\s+/);
    if (!localSha || CERO.test(localSha)) continue; // borrado de rama
    const rango = CERO.test(remoteSha || '0') ? [localSha, '--not', '--remotes'] : [`${remoteSha}..${localSha}`];
    let commits = [];
    try { commits = git(['rev-list', ...rango]).split('\n').filter(Boolean); } catch (_) { commits = [localSha]; }
    for (const c of commits) {
      if (vistos.has(c)) continue; vistos.add(c);
      const corto = c.slice(0, 7);
      const nombres = git(['diff-tree', '-r', '--no-commit-id', '--name-only', '--diff-filter=AMRC', '-m', '--first-parent', '-z', c]).split('\0').filter(Boolean);
      for (const f of nombres) revisarNombre(f, 'commit ' + corto);
      revisarDiff(git(['show', '--format=', '-U0', '--no-color', '--no-ext-diff', '--first-parent', '-m', c]), 'commit ' + corto);
    }
  }
}

function modoAll() {
  const archivos = git(['ls-files', '-z']).split('\0').filter(Boolean);
  for (const f of archivos) {
    revisarNombre(f, 'rastreado');
    const abs = path.join(root, f);
    let st; try { st = fs.statSync(abs); } catch (_) { continue; }
    if (!st.isFile() || st.size > MAX_BYTES) continue;
    const buf = fs.readFileSync(abs);
    if (buf.includes(0)) continue; // binario
    buf.toString('utf8').split(/\r?\n/).forEach((t, i) => revisarLinea(f, i + 1, t, 'rastreado'));
  }
}

// ---------------------------------------------------------------- principal
function leerStdin() { try { return fs.readFileSync(0, 'utf8'); } catch (_) { return ''; } }

function main() {
  if (process.env.SKIP_SECRET_SCAN === '1') { console.warn('[secret-scan] OMITIDO por SKIP_SECRET_SCAN=1'); return 0; }
  const modo = process.argv[2] || '--staged';
  if (modo === '--staged') modoStaged();
  else if (modo === '--push') modoPush(leerStdin());
  else if (modo === '--all') modoAll();
  else { console.error('Modo desconocido: ' + modo); return 2; }

  if (!hallazgos.length) { if (modo === '--all') console.log('[secret-scan] Sin hallazgos.'); return 0; }

  const R = '\x1b[31m', Y = '\x1b[33m', B = '\x1b[1m', Z = '\x1b[0m';
  console.error(`\n${R}${B}✖ Detector de secretos: se encontraron ${hallazgos.length} problema(s). ${modo === '--all' ? '' : 'Operación cancelada.'}${Z}\n`);
  const vistos = new Set();
  for (const h of hallazgos) {
    const k = [h.archivo, h.linea, h.regla].join('|'); if (vistos.has(k)) continue; vistos.add(k);
    console.error(`  ${Y}${h.archivo}${h.linea ? ':' + h.linea : ''}${Z}  [${h.regla}]${h.origen && modo === '--push' ? '  (' + h.origen + ')' : ''}`);
    console.error(`      ${h.msg}${h.muestra ? '  → ' + h.muestra : ''}`);
  }
  console.error(`\n  Qué hacer:
   1. Quita el secreto del archivo y léelo desde una variable de entorno (process.env.NOMBRE).
   2. Si ya estaba preparado:  git restore --staged <archivo>   (el archivo sigue en tu disco).
   3. Si el secreto ya salió de tu computadora, cámbialo: borrarlo del código no lo invalida.
   4. Falso positivo: agrega  secretscan:allow  al final de la línea, o la ruta a .secretscan-allow.\n`);
  return 1;
}

process.exit(main());
