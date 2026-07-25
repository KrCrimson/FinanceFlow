import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { solicitarPlanPro } from "../services/api";

export default function PaywallModal({
  visible,
  onClose,
  isDarkMode,
  userEmail,
}) {
  const [paso, setPaso] = useState("beneficios"); // 'beneficios' | 'pago' | 'exito'
  const [metodo, setMetodo] = useState("yape"); // 'yape' | 'bcp'
  const [nroOperacion, setNroOperacion] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!visible) return null;

  const handleConfirmarPago = async () => {
    if (!nroOperacion.trim()) {
      Alert.alert(
        "Código Requerido",
        "Por favor ingresa tu número de operación o código de Yape.",
      );
      return;
    }

    try {
      setEnviando(true);
      await solicitarPlanPro(
        userEmail || "usuario@financeflow.com",
        metodo,
        nroOperacion.trim(),
        19.9,
      );
      setPaso("exito");
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo enviar el comprobante.");
    } finally {
      setEnviando(false);
    }
  };

  const bgModal = isDarkMode ? "#111827" : "#FFFFFF";
  const textColor = isDarkMode ? "#FFFFFF" : "#111827";
  const cardBg = isDarkMode ? "#1F2937" : "#F0FDF4";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: bgModal }]}>
          {/* Header Superior Decorativo */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>👑 FinanceFlow Pro</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {paso === "beneficios" && (
              <View style={styles.stepContainer}>
                <Text style={[styles.title, { color: textColor }]}>
                  Desbloquea el Máximo Potencial Financiero
                </Text>
                <Text style={styles.subtitle}>
                  Obtén acceso total y sin restricciones en la App Móvil y en la
                  Web.
                </Text>

                {/* Grid de Beneficios */}
                <View style={styles.benefitsGrid}>
                  <View
                    style={[styles.benefitCard, { backgroundColor: cardBg }]}
                  >
                    <Text style={styles.benefitIcon}>📸</Text>
                    <View style={styles.benefitTextCol}>
                      <Text style={[styles.benefitTitle, { color: textColor }]}>
                        OCR Gemini Ilimitado
                      </Text>
                      <Text style={styles.benefitSub}>
                        Escaneo ilimitado de recibos y boletas con Inteligencia
                        Artificial.
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[styles.benefitCard, { backgroundColor: cardBg }]}
                  >
                    <Text style={styles.benefitIcon}>📥</Text>
                    <View style={styles.benefitTextCol}>
                      <Text style={[styles.benefitTitle, { color: textColor }]}>
                        Exportación PDF / Excel
                      </Text>
                      <Text style={styles.benefitSub}>
                        Generación e impresión de reportes oficiales desde la
                        Web.
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[styles.benefitCard, { backgroundColor: cardBg }]}
                  >
                    <Text style={styles.benefitIcon}>🏁</Text>
                    <View style={styles.benefitTextCol}>
                      <Text style={[styles.benefitTitle, { color: textColor }]}>
                        Carreras de Metas Ilimitadas
                      </Text>
                      <Text style={styles.benefitSub}>
                        Planifica compras grandes sin límite de ahorro
                        simultáneo.
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[styles.benefitCard, { backgroundColor: cardBg }]}
                  >
                    <Text style={styles.benefitIcon}>🔒</Text>
                    <View style={styles.benefitTextCol}>
                      <Text style={[styles.benefitTitle, { color: textColor }]}>
                        Cierres de Caja Avanzados
                      </Text>
                      <Text style={styles.benefitSub}>
                        Bloqueo seguro con contraseña y auditoría completa.
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Banner de Oferta */}
                <View style={styles.offerCard}>
                  <Text style={styles.offerBadge}>OFERTA DE LANZAMIENTO</Text>
                  <Text style={styles.offerPrice}>S/ 19.90</Text>
                  <Text style={styles.offerDetail}>
                    Pago único • Licencia Pro Multidispositivo
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.mainBtn}
                  onPress={() => setPaso("pago")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.mainBtnText}>
                    🚀 Pagar con Yape o BCP
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {paso === "pago" && (
              <View style={styles.stepContainer}>
                <Text style={[styles.title, { color: textColor }]}>
                  Realiza tu Pago
                </Text>

                {/* Selector de Método */}
                <View style={styles.tabSelector}>
                  <TouchableOpacity
                    style={[
                      styles.tabBtn,
                      metodo === "yape" && styles.tabBtnActiveYape,
                    ]}
                    onPress={() => setMetodo("yape")}
                  >
                    <Text
                      style={[
                        styles.tabBtnText,
                        metodo === "yape" && styles.tabBtnTextActive,
                      ]}
                    >
                      📱 Yape (QR)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.tabBtn,
                      metodo === "bcp" && styles.tabBtnActiveBcp,
                    ]}
                    onPress={() => setMetodo("bcp")}
                  >
                    <Text
                      style={[
                        styles.tabBtnText,
                        metodo === "bcp" && styles.tabBtnTextActive,
                      ]}
                    >
                      🏛️ BCP
                    </Text>
                  </TouchableOpacity>
                </View>

                {metodo === "yape" ? (
                  <View style={styles.qrCard}>
                    <Text style={styles.qrInstruction}>
                      Escanea el código QR en tu app Yape:
                    </Text>
                    <Image
                      source={require("../../assets/yape-qr.png")}
                      style={styles.qrImage}
                    />
                    <Text style={styles.qrHolder}>
                      Titular:{" "}
                      <Text style={{ fontWeight: "bold", color: "#7C3AED" }}>
                        Sebastian Rodrigo Arce Bracamonte
                      </Text>
                    </Text>
                  </View>
                ) : (
                  <View style={styles.bcpCard}>
                    <Text style={styles.bcpHeader}>
                      Datos Bancarios Oficiales BCP
                    </Text>

                    <View style={styles.bcpBox}>
                      <Text style={styles.bcpLabel}>Cuenta BCP Soles:</Text>
                      <Text style={styles.bcpValue}>54008582045056</Text>
                    </View>

                    <View style={styles.bcpBox}>
                      <Text style={styles.bcpLabel}>
                        Código Interbancario (CCI):
                      </Text>
                      <Text style={styles.bcpValue}>00254010858204505637</Text>
                    </View>

                    <Text style={styles.bcpHolder}>
                      Titular:{" "}
                      <Text style={{ fontWeight: "bold", color: "#2563EB" }}>
                        Sebastian Rodrigo Arce Bracamonte
                      </Text>
                    </Text>
                  </View>
                )}

                {/* Campo de Código de Operación */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: textColor }]}>
                    Número de Operación / Código de Yape:
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: textColor,
                        borderColor: isDarkMode ? "#374151" : "#D1D5DB",
                      },
                    ]}
                    placeholder="Ej: 0928174"
                    placeholderTextColor="#9CA3AF"
                    value={nroOperacion}
                    onChangeText={setNroOperacion}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => setPaso("beneficios")}
                  >
                    <Text style={styles.backBtnText}>← Volver</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.confirmBtn, enviando && { opacity: 0.6 }]}
                    onPress={handleConfirmarPago}
                    disabled={enviando}
                  >
                    {enviando ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.confirmBtnText}>Confirmar Pago</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {paso === "exito" && (
              <View
                style={[
                  styles.stepContainer,
                  { alignItems: "center", paddingVertical: 20 },
                ]}
              >
                <Text style={{ fontSize: 50, marginBottom: 10 }}>🎉</Text>
                <Text
                  style={[
                    styles.title,
                    { color: textColor, textAlign: "center" },
                  ]}
                >
                  ¡Solicitud Registrada!
                </Text>
                <Text style={[styles.subtitle, { textAlign: "center" }]}>
                  Tu código de operación{" "}
                  <Text style={{ fontWeight: "bold", color: "#059669" }}>
                    {nroOperacion}
                  </Text>{" "}
                  fue recibido. Verificaremos la transferencia y activaremos el
                  plan Pro en tu cuenta de inmediato.
                </Text>

                <TouchableOpacity
                  style={[styles.mainBtn, { marginTop: 20 }]}
                  onPress={onClose}
                >
                  <Text style={styles.mainBtnText}>Entendido, Gracias</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#064E3B",
    padding: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  stepContainer: {
    gap: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  benefitsGrid: {
    gap: 10,
    marginVertical: 6,
  },
  benefitCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  benefitIcon: {
    fontSize: 24,
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  benefitSub: {
    fontSize: 11,
    color: "#6B7280",
  },
  offerCard: {
    backgroundColor: "#064E3B",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  offerBadge: {
    backgroundColor: "#F59E0B",
    color: "#111827",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  offerPrice: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  offerDetail: {
    color: "#A7F3D0",
    fontSize: 11,
  },
  mainBtn: {
    backgroundColor: "#059669",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  mainBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabSelector: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabBtnActiveYape: {
    backgroundColor: "#7C3AED",
  },
  tabBtnActiveBcp: {
    backgroundColor: "#2563EB",
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#4B5563",
  },
  tabBtnTextActive: {
    color: "#FFF",
  },
  qrCard: {
    backgroundColor: "#F3E8FF",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  qrInstruction: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#5B21B6",
    marginBottom: 10,
  },
  qrImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderRadius: 12,
  },
  qrHolder: {
    fontSize: 12,
    color: "#4C1D95",
    marginTop: 10,
  },
  bcpCard: {
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    gap: 8,
  },
  bcpHeader: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1E40AF",
    textAlign: "center",
    marginBottom: 4,
  },
  bcpBox: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12,
  },
  bcpLabel: {
    fontSize: 10,
    color: "#6B7280",
  },
  bcpValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  bcpHolder: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    color: "#1E3A8A",
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  backBtn: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  backBtnText: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#059669",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
