import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, ActivityIndicator } from "react-native";
import AppButton from "../components/AppButton";
import { Icon } from 'react-native-elements';
import Reply from "../components/Reply";
import FlashMessage, { showMessage } from "react-native-flash-message";

import colors from "../config/colors"
import api from "./../../connectAPI"
import { checkLoginState, removeLoginState, saveUserObject, getUserObject } from "./../../loginState"
import { ScrollView } from "react-native-gesture-handler";

export default function ViewPostScreen({ navigation, route }) {

  const { id_publicacao } = route.params;

  const [loadingPage, setLoadingPage] = useState(true);

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [usuarioObj, setUsuarioObj] = useState(null);

  const [id, setId] = useState(null);
  const [conteudo, setConteudo] = useState("");
  const [idUsuarioPub, setIdUsuarioPub] = useState(null);
  const [descUsuario, setDescUsuario] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [dataPub, setDataPub] = useState("");
  const [horas, setHoras] = useState("");
  const [upvotes, setUpvotes] = useState(0);
  const [tagNames, setTagNames] = useState([]);
  const [userUpvoted, setUserUpvoted] = useState(false);

  const [replyList, setReplyList] = useState([]);

  const [conteudoResposta, setConteudoResposta] = useState("");

  const [upvoted, setUpvoted] = useState(userUpvoted);
  const [upvoteLoading, setUpvoteLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpvoted(userUpvoted);
  }, [userUpvoted]);

  const showConnectionError = (i) => {
    showMessage({
      message: "Erro",
      description: "Erro de conexão.. Tente novamente",
      type: "danger",
    });
  };

  const fetchPost = () => {

    api.get("fetchPost", {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        id_publicacao: id_publicacao,
        id_usuario: usuarioObj.id
      }
    }).then((result) => {

      if (result.data.publicacao) {
        const pub = result.data.publicacao;
        setConteudo(pub.conteudo);
        setIdUsuarioPub(pub.usuario.id);
        setDescUsuario(pub.usuario.cargo + ' de ' + pub.usuario.curso);
        setNomeUsuario(pub.usuario.nome);
        setDataPub(pub.data_pub);
        setUpvotes(pub.upvotes);
        setUserUpvoted(pub.upvote_publicacaos.length > 0);
        setReplyList(pub.resposta);

        const diffTime = Math.abs(new Date(pub.data_pub) - new Date(Date.now()));
        var timeAgo = Math.ceil(diffTime / (1000 * 60 * 60));
        if (timeAgo >= 24) {
          timeAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24)).toString() + "d";
        }else {
          timeAgo = timeAgo.toString() + "h";
        }
        setHoras(timeAgo);

        var tagNames = [];
        if (pub.tags) {
          pub.tags.forEach((tag, i) => {
            tagNames.push(tag.nome);
          });
        }
        setTagNames(tagNames);

        setLoadingPage(false);
      }
      
    }).catch(err => {
      showConnectionError();
      console.log('erro: ', err);
    });

  };

  const checkIfLogged = async () => {
    var data = await checkLoginState();
    var uObj = await getUserObject();
    if (data) {
      console.log(data.usuario + " está logado");
      setUsuario(data);
      setToken(data.token,false);
      setUsuarioObj(uObj);

    }else {
      navigation.pop();
      navigation.navigate('Login');
    }
  };
  
  useEffect(() => {
    checkIfLogged();
  }, []);

  useEffect(() => {
    if (token && usuarioObj && id_publicacao) {
      fetchPost();
    }
  }, [token, usuarioObj]);

  const conteudoRespostaChangeHandler = (i) => {
    setConteudoResposta(i.nativeEvent.text);
  };

  const upvotePost = async () => {
    
    if (!upvoteLoading) {
      setUpvoteLoading(true);
      setUpvoted(!upvoted);

      var modoUpvote;
      if (!upvoted) {
        modoUpvote = "upvotePost";
        setUpvotes(upvotes+1);
      }else {
        modoUpvote = "removeUpvotePost";
        setUpvotes(upvotes-1);
      }

      api.post(modoUpvote, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
        id_usuario: usuarioObj.id,
        id_publicacao: id_publicacao
      } ).then(() => {
        setUpvoteLoading(false);
      }).catch(err => {
        setUpvoteLoading(false);
        console.log('error', err.response);
      });

    }
  }

  const sendReply = async () => {
    
    if (!loading) {
      setLoading(true);

      api.post("createReply", {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
        conteudo: conteudoResposta,
        upvotes: 0,
        id_usuario: usuarioObj.id,
        id_publicacao: id_publicacao
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

  const excluirPub = async () => {
    api.post("deletePost", {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
      id_publicacao: id_publicacao
    } ).then(() => {
      navigation.pop();
      navigation.navigate('Posts');
    }).catch(err => {
      console.log('error', err.response);
    });

  }


  const voltar = async () => {
    navigation.pop();
    navigation.navigate('Posts');
  };

  return (
    <>
    <ScrollView>
      <View >
        <View style={styles.buttonsContainer}>
          <Icon
            onPress={() => voltar()}
            name='chevron-left'
            type='font-awesome'
            color={colors.escura2}
            raised={true}
            size={25}
            style={styles.headerIcon}
          />
          {usuarioObj && idUsuarioPub==usuarioObj.id && 
            <Icon
              onPress={() => excluirPub()}
              name='trash'
              type='font-awesome'
              color="#cc0000"
              raised={true}
              size={25}
              style={styles.headerIcon}
            />
          }
          
        </View>
      </View>
      <View>
        <View style={styles.card}>
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
                <Text style={styles.dateText} numberOfLines={1}>{horas}</Text>
              </View>
            </View>
            <View style={styles.postHeaderText}>
              <View>
                <Text style={styles.userText} numberOfLines={1}>{nomeUsuario}</Text>
              </View>
              <View >
                <Text style={styles.roleText} numberOfLines={1}>{descUsuario}</Text>
              </View>
              <View style={styles.tags}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  { 
                    tagNames.map((tag, tagKey) => {
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
            <Text style={styles.textBody} >{id}{conteudo} </Text>
          </View>
          <View style={styles.upvotesNumber}>
            <Text>{upvotes} {upvotes!=1 ? "upvotes" : "upvote" }</Text>
          </View>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.textInput}>{replyList.length} {replyList.length!=1 ? "respostas" : "resposta" }</Text>
        <TextInput
          style={[styles.input,styles.inputMargin]}
          placeholder=""
          keyboardType="ascii-capable"
          onChange={conteudoRespostaChangeHandler}
          value={conteudoResposta}
          multiline={true}
          numberOfLines = {8}
        />
        <View style={styles.sendContainer}>
          {!loading && 
            <Icon
              onPress={() => sendReply()}
              name='send'
              type='material'
              color={colors.escura2}
              raised={true}
              size={25}
              style={styles.headerIcon}
            />
          }
          {loading && 
            <ActivityIndicator size={40} color={colors.escura2} />
          }

          
        </View>
      </View>

      <View style={styles.repliesContainer}>
        { 
          replyList.map((reply, replyKey) => {
            return (
              <Reply
                key={replyKey}
                navigation={navigation}
                id={reply.id}
                role={reply.usuario.cargo + ' de ' + reply.usuario.curso}
                body={reply.conteudo}
                user={reply.usuario.nome}
                date={reply.data_pub}
                upvotes={reply.upvotes}
                userUpvoted={reply.upvote_resposta.length > 0}
                id_usuario={usuarioObj.id}
                id_usuarioResp={reply.usuario.id}
                id_publicacao={id_publicacao}
                token={token}
              />
            );
          })
        }
      </View>
    </ScrollView>
    {loadingPage && 
      <View style={styles.loadingScreen}>
        <ActivityIndicator size={70} color={colors.media2} />
      </View>
    }
    </>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    marginHorizontal: 20,
  },
  sendContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: 'flex-end',
    
  },
  headerIcon: {
    flexDirection: "column",
  },
  headerIconRight: {
    flexDirection: "column",
  },
  inputContainer: {
    width: "100%",
    padding: 20,
  },
  textInput: {
    color: colors.preto,
    height: 40,
    fontSize: 18,
  },
  input: {
    padding: 10,
    backgroundColor: colors.branco,
    fontSize: 14,
    borderRadius: 10,
    color: colors.preto,
    borderWidth: 1,
    borderColor: colors.preto,
    textAlignVertical: 'top'
  },
  inputMargin: {
    marginBottom: 20
  },
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
  upvotesNumber: {
    padding: 10,
  },
  repliesContainer: {
    marginBottom: 60
  },
  loadingScreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#fff"
  },
  loadPostsContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
  },
});

// Para simplificar o projeto, creio que devamos limitar uma tag por post
