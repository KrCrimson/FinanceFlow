/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/components/LogoutButton.jsx
 * Capa / módulo ...: Frontend · Componente
 * Función .........: Botón «Cerrar sesión».
 * Requerimientos ..: RF-06  (módulos: Cuenta)
 * Casos de uso ....: CU-13 Cerrar sesión
 * Pruebas .........: frontend/src/__tests__/componentes-base.test.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import React from 'react';

function LogoutButton({ onLogout }) {
  return <button onClick={onLogout}>Cerrar sesión</button>;
}

export default LogoutButton;
