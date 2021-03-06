import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView, KeyboardAvoidingView, BackHandler } from "react-native";
import CheckBox from "expo-checkbox";
import PassMeter from "react-native-passmeter";
import { Icon } from "react-native-elements";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { useTheme } from '@react-navigation/native';
import api from "./../../connectAPI"
import { saveLoginState, checkLoginState, saveUserObject } from "./../../loginState"

const USER_MAX_LEN = 30,
  USER_MIN_LEN = 3,
  PASS_MAX_LEN = 30,
  PASS_MIN_LEN = 8,
  PASS_LABELS = ["Muito curta", "Fraca", "Normal", "Forte", "Muito Forte"];

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: colors.background,
      heigth: "100%"
    },
    inputContainer: {
      width: "100%",
      paddingTop: 110,
      paddingVertical: 60,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
      bottom: "0%"
    },
    textInput: {
      color: colors.text,
      height: 40,
      fontSize: 18,
      fontFamily: "Mulish_500Medium"
    },
    input: {
      height: 40,
      paddingHorizontal: "3%",
      backgroundColor: colors.input,
      borderColor: colors.border,
      color: colors.text,
      borderWidth: 2,
      fontSize: 14,
      bottom: "2%",
      fontFamily: "Mulish_500Medium",
      borderRadius: 10
    },
    checkboxContainer: {
      width: "100%",
      paddingVertical: "14%",
      flexDirection: "row"
    },
    checkbox: {
      backgroundColor: colors.background
    }, 
    buttonsContainer: {
      width: "100%",
      padding: 20,
      paddingTop: 0,
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
      borderWidth: 2,
      borderColor: colors.border
    },
    buttonText: {
      padding:15,
      color: colors.buttonText,
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
      color: colors.text
    },
    digi: {
      fontSize: 55,
      lineHeight: 55,
      color: colors.text
    },
    moto: {
      fontSize: 11.6,
      color: colors.text,
    },
    termos: {
      color: colors.text,
      paddingHorizontal: "3%"
    },
    arrowBack: {
      marginLeft: 20
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

  const [usuarioInput, setUsuarioInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [confsenhaInput, setConfsenhaInput] = useState("");
  const [termosInput, setTermosInput] = useState(false);

  const usuarioChangeHandler = (i) => {
    setUsuarioInput(i.nativeEvent.text);
  };

  const emailChangeHandler = (i) => {
    setEmailInput(i.nativeEvent.text.toLowerCase());
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
      if (usuarioInput.indexOf(' ') >= 0) {
        return showMessage({
          message: "Erro",
          description: "Usu??rio n??o pode ter espa??o.",
          type: "danger",
        }); 
      }
      if (usuarioInput.length < USER_MIN_LEN) {
        return showMessage({
          message: "Erro",
          description: "Usu??rio deve ter pelo menos 3 caracteres.",
          type: "danger",
          position: "top"
        });
      }
      if (usuarioInput.length > USER_MAX_LEN) {
        return showMessage({
          message: "Erro",
          description: "Usu??rio pode ter no m??ximo 30 caracteres.",
          type: "danger",
        });
      }

      if (!( emailInput.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
        return showMessage({
          message: "Erro",
          description: "Email inv??lido.",
          type: "danger",
        });
      }
      if (senhaInput.length < PASS_MIN_LEN) {
        return showMessage({
          message: "Erro",
          description: `Senha precisa ter no m??nimo ${PASS_MIN_LEN} caracteres.`,
          type: "danger",
        });
      }
      if (senhaInput.length > PASS_MAX_LEN) {
        return showMessage({
          message: "Erro",
          description: `Senha pode ter no m??ximo ${PASS_MAX_LEN} caracteres.`,
          type: "danger",
        });
      }
      if (senhaInput !== confsenhaInput) {
        return showMessage({
          message: "Erro",
          description: "Senhas n??o coincidem.",
          type: "danger",
        });
      }
      if (!termosInput) {
        return showMessage({
          message: "Erro",
          description: "Voc?? n??o aceitou os Termos de Uso.",
          type: "danger",
        });
      }
      setLoading(true);
      
      

      api.post("signup", {
        usuario: usuarioInput,
        senha: senhaInput,
        nome: "",
        email: emailInput,
        cargo: "",
        curso: "",
        campus: ""
      } ).then(({r}) => {
        console.log("Usu??rio criado");
        api.post("login", {
          usuario: usuarioInput,
          senha: senhaInput
        } ).then(({data}) => {
          saveLoginState(data.token).then(() => {
            setLoading(false);
            saveUserObject(data.usuario).then(() => {
              navigation.pop();
              navigation.navigate('EditProfile');
            });
            
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
      console.log("J?? est?? carregando");
    }

    
  };

  BackHandler.addEventListener('hardwareBackPress', () => {
    navigation.navigate('Welcome');
    return true;
  });


  return (
    <>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.inputContainer}>
            <View style={styles.logoContainer}>
              <Image style={styles.u} source={require("../assets/U.png")} />
              <View style={styles.textContainer}>
                <Text style={styles.uni}>UNIVERSIDADE</Text>
                <Text style={styles.digi}>DIGITAL</Text>
                <Text style={styles.moto}>AMBIENTE ACAD??MICO CONECTADO</Text>
              </View>
            </View>
            <Text style={styles.textInput}>Usu??rio</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="ascii-capable"
              onChange={usuarioChangeHandler}
            />
            <Text style={styles.textInput}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="usuario@email.com"
              keyboardType="email-address"
              caretHidden = {false}
              autoCapitalize='none'
              onChange={emailChangeHandler}
            />
            <Text style={styles.textInput}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              secureTextEntry={true}
              keyboardType="ascii-capable"
              onChange={senhaChangeHandler}
            />
            <Text style={styles.textInput}>Confirmar senha</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              secureTextEntry={true}
              keyboardType="ascii-capable"
              onChange={confsenhaChangeHandler}
            />
            <PassMeter
              showLabels
              password={senhaInput}
              maxLength={PASS_MAX_LEN}
              minLength={PASS_MIN_LEN}
              labels={PASS_LABELS}
            />
            <View style={styles.checkboxContainer}>
              <CheckBox
                title="Concordo com os Termos de Uso"
                style={styles.checkbox}
                value={termosInput}
                onValueChange={termosChangeHandler}
                for
              ></CheckBox>
              <Text style={styles.termos} onPress={() => setTermosInput(!termosInput)}>Aceito os Termos de Uso</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => efetuarCadastro()} disabled={loading}>
                <View
                  style={{
                    ...styles.buttonLogin,
                    backgroundColor: loading ? "#3A8F95" : colors.media2 ,
                  }}
                >
                  {loading && <ActivityIndicator size="large" color={colors.loading} />}
                  <Text style={{...styles.buttonText, display: loading ? 'none' : 'flex' }}>
                    Cadastrar
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>          
        </ScrollView>
      </KeyboardAvoidingView>
      <FlashMessage position="bottom" />
    </>
  );
}


// original:
// 150 por 168

// 70%:
// 105 por 117
//
