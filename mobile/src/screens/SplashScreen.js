/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: mobile/src/screens/SplashScreen.js
 * Capa / módulo ...: Prototipo móvil · Fuera del alcance de esta versión (SRS III.4)
 * Función .........: Pantalla de bienvenida del prototipo móvil.
 * Lo usan .........: mobile/App.js
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={{ width: 120, height: 90, resizeMode: 'contain', marginBottom: 12 }} />
        <Text style={styles.title}>FinanceFlow</Text>
        <Text style={styles.subtitle}>Tu Sistema de Balance Personal</Text>
      </View>
      <ActivityIndicator size="large" color="#34D399" style={styles.loader} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4', // bg-green-50
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 20
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#065F46', // text-green-800
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 16,
    color: '#059669', // text-green-600
    marginTop: 8,
    fontWeight: '500'
  },
  loader: {
    position: 'absolute',
    bottom: 80
  }
});
