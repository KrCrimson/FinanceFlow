import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen del Mes</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Balance Total</Text>
        <Text style={styles.balanceAmount}>$0.00</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { borderColor: '#10B981' }]}>
          <Text style={styles.statLabel}>Ingresos</Text>
          <Text style={[styles.statValue, { color: '#10B981' }]}>$0.00</Text>
        </View>
        <View style={[styles.statBox, { borderColor: '#EF4444' }]}>
          <Text style={styles.statLabel}>Egresos</Text>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>$0.00</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddMovement')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#1F2937',
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 5,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#10B981',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  fabText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '300',
  }
});
