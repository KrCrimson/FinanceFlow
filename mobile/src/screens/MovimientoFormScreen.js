import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMovimientos } from '../hooks/useMovimientos';
import { useImageToMovimiento } from '../hooks/useImageToMovimiento';

export default function MovimientoFormScreen({ navigation }) {
  const { agregarMovimiento, movimientos } = useMovimientos();
  const { processImage, loadingOcr } = useImageToMovimiento();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo: 'egreso',
    monto: '',
    categoria: 'comida',
    nombre: ''
  });

  const categorias = {
    ingreso: ['salario', 'inversiones', 'regalos', 'otros'],
    egreso: ['comida', 'transporte', 'servicios', 'ocio', 'salud', 'educacion', 'otros']
  };

  const handleTipoChange = (tipo) => {
    setFormData({ 
      ...formData, 
      tipo, 
      categoria: tipo === 'ingreso' ? 'salario' : 'comida' 
    });
  };

  const handleSubmit = async () => {
    if (!formData.monto || !formData.nombre) {
      Alert.alert('Datos incompletos', 'Por favor ingresa un nombre y un monto válido.');
      return;
    }

    setLoading(true);
    try {
      await agregarMovimiento({
        ...formData,
        monto: parseFloat(formData.monto)
      });
      
      // FASE 5: "Aprendizaje Continuo" silencioso
      try {
        const nuevosMovimientos = [...movimientos, { ...formData, monto: parseFloat(formData.monto) }];
        const trainingData = nuevosMovimientos
          .filter(m => m.tipo === 'egreso' && m.categoria)
          .map(m => ({
            descripcion: m.descripcion ? `${m.nombre} ${m.descripcion}` : m.nombre,
            categoria: m.categoria
          }));
        
        if (trainingData.length > 5) {
          const ML_API_URL = process.env.EXPO_PUBLIC_ML_URL || 'https://financeflow-api-python.onrender.com';
          fetch(`${ML_API_URL}/retrain`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: trainingData })
          }).catch(err => console.warn('Background ML Sync Error:', err));
        }
      } catch(e) {
        console.warn('Silent ML Training failed:', e);
      }

      Alert.alert('¡Éxito!', 'Movimiento registrado correctamente');
      setFormData({ tipo: 'egreso', monto: '', categoria: 'comida', nombre: '' });
      
      // Volver al dashboard si estamos en navegación
      if (navigation) {
        navigation.navigate('Dashboard');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el movimiento. Revisa tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleEscanearRecibo = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('¡Atención!', 'No has dado permiso para acceder a la cámara.');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        // Obtener nombre del archivo y tipo desde la URI local
        const filename = imageUri.split('/').pop() || 'recibo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        const mlData = await processImage(imageUri, filename, type);
        
        // Si el ML de Python devolvió datos, autocompletamos el formulario simulando lo que hace el React de web
        if (mlData) {
          setFormData({
            tipo: mlData.tipo || 'egreso',
            monto: mlData.monto || '',
            categoria: categorias[mlData.tipo || 'egreso'].includes(mlData.categoria) ? mlData.categoria : 'otros',
            nombre: mlData.nombre || ''
          });
          Alert.alert('¡Escaneo exitoso!', 'Se han autocompletado los campos con IA.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al usar la cámara: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Nuevo Movimiento</Text>
        
        {/* Selector de Tipo */}
        <View style={styles.typeContainer}>
          <TouchableOpacity 
            style={[styles.typeButton, formData.tipo === 'ingreso' && styles.typeButtonIngreso]}
            onPress={() => handleTipoChange('ingreso')}
          >
            <Text style={[styles.typeText, formData.tipo === 'ingreso' && styles.typeTextActive]}>INGRESOS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.typeButton, formData.tipo === 'egreso' && styles.typeButtonEgreso]}
            onPress={() => handleTipoChange('egreso')}
          >
            <Text style={[styles.typeText, formData.tipo === 'egreso' && styles.typeTextActive]}>GASTOS</Text>
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre / Descripción</Text>
          <TextInput 
            style={styles.input}
            placeholder="Ej. Compra de supermercado"
            value={formData.nombre}
            onChangeText={(t) => setFormData({...formData, nombre: t})}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Monto (S/)</Text>
          <TextInput 
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={formData.monto}
            onChangeText={(t) => setFormData({...formData, monto: t})}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoriesContainer}>
            {categorias[formData.tipo].map((cat) => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.categoryBadge, formData.categoria === cat && styles.categoryBadgeActive]}
                onPress={() => setFormData({...formData, categoria: cat})}
              >
                <Text style={[styles.categoryText, formData.categoria === cat && styles.categoryTextActive]}>
                  {cat.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>GUARDAR MOVIMIENTO</Text>
          )}
        </TouchableOpacity>
        
        {/* Usar cámara con React Native e IA de Python (OCR) */}
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={handleEscanearRecibo}
          disabled={loadingOcr}
        >
          {loadingOcr ? (
             <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <ActivityIndicator color="#4B5563" />
                <Text style={styles.scanButtonText}>🤖 Analizando IA...</Text>
             </View>
          ) : (
            <Text style={styles.scanButtonText}>📸 Escanear Recibo (IA)</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3, marginBottom: 30 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 20, textAlign: 'center' },
  
  typeContainer: { flexDirection: 'row', marginBottom: 20, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  typeButton: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#F9FAFB' },
  typeButtonIngreso: { backgroundColor: '#10B981' },
  typeButtonEgreso: { backgroundColor: '#EF4444' },
  typeText: { fontWeight: 'bold', color: '#6B7280' },
  typeTextActive: { color: '#FFFFFF' },

  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#1F2937' },

  categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 8, marginBottom: 8 },
  categoryBadgeActive: { backgroundColor: '#3B82F6', borderColor: '#2563EB' },
  categoryText: { fontSize: 12, color: '#4B5563', fontWeight: '500' },
  categoryTextActive: { color: '#FFFFFF' },

  submitButton: { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  
  scanButton: { backgroundColor: '#F3F4F6', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 16, borderWidth: 1, borderColor: '#D1D5DB', borderStyle: 'dashed' },
  scanButtonText: { color: '#4B5563', fontWeight: 'bold', fontSize: 15 },
});