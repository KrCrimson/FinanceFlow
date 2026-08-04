import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { crearCierre } from "../services/api";

export default function CajaChicaMobileModal({
  visible,
  onClose,
  tipo = "diario",
  periodo = "",
  fondoFijo = 0,
  resumen = { ingresosTotales: 0, egresosTotales: 0 },
  onExito,
  isDarkMode,
  currency = "S/",
}) {
  const [saldoFisico, setSaldoFisico] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [password, setPassword] = useState("");
  const [procesando, setProcesando] = useState(false);

  const expectedSaldo = fondoFijo + resumen.ingresosTotales - resumen.egresosTotales;
  const numSaldoFisico = parseFloat(saldoFisico) || 0;
  const diferencia = numSaldoFisico - expectedSaldo;

  const handleSubmit = async () => {
    if (isNaN(parseFloat(saldoFisico)) || parseFloat(saldoFisico) < 0) {
      Alert.alert("Error", "Ingresa un saldo físico contado válido.");
      return;
    }

    if (tipo === "mensual" && !password.trim()) {
      Alert.alert("Error", "La contraseña es obligatoria para cierres mensuales.");
      return;
    }

    setProcesando(true);
    try {
      await crearCierre({
        tipo,
        periodo,
        fondoFijo,
        saldoFisico: numSaldoFisico,
        comentarios,
        password,
      });

      Alert.alert(
        "✅ Cierre Exitoso",
        `El cierre ${tipo} del periodo ${periodo} fue registrado correctamente.`
      );
      if (onExito) onExito(tipo, periodo);
      onClose();
    } catch (err) {
      Alert.alert("Error de Cierre", err.message || "No se pudo procesar el cierre");
    } finally {
      setProcesando(false);
    }
  };

  const theme = isDarkMode ? darkStyles : lightStyles;

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.content, theme.content]}>
          <Text style={[styles.title, theme.text]}>
            📦 Cierre de Caja Chica ({tipo.toUpperCase()})
          </Text>
          <Text style={[styles.periodo, theme.subtext]}>Periodo: {periodo}</Text>

          {/* Resumen Esperado */}
          <View style={[styles.boxResumen, theme.boxResumen]}>
            <View style={styles.rowItem}>
              <Text style={theme.subtext}>Fondo Fijo Inicial:</Text>
              <Text style={[styles.boldText, theme.text]}>
                {currency} {fondoFijo.toFixed(2)}
              </Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={{ color: "#10B981" }}>+ Ingresos Totales:</Text>
              <Text style={{ color: "#10B981", fontWeight: "bold" }}>
                {currency} {resumen.ingresosTotales.toFixed(2)}
              </Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={{ color: "#EF4444" }}>- Egresos Totales:</Text>
              <Text style={{ color: "#EF4444", fontWeight: "bold" }}>
                {currency} {resumen.egresosTotales.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.rowItem, styles.borderTop]}>
              <Text style={[styles.boldText, theme.text]}>Saldo Esperado en Sistema:</Text>
              <Text style={[styles.boldText, { color: "#3B82F6" }]}>
                {currency} {expectedSaldo.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Formulario */}
          <Text style={[styles.label, theme.text]}>Saldo Físico Contado ({currency}):</Text>
          <TextInput
            style={[styles.input, theme.input]}
            placeholder="0.00"
            placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
            keyboardType="numeric"
            value={saldoFisico}
            onChangeText={setSaldoFisico}
          />

          {saldoFisico !== "" && (
            <View style={styles.diferenciaBox}>
              <Text style={styles.diferenciaLabel}>Diferencia (Físico vs Esperado):</Text>
              <Text
                style={[
                  styles.diferenciaValue,
                  { color: diferencia === 0 ? "#10B981" : diferencia > 0 ? "#F59E0B" : "#EF4444" },
                ]}
              >
                {diferencia === 0
                  ? "✅ Cuadre Perfecto (S/ 0.00)"
                  : `${diferencia > 0 ? "⚠️ Sobrante: +" : "❌ Faltante: "}${currency} ${Math.abs(diferencia).toFixed(2)}`}
              </Text>
            </View>
          )}

          <Text style={[styles.label, theme.text]}>Comentarios / Observaciones:</Text>
          <TextInput
            style={[styles.input, theme.input]}
            placeholder="Notas opcionales..."
            placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
            value={comentarios}
            onChangeText={setComentarios}
          />

          {tipo === "mensual" && (
            <>
              <Text style={[styles.label, theme.text]}>Contraseña para Confirmar:</Text>
              <TextInput
                style={[styles.input, theme.input]}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </>
          )}

          {/* Botones */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSave} onPress={handleSubmit} disabled={procesando}>
              {procesando ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.btnSaveText}>Confirmar Cierre</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", padding: 20 },
  content: { padding: 20, borderRadius: 24 },
  title: { fontSize: 17, fontWeight: "bold", marginBottom: 4 },
  periodo: { fontSize: 12, marginBottom: 14 },
  boxResumen: { padding: 12, borderRadius: 16, marginBottom: 14 },
  rowItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  borderTop: { borderTopWidth: 1, borderTopColor: "#374151", paddingTop: 6, marginTop: 4 },
  boldText: { fontWeight: "bold", fontSize: 13 },
  label: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 12, padding: 10, fontSize: 13, marginBottom: 12 },
  diferenciaBox: { marginBottom: 12 },
  diferenciaLabel: { fontSize: 11, color: "#9CA3AF" },
  diferenciaValue: { fontSize: 13, fontWeight: "bold", marginTop: 2 },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 10 },
  btnCancel: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: "#374151" },
  btnCancelText: { color: "#9CA3AF", fontWeight: "bold", fontSize: 13 },
  btnSave: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: "#10B981" },
  btnSaveText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },
});

const lightStyles = StyleSheet.create({
  content: { backgroundColor: "#FFFFFF" },
  text: { color: "#111827" },
  subtext: { color: "#6B7280" },
  boxResumen: { backgroundColor: "#F3F4F6" },
  input: { borderColor: "#D1D5DB", backgroundColor: "#F9FAFB", color: "#111827" },
});

const darkStyles = StyleSheet.create({
  content: { backgroundColor: "#111827" },
  text: { color: "#F9FAFB" },
  subtext: { color: "#9CA3AF" },
  boxResumen: { backgroundColor: "#1F2937" },
  input: { borderColor: "#374151", backgroundColor: "#111827", color: "#F9FAFB" },
});
