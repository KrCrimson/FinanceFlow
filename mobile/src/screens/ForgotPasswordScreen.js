import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, ScrollView } from 'react-native';
import { forgotPassword } from '../services/api';

export default function ForgotPasswordScreen({ onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Campo Obligatorio', 'Por favor ingresa tu correo electrónico.');
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email.trim());
      Alert.alert(
        'Correo Enviado',
        'Hemos enviado un enlace de recuperación a tu dirección de correo electrónico.'
      );
      onNavigateToLogin();
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🔑</Text>
          <Text style={styles.logoText}>Recuperar Contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo para recibir un token de restablecimiento
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Correo de la Cuenta</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleReset} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>Enviar Enlace</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backBtn} onPress={onNavigateToLogin}>
            <Text style={styles.backText}>Volver al Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1
  },
  header: {
    alignItems: 'center',
    marginBottom: 32
  },
  logoIcon: {
    fontSize: 50,
    marginBottom: 10
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065F46',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12
  },
  input: {
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16
  },
  submitBtn: {
    backgroundColor: '#34D399',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  backBtn: {
    alignItems: 'center',
    marginTop: 20
  },
  backText: {
    color: '#059669',
    fontWeight: '600',
    fontSize: 14
  }
});
