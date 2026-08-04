import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  fetchRecordatorios,
  createRecordatorio,
  updateRecordatorio,
  deleteRecordatorio,
} from "../services/api";

export default function RemindersScreen({ user, isDarkMode, currency = "S/" }) {
  const [recordatorios, setRecordatorios] = useState([]);
  const [filtro, setFiltro] = useState("todos"); // 'todos' | 'recibidos' | 'otorgados' | 'pagos'
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [tipo, setTipo] = useState("pago_pendiente");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [contacto, setContacto] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await fetchRecordatorios();
      setRecordatorios(data);
    } catch (err) {
      Alert.alert("Error", "No se pudieron cargar los recordatorios.");
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async () => {
    if (!descripcion.trim() || !monto || !fechaVencimiento) {
      Alert.alert("Campos requeridos", "Por favor ingresa la descripción, el monto y el vencimiento.");
      return;
    }

    try {
      const nuevo = await createRecordatorio({
        tipo,
        descripcion: descripcion.trim(),
        monto: Number(monto),
        fechaVencimiento,
        contacto: contacto.trim(),
      });

      setRecordatorios([nuevo, ...recordatorios]);
      setDescripcion("");
      setMonto("");
      setFechaVencimiento("");
      setContacto("");
      setShowForm(false);
      Alert.alert("Éxito", "Recordatorio guardado correctamente.");
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo guardar el recordatorio.");
    }
  };

  const handleToggleEstado = async (item) => {
    try {
      const nuevoEstado = item.estado === "pendiente" ? "pagado" : "pendiente";
      const actualizado = await updateRecordatorio(item._id, { estado: nuevoEstado });
      setRecordatorios(recordatorios.map((r) => (r._id === item._id ? actualizado : r)));
    } catch (err) {
      Alert.alert("Error", "No se pudo actualizar el estado.");
    }
  };

  const handleEliminar = async (id) => {
    Alert.alert(
      "Eliminar Recordatorio",
      "¿Seguro que deseas eliminar este recordatorio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecordatorio(id);
              setRecordatorios(recordatorios.filter((r) => r._id !== id));
            } catch (err) {
              Alert.alert("Error", "No se pudo eliminar.");
            }
          },
        },
      ]
    );
  };

  // Filter lists
  const filtrados = recordatorios.filter((item) => {
    if (filtro === "todos") return true;
    if (filtro === "recibidos") return item.tipo === "prestamo_recibido";
    if (filtro === "otorgados") return item.tipo === "prestamo_otorgado";
    if (filtro === "pagos") return item.tipo === "pago_pendiente";
    return true;
  });

  // Calculate totals
  const totalMePrestaron = recordatorios
    .filter((r) => r.tipo === "prestamo_recibido" && r.estado === "pendiente")
    .reduce((sum, r) => sum + r.monto, 0);

  const totalPreste = recordatorios
    .filter((r) => r.tipo === "prestamo_otorgado" && r.estado === "pendiente")
    .reduce((sum, r) => sum + r.monto, 0);

  const totalCuentas = recordatorios
    .filter((r) => r.tipo === "pago_pendiente" && r.estado === "pendiente")
    .reduce((sum, r) => sum + r.monto, 0);

  // Status visual check
  const getItemStatus = (item) => {
    if (item.estado === "pagado") return { text: "Pagado", color: "#10B981" };
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vcto = new Date(item.fechaVencimiento);
    vcto.setHours(0, 0, 0, 0);

    if (vcto < hoy) return { text: "Vencido", color: "#EF4444" };
    
    const diffDays = Math.ceil((vcto - hoy) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) return { text: `Vence en ${diffDays}d`, color: "#F59E0B" };

    return { text: "Pendiente", color: "#3B82F6" };
  };

  const themeBg = isDarkMode ? "#111827" : "#F3F4F6";
  const themeCard = isDarkMode ? "#1F2937" : "#FFFFFF";
  const themeText = isDarkMode ? "#FFFFFF" : "#111827";
  const themeTextSec = isDarkMode ? "#9CA3AF" : "#4B5563";
  const themeInput = isDarkMode ? "#111827" : "#F3F4F6";
  const themeBorder = isDarkMode ? "#374151" : "#E5E7EB";

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeBg }]} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeText }]}>🔔 Recordatorios y Préstamos</Text>
        <Text style={[styles.subtitle, { color: themeTextSec }]}>
          Controla tus deudas y cuentas por vencer desde el celular.
        </Text>
      </View>

      {/* Resumen Cards */}
      <View style={styles.summaryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: "row" }}>
          <View style={[styles.summaryCard, { backgroundColor: themeCard, borderColor: themeBorder }]}>
            <Text style={[styles.summaryTitle, { color: themeTextSec }]}>Me prestaron</Text>
            <Text style={[styles.summaryValue, { color: "#F87171" }]}>{currency} {totalMePrestaron.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: themeCard, borderColor: themeBorder }]}>
            <Text style={[styles.summaryTitle, { color: themeTextSec }]}>Presté</Text>
            <Text style={[styles.summaryValue, { color: "#34D399" }]}>{currency} {totalPreste.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: themeCard, borderColor: themeBorder }]}>
            <Text style={[styles.summaryTitle, { color: themeTextSec }]}>Cuentas</Text>
            <Text style={[styles.summaryValue, { color: "#FBBF24" }]}>{currency} {totalCuentas.toFixed(2)}</Text>
          </View>
        </ScrollView>
      </View>

      {/* Button to Show/Hide Form */}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: showForm ? "#EF4444" : "#10B981" }]}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={styles.addBtnText}>{showForm ? "✕ Cerrar Formulario" : "➕ Agregar Compromiso"}</Text>
      </TouchableOpacity>

      {/* Form Section */}
      {showForm && (
        <View style={[styles.formContainer, { backgroundColor: themeCard, borderColor: themeBorder }]}>
          <Text style={[styles.formTitle, { color: themeText }]}>Nuevo Recordatorio</Text>

          <Text style={[styles.label, { color: themeTextSec }]}>Tipo</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[styles.pickerOpt, tipo === "pago_pendiente" && styles.pickerOptActive]}
              onPress={() => setTipo("pago_pendiente")}
            >
              <Text style={[styles.pickerOptText, tipo === "pago_pendiente" && styles.pickerOptTextActive]}>Cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOpt, tipo === "prestamo_recibido" && styles.pickerOptActive]}
              onPress={() => setTipo("prestamo_recibido")}
            >
              <Text style={[styles.pickerOptText, tipo === "prestamo_recibido" && styles.pickerOptTextActive]}>Me prestaron</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOpt, tipo === "prestamo_otorgado" && styles.pickerOptActive]}
              onPress={() => setTipo("prestamo_otorgado")}
            >
              <Text style={[styles.pickerOptText, tipo === "prestamo_otorgado" && styles.pickerOptTextActive]}>Presté</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: themeTextSec }]}>Descripción</Text>
          <TextInput
            placeholder="Ej. Pago de arriendo, Préstamo de Juan"
            placeholderTextColor="#6B7280"
            value={descripcion}
            onChangeText={setDescripcion}
            style={[styles.input, { backgroundColor: themeInput, color: themeText, borderColor: themeBorder }]}
          />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: themeTextSec }]}>Monto ({currency})</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={monto}
                onChangeText={setMonto}
                style={[styles.input, { backgroundColor: themeInput, color: themeText, borderColor: themeBorder }]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: themeTextSec }]}>Fecha Vcto (AAAA-MM-DD)</Text>
              <TextInput
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#6B7280"
                value={fechaVencimiento}
                onChangeText={setFechaVencimiento}
                style={[styles.input, { backgroundColor: themeInput, color: themeText, borderColor: themeBorder }]}
              />
            </View>
          </View>

          <Text style={[styles.label, { color: themeTextSec }]}>Contacto / Persona</Text>
          <TextInput
            placeholder="Nombre de la persona (opcional)"
            placeholderTextColor="#6B7280"
            value={contacto}
            onChangeText={setContacto}
            style={[styles.input, { backgroundColor: themeInput, color: themeText, borderColor: themeBorder }]}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleCrear}>
            <Text style={styles.submitBtnText}>💾 Guardar Recordatorio</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {["todos", "recibidos", "otorgados", "pagos"].map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => setFiltro(opt)}
            style={[
              styles.tab,
              { backgroundColor: themeCard, borderColor: themeBorder },
              filtro === opt && { backgroundColor: "#10B981" },
            ]}
          >
            <Text style={[styles.tabText, { color: filtro === opt ? "#FFFFFF" : themeTextSec }]}>
              {opt === "todos" && "Todos"}
              {opt === "recibidos" && "Debo"}
              {opt === "otorgados" && "Me deben"}
              {opt === "pagos" && "Servicios"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List content */}
      {loading ? (
        <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 20 }} />
      ) : filtrados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>🎉</Text>
          <Text style={[styles.emptyText, { color: themeTextSec }]}>No tienes recordatorios en esta lista.</Text>
        </View>
      ) : (
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {filtrados.map((item) => {
            const status = getItemStatus(item);
            return (
              <View key={item._id} style={[styles.itemCard, { backgroundColor: themeCard, borderColor: themeBorder }]}>
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <View style={[styles.statusBadge, { backgroundColor: status.color + "20" }]}>
                      <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
                    </View>
                    <Text style={{ fontSize: 10, color: themeTextSec, fontWeight: "bold" }}>
                      {item.tipo === "pago_pendiente" && "💵 SERVICIO"}
                      {item.tipo === "prestamo_recibido" && "🔴 DEUDA"}
                      {item.tipo === "prestamo_otorgado" && "🟢 COBRO"}
                    </Text>
                  </View>
                  <Text style={[styles.itemTitle, { color: themeText }]}>{item.descripcion}</Text>
                  <Text style={{ fontSize: 11, color: themeTextSec }}>
                    {item.contacto ? `👤 ${item.contacto}  ` : ""}
                    📅 Vence: {new Date(item.fechaVencimiento).toLocaleDateString()}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end", gap: 8 }}>
                  <Text style={[styles.itemAmount, { color: themeText }]}>{currency} {item.monto.toFixed(2)}</Text>
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    <TouchableOpacity
                      onPress={() => handleToggleEstado(item)}
                      style={[styles.actionBtn, { backgroundColor: item.estado === "pagado" ? "#4B5563" : "#059669" }]}
                    >
                      <Text style={styles.actionBtnText}>{item.estado === "pagado" ? "↩️ Reabrir" : "✔️ Listo"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleEliminar(item._id)}
                      style={[styles.actionBtn, { backgroundColor: "#EF4444" }]}
                    >
                      <Text style={styles.actionBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, gap: 4 },
  title: { fontSize: 22, fontWeight: "900" },
  subtitle: { fontSize: 12 },
  summaryContainer: { paddingHorizontal: 16, marginVertical: 8 },
  summaryCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 10,
    minWidth: 120,
    gap: 4,
  },
  summaryTitle: { fontSize: 11, fontWeight: "bold", uppercase: true },
  summaryValue: { fontSize: 18, fontWeight: "900" },
  addBtn: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  addBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 12 },
  formContainer: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    marginBottom: 16,
  },
  formTitle: { fontSize: 15, fontWeight: "bold" },
  label: { fontSize: 11, fontWeight: "bold" },
  input: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 12,
  },
  pickerContainer: { flexDirection: "row", gap: 6 },
  pickerOpt: {
    flex: 1,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#10B981",
    alignItems: "center",
  },
  pickerOptActive: { backgroundColor: "#10B981" },
  pickerOptText: { fontSize: 10, fontWeight: "bold", color: "#10B981" },
  pickerOptTextActive: { color: "#FFFFFF" },
  submitBtn: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 12 },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 6,
    marginVertical: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  tabText: { fontSize: 10, fontWeight: "bold" },
  emptyContainer: { alignItems: "center", padding: 40 },
  emptyText: { fontSize: 12, fontWeight: "bold" },
  itemCard: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTitle: { fontSize: 13, fontWeight: "bold" },
  itemAmount: { fontSize: 16, fontWeight: "900" },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: { fontSize: 9, fontWeight: "bold" },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: { color: "#FFFFFF", fontSize: 10, fontWeight: "bold" },
});
