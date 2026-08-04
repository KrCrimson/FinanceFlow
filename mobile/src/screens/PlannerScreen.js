import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  fetchMovimientos,
  createMovimiento,
  updateMovimiento,
} from "../services/api";

export default function PlannerScreen({ user, isDarkMode, currency = "S/" }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [procesando, setProcesando] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchMovimientos();
      setMovimientos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar metas:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Calcular balance actual (Solo activos)
  const balanceTotal = movimientos
    .filter((m) => m.estado === "activo" || !m.estado)
    .reduce((acc, m) => {
      const valor = Number(m.monto) || 0;
      return m.tipo === "ingreso" ? acc + valor : acc - valor;
    }, 0);

  const balanceDisponible = Math.max(0, balanceTotal);

  // Filtrar metas de compra planificadas
  const metas = movimientos
    .filter((m) => m.estado === "planificado")
    .map((m) => {
      const montoObjetivo = Number(m.monto) || 0;
      const asignado = Math.min(balanceDisponible, montoObjetivo);
      const porcentaje =
        montoObjetivo > 0
          ? Math.min(100, (balanceDisponible / montoObjetivo) * 100)
          : 0;
      return {
        id: m._id,
        nombre: m.nombre,
        montoObjetivo,
        montoAhorrado: asignado,
        porcentaje,
        alcanzado: balanceDisponible >= montoObjetivo,
      };
    });

  const handleAgregarMeta = async () => {
    const numMonto = parseFloat(monto);
    if (!nombre.trim() || isNaN(numMonto) || numMonto <= 0) {
      Alert.alert("Error", "Ingresa un nombre y un monto válido.");
      return;
    }

    setProcesando(true);
    try {
      await createMovimiento({
        nombre: nombre.trim(),
        monto: numMonto,
        tipo: "egreso",
        categoria: "Otros",
        estado: "planificado",
        fecha: new Date().toISOString(),
      });
      setNombre("");
      setMonto("");
      setModalVisible(false);
      loadData();
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo registrar la meta");
    } finally {
      setProcesando(false);
    }
  };

  const handleMarcarComprado = (meta) => {
    Alert.alert(
      "Confirmar Compra",
      `¿Deseas cerrar "${meta.nombre}" y registrar el egreso por ${currency} ${meta.montoObjetivo.toFixed(2)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "🛒 Comprar",
          onPress: async () => {
            try {
              await updateMovimiento(meta.id, {
                estado: "activo",
                fecha: new Date().toISOString(),
              });
              loadData();
            } catch (err) {
              Alert.alert("Error", err.message || "No se pudo marcar como comprado");
            }
          },
        },
      ]
    );
  };

  const handleCancelarMeta = (meta) => {
    Alert.alert(
      "Borrar Meta",
      `¿Estás seguro de borrar la meta "${meta.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            try {
              await updateMovimiento(meta.id, {
                estado: "inactivo",
              });
              loadData();
            } catch (err) {
              Alert.alert("Error", err.message || "No se pudo borrar la meta");
            }
          },
        },
      ]
    );
  };

  const theme = isDarkMode ? darkStyles : lightStyles;

  if (loading) {
    return (
      <View style={[styles.container, theme.container, styles.center]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={[styles.loadingText, theme.subtext]}>Cargando metas...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, theme.container]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
      }
    >
      {/* Header Banner */}
      <View style={[styles.headerCard, theme.headerCard]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerEmoji}>🏁</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, theme.text]}>Carrera de Metas</Text>
            <Text style={[styles.headerSubtitle, theme.subtext]}>
              Monitorea cuáles compras puedes realizar con tu saldo real
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.btnNuevaMeta}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnNuevaMetaText}>+ Meta</Text>
        </TouchableOpacity>
      </View>

      {/* Resumen del Saldo Disponible */}
      <View style={[styles.balanceBox, theme.card]}>
        <Text style={[styles.balanceLabel, theme.subtext]}>Saldo Actual Disponible:</Text>
        <Text style={[styles.balanceValue, { color: "#10B981" }]}>
          {currency} {balanceDisponible.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
        </Text>
      </View>

      {/* Lista de Metas */}
      {metas.length === 0 ? (
        <View style={[styles.emptyCard, theme.card]}>
          <Text style={{ fontSize: 36, marginBottom: 8 }}>🛍️</Text>
          <Text style={[styles.emptyTitle, theme.text]}>Sin compras planificadas</Text>
          <Text style={[styles.emptySub, theme.subtext]}>
            Crea una nueva meta para comparar avance contra tu balance.
          </Text>
        </View>
      ) : (
        metas.map((meta) => (
          <View
            key={meta.id}
            style={[
              styles.metaCard,
              theme.card,
              meta.alcanzado && styles.metaCardAlcanzado,
            ]}
          >
            <View style={styles.metaTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.metaNombre, theme.text]}>
                  {meta.nombre}{" "}
                  {meta.alcanzado && (
                    <Text style={styles.badgeAlcanzado}> 🎉 ¡Listo!</Text>
                  )}
                </Text>
                <Text style={styles.metaMontoText}>
                  {currency} {meta.montoAhorrado.toFixed(2)} / {currency} {meta.montoObjetivo.toFixed(2)}
                </Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[
                    styles.btnComprado,
                    meta.alcanzado && styles.btnCompradoReady,
                  ]}
                  onPress={() => handleMarcarComprado(meta)}
                >
                  <Text style={styles.btnCompradoText}>🛒 Comprado</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnBorrar}
                  onPress={() => handleCancelarMeta(meta)}
                >
                  <Text style={styles.btnBorrarText}>❌</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Barra de Progreso */}
            <View style={[styles.progressBarBg, theme.progressBg]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${meta.porcentaje}%`,
                    backgroundColor: meta.alcanzado ? "#10B981" : "#3B82F6",
                  },
                ]}
              />
            </View>

            <View style={styles.metaBottom}>
              <Text style={[styles.metaSubtext, theme.subtext]}>
                {meta.alcanzado
                  ? "✅ Tu saldo cubre totalmente esta compra"
                  : "Avance contra saldo actual"}
              </Text>
              <Text
                style={[
                  styles.metaPercent,
                  { color: meta.alcanzado ? "#10B981" : "#3B82F6" },
                ]}
              >
                {meta.porcentaje.toFixed(0)}% Completado
              </Text>
            </View>
          </View>
        ))
      )}

      {/* Modal Nueva Meta */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, theme.modalContent]}>
            <Text style={[styles.modalTitle, theme.text]}>🎯 Nueva Meta de Compra</Text>

            <Text style={[styles.inputLabel, theme.subtext]}>Nombre de la Meta:</Text>
            <TextInput
              style={[styles.input, theme.input]}
              placeholder="Ej. Laptop, Celular, Curso..."
              placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={[styles.inputLabel, theme.subtext]}>Monto Objetivo ({currency}):</Text>
            <TextInput
              style={[styles.input, theme.input]}
              placeholder="0.00"
              placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
              keyboardType="numeric"
              value={monto}
              onChangeText={setMonto}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnModalCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnModalCancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnModalGuardar}
                onPress={handleAgregarMeta}
                disabled={procesando}
              >
                {procesando ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.btnModalGuardarText}>Guardar Meta</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  content: { padding: 16, paddingBottom: 40 },
  loadingText: { marginTop: 10, fontSize: 14 },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  headerEmoji: { fontSize: 28, marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  headerSubtitle: { fontSize: 11, marginTop: 2 },
  btnNuevaMeta: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  btnNuevaMetaText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },
  balanceBox: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: { fontSize: 13, fontWeight: "600" },
  balanceValue: { fontSize: 16, fontWeight: "bold" },
  emptyCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 16, fontWeight: "bold", marginTop: 6 },
  emptySub: { fontSize: 12, textAlign: "center", marginTop: 4 },
  metaCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "transparent",
  },
  metaCardAlcanzado: { borderColor: "#10B981" },
  metaTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  metaNombre: { fontSize: 15, fontWeight: "bold" },
  badgeAlcanzado: { fontSize: 12, color: "#10B981", fontWeight: "bold" },
  metaMontoText: { fontSize: 13, fontWeight: "bold", color: "#10B981", marginTop: 2 },
  actionsRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  btnComprado: { backgroundColor: "#10B981", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  btnCompradoReady: { backgroundColor: "#059669" },
  btnCompradoText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  btnBorrar: { backgroundColor: "#EF4444", paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8 },
  btnBorrarText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  progressBarBg: { height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 8 },
  progressBarFill: { height: "100%", borderRadius: 5 },
  metaBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  metaSubtext: { fontSize: 10 },
  metaPercent: { fontSize: 11, fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 20 },
  modalContent: { padding: 20, borderRadius: 24 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 14 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 10 },
  btnModalCancelar: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: "#374151" },
  btnModalCancelarText: { color: "#9CA3AF", fontWeight: "bold", fontSize: 13 },
  btnModalGuardar: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: "#10B981" },
  btnModalGuardarText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: "#F3F4F6" },
  headerCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB" },
  card: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB" },
  text: { color: "#1F2937" },
  subtext: { color: "#6B7280" },
  progressBg: { backgroundColor: "#E5E7EB" },
  modalContent: { backgroundColor: "#FFFFFF" },
  input: { borderColor: "#D1D5DB", backgroundColor: "#F9FAFB", color: "#111827" },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: "#0B0F19" },
  headerCard: { backgroundColor: "#111827", borderWidth: 1, borderColor: "#1F2937" },
  card: { backgroundColor: "#111827", borderWidth: 1, borderColor: "#1F2937" },
  text: { color: "#F9FAFB" },
  subtext: { color: "#9CA3AF" },
  progressBg: { backgroundColor: "#374151" },
  modalContent: { backgroundColor: "#111827" },
  input: { borderColor: "#374151", backgroundColor: "#1F2937", color: "#F9FAFB" },
});
