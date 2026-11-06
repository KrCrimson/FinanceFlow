/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/pages/NotFoundPage.jsx
 * Capa / módulo ...: Frontend · Pantalla
 * Función .........: Muestra el aviso cuando la dirección no existe.
 * Calidad (RNF) ...: RNF-11
 * Lo usan .........: frontend/src/App.jsx
 * Pruebas .........: frontend/src/__tests__/NotFoundPage.test.jsx
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import React from 'react';

function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background animate-fade-in">
      <div className="bg-white/80 shadow-soft rounded-xl p-8 w-full max-w-md text-center border border-primary/30">
        <div className="text-3xl font-bold text-red-500 mb-2">404</div>
        <div className="text-lg mb-4">Página no encontrada</div>
        <a href="/" className="text-primary underline hover:text-accent transition-colors">Volver al inicio</a>
      </div>
    </div>
  );
}

export default NotFoundPage;
