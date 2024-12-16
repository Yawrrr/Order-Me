import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';

interface Order {
  id: number;
  address: string;
  estimatedTime: string;
  items: { name: string; quantity: number }[];
  total: number;
}

interface OrderStatus {
  label: string;
  timestamp?: string;
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      address: 'Taman Universiti, Skudai, Johor, Johor Bahru, Malaysia',
      estimatedTime: '1:00 PM',
      items: [{ name: 'Burger', quantity: 1 }],
      total: 15.0,
    },
    {
      id: 2,
      address: 'Mount Austin, Skudai, Johor, Johor Bahru, Malaysia',
      estimatedTime: '2:30 PM',
      items: [
        { name: 'Pizza', quantity: 1 },
        { name: 'Soda', quantity: 1 },
      ],
      total: 25.0,
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statuses, setStatuses] = useState<OrderStatus[]>([  // Initialize statuses for each order
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

      if (!newStatuses[index].timestamp) {
        newStatuses[index].timestamp = currentTime;
      } else {
        newStatuses[index].timestamp = undefined;
      }

      return newStatuses;
    });
  };

<<<<<<< HEAD
const order = () => {
=======
>>>>>>> main
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order Management</Text>

      {!selectedOrder ? (
        <ScrollView>
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => setSelectedOrder(order)}
            >
              <Text style={styles.orderCardText}>Order {order.id}</Text>
              <Text style={styles.orderCardText}>Address: {order.address}</Text>
              <Text style={styles.orderCardText}>Estimated Time: {order.estimatedTime}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View>
          <TouchableOpacity onPress={() => setSelectedOrder(null)}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle}>Order Details</Text>
          <Text style={styles.detailText}>Address: {selectedOrder.address}</Text>
          <Text style={styles.detailText}>Estimated Time: {selectedOrder.estimatedTime}</Text>

          <Text style={styles.subtitle}>Order Status</Text>
          {statuses.map((status, index) => (
            <View key={index} style={styles.statusRow}>
              <Switch
                value={!!status.timestamp}
                onValueChange={() => handleStatusChange(index)}
              />
              <Text style={styles.statusLabel}>{status.label}</Text>
              {status.timestamp && (
                <Text style={styles.timestamp}>({status.timestamp})</Text>
              )}
            </View>
          ))}

          <Text style={styles.subtitle}>Items</Text>
          {selectedOrder.items.map((item, index) => (
            <Text key={index} style={styles.detailText}>
              {item.name} x{item.quantity}
            </Text>
          ))}
          <Text style={styles.totalText}>Total: RM {selectedOrder.total.toFixed(2)}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

<<<<<<< HEAD
export default order;
=======
>>>>>>> main
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    color: '#FF8C00',
    textAlign: 'center',
    marginBottom: 16,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#FFCC99',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFF7E6',
  },
  orderCardText: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    fontSize: 16,
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#FF8C00',
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4500',
    marginTop: 12,
  },
});

export default Order;
