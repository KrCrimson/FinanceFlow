import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Modal, TextInput, Alert, Platform, StatusBar } from 'react-native';
import { fetchMovimientos, createMovimiento, crearCierre, updateMovimiento, fetchCierresPendientes, fetchResumenPeriodo } from '../services/api';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const MONTH_OPTIONS = [
  { label: 'Julio 2026', month: 6, year: 2026 },
  { label: 'Junio 2026', month: 5, year: 2026 },
  { label: 'Mayo 2026', month: 4, year: 2026 },
  { label: 'Abril 2026', month: 3, year: 2026 },
  { label: 'Todos los Meses', month: -1, year: -1 }
];

export default function DashboardScreen({ user, onNavigateToNewMovement, isDarkMode }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendientes, setPendientes] = useState(null);

  // Filtro por Meses
  const [selectedMonth, setSelectedMonth] = useState(MONTH_OPTIONS[0]);
  const [showMonthModal, setShowMonthModal] = useState(false);

  // Planificador de Compras
  const [showAddCompraModal, setShowAddCompraModal] = useState(false);
  const [nuevaCompraItem, setNuevaCompraItem] = useState('');
  const [nuevaCompraMonto, setNuevaCompraMonto] = useState('');

  // Modal de Arqueo Completo (Caja Chica)
  const [showArqueoModal, setShowArqueoModal] = useState(false);
  const [cierreTipo, setCierreTipo] = useState('diario'); // 'diario' o 'mensual'
  const [cierrePeriodo, setCierrePeriodo] = useState('');
  const [cierreResumen, setCierreResumen] = useState({ ingresosTotales: 0, egresosTotales: 0 });
  const [fondoFijo, setFondoFijo] = useState('0');
  const [saldoFisico, setSaldoFisico] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [password, setPassword] = useState('');
  const [submittingCierre, setSubmittingCierre] = useState(false);
  const [cierreError, setCierreError] = useState('');

  // Planificador de Compras derivados de la base de datos
  const comprasPlanificadas = movimientos
    .filter((m) => m.estado === 'planificado')
    .map((m) => ({
      id: m._id,
      item: m.nombre,
      montoObjetivo: m.monto
    }));

  const autoCheckRecurrentIncomes = async (data) => {
    try {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const currentDay = today.getDate();

      const recurrentes = data.filter(
        (m) => m.estado === 'activo' && m.tipo === 'ingreso' && m.esRecurrente
      );

      let createdAny = false;

      for (const rec of recurrentes) {
        const recDate = new Date(rec.fecha);
        const dayOfMonth = recDate.getDate();

        if (currentDay >= dayOfMonth) {
          const yaExiste = data.some((m) => {
            const d = new Date(m.fecha);
            return (
              m.estado === 'activo' &&
              m.nombre === rec.nombre &&
              m.monto === rec.monto &&
              d.getFullYear() === currentYear &&
              d.getMonth() === currentMonth &&
              !m.esRecurrente
            );
          });

          if (!yaExiste) {
            const fechaCobro = new Date(currentYear, currentMonth, dayOfMonth);
            await createMovimiento({
              nombre: rec.nombre,
              tipo: 'ingreso',
              monto: rec.monto,
              categoria: rec.categoria,
              descripcion: 'Ingreso constante mensual autogenerado',
              fecha: fechaCobro.toISOString(),
              esRecurrente: false
            });
            createdAny = true;
          }
        }
      }

      return createdAny;
    } catch (err) {
      console.error('Error autogenerando ingresos constantes:', err);
      return false;
    }
  };

  const triggerNotification = async (title, body) => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        finalStatus = newStatus;
      }
      if (finalStatus === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: true,
          },
          trigger: null,
        });
      }
    } catch (e) {
      console.log('Error enviando notificación:', e);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      let data = await fetchMovimientos();
      
      const created = await autoCheckRecurrentIncomes(data || []);
      if (created) {
        data = await fetchMovimientos();
      }

      setMovimientos(data || []);

      // Cargar cierres pendientes con fecha local YYYY-MM-DD
      const localDate = new Date().toISOString().slice(0, 10);
      const dataPendientes = await fetchCierresPendientes(localDate);
      setPendientes(dataPendientes);

      if (dataPendientes?.yesterday && !dataPendientes.yesterday.isClosed) {
        triggerNotification('📅 Arqueo Diario Pendiente', `Tienes un arqueo de caja pendiente para el día ${dataPendientes.yesterday.date}.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleOpenArqueoModal = async (tipo, periodo, resumen) => {
    try {
      setCierreTipo(tipo);
      setCierrePeriodo(periodo);
      setFondoFijo('0');
      setSaldoFisico('');
      setComentarios('');
      setPassword('');
      setCierreError('');
      
      if (resumen) {
        setCierreResumen(resumen);
      } else {
        // Cargar resumen del periodo desde la API
        const dataResumen = await fetchResumenPeriodo(tipo, periodo);
        setCierreResumen({
          ingresosTotales: dataResumen?.ingresosTotales || 0,
          egresosTotales: dataResumen?.egresosTotales || 0
        });
      }
      setShowArqueoModal(true);
    } catch (err) {
      Alert.alert('Error', 'No se pudo obtener el resumen del periodo.');
    }
  };

  const handleConfirmarCierre = async () => {
    if (saldoFisico === '') {
      setCierreError('Por favor digite el dinero físico en caja');
      return;
    }
    if (cierreTipo === 'mensual' && !password) {
      setCierreError('Se requiere la contraseña para cerrar el mes');
      return;
    }

    try {
      setSubmittingCierre(true);
      setCierreError('');

      await crearCierre({
        tipo: cierreTipo,
        periodo: cierrePeriodo,
        fondoFijo: Number(fondoFijo) || 0,
        saldoFisico: Number(saldoFisico),
        comentarios,
        password
      });

      setShowArqueoModal(false);
      Alert.alert('¡Cierre Exitoso!', `El arqueo ${cierreTipo} ha sido registrado de forma segura.`);
      await loadData();
    } catch (err) {
      setCierreError(err.message || 'Error al guardar el cierre. Verifique sus datos.');
    } finally {
      setSubmittingCierre(false);
    }
  };

  const handleAddCompra = async () => {
    const amount = parseFloat(nuevaCompraMonto);
    if (!nuevaCompraItem.trim() || isNaN(amount) || amount <= 0) {
      Alert.alert('Datos Inválidos', 'Ingresa una meta y un monto válido.');
      return;
    }

    try {
      await createMovimiento({
        nombre: nuevaCompraItem.trim(),
        tipo: 'egreso',
        monto: amount,
        categoria: 'Otros',
        descripcion: 'Meta planificada',
        fecha: new Date().toISOString(),
        estado: 'planificado'
      });
      setNuevaCompraItem('');
      setNuevaCompraMonto('');
      setShowAddCompraModal(false);
      await loadData();
      Alert.alert('¡Meta Agregada!', 'Tu meta de compra ha sido añadida y sincronizada.');
    } catch (err) {
      Alert.alert('Error', 'No se pudo guardar la meta de compra.');
    }
  };

  // Botón "Comprado" -> Convierte la meta en Egreso y refresca el Dashboard
  const handleMarcarComprado = (compra) => {
    Alert.alert(
      '🛒 Confirmar Compra',
      `¿Deseas cerrar "${compra.item}" y registrar el egreso por S/ ${compra.montoObjetivo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Comprado',
          onPress: async () => {
            try {
              await updateMovimiento(compra.id, {
                estado: 'activo',
                fecha: new Date().toISOString(),
                descripcion: 'Meta cumplida y convertida en egreso real'
              });

              await loadData();
              Alert.alert('🎉 ¡Felicidades!', `Se registró el egreso de S/ ${compra.montoObjetivo} en tus movimientos.`);
            } catch (err) {
              Alert.alert('Error', 'No se pudo registrar la compra.');
            }
          }
        }
      ]
    );
  };

  // Botón "Cancelar Planificación"
  const handleCancelarCompra = (id, nombre) => {
    Alert.alert(
      '❌ Cancelar Planificación',
      `¿Estás seguro de cancelar la meta "${nombre}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateMovimiento(id, { estado: 'inactivo' });
              await loadData();
              Alert.alert('Meta Cancelada', 'La planificación ha sido removida.');
            } catch (err) {
              Alert.alert('Error', 'No se pudo cancelar la meta.');
            }
          }
        }
      ]
    );
  };

  const theme = isDarkMode ? darkStyles : lightStyles;

  // Filtrado de movimientos por el mes seleccionado
  const activos = movimientos.filter((m) => m.estado === 'activo');
  const filteredActivos = activos.filter((m) => {
    if (selectedMonth.month === -1) return true;
    const date = new Date(m.fecha);
    return date.getMonth() === selectedMonth.month && date.getFullYear() === selectedMonth.year;
  });

  const totalIngresos = filteredActivos
    .filter((m) => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + m.monto, 0);
  const totalEgresos = filteredActivos
    .filter((m) => m.tipo === 'egreso')
    .reduce((sum, m) => sum + m.monto, 0);
  const balanceTotal = totalIngresos - totalEgresos;
  const recurrentes = filteredActivos.filter((m) => m.esRecurrente);

  // CARRERA DE METAS CONTRA BALANCE TOTAL
  const balanceDisponible = Math.max(0, balanceTotal);
  const comprasConAvance = comprasPlanificadas.map((compra) => {
    const asignado = Math.min(balanceDisponible, compra.montoObjetivo);
    const porcentaje = compra.montoObjetivo > 0 
      ? Math.min(100, (balanceDisponible / compra.montoObjetivo) * 100) 
      : 0;
    
    return {
      ...compra,
      montoAhorrado: asignado,
      porcentaje,
      alcanzado: balanceDisponible >= compra.montoObjetivo
    };
  });

  // Cálculos dinámicos de arqueo en el modal
  const ff = Number(fondoFijo) || 0;
  const saldoEsperado = ff + (cierreResumen?.ingresosTotales || 0) - (cierreResumen?.egresosTotales || 0);
  const diferencia = saldoFisico !== '' ? Number(saldoFisico) - saldoEsperado : 0;

  return (
    <SafeAreaView style={theme.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#064E3B' : '#6EE7B7'} translucent />
      
      <ScrollView
        contentContainerStyle={theme.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#34D399" colors={['#34D399']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con Titulo & Selector de Meses */}
        <View style={theme.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={theme.welcomeTitle}>🏠 Dashboard</Text>
            <Text style={theme.welcomeSubtitle}>Resumen de tu actividad financiera</Text>
          </View>

          {/* Selector de Mes */}
          <TouchableOpacity
            style={theme.monthSelectorBtn}
            onPress={() => setShowMonthModal(true)}
            activeOpacity={0.8}
          >
            <Text style={theme.monthSelectorText}>📅 {selectedMonth.label} ∨</Text>
          </TouchableOpacity>
        </View>

        {/* Banner Arqueo Diario Pendiente */}
        {pendientes && pendientes.yesterday && !pendientes.yesterday.isClosed && (
          <View style={theme.arqueoCard}>
            <View style={theme.arqueoHeader}>
              <Text style={theme.arqueoIcon}>📅</Text>
              <View style={{ flex: 1 }}>
                <Text style={theme.arqueoTitle}>Arqueo Diario: Ayer ({pendientes.yesterday.date})</Text>
                <Text style={theme.arqueoSummary}>
                  Ingresos: <Text style={{ color: '#059669', fontWeight: 'bold' }}>+${pendientes.yesterday.resumen?.ingresosTotales || 0}</Text> | Egresos: <Text style={{ color: '#DC2626', fontWeight: 'bold' }}>-${pendientes.yesterday.resumen?.egresosTotales || 0}</Text>
                </Text>
              </View>
            </View>
            <View style={theme.arqueoActions}>
              <TouchableOpacity
                style={[theme.arqueoBtn, theme.arqueoBtnGreen]}
                onPress={() => handleOpenArqueoModal('diario', pendientes.yesterday.date, pendientes.yesterday.resumen)}
                activeOpacity={0.8}
              >
                <Text style={theme.arqueoBtnText}>✅ Hacer Arqueo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Banner Cierre Mensual Pendiente */}
        {pendientes && pendientes.prevMonth && !pendientes.prevMonth.isClosed && (
          <View style={[theme.arqueoCard, { borderColor: '#EF4444', backgroundColor: '#FEF2F2' }]}>
            <View style={theme.arqueoHeader}>
              <Text style={theme.arqueoIcon}>🚨</Text>
              <View style={{ flex: 1 }}>
                <Text style={[theme.arqueoTitle, { color: '#991B1B' }]}>Cierre Mensual Requerido: {pendientes.prevMonth.periodo}</Text>
                <Text style={[theme.arqueoSummary, { color: '#B91C1C' }]}>
                  El mes anterior está abierto. Cerrar el mes requiere contraseña y bloqueará sus transacciones.
                </Text>
              </View>
            </View>
            <View style={theme.arqueoActions}>
              <TouchableOpacity
                style={[theme.arqueoBtn, { backgroundColor: '#EF4444' }]}
                onPress={() => handleOpenArqueoModal('mensual', pendientes.prevMonth.periodo)}
                activeOpacity={0.8}
              >
                <Text style={theme.arqueoBtnText}>🔒 Cerrar Mes Anterior</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Mallas de Balances */}
        <View style={theme.balanceGrid}>
          <View style={[theme.balanceCard, { backgroundColor: '#10B981' }]}>
            <Text style={theme.balanceLabel}>Total Ingresos</Text>
            <Text style={theme.balanceValue} numberOfLines={1} adjustsFontSizeToFit>
              S/ {totalIngresos.toFixed(2)}
            </Text>
          </View>
          <View style={[theme.balanceCard, { backgroundColor: '#EF4444' }]}>
            <Text style={theme.balanceLabel}>Total Egresos</Text>
            <Text style={theme.balanceValue} numberOfLines={1} adjustsFontSizeToFit>
              S/ {totalEgresos.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[theme.balanceCardWide, { backgroundColor: '#3B82F6' }]}>
          <Text style={theme.balanceLabel}>Balance Total ({selectedMonth.label})</Text>
          <Text style={theme.balanceValueWide} numberOfLines={1} adjustsFontSizeToFit>
            S/ {balanceTotal.toFixed(2)}
          </Text>
        </View>

        {/* Planificador de Compras */}
        <View style={theme.sectionHeaderRow}>
          <Text style={theme.sectionHeader}>🏁 Carrera de Compras Planificadas</Text>
          <TouchableOpacity style={theme.addGoalBtn} onPress={() => setShowAddCompraModal(true)} activeOpacity={0.8}>
            <Text style={theme.addGoalBtnText}>+ Nueva Meta</Text>
          </TouchableOpacity>
        </View>

        {comprasConAvance.length === 0 ? (
          <Text style={theme.emptyText}>No tienes compras planificadas activas.</Text>
        ) : (
          comprasConAvance.map((compra) => (
            <View key={compra.id} style={[theme.goalCard, compra.alcanzado && { borderColor: '#10B981', borderWidth: 2 }]}>
              <View style={theme.goalHeader}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={theme.goalTitle}>
                    {compra.item} {compra.alcanzado ? '🎉 (¡Listo para comprar!)' : ''}
                  </Text>
                  <Text style={theme.goalAmount}>
                    S/ {compra.montoAhorrado.toFixed(2)} / S/ {compra.montoObjetivo.toFixed(2)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {/* Botón Comprado */}
                  <TouchableOpacity
                    style={[theme.compradoBtn, compra.alcanzado && { backgroundColor: '#059669' }]}
                    onPress={() => handleMarcarComprado(compra)}
                    activeOpacity={0.8}
                  >
                    <Text style={theme.compradoBtnText}>🛒 Comprado</Text>
                  </TouchableOpacity>

                  {/* Botón Cancelar */}
                  <TouchableOpacity
                    style={theme.cancelGoalBtn}
                    onPress={() => handleCancelarCompra(compra.id, compra.item)}
                    activeOpacity={0.8}
                  >
                    <Text style={theme.cancelGoalBtnText}>❌</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={theme.goalTrack}>
                <View style={[theme.goalFill, { width: `${compra.porcentaje}%`, backgroundColor: compra.alcanzado ? '#10B981' : '#34D399' }]} />
              </View>
              <Text style={[theme.goalPercent, compra.alcanzado && { color: '#10B981', fontWeight: 'bold' }]}>
                {compra.porcentaje.toFixed(0)}% Completado {compra.alcanzado ? '• ¡Dinero suficiente!' : ''}
              </Text>
            </View>
          ))
        )}

        {/* Sección de Movimientos Recientes */}
        <Text style={theme.sectionHeader}>📂 Movimientos Recientes</Text>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#34D399" style={{ marginTop: 20 }} />
        ) : filteredActivos.length === 0 ? (
          <Text style={theme.emptyText}>No hay transacciones registradas para este periodo.</Text>
        ) : (
          filteredActivos.slice(0, 15).map((item) => (
            <View key={item._id} style={theme.txCard}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={theme.txName} numberOfLines={1}>{item.nombre}</Text>
                <Text style={theme.txMeta} numberOfLines={1}>{item.categoria} • {new Date(item.fecha).toLocaleDateString()}</Text>
              </View>
              <Text style={[theme.txAmount, { color: item.tipo === 'ingreso' ? '#10B981' : '#EF4444' }]} numberOfLines={1}>
                {item.tipo === 'ingreso' ? '+' : '-'} S/ {item.monto.toFixed(2)}
              </Text>
            </View>
          ))
        )}

        {/* Sección de Ingresos Constantes */}
        {recurrentes.length > 0 && (
          <>
            <Text style={theme.sectionHeader}>🔄 Ingresos Constantes</Text>
            {recurrentes.map((item) => (
              <View key={item._id} style={theme.recurrenteCard}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={theme.recurrenteTitle} numberOfLines={1}>{item.nombre}</Text>
                  <Text style={theme.recurrenteSubtitle} numberOfLines={1}>{item.categoria}</Text>
                </View>
                <Text style={theme.recurrenteAmount} numberOfLines={1}>+ S/ {item.monto.toFixed(2)}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Modal Selector de Mes */}
      <Modal visible={showMonthModal} transparent animationType="fade">
        <View style={theme.modalOverlay}>
          <View style={theme.modalContent}>
            <Text style={theme.modalTitle}>📅 Seleccionar Mes</Text>
            {MONTH_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={[theme.monthOption, selectedMonth.label === opt.label && theme.monthOptionActive]}
                onPress={() => {
                  setSelectedMonth(opt);
                  setShowMonthModal(false);
                }}
              >
                <Text style={[theme.monthOptionText, selectedMonth.label === opt.label && theme.monthOptionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={theme.modalCloseBtn} onPress={() => setShowMonthModal(false)}>
              <Text style={theme.modalCloseBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Nueva Meta de Compra */}
      <Modal visible={showAddCompraModal} transparent animationType="slide">
        <View style={theme.modalOverlay}>
          <View style={theme.modalContent}>
            <Text style={theme.modalTitle}>🛍️ Nueva Meta de Compra</Text>
            
            <Text style={theme.inputLabel}>Producto o Meta</Text>
            <TextInput
              style={theme.modalInput}
              placeholder="Ej: Celular Nuevo"
              placeholderTextColor="#9CA3AF"
              value={nuevaCompraItem}
              onChangeText={setNuevaCompraItem}
            />

            <Text style={theme.inputLabel}>Monto Objetivo (S/)</Text>
            <TextInput
              style={theme.modalInput}
              placeholder="1500.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={nuevaCompraMonto}
              onChangeText={setNuevaCompraMonto}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <TouchableOpacity style={theme.cancelBtn} onPress={() => setShowAddCompraModal(false)}>
                <Text style={theme.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={theme.saveGoalBtn} onPress={handleAddCompra}>
                <Text style={theme.saveGoalBtnText}>Añadir Meta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE ARQUEO / CIERRE DE CAJA (Caja Chica) */}
      <Modal visible={showArqueoModal} transparent animationType="slide">
        <View style={theme.modalOverlay}>
          <ScrollView contentContainerStyle={{ justifyContent: 'center', minHeight: '100%', width: '100%', paddingVertical: 40 }}>
            <View style={theme.modalContent}>
              <Text style={theme.modalTitle}>🏛️ Cierre {cierreTipo === 'diario' ? 'Diario' : 'Mensual'}</Text>
              <Text style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13, marginBottom: 12 }}>Periodo: {cierrePeriodo}</Text>

              {/* Resumen Contable */}
              <View style={{ backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#9CA3AF', marginBottom: 6 }}>RESUMEN CONTABLE</Text>
                
                <View style={{ flexDirection: 'row', justifycontent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13, color: isDarkMode ? '#D1D5DB' : '#374151' }}>💵 Saldo Inicial (Fondo):</Text>
                  <TextInput
                    style={{ borderBottomWidth: 1, borderBottomColor: '#9CA3AF', width: 80, textAlign: 'right', fontSize: 13, color: isDarkMode ? '#FFF' : '#000', fontWeight: 'bold', padding: 0 }}
                    value={fondoFijo}
                    onChangeText={setFondoFijo}
                    keyboardType="numeric"
                  />
                </View>

                <View style={{ flexDirection: 'row', justifycontent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13, color: isDarkMode ? '#D1D5DB' : '#374151' }}>📈 (+) Ingresos Totales:</Text>
                  <Text style={{ fontSize: 13, color: '#10B981', fontWeight: 'bold' }}>+S/ {cierreResumen.ingresosTotales.toFixed(2)}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifycontent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13, color: isDarkMode ? '#D1D5DB' : '#374151' }}>📉 (-) Egresos Totales:</Text>
                  <Text style={{ fontSize: 13, color: '#EF4444', fontWeight: 'bold' }}>-S/ {cierreResumen.egresosTotales.toFixed(2)}</Text>
                </View>

                <View style={{ borderTopWidth: 1, borderTopColor: '#9CA3AF', paddingTop: 6, marginTop: 6, flexDirection: 'row', justifycontent: 'space-between' }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: isDarkMode ? '#FFF' : '#1F2937' }}>💰 (=) Saldo Esperado:</Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: isDarkMode ? '#FFF' : '#1F2937' }}>S/ {saldoEsperado.toFixed(2)}</Text>
                </View>
              </View>

              {/* Input Dinero Físico */}
              <Text style={theme.inputLabel}>💵 Dinero Físico Real en Caja</Text>
              <TextInput
                style={[theme.modalInput, { fontSize: 18, fontWeight: 'bold', textAlign: 'center' }]}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={saldoFisico}
                onChangeText={setSaldoFisico}
              />

              {/* Diferencia */}
              {saldoFisico !== '' && (
                <View style={{
                  backgroundColor: diferencia === 0 ? '#ECFDF5' : diferencia < 0 ? '#FEF2F2' : '#FFFBEB',
                  borderColor: diferencia === 0 ? '#10B981' : diferencia < 0 ? '#EF4444' : '#F59E0B',
                  borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 10, flexDirection: 'row', justifycontent: 'space-between', alignItems: 'center'
                }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9CA3AF' }}>RESULTADO DEL ARQUEO</Text>
                    <Text style={{ fontSize: 11, color: diferencia === 0 ? '#065F46' : diferencia < 0 ? '#991B1B' : '#92400E' }}>
                      {diferencia === 0 ? '✅ Caja cuadra perfectamente.' : diferencia < 0 ? '⚠️ Caja no cuadra. Faltante.' : '💡 Caja no cuadra. Sobrante.'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: diferencia === 0 ? '#065F46' : diferencia < 0 ? '#991B1B' : '#92400E' }}>
                    S/ {diferencia.toFixed(2)}
                  </Text>
                </View>
              )}

              {/* Comentarios */}
              <Text style={theme.inputLabel}>📝 Comentarios del Arqueo</Text>
              <TextInput
                style={[theme.modalInput, { height: 50, textAlignVertical: 'top' }]}
                placeholder="Notas u observaciones de faltantes/sobrantes..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={comentarios}
                onChangeText={setComentarios}
              />

              {/* Contraseña para Cierre Mensual */}
              {cierreTipo === 'mensual' && (
                <View style={{ marginTop: 12, padding: 10, backgroundColor: '#FEF2F2', borderRadius: 10, borderWidth: 1, borderColor: '#FCA5A5' }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#991B1B', marginBottom: 4 }}>🔒 Ingrese Contraseña de Cuenta</Text>
                  <TextInput
                    style={[theme.modalInput, { backgroundColor: '#FFF' }]}
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Text style={{ fontSize: 9, color: '#B91C1C', marginTop: 4 }}>
                    ⚠️ Acción irreversible. Cierra definitivamente el mes.
                  </Text>
                </View>
              )}

              {cierreError !== '' && (
                <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 12, textAlign: 'center', marginTop: 10 }}>❌ {cierreError}</Text>
              )}

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                <TouchableOpacity style={theme.cancelBtn} onPress={() => setShowArqueoModal(false)}>
                  <Text style={theme.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[theme.saveGoalBtn, { backgroundColor: '#3B82F6' }]}
                  onPress={handleConfirmarCierre}
                  disabled={submittingCierre || saldoFisico === ''}
                >
                  <Text style={theme.saveGoalBtnText}>{submittingCierre ? 'Guardando...' : '💾 Guardar Cierre'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const baseStyles = {
  scrollContent: { padding: 16, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', justifycontent: 'space-between', alignItems: 'center', marginBottom: 16 },
  monthSelectorBtn: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  monthSelectorText: { fontSize: 12, fontWeight: 'bold' },
  arqueoCard: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16 },
  arqueoHeader: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  arqueoIcon: { fontSize: 24 },
  arqueoTitle: { fontSize: 13, fontWeight: 'bold' },
  arqueoSummary: { fontSize: 12, marginTop: 2 },
  arqueoActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  arqueoBtn: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  arqueoBtnGreen: { backgroundColor: '#10B981' },
  arqueoBtnBlue: { backgroundColor: '#3B82F6' },
  arqueoBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  balanceGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  balanceCard: { flex: 1, padding: 14, borderRadius: 12 },
  balanceCardWide: { padding: 16, borderRadius: 12, marginBottom: 16 },
  balanceLabel: { color: '#FFFFFF', opacity: 0.9, fontSize: 12, fontWeight: '600' },
  balanceValue: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  balanceValueWide: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  sectionHeaderRow: { flexDirection: 'row', justifycontent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 10 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold' },
  addGoalBtn: { backgroundColor: '#34D399', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  addGoalBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  goalCard: { borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1 },
  goalHeader: { flexDirection: 'row', justifycontent: 'space-between', alignItems: 'center', marginBottom: 6 },
  goalTitle: { fontSize: 13, fontWeight: 'bold' },
  goalAmount: { fontSize: 12, color: '#10B981', fontWeight: 'bold' },
  compradoBtn: { backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  compradoBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  cancelGoalBtn: { backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6 },
  cancelGoalBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  goalTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  goalFill: { height: '100%', backgroundColor: '#34D399', borderRadius: 4 },
  goalPercent: { fontSize: 11, alignSelf: 'flex-end', marginTop: 4 },
  emptyText: { padding: 20, textAlign: 'center' },
  txCard: { borderRadius: 12, padding: 12, flexDirection: 'row', justifycontent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1 },
  txName: { fontSize: 14, fontWeight: 'bold' },
  txMeta: { fontSize: 11, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: 'bold' },
  recurrenteCard: { borderLeftWidth: 4, borderLeftColor: '#3B82F6', padding: 12, borderRadius: 8, flexDirection: 'row', justifycontent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1 },
  recurrenteTitle: { fontSize: 13, fontWeight: 'bold' },
  recurrenteSubtitle: { fontSize: 11, marginTop: 2 },
  recurrenteAmount: { fontSize: 14, fontWeight: 'bold', color: '#10B981' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifycontent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', borderRadius: 16, padding: 20, borderWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 14, textAlign: 'center' },
  monthOption: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, marginBottom: 8 },
  monthOptionActive: { backgroundColor: '#34D399', borderColor: '#34D399' },
  monthOptionText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  monthOptionTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  modalCloseBtn: { marginTop: 10, paddingVertical: 10, alignItems: 'center' },
  modalCloseBtnText: { color: '#6B7280', fontWeight: 'bold', fontSize: 14 },
  inputLabel: { fontSize: 13, fontWeight: 'bold', marginBottom: 4, marginTop: 10 },
  modalInput: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1 },
  cancelBtn: { flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: '#374151', fontWeight: 'bold' },
  saveGoalBtn: { flex: 1, backgroundColor: '#34D399', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  saveGoalBtnText: { color: '#FFFFFF', fontWeight: 'bold' }
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  welcomeTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  welcomeSubtitle: { fontSize: 12, color: '#4B5563', marginTop: 2 },
  monthSelectorBtn: { ...baseStyles.monthSelectorBtn, backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' },
  monthSelectorText: { ...baseStyles.monthSelectorText, color: '#374151' },
  arqueoCard: { ...baseStyles.arqueoCard, backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  arqueoTitle: { ...baseStyles.arqueoTitle, color: '#1E3A8A' },
  arqueoSummary: { ...baseStyles.arqueoSummary, color: '#3B82F6' },
  sectionHeader: { ...baseStyles.sectionHeader, color: '#1F2937' },
  goalCard: { ...baseStyles.goalCard, backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  goalTitle: { ...baseStyles.goalTitle, color: '#1F2937' },
  goalPercent: { ...baseStyles.goalPercent, color: '#6B7280' },
  emptyText: { ...baseStyles.emptyText, color: '#6B7280' },
  txCard: { ...baseStyles.txCard, backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  txName: { ...baseStyles.txName, color: '#1F2937' },
  txMeta: { ...baseStyles.txMeta, color: '#6B7280' },
  recurrenteCard: { ...baseStyles.recurrenteCard, backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  recurrenteTitle: { ...baseStyles.recurrenteTitle, color: '#1F2937' },
  recurrenteSubtitle: { ...baseStyles.recurrenteSubtitle, color: '#6B7280' },
  modalContent: { ...baseStyles.modalContent, backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  modalTitle: { ...baseStyles.modalTitle, color: '#1F2937' },
  monthOption: { ...baseStyles.monthOption, borderColor: '#E5E7EB' },
  monthOptionText: { ...baseStyles.monthOptionText, color: '#374151' },
  inputLabel: { ...baseStyles.inputLabel, color: '#374151' },
  modalInput: { ...baseStyles.modalInput, backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#1F2937' }
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: { flex: 1, backgroundColor: '#111827' },
  welcomeTitle: { fontSize: 20, fontWeight: 'bold', color: '#F9FAFB' },
  welcomeSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  monthSelectorBtn: { ...baseStyles.monthSelectorBtn, backgroundColor: '#1F2937', borderColor: '#374151' },
  monthSelectorText: { ...baseStyles.monthSelectorText, color: '#F9FAFB' },
  arqueoCard: { ...baseStyles.arqueoCard, backgroundColor: '#1E293B', borderColor: '#3B82F6' },
  arqueoTitle: { ...baseStyles.arqueoTitle, color: '#60A5FA' },
  arqueoSummary: { ...baseStyles.arqueoSummary, color: '#93C5FD' },
  sectionHeader: { ...baseStyles.sectionHeader, color: '#F9FAFB' },
  goalCard: { ...baseStyles.goalCard, backgroundColor: '#1F2937', borderColor: '#374151' },
  goalTitle: { ...baseStyles.goalTitle, color: '#F9FAFB' },
  goalPercent: { ...baseStyles.goalPercent, color: '#9CA3AF' },
  emptyText: { ...baseStyles.emptyText, color: '#9CA3AF' },
  txCard: { ...baseStyles.txCard, backgroundColor: '#1F2937', borderColor: '#374151' },
  txName: { ...baseStyles.txName, color: '#F9FAFB' },
  txMeta: { ...baseStyles.txMeta, color: '#9CA3AF' },
  recurrenteCard: { ...baseStyles.recurrenteCard, backgroundColor: '#1F2937', borderColor: '#374151' },
  recurrenteTitle: { ...baseStyles.recurrenteTitle, color: '#F9FAFB' },
  recurrenteSubtitle: { ...baseStyles.recurrenteSubtitle, color: '#9CA3AF' },
  modalContent: { ...baseStyles.modalContent, backgroundColor: '#1F2937', borderColor: '#374151' },
  modalTitle: { ...baseStyles.modalTitle, color: '#F9FAFB' },
  monthOption: { ...baseStyles.monthOption, borderColor: '#374151' },
  monthOptionText: { ...baseStyles.monthOptionText, color: '#F9FAFB' },
  inputLabel: { ...baseStyles.inputLabel, color: '#D1D5DB' },
  modalInput: { ...baseStyles.modalInput, backgroundColor: '#111827', borderColor: '#4B5563', color: '#F9FAFB' }
});
