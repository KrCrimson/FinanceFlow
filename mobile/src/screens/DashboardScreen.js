import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useMovimientos } from '../hooks/useMovimientos';
import { useAnalisisGastos } from '../hooks/useAnalisisGastos';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const { movimientos, loading } = useMovimientos();
  const { alertas, resumenMensual, distribucionGastos } = useAnalisisGastos();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Cargando datos desde la nube...</Text>
      </View>
    );
  }

  // Filtrar y ordenar movimientos recientes
  const recientes = [...movimientos]
    .sort((a, b) => new Date(b.creadoEn || b.fecha) - new Date(a.creadoEn || a.fecha))
    .slice(0, 5);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* SECCIÓN DE ALERTAS (Replicando la tarjeta roja de la Web) */}
      {alertas.length > 0 && (
        <View style={styles.alertContainer}>
          {alertas.map((alerta, idx) => (
            <View key={idx} style={styles.alertBox}>
              <Text style={styles.alertTitle}>🚨 {alerta.mensaje}</Text>
              <Text style={styles.alertText}>{alerta.descripcion}</Text>
            </View>
          ))}
        </View>
      )}

      {/* TARJETAS DE RESUMEN MENSUAL */}
      <View style={styles.summaryContainer}>
        <View style={[styles.card, styles.cardIngreso]}>
          <Text style={styles.cardTitle}>Ingreso Prom.</Text>
          <Text style={styles.cardValueIngreso}>S/ {resumenMensual?.ingresoPromedio?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={[styles.card, styles.cardEgreso]}>
          <Text style={styles.cardTitle}>Gasto Prom.</Text>
          <Text style={styles.cardValueEgreso}>S/ {resumenMensual?.gastoPromedio?.toFixed(2) || '0.00'}</Text>
        </View>
      </View>

      {/* GRÁFICO DE GASTOS */}
      {distribucionGastos && distribucionGastos.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Distribución de Gastos</Text>
          <PieChart
            data={distribucionGastos.map((item, index) => ({
              name: item.categoria,
              monto: item.monto,
              color: ['#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#8B5CF6'][index % 6],
              legendFontColor: '#4B5563',
              legendFontSize: 12
            }))}
            width={screenWidth - 40}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="monto"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
          />
        </View>
      )}

      {/* LISTA DE MOVIMIENTOS RECIENTES */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>💳 Movimientos Recientes</Text>
          <Text style={styles.listSubtitle}>{movimientos.length} en total</Text>
        </View>

        {recientes.length === 0 ? (
          <Text style={styles.emptyText}>No hay movimientos registrados.</Text>
        ) : (
          recientes.map((mov, idx) => (
            <View key={mov._id || idx} style={styles.movimientoItem}>
              <View style={styles.movInfo}>
                <Text style={styles.movNombre}>{mov.nombre}</Text>
                <Text style={styles.movCategoria}>{mov.categoria}</Text>
              </View>
              
              <View style={styles.movMontoContainer}>
                <Text style={[styles.movMonto, mov.tipo === 'ingreso' ? styles.textIngreso : styles.textEgreso]}>
                  {mov.tipo === 'ingreso' ? '+ S/ ' : '- S/ '}
                  {mov.monto?.toFixed(2)}
                </Text>
                
                <View style={[styles.badge, mov.estado === 'inactivo' ? styles.badgeInactivo : styles.badgeActivo]}>
                  <Text style={[styles.badgeText, mov.estado === 'inactivo' ? styles.badgeTextInactivo : styles.badgeTextActivo]}>
                    {mov.estado || 'activo'}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
      <View style={{height: 40}} />
    </ScrollView>
  );
}

// ESTILOS NATIVOS: Fieles a los colores de Tailwind CSS del Frontend Web
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  loadingText: { marginTop: 10, color: '#6B7280', fontSize: 16 },
  
  // Alertas
  alertContainer: { marginBottom: 20 },
  alertBox: { backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#FECACA', borderLeftWidth: 4, borderLeftColor: '#EF4444' },
  alertTitle: { color: '#991B1B', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  alertText: { color: '#B91C1C', fontSize: 14 },

  // Tarjetas sumarias
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: { flex: 1, padding: 16, borderRadius: 16, marginHorizontal: 4, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3 },
  cardIngreso: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0' },
  cardEgreso: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  cardTitle: { fontSize: 12, color: '#4B5563', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase' },
  cardValueIngreso: { fontSize: 20, fontWeight: 'bold', color: '#065F46' },
  cardValueEgreso: { fontSize: 20, fontWeight: 'bold', color: '#991B1B' },

  // Gráficos
  chartContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },

  // Lista
  listContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 12, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  listSubtitle: { fontSize: 13, color: '#6B7280' },
  emptyText: { textAlign: 'center', color: '#6B7280', paddingVertical: 20 },
  movimientoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  
  movInfo: { flex: 1 },
  movNombre: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  movCategoria: { fontSize: 13, color: '#6B7280', backgroundColor: '#F3F4F6', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
  
  movMontoContainer: { alignItems: 'flex-end' },
  movMonto: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  textIngreso: { color: '#10B981' },
  textEgreso: { color: '#EF4444' },
  
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeActivo: { backgroundColor: '#D1FAE5' },
  badgeInactivo: { backgroundColor: '#E5E7EB' },
  badgeText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  badgeTextActivo: { color: '#065F46' },
  badgeTextInactivo: { color: '#6B7280' },
});