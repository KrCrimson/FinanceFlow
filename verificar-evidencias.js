#!/usr/bin/env node
// Uso (desde la raíz del repo FinanceFlow):
//   node verificar-evidencias.js            -> revisa código y documentos
//   node verificar-evidencias.js --tests    -> además ejecuta Jest (backend, frontend, sdk)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();
const R = (...p) => path.join(root, ...p);
const read = (...p) => (fs.existsSync(R(...p)) ? fs.readFileSync(R(...p), 'utf8') : '');
const has = (...p) => fs.existsSync(R(...p));
const sh = (cmd, cwd = root) => {
    try { return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch (e) { return (e.stdout || '') + (e.stderr || ''); }
};
const walk = (dir, out = []) => {
    if (!fs.existsSync(dir)) return out;
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        if (['node_modules', '.git', '__tests__', 'build'].includes(f.name)) continue;
        const p = path.join(dir, f.name);
        f.isDirectory() ? walk(p, out) : out.push(p);
    }
    return out;
};
const grepRepo = (dirs, re) =>
    dirs.flatMap(d => walk(R(d))).filter(f => /\.(js|jsx|py|json)$/.test(f) && re.test(fs.readFileSync(f, 'utf8')))
        .map(f => path.relative(root, f));

const rows = [];
const check = (id, texto, ok, detalle = '') => rows.push({ id, texto, ok, detalle });

if (!has('backend', 'app.js')) {
    console.error('Ejecuta este script desde la raíz del repo FinanceFlow.');
    process.exit(1);
}

// --- Código vs informe de QA ---
const app = read('backend', 'app.js');
const ci = read('.github', 'workflows', 'ci.yml');
const rootPkg = has('package.json') ? JSON.parse(read('package.json')) : {};

check('E-04', 'CI de GitHub Actions existe (Node 20, audit + tests)', /node-version:\s*'20'/.test(ci) && /npm audit/.test(ci) && /npm test/.test(ci), '.github/workflows/ci.yml');
check('E-05', 'CI no bloquea por vulnerabilidades (|| echo) [D-05]', /npm audit[^\n]*\|\|\s*echo/.test(ci), 'es el defecto D-05 documentado');
check('E-06', 'Rate limit en login/recuperación', has('backend', 'middlewares', 'rateLimit.js') && /loginLimiter/.test(read('backend', 'routes', 'usuarios.js')), 'backend/routes/usuarios.js');
check('E-07', 'Zod valida monto positivo', /positive\(/.test(read('backend', 'schemas', 'movimiento.schema.js')), 'backend/schemas/movimiento.schema.js');
check('E-08', 'Helmet + trust proxy + CORS por función', /helmet\(\)/.test(app) && /trust proxy/.test(app) && /origin:\s*\(origin/.test(app), 'backend/app.js');
check('E-09', 'JWT_SECRET < 32 caracteres aborta en producción', /JWT_SECRET\.length\s*<\s*32/.test(app), 'backend/app.js');
check('E-10', 'Inactivación lógica de movimientos', /estado:\s*'inactivo'/.test(read('backend', 'services', 'movimientos.service.js')), 'movimientos.service.js');
check('E-11', 'Índice único en cierres', /index\(.*unique:\s*true/.test(read('backend', 'database', 'cierre.model.js')), 'cierre.model.js');
check('E-12', 'Endpoints dev bloqueados en producción', (read('backend', 'routes', 'pagos.router.js').match(/NODE_ENV === 'production'/g) || []).length >= 2, 'pagos.router.js');

// --- Guía de pruebas ---
const scripts = rootPkg.scripts || {};
['test', 'test:backend', 'test:frontend', 'test:sdk', 'audit:backend'].forEach(s =>
    check('E-13', `package.json raíz tiene script "${s}"`, !!scripts[s], 'la guía lo usa desde la raíz'));

// --- Plan de despliegue / guion ---
check('E-20', 'Dockerfile del ML instala Tesseract', /tesseract-ocr/.test(read('ml_backend', 'Dockerfile')), 'ml_backend/Dockerfile');
check('E-21', 'ML expone /categorize', /@app\.post\("\/categorize"\)/.test(read('ml_backend', 'main.py')), 'ml_backend/main.py');
check('E-22', 'vercel.json con rewrites SPA', /rewrites/.test(read('vercel.json')) || /rewrites/.test(read('frontend', 'vercel.json')), 'vercel.json');

const health = grepRepo(['backend'], /['"`]\/(api\/)?health['"`]/);
check('E-25', 'Existe endpoint /api/health (Rolling Update en Render)', health.length > 0, health.join(', ') || 'NO existe en backend/');

const preflight = [R('backend', 'scripts', 'deploy-preflight.js'), R('scripts', 'deploy-preflight.js')].some(fs.existsSync);
check('E-26', 'Existe scripts/deploy-preflight.js (Fase 3 del Plan)', preflight, preflight ? '' : 'NO existe');

const tags = sh('git tag').split('\n').filter(Boolean);
check('E-27a', 'Existen tags v1.3.0 / v1.4.0', tags.includes('v1.3.0') || tags.includes('v1.4.0'), `tags locales: ${tags.join(', ') || 'ninguno'} (si clonaste con --depth, usa: git ls-remote --tags origin)`);
const versions = ['backend', 'frontend', 'sdk'].map(d => JSON.parse(read(d, 'package.json') || '{}').version);
check('E-27b', 'package.json de backend/frontend/sdk con versión 1.3.0/1.4.0', versions.every(v => /^1\.[34]\./.test(v || '')), `versiones: ${versions.join(', ')}`);

const gw = {
    culqi: grepRepo(['backend'], /culqi/i).length > 0,
    stripe: grepRepo(['backend'], /stripe/i).length > 0,
    mercadopago: grepRepo(['backend'], /mercado\s*pago|mercadopago/i).length > 0,
    flow: grepRepo(['backend'], /webhook-flow|flow\.cl/i).length > 0,
};
check('E-28', 'Pasarelas en código = pasarelas en README', !/Stripe|Mercado Pago|Flow/.test(read('README.md')) || (gw.stripe && gw.mercadopago && gw.flow),
    `código -> ${Object.entries(gw).map(([k, v]) => `${k}:${v ? 'sí' : 'no'}`).join(' ')} | README menciona Stripe/MercadoPago/Flow: ${/Stripe|Mercado Pago|Flow/.test(read('README.md')) ? 'sí' : 'no'}`);

const idx = (walk(R('backend', 'database')).map(f => fs.readFileSync(f, 'utf8')).join('\n').match(/\.index\(/g) || []).length;
check('E-30', 'Índices compuestos únicos (plural) en MongoDB', idx > 1, `índices encontrados en backend/database: ${idx}`);

const mlCors = /allow_origins=\["\*"\]/.test(read('ml_backend', 'main.py'));
check('E-32a', 'ML con CORS restringido', !mlCors, mlCors ? 'allow_origins=["*"]' : '');
const winPath = /C:\\\\?Program Files/.test(read('ml_backend', 'main.py'));
check('E-32b', 'ML sin ruta fija de Windows para Tesseract', !winPath, winPath ? 'ruta C:\\Program Files… en main.py' : '');

// Variables de entorno: usadas en código vs .env.example
const usadas = new Set((walk(R('backend')).filter(f => f.endsWith('.js')).map(f => fs.readFileSync(f, 'utf8')).join('\n').match(/process\.env\.([A-Z_]+)/g) || []).map(s => s.replace('process.env.', '')));
const ejemplo = new Set((read('backend', '.env.example').match(/^[A-Z_]+(?==)/gm)) || []);
const faltan = [...usadas].filter(v => !ejemplo.has(v) && !['NODE_ENV'].includes(v));
check('E-23', 'Todas las variables usadas están en backend/.env.example', faltan.length === 0, faltan.length ? `faltan: ${faltan.join(', ')}` : '');

// --- Consistencia entre documentos (si el zip fue extraído en ./Unidad 2) ---
const docsDir = ['Unidad 2', 'documentacion', 'documentacion/anexos'].map(d => R(d)).filter(fs.existsSync);
const codes = new Set();
for (const d of docsDir)
    for (const f of walk(d).filter(f => /\.(md)$/.test(f)))
        (fs.readFileSync(f, 'utf8').match(/2019062[0-9]{3}/g) || []).forEach(c => codes.add(c));
if (codes.size) check('E-40', 'Código de estudiante de Sebastian es único en los .md', codes.size === 1, `variantes encontradas: ${[...codes].join(', ')}`);

const matriz = read('documentacion', 'anexos', 'matriz_de_trazabilidad.md');
const rotos = (matriz.match(/file:\/\/\/c:/gi) || []).length;
check('E-41', 'matriz_de_trazabilidad.md sin enlaces file:///c:', rotos === 0, rotos ? `${rotos} enlaces absolutos de Windows` : '');

// --- Ejecución de pruebas (opcional) ---
if (process.argv.includes('--tests')) {
    console.log('\nEjecutando pruebas (puede tardar)...\n');
    const t = (id, label, cmd, cwd, re) => {
        const out = sh(cmd + ' 2>&1', R(cwd));
        const m = out.match(/Tests:\s+.*\n?/);
        const s = out.match(/Test Suites:\s+.*\n?/);
        check(id, label, re.test(out), `${(s || [''])[0].trim()} | ${(m || [''])[0].trim()}`);
    };
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecretkey1234567890';
    t('E-01', 'Backend: 12 suites / 29 pruebas', 'npx jest --config jest.config.js', 'backend', /12 passed, 12 total[\s\S]*29 passed, 29 total/);
    t('E-02', 'Frontend: 9 suites / 13 pruebas', 'npx react-scripts test --env=jsdom --watchAll=false', 'frontend', /9 passed, 9 total[\s\S]*13 passed, 13 total/);
    t('E-03', 'SDK: 38 aprobadas y 1 suite falla (D-01)', 'npx jest', 'sdk', /1 failed, 2 passed, 3 total[\s\S]*38 passed/);
}

// --- Reporte ---
const w = Math.max(...rows.map(r => r.id.length));
console.log('\nCOMPARATIVA DOCUMENTACIÓN vs CÓDIGO — FinanceFlow\n' + '='.repeat(60));
for (const r of rows) {
    console.log(`${r.ok ? '✅' : '❌'} ${r.id.padEnd(w)}  ${r.texto}${r.detalle ? `\n   ${' '.repeat(w)}   → ${r.detalle}` : ''}`);
}
const ok = rows.filter(r => r.ok).length;
console.log('='.repeat(60) + `\nCoinciden: ${ok}/${rows.length}   No coinciden: ${rows.length - ok}\n`);
process.exit(ok === rows.length ? 0 : 1);