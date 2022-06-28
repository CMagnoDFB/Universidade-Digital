import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import AppButton from "../components/AppButton";
import PostSeparator from "../components/PostSeparator";
import Post from "../components/Post";
import Constants from "expo-constants";

import { checkLoginState, removeLoginState, saveUserObject, getUserObject } from "./../../loginState"

const posts = [
  {
    id: 1,
    user: "Fulado de Tal",
    title: "Alguém sabe me informar isso?",
    tag: "Informação",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 2,
    user: "Cicrano",
    title: "Aviso pra quem come no RU",
    tag: "RU",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 3,
    user: "Cicrano",
    title: "Aviso pra quem come no RU",
    tag: "RU",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 4,
    user: "Cicrano",
    title: "Aviso pra quem come no RU",
    tag: "RU",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 5,
    user: "Beltrano",
    title: "Aviso pra quem come no RU",
    tag: "RU",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 6,
    user: "Cicrano",
    title: "Aviso pra quem come no RU",
    tag: "RU",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

export default function PostsScreen({ navigation }) {

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [usuarioObj, setUsuarioObj] = useState(null);

  const checkIfLogged = async () => {
    var data = await checkLoginState();
    var uObj = await getUserObject();
    if (data) {
      console.log(data.usuario + " está logado");
      setUsuario(data);
      setToken(data.token);
      setUsuarioObj(uObj);
    }else {
      navigation.pop();
      navigation.navigate('Login');
    }
  };
  
  useEffect(() => {
    checkIfLogged();
  }, []);

  
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

  return (
    <>
    <View style={styles.buttonsContainer}>
      <AppButton
        title="Sair"
        onPress={() => efetuarLogout()}
        color="media2"
      />
    </View>
    <View style={styles.buttonsContainer}>
      <AppButton
        title="Editar perfil"
        onPress={() => irEdicaoPerfil()}
        color="media2"
      />
    </View>
    
    <FlatList
      style={styles.screen}
      data={posts}
      keyExtractor={(post) => post.id.toString()}
      renderItem={({ item: post }) => (
        <Post
          title={post.title}
          tag={post.tag}
          body={post.body}
          user={post.user}
        />
      )}
      ItemSeparatorComponent={PostSeparator}
    />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
  },
  buttonsContainer: {
    width: "100%",
    paddingHorizontal: "20%",
  }
});

// Para simplificar o projeto, creio que devamos limitar uma tag por post
