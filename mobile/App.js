import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER IDÉNTICO A LA WEB */}
      <View style={styles.header}>
        <Text style={styles.title}>💰 Sistema Balance</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>¡Bienvenido a la Versión Móvil!</Text>
        <Text style={styles.subtext}>
          Lista para conectar a tus backend de Node.js y Machine Learning en Python.
        </Text>
        
        {/* Aquí iría la pantalla DashboardScreen.js */}
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Conexión con el Servidor</Text>
          <Text style={styles.cardBody}>
            Las llamadas desde esta App usarán el mismo movimientosService.js y conectarán a la misma MongoDB mediante Render.
          </Text>
        </View>
      </View>
      
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // bg-background (Tailwind)
  },
  header: {
    backgroundColor: '#6EE7B7', // bg-primary de la web
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 10,
  },
  cardBody: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  }
});