/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/components/MfaSection.jsx
 * Capa / módulo ...: Frontend · Componente
 * Función .........: Sección «Verificación en dos pasos» de Mi Perfil: muestra el código QR y la clave para la app autenticadora, confirma con el primer código, entrega los 8 códigos de recuperación (una sola vez) y permite desactivar con contraseña y código.
 * Requerimientos ..: RF-41, RF-43, RF-44  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-05, RNF-11
 * Casos de uso ....: CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-27, RN-28
 * Depende de ......: frontend/src/services/auth-adapter.js
 *                    frontend/src/services/mfaService.js
 * Lo usan .........: frontend/src/pages/ProfilePage.jsx
 * Pruebas .........: frontend/src/__tests__/MfaSection.test.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { configurarMfa, activarMfa, desactivarMfa } from '../services/mfaService';
import { authAdapter } from '../services/auth-adapter';

/**
 * Verificación en dos pasos (MFA) dentro de «Mi Perfil».
 * Estados: inicio → configurando (QR + código) → codigos (códigos de recuperación) ; inicio ⇄ desactivando.
 */
function MfaSection({ perfil, onCambio, obligatorioAviso = false }) {
  const activo = Boolean(perfil?.mfaActivo);
  const esAdmin = Boolean(perfil?.esAdmin);
  const [paso, setPaso] = useState('inicio');
  const [config, setConfig] = useState(null); // { secreto, otpauthUrl }
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [codigosRecuperacion, setCodigosRecuperacion] = useState([]);
  const [guardados, setGuardados] = useState(false);
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [copiado, setCopiado] = useState('');

  const reiniciar = () => {
    setPaso('inicio'); setConfig(null); setCodigo(''); setPassword(''); setError(''); setGuardados(false);
  };

  const empezar = async () => {
    setOcupado(true); setError('');
    try {
      setConfig(await configurarMfa());
      setCodigo('');
      setPaso('configurando');
    } catch (e) {
      setError(e.message);
    } finally {
      setOcupado(false);
    }
  };

  const confirmar = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(codigo.trim())) { setError('El código debe tener 6 dígitos'); return; }
    setOcupado(true); setError('');
    try {
      const r = await activarMfa(codigo.trim());
      authAdapter.notifyAuthChange();
      setCodigosRecuperacion(r.codigosRecuperacion || []);
      setPaso('codigos');
      if (onCambio) await onCambio();
    } catch (err) {
      setError(err.message);
    } finally {
      setOcupado(false);
    }
  };

  const desactivar = async (e) => {
    e.preventDefault();
    if (!password || !codigo.trim()) { setError('Ingresa tu contraseña y un código'); return; }
    setOcupado(true); setError('');
    try {
      await desactivarMfa(password, codigo.trim());
      reiniciar();
      if (onCambio) await onCambio();
    } catch (err) {
      setError(err.message);
    } finally {
      setOcupado(false);
    }
  };

  const copiar = async (texto, etiqueta) => {
    try { await navigator.clipboard.writeText(texto); setCopiado(etiqueta); setTimeout(() => setCopiado(''), 2000); } catch (_) { /* sin portapapeles */ }
  };

  const descargarCodigos = () => {
    const contenido = `FinanceFlow - códigos de recuperación (cada uno sirve una sola vez)\n\n${codigosRecuperacion.join('\n')}\n`;
    const url = URL.createObjectURL(new Blob([contenido], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'financeflow-codigos-recuperacion.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const campo = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6" data-testid="mfa-section">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-xl font-semibold text-gray-800">🔐 Verificación en dos pasos (MFA)</h2>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
          {activo ? 'Activada' : 'Desactivada'}
        </span>
      </div>

      {(obligatorioAviso || (esAdmin && !activo)) && (
        <div role="alert" className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 mb-3 text-sm">
          Como administrador, la verificación en dos pasos es <strong>obligatoria</strong>: sin ella no puedes usar el portal de administración. Actívala y vuelve a iniciar sesión.
        </div>
      )}

      {error && <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-3 text-sm">{error}</div>}

      {paso === 'inicio' && (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Agrega una capa extra de seguridad: además de tu contraseña, FinanceFlow pedirá un código de 6 dígitos que genera una app autenticadora
            (Google Authenticator, Microsoft Authenticator o Authy) en tu teléfono.
          </p>
          {!activo && (
            <button type="button" onClick={empezar} disabled={ocupado} className="bg-primary text-text font-semibold px-5 py-2 rounded-xl hover:bg-secondary transition-colors disabled:opacity-60">
              {ocupado ? 'Preparando...' : 'Activar verificación en dos pasos'}
            </button>
          )}
          {activo && !esAdmin && (
            <button type="button" onClick={() => { setError(''); setCodigo(''); setPassword(''); setPaso('desactivando'); }} className="bg-red-50 text-red-700 border border-red-200 font-semibold px-5 py-2 rounded-xl hover:bg-red-100 transition-colors">
              Desactivar
            </button>
          )}
          {activo && esAdmin && <p className="text-xs text-gray-500">El administrador no puede desactivar la verificación en dos pasos.</p>}
        </>
      )}

      {paso === 'configurando' && config && (
        <form onSubmit={confirmar} className="space-y-4">
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            <li>Abre tu app autenticadora y elige «Agregar cuenta» o «Escanear código QR».</li>
            <li>Escanea este código (o escribe la clave a mano).</li>
            <li>Ingresa abajo el código de 6 dígitos que te muestra la app.</li>
          </ol>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
            <div className="bg-white p-3 border border-gray-200 rounded-xl" data-testid="mfa-qr">
              <QRCodeSVG value={config.otpauthUrl} size={176} />
            </div>
            <div className="text-sm text-gray-700 break-all">
              <p className="font-medium mb-1">¿No puedes escanearlo? Clave manual:</p>
              <code className="block bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 tracking-wider" data-testid="mfa-secreto">{config.secreto}</code>
              <button type="button" onClick={() => copiar(config.secreto, 'clave')} className="mt-2 text-primary underline text-xs">
                {copiado === 'clave' ? 'Copiada ✓' : 'Copiar clave'}
              </button>
            </div>
          </div>
          <input
            type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="Código de 6 dígitos"
            aria-label="Código de 6 dígitos" value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
            className={`${campo} text-center tracking-widest text-lg`}
          />
          <div className="flex gap-3">
            <button type="button" onClick={reiniciar} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded-xl hover:bg-gray-200">Cancelar</button>
            <button type="submit" disabled={ocupado} className="flex-1 bg-primary text-text font-semibold py-2 rounded-xl hover:bg-secondary disabled:opacity-60">
              {ocupado ? 'Verificando...' : 'Confirmar y activar'}
            </button>
          </div>
        </form>
      )}

      {paso === 'codigos' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-3 text-sm">✅ Verificación en dos pasos activada.</div>
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-sm">
            <strong>Guarda tus códigos de recuperación.</strong> Se muestran una sola vez. Si pierdes tu teléfono, cada código te deja entrar una vez. Guárdalos en un lugar seguro (no en tu correo).
          </div>
          <ul className="grid grid-cols-2 gap-2 font-mono text-sm" data-testid="mfa-codigos">
            {codigosRecuperacion.map((c) => <li key={c} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">{c}</li>)}
          </ul>
          <div className="flex gap-3">
            <button type="button" onClick={() => copiar(codigosRecuperacion.join('\n'), 'codigos')} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded-xl hover:bg-gray-200">
              {copiado === 'codigos' ? 'Copiados ✓' : 'Copiar'}
            </button>
            <button type="button" onClick={descargarCodigos} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded-xl hover:bg-gray-200">Descargar .txt</button>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={guardados} onChange={(e) => setGuardados(e.target.checked)} /> Ya guardé mis códigos de recuperación
          </label>
          <button type="button" disabled={!guardados} onClick={() => { setCodigosRecuperacion([]); reiniciar(); }} className="w-full bg-primary text-text font-semibold py-2 rounded-xl hover:bg-secondary disabled:opacity-50">
            Listo
          </button>
        </div>
      )}

      {paso === 'desactivando' && (
        <form onSubmit={desactivar} className="space-y-3">
          <p className="text-sm text-gray-600">Para desactivarla confirma tu contraseña y un código de la app (o uno de recuperación).</p>
          <input type="password" autoComplete="current-password" placeholder="Contraseña" aria-label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className={campo} />
          <input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={20} placeholder="Código de la app o de recuperación" aria-label="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} className={campo} />
          <div className="flex gap-3">
            <button type="button" onClick={reiniciar} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded-xl hover:bg-gray-200">Cancelar</button>
            <button type="submit" disabled={ocupado} className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-xl hover:bg-red-700 disabled:opacity-60">
              {ocupado ? 'Desactivando...' : 'Desactivar'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default MfaSection;
