import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import AppButton from "../components/AppButton";
import { Icon } from 'react-native-elements';
import Post from "../components/Post";
import FlashMessage, { showMessage } from "react-native-flash-message";

import colors from "../config/colors"
import api from "./../../connectAPI"
import { checkLoginState, removeLoginState, saveUserObject, getUserObject } from "./../../loginState"
import { ScrollView } from "react-native-gesture-handler";

export default function PostsScreen({ navigation }) {

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [usuarioObj, setUsuarioObj] = useState(null);

  const [modoExibicao, setModoExibicao] = useState("recentes");
  const [numPagina, setNumPagina] = useState(1);

  const [postList, setPostList] = useState([]);

  const showConnectionError = (i) => {
    showMessage({
      message: "Erro",
      description: "Erro de conexão.. Tente novamente",
      type: "danger",
    });
  };

  const fetchPosts = (codToken=null, more=false) => {

    const tk = token ? token : codToken;
    const nPg = more ? numPagina+1 : 1

    if (tk) {
      const modo = modoExibicao=='recentes' ? "fetchRecentPosts" : "fetchPopularPosts";

      api.get(modo, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${tk}`,
          'Content-Type': 'application/json'
        },
        params: {
          pageNumber: nPg,
          limit: 10
        }
      }).then((result) => {
  
        if (result.data.publicacoes) {
          if (more) {
            setPostList(postList.concat(result.data.publicacoes));
            if (result.data.publicacoes.length > 0) {
              setNumPagina(numPagina+1);
            }
          }else {
            setPostList(result.data.publicacoes);
          }
          setLoadingPage(false);
          setLoadingMorePosts(false);
        }
        
      }).catch(err => {
        showConnectionError();
        console.log('dudu: ', err);
      });

    }
  };

  const checkIfLogged = async () => {
    var data = await checkLoginState();
    var uObj = await getUserObject();
    if (data) {
      console.log(data.usuario + " está logado");
      setUsuario(data);
      setToken(data.token);
      setUsuarioObj(uObj);

      fetchPosts(data.token);

    }else {
      navigation.pop();
      navigation.navigate('Login');
    }
  };
  
  useEffect(() => {
    checkIfLogged();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [modoExibicao]);

  const modoRecentes = async () => {
    if (modoExibicao != 'recentes') {
      setNumPagina(1);
      setModoExibicao("recentes");
      setLoadingPage(true);
      fetchPosts();
    }
  }

  const modoEmAlta = async () => {
    if (modoExibicao != 'em alta') {
      setNumPagina(1);
      setModoExibicao("em alta");
      setLoadingPage(true);
      fetchPosts();
    }
  }
  
  const efetuarLogout = async () => {
    await removeLoginState();
    console.log("Usuário deslogado");
    navigation.pop();
    navigation.navigate('Login');
  };

  const irEdicaoPerfil = async () => {
    await saveUserObject(usuarioObj);
    navigation.pop();
    navigation.navigate('EditProfile');
  };

  const carregarMais = async () => {
    setLoadingMorePosts(true);
    fetchPosts(null, true);
  };

  return (
    <>
    <ScrollView>
      <View style={styles.buttonsContainer}>
        <Icon
          onPress={() => modoRecentes()}
          name='schedule'
          type='material'
          color={colors.escura2}
          raised={!(modoExibicao == 'recentes')}
          reverse={modoExibicao == 'recentes'}
          size={25}
          style={styles.headerIcon}
        />
        <Icon
          onPress={() => modoEmAlta()}
          name='local-fire-department'
          type='material'
          color={colors.escura2}
          raised={!(modoExibicao == 'em alta')}
          reverse={modoExibicao == 'em alta'}
          size={25}
          style={styles.headerIcon}
        />
        <Icon
          onPress={() => efetuarLogout()}
          name='sign-out'
          type='font-awesome'
          color={colors.escura2}
          raised
          size={25}
          style={styles.headerIcon}
        />
        <Icon
          onPress={() => irEdicaoPerfil()}
          name='edit'
          type='font-awesome'
          color={colors.escura2}
          raised
          size={25}
          style={styles.headerIcon}
        />
        <Icon
          onPress={() => console.log("a ser feito..")}
          name='user'
          type='font-awesome'
          color={colors.escura2}
          raised
          size={25}
          style={styles.headerIconRight}
        />
      </View>
      
      <View >
        { 
          postList.map((post, postKey) => {
            var tagNames = [];
            if (post.tags) {
              post.tags.forEach((tag, i) => {
                tagNames.push(tag.nome);
              });
            }
            
            return (
              <Post
                key={postKey}
                id={post.id}
                role={post.usuario.cargo + ' de ' + post.usuario.curso}
                tags={tagNames}
                body={post.conteudo}
                user={post.usuario.nome}
                date={post.data_pub}
                upvotes={post.upvotes}
              />
            );
          })
        }
      </View>
      <View style={styles.loadPostsContainer}>
        {!loadingMorePosts && 
          <Icon
            onPress={() => carregarMais()}
            name='chevron-down'
            type='font-awesome'
            color={colors.escura2}
            raised
            size={25}
            style={styles.headerIcon}
          />
        }
        {loadingMorePosts && 
          <ActivityIndicator size={70} color={colors.escura2} />
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
  headerIcon: {
    flexDirection: "column",
  },
  headerIconRight: {
    flexDirection: "column",
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
