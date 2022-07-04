import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Icon } from 'react-native-elements';
import colors from "../config/colors";
import api from "./../../connectAPI";
import { ScrollView } from "react-native-gesture-handler";

function Reply({ navigation, id, role, body, user, date, upvotes, userUpvoted, id_usuario, id_usuarioResp, id_publicacao, token }) {

  const [upvoted, setUpvoted] = useState(userUpvoted);
  const [upvoteLoading, setUpvoteLoading] = useState(false);

  useEffect(() => {
    setUpvoted(userUpvoted);
  }, [userUpvoted]);

  const date1 = new Date(Date.now());
  const date2 = new Date(date);
  const diffTime = Math.abs(date2 - date1);
  const hours = Math.ceil(diffTime / (1000 * 60 * 60)).toString() + "h";

  const upvoteReply = async () => {
    
    if (!upvoteLoading) {
        setUpvoteLoading(true);
        setUpvoted(!upvoted);

        var modoUpvote;
        if (!upvoted) {
            modoUpvote = "upvoteReply";
            setUpvotes(upvotes+1);
        }else {
            modoUpvote = "removeUpvoteReply";
            setUpvotes(upvotes-1);
        }

        api.post(modoUpvote, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
            id_usuario: id_usuario,
            id_resposta: id
        } ).then(() => {
            setUpvoteLoading(false);
        
        }).catch(err => {
            setUpvoteLoading(false);
            console.log('error', err.response);
        });
    
    }
    
  }

  const excluirResp = async () => {
    api.post("deleteReply", {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
      id_resposta: id,
      id_publicacao: id_publicacao
    } ).then(() => {
      navigation.pop();
      navigation.navigate('ViewPost', {
        id_publicacao: id_publicacao
      });
    }).catch(err => {
      console.log('error', err.response);
    });

  }

  return (
    <View style={styles.card}>
      <View >
        <View style={styles.replyHeader}>
          <View style={styles.upvote}>
            <Icon
              onPress={() => upvoteReply()}
              raised={!upvoted}
              reverse={upvoted}
              name='arrow-up'
              type='font-awesome'
              color={colors.escura2}
              size={15}
              style={styles.upvoteIcon}
            />
            <View style={styles.dateContainer}>
              <Text style={styles.dateText} numberOfLines={1}>{hours}</Text>
            </View>
          </View>
          <View style={styles.replyHeaderText}>
            <View>
              <Text style={styles.userText} numberOfLines={1}>{user}</Text>
            </View>
            <View >
              <Text style={styles.roleText} numberOfLines={1}>{role}</Text>
            </View>
            <View >
              <Text style={styles.roleText} numberOfLines={1}>{upvotes} {upvotes!=1 ? "upvotes" : "upvote" }</Text>
            </View>
            
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.textBody}>{body} </Text>
        </View>
        <View style={styles.replyDeleteContainer}>
            {id_usuarioResp==id_usuario && 
                <Icon
                onPress={() => excluirResp()}
                name='trash'
                type='font-awesome'
                color="#cc0000"
                raised={true}
                size={15}
                style={styles.headerIcon}
                />
            }
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
  replyHeader: { flexDirection: "row", padding: 0 },
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
  replyHeaderText: { flexDirection: "column", paddingLeft: 10, width: "80%" },
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
  replyDeleteContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: 'flex-end'
  },
});

//Talvez remover o padding deste component depois pq ele e um card. A pagina que tem ele e que precisa resolver o padding

export default Reply;
