import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import AppButton from "../components/AppButton";
import { Icon } from 'react-native-elements';
import Post from "../components/Post";

import { checkLoginState, removeLoginState, saveUserObject, getUserObject } from "./../../loginState"
import { ScrollView } from "react-native-gesture-handler";

const posts = [
  {
    id: 1,
    user: "Fulano de Tal",
    role: "Estudante de Ciência da Computação",
    date: "há 10 horas",
    tags: ["Métodos Numéricos II"],
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 2,
    user: "Cicrano",
    role: "Professor do DC",
    date: "há 10 horas",
    tags: ["CANA"],
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 3,
    user: "Cicrano",
    role: "Estudante de Ciência da Computação",
    date: "há 10 horas",
    tags: ["SGBD"],
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 4,
    user: "Cicrano",
    role: "Estudante de Ciência da Computação",
    date: "há 10 horas",
    tags: ["Métodos Numéricos II"],
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 5,
    user: "Beltrano",
    role: "Estudante de Ciência da Computação",
    date: "há 10 horas",
    tags: ["Métodos Numéricos II"],
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 6,
    user: "Cicrano",
    role: "Estudante de Ciência da Computação",
    date: "há 10 horas",
    tags: ["Engenharia de Software"],
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
    <ScrollView>
      <View style={styles.buttonsContainer}>
        <Icon
          onPress={() => efetuarLogout()}
          name='sign-out'
          type='font-awesome'
          color='#000'
          raised
          size={25}
          style={styles.headerIcon}
        />
        <Icon
          onPress={() => irEdicaoPerfil()}
          name='edit'
          type='font-awesome'
          color='#000'
          raised
          size={25}
          style={styles.headerIcon}
        />
        <Icon
          onPress={() => console.log("a ser feito..")}
          name='user'
          type='font-awesome'
          color='#000'
          raised
          size={25}
          style={styles.headerIconRight}
        />
      </View>
      
      <View >
        { 
          posts.map((post, postKey) => {
            return (
              <Post
                key={postKey}
                role={post.role}
                tags={post.tags}
                body={post.body}
                user={post.user}
                date={post.data_pub}
              />
            );
          })
        }
      </View>

    </ScrollView>
    
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
});

// Para simplificar o projeto, creio que devamos limitar uma tag por post
