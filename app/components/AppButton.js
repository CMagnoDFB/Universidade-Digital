import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from '@react-navigation/native';

function AppButton({ title, onPress, color }) {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.card,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      padding: 15,
      width: "100%",
      marginVertical: 10,
    },
    text: {
      color: colors.buttonText,
      fontSize: 18,
      textTransform: "uppercase",
      fontWeight: "bold",
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

export default AppButton;