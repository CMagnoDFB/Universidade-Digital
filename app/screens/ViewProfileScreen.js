import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import colors from "../config/colors";
import FlashMessage, { showMessage } from "react-native-flash-message";
import DropDownPicker from "react-native-dropdown-picker";

import api from "./../../connectAPI";
import {
  CARGO_VALUES,
  CURSO_VALUES,
  CAMPUS_VALUES,
  BADGE_COLORS,
  parseTags,
} from "./../config/consts";
import {
  checkLoginState,
  saveUserObject,
  getUserObject,
} from "./../../loginState";

const styles = StyleSheet.create({
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
    height: 40,
    paddingHorizontal: "3%",
    backgroundColor: colors.branco,
    fontSize: 14,
    borderRadius: 10,
    color: colors.preto,
    borderWidth: 1,
    borderColor: colors.preto,
  },
  inputMargin: {
    marginBottom: 20,
  },
  dropdown: {
    zIndex: 10,
  },
  buttonsContainer: {
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer2: {
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#fff",
  },
});
export default function ViewProfileScreen({ navigation, route }) {
  const [loadingPage, setLoadingPage] = useState(true);

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [id_usuario, setIdUsuario] = useState(null);

  const [nomeShow, setNome] = useState("");

  const [openCargo, setOpenCargo] = useState(false);
  const [cargoShow, setCargo] = useState("");
  const [itemsCargo, setItemsCargo] = useState(CARGO_VALUES);

  const [openCurso, setOpenCurso] = useState(false);
  const [cursoShow, setCurso] = useState("");
  const [itemsCurso, setItemsCurso] = useState(CURSO_VALUES);

  const [openCampus, setOpenCampus] = useState(false);
  const [campusShow, setCampus] = useState("");
  const [itemsCampus, setItemsCampus] = useState(CAMPUS_VALUES);

  const [openTags, setOpenTags] = useState(false);
  const [valueTags, setValueTags] = useState([]);
  const [valueInitialTags, setValueInitialTags] = useState([]);
  const [itemsTags, setItemsTags] = useState(parseTags());

  const showConnectionError = (i) => {
    showMessage({
      message: "Erro",
      description: "Erro de conexão.. Tente novamente",
      type: "danger",
    });
  };

  const checkIfLogged = async (profileVisited) => {
    var data = await checkLoginState();
    console.log(profileVisited);
    if (data) {
      api
        .get("fetchUser", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
          },
          params: {
            usuario: profileVisited,
          },
        })
        .then((dbUsuario) => {
          console.log(dbUsuario);
          //setNome(dbUsuario.datanome)
          //setCargos
          //setCursos
          //SetCampus
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
    checkIfLogged(route.params.visitedUsuario);
  }, []);

  const [loading, setLoading] = useState(false);

  const nomeChangeHandler = (i) => {
    setNomeInput(i.nativeEvent.text);
  };

  const ignorarEdicao = async () => {
    navigation.pop();
    navigation.navigate("Posts");
  };

  return (
    <>
      <ScrollView nestedScrollEnabled={true} style={styles.inputContainer}>
        <Text style={styles.textInput}>Nome</Text>
        <Text style={styles.textInput}>{nomeShow}</Text>

        <Text style={styles.textInput}>Cargo</Text>
        <Text style={styles.textInput}>{cargoShow}</Text>

        <Text style={styles.textInput}>Curso</Text>
        <Text style={styles.textInput}>{cursoShow}</Text>

        <Text style={styles.textInput}>Campus</Text>
        <Text style={styles.textInput}>{campusShow}</Text>

        <View style={styles.buttonsContainer2}>
          <TouchableOpacity onPress={() => ignorarEdicao()}>
            <View style={styles.buttonLogin}>
              <Text style={styles.buttonText}>Voltar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* {loadingPage && (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size={70} color={colors.media2} />
        </View>
      )} */}
      <FlashMessage position="bottom" />
    </>
  );
}

// original:
// 150 por 168

// 70%:
// 105 por 117
//
