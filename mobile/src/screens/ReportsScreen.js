import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Modal, TextInput, Platform, StatusBar } from 'react-native';
import { fetchMovimientos } from '../services/api';

const MONTH_FILTERS = [
  'Todos los meses',
  'Julio 2026',
  'Junio 2026',
  'Mayo 2026',
  'Abril 2026'
];

const CATEGORY_COLORS = [
  '#3B82F6', // Azul
  '#10B981', // Verde Esmeralda
  '#8B5CF6', // Púrpura
  '#EF4444', // Rojo
  '#F59E0B', // Ámbar / Dorado
  '#06B6D4', // Cían
  '#EC4899', // Rosa
  '#84CC16'  // Lima
];

export default function ReportsScreen({ isDarkMode }) {
  const [activeTab, setActiveTab] = useState('resumen'); // 'resumen' | 'graficos' | 'movimientos'
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filtros de la pestaña Movimientos
  const [selectedMonth, setSelectedMonth] = useState('Todos los meses');
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorías');
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

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

  const theme = isDarkMode ? darkStyles : lightStyles;

  const activos = movimientos.filter((m) => m.estado === 'activo');
  const ingresos = activos.filter((m) => m.tipo === 'ingreso');
  const egresos = activos.filter((m) => m.tipo === 'egreso');

  const totalIngresos = ingresos.reduce((sum, m) => sum + m.monto, 0);
  const totalEgresos = egresos.reduce((sum, m) => sum + m.monto, 0);
  const balanceNeto = totalIngresos - totalEgresos;

  // Agrupar movimientos por categoría con conteo y monto total
  const categoryStats = {};
  activos.forEach((m) => {
    if (!categoryStats[m.categoria]) {
      categoryStats[m.categoria] = { count: 0, amount: 0, tipo: m.tipo };
    }
    categoryStats[m.categoria].count += 1;
    categoryStats[m.categoria].amount += m.monto;
  });

  const categoriesList = Object.keys(categoryStats).map((cat) => ({
    name: cat,
    count: categoryStats[cat].count,
    amount: categoryStats[cat].amount,
    tipo: categoryStats[cat].tipo
  })).sort((a, b) => b.amount - a.amount);

  const egresosCategories = categoriesList.filter((c) => c.tipo === 'egreso');
  const ingresosCategories = categoriesList.filter((c) => c.tipo === 'ingreso');

  const allCategories = ['Todas las categorías', ...Array.from(new Set(activos.map((m) => m.categoria)))];

  // Aplicar filtros en pestaña Movimientos
  const filteredMovimientos = activos.filter((m) => {
    const matchCategory = selectedCategory === 'Todas las categorías' || m.categoria === selectedCategory;
    return matchCategory;
  });

  const clearFilters = () => {
    setSelectedMonth('Todos los meses');
    setSelectedCategory('Todas las categorías');
  };

  // Datos simulados de tendencia de 6 meses
  const trendMonths = [
    { label: 'Feb 26', egreso: 0, ingreso: 0 },
    { label: 'Mar 26', egreso: 0, ingreso: 0 },
    { label: 'Abr 26', egreso: 120, ingreso: 0 },
    { label: 'May 26', egreso: 1800, ingreso: 3000 },
    { label: 'Jun 26', egreso: 950, ingreso: 3000 },
    { label: 'Jul 26', egreso: 107.5, ingreso: 1560 }
  ];

  return (
    <SafeAreaView style={theme.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#064E3B' : '#6EE7B7'} translucent />
      
      {/* Sub-tabs exactas de la Web */}
      <View style={theme.tabHeader}>
        <TouchableOpacity
          style={[theme.tabBtn, activeTab === 'resumen' && theme.tabBtnActive]}
          onPress={() => setActiveTab('resumen')}
          activeOpacity={0.8}
        >
          <Text style={[theme.tabBtnText, activeTab === 'resumen' && theme.tabBtnTextActive]}>
            📈 Resumen General
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[theme.tabBtn, activeTab === 'graficos' && theme.tabBtnActive]}
          onPress={() => setActiveTab('graficos')}
          activeOpacity={0.8}
        >
          <Text style={[theme.tabBtnText, activeTab === 'graficos' && theme.tabBtnTextActive]}>
            📊 Gráficos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[theme.tabBtn, activeTab === 'movimientos' && theme.tabBtnActive]}
          onPress={() => setActiveTab('movimientos')}
          activeOpacity={0.8}
        >
          <Text style={[theme.tabBtnText, activeTab === 'movimientos' && theme.tabBtnTextActive]}>
            💰 Movimientos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={theme.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor="#34D399" />}
        showsVerticalScrollIndicator={false}
      >
        {/* PESTAÑA 1: RESUMEN GENERAL (Idéntica a la Captura 1) */}
        {activeTab === 'resumen' && (
          <View>
            {/* 3 Tarjetas Superiores */}
            <View style={theme.topCardsGrid}>
              <View style={[theme.topCard, { backgroundColor: isDarkMode ? '#064E3B' : '#ECFDF5', borderColor: '#059669' }]}>
                <View style={theme.topCardRow}>
                  <Text style={[theme.topCardLabel, { color: '#10B981' }]}>Total Ingresos</Text>
                  <Text style={theme.topCardIcon}>📈</Text>
                </View>
                <Text style={[theme.topCardValue, { color: '#10B981' }]} numberOfLines={1}>
                  S/ {totalIngresos.toFixed(2)}
                </Text>
              </View>

              <View style={[theme.topCard, { backgroundColor: isDarkMode ? '#451A1A' : '#FEF2F2', borderColor: '#EF4444' }]}>
                <View style={theme.topCardRow}>
                  <Text style={[theme.topCardLabel, { color: '#EF4444' }]}>Total Egresos</Text>
                  <Text style={theme.topCardIcon}>📉</Text>
                </View>
                <Text style={[theme.topCardValue, { color: '#EF4444' }]} numberOfLines={1}>
                  S/ {totalEgresos.toFixed(2)}
                </Text>
              </View>

              <View style={[theme.topCard, { backgroundColor: isDarkMode ? '#1E293B' : '#EFF6FF', borderColor: '#3B82F6' }]}>
                <View style={theme.topCardRow}>
                  <Text style={[theme.topCardLabel, { color: '#60A5FA' }]}>Balance</Text>
                  <Text style={theme.topCardIcon}>💰</Text>
                </View>
                <Text style={[theme.topCardValue, { color: '#60A5FA' }]} numberOfLines={1}>
                  S/ {balanceNeto.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Sección: Movimientos por Categoría */}
            <View style={theme.card}>
              <Text style={theme.cardTitle}>📊 Movimientos por Categoría</Text>
              
              {loading && !refreshing ? (
                <ActivityIndicator size="small" color="#34D399" style={{ marginVertical: 20 }} />
              ) : categoriesList.length === 0 ? (
                <Text style={theme.emptyText}>No hay datos por categoría.</Text>
              ) : (
                <View style={theme.catGrid}>
                  {categoriesList.map((cat) => (
                    <View key={cat.name} style={theme.catCard}>
                      <View style={theme.catCardHeader}>
                        <Text style={theme.catCardName} numberOfLines={1}>{cat.name}</Text>
                        <Text style={theme.catCardCount}>({cat.count})</Text>
                      </View>
                      <Text style={theme.catCardAmount}>S/ {cat.amount.toFixed(2)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* PESTAÑA 2: GRÁFICOS (Vibrante y Completa) */}
        {activeTab === 'graficos' && (
          <View>
            {/* Header del Análisis */}
            <View style={theme.card}>
              <Text style={theme.cardTitle}>📊 Análisis Visual de Finanzas</Text>
              <Text style={theme.cardSub}>Visualiza tus patrones de gastos e ingresos con gráficos interactivos para tomar mejores decisiones financieras.</Text>
            </View>

            {/* Distribución de Gastos por Categoría (Multi-color Multi-Segment Bar) */}
            <View style={theme.card}>
              <Text style={theme.cardTitle}>💸 Distribución de Gastos por Categoría</Text>
              <Text style={theme.cardSub}>Monto Total Egresos: S/ {totalEgresos.toFixed(2)}</Text>
              
              {/* Barra segmentada multi-color */}
              <View style={theme.multiSegmentTrack}>
                {egresosCategories.map((cat, idx) => {
                  const percent = totalEgresos > 0 ? (cat.amount / totalEgresos) * 100 : 0;
                  const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                  return (
                    <View
                      key={cat.name}
                      style={[theme.multiSegmentFill, { width: `${percent}%`, backgroundColor: color }]}
                    />
                  );
                })}
              </View>

              {/* Leyenda con Puntos de Colores */}
              <View style={theme.legendGrid}>
                {egresosCategories.map((cat, idx) => {
                  const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                  const percent = totalEgresos > 0 ? ((cat.amount / totalEgresos) * 100).toFixed(1) : '0';
                  return (
                    <View key={cat.name} style={theme.legendBadge}>
                      <View style={[theme.legendDot, { backgroundColor: color }]} />
                      <Text style={theme.legendText}>{cat.name} ({percent}%)</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Ingresos por Categoría (Barras Multicolor por Categoría) */}
            <View style={theme.card}>
              <Text style={theme.cardTitle}>💰 Ingresos por Categoría</Text>
              <View style={theme.barChartContainer}>
                {ingresosCategories.length === 0 ? (
                  <Text style={theme.emptyText}>No hay ingresos registrados.</Text>
                ) : (
                  ingresosCategories.map((cat, idx) => {
                    const color = CATEGORY_COLORS[(idx + 1) % CATEGORY_COLORS.length];
                    const maxIngreso = Math.max(...ingresosCategories.map((c) => c.amount), 1);
                    const barHeightPercent = Math.min(100, Math.max(15, (cat.amount / maxIngreso) * 100));

                    return (
                      <View key={cat.name} style={theme.barGroup}>
                        <Text style={theme.barLabel}>S/ {cat.amount.toFixed(0)}</Text>
                        <View style={theme.barTrack}>
                          <View style={[theme.barFillColor, { height: `${barHeightPercent}%`, backgroundColor: color }]} />
                        </View>
                        <Text style={theme.barCatName} numberOfLines={1}>{cat.name}</Text>
                      </View>
                    );
                  })
                )}
              </View>
            </View>

            {/* Tendencia de Gastos (6 meses) - Gráfico de Barras Mensuales */}
            <View style={theme.card}>
              <Text style={theme.cardTitle}>📉 Tendencia de Gastos (6 meses)</Text>
              <View style={theme.monthChartContainer}>
                {trendMonths.map((m) => {
                  const barPercent = Math.min(100, Math.max(10, (m.egreso / 1800) * 100));
                  return (
                    <View key={m.label} style={theme.monthBarGroup}>
                      <Text style={theme.monthBarVal}>S/ {m.egreso}</Text>
                      <View style={theme.monthBarTrack}>
                        <View style={[theme.monthBarFillRed, { height: `${barPercent}%` }]} />
                      </View>
                      <Text style={theme.monthBarLabel}>{m.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Tendencia de Ingresos (6 meses) - Gráfico de Barras Mensuales */}
            <View style={theme.card}>
              <Text style={theme.cardTitle}>📈 Tendencia de Ingresos (6 meses)</Text>
              <View style={theme.monthChartContainer}>
                {trendMonths.map((m) => {
                  const barPercent = Math.min(100, Math.max(10, (m.ingreso / 3000) * 100));
                  return (
                    <View key={m.label} style={theme.monthBarGroup}>
                      <Text style={theme.monthBarVal}>S/ {m.ingreso}</Text>
                      <View style={theme.monthBarTrack}>
                        <View style={[theme.monthBarFillGreen, { height: `${barPercent}%` }]} />
                      </View>
                      <Text style={theme.monthBarLabel}>{m.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Resumen Estadístico (Idéntico a Captura 5) */}
            <View style={theme.card}>
              <Text style={theme.cardTitle}>📋 Resumen Estadístico</Text>
              <View style={theme.statsRowGrid}>
                <View style={theme.statMetricCard}>
                  <Text style={theme.statMetricLabel}>💸 Gasto Promedio Mensual</Text>
                  <Text style={[theme.statMetricValue, { color: '#EF4444' }]}>S/ {(totalEgresos / 6).toFixed(2)}</Text>
                </View>
                <View style={theme.statMetricCard}>
                  <Text style={theme.statMetricLabel}>💰 Ingreso Promedio Mensual</Text>
                  <Text style={[theme.statMetricValue, { color: '#10B981' }]}>S/ {(totalIngresos / 6).toFixed(2)}</Text>
                </View>
                <View style={theme.statMetricCard}>
                  <Text style={theme.statMetricLabel}>⚖️ Balance Promedio</Text>
                  <Text style={[theme.statMetricValue, { color: '#3B82F6' }]}>S/ {(balanceNeto / 6).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* PESTAÑA 3: MOVIMIENTOS (Idéntica a la Captura 2) */}
        {activeTab === 'movimientos' && (
          <View>
            {/* Filtros de Mes y Categoría */}
            <View style={theme.filterCard}>
              <View style={theme.filterRow}>
                <View style={{ flex: 1 }}>
                  <Text style={theme.filterLabel}>Filtrar por mes</Text>
                  <TouchableOpacity style={theme.filterDropdownBtn} onPress={() => setShowMonthModal(true)}>
                    <Text style={theme.filterDropdownText} numberOfLines={1}>{selectedMonth} ∨</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={theme.filterLabel}>Filtrar por categoría</Text>
                  <TouchableOpacity style={theme.filterDropdownBtn} onPress={() => setShowCategoryModal(true)}>
                    <Text style={theme.filterDropdownText} numberOfLines={1}>{selectedCategory} ∨</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={theme.clearFilterBtn} onPress={clearFilters} activeOpacity={0.8}>
                <Text style={theme.clearFilterBtnText}>Limpiar Filtros</Text>
              </TouchableOpacity>
            </View>

            {/* Tabla / Lista de Movimientos */}
            <View style={theme.card}>
              <View style={theme.tableHeaderRow}>
                <Text style={[theme.tableColHeader, { flex: 1 }]}>Tipo / Nombre</Text>
                <Text style={[theme.tableColHeader, { flex: 0.8, textAlign: 'center' }]}>Categoría</Text>
                <Text style={[theme.tableColHeader, { flex: 0.8, textAlign: 'right' }]}>Monto</Text>
              </View>

              {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#34D399" style={{ marginTop: 20 }} />
              ) : filteredMovimientos.length === 0 ? (
                <Text style={theme.emptyText}>No hay movimientos que coincidan.</Text>
              ) : (
                filteredMovimientos.map((item) => (
                  <View key={item._id} style={theme.tableRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <View style={[theme.badgeType, item.tipo === 'ingreso' ? theme.badgeIncome : theme.badgeExpense]}>
                          <Text style={theme.badgeTypeText}>{item.tipo === 'ingreso' ? '💰 ingreso' : '💸 egreso'}</Text>
                        </View>
                        <View style={theme.badgeActive}>
                          <Text style={theme.badgeActiveText}>activo</Text>
                        </View>
                      </View>
                      <Text style={theme.tableItemName} numberOfLines={1}>{item.nombre}</Text>
                    </View>

                    <Text style={[theme.tableItemCat, { flex: 0.8, textAlign: 'center' }]} numberOfLines={1}>
                      {item.categoria}
                    </Text>

                    <Text style={[theme.tableItemAmount, { flex: 0.8, textAlign: 'right', color: item.tipo === 'ingreso' ? '#10B981' : '#EF4444' }]} numberOfLines={1}>
                      S/ {item.monto.toFixed(2)}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal Meses */}
      <Modal visible={showMonthModal} transparent animationType="fade">
        <View style={theme.modalOverlay}>
          <View style={theme.modalContent}>
            <Text style={theme.modalTitle}>📅 Seleccionar Mes</Text>
            {MONTH_FILTERS.map((m) => (
              <TouchableOpacity key={m} style={theme.modalOption} onPress={() => { setSelectedMonth(m); setShowMonthModal(false); }}>
                <Text style={theme.modalOptionText}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal Categorías */}
      <Modal visible={showCategoryModal} transparent animationType="fade">
        <View style={theme.modalOverlay}>
          <View style={theme.modalContent}>
            <Text style={theme.modalTitle}>🏷️ Seleccionar Categoría</Text>
            {allCategories.map((c) => (
              <TouchableOpacity key={c} style={theme.modalOption} onPress={() => { setSelectedCategory(c); setShowCategoryModal(false); }}>
                <Text style={theme.modalOptionText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const baseStyles = {
  scrollContent: { padding: 16, paddingBottom: 60 },
  tabHeader: { flexDirection: 'row', paddingHorizontal: 8, paddingBottom: 8 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, marginHorizontal: 2 },
  tabBtnText: { fontSize: 11, fontWeight: 'bold' },
  topCardsGrid: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  topCard: { flex: 1, padding: 10, borderRadius: 12, borderWidth: 1 },
  topCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  topCardLabel: { fontSize: 11, fontWeight: 'bold' },
  topCardIcon: { fontSize: 14 },
  topCardValue: { fontSize: 15, fontWeight: 'bold' },
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  cardSub: { fontSize: 12, marginBottom: 12 },
  emptyText: { textAlign: 'center', marginVertical: 14 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  catCard: { width: '31%', padding: 10, borderRadius: 10, borderWidth: 1 },
  catCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  catCardName: { fontSize: 11, fontWeight: 'bold', flex: 1 },
  catCardCount: { fontSize: 10, opacity: 0.7 },
  catCardAmount: { fontSize: 13, fontWeight: 'bold' },

  // Grafico Segmentado Multi-color
  multiSegmentTrack: { height: 14, borderRadius: 7, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#E5E7EB', marginVertical: 12 },
  multiSegmentFill: { height: '100%' },

  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  legendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, fontWeight: '500' },

  barChartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 130, marginTop: 14 },
  barGroup: { alignItems: 'center', flex: 1 },
  barLabel: { fontSize: 9, fontWeight: 'bold', marginBottom: 4 },
  barTrack: { width: 22, height: 80, backgroundColor: '#E5E7EB', borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  barFillColor: { width: '100%', borderRadius: 4 },
  barCatName: { fontSize: 10, marginTop: 4 },

  monthChartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 110, marginTop: 10 },
  monthBarGroup: { alignItems: 'center', flex: 1 },
  monthBarVal: { fontSize: 8, fontWeight: 'bold', marginBottom: 2 },
  monthBarTrack: { width: 14, height: 70, backgroundColor: '#E5E7EB', borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  monthBarFillRed: { backgroundColor: '#EF4444', width: '100%', borderRadius: 4 },
  monthBarFillGreen: { backgroundColor: '#10B981', width: '100%', borderRadius: 4 },
  monthBarLabel: { fontSize: 9, marginTop: 4 },

  statsRowGrid: { gap: 8, marginTop: 10 },
  statMetricCard: { padding: 12, borderRadius: 10, borderWidth: 1 },
  statMetricLabel: { fontSize: 11, fontWeight: '600' },
  statMetricValue: { fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  filterCard: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  filterLabel: { fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  filterDropdownBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  filterDropdownText: { fontSize: 12, fontWeight: '600' },
  clearFilterBtn: { paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  clearFilterBtnText: { fontSize: 12, fontWeight: 'bold' },
  tableHeaderRow: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, marginBottom: 8 },
  tableColHeader: { fontSize: 11, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  badgeType: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgeIncome: { backgroundColor: '#10B981' },
  badgeExpense: { backgroundColor: '#EF4444' },
  badgeTypeText: { color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' },
  badgeActive: { backgroundColor: '#059669', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgeActiveText: { color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' },
  tableItemName: { fontSize: 13, fontWeight: 'bold', marginTop: 4 },
  tableItemCat: { fontSize: 12 },
  tableItemAmount: { fontSize: 13, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', borderRadius: 16, padding: 20, borderWidth: 1 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  modalOption: { paddingVertical: 12, borderBottomWidth: 1 },
  modalOptionText: { fontSize: 14, textAlign: 'center' }
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  tabHeader: { ...baseStyles.tabHeader, backgroundColor: '#6EE7B7' },
  tabBtn: { ...baseStyles.tabBtn, backgroundColor: 'transparent' },
  tabBtnActive: { backgroundColor: '#059669' },
  tabBtnText: { ...baseStyles.tabBtnText, color: '#065F46' },
  tabBtnTextActive: { color: '#FFFFFF' },
  card: { ...baseStyles.card, backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  cardTitle: { ...baseStyles.cardTitle, color: '#1F2937' },
  cardSub: { ...baseStyles.cardSub, color: '#6B7280' },
  emptyText: { ...baseStyles.emptyText, color: '#6B7280' },
  catCard: { ...baseStyles.catCard, backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
  catCardName: { ...baseStyles.catCardName, color: '#1F2937' },
  catCardCount: { ...baseStyles.catCardCount, color: '#6B7280' },
  catCardAmount: { ...baseStyles.catCardAmount, color: '#10B981' },
  legendBadge: { ...baseStyles.legendBadge, backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
  legendText: { ...baseStyles.legendText, color: '#4B5563' },
  barLabel: { ...baseStyles.barLabel, color: '#4B5563' },
  barCatName: { ...baseStyles.barCatName, color: '#4B5563' },
  monthBarVal: { ...baseStyles.monthBarVal, color: '#4B5563' },
  monthBarLabel: { ...baseStyles.monthBarLabel, color: '#4B5563' },
  statMetricCard: { ...baseStyles.statMetricCard, backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
  statMetricLabel: { ...baseStyles.statMetricLabel, color: '#4B5563' },
  filterCard: { ...baseStyles.filterCard, backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  filterLabel: { ...baseStyles.filterLabel, color: '#374151' },
  filterDropdownBtn: { ...baseStyles.filterDropdownBtn, backgroundColor: '#F9FAFB', borderColor: '#D1D5DB' },
  filterDropdownText: { ...baseStyles.filterDropdownText, color: '#1F2937' },
  clearFilterBtn: { ...baseStyles.clearFilterBtn, backgroundColor: '#E5E7EB' },
  clearFilterBtnText: { ...baseStyles.clearFilterBtnText, color: '#374151' },
  tableHeaderRow: { ...baseStyles.tableHeaderRow, borderColor: '#E5E7EB' },
  tableColHeader: { ...baseStyles.tableColHeader, color: '#4B5563' },
  tableRow: { ...baseStyles.tableRow, borderColor: '#F3F4F6' },
  tableItemName: { ...baseStyles.tableItemName, color: '#1F2937' },
  tableItemCat: { ...baseStyles.tableItemCat, color: '#6B7280' },
  modalContent: { ...baseStyles.modalContent, backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  modalTitle: { ...baseStyles.modalTitle, color: '#1F2937' },
  modalOption: { ...baseStyles.modalOption, borderColor: '#F3F4F6' },
  modalOptionText: { ...baseStyles.modalOptionText, color: '#1F2937' }
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: { flex: 1, backgroundColor: '#111827' },
  tabHeader: { ...baseStyles.tabHeader, backgroundColor: '#064E3B' },
  tabBtn: { ...baseStyles.tabBtn, backgroundColor: 'transparent' },
  tabBtnActive: { backgroundColor: '#10B981' },
  tabBtnText: { ...baseStyles.tabBtnText, color: '#A7F3D0' },
  tabBtnTextActive: { color: '#FFFFFF' },
  card: { ...baseStyles.card, backgroundColor: '#1F2937', borderColor: '#374151' },
  cardTitle: { ...baseStyles.cardTitle, color: '#F9FAFB' },
  cardSub: { ...baseStyles.cardSub, color: '#9CA3AF' },
  emptyText: { ...baseStyles.emptyText, color: '#9CA3AF' },
  catCard: { ...baseStyles.catCard, backgroundColor: '#111827', borderColor: '#374151' },
  catCardName: { ...baseStyles.catCardName, color: '#F9FAFB' },
  catCardCount: { ...baseStyles.catCardCount, color: '#9CA3AF' },
  catCardAmount: { ...baseStyles.catCardAmount, color: '#34D399' },
  legendBadge: { ...baseStyles.legendBadge, backgroundColor: '#111827', borderColor: '#374151' },
  legendText: { ...baseStyles.legendText, color: '#D1D5DB' },
  barLabel: { ...baseStyles.barLabel, color: '#D1D5DB' },
  barCatName: { ...baseStyles.barCatName, color: '#D1D5DB' },
  monthBarVal: { ...baseStyles.monthBarVal, color: '#D1D5DB' },
  monthBarLabel: { ...baseStyles.monthBarLabel, color: '#D1D5DB' },
  statMetricCard: { ...baseStyles.statMetricCard, backgroundColor: '#111827', borderColor: '#374151' },
  statMetricLabel: { ...baseStyles.statMetricLabel, color: '#9CA3AF' },
  filterCard: { ...baseStyles.filterCard, backgroundColor: '#1F2937', borderColor: '#374151' },
  filterLabel: { ...baseStyles.filterLabel, color: '#D1D5DB' },
  filterDropdownBtn: { ...baseStyles.filterDropdownBtn, backgroundColor: '#111827', borderColor: '#4B5563' },
  filterDropdownText: { ...baseStyles.filterDropdownText, color: '#F9FAFB' },
  clearFilterBtn: { ...baseStyles.clearFilterBtn, backgroundColor: '#374151' },
  clearFilterBtnText: { ...baseStyles.clearFilterBtnText, color: '#F9FAFB' },
  tableHeaderRow: { ...baseStyles.tableHeaderRow, borderColor: '#374151' },
  tableColHeader: { ...baseStyles.tableColHeader, color: '#9CA3AF' },
  tableRow: { ...baseStyles.tableRow, borderColor: '#374151' },
  tableItemName: { ...baseStyles.tableItemName, color: '#F9FAFB' },
  tableItemCat: { ...baseStyles.tableItemCat, color: '#9CA3AF' },
  modalContent: { ...baseStyles.modalContent, backgroundColor: '#1F2937', borderColor: '#374151' },
  modalTitle: { ...baseStyles.modalTitle, color: '#F9FAFB' },
  modalOption: { ...baseStyles.modalOption, borderColor: '#374151' },
  modalOptionText: { ...baseStyles.modalOptionText, color: '#F9FAFB' }
});
