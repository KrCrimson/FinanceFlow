import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { fetchMovimientos } from '../services/api';

export default function DashboardScreen({ user, onNavigateToNewMovement, onLogout }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchMovimientos();
      // Filtrar y ordenar movimientos (activos primero)
      setMovimientos(data || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar los movimientos.');
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

  // Cálculos de Balance
  const activos = movimientos.filter((m) => m.estado === 'activo');
  const totalIngresos = activos
    .filter((m) => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + m.monto, 0);
  const totalEgresos = activos
    .filter((m) => m.tipo === 'egreso')
    .reduce((sum, m) => sum + m.monto, 0);
  const balanceTotal = totalIngresos - totalEgresos;
  const recurrentes = activos.filter((m) => m.esRecurrente);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarBrand}>💰 Sistema Balance</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#34D399" />}
      >
        {/* Bienvenido */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcomeTitle}>Dashboard</Text>
            <Text style={styles.welcomeSubtitle}>Hola, {user?.nombre || 'Sebastian'}</Text>
          </View>
          <TouchableOpacity style={styles.newBtn} onPress={onNavigateToNewMovement}>
            <Text style={styles.newBtnText}>+ Nuevo Movimiento</Text>
          </TouchableOpacity>
        </View>

        {/* Alerta Arqueo Diario */}
        <View style={styles.arqueoCard}>
          <View style={styles.arqueoHeader}>
            <Text style={styles.arqueoIcon}>📅</Text>
            <View>
              <Text style={styles.arqueoTitle}>Arqueo Diario: Ayer (2026-07-20)</Text>
              <Text style={styles.arqueoSummary}>
                Ingresos de ayer: <Text style={{ color: '#059669', fontWeight: 'bold' }}>+$0</Text> | Egresos: <Text style={{ color: '#DC2626', fontWeight: 'bold' }}>-$0</Text>
              </Text>
            </View>
          </View>
          <View style={styles.arqueoActions}>
            <TouchableOpacity style={[styles.arqueoBtn, styles.arqueoBtnGreen]}>
              <Text style={styles.arqueoBtnText}>Sí, todo cuadra</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.arqueoBtn, styles.arqueoBtnBlue]}>
              <Text style={styles.arqueoBtnText}>No, registrar arqueo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mallas de Balances */}
        <View style={styles.balanceGrid}>
          <View style={[styles.balanceCard, { backgroundColor: '#10B981' }]}>
            <Text style={styles.balanceLabel}>Total Ingresos</Text>
            <Text style={styles.balanceValue}>S/ {totalIngresos.toFixed(2)}</Text>
          </View>
          <View style={[styles.balanceCard, { backgroundColor: '#EF4444' }]}>
            <Text style={styles.balanceLabel}>Total Egresos</Text>
            <Text style={styles.balanceValue}>S/ {totalEgresos.toFixed(2)}</Text>
          </View>
        </View>

        <View style={[styles.balanceCardWide, { backgroundColor: '#3B82F6' }]}>
          <Text style={styles.balanceLabel}>Balance Total</Text>
          <Text style={styles.balanceValueWide}>S/ {balanceTotal.toFixed(2)}</Text>
        </View>

        {/* Sección de Movimientos Recientes */}
        <Text style={styles.sectionHeader}>📂 Movimientos Recientes</Text>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#34D399" style={{ marginTop: 20 }} />
        ) : activos.length === 0 ? (
          <Text style={styles.emptyText}>No hay transacciones registradas.</Text>
        ) : (
          activos.slice(0, 10).map((item) => (
            <View key={item._id} style={styles.txCard}>
              <View>
                <Text style={styles.txName}>{item.nombre}</Text>
                <Text style={styles.txMeta}>{item.categoria} • {new Date(item.fecha).toLocaleDateString()}</Text>
              </View>
              <Text style={[styles.txAmount, { color: item.tipo === 'ingreso' ? '#10B981' : '#EF4444' }]}>
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
                <View>
                  <Text style={styles.recurrenteTitle}>{item.nombre}</Text>
                  <Text style={styles.recurrenteSubtitle}>{item.categoria}</Text>
                </View>
                <Text style={styles.recurrenteAmount}>+ S/ {item.monto.toFixed(2)}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  navbar: {
    backgroundColor: '#6EE7B7',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#A7F3D0'
  },
  navbarBrand: { color: '#065F46', fontSize: 20, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#FBBF24', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutBtnText: { color: '#065F46', fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  welcomeSubtitle: { fontSize: 16, color: '#4B5563', marginTop: 2 },
  newBtn: { backgroundColor: '#10B981', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  newBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  arqueoCard: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 12, padding: 14, marginBottom: 20 },
  arqueoHeader: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  arqueoIcon: { fontSize: 24 },
  arqueoTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E3A8A' },
  arqueoSummary: { fontSize: 12, color: '#3B82F6', marginTop: 2 },
  arqueoActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  arqueoBtn: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  arqueoBtnGreen: { backgroundColor: '#10B981' },
  arqueoBtnBlue: { backgroundColor: '#3B82F6' },
  arqueoBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  balanceGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  balanceCard: { flex: 1, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  balanceCardWide: { padding: 16, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  balanceLabel: { color: '#FFFFFF', opacity: 0.8, fontSize: 13, fontWeight: '600' },
  balanceValue: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginTop: 6 },
  balanceValueWide: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginTop: 6 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginTop: 16, marginBottom: 12 },
  emptyText: { color: '#6B7280', padding: 20, textAlign: 'center' },
  txCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', padding: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  txName: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  txMeta: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
  recurrenteCard: { backgroundColor: '#FFFFFF', borderLeftWidth: 4, borderLeftColor: '#3B82F6', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  recurrenteTitle: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  recurrenteSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  recurrenteAmount: { fontSize: 15, fontWeight: 'bold', color: '#10B981' }
});
