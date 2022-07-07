import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from "react-native";

import FlashMessage, { showMessage } from "react-native-flash-message";
import { useTheme } from "@react-navigation/native";
import { Icon } from "react-native-elements";

import api from "./../../connectAPI";
import {
  checkLoginState,
} from "./../../loginState";
import {Gravatar} from 'react-native-gravatar';

export default function ViewProfileScreen({ navigation, route }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    profileContainer: {
      width: "100%",
      padding: 20,
    },
    label: {
      color: colors.text,
      height: 40,
      fontSize: 18,
      fontWeight: "600"
    },
    showText: {
      color: colors.text2,
      height: 40,
      fontSize: 18,
      fontWeight: "300"
    },
    buttonsContainer: {
      width: "100%",
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      marginBottom: 20,
    },
    buttonLogin: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: 280,
      height: 70,
      borderRadius: 20,
      backgroundColor: colors.media2,
    },
    buttonText: {
      padding: 15,
      color: "#fff",
      fontWeight: "bold",
      fontSize: 28,
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
    tags: { flexDirection: "row" },
    tag: {
      backgroundColor: colors.media1,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginTop: 2,
      marginRight: 6,
      fontWeight: "600",
      borderRadius: 10,
    },
    editUserButton: {
      position: "absolute",
      top: 20,
      right: 20,
    },
    userAvatarContainer: {

    },
    roundedProfileImage: {
      width: 100,
      height: 100,
      borderWidth: 3,
      borderColor: colors.border,
      borderRadius: 50
  }
  });

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [loadingPage, setLoadingPage] = useState(true);

  const [nomeShow, setNome] = useState("");

  const [usuarioShow, setUsuario] = useState("");

  const [cargoShow, setCargo] = useState("");

  const [cursoShow, setCurso] = useState("");

  const [campusShow, setCampus] = useState("");

  const [tagNames, setTagNames] = useState([]);

  const [numPubs, setNumPubs] = useState(0);

  const [numResps, setNumResps] = useState(0);

  const showConnectionError = (i) => {
    showMessage({
      message: "Erro",
      description: "Erro de conexão.. Tente novamente",
      type: "danger",
    });
  };

  const checkIfLogged = async () => {
    var data = await checkLoginState();
    if (data) {
      setUsername(data.usuario);
      api.get("fetchUser", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
          },
          params: {
            usuario: route.params.visitedUsuario,
          },
        })
        .then((dbUsuario) => {
          var usuRetrieved = dbUsuario.data.usuario;
          setNome(usuRetrieved.nome)
          setUsuario(usuRetrieved.usuario);
          setCargo(usuRetrieved.cargo);
          setCurso(usuRetrieved.curso);
          setCampus(usuRetrieved.campus);
          setNumPubs(usuRetrieved.numPubs);
          setNumResps(usuRetrieved.numRespostas);
          setEmail(usuRetrieved.email);
          var tagNames = [];
          if (usuRetrieved.tags) {
            usuRetrieved.tags.forEach((tag, i) => {
              tagNames.push(tag.nome);
            });
          }
          setTagNames(tagNames);
          setLoadingPage(false);
        })
        .catch((err) => {
          showConnectionError();
          setLoadingPage(false);
          console.log("error", err.response);
        });
    } else {
      navigation.pop();
      navigation.navigate("Login");
    }
  };

  useEffect(() => {
    checkIfLogged();
  }, []);

  const voltar = async () => {
    navigation.pop();
    if (route.params.from == 'Post') {
      navigation.navigate("ViewPost", {
        id_publicacao: route.params.id_publicacao
      });
    }else {
      navigation.navigate("Posts");
    }
    
  };

  BackHandler.addEventListener('hardwareBackPress', () => {
    voltar();
    return true;
  });

  const irEdicaoPerfil = async () => {
    navigation.pop();
    navigation.navigate("EditProfile");
  };

  return (
    <>
      <ScrollView nestedScrollEnabled={true} style={styles.profileContainer}>
        <Gravatar options={{
              email: email,
              parameters: { "size": "200", "d": "mm" },
              secure: true
            }}
            style={styles.roundedProfileImage} />
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.showText}>{nomeShow}</Text>

        <Text style={styles.label}>Usuário</Text>
        <Text style={styles.showText}>{usuarioShow}</Text>

        <Text style={styles.label}>Cargo</Text>
        <Text style={styles.showText}>{cargoShow}</Text>

        <Text style={styles.label}>Curso</Text>
        <Text style={styles.showText}>{cursoShow}</Text>

        <Text style={styles.label}>Campus</Text>
        <Text style={styles.showText}>{campusShow}</Text>

        <Text style={styles.label}>Publicações</Text>
        <Text style={styles.showText}>{numPubs}</Text>

        <Text style={styles.label}>Respostas</Text>
        <Text style={styles.showText}>{numResps}</Text>

        <Text style={styles.label}>Tags</Text>
        <View style={styles.tags}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {tagNames.map((tag, tagKey) => {
              return (
                <Text key={tagKey} style={styles.tag}>
                  {tag}{" "}
                </Text>
              );
            })}
          </ScrollView>
        </View>


        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => voltar()}>
            <View style={styles.buttonLogin}>
              <Text style={styles.buttonText}>Voltar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {username==usuarioShow &&
        <View style={styles.editUserButton}>
          <Icon
            onPress={() => irEdicaoPerfil()}
            name="edit"
            type="font-awesome"
            raised
            size={30}
            reverse={true}
            color={colors.post}
            reverseColor={colors.text}
            style={styles.headerIcon}
          />
        </View>
      }
      
      {loadingPage && (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size={70} color={colors.loading} />
        </View>
      )} 
    </>
  );
}

// original:
// 150 por 168

// 70%:
// 105 por 117
//
