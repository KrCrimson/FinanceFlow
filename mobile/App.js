import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from './src/screens/DashboardScreen';
import MovimientoFormScreen from './src/screens/MovimientoFormScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#10B981" />
      
      {/* HEADER GLOBAL COMPARTIDO */}
      <View style={styles.header}>
        <Text style={styles.title}>?? Flujo de Caja</Text>
      </View>

      <View style={styles.content}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Dashboard') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'MovimientoForm') {
                  iconName = focused ? 'add-circle' : 'add-circle-outline';
                } else if (route.name === 'Estadisticas') {
                  iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#10B981',
              tabBarInactiveTintColor: '#9CA3AF',
              tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopWidth: 1,
                borderTopColor: '#F3F4F6',
                paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                height: Platform.OS === 'ios' ? 80 : 60,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: 'bold',
              }
            })}
          >
            <Tab.Screen 
              name="Dashboard" 
              component={DashboardScreen} 
              options={{ tabBarLabel: 'Resumen' }}
            />
            <Tab.Screen 
              name="MovimientoForm" 
              component={MovimientoFormScreen} 
              options={{ tabBarLabel: 'A�adir/Escanear' }}
            />            <Tab.Screen 
              name="Estadisticas" 
              component={AnalyticsScreen} 
              options={{ tabBarLabel: 'Estadísticas' }}
            />          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#10B981',
    paddingTop: Platform.OS === 'android' ? 45 : 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
});
