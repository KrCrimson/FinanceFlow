import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Modal, TextInput, Alert, Platform, StatusBar } from 'react-native';
import { fetchMovimientos, crearCierre } from '../services/api';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

const MONTH_OPTIONS = [
  { label: 'Julio 2026', month: 6, year: 2026 },
  { label: 'Junio 2026', month: 5, year: 2026 },
  { label: 'Mayo 2026', month: 4, year: 2026 },
  { label: 'Abril 2026', month: 3, year: 2026 },
  { label: 'Todos los Meses', month: -1, year: -1 }
];

export default function DashboardScreen({ user, onNavigateToNewMovement, onLogout }) {
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#6EE7B7" translucent />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#34D399" colors={['#34D399']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con Titulo & Selector de Meses */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeTitle}>🏠 Dashboard</Text>
            <Text style={styles.welcomeSubtitle}>Resumen de tu actividad financiera</Text>
          </View>

          {/* Selector de Mes (Dropdown) */}
          <TouchableOpacity
            style={styles.monthSelectorBtn}
            onPress={() => setShowMonthModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.monthSelectorText}>📅 {selectedMonth.label} ∨</Text>
          </TouchableOpacity>
        </View>

        {/* Alerta Arqueo Diario */}
        {!arqueoRealizado && (
          <View style={styles.arqueoCard}>
            <View style={styles.arqueoHeader}>
              <Text style={styles.arqueoIcon}>📅</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.arqueoTitle}>Arqueo Diario: Ayer (2026-07-20)</Text>
                <Text style={styles.arqueoSummary}>
                  Ingresos: <Text style={{ color: '#059669', fontWeight: 'bold' }}>+$0</Text> | Egresos: <Text style={{ color: '#DC2626', fontWeight: 'bold' }}>-$0</Text>
                </Text>
              </View>
            </View>
            <View style={styles.arqueoActions}>
              <TouchableOpacity
                style={[styles.arqueoBtn, styles.arqueoBtnGreen]}
                onPress={() => handleArqueoAction(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.arqueoBtnText}>Sí, todo cuadra</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.arqueoBtn, styles.arqueoBtnBlue]}
                onPress={() => handleArqueoAction(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.arqueoBtnText}>No, registrar arqueo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Mallas de Balances */}
        <View style={styles.balanceGrid}>
          <View style={[styles.balanceCard, { backgroundColor: '#10B981' }]}>
            <Text style={styles.balanceLabel}>Total Ingresos</Text>
            <Text style={styles.balanceValue} numberOfLines={1} adjustsFontSizeToFit>
              S/ {totalIngresos.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.balanceCard, { backgroundColor: '#EF4444' }]}>
            <Text style={styles.balanceLabel}>Total Egresos</Text>
            <Text style={styles.balanceValue} numberOfLines={1} adjustsFontSizeToFit>
              S/ {totalEgresos.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.balanceCardWide, { backgroundColor: '#3B82F6' }]}>
          <Text style={styles.balanceLabel}>Balance Total ({selectedMonth.label})</Text>
          <Text style={styles.balanceValueWide} numberOfLines={1} adjustsFontSizeToFit>
            S/ {balanceTotal.toFixed(2)}
          </Text>
        </View>

        {/* Sección: Planificador de Compras */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>🛍️ Planificador de Compras</Text>
          <TouchableOpacity style={styles.addGoalBtn} onPress={() => setShowAddCompraModal(true)} activeOpacity={0.8}>
            <Text style={styles.addGoalBtnText}>+ Nueva Meta</Text>
          </TouchableOpacity>
        </View>

        {comprasPlanificadas.map((compra) => {
          const percent = Math.min(100, (compra.montoAhorrado / compra.montoObjetivo) * 100);
          return (
            <View key={compra.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{compra.item}</Text>
                <Text style={styles.goalAmount}>S/ {compra.montoAhorrado} / S/ {compra.montoObjetivo}</Text>
              </View>
              <View style={styles.goalTrack}>
                <View style={[styles.goalFill, { width: `${percent}%` }]} />
              </View>
              <Text style={styles.goalPercent}>{percent.toFixed(0)}% Completado</Text>
            </View>
          );
        })}

        {/* Sección de Movimientos Recientes */}
        <Text style={styles.sectionHeader}>📂 Movimientos Recientes</Text>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#34D399" style={{ marginTop: 20 }} />
        ) : filteredActivos.length === 0 ? (
          <Text style={styles.emptyText}>No hay transacciones registradas para este periodo.</Text>
        ) : (
          filteredActivos.slice(0, 15).map((item) => (
            <View key={item._id} style={styles.txCard}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.txName} numberOfLines={1}>{item.nombre}</Text>
                <Text style={styles.txMeta} numberOfLines={1}>{item.categoria} • {new Date(item.fecha).toLocaleDateString()}</Text>
              </View>
              <Text style={[styles.txAmount, { color: item.tipo === 'ingreso' ? '#10B981' : '#EF4444' }]} numberOfLines={1}>
                {item.tipo === 'ingreso' ? '+' : '-'} S/ {item.monto.toFixed(2)}
              </Text>
            </View>
          ))
        )}

        {/* Sección de Ingresos Constantes */}
        {recurrentes.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>🔄 Ingresos Constantes</Text>
            {recurrentes.map((item) => (
              <View key={item._id} style={styles.recurrenteCard}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.recurrenteTitle} numberOfLines={1}>{item.nombre}</Text>
                  <Text style={styles.recurrenteSubtitle} numberOfLines={1}>{item.categoria}</Text>
                </View>
                <Text style={styles.recurrenteAmount} numberOfLines={1}>+ S/ {item.monto.toFixed(2)}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Modal Selector de Mes */}
      <Modal visible={showMonthModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📅 Seleccionar Mes</Text>
            {MONTH_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={[styles.monthOption, selectedMonth.label === opt.label && styles.monthOptionActive]}
                onPress={() => {
                  setSelectedMonth(opt);
                  setShowMonthModal(false);
                }}
              >
                <Text style={[styles.monthOptionText, selectedMonth.label === opt.label && styles.monthOptionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowMonthModal(false)}>
              <Text style={styles.modalCloseBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Nueva Meta de Compra */}
      <Modal visible={showAddCompraModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🛍️ Nueva Meta de Compra</Text>
            
            <Text style={styles.inputLabel}>Producto o Meta</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ej: Celular Nuevo"
              value={nuevaCompraItem}
              onChangeText={setNuevaCompraItem}
            />

            <Text style={styles.inputLabel}>Monto Objetivo (S/)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="1500.00"
              keyboardType="numeric"
              value={nuevaCompraMonto}
              onChangeText={setNuevaCompraMonto}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddCompraModal(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveGoalBtn} onPress={handleAddCompra}>
                <Text style={styles.saveGoalBtnText}>Añadir Meta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  welcomeTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  welcomeSubtitle: { fontSize: 12, color: '#4B5563', marginTop: 2 },
  monthSelectorBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  monthSelectorText: { fontSize: 12, fontWeight: 'bold', color: '#374151' },
  arqueoCard: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 12, padding: 14, marginBottom: 16 },
  arqueoHeader: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  arqueoIcon: { fontSize: 24 },
  arqueoTitle: { fontSize: 13, fontWeight: 'bold', color: '#1E3A8A' },
  arqueoSummary: { fontSize: 12, color: '#3B82F6', marginTop: 2 },
  arqueoActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  arqueoBtn: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  arqueoBtnGreen: { backgroundColor: '#10B981' },
  arqueoBtnBlue: { backgroundColor: '#3B82F6' },
  arqueoBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  balanceGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  balanceCard: { flex: 1, padding: 14, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  balanceCardWide: { padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  balanceLabel: { color: '#FFFFFF', opacity: 0.9, fontSize: 12, fontWeight: '600' },
  balanceValue: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  balanceValueWide: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 10 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  addGoalBtn: { backgroundColor: '#34D399', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  addGoalBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  goalCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 8 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalTitle: { fontSize: 13, fontWeight: 'bold', color: '#1F2937' },
  goalAmount: { fontSize: 12, color: '#059669', fontWeight: 'bold' },
  goalTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  goalFill: { height: '100%', backgroundColor: '#34D399', borderRadius: 4 },
  goalPercent: { fontSize: 11, color: '#6B7280', alignSelf: 'flex-end', marginTop: 4 },
  emptyText: { color: '#6B7280', padding: 20, textAlign: 'center' },
  txCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  txName: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  txMeta: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: 'bold' },
  recurrenteCard: { backgroundColor: '#FFFFFF', borderLeftWidth: 4, borderLeftColor: '#3B82F6', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  recurrenteTitle: { fontSize: 13, fontWeight: 'bold', color: '#1F2937' },
  recurrenteSubtitle: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  recurrenteAmount: { fontSize: 14, fontWeight: 'bold', color: '#10B981' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', width: '100%', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 14, textAlign: 'center' },
  monthOption: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 },
  monthOptionActive: { backgroundColor: '#34D399', borderColor: '#34D399' },
  monthOptionText: { color: '#374151', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  monthOptionTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  modalCloseBtn: { marginTop: 10, paddingVertical: 10, alignItems: 'center' },
  modalCloseBtnText: { color: '#6B7280', fontWeight: 'bold', fontSize: 14 },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#374151', marginBottom: 4, marginTop: 10 },
  modalInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#1F2937' },
  cancelBtn: { flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: '#374151', fontWeight: 'bold' },
  saveGoalBtn: { flex: 1, backgroundColor: '#34D399', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  saveGoalBtnText: { color: '#FFFFFF', fontWeight: 'bold' }
});
