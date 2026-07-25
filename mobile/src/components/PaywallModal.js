import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { solicitarPlanPro, checkoutDirectoPro } from "../services/api";

const LISTA_PAISES = [
  {
    nombre: "Perú",
    moneda: "PEN",
    simbolo: "S/",
    monto: 19.9,
    desc: "S/ 19.90 PEN",
  },
  {
    nombre: "México",
    moneda: "MXN",
    simbolo: "$",
    monto: 99.0,
    desc: "$99 MXN",
  },
  {
    nombre: "Colombia",
    moneda: "COP",
    simbolo: "$",
    monto: 21500,
    desc: "$21,500 COP",
  },
  {
    nombre: "Chile",
    moneda: "CLP",
    simbolo: "$",
    monto: 5200,
    desc: "$5,200 CLP",
  },
  {
    nombre: "Argentina",
    moneda: "ARS",
    simbolo: "$",
    monto: 5500,
    desc: "$5,500 ARS",
  },
  {
    nombre: "Estados Unidos",
    moneda: "USD",
    simbolo: "$",
    monto: 5.99,
    desc: "$5.99 USD",
  },
  {
    nombre: "España / Europa",
    moneda: "EUR",
    simbolo: "€",
    monto: 5.99,
    desc: "€5.99 EUR",
  },
  {
    nombre: "Otro País",
    moneda: "USD",
    simbolo: "$",
    monto: 5.99,
    desc: "$5.99 USD",
  },
];

export default function PaywallModal({
  visible,
  onClose,
  isDarkMode,
  userEmail,
}) {
  const [paso, setPaso] = useState("beneficios"); // 'beneficios' | 'pago' | 'exito'
  const [paisSeleccionado, setPaisSeleccionado] = useState(LISTA_PAISES[0]);

  // Formulario tarjeta
  const [numTarjeta, setNumTarjeta] = useState("");
  const [caducidad, setCaducidad] = useState("");
  const [cvc, setCvc] = useState("");
  const [nombreTitular, setNombreTitular] = useState("");

  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (timeZone.includes("Lima")) setPaisSeleccionado(LISTA_PAISES[0]);
      else if (timeZone.includes("Mexico"))
        setPaisSeleccionado(LISTA_PAISES[1]);
      else if (timeZone.includes("Bogota"))
        setPaisSeleccionado(LISTA_PAISES[2]);
      else if (timeZone.includes("Santiago"))
        setPaisSeleccionado(LISTA_PAISES[3]);
      else if (timeZone.includes("Buenos_Aires"))
        setPaisSeleccionado(LISTA_PAISES[4]);
      else if (timeZone.includes("Madrid"))
        setPaisSeleccionado(LISTA_PAISES[6]);
      else if (!timeZone.includes("America/"))
        setPaisSeleccionado(LISTA_PAISES[5]);
    } catch (e) {
      console.log("Mobile auto-detect fallback applied");
    }
  }, []);

  if (!visible) return null;

  const handlePagarTarjeta = async () => {
    try {
      setEnviando(true);
      if (
        !numTarjeta.trim() ||
        !caducidad.trim() ||
        !cvc.trim() ||
        !nombreTitular.trim()
      ) {
        Alert.alert(
          "Datos requeridos",
          "Por favor ingresa todos los datos de tu tarjeta.",
        );
        setEnviando(false);
        return;
      }

      const nroOp = `CARD-${Date.now().toString().slice(-6)}`;
      await checkoutDirectoPro(
        userEmail || "usuario@financeflow.com",
        "tarjeta",
        paisSeleccionado.nombre,
        paisSeleccionado.monto,
        paisSeleccionado.moneda,
      );

      setPaso("exito");
    } catch (err) {
      Alert.alert(
        "Error",
        err.message || "No se pudo enviar la solicitud de pago.",
      );
    } finally {
      setEnviando(false);
    }
  };

  const bgModal = "#111827";
  const textColor = "#FFFFFF";
  const cardBg = "#1F2937";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: bgModal }]}>
          {/* Header Superior */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>💳 FinanceFlow Pro Checkout</Text>
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
                  Suscripción FinanceFlow Pro
                </Text>
                <Text style={styles.subtitle}>
                  Acceso total en la App Móvil y en la Web sin restricciones.
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
                        Escaneo ilimitado de comprobantes con Inteligencia
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
                        Descarga de reportes contables oficiales en la Web.
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[styles.benefitCard, { backgroundColor: cardBg }]}
                  >
                    <Text style={styles.benefitIcon}>🏁</Text>
                    <View style={styles.benefitTextCol}>
                      <Text style={[styles.benefitTitle, { color: textColor }]}>
                        Metas Ilimitadas
                      </Text>
                      <Text style={styles.benefitSub}>
                        Planifica compras grandes sin límite de ahorro
                        simultáneo.
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Selector de Moneda / Precio */}
                <View style={styles.offerCard}>
                  <Text style={styles.offerBadge}>
                    TARIFA PROMO LATAM & MUNDO
                  </Text>
                  <Text style={styles.offerPrice}>{paisSeleccionado.desc}</Text>
                  <Text style={styles.offerDetail}>
                    País Auto-detectado: {paisSeleccionado.nombre}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.mainBtn}
                  onPress={() => setPaso("pago")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.mainBtnText}>
                    Continuar al Pago con Tarjeta →
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {paso === "pago" && (
              <View style={styles.stepContainer}>
                <View style={styles.formCard}>
                  <Text
                    style={{
                      color: "#3B82F6",
                      fontWeight: "bold",
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    💳 Pago Seguro con Tarjeta (Visa / MasterCard / Amex)
                  </Text>
                  <Text style={styles.inputLabel}>Número De Tarjeta</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1234 1234 1234 1234"
                    placeholderTextColor="#6B7280"
                    keyboardType="number-pad"
                    value={numTarjeta}
                    onChangeText={setNumTarjeta}
                  />

                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>Caducidad</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="MM / AA"
                        placeholderTextColor="#6B7280"
                        value={caducidad}
                        onChangeText={setCaducidad}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>CVC</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="CVC 123"
                        placeholderTextColor="#6B7280"
                        keyboardType="number-pad"
                        secureTextEntry
                        maxLength={4}
                        value={cvc}
                        onChangeText={setCvc}
                      />
                    </View>
                  </View>

                  <Text style={styles.inputLabel}>
                    Nombre Completo del Titular
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre en la tarjeta"
                    placeholderTextColor="#6B7280"
                    value={nombreTitular}
                    onChangeText={setNombreTitular}
                  />

                  <TouchableOpacity
                    style={[styles.confirmBtn, enviando && { opacity: 0.6 }]}
                    onPress={handlePagarTarjeta}
                    disabled={enviando}
                  >
                    {enviando ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.confirmBtnText}>
                        Pagar {paisSeleccionado.desc} con Tarjeta
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{ marginTop: 10, alignSelf: "center" }}
                  onPress={() => setPaso("beneficios")}
                >
                  <Text
                    style={{
                      color: "#9CA3AF",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    ← Volver a los beneficios
                  </Text>
                </TouchableOpacity>
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
                  ¡Bienvenido a FinanceFlow Pro!
                </Text>
                <Text style={[styles.subtitle, { textAlign: "center" }]}>
                  Tu suscripción Pro se ha activado correctamente al instante. Ahora puedes disfrutar de escaneo OCR ilimitado y todas las funciones avanzadas.
                </Text>

                <TouchableOpacity
                  style={[styles.mainBtn, { marginTop: 20 }]}
                  onPress={onClose}
                >
                  <Text style={styles.mainBtnText}>¡Disfrutar de Pro!</Text>
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
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "92%",
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#1F2937",
    padding: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
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
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  benefitsGrid: {
    gap: 10,
    marginVertical: 4,
  },
  benefitCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  benefitIcon: {
    fontSize: 22,
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: "bold",
  },
  benefitSub: {
    fontSize: 11,
    color: "#9CA3AF",
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
    fontSize: 9,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  offerPrice: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  offerDetail: {
    color: "#A7F3D0",
    fontSize: 11,
  },
  mainBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  mainBtnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  formCard: {
    backgroundColor: "#1F2937",
    padding: 16,
    borderRadius: 20,
    gap: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#9CA3AF",
  },
  input: {
    backgroundColor: "#030712",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  confirmBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },
  confirmBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
