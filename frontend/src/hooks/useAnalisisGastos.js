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
    if (!movimientos || movimientos.length === 0) return;

    // Solo considerar movimientos ACTIVOS (excluir planificados e inactivos)
    const activos = movimientos.filter(m => m.estado === 'activo');

    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const añoActual = ahora.getFullYear();

    // Movimientos del mes actual
    const movimientosActuales = activos.filter(m => {
      const fecha = new Date(m.fecha || m.creadoEn);
      return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
    });

    // Movimientos de meses anteriores
    const movimientosAnteriores = activos.filter(m => {
      const fecha = new Date(m.fecha || m.creadoEn);
      return !(fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual);
    });

    // Calcular estadísticas por categoría
    const stats = calcularEstadisticasPorCategoria(movimientosActuales, movimientosAnteriores);
    setEstadisticasPorCategoria(stats);

    // Calcular resumen mensual
    const resumen = calcularResumenMensual(activos, movimientosActuales);
    setResumenMensual(resumen);

    // Generar alertas inteligentes y humanas
    const nuevasAlertas = generarAlertasInteligentes(stats, resumen, movimientosActuales);
    setAlertas(nuevasAlertas);

  }, [movimientos]);

  const calcularEstadisticasPorCategoria = (actuales, anteriores) => {
    const stats = {};
    
    actuales.forEach(movimiento => {
      const categoria = movimiento.categoria || 'Otros';
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
      const fecha = new Date(m.fecha || m.creadoEn);
      return `${fecha.getFullYear()}-${fecha.getMonth()}`;
    }))];

    const cantidadMeses = Math.max(mesesUnicos.length, 1);

    anteriores.forEach(movimiento => {
      const categoria = movimiento.categoria || 'Otros';
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

    // Calcular promedios
    Object.keys(stats).forEach(categoria => {
      stats[categoria].promedioAnterior = stats[categoria].promedioAnterior / cantidadMeses;
    });

    return stats;
  };

  const calcularResumenMensual = (todosMovimientos, actuales) => {
    const mesesUnicos = [...new Set(todosMovimientos.map(m => {
      const fecha = new Date(m.fecha || m.creadoEn || new Date());
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

    const ingresosMesActual = actuales
      .filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + m.monto, 0);

    const egresosMesActual = actuales
      .filter(m => m.tipo === 'egreso')
      .reduce((sum, m) => sum + m.monto, 0);

    return {
      ingresoPromedio: totales.ingresos / cantidadMeses,
      gastoPromedio: totales.gastos / cantidadMeses,
      ahorroPromedio: (totales.ingresos - totales.gastos) / cantidadMeses,
      ingresosMesActual,
      egresosMesActual
    };
  };

  const generarAlertasInteligentes = (stats, resumen, actuales) => {
    const alertas = [];
    const ingresosActuales = resumen.ingresosMesActual || resumen.ingresoPromedio || 1;

    Object.entries(stats).forEach(([categoria, data]) => {
      const gasto = data.gastoActual;
      if (gasto <= 0) return;

      const porcentajeDelIngreso = (gasto / ingresosActuales) * 100;
      const promedio = data.promedioAnterior;

      // 1. Alerta de Inversión Significativa / Gasto Elevado en Categoría
      if (porcentajeDelIngreso >= 35) {
        alertas.push({
          tipo: 'gasto_elevado',
          categoria,
          mensaje: `💡 Consumo relevante en ${categoria}`,
          descripcion: `Has asignado S/${gasto.toFixed(2)} a ${categoria} este mes (representa el ${porcentajeDelIngreso.toFixed(0)}% de tus ingresos de este mes).`,
          severidad: porcentajeDelIngreso >= 60 ? 'alta' : 'media',
          porcentaje: `${porcentajeDelIngreso.toFixed(0)}% del ingreso`
        });
      } else if (promedio > 0 && gasto > promedio * 2 && gasto > 150) {
        const incremento = ((gasto / promedio) * 100).toFixed(0);
        alertas.push({
          tipo: 'gasto_alto',
          categoria,
          mensaje: `📊 Incremento notable en ${categoria}`,
          descripcion: `Gastaste S/${gasto.toFixed(2)} este mes en ${categoria} vs un promedio habitual de S/${promedio.toFixed(2)}.`,
          severidad: 'media',
          porcentaje: `${incremento}% del histórico`
        });
      }
    });

    // 2. Alerta de Presupuesto / Balance Negativo del Mes
    if (resumen.egresosMesActual > resumen.ingresosMesActual && resumen.ingresosMesActual > 0) {
      const deficit = resumen.egresosMesActual - resumen.ingresosMesActual;
      alertas.push({
        tipo: 'ahorro_negativo',
        mensaje: '⚠️ Los egresos superan los ingresos del mes',
        descripcion: `Llevas un déficit mensual de S/${deficit.toFixed(2)}. Revisa tus compras planificadas o disminuye egresos secundarios.`,
        severidad: 'alta'
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
      sugerencia: `Ahorrando tu promedio de S/${ahorroMensualDisponible.toFixed(2)}/mes, alcanzarás esta meta en ${mesesNecesarios} mes(es).`
    };
  };

  const obtenerSugerenciasAhorro = () => {
    const sugerencias = [];
    Object.entries(estadisticasPorCategoria).forEach(([categoria, data]) => {
      if (data.gastoActual > data.promedioAnterior * 1.3 && data.promedioAnterior > 0) {
        const ahorroPotencial = data.gastoActual - data.promedioAnterior;
        sugerencias.push({
          categoria,
          ahorroPotencial,
          mensaje: `Si ajustas el gasto en ${categoria} a tu promedio habitual, ahorrarías S/${ahorroPotencial.toFixed(2)} este mes.`
        });
      }
    });
    return sugerencias;
  };

  return {
    alertas,
    estadisticasPorCategoria,
    resumenMensual,
    calcularTiempoParaCompra,
    obtenerSugerenciasAhorro
  };
}