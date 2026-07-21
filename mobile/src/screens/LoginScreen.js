import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, ScrollView } from 'react-native';
import { loginUser } from '../services/api';

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister, onNavigateToForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos Obligatorios', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(email.trim(), password);
      Alert.alert('¡Bienvenido!', `Hola de nuevo, ${data.user?.nombre || 'usuario'}.`);
      onLoginSuccess(data.user);
    } catch (err) {
      Alert.alert('Error de Acceso', err.message || 'Credenciales incorrectas o problema de servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logoIcon}>💰</Text>
          <Text style={styles.logoText}>FinanceFlow</Text>
          <Text style={styles.subtitle}>Inicia sesión para ver tu balance</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgotBtn} onPress={onNavigateToForgot}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>Iniciar Sesión</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
          <TouchableOpacity onPress={onNavigateToRegister}>
            <Text style={styles.linkText}> Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB' // neutral bg-gray-50
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065F46' // text-green-800
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
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
    marginBottom: 8
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginVertical: 12
  },
  forgotText: {
    color: '#059669', // emerald link
    fontWeight: '600',
    fontSize: 14
  },
  submitBtn: {
    backgroundColor: '#34D399', // Mint primary
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14
  },
  linkText: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 14
  }
});
