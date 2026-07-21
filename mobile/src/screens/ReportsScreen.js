import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, Platform, StatusBar } from 'react-native';
import { fetchMovimientos } from '../services/api';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export default function ReportsScreen({ user }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Agrupar gastos por categoría
  const egresos = activos.filter((m) => m.tipo === 'egreso');
  const totalEgresos = egresos.reduce((sum, m) => sum + m.monto, 0);

  const categoryTotals = {};
  egresos.forEach((m) => {
    categoryTotals[m.categoria] = (categoryTotals[m.categoria] || 0) + m.monto;
  });

  const categoriesList = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    amount: categoryTotals[cat],
    percentage: totalEgresos > 0 ? (categoryTotals[cat] / totalEgresos) * 100 : 0
  })).sort((a, b) => b.amount - a.amount);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#6EE7B7" translucent />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor="#34D399" />}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>📊 Reportes y Análisis</Text>
        <Text style={styles.subtitle}>Resumen completo de tu actividad financiera</Text>

        {/* Resumen Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>📊 Análisis Visual de Finanzas</Text>
          <Text style={styles.cardSub}>Visualiza tus patrones de gastos por categoría para tomar mejores decisiones.</Text>
          
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Gastado en Egresos</Text>
            <Text style={styles.totalAmount}>S/ {totalEgresos.toFixed(2)}</Text>
          </View>

          <Text style={styles.sectionTitle}>Distribución por Categorías</Text>

          {loading && !refreshing ? (
            <ActivityIndicator size="small" color="#34D399" style={{ marginVertical: 20 }} />
          ) : categoriesList.length === 0 ? (
            <Text style={styles.emptyText}>No hay egresos registrados para analizar.</Text>
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

        {/* Lista completa de movimientos */}
        <Text style={styles.titleSecondary}>📜 Todos los Movimientos</Text>
        {activos.map((item) => (
          <View key={item._id} style={styles.txCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.txName}>{item.nombre}</Text>
              <Text style={styles.txMeta}>{item.categoria} • {new Date(item.fecha).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.txAmount, { color: item.tipo === 'ingreso' ? '#10B981' : '#EF4444' }]}>
              {item.tipo === 'ingreso' ? '+' : '-'} S/ {item.monto.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginTop: 8 },
  subtitle: { fontSize: 13, color: '#4B5563', marginTop: 2, marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
  cardHeader: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  cardSub: { fontSize: 12, color: '#6B7280', marginBottom: 14 },
  totalBox: { backgroundColor: '#EFF6FF', borderRadius: 10, padding: 12, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#BFDBFE' },
  totalLabel: { fontSize: 12, color: '#3B82F6', fontWeight: '600' },
  totalAmount: { fontSize: 22, fontWeight: 'bold', color: '#1E3A8A', marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 12 },
  emptyText: { color: '#6B7280', textAlign: 'center', marginVertical: 10 },
  categoryRow: { marginBottom: 12 },
  categoryInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  categoryName: { fontSize: 13, fontWeight: 'bold', color: '#1F2937' },
  categoryPercent: { fontSize: 12, color: '#059669', fontWeight: 'bold' },
  barBackground: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#34D399', borderRadius: 4 },
  categoryAmount: { fontSize: 12, color: '#4B5563', alignSelf: 'flex-end', marginTop: 2 },
  titleSecondary: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  txCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  txName: { fontSize: 13, fontWeight: 'bold', color: '#1F2937' },
  txMeta: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: 'bold' }
});
