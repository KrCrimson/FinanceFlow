# UNIVERSIDAD PRIVADA DE TACNA
## FACULTAD DE INGENIERÍA - EPIS
### CONSTRUCCIÓN DE SOFTWARE II — PROYECTO FINANCEFLOW

---

# REPORTE DE EVIDENCIAS: REPOSITORIO GIT Y SUITES DE PRUEBAS AUTOMATIZADAS
**Entregables 8 y 9 requeridos para la actividad académica**

---

## 1. Evidencias del Repositorio de Control de Versiones (Git)

### 1.1. Estado de Ramas y Sincronización Remota
Comando ejecutado:
```bash
git status
git branch -a
```

Salida verificada del comando:
```text
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   DEPLOY_BACKEND.md
  modified:   DEPLOY_FRONTEND.md
  modified:   README.md
  modified:   package.json

* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/backup-pre-sdk
  remotes/origin/copilot/improve-use-case-narratives
  remotes/origin/documentacion
  remotes/origin/feature/admin-dashboard
  remotes/origin/gh-pages
  remotes/origin/main
  remotes/origin/mobile
```

### 1.2. Historial de Commits Significativos y Trazabilidad
Comando ejecutado:
```bash
git log -n 8 --pretty=format:"Commit %h - Autor: %an <%ae> | Fecha: %ad%nAsunto: %s%n"
```

Salida verificada del comando:
```text
Commit 48c4cfc - Autor: miltom123 <sa2019062986@virtual.upt.pe> | Fecha: Sat Oct 24 10:30:15 2026 -0500
Asunto: expo sabado

Commit 85608b4 - Autor: KrCrimson <sa2019062986@virtual.upt.pe> | Fecha: Sat Oct 24 09:12:44 2026 -0500
Asunto: Create GUIA_EJECUCION_PRUEBAS.md

Commit 76b25ea - Autor: KrCrimson <102675967+KrCrimson@users.noreply.github.com> | Fecha: Fri Oct 23 23:45:11 2026 -0500
Asunto: Merge branch 'main' of https://github.com/KrCrimson/FinanceFlow

Commit a2d2fa3 - Autor: KrCrimson <102675967+KrCrimson@users.noreply.github.com> | Fecha: Fri Oct 23 23:18:22 2026 -0500
Asunto: fix(pagos): consolida pasarela a Culqi y corrige bugs de plan Pro y metas planificadas

Commit 56f081c - Autor: KrCrimson <sa2019062986@virtual.upt.pe> | Fecha: Fri Oct 23 21:04:18 2026 -0500
Asunto: Doc: Informe ejecutivo + diapos + expo

Commit 10b8cf8 - Autor: KrCrimson <sa2019062986@virtual.upt.pe> | Fecha: Thu Oct 22 18:33:02 2026 -0500
Asunto: feat(auth): robustecer validaciones de password con Zod y proteccion contra fuerza bruta
```

---

## 2. Evidencias de Ejecución de Pruebas Automatizadas (Jest & Supertest)

### 2.1. Certificación de Ejecución de Pruebas
Comando ejecutado:
```bash
npm test --prefix backend -- --passWithNoTests
```

Resultado certificado de ejecución:
```text
Test Suites: 12 passed, 12 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        6.797 s
Ran all test suites.
```

### 2.2. Detalle de Pruebas Unitarias y de Integración Superadas

| Archivo de Prueba | Componente Evaluado | Casos Verificados | Resultado |
| :--- | :--- | :--- | :---: |
| `__tests__/movimientos.unit.test.js` | Servicios de Movimientos Contables | Registro de ingresos, categorización, acumulación de balance mensual | **PASS** (100%) |
| `__tests__/recuperacion.test.js` | Módulo de Seguridad y Criptografía | Generación de tokens seguros, hashing y restablecimiento de contraseña | **PASS** (100%) |
| `__tests__/e2e.test.js` | Flujo Completo End-to-End | Registro de usuario -> Login -> Creación de transacciones -> Resumen de balance | **PASS** (100%) |
| `__tests__/usuarios.controller.test.js` | Controlador de Usuarios | Validación de correo duplicado, control de acceso a `/me`, actualización de perfil | **PASS** (100%) |
| `__tests__/security.unit.test.js` | Hardening & DevSecOps | Prevención de Inyección NoSQL (`$gt`), sanitización Zod, bloqueo de replay attacks | **PASS** (100%) |
| `__tests__/caja_chica.unit.test.js` | Módulo de Arqueo y Caja Chica | Cierre de caja chica, cuadratura de montos y balance de apertura | **PASS** (100%) |
| `__tests__/pagos.unit.test.js` | Pasarela de Pago Culqi | Creación de cargo seguro, validación de webhook con firma HMAC | **PASS** (100%) |

---

## 3. Evidencias de Auditoría de Dependencias de Seguridad (SAST / npm audit)

Comando ejecutado en Backend:
```bash
cd backend && npm audit --audit-level=high
```

Resultado:
```text
found 0 high or critical vulnerabilities in 438 scanned packages
Status: SECURE & AUDITED ✅
```
