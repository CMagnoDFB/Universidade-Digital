import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
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
      flexDirection: "column",
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
  });

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(false);

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [usuarioObj, setUsuarioObj] = useState(null);

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
      var nomePerfil = uObj.nome;
      navigation.setOptions({
        headerTitle:
          "Página inicial de " +
          nomePerfil.substring(0, nomePerfil.indexOf(" ")),
      });

      var tagIds = [];
      if (uObj.tags) {
        uObj.tags.forEach((tag, i) => {
          tagIds.push(tag.id);
        });
        uObj.id_tags = tagIds;
      }
      setUsuarioObj(uObj);
      setItemsTags(parseTags(uObj.tags, true));
    } else {
      navigation.pop();
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
    navigation.pop();
    navigation.navigate("Login");
  };

  const carregarMais = async () => {
    setLoadingMorePosts(true);
    fetchPosts(null, true);
  };

  const criarPub = async () => {
    navigation.pop();
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

  const irPerfil = async () => {
    navigation.pop();
    navigation.navigate("ViewProfile", {
      visitedUsuario: usuarioObj.usuario,
      from: "Posts"
    });
  };

  return (
    <>
      <ScrollView>
        <View style={styles.buttonsContainer}>
          <Icon
            onPress={() => modoRecentes()}
            name="schedule"
            type="material"
            raised
            size={25}
            reverse={dark || modoExibicao === "recentes"}
            color={modoExibicao !== "recentes" ? colors.posts : colors.escura2}
            reverseColor={colors.buttonText}
            style={styles.headerIcon}
          />
          <Icon
            onPress={() => modoEmAlta()}
            name="local-fire-department"
            type="material"
            raised
            reverse={dark || modoExibicao === "em alta"}
            color={modoExibicao !== "em alta" ? colors.posts : colors.escura2}
            reverseColor={colors.buttonText}
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
            reverseColor={colors.buttonText}
            style={styles.headerIconRight}
          />
          <Icon
            onPress={() => irPerfil()}
            name="user"
            type="font-awesome"
            reverse={dark}
            raised
            size={25}
            style={styles.headerIcon}
          />
          <Icon
            onPress={() => efetuarLogout()}
            name="sign-out"
            type="font-awesome"
            reverse={dark}
            raised
            size={25}
            style={styles.headerIcon}
          />
          {false && (
            <Icon
              onPress={() => console.log("a ser feito..")}
              name="user"
              type="font-awesome"
              color={colors.card}
              raised
              size={25}
              style={styles.headerIconRight}
            />
          )}
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
                color={colors.background1}
                reverseColor={colors.buttonText}
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
