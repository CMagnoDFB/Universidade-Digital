import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, View, Text, Image, TextInput } from "react-native";

import AppButton from "../components/AppButton";
import colors from "../config/colors";

import api from "./../../connectAPI"
import { saveLoginState, checkLoginState } from "./../../loginState"

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.escura2
  },
  inputContainer: {
    width: "100%",
    padding: 20,
    position: "absolute",
    bottom: "30%",
  },
  usuarioSenha: {
    color: colors.branco,
    height: 40,
    fontSize: 18
  },
  input: {
    height: 40,
    paddingHorizontal: "3%",
    backgroundColor: colors.branco,
    fontSize: 14,
    bottom: "5%",
    borderRadius: 10
  },
  buttonsContainer: {
    width: "100%",
    padding: 20,
    position: "absolute",
    bottom: 20,
  },
  logoContainer: {
    justifyContent: "center",
    flexDirection: "row",
    bottom: "5%"
  },
  u: {
    width: 105,
    height: 117,
  },
  textContainer: {
    justifyContent: "center",
    paddingLeft: 8,
  },
  uni: {
    fontSize: 28,
    color: colors.branco
  },
  digi: {
    fontSize: 55,
    lineHeight: 55,
    color: colors.branco
  },
  moto: {
    fontSize: 11.6,
    color: colors.branco
  }
});
export default function LoginScreen({ navigation }) {

  const checkIfLogged = async () => {
    //await removeLoginState();
    if (await checkLoginState() != false) {
      console.log("Usuario já estava logado");
      navigation.navigate('Posts');
    }
  };
  
  useEffect(() => {
    checkIfLogged();
  }, []);

  const [usuarioInput, setUsuarioInput] = useState("Fernando111");
  const [senhaInput, setSenhaInput] = useState("12345678");

  const usuarioChangeHandler = (i) => {
    setUsuarioInput(i.nativeEvent.text);
  };

  const senhaChangeHandler = (i) => {
    setSenhaInput(i.nativeEvent.text);
  };

  const efetuarLogin = async () => {

    api.post("login", {
      usuario: usuarioInput,
	    senha: senhaInput
    } ).then(({data}) => {
      saveLoginState(data.token).then(() => {
        //console.log("retorno: ", data.token)
        navigation.navigate('Posts');
      }); 
    }).catch(err => {
      console.log('error', err.response);
    });
  };

  return (
    <>
      <ImageBackground
        opacity={0.6}
        style={styles.background}
        blurRadius={3}
      >
        <View style={styles.inputContainer}>
          <View style={styles.logoContainer}>
            <Image style={styles.u} source={require("../assets/U.png")} />
            <View style={styles.textContainer}>
              <Text style={styles.uni}>UNIVERSIDADE</Text>
              <Text style={styles.digi}>DIGITAL</Text>
              <Text style={styles.moto}>AMBIENTE ACADÊMICO CONECTADO</Text>
            </View>
          </View>
          <Text style={styles.usuarioSenha}>Usuário</Text>
          <TextInput
            style={styles.input}
            defaultValue={"Fernando111"}
            placeholder=""
            keyboardType="ascii-capable"
            onChange={usuarioChangeHandler}
          />
          <Text style={styles.usuarioSenha}>Senha</Text>
          <TextInput
            style={styles.input}
            defaultValue={"12345678"}
            placeholder=""
            secureTextEntry={true}
            keyboardType="ascii-capable"
            onChange={senhaChangeHandler}
          />
        </View>
        <View style={styles.buttonsContainer}>
          <AppButton
            title="Login"
            onPress={() => efetuarLogin()}
            color="media2"
          />
        </View>
      </ImageBackground>
    </>
  );
}


// original:
// 150 por 168

// 70%:
// 105 por 117
//
