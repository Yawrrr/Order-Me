import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { colors } from "@/constants/Colors";

interface textInputProps {
  placeholder : string,
}

const CustomTextInput:React.FC<textInputProps> = ({placeholder}) => {
  return (
    <TextInput 
      placeholder={placeholder}
      style={styles.container}
    />
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container:{
    borderWidth : 1,
    borderColor : colors.secondary.DEFAULT,
    minHeight: 48,
    borderRadius : 12,
    paddingHorizontal: 36
  }
});
