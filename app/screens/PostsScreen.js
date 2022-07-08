import React, { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, ActivityIndicator, BackHandler, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import Post from "../components/Post";
import FlashMessage, { showMessage } from "react-native-flash-message";
import DropDownPicker from "react-native-dropdown-picker";

import api from "./../../connectAPI";
import {
  checkLoginState,
  removeLoginState,
  getUserObject,
} from "./../../loginState";
import { BADGE_COLORS, parseTags, PAGE_LIMIT } from "./../config/consts";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import {Gravatar} from 'react-native-gravatar';

export default function PostsScreen({ navigation }) {
  const { colors, dark } = useTheme();

  DropDownPicker.addTranslation("BR", {
    PLACEHOLDER: "Selecione um elemento",
    SEARCH_PLACEHOLDER: "Digite algo...",
    SELECTED_ITEMS_COUNT_TEXT: "{count} elementos foram selecionados",
    NOTHING_TO_SHOW: "Nada a mostrar!",
  });

  DropDownPicker.setLanguage("BR");

  const styles = StyleSheet.create({
    buttonsContainer: {
      width: "100%",
      flexDirection: "row",
      marginHorizontal: 20,
    },
    headerIcon: {
      flexDirection: "column"
    },
    headerIconRight: {
      color: colors.background,
      flexDirection: "column",
    },
    loadingScreen: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    loadPostsContainer: {
      width: "100%",
      alignItems: "center",
      marginVertical: 15,
      marginBottom: 120,
    },
    createPostButton: {
      position: "absolute",
      bottom: 30,
      right: 30,
    },
    input: {
      height: 40,
      paddingHorizontal: "3%",
      backgroundColor: colors.text,
      fontSize: 14,
      borderRadius: 10,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.text,
    },
    inputMargin: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    dropdownContainer: {
      flexDirection: "column",
      width: "85%",
    },
    filterButtonContainer: {
      flexDirection: "column",
    },
    dropdown: {
      zIndex: 10,
      backgroundColor: colors.input,
      borderColor: colors.border,
      borderWidth: 1,
    },
    filterButton: {
      margin: 0,
    },
    roundedProfileImage: {
      width: 50,
      height: 50,
      borderWidth: 3,
      borderColor: colors.border,
      borderRadius: 50,
      marginLeft: 20
    }
  });

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(false);

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [usuarioObj, setUsuarioObj] = useState(null);
  const [email, setEmail] = useState(null);

  const [modoExibicao, setModoExibicao] = useState("recentes");
  const [numPagina, setNumPagina] = useState(1);

  const [postList, setPostList] = useState([]);

  const [openTags, setOpenTags] = useState(false);
  const [valueTags, setValueTags] = useState([]);
  const [itemsTags, setItemsTags] = useState(parseTags());

  const showConnectionError = (i) => {
    showMessage({
      message: "Erro",
      description: "Erro de conexão.. Tente novamente",
      type: "danger",
    });
  };

  const fetchPosts = (codToken = null, more = false) => {
    const tk = token ? token : codToken;
    const nPg = more ? numPagina + 1 : 1;
    if (tk) {
      const modo =
        modoExibicao == "recentes" ? "fetchRecentPosts" : "fetchPopularPosts";
      var toSearchTags = usuarioObj.id_tags;
      if (valueTags.length > 0) {
        toSearchTags = valueTags;
      }
      api
        .get(modo, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${tk}`,
            "Content-Type": "application/json",
          },
          params: {
            pageNumber: nPg,
            limit: PAGE_LIMIT,
            id_usuario: usuarioObj.id,
            id_tags: toSearchTags,
          },
        })
        .then((result) => {
          if (result.data.publicacoes) {
            if (more) {
              setPostList(postList.concat(result.data.publicacoes));
              if (result.data.publicacoes.length > 0) {
                setNumPagina(numPagina + 1);
              }
            } else {
              setPostList(result.data.publicacoes);
            }

            setTimeout(() => {
              setLoadingPage(false);
              setLoadingMorePosts(false);
            }, 800);
          }
        })
        .catch((err) => {
          showConnectionError();
          console.log("erro: ", err);
        });
    }
  };

  const checkIfLogged = async () => {
    var data = await checkLoginState();
    var uObj = await getUserObject();
    if (data) {
      console.log(data.usuario + " está logado");
      setUsuario(data);
      setToken(data.token, false);
      var tagIds = [];
      if (uObj.tags) {
        uObj.tags.forEach((tag, i) => {
          tagIds.push(tag.id);
        });
        uObj.id_tags = tagIds;
      }
      setEmail(uObj.email);
      setUsuarioObj(uObj);
      setItemsTags(parseTags(uObj.tags, true));
    } else {
      navigation.navigate("Login");
    }
  };

  useEffect(() => {
    checkIfLogged();
  }, []);

  useEffect(() => {
    if (usuarioObj && postList.length == 0) {
      fetchPosts(token, false, usuarioObj.id);
    }
    if(usuarioObj) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => irPerfil(usuarioObj.usuario)}>
            <Gravatar options={{
              email: email,
              parameters: { "size": "50", "d": "mm" },
              secure: true
            }}
            style={styles.roundedProfileImage} 
            />
          </TouchableOpacity>
          
        ),
        headerRight: () => (
          <View style={{marginRight: '18%'}}>
            <Icon
                onPress={() => efetuarLogout()}
                name="sign-out"
                type="font-awesome"
                color={!dark ? colors.text : colors.text}
                size={25}
              />
          </View>
        ),
      });
    }
  }, [usuarioObj]);

  useEffect(() => {
    fetchPosts();
  }, [modoExibicao]);

  const modoRecentes = async () => {
    if (modoExibicao != "recentes") {
      setNumPagina(1);
      setModoExibicao("recentes");
      setLoadingPage(true);
      fetchPosts();
    }
  };

  const modoEmAlta = async () => {
    if (modoExibicao != "em alta") {
      setNumPagina(1);
      setModoExibicao("em alta");
      setLoadingPage(true);
      fetchPosts();
    }
  };

  const efetuarLogout = async () => {
    await removeLoginState();
    console.log("Usuário deslogado");
    navigation.navigate("Login");
  };

  const carregarMais = async () => {
    setLoadingMorePosts(true);
    fetchPosts(null, true);
  };

  const criarPub = async () => {
    navigation.navigate("CreatePosts");
  };

  const alternarFiltro = async () => {
    if (filterEnabled) {
      setValueTags([]);
    }
    setFilterEnabled(!filterEnabled);
  };

  const filtrarPubs = () => {
    setOpenTags(false);
    fetchPosts();
  };

  useEffect(() => {
    if (valueTags.length == 0) {
      fetchPosts();
    }
  }, [valueTags]);

  const irPerfil = async (usu) => {
    if (usu) {
      navigation.navigate("ViewProfile", {
        visitedUsuario: usu,
        from: "Posts"
      });
    }
  };

  BackHandler.addEventListener('hardwareBackPress', () => {
    efetuarLogout();
    return true;
  });

  return (
    <>
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => {setOpenTags(false)}}>
          <View style={styles.buttonsContainer}>
            <Icon
              onPress={() => modoRecentes()}
              name="schedule"
              type="material"
              raised
              size={25}
              reverse={dark || modoExibicao === "recentes"}
              color={modoExibicao !== "recentes" ? colors.posts : colors.escura2}
              reverseColor={modoExibicao !== "recentes" ? colors.text: colors.buttonText}
              style={styles.headerIcon}
            />
            <Icon
              onPress={() => modoEmAlta()}
              name="local-fire-department"
              type="material"
              raised
              reverse={dark || modoExibicao === "em alta"}
              color={modoExibicao !== "em alta" ? colors.posts : colors.escura2}
              reverseColor={modoExibicao !== "em alta" ? colors.text: colors.buttonText}
              size={25}
              style={styles.headerIcon}
            />
            <Icon
              onPress={() => alternarFiltro()}
              name="filter"
              type="font-awesome"
              raised
              size={25}
              reverse={dark || filterEnabled}
              color={!filterEnabled ? colors.posts : colors.escura2}
              reverseColor={!filterEnabled ? colors.text: colors.buttonText}
              style={styles.headerIconRight}
            />
          </View>
          {filterEnabled && (
            <View style={styles.inputMargin}>
              <View style={styles.dropdownContainer}>
                <DropDownPicker
                  style={[styles.dropdown]}
                  open={openTags}
                  value={valueTags}
                  items={itemsTags}
                  setOpen={setOpenTags}
                  setValue={setValueTags}
                  setItems={setItemsTags}
                  multiple={true}
                  min={0}
                  listMode="SCROLLVIEW"
                  mode="BADGE"
                  badgeDotColors={BADGE_COLORS}
                  badgeColors={colors.background}
                  badgeTextStyle={{ color: colors.text }}
                  placeholderStyle={{ color: colors.text }}
                  badgeStyle={{ borderColor: colors.border, borderWidth: 1 }}
                  labelStyle={{ color: colors.text }}
                  dropDownContainerStyle={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                  arrowStyle={{ color: colors.text }}
                  arrowIconStyle={{tintColor: colors.text2}}
                  listItemLabelStyle={{ color: colors.text }}
                  scrollViewProps={{ nestedScrollEnabled: true }}
                  placeholder="Selecione um item"
                />
              </View>
              <View style={styles.filterButtonContainer}>
                <Icon
                  onPress={() => filtrarPubs()}
                  name="search"
                  type="font-awesome"
                  raised
                  size={18}
                  reverse={true}
                  color={colors.post}
                  reverseColor={colors.text}
                  style={styles.filterButton}
                />
              </View>
            </View>
          )}
          <View>
            {postList.map((post, postKey) => {
              var tagNames = [];
              if (post.tags) {
                post.tags.forEach((tag, i) => {
                  tagNames.push(tag.nome);
                });
              }

              return (
                <Post
                  key={postKey}
                  navigation={navigation}
                  id={post.id}
                  role={post.usuario.cargo + " de " + post.usuario.curso}
                  tags={tagNames}
                  body={post.conteudo}
                  user={post.usuario.usuario}
                  nomeUser={post.usuario.nome}
                  date={post.data_pub}
                  upvotes={post.upvotes}
                  nRespostas={post.num_respostas}
                  userUpvoted={post.upvote_publicacaos.length > 0}
                  id_usuario={usuarioObj.id}
                  token={token}
                />
              );
            })}
          </View>
          <View style={styles.loadPostsContainer}>
            {!loadingMorePosts && (
              <Icon
                onPress={() => carregarMais()}
                name="chevron-down"
                type="font-awesome"
                color={colors.post}
                reverseColor={colors.text}
                raised
                reverse
                size={25}
                style={styles.headerIcon}
              />
            )}
            {loadingMorePosts && <ActivityIndicator size={70} color={colors.loading}/>}
          </View>
          
        </TouchableWithoutFeedback>
        </ScrollView>
        <View style={styles.createPostButton}>
          <Icon
            onPress={() => criarPub()}
            name="plus"
            type="font-awesome"
            color={colors.escura2}
            reverse
            raised
            size={30}
            style={styles.headerIcon}
          />
        </View>
        {loadingPage && (
          <View style={styles.loadingScreen}>
            <ActivityIndicator size={70} color={colors.loading} />
          </View>
        )}
    </>
  );
}

// Para simplificar o projeto, creio que devamos limitar uma tag por post
