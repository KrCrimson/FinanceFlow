import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  createMovimiento,
  fetchMovimientos,
  analyzeReceiptWithOCR,
} from "../services/api";
import { getMobileCurrencySymbol } from "../utils/currency";

const DEFAULT_CATEGORIES = {
  ingreso: [
    "Sueldo",
    "Ventas",
    "Freelance",
    "Préstamo",
    "Cobro de préstamo",
    "Otros",
  ],
  egreso: [
    "Comida",
    "Servicios",
    "Entretenimiento",
    "Educación",
    "Transporte",
    "Vivienda",
    "Salud",
    "Otros",
  ],
};

export default function NewMovementScreen({
  onSaveSuccess,
  onNavigateBack,
  isDarkMode,
}) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("ingreso");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState(DEFAULT_CATEGORIES.ingreso[0]);
  const [categoriaPersonalizada, setCategoriaPersonalizada] = useState("");
  const [esRecurrente, setEsRecurrente] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [analyzingOcr, setAnalyzingOcr] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  const [categoriasDinamicas, setCategoriasDinamicas] =
    useState(DEFAULT_CATEGORIES);

  const generateLast30Days = () => {
    const list = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      list.push(d);
    }
    return list;
  };
  const last30Days = generateLast30Days();

  useEffect(() => {
    // Cargar historial de movimientos para añadir las categorías personalizadas del usuario
    const loadUserCategories = async () => {
      try {
        const movs = await fetchMovimientos();
        if (!movs || !Array.isArray(movs)) return;

        const customIngreso = new Set(
          DEFAULT_CATEGORIES.ingreso.filter((c) => c !== "Otros"),
        );
        const customEgreso = new Set(
          DEFAULT_CATEGORIES.egreso.filter((c) => c !== "Otros"),
        );

        movs.forEach((m) => {
          if (!m.categoria || m.categoria === "Otros") return;
          if (m.tipo === "ingreso") {
            customIngreso.add(m.categoria);
          } else if (m.tipo === "egreso") {
            customEgreso.add(m.categoria);
          }
        });

        setCategoriasDinamicas({
          ingreso: [...Array.from(customIngreso), "Otros"],
          egreso: [...Array.from(customEgreso), "Otros"],
        });
      } catch (err) {
        console.log("Error cargando categorías personalizadas:", err);
      }
    };

    loadUserCategories();
  }, []);

  const handleTipoChange = (newTipo) => {
    setTipo(newTipo);
    const available =
      categoriasDinamicas[newTipo] || DEFAULT_CATEGORIES[newTipo];
    setCategoria(available[0]);
    setCategoriaPersonalizada("");
  };

  const handlePickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permiso requerido",
          "Se requiere acceso a la galería para escanear comprobantes.",
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions
          ? ImagePicker.MediaTypeOptions.Images
          : "images",
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (
        pickerResult.canceled ||
        !pickerResult.assets ||
        !pickerResult.assets[0]
      ) {
        return;
      }

      const asset = pickerResult.assets[0];
      setAnalyzingOcr(true);

      const res = await analyzeReceiptWithOCR(
        asset.base64,
        asset.mimeType || "image/jpeg",
      );

      if (res.success && res.data) {
        const data = res.data;
        if (data.nombre) setNombre(data.nombre);
        if (data.monto) setMonto(data.monto.toString());
        if (data.tipo) {
          const detectedTipo =
            data.tipo.toLowerCase() === "ingreso" ? "ingreso" : "egreso";
          setTipo(detectedTipo);
        }
        if (data.categoria) {
          const catList =
            categoriasDinamicas[data.tipo] ||
            DEFAULT_CATEGORIES[data.tipo] ||
            [];
          const match = catList.find(
            (c) => c.toLowerCase() === data.categoria.toLowerCase(),
          );
          if (match) {
            setCategoria(match);
          } else {
            setCategoria("Otros");
            setCategoriaPersonalizada(data.categoria);
          }
        }
        Alert.alert(
          "✨ ¡Datos Extraídos!",
          `Comprobante analizado con éxito:\n\n• Concepto: ${data.nombre}\n• Monto: S/ ${data.monto}`,
        );
      } else {
        Alert.alert(
          "OCR",
          "No se pudieron extraer datos claros del comprobante.",
        );
      }
    } catch (err) {
      Alert.alert("Error OCR", err.message || "Error al analizar la imagen.");
    } finally {
      setAnalyzingOcr(false);
    }
  };

  const handleSave = async () => {
    const numAmount = parseFloat(monto);
    let finalCategoria = categoria;
    if (categoria === "Otros" && categoriaPersonalizada.trim()) {
      finalCategoria = categoriaPersonalizada.trim();
    }

    if (
      !nombre.trim() ||
      isNaN(numAmount) ||
      numAmount <= 0 ||
      !finalCategoria
    ) {
      Alert.alert(
        "Datos Inválidos",
        "Por favor completa todos los campos requeridos correctamente.",
      );
      return;
    }

    try {
      setSubmitting(true);
      await createMovimiento({
        nombre: nombre.trim(),
        tipo,
        monto: numAmount,
        categoria: finalCategoria,
        esRecurrente: tipo === "ingreso" ? esRecurrente : false,
        descripcion: descripcion.trim(),
        fecha: fecha.toISOString(),
      });

      Alert.alert("¡Registrado!", "El movimiento se ha guardado con éxito.");
      onSaveSuccess();
      onNavigateBack();
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo guardar el movimiento.");
    } finally {
      setSubmitting(false);
    }
  };

  const theme = isDarkMode ? darkStyles : lightStyles;
  const currentCategories =
    categoriasDinamicas[tipo] || DEFAULT_CATEGORIES[tipo];

  return (
    <SafeAreaView style={theme.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#064E3B" : "#6EE7B7"}
        translucent
      />

      {/* Navbar secundario */}
      <View style={theme.navbar}>
        <TouchableOpacity
          onPress={onNavigateBack}
          activeOpacity={0.7}
          style={theme.navActionBtn}
        >
          <Text style={theme.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={theme.navbarTitle} numberOfLines={1}>
          Registrar Movimiento
        </Text>
        <TouchableOpacity
          style={theme.navActionBtn}
          onPress={() => {
            setNombre("");
            setMonto("");
            setDescripcion("");
            setCategoriaPersonalizada("");
            setFecha(new Date());
          }}
          activeOpacity={0.7}
        >
          <Text style={theme.clearBtnText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={theme.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card OCR Inteligente con Gemini Vision */}
        <View style={theme.ocrCard}>
          <Text style={theme.ocrText}>
            📷 Extraer datos de comprobante (OCR)
          </Text>
          {analyzingOcr ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              <ActivityIndicator color="#34D399" />
              <Text
                style={{ color: "#34D399", fontWeight: "bold", fontSize: 13 }}
              >
                Analizando comprobante con Gemini Vision...
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={theme.ocrBtn}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              <Text style={theme.ocrBtnText}>Seleccionar archivo / foto</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={theme.card}>
          <Text style={theme.label}>Tipo de Movimiento</Text>
          <View style={theme.typeSelector}>
            <TouchableOpacity
              style={[
                theme.typeBtn,
                tipo === "ingreso" && theme.typeBtnActiveIncome,
              ]}
              onPress={() => handleTipoChange("ingreso")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  theme.typeBtnText,
                  tipo === "ingreso" && { color: "#FFFFFF" },
                ]}
              >
                💰 Ingreso
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                theme.typeBtn,
                tipo === "egreso" && theme.typeBtnActiveExpense,
              ]}
              onPress={() => handleTipoChange("egreso")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  theme.typeBtnText,
                  tipo === "egreso" && { color: "#FFFFFF" },
                ]}
              >
                💸 Egreso
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={theme.label}>Monto ({getMobileCurrencySymbol()})</Text>
          <TextInput
            style={theme.input}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={monto}
            onChangeText={setMonto}
          />

          <Text style={theme.label}>Nombre del Movimiento</Text>
          <TextInput
            style={theme.input}
            placeholder="Ej: Pago de alquiler"
            placeholderTextColor="#9CA3AF"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={theme.label}>Categoría</Text>
          <View style={theme.catGrid}>
            {currentCategories.map((cat, idx) => (
              <TouchableOpacity
                key={`${cat}-${idx}`}
                style={[
                  theme.catBadge,
                  categoria === cat && theme.catBadgeActive,
                ]}
                onPress={() => {
                  setCategoria(cat);
                  if (cat !== "Otros") setCategoriaPersonalizada("");
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    theme.catBadgeText,
                    categoria === cat && theme.catBadgeTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Campo para Categoría Personalizada al seleccionar 'Otros' */}
          {categoria === "Otros" && (
            <View style={{ marginTop: 10 }}>
              <TextInput
                style={[
                  theme.input,
                  {
                    borderColor: "#3B82F6",
                    backgroundColor: isDarkMode ? "#1E293B" : "#EFF6FF",
                  },
                ]}
                placeholder="Escriba su categoría personalizada"
                placeholderTextColor="#9CA3AF"
                value={categoriaPersonalizada}
                onChangeText={setCategoriaPersonalizada}
              />
              <Text
                style={{
                  fontSize: 11,
                  color: "#3B82F6",
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                💡 Esta categoría se guardará para futuros usos
              </Text>
            </View>
          )}

          <Text style={theme.label}>
            Fecha del Movimiento (Máx. 1 mes atrás)
          </Text>
          <TouchableOpacity
            style={[theme.input, { justifyContent: "center" }]}
            onPress={() => setShowDatePickerModal(true)}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: isDarkMode ? "#FFFFFF" : "#1F2937",
                fontWeight: "bold",
              }}
            >
              📅{" "}
              {fecha.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </TouchableOpacity>

          {tipo === "ingreso" && (
            <View style={theme.switchRow}>
              <Text style={theme.switchLabel}>Ingreso Constante (Mensual)</Text>
              <Switch
                value={esRecurrente}
                onValueChange={setEsRecurrente}
                trackColor={{ false: "#D1D5DB", true: "#6EE7B7" }}
                thumbColor={esRecurrente ? "#34D399" : "#F3F4F6"}
              />
            </View>
          )}

          <Text style={theme.label}>Descripción (Opcional)</Text>
          <TextInput
            style={[theme.input, theme.textArea]}
            placeholder="Detalles adicionales del movimiento..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <TouchableOpacity
            style={theme.saveBtn}
            onPress={handleSave}
            disabled={submitting}
            activeOpacity={0.8}
          >
            <Text style={theme.saveBtnText}>
              {submitting ? "Guardando..." : "💾 Guardar Movimiento"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal Selector de Fecha */}
        <Modal visible={showDatePickerModal} transparent animationType="slide">
          <View style={theme.modalOverlay}>
            <View style={[theme.modalContent, { maxHeight: "80%" }]}>
              <Text style={theme.modalTitle}>📅 Seleccionar Fecha</Text>
              <ScrollView
                style={{ width: "100%", marginVertical: 10 }}
                showsVerticalScrollIndicator={false}
              >
                {last30Days.map((d, index) => {
                  const label =
                    index === 0
                      ? "Hoy"
                      : index === 1
                        ? "Ayer"
                        : d.toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                          });
                  const isSelected = d.toDateString() === fecha.toDateString();
                  return (
                    <TouchableOpacity
                      key={d.toISOString()}
                      style={[
                        theme.monthOption,
                        isSelected && theme.monthOptionActive,
                      ]}
                      onPress={() => {
                        setFecha(d);
                        setShowDatePickerModal(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          theme.monthOptionText,
                          isSelected && theme.monthOptionTextActive,
                        ]}
                      >
                        {label} ({d.toLocaleDateString()})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                style={theme.modalCloseBtn}
                onPress={() => setShowDatePickerModal(false)}
              >
                <Text style={theme.modalCloseBtnText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const baseStyles = {
  scrollContent: { padding: 16, paddingBottom: 60 },
  navActionBtn: { paddingVertical: 4 },
  ocrCard: {
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  ocrText: { fontWeight: "600", fontSize: 13, marginBottom: 8 },
  ocrBtn: {
    backgroundColor: "#34D399",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ocrBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 12 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
  label: { fontSize: 13, fontWeight: "bold", marginBottom: 6, marginTop: 10 },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
    borderWidth: 1,
  },
  textArea: { height: 70, textAlignVertical: "top" },
  typeSelector: { flexDirection: "row", gap: 10, marginVertical: 4 },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  typeBtnActiveIncome: { backgroundColor: "#10B981", borderColor: "#10B981" },
  typeBtnActiveExpense: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  typeBtnText: { fontWeight: "bold", fontSize: 14 },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginVertical: 4,
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  catBadgeActive: { backgroundColor: "#34D399", borderColor: "#34D399" },
  catBadgeText: { fontSize: 12, fontWeight: "500" },
  catBadgeTextActive: { color: "#FFFFFF", fontWeight: "bold" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  switchLabel: { fontSize: 13, fontWeight: "bold", flex: 1, marginRight: 8 },
  saveBtn: {
    backgroundColor: "#34D399",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: { flex: 1, backgroundColor: "#F0FDF4" },
  navbar: {
    backgroundColor: "#6EE7B7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#A7F3D0",
  },
  backBtnText: { color: "#065F46", fontSize: 14, fontWeight: "bold" },
  navbarTitle: {
    color: "#065F46",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  clearBtnText: { color: "#059669", fontSize: 13, fontWeight: "600" },
  ocrCard: {
    ...baseStyles.ocrCard,
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  ocrText: { ...baseStyles.ocrText, color: "#1E3A8A" },
  card: {
    ...baseStyles.card,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },
  label: { ...baseStyles.label, color: "#374151" },
  input: {
    ...baseStyles.input,
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    color: "#1F2937",
  },
  typeBtn: {
    ...baseStyles.typeBtn,
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  typeBtnText: { ...baseStyles.typeBtnText, color: "#1F2937" },
  catBadge: {
    ...baseStyles.catBadge,
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  catBadgeText: { ...baseStyles.catBadgeText, color: "#4B5563" },
  switchLabel: { ...baseStyles.switchLabel, color: "#374151" },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: { flex: 1, backgroundColor: "#111827" },
  navbar: {
    backgroundColor: "#064E3B",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#047857",
  },
  backBtnText: { color: "#A7F3D0", fontSize: 14, fontWeight: "bold" },
  navbarTitle: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  clearBtnText: { color: "#34D399", fontSize: 13, fontWeight: "600" },
  ocrCard: {
    ...baseStyles.ocrCard,
    backgroundColor: "#1E293B",
    borderColor: "#3B82F6",
  },
  ocrText: { ...baseStyles.ocrText, color: "#60A5FA" },
  card: {
    ...baseStyles.card,
    backgroundColor: "#1F2937",
    borderColor: "#374151",
  },
  label: { ...baseStyles.label, color: "#F9FAFB" },
  input: {
    ...baseStyles.input,
    backgroundColor: "#111827",
    borderColor: "#4B5563",
    color: "#F9FAFB",
  },
  typeBtn: {
    ...baseStyles.typeBtn,
    backgroundColor: "#111827",
    borderColor: "#374151",
  },
  typeBtnText: { ...baseStyles.typeBtnText, color: "#F9FAFB" },
  catBadge: {
    ...baseStyles.catBadge,
    backgroundColor: "#111827",
    borderColor: "#374151",
  },
  catBadgeText: { ...baseStyles.catBadgeText, color: "#D1D5DB" },
  switchLabel: { ...baseStyles.switchLabel, color: "#F9FAFB" },
});
