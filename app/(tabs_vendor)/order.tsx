import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import {
  GestureHandlerRootView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import {
  onSnapshot,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ordersRef } from "@/FirebaseConfig";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";

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
  proveImg: string;
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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedAddress, setSelectedAddress] = useState<string>("All");
  const [selectedMealType, setSelectedMealType] = useState<string>("All");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!vendorEmail) return;

    const ordersQuery = query(ordersRef, where("email", "==", vendorEmail));
    const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
      const updatedOrders: Order[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        updatedOrders.push({
          id: docSnap.id,
          address: data.address,
          email: data.user,
          status: data.status,
          items: data.items || [],
          timestamp: data.timestamp,
          totalPrice: data.totalPrice,
          remark: data.remark,
        });
      });

      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders); // show all by default
    });

    return () => unsubscribe();
  }, [vendorEmail]);

  // 1) Properly close handleSearch and call setFilteredOrders(filtered)
  const handleSearch = (text: string) => {
    if (!text.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const lower = text.toLowerCase();
    const filtered = orders.filter((order) => {
      if (
        order.status.toLowerCase().includes(lower) ||
        order.address.toLowerCase().includes(lower)
      ) {
        return true;
      }
      return order.items.some((item) =>
        item.name.toLowerCase().includes(lower)
      );
    });

    setFilteredOrders(filtered);
  };

  // 2) Define handleSortAndFilter outside handleSearch
  const handleSortAndFilter = () => {
    let result = [...orders];

    if (selectedStatus !== "All") {
      result = result.filter((o) => o.status === selectedStatus);
    }

    if (selectedAddress !== "All") {
      result = result.filter((o) => o.address === selectedAddress);
    }

    if (selectedMealType !== "All") {
      result = result.filter((o) =>
        o.items.some((item) => item.name === selectedMealType)
      );
    }

    setFilteredOrders(result);
  };

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    if (currentStatus === "Cancelled") return;

    setIsUpdating(true);
    try {
      const orderDocRef = doc(ordersRef, orderId);
      let newStatus = "";

      if (currentStatus === "Pending") newStatus = "Preparing";
      else if (currentStatus === "Preparing") newStatus = "Out of delivery";

      await updateDoc(orderDocRef, { status: newStatus });

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setFilteredOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Orders</Text>

        <TextInput
          placeholder="Search for orders"
          style={styles.searchBar}
          onChangeText={handleSearch}
        />

        <View style={styles.filtersContainer}>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value);
              handleSortAndFilter();
            }}
            style={styles.filterPicker}
          >
            <Picker.Item label="Status" value="All" />
            <Picker.Item label="Preparing" value="Preparing" />
            <Picker.Item label="Out of delivery" value="Out of delivery" />
            <Picker.Item label="Delivered" value="Delivered" />
          </Picker>

          <Picker
            selectedValue={selectedAddress}
            onValueChange={(value) => {
              setSelectedAddress(value);
              handleSortAndFilter();
            }}
            style={styles.filterPicker}
          >
            <Picker.Item label="Addresses" value="All" />
            {Array.from(new Set(orders.map((o) => o.address))).map(
              (address) => (
                <Picker.Item key={address} label={address} value={address} />
              )
            )}
          </Picker>

          <Picker
            selectedValue={selectedMealType}
            onValueChange={(value) => {
              setSelectedMealType(value);
              handleSortAndFilter();
            }}
            style={styles.filterPicker}
          >
            <Picker.Item label="Meal Types" value="All" />
            {Array.from(
              new Set(orders.flatMap((o) => o.items.map((i) => i.name)))
            ).map((name) => (
              <Picker.Item key={name} label={name} value={name} />
            ))}
          </Picker>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() =>
                router.push({
                  pathname: "../components/OrderDetails",
                  params: { orderItem: JSON.stringify(order) },
                })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.username}> {order.items?.[0]?.username || order.email}</Text>
                <TouchableOpacity
                  onPress={() =>
                    (order.status === "Pending" ||
                      order.status === "Preparing") &&
                    !isUpdating
                      ? handleStatusUpdate(order.id, order.status)
                      : null
                  }
                >
                  <Text
                    style={[
                      styles.statusBadge,
                      order.status === "Cancelled"
                        ? styles.cancelStatus
                        : order.status === "Pending"
                        ? styles.pendingStatus
                        : order.status === "Preparing"
                        ? styles.preparingStatus
                        : order.status === "Out of delivery"
                        ? styles.outForDeliveryStatus
                        : styles.deliveredStatus,
                    ]}
                  >
                    {order.status}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.address}>{order.address}</Text>

              {order.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemText}>
                    {item.name} x{item.quantity} RM{item.totalPrice}
                  </Text>
                </View>
              ))}

              {order.remark && (
                <Text style={styles.remark}>{order.remark}</Text>
              )}

              <Text style={styles.totalPrice}>RM{order.totalPrice}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    paddingBottom: Platform.OS === "ios" ? 50 : 76,
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
  cancelStatus: {
    backgroundColor: "#FFE2E2",
    color: "#E14949",
  },
  pendingStatus: {
    backgroundColor: "#FFE0F1",
    color: "#DA1C92",
  },
  preparingStatus: {
    //purple
    backgroundColor: "#EAE1FB",
    color: "#8A2BE2",
  },
  outForDeliveryStatus: {
    //blue
    backgroundColor: "#E3F2FD",
    color: "#2196F3",
  },
  deliveredStatus: {
    //green
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
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
  remark: {
    fontSize: 12,
    color: "#FF5722",
    fontStyle: "italic",
    marginBottom: 4,
    marginTop: 4,
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
    gap: 8,
  },
  filterPicker: {
    flex: 1,
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    fontSize: 12,
  },
  orderCardText: {
    fontSize: 14,
    color: "#333",
  },
});

export default Order;
