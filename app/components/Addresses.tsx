import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Touchable,
  View,
  TouchableHighlight,
  Alert,
} from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
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
  const goBack = () => {
    router.back();
  };

  const Breakline = () => {
    return <View style={styles.breakline}></View>;
  };

  const handleSetPrimary = async (selectedAddress: { address: string }) => {
    Alert.alert(
      "Set Primary Address",
      "Are you sure you want to set this address as your primary address?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
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
      ]
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backbtn} onPress={goBack}>
          <Ionicons name="chevron-back-outline" size={16} color="black" />
          <Text>Back</Text>
        </TouchableOpacity>
        
        <View>
          <Text>Primary Address</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.phoneNum}>{user?.phoneNumber}</Text>
            <Text style={styles.address}>{primaryAddress}</Text>
          </View>
          <Text>Secondary Addresses</Text>
          {secondaryAddresses?.map((address, index) => (
            <View key={index}>
              <Breakline />
              <TouchableOpacity
                style={styles.secondaryAddresses}
                onPress={() => handleSetPrimary(address)}
              >
                <Text style={styles.address}>{address.address}</Text>
                {address.state && (
                  <Text className="text-sm">{address.state}</Text>
                )}
                {address.postcode && (
                  <Text className="text-sm">{address.postcode}</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Addresses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 16,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    gap: 4,
  },
  backbtn: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "20%",
    marginBottom: 16,
  },
  icon: {
    // height: 16,
    // width: 16,
  },
  phoneNum: {
    fontSize: 16,
    fontWeight: "600",
  },
  address: {
    fontSize: 14,
    fontWeight: "400",
  },
  breakline: {
    width: "100%",
    backgroundColor: "#CCC",
    height: 1.5,
    marginVertical: 8,
  },
  secondaryAddresses: {
    padding: 12,
  },
});
