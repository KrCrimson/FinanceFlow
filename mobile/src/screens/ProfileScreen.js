import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert, Platform, StatusBar } from 'react-native';

export default function ProfileScreen({ user, onLogout }) {
  const handleLogoutConfirm = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, Salir', style: 'destructive', onPress: onLogout }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#6EE7B7" translucent />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>👤 Perfil de Usuario</Text>

        <View style={styles.card}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>
              {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'S'}
            </Text>
          </View>

          <Text style={styles.userName}>{user?.nombre || 'Sebastian'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'usuario@financeflow.com'}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado de Cuenta</Text>
            <Text style={styles.infoValueActive}>● Activo</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Plataforma</Text>
            <Text style={styles.infoValue}>FinanceFlow Cloud</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutConfirm} activeOpacity={0.8}>
          <Text style={styles.logoutBtnText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginTop: 8, marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
  avatarBox: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#34D399', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  userEmail: { fontSize: 13, color: '#6B7280', marginTop: 2, marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  infoLabel: { fontSize: 13, color: '#4B5563' },
  infoValue: { fontSize: 13, fontWeight: '600', color: '#1F2937' },
  infoValueActive: { fontSize: 13, fontWeight: 'bold', color: '#10B981' },
  logoutBtn: { backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  logoutBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' }
});
