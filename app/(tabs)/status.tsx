import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { FIREBASE_DB } from "../../FirebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: string;
  address: string;
  email: string; // email of the restaurant
  status: string | string[];
  items: {
    email: string; // email of the buyer
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }[];
  totalPrice: number;
  latitude: number;
  longitude: number;
  proveImg?: string;
  timestamp: Date;
}

const Status: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;

      try {
        const ordersRef = collection(FIREBASE_DB, "orders");
        const ordersQuery = query(
          ordersRef,
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(ordersQuery);

        const fetchedOrders: Order[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp.toDate(),
          } as Order;
        });

        // Filter the orders by checking if the buyer's email matches the logged-in user's email
        const filteredOrders = fetchedOrders.filter((order) =>
          order.items.some((item) => item.email === user.email)
        );

        setOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Order Status</Text>
      {!selectedOrder ? (
        <ScrollView>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => setSelectedOrder(order)}
              >
                <Text style={styles.orderCardText}>
                  Order ID: {order.id}
                </Text>
                <Text style={styles.orderCardText}>
                  Address: {order.address}
                </Text>
                <Text style={styles.orderCardText}>
                  Date: {order.timestamp.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  }).replace(":", ".")}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noOrdersText}>
              No orders found.
            </Text>
          )}
        </ScrollView>
      ) : (
        <ScrollView>
          <TouchableOpacity onPress={() => setSelectedOrder(null)}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeader}>Order Details</Text>
          <Text style={styles.detailText}>
            Address: {selectedOrder.address}
          </Text>
          <Text style={styles.detailText}>
            Date: {selectedOrder.timestamp.toLocaleString()}
          </Text>

          <Text style={styles.subHeader}>Status</Text>
          {Array.isArray(selectedOrder?.status) ? (
            selectedOrder.status.map((step, index) => (
              <View key={index} style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <View style={styles.statusLine} />
                <Text style={styles.statusStep}>{step}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.detailText}>
              {selectedOrder?.status || "No status available."}
            </Text>
          )}

          {selectedOrder.proveImg && (
            <>
              <Text style={styles.subHeader}>Proof of Delivery</Text>
              <Image
                source={{ uri: selectedOrder.proveImg }}
                style={styles.proveImage}
                resizeMode="contain"
              />
            </>
          )}

          <Text style={styles.subHeader}>Items</Text>
          {selectedOrder.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.itemImage}
                resizeMode="contain"
              />
              <Text style={styles.itemText}>
                {item.name} x{item.quantity}
              </Text>
            </View>
          ))}
          <Text style={styles.totalText}>
            Total: RM {selectedOrder.totalPrice.toFixed(2)}
          </Text>

          <Text style={styles.subHeader}>Delivery Location</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedOrder.latitude,
              longitude: selectedOrder.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: selectedOrder.latitude,
                longitude: selectedOrder.longitude,
              }}
              title="Delivery Address"
              description={selectedOrder.address}
            />
          </MapView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    color: "orange",
    marginBottom: 16,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "orange",
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#FFCC99",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#FFF7E6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCardText: {
    fontSize: 16,
    color: "#333",
  },
  noOrdersText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
  backButton: {
    color: "#FF4500",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "left",
    fontWeight: "600",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#FFE5CC",
    borderRadius: 8,
    padding: 8,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF4500",
    marginTop: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF8C00",
    marginRight: 8,
  },
  statusLine: {
    width: 2,
    height: 20,
    backgroundColor: "#FFCC99",
    marginRight: 8,
  },
  statusStep: {
    fontSize: 16,
    color: "#FF8C00",
  },
  map: {
    height: 200, // Adjust based on your layout
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 50, // Creates space to avoid overlap with the menu tab
  },
  proveImage: {
    width: "100%",
    height: 200,
    marginVertical: 12,
    borderRadius: 8,
  },
});

export default Status;
