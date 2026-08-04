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

  return (
    <div className="min-h-[80vh] bg-background py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <PlanificadorCompras 
          resumenMensual={resumenMensual}
          estadisticasPorCategoria={estadisticasPorCategoria}
          calcularTiempoParaCompra={calcularTiempoParaCompra}
          obtenerSugerenciasAhorro={obtenerSugerenciasAhorro}
          movimientos={movimientos}
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
