import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';

export default function AddMovementScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isIncome, setIsIncome] = useState(false);

  const handleSave = () => {
    if (!description || !amount) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    // TODO: POST request to Render backend
    Alert.alert('Éxito', 'Movimiento guardado (Simulado)');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Movimiento</Text>
      
      <View style={styles.form}>
        <View style={styles.switchRow}>
          <Text style={[styles.typeText, !isIncome && styles.activeExpense]}>Egreso</Text>
          <Switch
            value={isIncome}
            onValueChange={setIsIncome}
            trackColor={{ false: '#EF4444', true: '#10B981' }}
            thumbColor={'#ffffff'}
          />
          <Text style={[styles.typeText, isIncome && styles.activeIncome]}>Ingreso</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Descripción (ej. Compras de mercado)"
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={styles.input}
          placeholder="Monto ($)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar Movimiento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1F2937' },
  form: { backgroundColor: 'white', padding: 20, borderRadius: 16, elevation: 3 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  typeText: { fontSize: 16, color: '#6B7280', marginHorizontal: 10, fontWeight: 'bold' },
  activeExpense: { color: '#EF4444' },
  activeIncome: { color: '#10B981' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#3B82F6', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
