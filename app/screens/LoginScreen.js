import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, BackHandler } from "react-native";

import FlashMessage, { showMessage } from "react-native-flash-message";
import { Icon } from "react-native-elements";
import api from "./../../connectAPI"
import { saveLoginState, checkLoginState, saveUserObject } from "./../../loginState"

import { useTheme } from '@react-navigation/native';

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: colors.background
    },
    inputContainer: {
      width: "100%",
      padding: 20,
      position: "absolute",
      bottom: "30%"
    },
    usuarioSenha: {
      height: 40,
      fontSize: 18,
      color: colors.text
    },
    input: {
      height: 40,
      paddingHorizontal: "3%",
      fontSize: 14,
      bottom: "5%",
      borderRadius: 10,
      color: colors.text,
      backgroundColor: colors.input,
      borderWidth: 2,
      borderColor: colors.border
    },
    buttonsContainer: {
      width: "100%",
      padding: 20,
      position: "absolute",
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
      borderRadius: 20,
      borderColor: colors.text
    },
    buttonText: {
      padding:15,
      fontWeight: "bold",
      fontSize: 28,
      color: colors.buttonText
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
      color: colors.text
    },
    digi: {
      fontSize: 55,
      lineHeight: 55,
      color: colors.text
    },
    moto: {
      fontSize: 11.6,
      color: colors.text
    }
  });


  const showConnectionError = (i) => {
    showMessage({
      message: "Erro",
      description: "Erro de conex??o.. Tente novamente",
      type: "danger",
    });
  };

  const checkIfLogged = async () => {
    var data = await checkLoginState();
    if (data) {
      console.log(data.usuario);
      api.get("fetchUser", {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json'
        },
        params: {
          usuario: data.usuario
        }
      }).then((dbUsuario) => {
        saveUserObject(dbUsuario.data.usuario).then(() => {
          navigation.pop();
          if (dbUsuario.data.usuario.nome && dbUsuario.data.usuario.cargo && dbUsuario.data.usuario.curso && dbUsuario.data.usuario.campus) {
            navigation.navigate('Posts');
          }else {
            navigation.navigate('EditProfile');
          }
        });
        

      }).catch(err => {
        showConnectionError();
        console.log('error', err.response);
      });

    }
  };
  
  useEffect(() => {
    checkIfLogged();

    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Welcome')}
          >
          <Icon
            name="arrow-left"
            type="font-awesome"
            reverse
            reverseColor={colors.text}
            color={colors.header}
            size={20}
          /> 
        </TouchableOpacity>
      )
    });
  }, []);

  const [loading, setLoading] = useState(false);

  const [usuarioInput, setUsuarioInput] = useState("Fernando111");
  const [senhaInput, setSenhaInput] = useState("12345678");

  const usuarioChangeHandler = (i) => {
    setUsuarioInput(i.nativeEvent.text);
  };

  const senhaChangeHandler = (i) => {
    setSenhaInput(i.nativeEvent.text);
  };

  const efetuarLogin = async () => {

    if (!loading) {
      setLoading(true);
      api.post("login", {
        usuario: usuarioInput,
        senha: senhaInput
      } ).then(({data}) => {
        saveLoginState(data.token).then(() => {
          setLoading(false);
          const dbUsuario = data.usuario;
          saveUserObject(dbUsuario).then(() => {
            if (dbUsuario.nome && dbUsuario.cargo && dbUsuario.curso && dbUsuario.campus) {
              navigation.navigate('Posts');
            }else {
              navigation.navigate('EditProfile');
            }
          });
          
        }); 
      }).catch(err => {
        setLoading(false);
        console.log('error', err.response);
        showMessage({
          message: "Erro",
          description: "Usu??rio ou senha incorretos",
          type: "danger",
        });
      });
    }else {
      console.log("J?? est?? carregando");
    }
    
  };

  BackHandler.addEventListener('hardwareBackPress', () => {
    navigation.navigate('Welcome');
    return true;
  });

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
              <Text style={styles.moto}>AMBIENTE ACAD??MICO CONECTADO</Text>
            </View>
          </View>
          <Text style={styles.usuarioSenha}>Usu??rio</Text>
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
          <TouchableOpacity onPress={() => efetuarLogin()} disabled={loading}>
            <View
              style={{
                ...styles.buttonLogin,
                backgroundColor: loading ? "#3A8F95" : colors.media2 ,
              }}
            >
              {loading && <ActivityIndicator size="large" color="white" />}
              <Text style={{...styles.buttonText, display: loading ? 'none' : 'flex' }}>
                Entrar
              </Text>
            </View>
          </TouchableOpacity>
          

        </View>
      </ImageBackground>
      <FlashMessage position="bottom" />
    </>
  );
}


// original:
// 150 por 168

// 70%:
// 105 por 117
//
