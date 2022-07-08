import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon } from 'react-native-elements';
import api from "./../../connectAPI";
import { dateDifference } from "./../config/consts";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from '@react-navigation/native';

function Post({ navigation, id, role, tags, body, user, nomeUser, date, upvotes, nRespostas, userUpvoted, id_usuario, token }) {

  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    card: {
      marginHorizontal: 20,
      marginVertical: 15,
      padding: 10,
      backgroundColor: colors.post,
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
      color: colors.text2,
      flexDirection: "column"
    },
    postHeaderText: { flexDirection: "column", paddingLeft: 10, width: "80%" },
    userText: {
      textTransform: "capitalize",
      fontSize: 20,
      color: colors.text
    },
    roleText: {
      color: colors.text2
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
      flexWrap: "wrap",
      color: colors.text
    },
    nRespostasContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: 'center',
      marginTop: 5
    },
    nRespostasText: {
      color: colors.text2
    },
  });


  const [upvoted, setUpvoted] = useState(userUpvoted);
  const [upvoteLoading, setUpvoteLoading] = useState(false);

  useEffect(() => {
    setUpvoted(userUpvoted);
  }, [userUpvoted]);

  var timeAgo = dateDifference(date);

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

  const visitarPerfil = async (usuarioClicked) => {
    navigation.navigate("ViewProfile", {
      visitedUsuario: usuarioClicked,
      from: "Posts"
    });
  };

  const goToPost = async () => {
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
            reverse={true}
            name='arrow-up'
            type='font-awesome'
            color={!upvoted ? colors.background : colors.escura2}
            reverseColor={!upvoted ? colors.text : colors.buttonText}
            size={15}
            style={styles.upvoteIcon}
          />
          <View style={styles.dateContainer}>
            <Text style={styles.dateText} numberOfLines={1}>{timeAgo}</Text>
          </View>
        </View>
        <View style={styles.postHeaderText}>
          <TouchableOpacity
            onPress={() => visitarPerfil(user)}
          >
            <Text style={styles.userText} numberOfLines={1}>{nomeUser}</Text>
          </TouchableOpacity>
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
      <View style={styles.nRespostasContainer}>
        <Text style={styles.nRespostasText}>{nRespostas} {nRespostas!=1 ? "respostas" : "resposta" }</Text>
      </View>
    </TouchableOpacity>
  );
}

//Talvez remover o padding deste component depois pq ele e um card. A pagina que tem ele e que precisa resolver o padding

export default Post;
