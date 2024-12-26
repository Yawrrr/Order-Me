import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Touchable,
  View,
} from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const Addresses = () => {
  const { user } = useAuth();
  const primaryAddress = user?.addresses?.find((addr) => addr.primary)?.address;
  const secondaryAddresses = user?.addresses?.filter((addr) => !addr.primary);
  const goBack = () => {
    router.back();
  };

  const Breakline = () => {
    return <View style={styles.breakline}></View>;
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
            <>
              <Breakline />
              <View key={index} style={styles.secondaryAddresses}>
                {/* <Text style={styles.phoneNum}>{user?.phoneNumber}</Text> */}
                <Text style={styles.address}>{address.address}</Text>
              </View>
            </>
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
    fontWeight: "500",
  },
  address: {
    fontSize: 14,
    fontWeight: "300",
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
