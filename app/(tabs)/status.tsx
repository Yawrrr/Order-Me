import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

// Define the types for the orders
interface Order {
  id: number;
  address: string;
  estimatedTime: string;
  status: string[];
  items: { name: string; quantity: number }[];
  total: number;
}

const Status: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 1,
        address: '123 Main Street',
        estimatedTime: '1:00 PM',
        status: [
          '10:00 AM - Order Placed',
          '11:30 AM - Kitchen Preparing',
          '12:30 PM - Out for Delivery',
          '1:00 PM - Delivered',
        ],
        items: [{ name: 'Burger', quantity: 1 }],
        total: 15.0,
      },
      {
        id: 2,
        address: '456 Elm Street',
        estimatedTime: '2:30 PM',
        status: [
          '11:00 AM - Order Placed',
          '12:45 PM - Kitchen Preparing',
          '2:00 PM - Out for Delivery',
          '2:30 PM - Delivered',
        ],
        items: [
          { name: 'Pizza', quantity: 1 },
          { name: 'Soda', quantity: 1 },
        ],
        total: 25.0,
      },
    ];
    setOrders(mockOrders);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Status</Text>
      {!selectedOrder ? (
        <ScrollView>
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => setSelectedOrder(order)}
            >
              <Text>Order {order.id}</Text>
              <Text>Address: {order.address}</Text>
              <Text>Estimated Time: {order.estimatedTime}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View>
          <TouchableOpacity onPress={() => setSelectedOrder(null)}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeader}>Order Details</Text>
          <Text>Address: {selectedOrder.address}</Text>
          <Text>Estimated Time: {selectedOrder.estimatedTime}</Text>
          <Text style={styles.subHeader}>Status</Text>
          {selectedOrder.status.map((step, index) => (
            <Text key={index}>{step}</Text>
          ))}
          <Text style={styles.subHeader}>Items</Text>
          {selectedOrder.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text>
                {item.name} x{item.quantity}
              </Text>
            </View>
          ))}
          <Text>Total: RM {selectedOrder.total.toFixed(2)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  backButton: {
    color: 'blue',
    marginBottom: 16,
  },
  itemRow: {
    marginBottom: 8,
  },
});

export default Status;
