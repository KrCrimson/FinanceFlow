import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Modal, TextInput, Alert, Platform, StatusBar } from 'react-native';
import { fetchMovimientos, createMovimiento, crearCierre } from '../services/api';

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
  const [arqueoRealizado, setArqueoRealizado] = useState(false);

  // Filtro por Meses
  const [selectedMonth, setSelectedMonth] = useState(MONTH_OPTIONS[0]);
  const [showMonthModal, setShowMonthModal] = useState(false);

  // Planificador de Compras
  const [comprasPlanificadas, setComprasPlanificadas] = useState([
    { id: '1', item: 'Laptop Nueva', montoObjetivo: 3500, montoAhorrado: 2100 },
    { id: '2', item: 'Curso de Especialización', montoObjetivo: 800, montoAhorrado: 800 }
  ]);
  const [showAddCompraModal, setShowAddCompraModal] = useState(false);
  const [nuevaCompraItem, setNuevaCompraItem] = useState('');
  const [nuevaCompraMonto, setNuevaCompraMonto] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchMovimientos();
      setMovimientos(data || []);
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

  const handleArqueoAction = async (coincidio) => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      await crearCierre({
        fecha: yesterday.toISOString(),
        tipo: 'diario',
        coincidio
      });

      setArqueoRealizado(true);
      Alert.alert(
        'Arqueo Registrado',
        coincidio ? '¡Excelente! El arqueo diario fue registrado como conforme.' : 'El arqueo fue registrado con observaciones.'
      );
    } catch (err) {
      setArqueoRealizado(true);
    }
  };

  const handleAddCompra = () => {
    const amount = parseFloat(nuevaCompraMonto);
    if (!nuevaCompraItem.trim() || isNaN(amount) || amount <= 0) {
      Alert.alert('Datos Inválidos', 'Ingresa una meta y un monto válido.');
      return;
    }

    setComprasPlanificadas([
      ...comprasPlanificadas,
      { id: Date.now().toString(), item: nuevaCompraItem.trim(), montoObjetivo: amount, montoAhorrado: 0 }
    ]);
    setNuevaCompraItem('');
    setNuevaCompraMonto('');
    setShowAddCompraModal(false);
    Alert.alert('¡Meta Agregada!', 'Tu meta de compra ha sido añadida al planificador.');
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
              await createMovimiento({
                nombre: compra.item,
                tipo: 'egreso',
                monto: compra.montoObjetivo,
                categoria: 'Otros',
                descripcion: 'Compra finalizada desde el Planificador de Compras',
                fecha: new Date().toISOString()
              });

              setComprasPlanificadas((prev) => prev.filter((c) => c.id !== compra.id));
              await loadData();
              Alert.alert('🎉 ¡Felicidades!', `Se registró el egreso de S/ ${compra.montoObjetivo} en tus movimientos.`);
            } catch (err) {
              Alert.alert('Error', 'No se pudo guardar el egreso de la compra.');
            }
          }
        }
      ]
    );
  };

  // Botón "Cancelar Planificación" -> Elimina la meta sin registrar egreso
  const handleCancelarCompra = (id, nombre) => {
    Alert.alert(
      '❌ Cancelar Planificación',
      `¿Estás seguro de cancelar la meta "${nombre}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: () => {
            setComprasPlanificadas((prev) => prev.filter((c) => c.id !== id));
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

          {/* Selector de Mes (Dropdown) */}
          <TouchableOpacity
            style={theme.monthSelectorBtn}
            onPress={() => setShowMonthModal(true)}
            activeOpacity={0.8}
          >
            <Text style={theme.monthSelectorText}>📅 {selectedMonth.label} ∨</Text>
          </TouchableOpacity>
        </View>

        {/* Alerta Arqueo Diario */}
        {!arqueoRealizado && (
          <View style={theme.arqueoCard}>
            <View style={theme.arqueoHeader}>
              <Text style={theme.arqueoIcon}>📅</Text>
              <View style={{ flex: 1 }}>
                <Text style={theme.arqueoTitle}>Arqueo Diario: Ayer (2026-07-20)</Text>
                <Text style={theme.arqueoSummary}>
                  Ingresos: <Text style={{ color: '#059669', fontWeight: 'bold' }}>+$0</Text> | Egresos: <Text style={{ color: '#DC2626', fontWeight: 'bold' }}>-$0</Text>
                </Text>
              </View>
            </View>
            <View style={theme.arqueoActions}>
              <TouchableOpacity
                style={[theme.arqueoBtn, theme.arqueoBtnGreen]}
                onPress={() => handleArqueoAction(true)}
                activeOpacity={0.8}
              >
                <Text style={theme.arqueoBtnText}>Sí, todo cuadra</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[theme.arqueoBtn, theme.arqueoBtnBlue]}
                onPress={() => handleArqueoAction(false)}
                activeOpacity={0.8}
              >
                <Text style={theme.arqueoBtnText}>No, registrar arqueo</Text>
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

        {/* Sección: Planificador de Compras */}
        <View style={theme.sectionHeaderRow}>
          <Text style={theme.sectionHeader}>🛍️ Planificador de Compras</Text>
          <TouchableOpacity style={theme.addGoalBtn} onPress={() => setShowAddCompraModal(true)} activeOpacity={0.8}>
            <Text style={theme.addGoalBtnText}>+ Nueva Meta</Text>
          </TouchableOpacity>
        </View>

        {comprasPlanificadas.length === 0 ? (
          <Text style={theme.emptyText}>No tienes compras planificadas en este momento.</Text>
        ) : (
          comprasPlanificadas.map((compra) => {
            const percent = Math.min(100, (compra.montoAhorrado / compra.montoObjetivo) * 100);
            return (
              <View key={compra.id} style={theme.goalCard}>
                <View style={theme.goalHeader}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={theme.goalTitle}>{compra.item}</Text>
                    <Text style={theme.goalAmount}>S/ {compra.montoAhorrado} / S/ {compra.montoObjetivo}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {/* Botón Comprado */}
                    <TouchableOpacity
                      style={theme.compradoBtn}
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
                  <View style={[theme.goalFill, { width: `${percent}%` }]} />
                </View>
                <Text style={theme.goalPercent}>{percent.toFixed(0)}% Completado</Text>
              </View>
            );
          })
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
    </SafeAreaView>
  );
}

const baseStyles = {
  scrollContent: { padding: 16, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
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
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 10 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold' },
  addGoalBtn: { backgroundColor: '#34D399', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  addGoalBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  goalCard: { borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
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
  txCard: { borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1 },
  txName: { fontSize: 14, fontWeight: 'bold' },
  txMeta: { fontSize: 11, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: 'bold' },
  recurrenteCard: { borderLeftWidth: 4, borderLeftColor: '#3B82F6', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1 },
  recurrenteTitle: { fontSize: 13, fontWeight: 'bold' },
  recurrenteSubtitle: { fontSize: 11, marginTop: 2 },
  recurrenteAmount: { fontSize: 14, fontWeight: 'bold', color: '#10B981' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
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
