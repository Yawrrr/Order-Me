import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

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
          <Text style={styles.subHeader}>Order Details</Text>
          <Text style={styles.detailText}>Address: {selectedOrder.address}</Text>
          <Text style={styles.detailText}>Estimated Time: {selectedOrder.estimatedTime}</Text>
          <Text style={styles.subHeader}>Status</Text>
          {selectedOrder.status.map((step, index) => (
            <View key={index} style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <View style={styles.statusLine} />
              <Text style={styles.statusStep}>{step}</Text>
            </View>
          ))}
          <Text style={styles.subHeader}>Items</Text>
          {selectedOrder.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemText}>
                {item.name} x{item.quantity}
              </Text>
            </View>
          ))}
          <Text style={styles.totalText}>Total: RM {selectedOrder.total.toFixed(2)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 16,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#FF8C00',
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#FFCC99',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFF7E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCardText: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    color: '#FF4500',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'left',
    fontWeight: '600',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  itemRow: {
    marginBottom: 8,
    backgroundColor: '#FFE5CC',
    borderRadius: 8,
    padding: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4500',
    marginTop: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF8C00',
    marginRight: 8,
  },
  statusLine: {
    width: 2,
    height: 20,
    backgroundColor: '#FFCC99',
    marginRight: 8,
  },
  statusStep: {
    fontSize: 16,
    color: '#FF8C00',
  },
});

export default Status;