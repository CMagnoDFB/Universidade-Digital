import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Icon } from 'react-native-elements';
import colors from "../config/colors";

function Post({ role, tags, body, user, date }) {

  const [upvoted, setUpvoted] = useState(false);

  var min = 1;
  var max = 10;
  var randInt = Math.floor(Math.random() * (max - min + 1)) + min;

  var d = new Date(Date.now());
  d.setHours(d.getHours() - randInt); // UTC -3:00

  var now = new Date(Date.now());
  var diffMs = Math.abs(now - d);
  var diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
  var hours = diffHours.toString() + "h";

  return (
    <View style={styles.card}>
      <View >
        <View style={styles.postHeader}>
          <View style={styles.upvote}>
            <Icon
              onPress={() => setUpvoted(!upvoted)}
              raised={!upvoted}
              reverse={upvoted}
              name='arrow-up'
              type='font-awesome'
              color='#000'
              size={15}
              style={styles.upvoteIcon}
            />
            <View>
              <Text style={styles.dateText} numberOfLines={1}>{hours}</Text>
            </View>
          </View>
          <View style={styles.postHeaderText}>
            <View>
              <Text style={styles.userText} numberOfLines={1}>{user}</Text>
            </View>
            <View >
              <Text style={styles.roleText} numberOfLines={1}>{role}</Text>
            </View>
            <View style={styles.tags}>
              { 
                tags.map((tag, tagKey) => {
                  return (
                    <Text key={tagKey} style={styles.tag}>{tag} </Text>
                  );
                })
              }
              
            </View>
            
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.textBody} numberOfLines={6}>{body} </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 10,
    backgroundColor: colors.branco,
    borderRadius: 30,
    elevation: 6
  },
  postHeader: { flexDirection: "row", padding: 0 },
  upvote: { flexDirection: "column" },
  upvoteIcon: {
    flexDirection: "column"
  },
  dateText: {
    color: "#00000066",
    flexDirection: "column",
    paddingHorizontal: 15
  },
  postHeaderText: { flexDirection: "column", paddingLeft: 10, width: "100%" },
  userText: {
    textTransform: "capitalize",
    fontSize: 20
  },
  roleText: {
    color: "#00000066"
  },
  tags: { flexDirection: "row" },
  tag: { 
    backgroundColor: "lightblue", 
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 2,
    fontWeight: "600",
    borderRadius: 10
  },

  cardBody: { 
    flexDirection:'row',
    padding: 10
  },
  textBody: {
    flex: 1, 
    flexWrap: "wrap" 
  },
});

//Talvez remover o padding deste component depois pq ele e um card. A pagina que tem ele e que precisa resolver o padding

export default Post;
