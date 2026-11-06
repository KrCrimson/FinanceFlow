/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/__tests__/PlanificadorCompras.test.jsx
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de PlanificadorCompras: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-25, RF-26  (módulos: Planificador)
 * Casos de uso ....: CU-11 Planificar compras (Carrera de compras planificadas)
 * Reglas de negocio : RN-19
 * Depende de ......: frontend/src/components/PlanificadorCompras.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlanificadorCompras from '../components/PlanificadorCompras';

// CP-38 / CP-39: carrera de metas contra el balance disponible.
const meta = (id, nombre, monto, estado = 'planificado') => ({ _id: id, nombre, monto, estado });

const renderPlanificador = (props = {}) =>
  render(
    <PlanificadorCompras
      movimientos={[]}
      balanceTotal={0}
      onCrearEgreso={jest.fn()}
      onUpdateEgreso={jest.fn()}
      {...props}
    />
  );

describe('PlanificadorCompras - cálculo de avance (CP-38)', () => {
  it('muestra el mensaje vacío cuando no hay metas planificadas', () => {
    renderPlanificador();
    expect(screen.getByText(/No tienes compras planificadas activas/i)).toBeInTheDocument();
  });

  it('calcula el porcentaje de avance contra el balance disponible', () => {
    renderPlanificador({
      movimientos: [meta('1', 'Laptop', 1000)],
      balanceTotal: 250,
    });
    expect(screen.getByText('25% Completado')).toBeInTheDocument();
    expect(screen.queryByText(/Listo para comprar/i)).not.toBeInTheDocument();
  });

  it('marca la meta como lista para comprar cuando el balance la cubre', () => {
    renderPlanificador({
      movimientos: [meta('1', 'Celular', 800)],
      balanceTotal: 1200,
    });
    expect(screen.getByText('100% Completado')).toBeInTheDocument();
    expect(screen.getByText(/Listo para comprar/i)).toBeInTheDocument();
  });

  it('limita el avance al 100% aunque el balance supere por mucho la meta', () => {
    renderPlanificador({
      movimientos: [meta('1', 'Mouse', 50)],
      balanceTotal: 100000,
    });
    expect(screen.getByText('100% Completado')).toBeInTheDocument();
  });

  it('evalúa cada meta de forma independiente contra el mismo balance', () => {
    renderPlanificador({
      movimientos: [meta('1', 'Barata', 100), meta('2', 'Cara', 1000)],
      balanceTotal: 500,
    });
    expect(screen.getByText('100% Completado')).toBeInTheDocument();
    expect(screen.getByText('50% Completado')).toBeInTheDocument();
  });

  it('ignora los movimientos que no están en estado planificado', () => {
    renderPlanificador({
      movimientos: [meta('1', 'Ya comprado', 300, 'activo'), meta('2', 'Cancelado', 300, 'inactivo')],
      balanceTotal: 1000,
    });
    expect(screen.getByText(/No tienes compras planificadas activas/i)).toBeInTheDocument();
  });
});

describe('PlanificadorCompras - balance cero o negativo (CP-39)', () => {
  it('con balance negativo el avance es 0% y ninguna meta está lista', () => {
    renderPlanificador({
      movimientos: [meta('1', 'Laptop', 1000)],
      balanceTotal: -500,
    });
    expect(screen.getByText('0% Completado')).toBeInTheDocument();
    expect(screen.queryByText(/Listo para comprar/i)).not.toBeInTheDocument();
  });

  it('con balance cero el avance es 0%', () => {
    renderPlanificador({
      movimientos: [meta('1', 'Laptop', 1000)],
      balanceTotal: 0,
    });
    expect(screen.getByText('0% Completado')).toBeInTheDocument();
  });

  it('si no llega el balance (undefined) no se rompe y muestra 0%', () => {
    renderPlanificador({
      movimientos: [meta('1', 'Laptop', 1000)],
      balanceTotal: undefined,
    });
    expect(screen.getByText('0% Completado')).toBeInTheDocument();
  });
});

describe('PlanificadorCompras - nueva meta', () => {
  const abrirModal = () => fireEvent.click(screen.getByText('Nueva Meta'));

  it('no crea la meta si el monto es cero o negativo', async () => {
    const onCrearEgreso = jest.fn();
    window.alert = jest.fn();
    renderPlanificador({ onCrearEgreso });
    abrirModal();
    fireEvent.change(screen.getByPlaceholderText('Ej: Laptop Nueva'), { target: { value: 'Algo' } });
    fireEvent.change(screen.getByPlaceholderText('1500.00'), { target: { value: '-20' } });
    fireEvent.click(screen.getByText('Añadir Meta'));
    expect(window.alert).toHaveBeenCalled();
    expect(onCrearEgreso).not.toHaveBeenCalled();
  });

  it('crea el egreso planificado con los datos ingresados', async () => {
    const onCrearEgreso = jest.fn().mockResolvedValue({});
    renderPlanificador({ onCrearEgreso });
    abrirModal();
    fireEvent.change(screen.getByPlaceholderText('Ej: Laptop Nueva'), { target: { value: '  Laptop  ' } });
    fireEvent.change(screen.getByPlaceholderText('1500.00'), { target: { value: '2500.50' } });
    fireEvent.click(screen.getByText('Añadir Meta'));
    await waitFor(() => expect(onCrearEgreso).toHaveBeenCalledTimes(1));
    expect(onCrearEgreso).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: 'Laptop', monto: 2500.5, tipo: 'egreso', estado: 'planificado' })
    );
  });
});

describe('PlanificadorCompras - acciones sobre una meta', () => {
  it('"Comprado" confirma y pasa la meta a estado activo', async () => {
    const onUpdateEgreso = jest.fn().mockResolvedValue({});
    window.confirm = jest.fn(() => true);
    renderPlanificador({ movimientos: [meta('abc', 'Laptop', 900)], balanceTotal: 900, onUpdateEgreso });
    fireEvent.click(screen.getByText(/Comprado/));
    await waitFor(() => expect(onUpdateEgreso).toHaveBeenCalledTimes(1));
    expect(onUpdateEgreso).toHaveBeenCalledWith('abc', expect.objectContaining({ estado: 'activo' }));
  });

  it('si el usuario no confirma, no se modifica nada', () => {
    const onUpdateEgreso = jest.fn();
    window.confirm = jest.fn(() => false);
    renderPlanificador({ movimientos: [meta('abc', 'Laptop', 900)], balanceTotal: 900, onUpdateEgreso });
    fireEvent.click(screen.getByText(/Comprado/));
    expect(onUpdateEgreso).not.toHaveBeenCalled();
  });

  it('cancelar una meta la deja en estado inactivo', async () => {
    const onUpdateEgreso = jest.fn().mockResolvedValue({});
    window.confirm = jest.fn(() => true);
    renderPlanificador({ movimientos: [meta('xyz', 'Moto', 5000)], onUpdateEgreso });
    fireEvent.click(screen.getByTitle('Cancelar Planificación'));
    await waitFor(() => expect(onUpdateEgreso).toHaveBeenCalledWith('xyz', { estado: 'inactivo' }));
  });
});
