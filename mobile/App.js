import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import NewMovementScreen from './src/screens/NewMovementScreen';
import { setAuthToken } from './src/services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    setCurrentScreen('login');
  };

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onFinish={() => setCurrentScreen('login')} />;
    case 'login':
      return (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setCurrentScreen('register')}
          onNavigateToForgot={() => setCurrentScreen('forgot')}
        />
      );
    case 'register':
      return <RegisterScreen onNavigateToLogin={() => setCurrentScreen('login')} />;
    case 'forgot':
      return <ForgotPasswordScreen onNavigateToLogin={() => setCurrentScreen('login')} />;
    case 'dashboard':
      return (
        <DashboardScreen
          user={user}
          onNavigateToNewMovement={() => setCurrentScreen('newMovement')}
          onLogout={handleLogout}
        />
      );
    case 'newMovement':
      return (
        <NewMovementScreen
          onSaveSuccess={() => {}}
          onNavigateBack={() => setCurrentScreen('dashboard')}
        />
      );
    default:
      return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  }
});