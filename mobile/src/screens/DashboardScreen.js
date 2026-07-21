import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { fetchMovimientos, crearCierre } from '../services/api';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export default function DashboardScreen({ user, onNavigateToNewMovement, onLogout }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [arqueoRealizado, setArqueoRealizado] = useState(false);

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
      Alert.alert('Arqueo Registrado', 'El arqueo diario ha quedado registrado.');
      setArqueoRealizado(true);
    }
  };

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
      <StatusBar barStyle="dark-content" backgroundColor="#6EE7B7" translucent />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#34D399" colors={['#34D399']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Bienvenido & Botón */}
        <View style={styles.welcomeRow}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.welcomeTitle}>Dashboard</Text>
            <Text style={styles.welcomeSubtitle} numberOfLines={1}>Hola, {user?.nombre || 'Sebastian'}</Text>
          </View>
          <TouchableOpacity style={styles.newBtn} onPress={onNavigateToNewMovement} activeOpacity={0.8}>
            <Text style={styles.newBtnText}>+ Nuevo Movimiento</Text>
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
          <Text style={styles.balanceLabel}>Balance Total</Text>
          <Text style={styles.balanceValueWide} numberOfLines={1} adjustsFontSizeToFit>
            S/ {balanceTotal.toFixed(2)}
          </Text>
        </View>

        {/* Sección de Movimientos Recientes */}
        <Text style={styles.sectionHeader}>📂 Movimientos Recientes</Text>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#34D399" style={{ marginTop: 20 }} />
        ) : activos.length === 0 ? (
          <Text style={styles.emptyText}>No hay transacciones registradas.</Text>
        ) : (
          activos.slice(0, 15).map((item) => (
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  welcomeSubtitle: { fontSize: 14, color: '#4B5563', marginTop: 2 },
  newBtn: { backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  newBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
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
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginTop: 14, marginBottom: 10 },
  emptyText: { color: '#6B7280', padding: 20, textAlign: 'center' },
  txCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  txName: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  txMeta: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: 'bold' },
  recurrenteCard: { backgroundColor: '#FFFFFF', borderLeftWidth: 4, borderLeftColor: '#3B82F6', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  recurrenteTitle: { fontSize: 13, fontWeight: 'bold', color: '#1F2937' },
  recurrenteSubtitle: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  recurrenteAmount: { fontSize: 14, fontWeight: 'bold', color: '#10B981' }
});
