import React from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Checkout() {
  const [address, setAddress] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");

  const handleConfirm = () => {
    if (!address || !contactNumber) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }
    Alert.alert("Success", "Your order has been confirmed!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Review Payment and Address</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Delivery Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your delivery address"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your contact number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "orange",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  confirmButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
