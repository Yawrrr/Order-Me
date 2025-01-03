import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { doc, getDoc } from "firebase/firestore";
import { ordersRef } from "@/FirebaseConfig";

const OrderDetails = () => {
  const params = useLocalSearchParams();
  const orderItem =
    params.orderItem && !Array.isArray(params.orderItem)
      ? JSON.parse(params.orderItem)
      : null;

  const [orderStatus, setOrderStatus] = useState<string>("");

  const fetchOrderStatus = async () => {
    if (!orderItem?.orderId) return;

    try {
      const orderDocRef = doc(ordersRef, orderItem.orderId);
      const orderDoc = await getDoc(orderDocRef);

      if (orderDoc.exists()) {
        const data = orderDoc.data();
        setOrderStatus(data.status || "Pending");
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    fetchOrderStatus();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>Order Details</Text>
        </View>
        <TouchableOpacity style={styles.backbtn} onPress={goBack}>
          <Ionicons name="chevron-back-outline" size={16} color="orange" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        {orderItem && (
          <View style={styles.card}>
            <Text style={styles.username}>{orderItem.username}</Text>
            <Text style={styles.details}>Address: {orderItem.address}</Text>
            <Text style={styles.details}>
              Date: {orderItem.date || "N/A"}
            </Text>
            <Text style={styles.details}>
              Order ID: {orderItem.orderId || "N/A"}
            </Text>

            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Status:</Text>

              {/* Preparing Food */}
              <View style={styles.statusRow}>
                <Ionicons
                  name={
                    orderStatus === "Preparing" ||
                    orderStatus === "Out of delivery" ||
                    orderStatus === "Delivered"
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={18}
                  color={
                    orderStatus === "Preparing" ||
                    orderStatus === "Out of delivery" ||
                    orderStatus === "Delivered"
                      ? "orange"
                      : "#555"
                  }
                />
                <Text
                  style={[
                    styles.status,
                    orderStatus === "Preparing" ||
                    orderStatus === "Out of delivery" ||
                    orderStatus === "Delivered"
                      ? styles.statusActive
                      : {},
                  ]}
                >
                  Preparing Food
                </Text>
              </View>

              {/* Out of delivery */}
              <View style={styles.statusRow}>
                <Ionicons
                  name={
                    orderStatus === "Out of delivery" || orderStatus === "Delivered"
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={18}
                  color={
                    orderStatus === "Out of delivery" || orderStatus === "Delivered"
                      ? "orange"
                      : "#555"
                  }
                />
                <Text
                  style={[
                    styles.status,
                    orderStatus === "Out of delivery" || orderStatus === "Delivered"
                      ? styles.statusActive
                      : {},
                  ]}
                >
                  Out of delivery
                </Text>
              </View>

              {/* Delivered */}
              <View style={styles.statusRow}>
                <Ionicons
                  name={
                    orderStatus === "Delivered"
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={18}
                  color={
                    orderStatus === "Delivered" ? "orange" : "#555"
                  }
                />
                <Text
                  style={[
                    styles.status,
                    orderStatus === "Delivered"
                      ? styles.statusActive
                      : {},
                  ]}
                >
                  Delivered
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="cloud-upload-outline" size={20} color="orange" />
              <Text style={styles.uploadText}>Upload photo</Text>
            </TouchableOpacity>

            <Text style={styles.details}>Items:</Text>
            <Text style={styles.items}>
              {orderItem.quantity} x {orderItem.name} - RM{orderItem.oriPrice}
            </Text>

            <Text style={styles.details}>Remarks:</Text>
            <Text style={styles.remarks}>
              {orderItem.remark || "No remarks"}
            </Text>

            <Text style={styles.total}>Total: RM{orderItem.totalPrice}</Text>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default OrderDetails;

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
  backbtn: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "20%",
  },
  backText: {
    fontSize: 14,
    color: "orange",
    marginLeft: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  statusContainer: {
    marginVertical: 10,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    marginLeft: 8,
  },
  statusActive: {
    color: "orange",
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "orange",
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  uploadText: {
    fontSize: 14,
    color: "orange",
    marginLeft: 5,
  },
  items: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  remarks: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    color: "orange",
    textAlign: "right",
    marginTop: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
});
