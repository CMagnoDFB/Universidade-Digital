import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from '@react-navigation/native';

function PostSeparator() {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    separator: { width: "100%", height: 2, backgroundColor: colors.background },
  });
  return <View style={styles.separator} />;
}

export default PostSeparator;
