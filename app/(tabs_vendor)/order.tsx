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

interface OrderItem {
  user: string;
  email: string;
  id: string;
  imageUrl: string;
  name: string;
  oriPrice: number;
  quantity: number;
  restaurantName: string;
  totalPrice: number;
  username: string;
  orderId: string;
  orderTimestamp: string;
  customerEmail: string;
  orderStatus: string;
  address: string;
  remark: string;
}

interface Order {
  id: string;
  address: string;
  email: string;
  status: string;
  items: OrderItem[];
  timestamp: string;
  totalPrice: number;
  remark: string;
}

const Order = () => {
  const { user } = useAuth();
  const vendorEmail = user?.email;
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    // Fetch orders from the database
    fetchOrders();
    // console.log(orders);
  }, []);

  const fetchOrders = async () => {
    const orderDocs = await getDocs(
      query(ordersRef, where("email", "==", vendorEmail))
    );

    const orders: Order[] = orderDocs.docs.map((doc) => {
      const data = doc.data();
      // console.log(data.items);
      return {
        id: doc.id,
        address: data.address,
        email: data.user,
        status: data.status,
        items: data.items,
        timestamp: data.timestamp,
        totalPrice: data.totalPrice,
        remark: data.remark,
      };
    });

    setOrders(orders);

    // Map each order's items to separate array elements
    const allItems: OrderItem[] = [];
    orders.forEach((order) => {
      const itemsWithOrderInfo = order.items.map((item) => ({
        ...item,
        orderId: order.id,
        orderTimestamp: order.timestamp,
        customerEmail: order.email,
        orderStatus: order.status,
        address: order.address,
        remark: order.remark,
      }));
      allItems.push(...itemsWithOrderInfo);
    });

    // console.log(allItems);
    setOrderItems(allItems);
    // console.log(orderItems);
  };

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
              <View>
                {orderItems.map((order) => (
                  <TouchableOpacity
                    key={order.id}
                    style={styles.orderCard}
                    onPress={() => console.log(order.id)}
                  >
                    <Text style={styles.orderCardText}>{order.username}</Text>
                    <Text style={styles.orderCardText}>{order.address}</Text>
                    <Text style={styles.orderCardText}>{order.name}</Text>
                    <Text style={styles.orderCardText}>{order.remark}</Text>
                    <Text style={styles.orderCardText}>
                      Total Price: RM {order.totalPrice}
                    </Text>
                    <Text style={styles.orderCardText}>
                      Status: {order.orderStatus}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "white",
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
