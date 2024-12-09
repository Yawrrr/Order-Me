import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

// Define the types for the orders
interface Order {
  id: number;
  address: string;
  estimatedTime: string;
  restaurantname: string;
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
        address: 'MA7 Ktdi Utm',
        estimatedTime: '1:00 PM',
        restaurantname: 'Jojoe',
        status: [
          '10:00 AM - Order Placed',
          '11:30 AM - Kitchen Preparing',
          '12:30 PM - Out for Delivery',
          '1:00 PM - Delivered',
        ],
        items: [{ name: 'Fried Rice', quantity: 1 }],
        total: 15.0,
      },
      {
        id: 2,
        address: 'L50 Utm',
        estimatedTime: '2:30 PM',
        restaurantname: 'Umi Kitchen',
        status: [
          '11:00 AM - Order Placed',
          '12:45 PM - Kitchen Preparing',
          '2:00 PM - Out for Delivery',
          '2:30 PM - Delivered',
        ],
        items: [
          { name: 'Chicken Chop', quantity: 1 },
          { name: 'Coke', quantity: 1 },
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
              <Text>Restaurant: {order.restaurantname}</Text>
              <Text>Estimated Time: {order.estimatedTime}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View>
          <TouchableOpacity onPress={() => setSelectedOrder(null)} style={styles.backButtonContainer}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeader}>Order Details</Text>
          <Text>Address: {selectedOrder.address}</Text>
          <Text>Estimated Time: {selectedOrder.estimatedTime}</Text>
          <Text>Restaurant: Jojoe</Text>
          <Text style={styles.subHeader}>Status</Text>
          {selectedOrder.status.map((step, index) => (
            <View key={index} style={styles.statusStepContainer}>
              <View style={styles.statusIndicator} />
              <Text style={styles.statusText}>{step}</Text>
            </View>
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
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FF8000',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#FF8000',
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#FF8000',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFF4E0',
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#FF8000',
    borderRadius: 4,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemRow: {
    marginBottom: 8,
  },
  statusStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF8000',
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
  },
});

export default Status;
