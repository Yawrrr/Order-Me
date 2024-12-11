import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';

interface OrderStatus {
  label: string;
  timestamp?: string;
}

const Order: React.FC = () => {
  const [statuses, setStatuses] = useState<OrderStatus[]>([
    { label: ' Order Placed' },
    { label: ' Kitchen Preparing' },
    { label: ' Out for Delivery' },
    { label: ' Delivered' },
  ]);

  const handleStatusChange = (index: number) => {
    setStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      const currentTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Update the timestamp for the selected status
      if (!newStatuses[index].timestamp) {
        newStatuses[index].timestamp = currentTime;
      } else {
        newStatuses[index].timestamp = undefined; // Uncheck if already checked
      }

      return newStatuses;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Management</Text>
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Order Status</Text>
          {statuses.map((status, index) => (
            <View key={index} style={styles.statusRow}>
              <Switch
                value={!!status.timestamp}
                onValueChange={() => handleStatusChange(index)}
              />
              <Text style={styles.statusLabel}>{status.label}</Text>
              {status.timestamp && <Text style={styles.timestamp}>({status.timestamp})</Text>}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: 'orange',
  },
  section: {
    marginTop: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FF8C00',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF7E6',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  timestamp: {
    fontSize: 14,
    color: '#FF8C00',
  },
});
