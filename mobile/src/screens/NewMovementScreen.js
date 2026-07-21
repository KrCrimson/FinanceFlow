import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, ScrollView, Alert, SafeAreaView } from 'react-native';
import { createMovimiento } from '../services/api';

const CATEGORIES = [
  'Freelance',
  'Comida',
  'Educación',
  'Entretenimiento',
  'Servicios',
  'Salario',
  'Sueldo',
  'Otros'
];

export default function NewMovementScreen({ onSaveSuccess, onNavigateBack }) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('ingreso'); // 'ingreso' o 'egreso' (minúsculas para FinanceFlow API)
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIES[0]);
  const [esRecurrente, setEsRecurrente] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    const numAmount = parseFloat(monto);
    if (!nombre.trim() || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Datos Inválidos', 'Por favor ingresa un nombre y un monto válido.');
      return;
    }

    try {
      setSubmitting(true);
      await createMovimiento({
        nombre: nombre.trim(),
        tipo,
        monto: numAmount,
        categoria,
        esRecurrente,
        descripcion: descripcion.trim(),
        fecha: new Date().toISOString() // Hoy por defecto
      });

      Alert.alert('¡Registrado!', 'El movimiento se ha guardado con éxito.');
      onSaveSuccess();
      onNavigateBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo guardar el movimiento.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={onNavigateBack}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Registrar Movimiento</Text>
        <TouchableOpacity style={styles.clearBtn} onPress={() => { setNombre(''); setMonto(''); setDescripcion(''); }}>
          <Text style={styles.clearBtnText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Placeholder OCR */}
        <View style={styles.ocrCard}>
          <Text style={styles.ocrText}>📷 Extraer datos de comprobante (OCR)</Text>
          <TouchableOpacity style={styles.ocrBtn}>
            <Text style={styles.ocrBtnText}>Seleccionar archivo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tipo de Movimiento</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeBtn, tipo === 'ingreso' && styles.typeBtnActiveIncome]}
              onPress={() => setTipo('ingreso')}
            >
              <Text style={styles.typeBtnText}>Ingreso</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, tipo === 'egreso' && styles.typeBtnActiveExpense]}
              onPress={() => setTipo('egreso')}
            >
              <Text style={styles.typeBtnText}>Egreso</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Monto (S/)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={monto}
            onChangeText={setMonto}
          />

          <Text style={styles.label}>Nombre del Movimiento</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Pago de alquiler"
            placeholderTextColor="#9CA3AF"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Categoría</Text>
          <View style={styles.catGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBadge, categoria === cat && styles.catBadgeActive]}
                onPress={() => setCategoria(cat)}
              >
                <Text style={[styles.catBadgeText, categoria === cat && styles.catBadgeTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Ingreso/Egreso Constante (Mensual)</Text>
            <Switch
              value={esRecurrente}
              onValueChange={setEsRecurrente}
              trackColor={{ false: '#D1D5DB', true: '#6EE7B7' }}
              thumbColor={esRecurrente ? '#34D399' : '#F3F4F6'}
            />
          </View>

          <Text style={styles.label}>Descripción (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalles adicionales del movimiento..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={submitting}>
            <Text style={styles.saveBtnText}>{submitting ? 'Guardando...' : 'Guardar Movimiento'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  navbar: {
    backgroundColor: '#6EE7B7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#A7F3D0'
  },
  backBtnText: { color: '#065F46', fontSize: 16, fontWeight: 'bold' },
  navbarTitle: { color: '#065F46', fontSize: 18, fontWeight: 'bold' },
  clearBtnText: { color: '#059669', fontSize: 14 },
  scrollContent: { padding: 16 },
  ocrCard: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  ocrText: { color: '#1E3A8A', fontWeight: '600', fontSize: 14, marginBottom: 10 },
  ocrBtn: { backgroundColor: '#6EE7B7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  ocrBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.02, elevation: 1 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#F9FAFB', color: '#1F2937', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  textArea: { height: 80, textAlignVertical: 'top' },
  typeSelector: { flexDirection: 'row', gap: 10, marginVertical: 6 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  typeBtnActiveIncome: { backgroundColor: '#10B981', borderColor: '#10B981' },
  typeBtnActiveExpense: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  typeBtnText: { color: '#1F2937', fontWeight: 'bold' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 6 },
  catBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  catBadgeActive: { backgroundColor: '#34D399', borderColor: '#34D399' },
  catBadgeText: { color: '#4B5563', fontSize: 13, fontWeight: '500' },
  catBadgeTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 14 },
  saveBtn: { backgroundColor: '#34D399', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
