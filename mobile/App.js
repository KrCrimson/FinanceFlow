import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import NewMovementScreen from './src/screens/NewMovementScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { setAuthToken } from './src/services/api';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
    setCurrentScreen('app');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    setCurrentScreen('login');
  };

  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={() => setCurrentScreen('login')} />;
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setCurrentScreen('register')}
        onNavigateToForgot={() => setCurrentScreen('forgot')}
      />
    );
  }

  if (currentScreen === 'register') {
    return <RegisterScreen onNavigateToLogin={() => setCurrentScreen('login')} />;
  }

  if (currentScreen === 'forgot') {
    return <ForgotPasswordScreen onNavigateToLogin={() => setCurrentScreen('login')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar Superior Global FinanceFlow */}
      <View style={styles.navbar}>
        <Text style={styles.brandTitle}>💰 FinanceFlow</Text>

        <View style={styles.navMenu}>
          <TouchableOpacity
            style={[styles.navItem, activeTab === 'dashboard' && styles.navItemActive]}
            onPress={() => setActiveTab('dashboard')}
          >
            <Text style={[styles.navItemText, activeTab === 'dashboard' && styles.navItemTextActive]}>
              🏠 Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'newMovement' && styles.navItemActive]}
            onPress={() => setActiveTab('newMovement')}
          >
            <Text style={[styles.navItemText, activeTab === 'newMovement' && styles.navItemTextActive]}>
              ➕ Nuevo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'reports' && styles.navItemActive]}
            onPress={() => setActiveTab('reports')}
          >
            <Text style={[styles.navItemText, activeTab === 'reports' && styles.navItemTextActive]}>
              📊 Reportes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'profile' && styles.navItemActive]}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={[styles.navItemText, activeTab === 'profile' && styles.navItemTextActive]}>
              👤 Perfil
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido de la Pantalla Activa */}
      <View style={styles.screenContent}>
        {activeTab === 'dashboard' && (
          <DashboardScreen
            user={user}
            onNavigateToNewMovement={() => setActiveTab('newMovement')}
            onLogout={handleLogout}
          />
        )}
        {activeTab === 'newMovement' && (
          <NewMovementScreen
            onSaveSuccess={() => setActiveTab('dashboard')}
            onNavigateBack={() => setActiveTab('dashboard')}
          />
        )}
        {activeTab === 'reports' && <ReportsScreen user={user} />}
        {activeTab === 'profile' && <ProfileScreen user={user} onLogout={handleLogout} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  navbar: {
    backgroundColor: '#6EE7B7',
    paddingTop: STATUSBAR_HEIGHT + 6,
    paddingBottom: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#A7F3D0'
  },
  brandTitle: {
    color: '#065F46',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  navMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 10,
    padding: 4
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  navItemActive: {
    backgroundColor: '#059669'
  },
  navItemText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: 'bold'
  },
  navItemTextActive: {
    color: '#FFFFFF'
  },
  screenContent: {
    flex: 1
  }
});