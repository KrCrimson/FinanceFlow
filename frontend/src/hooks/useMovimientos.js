/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/hooks/useMovimientos.js
 * Capa / módulo ...: Frontend · Hook
 * Función .........: Carga la lista de movimientos del usuario con estados de carga y error.
 * Requerimientos ..: RF-14  (módulos: Movimientos)
 * Casos de uso ....: CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 * Depende de ......: frontend/src/services/movimientos-adapter.js
 * Lo usan .........: frontend/src/hooks/useAnalisisGastos.js
 *                    frontend/src/pages/DashboardPage.jsx
 *                    frontend/src/pages/EgresosPage.jsx
 *                    frontend/src/pages/IngresosPage.jsx
 *                    frontend/src/pages/PlanificadorPage.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { useState, useEffect } from 'react';
import { getMovimientos } from '../services/movimientos-adapter';

export function useMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getMovimientos()
      .then(setMovimientos)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { movimientos, loading, error };
}
