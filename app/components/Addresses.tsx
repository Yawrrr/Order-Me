import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Touchable,
  View,
  TouchableHighlight,
  Modal,
  Alert,
  Button,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { FIREBASE_DB } from "@/FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Addresses = () => {
  const { user, setUser } = useAuth();
  const userUid = getAuth().currentUser?.uid;
  const primaryAddress = user?.addresses?.find((addr) => addr.primary)?.address;
  const secondaryAddresses = user?.addresses?.filter((addr) => !addr.primary);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newState, setNewState] = useState("");
  const [newPostcode, setNewPostcode] = useState("");

  const handleSetPrimaryOrDelete = async (selectedAddress: {
    address: string;
  }) => {
    Alert.alert("Address Options", "Choose an option for this address:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Set as Primary",
        onPress: async () => {
          const updatedAddresses = user?.addresses.map((addr) => ({
            ...addr,
            primary: addr.address === selectedAddress.address,
          }));
          if (user && userUid) {
            const userRef = doc(FIREBASE_DB, "users", userUid);
            await updateDoc(userRef, { addresses: updatedAddresses });
            if (updatedAddresses) {
              setUser({ ...user, addresses: updatedAddresses });
            }
          }
        },
      },
      {
        text: "Delete",
        onPress: async () => {
          const updatedAddresses = user?.addresses.filter(
            (addr) => addr.address !== selectedAddress.address
          );
          if (user && userUid) {
            const userRef = doc(FIREBASE_DB, "users", userUid);
            await updateDoc(userRef, { addresses: updatedAddresses });
            if (updatedAddresses) {
              setUser({ ...user, addresses: updatedAddresses });
            }
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleAddAddress = async () => {
    const newAddressInfo = {
      address: newAddress,
      primary: false,
      state: newState,
      postcode: newPostcode,
    };
    const updatedAddresses = [...(user?.addresses || []), newAddressInfo];
    if (user && userUid) {
      const userRef = doc(FIREBASE_DB, "users", userUid);
      await updateDoc(userRef, { addresses: updatedAddresses });
      setUser({ ...user, addresses: updatedAddresses });
      setModalVisible(false);
      setNewAddress("");
      setNewState("");
      setNewPostcode("");
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>My Addresses</Text>
        </View>
        <TouchableOpacity style={styles.backbtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={16} color="orange" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.addressesContainer}>
          <Text style={styles.sectionTitle}>Primary Address</Text>
          {primaryAddress && (
            <View style={styles.primaryAddressCard}>
              <Text style={styles.addressText}>{primaryAddress}</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Other Addresses</Text>
          {secondaryAddresses?.map((address, index) => (
            <TouchableOpacity
              key={index}
              style={styles.addressCard}
              onPress={() => handleSetPrimaryOrDelete(address)}
            >
              <Text style={styles.addressText}>{address.address}</Text>
              {address.state && (
                <Text style={styles.addressDetail}>{address.state}</Text>
              )}
              {address.postcode && (
                <Text style={styles.addressDetail}>{address.postcode}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Add New Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={newAddress}
                    onChangeText={setNewAddress}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="State"
                    value={newState}
                    onChangeText={setNewState}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Postcode"
                    value={newPostcode}
                    onChangeText={setNewPostcode}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.modalAddButton}
                    onPress={handleAddAddress}
                  >
                    <Text style={styles.modalAddButtonText}>Add Address</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: "orange",
    marginBottom: 5,
  },
  backbtn: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "20%",
    marginBottom: 10,
  },
  backText: {
    fontSize: 14,
    color: "orange",
    marginLeft: 5,
  },
  addButtonContainer: {
    marginVertical: 15,
  },
  addButton: {
    backgroundColor: "orange",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  addressesContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  primaryAddressCard: {
    backgroundColor: "#fff3e6",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "orange",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addressCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalAddButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  modalAddButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Addresses;
