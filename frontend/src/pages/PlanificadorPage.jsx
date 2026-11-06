/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/pages/PlanificadorPage.jsx
 * Capa / módulo ...: Frontend · Pantalla
 * Función .........: Pantalla independiente que reúne los datos y muestra la Carrera de Compras Planificadas.
 * Requerimientos ..: RF-25, RF-26  (módulos: Planificador)
 * Casos de uso ....: CU-11 Planificar compras (Carrera de compras planificadas)
 * Reglas de negocio : RN-19
 * Depende de ......: frontend/src/components/PlanificadorCompras.jsx
 *                    frontend/src/hooks/useAnalisisGastos.js
 *                    frontend/src/hooks/useMovimientos.js
 *                    frontend/src/services/movimientos-adapter.js
 * Lo usan .........: frontend/src/App.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import React from 'react';
import { useMovimientos } from '../hooks/useMovimientos';
import { useAnalisisGastos } from '../hooks/useAnalisisGastos';
import { createMovimiento, updateMovimiento } from '../services/movimientos-adapter';
import PlanificadorCompras from '../components/PlanificadorCompras';

function PlanificadorPage() {
  const { movimientos, loading, error } = useMovimientos();
  const { resumenMensual, estadisticasPorCategoria, calcularTiempoParaCompra, obtenerSugerenciasAhorro } = useAnalisisGastos();

  if (loading) return <div className="flex justify-center items-center min-h-[60vh] text-lg animate-pulse">Cargando datos...</div>;
  if (error) return <div className="text-red-500 text-center mt-8 animate-fade-in">Error: {error.message}</div>;

  const movimientosArray = Array.isArray(movimientos) ? movimientos : [];
  const activos = movimientosArray.filter(m => m.estado !== 'planificado');
  const ingresos = activos.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);
  const egresos = activos.filter(m => m.tipo === 'egreso').reduce((acc, m) => acc + m.monto, 0);
  const balanceTotal = ingresos - egresos;

  return (
    <div className="min-h-[80vh] bg-background py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <PlanificadorCompras
          resumenMensual={resumenMensual}
          estadisticasPorCategoria={estadisticasPorCategoria}
          calcularTiempoParaCompra={calcularTiempoParaCompra}
          obtenerSugerenciasAhorro={obtenerSugerenciasAhorro}
          movimientos={movimientos}
          balanceTotal={balanceTotal}
          onCrearEgreso={async (data) => {
            await createMovimiento(data);
            window.location.reload();
          }}
          onUpdateEgreso={async (id, data) => {
            await updateMovimiento(id, data);
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
}

export default PlanificadorPage;
