import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView, KeyboardAvoidingView } from "react-native";
import CheckBox from "expo-checkbox";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';


import FlashMessage, { showMessage } from "react-native-flash-message";
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.escura2,
    bottom: "0%"
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
    padding: 20,
    bottom: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonLogin: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 280,
    height: 70,
    borderRadius: 20
  },
  buttonText: {
    padding:15,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 28
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

  const [loading, setLoading] = useState(false);

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

    if (!loading) {
      if (senhaInput !== confsenhaInput) {
        return showMessage({
          message: "Erro",
          description: "Senhas não coincidem.",
          type: "danger",
        });
      }
      if (!termosInput) {
        return showMessage({
          message: "Erro",
          description: "Você não aceitou os Termos de Uso.",
          type: "danger",
        });
      }
      setLoading(true);
      
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
            setLoading(false);
            navigation.navigate('Posts');
          }); 
        }).catch(err => {
          setLoading(false);
          console.log('error', err.response);
          showMessage({
            message: "Erro",
            description: "Ocorreu um erro ao realizar login",
            type: "danger",
          });
        });
        
      }).catch(err => {
        setLoading(false);
        console.log('error', err.response);
        showMessage({
          message: "Erro",
          description: "Ocorreu um erro ao realizar o cadastro",
          type: "danger",
        });
      });
    }else {
      console.log("Já está carregando");
    }

    
  };




  return (
    <>
        <KeyboardAwareScrollView contentContainerStyle={{flexDirection:'column', justifyContent: 'center'}}>
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
                <TouchableOpacity onPress={() => efetuarCadastro()} disabled={loading}>
                  <View
                    style={{
                      ...styles.buttonLogin,
                      backgroundColor: loading ? "#3A8F95" : colors.media2 ,
                    }}
                  >
                    {loading && <ActivityIndicator size="large" color="white" />}
                    <Text style={{...styles.buttonText, display: loading ? 'none' : 'flex' }}>
                      Cadastrar
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            <FlashMessage position="bottom" />
          </View>
      </KeyboardAwareScrollView>
    </>
  );
}


// original:
// 150 por 168

// 70%:
// 105 por 117
//
