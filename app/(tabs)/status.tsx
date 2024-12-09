import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/constants/colors';

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

  const renderStatusColor = (index: number, totalSteps: number): string => {
    return index === totalSteps - 1 ? 'text-green-500' : 'text-blue-500';
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerTransparent: true,
            headerTitle: '',
          }}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.rowContainer}>
              <TouchableOpacity onPress={() => console.log('Menu pressed')}>
                <Ionicons name="menu" size={20} color={colors.black.DEFAULT} style={{ marginLeft: 5 }} />
              </TouchableOpacity>
              <Text style={styles.heading}>Order Status</Text>
            </View>
            {!selectedOrder ? (
              <View>
                {orders.map((order) => (
                  <TouchableOpacity
                    key={order.id}
                    style={styles.card}
                    onPress={() => setSelectedOrder(order)}
                  >
                    <Text style={styles.cardTitle}>Order {order.id}</Text>
                    <Text>Address: {order.address}</Text>
                    <Text>Estimated Time: {order.estimatedTime}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View>
                <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                  <Text style={styles.backButton}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.detailsHeading}>Order Details</Text>
                <View style={styles.card}>
                  <Text>Address: {selectedOrder.address}</Text>
                  <Text>Estimated Time: {selectedOrder.estimatedTime}</Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Status</Text>
                  {selectedOrder.status.map((step, index) => (
                    <Text key={index} className={renderStatusColor(index, selectedOrder.status.length)}>
                      {step}
                    </Text>
                  ))}
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Items</Text>
                  {selectedOrder.items.map((item, index) => (
                    <Text key={index}>{item.name} x{item.quantity}</Text>
                  ))}
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    Total: RM {selectedOrder.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  scrollContent: { paddingBottom: 20 },
  content: { padding: 16 },
  rowContainer: { flexDirection: 'row', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginLeft: 8 , color: colors.secondary.DEFAULT,},
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 20,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  backButton: { color: '#007bff', marginBottom: 16 },
  detailsHeading: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
});

export default Status;
