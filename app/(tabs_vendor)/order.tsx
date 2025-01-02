import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import {
  GestureHandlerRootView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { getDocs, query, where } from "firebase/firestore";
import { ordersRef } from "@/FirebaseConfig";
import { router } from "expo-router";

export interface OrderItem {
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
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);

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
    setFilteredOrders(allItems);
    // console.log(orderItems);
  };

  const handleSearch = (text: string) => {
    if (text.trim() === "") {
      setFilteredOrders(orderItems);
      return;
    }

    const searchText = text.toLowerCase();
    const filtered = orderItems.filter(
      (order) =>
        // Search by status
        order.orderStatus.toLowerCase().includes(searchText) ||
        order.name.toLowerCase().includes(searchText) ||
        order.address.toLowerCase().includes(searchText)
    );

    setFilteredOrders(filtered);
  };

  return (
    <GestureHandlerRootView style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Text style={styles.title}>Orders</Text>
              <View>
                <TextInput
                  placeholder="Search for orders"
                  style={styles.searchBar}
                  onChangeText={handleSearch}
                ></TextInput>
              </View>
            <ScrollView>
              <View>
                {filteredOrders.map((order) => (
                  <TouchableOpacity
                    key={order.id}
                    style={styles.orderCard}
                    onPress={() =>
                      router.push({
                        pathname: "../components/OrderDetails",
                        params: {
                          orderItem: JSON.stringify(order),
                        },
                      })
                    }
                  >
                    <View style={styles.cardHeader}>
                      <Text style={styles.username}>{order.username}</Text>
                      <Text
                        style={[
                          styles.statusBadge,
                          order.orderStatus === "Preparing"
                            ? styles.preparingStatus
                            : order.orderStatus === "Out of delivery"
                            ? styles.outForDeliveryStatus
                            : styles.deliveredStatus,
                        ]}
                      >
                        {order.orderStatus}
                      </Text>
                    </View>
                    <Text style={styles.address}>{order.address}</Text>
                    <Text style={styles.itemName}>{order.name}</Text>
                    {order.remark && (
                      <Text style={styles.remark}>"{order.remark}"</Text>
                    )}
                    <Text style={styles.totalPrice}>RM{order.totalPrice}</Text>
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
  outerContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: "#FF8C00",
    marginBottom: 20,
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  preparingStatus: {
    backgroundColor: "#EAE1FB",
    color: "#8A2BE2",
  },
  outForDeliveryStatus: {
    backgroundColor: "#E3F2FD",
    color: "#2196F3",
  },
  deliveredStatus: {
    backgroundColor: "#E8F5E9",
    color: "#4CAF50",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  remark: {
    fontSize: 12,
    color: "#FF5722",
    fontStyle: "italic",
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8C00",
    textAlign: "right",
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filterPicker: {
    flex: 1,
    marginHorizontal: 4,
    height: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  orderCardText: {
    fontSize: 14,
    color: "#333",
  },
});

export default Order;
