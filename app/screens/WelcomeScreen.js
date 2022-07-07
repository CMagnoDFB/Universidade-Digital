import React from "react";
import { render } from "react-dom";
import { ImageBackground, StyleSheet, View, Text, Image } from "react-native";

import AppButton from "../components/AppButton";
import { useTheme } from '@react-navigation/native';

export default function WelcomeScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    background: {
      flex: 1,
    },
    buttonsContainer: {
      width: "100%",
      padding: 20,
      position: "absolute",
      bottom: 20,
    },
    logoContainer: {
      justifyContent: "center",
      marginTop: 100,
      flexDirection: "row",
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
    },
  });
  return (
    <>
      <ImageBackground
        opacity={0}
        source={require("../assets/background.jpg")}
        style={styles.background}
        blurRadius={3}
      >
        <View style={styles.logoContainer}>
          <Image style={styles.u} source={require("../assets/U.png")} />
          <View style={styles.textContainer}>
            <Text style={styles.uni}>UNIVERSIDADE</Text>
            <Text style={styles.digi}>DIGITAL</Text>
            <Text style={styles.moto}>AMBIENTE ACADÊMICO CONECTADO</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <AppButton
            title="Entrar"
            onPress={() => navigation.navigate('Login')}
            color="media2"
          />
          <AppButton
            title="Registrar-se"
            onPress={() => navigation.navigate('Register')}
            color="escura1"
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
