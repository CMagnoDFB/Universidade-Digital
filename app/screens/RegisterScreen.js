import React from "react";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, View, Text, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import CheckBox from "expo-checkbox";
import AppButton from "../components/AppButton";
import colors from "../config/colors";

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.escura2,
  },
  inputContainer: {
    width: "100%",
    padding: 20,
    position: "absolute",
    bottom: "30%",
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
    bottom: "3%",
    fontFamily: "Mulish_500Medium",
    borderRadius: 10
  },
  checkboxContainer: {
    width: "100%",
    padding: 20,
    top: "68%"
  },
  checkbox: {
    backgroundColor: colors.branco
  }, 
  buttonsContainer: {
    width: "100%",
    top: "70%",
  },
  logoContainer: {
    justifyContent: "center",
    flexDirection: "row",
    bottom: "10%"
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
    color: colors.branco,
    fontFamily: "Mulish_400Regular",
  },
  digi: {
    fontSize: 55,
    lineHeight: 55,
    color: colors.branco,
    fontFamily: "Mulish_400Regular",
  },
  moto: {
    fontSize: 11.6,
    color: colors.branco,
    fontFamily: "Mulish_700Bold",
  }
});
export default function RegisterScreen({ navigation }) {
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
          />
          <Text style={styles.usuarioInput}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="usuario@email.com"
            keyboardType="email-address"
          />
          <Text style={styles.usuarioInput}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry={true}
            keyboardType="ascii-capable"
          />
          <Text style={styles.usuarioInput}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry={true}
            keyboardType="ascii-capable"
          />
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            disabled={false}
            value={true}
            title="Concordo com os Termos de Uso"
            style={styles.checkbox}
          ></CheckBox>
        </View>
        <View style={styles.buttonsContainer}>
          <AppButton
            title="Posts"
            onPress={() => navigation.navigate("Posts")}
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
