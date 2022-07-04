import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon } from 'react-native-elements';
import colors from "../config/colors";
import api from "./../../connectAPI";
import { ScrollView } from "react-native-gesture-handler";

function Post({ navigation, id, role, tags, body, user, date, upvotes, userUpvoted, id_usuario, token }) {

  const [upvoted, setUpvoted] = useState(userUpvoted);
  const [upvoteLoading, setUpvoteLoading] = useState(false);

  useEffect(() => {
    setUpvoted(userUpvoted);
  }, [userUpvoted]);

  const diffTime = Math.abs(new Date(date) - new Date(Date.now()));
  var timeAgo = Math.ceil(diffTime / (1000 * 60 * 60));
  if (timeAgo >= 24) {
    timeAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24)).toString() + "d";
  }else {
    timeAgo = timeAgo.toString() + "h";
  }


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

  const goToPost = async () => {

    navigation.pop();
    navigation.navigate('ViewPost', {
      id_publicacao: id
    });
  
  }

  return (
    <TouchableOpacity style={styles.card} delayPressIn={150} onPress={() => goToPost()}>
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
          <View style={styles.dateContainer}>
            <Text style={styles.dateText} numberOfLines={1}>{timeAgo}</Text>
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
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              { 
                tags.map((tag, tagKey) => {
                  return (
                    <Text key={tagKey} style={styles.tag}>{tag} </Text>
                  );
                })
              }
            </ScrollView>

          </View>
          
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.textBody} numberOfLines={6}>{body} </Text>
      </View>
    </TouchableOpacity>
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
  dateContainer: {
    width: 48,
    alignItems: "center"
  },
  dateText: {
    color: "#00000066",
    flexDirection: "column"
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
    marginRight: 6,
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
