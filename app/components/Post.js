import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Icon } from 'react-native-elements';
import colors from "../config/colors";

function Post({ id, role, tags, body, user, date, upvotes }) {

  const [upvoted, setUpvoted] = useState(false);

  const date1 = new Date(Date.now());
  const date2 = new Date(date);
  const diffTime = Math.abs(date2 - date1);
  const hours = Math.ceil(diffTime / (1000 * 60 * 60)).toString() + "h"; 

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
              color={colors.escura2}
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
  postHeaderText: { flexDirection: "column", paddingLeft: 10, width: "80%" },
  userText: {
    textTransform: "capitalize",
    fontSize: 20
  },
  roleText: {
    color: "#00000066"
  },
  tags: { flexDirection: "row" },
  tag: { 
    backgroundColor: colors.media1, 
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
