import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Icon } from 'react-native-elements';
import colors from "../config/colors";
import api from "./../../connectAPI"

function Post({ id, role, tags, body, user, date, upvotes, userUpvoted, id_usuario, token }) {

  const [upvoted, setUpvoted] = useState(userUpvoted);
  const [upvoteLoading, setUpvoteLoading] = useState(false);

  useEffect(() => {
    setUpvoted(userUpvoted);
  }, [userUpvoted]);

  const date1 = new Date(Date.now());
  const date2 = new Date(date);
  const diffTime = Math.abs(date2 - date1);
  const hours = Math.ceil(diffTime / (1000 * 60 * 60)).toString() + "h";

  const upvotePost = async () => {
    
    if (!upvoteLoading) {
      setUpvoteLoading(true);
      setUpvoted(!upvoted);

      if (!upvoted) {
        api.post("upvotePost", {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          id_usuario: id_usuario,
          id_publicacao: id
        } ).then(() => {
          setUpvoteLoading(false);
          
        }).catch(err => {
          setUpvoteLoading(false);
          console.log('error', err.response);
        });
      } else {
        api.post("removeUpvotePost", {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          id_usuario: id_usuario,
          id_publicacao: id
        } ).then(() => {
          setUpvoteLoading(false);
          
        }).catch(err => {
          setUpvoteLoading(false);
          console.log('error', err.response);
        });
      }
    }
    
  }

  return (
    <View style={styles.card}>
      <View >
        <View style={styles.postHeader}>
          <View style={styles.upvote}>
            <Icon
              onPress={() => upvotePost()}
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
          <Text style={styles.textBody} numberOfLines={6}>{id}{body} </Text>
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
