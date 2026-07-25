import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CURRENCIES,
  getMobileCurrencySymbol,
  setMobileCurrencySymbol,
} from "../utils/currency";
import PaywallModal from "../components/PaywallModal";
import { toggleDevPlan } from "../services/api";

export default function ProfileScreen({
  user,
  onLogout,
  isDarkMode,
  onCurrencyChange,
}) {
  const [nombre, setNombre] = useState(user?.nombre || "sebastian");
  const [email, setEmail] = useState(
    user?.email || "sebastianarce2010@gmail.com",
  );
  const [moneda, setMoneda] = useState(getMobileCurrencySymbol());
  const [saving, setSaving] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showNovedades, setShowNovedades] = useState(false);

  const handleReset = () => {
    setNombre(user?.nombre || "sebastian");
    setEmail(user?.email || "sebastianarce2010@gmail.com");
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        "¡Perfil Actualizado!",
        "Tu información personal ha sido guardada con éxito.",
      );
    }, 500);
  };

  const handleCurrencySelect = (item) => {
    setMoneda(item.symbol);
    setMobileCurrencySymbol(item.symbol);
    if (onCurrencyChange) {
      onCurrencyChange(item.symbol);
    }
    Alert.alert(
      "🔤 Moneda Principal Cambiada",
      `La moneda principal ahora es ${item.name}`,
    );
  };

  const handleLogoutConfirm = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir de tu cuenta de forma segura?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar Sesión", style: "destructive", onPress: onLogout },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "⚠️ Eliminar Cuenta",
      "¿Estás completamente seguro? Esta acción eliminará permanentemente tu cuenta y todos tus movimientos.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, Eliminar", style: "destructive", onPress: onLogout },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6EE7B7"
        translucent
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerBox}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Mi Perfil</Text>
              <Text style={styles.headerSub}>
                Gestiona tu información personal
              </Text>
            </View>
          </View>
        </View>

        {/* Sección: Información Personal */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Información Personal</Text>

          <Text style={styles.label}>👤 Nombre Completo</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre completo"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>✉️ Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="tu@correo.com"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>🔤 Moneda de la Cuenta</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 6 }}
          >
            <View style={{ flexDirection: "row", gap: 6, paddingVertical: 4 }}>
              {CURRENCIES.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  onPress={() => handleCurrencySelect(c)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    backgroundColor:
                      moneda === c.symbol ? "#10B981" : "#F3F4F6",
                    borderColor: moneda === c.symbol ? "#10B981" : "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: moneda === c.symbol ? "#FFFFFF" : "#374151",
                    }}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.label}>📅 Miembro desde</Text>
          <View style={styles.disabledInput}>
            <Text style={styles.disabledInputText}>
              18 de diciembre de 2025
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.resetBtnText}>🔄 Restablecer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>
                {saving ? "Guardando..." : "💾 Guardar Cambios"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sección: Estadísticas de Cuenta */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>📊 Estadísticas de Cuenta</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>👤</Text>
              <Text style={styles.statLabel}>Estado</Text>
              <Text style={[styles.statValue, { color: "#10B981" }]}>
                Activo
              </Text>
            </View>

            <View
              style={[
                styles.statBox,
                { borderColor: "#059669", backgroundColor: "#ECFDF5" },
              ]}
            >
              <Text style={styles.statIcon}>🔒</Text>
              <Text style={[styles.statLabel, { color: "#047857" }]}>
                Seguridad
              </Text>
              <Text style={[styles.statValue, { color: "#059669" }]}>
                Protegido
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statIcon}>💳</Text>
              <Text style={styles.statLabel}>Tipo</Text>
              <Text style={[styles.statValue, { color: "#8B5CF6" }]}>
                Usuario
              </Text>
            </View>
          </View>
        </View>

        {/* Sección: Planes y Suscripción Pro */}
        <View
          style={[
            styles.card,
            { backgroundColor: "#064E3B", borderColor: "#10B981" },
          ]}
        >
          <Text style={[styles.cardSectionTitle, { color: "#FFFFFF" }]}>
            👑 Suscripción FinanceFlow Pro
          </Text>
          <Text
            style={{
              color: "#A7F3D0",
              fontSize: 12,
              marginBottom: 12,
              lineHeight: 16,
            }}
          >
            Accede a escaneo ilimitado de comprobantes, exportaciones contables
            en Web, carreras de metas ilimitadas y soporte prioritario.
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#F59E0B",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 8,
            }}
            onPress={() => setShowPaywall(true)}
            activeOpacity={0.8}
          >
            <Text
              style={{ color: "#111827", fontWeight: "bold", fontSize: 14 }}
            >
              ⭐ Actualizar a Pro (S/ 19.90)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sección: Modo Desarrollador (Dev Controls) & Novedades */}
        <View
          style={[
            styles.card,
            { backgroundColor: "#111827", borderColor: "#10B981" },
          ]}
        >
          <Text style={[styles.cardSectionTitle, { color: "#F59E0B" }]}>
            🛠️ Modo Desarrollador & Novedades
          </Text>
          <Text style={{ color: "#9CA3AF", fontSize: 11, marginBottom: 10 }}>
            Cambia el plan de tu cuenta al instante o consulta las últimas
            novedades del sistema.
          </Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#F59E0B",
                paddingVertical: 10,
                borderRadius: 12,
                alignItems: "center",
              }}
              onPress={async () => {
                try {
                  const res = await toggleDevPlan(email);
                  Alert.alert("Modo Dev", res.message || "Plan actualizado");
                } catch (e) {
                  Alert.alert("Error", "No se pudo alternar el modo dev");
                }
              }}
            >
              <Text
                style={{ color: "#111827", fontWeight: "bold", fontSize: 12 }}
              >
                ⚡ Alternar Plan Dev
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#10B981",
                paddingVertical: 10,
                borderRadius: 12,
                alignItems: "center",
              }}
              onPress={() => setShowNovedades(true)}
            >
              <Text
                style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 12 }}
              >
                📢 Ver Novedades
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sección: Exportación Contable (Exclusiva de Web) */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>
            📥 Exportación de Reportes (PDF / Excel)
          </Text>
          <Text
            style={{
              color: "#6B7280",
              fontSize: 12,
              marginBottom: 12,
              lineHeight: 16,
            }}
          >
            Genera documentos contables oficiales de tus ingresos y egresos para
            declaración o control de caja.
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#EEF2FF",
              borderColor: "#C7D2FE",
              borderWidth: 1,
              paddingVertical: 12,
              paddingHorizontal: 14,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
            onPress={() => {
              Alert.alert(
                "🌐 Exportación Exclusiva de la Web",
                "La generación e impresión de reportes contables en formatos PDF y Microsoft Excel es una función ejecutiva disponible ingresando desde tu navegador web en:\n\nhttps://financeflow-swart.vercel.app\n\n¡Ingresa desde tu computadora para descargar tus archivos!",
                [{ text: "Entendido", style: "default" }],
              );
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{ color: "#4338CA", fontWeight: "bold", fontSize: 13 }}
            >
              📄 Descargar PDF / Excel (Instrucciones)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sección: Configuración de Cuenta */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>
            ⚙️ Configuración de Cuenta
          </Text>

          {/* Toggle Modo Tutorial */}
          <View
            style={[
              styles.actionBoxWarning,
              {
                backgroundColor: "#F0FDF4",
                borderColor: "#BBF7D0",
                marginBottom: 12,
              },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.actionTitleWarning, { color: "#166534" }]}>
                💡 Guía de Tutorial Automática
              </Text>
              <Text style={[styles.actionSubWarning, { color: "#15803D" }]}>
                Muestra el tutorial explicativo al iniciar la app
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtnWarning, { backgroundColor: "#22C55E" }]}
              onPress={() =>
                Alert.alert(
                  "⚙️ Ajuste de Tutorial",
                  "Puedes activar o ver el tutorial en cualquier momento desde el botón 💡 Tutorial del inicio.",
                )
              }
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnTextWarning}>Configurado</Text>
            </TouchableOpacity>
          </View>

          {/* Cerrar Sesión Box */}
          <View style={styles.actionBoxWarning}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.actionTitleWarning}>🔒 Cerrar Sesión</Text>
              <Text style={styles.actionSubWarning}>
                Salir de tu cuenta de forma segura
              </Text>
            </View>
            <TouchableOpacity
              style={styles.actionBtnWarning}
              onPress={handleLogoutConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnTextWarning}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Eliminar Cuenta Box */}
          <View style={styles.actionBoxDanger}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.actionTitleDanger}>🗑️ Eliminar Cuenta</Text>
              <Text style={styles.actionSubDanger}>
                Eliminar permanentemente tu cuenta y todos los datos
              </Text>
            </View>
            <TouchableOpacity
              style={styles.actionBtnDanger}
              onPress={handleDeleteAccount}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnTextDanger}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal Paywall Pro Yape / BCP */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        isDarkMode={isDarkMode}
        userEmail={user?.email}
      />

      {/* Modal de Novedades del Sistema */}
      <Modal
        visible={showNovedades}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNovedades(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.85)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#111827",
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: "#374151",
              gap: 14,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFF" }}>
                📢 Novedades v2.5.0
              </Text>
              <TouchableOpacity
                onPress={() => setShowNovedades(false)}
                style={{
                  backgroundColor: "#374151",
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              <View
                style={{
                  backgroundColor: "#1F2937",
                  padding: 12,
                  borderRadius: 14,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: "#10B981",
                    marginBottom: 2,
                  }}
                >
                  💳 Pasarela Vercel Checkout & QR Yape con Monto
                </Text>
                <Text style={{ fontSize: 11, color: "#D1D5DB" }}>
                  Detección de país automática y QR de Yape con monto precargado
                  de S/ 19.90.
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#1F2937",
                  padding: 12,
                  borderRadius: 14,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: "#3B82F6",
                    marginBottom: 2,
                  }}
                >
                  📸 Escaneo OCR de Comprobantes con IA
                </Text>
                <Text style={{ fontSize: 11, color: "#D1D5DB" }}>
                  Reconocimiento instantáneo de fechas, categorías y montos en
                  fotos de facturas y boletas.
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#1F2937",
                  padding: 12,
                  borderRadius: 14,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: "#8B5CF6",
                    marginBottom: 2,
                  }}
                >
                  🛠️ Modo Desarrollador
                </Text>
                <Text style={{ fontSize: 11, color: "#D1D5DB" }}>
                  Alterna tu cuenta entre Free y Pro con 1 solo clic desde tu
                  Perfil para hacer pruebas de desarrollo.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={{
                backgroundColor: "#10B981",
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
              }}
              onPress={() => setShowNovedades(false)}
            >
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 14 }}>
                ¡Entendido!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0FDF4" },
  scrollContent: { padding: 16, paddingBottom: 60 },
  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarIcon: { fontSize: 22 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  headerSub: { fontSize: 12, color: "#6B7280" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    color: "#1F2937",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  disabledInput: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  disabledInputText: { color: "#6B7280", fontSize: 14 },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  resetBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  resetBtnText: { color: "#374151", fontWeight: "bold", fontSize: 13 },
  saveBtn: {
    flex: 1.2,
    backgroundColor: "#6EE7B7",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtnText: { color: "#065F46", fontWeight: "bold", fontSize: 13 },
  statsGrid: { flexDirection: "row", gap: 8 },
  statBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statLabel: { fontSize: 11, color: "#6B7280", fontWeight: "600" },
  statValue: { fontSize: 13, fontWeight: "bold", marginTop: 2 },
  actionBoxWarning: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionTitleWarning: { fontSize: 14, fontWeight: "bold", color: "#B45309" },
  actionSubWarning: { fontSize: 11, color: "#D97706", marginTop: 2 },
  actionBtnWarning: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnTextWarning: { color: "#FFFFFF", fontSize: 12, fontWeight: "bold" },
  actionBoxDanger: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionTitleDanger: { fontSize: 14, fontWeight: "bold", color: "#B91C1C" },
  actionSubDanger: { fontSize: 11, color: "#DC2626", marginTop: 2 },
  actionBtnDanger: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnTextDanger: { color: "#FFFFFF", fontSize: 12, fontWeight: "bold" },
});
