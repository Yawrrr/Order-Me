import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Keyboard,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import {
  GestureHandlerRootView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Firestore, getDoc, getDocs, query, where } from "firebase/firestore";
import { ordersRef } from "@/FirebaseConfig";

interface OrderItem{
  email: string;
  id: string;
  imageUrl: string; 
  name: string;
  oriPrice: number;
  quantity: number;
  restaurantName: string;
  totalPrice: number;
}

interface Order {
  id: string;
  address: string;
  email: string;
  status: string;
  items: OrderItem[];
  timestamp: string;
  totalPrice: number;
}

interface OrderStatus {
  label: string;
  timestamp?: string;
}

const Order = () => {
  const { user } = useAuth();
  const restarantName = user?.restaurantName;
  const vendorEmail = user?.email;
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch orders from the database
    fetchOrders();
    console.log(orders);
  }, []);

  const fetchOrders = async () => {
    const orderDocs = await getDocs(
      query(ordersRef, where("vendorEmail", "==", vendorEmail))
    );
    
    const orders: Order[] = orderDocs.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        address: data.address,
        email: data.email,
        status: data.status,
        items: data.items,
        timestamp: data.timestamp,
        totalPrice: data.totalPrice,
      };
    });

    setOrders(orders);
  }
  

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style="">
            <Text style={styles.title}>Orders</Text>
            <ScrollView>
              <View>
                <TextInput
                  placeholder="Search for orders"
                  style={styles.searchBar}
                  onChangeText={() => {}}
                ></TextInput>
              </View>
            </ScrollView>
          </View>
          {/* 
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
      )} */}
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
    height: "100%",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: "#FF8C00",
    textAlign: "left",
  },
  searchBar: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  searchBarText: {
    fontSize: 16,
    color: "black",
    opacity: 0.6,
  },
  searchBarIcon: {
    color: "black",
    opacity: 0.6,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#FFCC99",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#FFF7E6",
  },
  orderCardText: {
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    fontSize: 16,
    color: "orange",
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#FF8C00",
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  timestamp: {
    fontSize: 14,
    color: "#FF8C00",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF4500",
    marginTop: 12,
  },
});

export default Order;
