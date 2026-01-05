import { useState, useEffect } from 'react';
import { useMovimientos } from './useMovimientos';

export function useAnalisisGastos() {
  const { movimientos } = useMovimientos();
  const [alertas, setAlertas] = useState([]);
  const [estadisticasPorCategoria, setEstadisticasPorCategoria] = useState({});
  const [resumenMensual, setResumenMensual] = useState({
    ingresoPromedio: 0,
    gastoPromedio: 0,
    ahorroPromedio: 0
  });

  // Calcular estadísticas cuando cambien los movimientos
  useEffect(() => {
    if (movimientos.length === 0) return;

    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const añoActual = ahora.getFullYear();

    // Separar movimientos por períodos
    const movimientosActuales = movimientos.filter(m => {
      const fecha = new Date(m.creadoEn);
      return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
    });

    const movimientosAnteriores = movimientos.filter(m => {
      const fecha = new Date(m.creadoEn);
      return !(fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual);
    });

    // Calcular estadísticas por categoría
    const stats = calcularEstadisticasPorCategoria(movimientosActuales, movimientosAnteriores);
    setEstadisticasPorCategoria(stats);

    // Calcular resumen mensual
    const resumen = calcularResumenMensual(movimientos);
    setResumenMensual(resumen);

    // Generar alertas
    const nuevasAlertas = generarAlertas(stats, resumen);
    setAlertas(nuevasAlertas);

  }, [movimientos]);

  const calcularEstadisticasPorCategoria = (actuales, anteriores) => {
    const stats = {};
    
    // Agrupar movimientos actuales por categoría
    actuales.forEach(movimiento => {
      const categoria = movimiento.categoria || 'Sin categoría';
      if (!stats[categoria]) {
        stats[categoria] = {
          gastoActual: 0,
          promedioAnterior: 0,
          cantidadActual: 0,
          tendencia: 'normal'
        };
      }
      
      if (movimiento.tipo === 'egreso') {
        stats[categoria].gastoActual += movimiento.monto;
        stats[categoria].cantidadActual += 1;
      }
    });

    // Calcular promedio de meses anteriores
    const mesesUnicos = [...new Set(anteriores.map(m => {
      const fecha = new Date(m.creadoEn);
      return `${fecha.getFullYear()}-${fecha.getMonth()}`;
    }))];

    const cantidadMeses = Math.max(mesesUnicos.length, 1);

    anteriores.forEach(movimiento => {
      const categoria = movimiento.categoria || 'Sin categoría';
      if (!stats[categoria]) {
        stats[categoria] = {
          gastoActual: 0,
          promedioAnterior: 0,
          cantidadActual: 0,
          tendencia: 'normal'
        };
      }
      
      if (movimiento.tipo === 'egreso') {
        stats[categoria].promedioAnterior += movimiento.monto;
      }
    });

    // Calcular promedios y tendencias
    Object.keys(stats).forEach(categoria => {
      stats[categoria].promedioAnterior = stats[categoria].promedioAnterior / cantidadMeses;
      
      // Determinar tendencia
      const actual = stats[categoria].gastoActual;
      const promedio = stats[categoria].promedioAnterior;
      
      if (actual > promedio * 1.5) {
        stats[categoria].tendencia = 'muy_alto';
      } else if (actual > promedio * 1.2) {
        stats[categoria].tendencia = 'alto';
      } else if (actual < promedio * 0.8 && promedio > 0) {
        stats[categoria].tendencia = 'bajo';
      } else {
        stats[categoria].tendencia = 'normal';
      }
    });

    return stats;
  };

  const calcularResumenMensual = (todosMovimientos) => {
    const mesesUnicos = [...new Set(todosMovimientos.map(m => {
      const fecha = new Date(m.creadoEn);
      return `${fecha.getFullYear()}-${fecha.getMonth()}`;
    }))];

    const cantidadMeses = Math.max(mesesUnicos.length, 1);
    
    const totales = todosMovimientos.reduce((acc, m) => {
      if (m.tipo === 'ingreso') {
        acc.ingresos += m.monto;
      } else {
        acc.gastos += m.monto;
      }
      return acc;
    }, { ingresos: 0, gastos: 0 });

    return {
      ingresoPromedio: totales.ingresos / cantidadMeses,
      gastoPromedio: totales.gastos / cantidadMeses,
      ahorroPromedio: (totales.ingresos - totales.gastos) / cantidadMeses
    };
  };

  const generarAlertas = (stats, resumen) => {
    const alertas = [];

    // Alertas por categoría
    Object.entries(stats).forEach(([categoria, data]) => {
      if (data.tendencia === 'muy_alto') {
        alertas.push({
          tipo: 'gasto_elevado',
          categoria,
          mensaje: `¡Gasto muy elevado en ${categoria}!`,
          descripcion: `Has gastado S/${data.gastoActual.toFixed(2)} este mes vs S/${data.promedioAnterior.toFixed(2)} de promedio.`,
          severidad: 'alta',
          porcentaje: ((data.gastoActual / data.promedioAnterior) * 100).toFixed(0)
        });
      } else if (data.tendencia === 'alto') {
        alertas.push({
          tipo: 'gasto_alto',
          categoria,
          mensaje: `Gasto elevado en ${categoria}`,
          descripcion: `Estás gastando S/${data.gastoActual.toFixed(2)} vs S/${data.promedioAnterior.toFixed(2)} de promedio.`,
          severidad: 'media',
          porcentaje: ((data.gastoActual / data.promedioAnterior) * 100).toFixed(0)
        });
      }
    });

    // Alerta de ahorro negativo
    if (resumen.ahorroPromedio < 0) {
      alertas.push({
        tipo: 'ahorro_negativo',
        mensaje: 'Gastas más de lo que ingresas',
        descripcion: `Tu déficit promedio es de S/${Math.abs(resumen.ahorroPromedio).toFixed(2)} mensuales.`,
        severidad: 'alta'
      });
    }

    // Alerta de ahorro bajo
    if (resumen.ahorroPromedio > 0 && resumen.ahorroPromedio < resumen.ingresoPromedio * 0.1) {
      alertas.push({
        tipo: 'ahorro_bajo',
        mensaje: 'Ahorro muy bajo',
        descripcion: `Solo ahorras S/${resumen.ahorroPromedio.toFixed(2)} mensuales (menos del 10% de tus ingresos).`,
        severidad: 'media'
      });
    }

    return alertas;
  };

  const calcularTiempoParaCompra = (precio, gastoExtraEstimado = 0) => {
    const ahorroMensualDisponible = Math.max(0, resumenMensual.ahorroPromedio - gastoExtraEstimado);
    
    if (ahorroMensualDisponible <= 0) {
      return {
        esviable: false,
        mensaje: 'No es posible con el patrón actual de gastos',
        sugerencia: 'Necesitas reducir gastos o aumentar ingresos'
      };
    }

    const mesesNecesarios = Math.ceil(precio / ahorroMensualDisponible);
    
    return {
      esviable: true,
      meses: mesesNecesarios,
      ahorroMensualNecesario: ahorroMensualDisponible,
      fechaEstimada: new Date(new Date().setMonth(new Date().getMonth() + mesesNecesarios)),
      mensaje: `Podrías comprarlo en ${mesesNecesarios} ${mesesNecesarios === 1 ? 'mes' : 'meses'}`,
      sugerencia: mesesNecesarios > 12 ? 'Considera buscar alternativas más económicas' : 
                  mesesNecesarios > 6 ? 'Planifica bien tu compra' : 
                  '¡Meta alcanzable!'
    };
  };

  const obtenerSugerenciasAhorro = () => {
    const sugerencias = [];
    
    Object.entries(estadisticasPorCategoria).forEach(([categoria, data]) => {
      if (data.tendencia === 'muy_alto' || data.tendencia === 'alto') {
        const ahorroEstimado = data.gastoActual - data.promedioAnterior;
        sugerencias.push({
          categoria,
          ahorroEstimado: ahorroEstimado,
          mensaje: `Reduciendo ${categoria} al promedio ahorrarías S/${ahorroEstimado.toFixed(2)} este mes`
        });
      }
    });

    return sugerencias.sort((a, b) => b.ahorroEstimado - a.ahorroEstimado);
  };

  return {
    alertas,
    estadisticasPorCategoria,
    resumenMensual,
    calcularTiempoParaCompra,
    obtenerSugerenciasAhorro
  };
}