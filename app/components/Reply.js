import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Icon } from 'react-native-elements';

import api from "./../../connectAPI";
import { dateDifference } from "./../config/consts";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from '@react-navigation/native';
import { color } from "react-native-elements/dist/helpers";

function Reply({ navigation, id, role, body, user, nomeUser, date, upvotes, userUpvoted, respostas, replyList, id_usuario, id_usuarioResp, id_publicacao, token }) {
  const {colors} = useTheme();  
  const styles = StyleSheet.create({
    card: {
      marginHorizontal: 20,
      marginVertical: 15,
      padding: 10,
      backgroundColor: colors.post,
      borderRadius: 30,
      elevation: 6,
    },
    replyHeader: { flexDirection: "row", padding: 0 },
    upvote: { flexDirection: "column" },
    childReply: {
      flexDirection: "column",
    },
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
    replyHeaderText: { flexDirection: "column", paddingLeft: 10, width: "80%" },
    userText: {
      textTransform: "capitalize",
      fontSize: 20,
      color: colors.text
    },
    childUserText: {
      textTransform: "capitalize",
      fontSize: 16,
      paddingTop: 20,
      color: colors.text,
      width: "86%"
    },
    roleText: {
      color: colors.text2
    },
    childRoleText: {
      color: colors.text2,
      width: "86%", 
    },
    timeAgoText: {
      color: colors.text2,
      position: 'absolute',
      left:     -34,
      top:      -30,
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
    childTextBody: {
      flex: 1, 
      flexWrap: "wrap",
      paddingTop: 5,
      color: colors.text,
      width: "70%"
    },
    replyReplyContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: 'center',
      marginTop: 5
    },
    replyReplyText: {
      color: colors.text
    },
    repliesContainer: {
      flexDirection: "row",
    },
    repliesPadding: {
      flexDirection: "column",
      paddingLeft: 45
    },
    repliesContent: {
      flexDirection: "column"
    },
    verticalLine: {
      height: '100%',
      width: 2,
      backgroundColor: '#bbb',
      flexDirection: "column",
      marginRight: 40
    },
    replyDeleteButton: {
      position: 'absolute',
      left:     310,
      top:      20,
    },
    replyReplyDeleteButton: {
      position: 'absolute',
      left:     -92,
      top:      16,
    },
    inputContainer: {
      marginTop: 40
    },
    input: {
      padding: 10,
      backgroundColor: colors.input,
      fontSize: 14,
      borderRadius: 10,
      color: colors.text,
      elevation: 6,
      textAlignVertical: 'top'
    },
    inputReplyReply: {
      padding: 10,
      backgroundColor: colors.input,
      fontSize: 14,
      borderRadius: 10,
      color: colors.text,
      borderColor: colors.border,
      borderWidth: 1,
      elevation: 1,
      textAlignVertical: 'top'
    },
    sendContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: 'flex-end',
    },
  });

  const [nUpvotes, setNUpvotes] = useState(upvotes);
  const [nRespostas, setNRespostas] = useState(respostas);
  const [upvoted, setUpvoted] = useState(userUpvoted);
  const [upvoteLoading, setUpvoteLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [conteudoInput, setConteudoInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpvoted(userUpvoted);
  }, [userUpvoted]);

  var timeAgo = dateDifference(date);

  const conteudoChangeHandler = (i) => {
    setConteudoInput(i.nativeEvent.text);
  };

  const upvoteReply = async () => {
    
    if (!upvoteLoading) {
        setUpvoteLoading(true);
        setUpvoted(!upvoted);

        var modoUpvote;
        if (!upvoted) {
            modoUpvote = "upvoteReply";
            setNUpvotes(nUpvotes+1);
        }else {
            modoUpvote = "removeUpvoteReply";
            setNUpvotes(nUpvotes-1);
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
    return Alert.alert(
      "Apagar resposta?",
      "Tem certeza que deseja apagar essa resposta?",
      [
        {
          text: "Sim",
          onPress: () => {
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
          },
        },
        {
          text: "Cancelar",
        },
      ]
    );

  }

  const excluirRespParaResp = async (id_resp) => {
    return Alert.alert(
      "Apagar resposta?",
      "Tem certeza que deseja apagar essa resposta?",
      [
        {
          text: "Sim",
          onPress: () => {
            api.post("deleteReplyToReply", {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
              id_resposta: id_resp,
              id_resposta_pai: id
            } ).then(() => {
              navigation.pop();
              navigation.navigate('ViewPost', {
                id_publicacao: id_publicacao
              });
            }).catch(err => {
              console.log('error', err.response);
            });
          },
        },
        {
          text: "Cancelar",
        },
      ]
    );
  }

  const sendReply = async () => {
    
    if (!loading) {
      setLoading(true);

      api.post("createReplyToReply", {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
        conteudo: conteudoInput,
        id_usuario: id_usuario,
        id_resposta: id
      } ).then(() => {
        setLoading(false);
        navigation.pop();
        navigation.navigate('ViewPost', {
          id_publicacao: id_publicacao
        });
      }).catch(err => {
        setLoading(false);
        console.log('error', err.response);
      });

    }
  }

  const visitarPerfil = async (usuarioClicked) => {
    navigation.pop();
    navigation.navigate("ViewProfile", {
      visitedUsuario: usuarioClicked,
      from: "Post",
      id_publicacao: id_publicacao
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.replyHeader}>
        <View style={styles.upvote}>
          <Icon
            onPress={() => upvoteReply()}
            raised
            name='arrow-up'
            type='font-awesome'
            size={15}
            reverse={true}
            color={!upvoted ? colors.background : colors.escura1}
            reverseColor={colors.buttonText}
            style={styles.upvoteIcon}
          />
          <View style={styles.dateContainer}>
            <Text style={styles.dateText} numberOfLines={1}>{timeAgo}</Text>
          </View>
        </View>
        <View style={styles.replyHeaderText}>
          <TouchableOpacity
              onPress={() => visitarPerfil(user)}
          >
            <Text style={styles.userText} numberOfLines={1}>{nomeUser}</Text>
          </TouchableOpacity>
          <View >
            <Text style={styles.roleText} numberOfLines={1}>{role}</Text>
          </View>
          <View >
            <Text style={styles.roleText} numberOfLines={1}>{nUpvotes} {nUpvotes!=1 ? "upvotes" : "upvote" }</Text>
          </View>
          
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.textBody}>{body} </Text>
      </View>
      <View style={styles.replyDeleteButton}>
          {id_usuarioResp==id_usuario && 
              <Icon
              onPress={() => excluirResp()}
              name='trash'
              type='font-awesome'
              raised={true}
              size={20}
              reverseColor="#f00"
              reverse={true}
              color={colors.background}
              style={styles.headerIcon}
              />
          }
      </View>
      {!showReplies && 
      <TouchableOpacity style={styles.replyReplyContainer} onPress={() => setShowReplies(!showReplies)}>
        <Text style={styles.replyReplyText}>{nRespostas} {nRespostas!=1 ? "respostas" : "resposta" }</Text>
      </TouchableOpacity>
      }
      
      {showReplies && 
      <View>
        <View style={styles.repliesContainer}>
          <View style={styles.repliesPadding}></View>
          <View style={styles.repliesContent}>
            { 
              replyList.map((reply, replyKey) => {
                var timeAgoReply = dateDifference(reply.data_pub);
                return (
                  <View style={styles.replyHeader} key={replyKey}>
                    <View style={styles.verticalLine}></View>
                    <View style={styles.childReply}>
                      <View>
                        <TouchableOpacity
                            onPress={() => visitarPerfil(reply.usuario.usuario)}
                        >
                          <Text style={styles.childUserText} numberOfLines={1}>{reply.usuario.nome}</Text>
                        </TouchableOpacity>
                        <View >
                          <Text style={styles.childRoleText} numberOfLines={1}>{reply.usuario.cargo + ' de ' + reply.usuario.curso}</Text>
                        </View>
                        <View>
                          <Text style={styles.timeAgoText} numberOfLines={1}>{timeAgoReply}</Text>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.childTextBody}>{reply.conteudo} </Text>
                      </View>
                      <View style={styles.replyReplyDeleteButton}>
                          {reply.usuario.id==id_usuario && 
                            <Icon
                            onPress={() => excluirRespParaResp(reply.id)}
                            name='trash'
                            type='font-awesome'
                            raised={true}
                            size={15}
                            reverseColor="#f00"
                            reverse={true}
                            color={colors.background}
                            style={styles.headerIcon}
                            />
                          }
                      </View>
                    </View>
                  </View>
                  
                );
              })
            }
          </View>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.inputReplyReply]}
            placeholder="Escreva uma resposta..."
            placeholderTextColor={colors.text2}
            keyboardType="ascii-capable"
            onChange={conteudoChangeHandler}
            value={conteudoInput}
            multiline={true}
            numberOfLines = {4}
          />
          <View style={styles.sendContainer}>
            {!loading && 
              <Icon
                onPress={() => sendReply()}
                name='send'
                type='material'
                size={20}
                reverse={true}
                color={colors.background}
                reverseColor={colors.escura1}
                style={styles.headerIcon}
              />
            }
            {loading && 
              <ActivityIndicator size={40} color={colors.escura2} />
            }

            
          </View>
        </View>
        <TouchableOpacity style={styles.replyReplyContainer} onPress={() => setShowReplies(!showReplies)}>
          <Text style={styles.replyReplyText}>Ocultar respostas</Text>
        </TouchableOpacity>
      </View>
      }
      
    </View>
  );
}

//Talvez remover o padding deste component depois pq ele e um card. A pagina que tem ele e que precisa resolver o padding

export default Reply;
