import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useMovimientos } from "../hooks/useMovimientos";
import { useAnalisisGastos } from "../hooks/useAnalisisGastos";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const { loading } = useMovimientos();
  const { tendenciasMensuales, distribucionGastos } = useAnalisisGastos();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // Preparar datos para BarChart (Historial de Gastos vs Ingresos por meses)
  const barData =
    tendenciasMensuales && tendenciasMensuales.length > 0
      ? {
          labels: tendenciasMensuales.map((t) => t.mes),
          datasets: [
            {
              data: tendenciasMensuales.map((t) => t.ingresos),
            },
            {
              data: tendenciasMensuales.map((t) => t.gastos),
            },
          ],
        }
      : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBox}>
        <Text style={styles.pageTitle}>Reportes y Estadísticas 📈</Text>
        <Text style={styles.pageSubtitle}>
          Análisis detallado de tu comportamiento financiero
        </Text>
      </View>

      {/* GRÁFICO DE BARRAS: TENDENCIAS MENSUALES */}
      {tendenciasMensuales && tendenciasMensuales.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Historial Mensual</Text>
          <BarChart
            data={barData}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="S/ "
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              barPercentage: 0.5,
              useShadowColorFromDataset: false, // para que use los colores de los datasets
            }}
            style={{ borderRadius: 10, marginVertical: 8 }}
            withCustomBarColorFromData
            fromZero
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#10B981" }]}
              />
              <Text style={styles.legendText}>Ingresos</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#EF4444" }]}
              />
              <Text style={styles.legendText}>Gastos</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* DISTRIBUCIÓN DE GASTOS */}
      {distribucionGastos && distribucionGastos.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>TOP Categorías de Gasto</Text>
          <PieChart
            data={
              distribucionGastos
                .map((item, index) => ({
                  name: item.categoria,
                  monto: item.monto,
                  color: [
                    "#EF4444",
                    "#F59E0B",
                    "#3B82F6",
                    "#8B5CF6",
                    "#10B981",
                    "#6366F1",
                  ][index % 6],
                  legendFontColor: "#4B5563",
                  legendFontSize: 12,
                }))
                .sort((a, b) => b.monto - a.monto) // Ordenar de mayor a menor
            }
            width={screenWidth - 40}
            height={200}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
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

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerBox: { marginBottom: 20, paddingTop: 10 },
  pageTitle: { fontSize: 24, fontWeight: "bold", color: "#1F2937" },
  pageSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 12,
  },

  // Leyenda personalizada
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 13, color: "#6B7280" },
});
