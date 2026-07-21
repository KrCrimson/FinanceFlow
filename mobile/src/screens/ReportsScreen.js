import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, TextInput, Platform, StatusBar } from 'react-native';
import { fetchMovimientos } from '../services/api';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export default function ReportsScreen({ user }) {
  const [activeTab, setActiveTab] = useState('resumen'); // 'resumen' | 'graficos' | 'movimientos'
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const activos = movimientos.filter((m) => m.estado === 'activo');
  const ingresos = activos.filter((m) => m.tipo === 'ingreso');
  const egresos = activos.filter((m) => m.tipo === 'egreso');

  const totalIngresos = ingresos.reduce((sum, m) => sum + m.monto, 0);
  const totalEgresos = egresos.reduce((sum, m) => sum + m.monto, 0);
  const balanceNeto = totalIngresos - totalEgresos;

  // Agrupar gastos por categoría
  const categoryTotals = {};
  egresos.forEach((m) => {
    categoryTotals[m.categoria] = (categoryTotals[m.categoria] || 0) + m.monto;
  });

  const categoriesList = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    amount: categoryTotals[cat],
    percentage: totalEgresos > 0 ? (categoryTotals[cat] / totalEgresos) * 100 : 0
  })).sort((a, b) => b.amount - a.amount);

  // Filtrar movimientos por búsqueda
  const filteredMovimientos = activos.filter((m) =>
    m.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#6EE7B7" translucent />
      
      {/* Sub-tabs idénticas a la Web */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'resumen' && styles.tabBtnActive]}
          onPress={() => setActiveTab('resumen')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabBtnText, activeTab === 'resumen' && styles.tabBtnTextActive]}>
            📈 Resumen General
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'graficos' && styles.tabBtnActive]}
          onPress={() => setActiveTab('graficos')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabBtnText, activeTab === 'graficos' && styles.tabBtnTextActive]}>
            📊 Gráficos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'movimientos' && styles.tabBtnActive]}
          onPress={() => setActiveTab('movimientos')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabBtnText, activeTab === 'movimientos' && styles.tabBtnTextActive]}>
            💰 Movimientos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor="#34D399" />}
        showsVerticalScrollIndicator={false}
      >
        {/* Pestaña 1: Resumen General */}
        {activeTab === 'resumen' && (
          <View>
            <Text style={styles.title}>📈 Resumen General</Text>
            <Text style={styles.subtitle}>Visión general de tus métricas financieras</Text>

            <View style={styles.summaryGrid}>
              <View style={[styles.summaryBox, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                <Text style={styles.summaryLabel}>Total Ingresos</Text>
                <Text style={[styles.summaryValue, { color: '#059669' }]}>+ S/ {totalIngresos.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryBox, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                <Text style={styles.summaryLabel}>Total Egresos</Text>
                <Text style={[styles.summaryValue, { color: '#DC2626' }]}>- S/ {totalEgresos.toFixed(2)}</Text>
              </View>
            </View>

            <View style={[styles.summaryBoxWide, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <Text style={styles.summaryLabel}>Balance Neto</Text>
              <Text style={[styles.summaryValueWide, { color: '#1D4ED8' }]}>S/ {balanceNeto.toFixed(2)}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeader}>📊 Distribución por Categoría</Text>
              {loading && !refreshing ? (
                <ActivityIndicator size="small" color="#34D399" style={{ marginVertical: 20 }} />
              ) : categoriesList.length === 0 ? (
                <Text style={styles.emptyText}>No hay gastos registrados.</Text>
              ) : (
                categoriesList.map((item) => (
                  <View key={item.name} style={styles.categoryRow}>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{item.name}</Text>
                      <Text style={styles.categoryPercent}>{item.percentage.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.barBackground}>
                      <View style={[styles.barFill, { width: `${Math.min(100, item.percentage)}%` }]} />
                    </View>
                    <Text style={styles.categoryAmount}>S/ {item.amount.toFixed(2)}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* Pestaña 2: Gráficos */}
        {activeTab === 'graficos' && (
          <View>
            <Text style={styles.title}>📊 Gráficos de Balance</Text>
            <Text style={styles.subtitle}>Comparativa visual entre Ingresos y Egresos</Text>

            <View style={styles.card}>
              <Text style={styles.cardHeader}>⚖️ Ratio Ingresos vs. Egresos</Text>
              <View style={styles.chartContainer}>
                <View style={styles.chartBarGroup}>
                  <Text style={styles.chartBarLabel}>Ingresos</Text>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFillGreen, { width: totalIngresos > 0 ? '100%' : '0%' }]} />
                  </View>
                  <Text style={styles.chartBarValue}>S/ {totalIngresos.toFixed(2)}</Text>
                </View>

                <View style={styles.chartBarGroup}>
                  <Text style={styles.chartBarLabel}>Egresos</Text>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFillRed, { width: totalIngresos > 0 ? `${Math.min(100, (totalEgresos / totalIngresos) * 100)}%` : '0%' }]} />
                  </View>
                  <Text style={styles.chartBarValue}>S/ {totalEgresos.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeader}>💡 Diagnóstico Financiero</Text>
              <Text style={styles.diagText}>
                {balanceNeto >= 0
                  ? '✅ Tus ingresos superan a tus egresos. Mantienes una salud financiera positiva este periodo.'
                  : '⚠️ Tus egresos superan a tus ingresos. Se sugiere revisar tus gastos recurrentes.'}
              </Text>
            </View>
          </View>
        )}

        {/* Pestaña 3: Movimientos */}
        {activeTab === 'movimientos' && (
          <View>
            <Text style={styles.title}>💰 Historial de Movimientos</Text>
            <Text style={styles.subtitle}>Listado completo con filtro de búsqueda</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="🔍 Buscar por nombre o categoría..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {loading && !refreshing ? (
              <ActivityIndicator size="large" color="#34D399" style={{ marginTop: 20 }} />
            ) : filteredMovimientos.length === 0 ? (
              <Text style={styles.emptyText}>No se encontraron movimientos.</Text>
            ) : (
              filteredMovimientos.map((item) => (
                <View key={item._id} style={styles.txCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.txName}>{item.nombre}</Text>
                    <Text style={styles.txMeta}>{item.categoria} • {new Date(item.fecha).toLocaleDateString()}</Text>
                  </View>
                  <Text style={[styles.txAmount, { color: item.tipo === 'ingreso' ? '#10B981' : '#EF4444' }]}>
                    {item.tipo === 'ingreso' ? '+' : '-'} S/ {item.monto.toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  tabHeader: { flexDirection: 'row', backgroundColor: '#6EE7B7', paddingHorizontal: 8, paddingBottom: 8 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, marginHorizontal: 2 },
  tabBtnActive: { backgroundColor: '#059669' },
  tabBtnText: { color: '#065F46', fontSize: 11, fontWeight: 'bold' },
  tabBtnTextActive: { color: '#FFFFFF' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginTop: 8 },
  subtitle: { fontSize: 12, color: '#6B7280', marginTop: 2, marginBottom: 16 },
  summaryGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  summaryBox: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1 },
  summaryBoxWide: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  summaryLabel: { fontSize: 12, color: '#4B5563', fontWeight: '600' },
  summaryValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  summaryValueWide: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
  cardHeader: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  emptyText: { color: '#6B7280', textAlign: 'center', marginVertical: 14 },
  categoryRow: { marginBottom: 12 },
  categoryInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  categoryName: { fontSize: 13, fontWeight: 'bold', color: '#1F2937' },
  categoryPercent: { fontSize: 12, color: '#059669', fontWeight: 'bold' },
  barBackground: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#34D399', borderRadius: 4 },
  categoryAmount: { fontSize: 12, color: '#4B5563', alignSelf: 'flex-end', marginTop: 2 },
  chartContainer: { gap: 14, marginVertical: 8 },
  chartBarGroup: { gap: 4 },
  chartBarLabel: { fontSize: 13, fontWeight: 'bold', color: '#374151' },
  chartBarTrack: { height: 16, backgroundColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden' },
  chartBarFillGreen: { height: '100%', backgroundColor: '#10B981', borderRadius: 8 },
  chartBarFillRed: { height: '100%', backgroundColor: '#EF4444', borderRadius: 8 },
  chartBarValue: { fontSize: 13, fontWeight: 'bold', color: '#1F2937', alignSelf: 'flex-end' },
  diagText: { fontSize: 13, color: '#374151', lineHeight: 20 },
  searchInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, marginBottom: 14, color: '#1F2937' },
  txCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  txName: { fontSize: 13, fontWeight: 'bold', color: '#1F2937' },
  txMeta: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: 'bold' }
});
