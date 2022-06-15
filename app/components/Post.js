import React from "react";
import { Text, StyleSheet, View } from "react-native";

function Post({ title, tag, body, user }) {
  return (
    <View style={styles.screen}>
      <View style={styles.post}>
        <View style={styles.likeDislike}>
          <Text>up</Text>
          <Text>down</Text>
        </View>
        <View style={styles.textualElements}>
          <View style={styles.title}>
            <Text>{title}</Text>
          </View>
          <View style={styles.tags}>
            <Text style={styles.tag}>{tag} </Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.mainText}>{body}</Text>
          </View>
          <View style={styles.name}>
            <Text>{user}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  post: { flexDirection: "row", padding: 15 },

  likeDislike: { flexDirection: "column" },
  textualElements: { flexDirection: "column", paddingLeft: 15, width: "85%" },
  title: {},
  name: {
    backgroundColor: "grey",
    margin: 2,
    padding: 2,
    flexDirection: "row",
    alignSelf: "flex-start",
  },

  tag: { backgroundColor: "lightblue", padding: 2, margin: 2 },
  tags: { flexDirection: "row" },
  body: {
    flexDirection: "row",
    backgroundColor: "lightgrey",
    padding: 2,
    margin: 2,
  },
  mainText: { flex: 1, flexWrap: "wrap" },
});

//Talvez remover o padding deste component depois pq ele e um card. A pagina que tem ele e que precisa resolver o padding

export default Post;
