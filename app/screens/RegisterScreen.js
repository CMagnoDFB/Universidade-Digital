import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, View, Text, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import CheckBox from "expo-checkbox";
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: "5%"
  },
  usuarioInput: {
    color: colors.branco,
    height: 40,
    fontSize: 18,
    fontFamily: "Mulish_500Medium"
  },
  input: {
    height: 40,
    paddingHorizontal: "3%",
    backgroundColor: colors.branco,
    fontSize: 14,
    bottom: "2%",
    fontFamily: "Mulish_500Medium",
    borderRadius: 10
  },
  checkboxContainer: {
    width: "100%",
    paddingVertical: "2%",
    flexDirection: "row"
  },
  checkbox: {
    backgroundColor: colors.branco
  }, 
  buttonsContainer: {
    width: "100%",
  },
  logoContainer: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: "2%",
    bottom: "0%"
  },
  u: {
    width: 105,
    height: 117,
  },
  textContainer: {
    justifyContent: "center",
    paddingLeft: 8
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
    color: colors.branco,
  },
  termos: {
    color: colors.branco,
    paddingHorizontal: "3%"
  }
});
export default function RegisterScreen({ navigation }) {

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

  const [usuarioInput, setUsuarioInput] = useState("");
  const [nomeInput, setNomeInput] = useState("Placeholder Ferreira dos Santos");
  const [emailInput, setEmailInput] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [confsenhaInput, setConfsenhaInput] = useState("");
  const [cargoInput, setCargoInput] = useState("Estudante");
  const [cursoInput, setCursoInput] = useState("Ciência da Computação");
  const [campusInput, setCampusInput] = useState("Pici");
  const [termosInput, setTermosInput] = useState(true);

  const usuarioChangeHandler = (i) => {
    setUsuarioInput(i.nativeEvent.text);
  };

  const emailChangeHandler = (i) => {
    setEmailInput(i.nativeEvent.text);
  };

  const senhaChangeHandler = (i) => {
    setSenhaInput(i.nativeEvent.text);
  };

  const confsenhaChangeHandler = (i) => {
    setConfsenhaInput(i.nativeEvent.text);
  };

  const termosChangeHandler = (i) => {
    console.log("checkbox: ", i);
    setTermosInput(i);
  };

  const efetuarCadastro = async () => {

    if ((senhaInput !== confsenhaInput) || !termosInput) {
      console.log("Senhas não batem ou termo nao foi aceito");
      return;
    }

    api.post("signup", {
      usuario: usuarioInput,
	    senha: senhaInput,
	    nome: nomeInput,
	    email: emailInput,
	    cargo: cargoInput,
	    curso: cursoInput,
	    campus: campusInput
    } ).then(({r}) => {
      console.log("Usuário criado");
      api.post("login", {
        usuario: usuarioInput,
        senha: senhaInput
      } ).then(({data}) => {
        saveLoginState(data.token).then(() => {
          console.log("retorno: ", data.token)
          navigation.navigate('Posts');
        }); 
      }).catch(err => {
        console.log('error', err.response);
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
          <Text style={styles.usuarioInput}>Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            keyboardType="ascii-capable"
            onChange={usuarioChangeHandler}
          />
          <Text style={styles.usuarioInput}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="usuario@email.com"
            keyboardType="email-address"
            onChange={emailChangeHandler}
          />
          <Text style={styles.usuarioInput}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry={true}
            keyboardType="ascii-capable"
            onChange={senhaChangeHandler}
          />
          <Text style={styles.usuarioInput}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry={true}
            keyboardType="ascii-capable"
            onChange={confsenhaChangeHandler}
          />
          <View style={styles.checkboxContainer}>
            <CheckBox
              title="Concordo com os Termos de Uso"
              style={styles.checkbox}
              value={termosInput}
              onValueChange={termosChangeHandler}
            ></CheckBox>
            <Text style={styles.termos}>Aceito os Termos de Uso</Text>
          </View>
          <View style={styles.buttonsContainer}>
          <AppButton
            title="Cadastrar"
            onPress={() => efetuarCadastro()}
            color="media2"
          />
        </View>
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
