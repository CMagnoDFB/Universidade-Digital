import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../config/colors";

function PostSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: { width: "100%", height: 2, backgroundColor: colors.escura2 },
});

export default PostSeparator;
