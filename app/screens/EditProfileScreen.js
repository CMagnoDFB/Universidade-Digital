import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, ScrollView, View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";

import colors from "../config/colors";
import FlashMessage, { showMessage } from "react-native-flash-message";
import DropDownPicker from "react-native-dropdown-picker";

import api from "./../../connectAPI"
import {CARGO_VALUES, CURSO_VALUES, CAMPUS_VALUES } from "./../config/consts"
import { saveLoginState, checkLoginState, saveUserObject, getUserObject } from "./../../loginState"

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.branco
  },
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
    marginBottom: 20
  },
  dropdown: {
    zIndex: 10
  },
  buttonsContainer: {
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonsContainer2: {
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  buttonLogin: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 280,
    height: 70,
    borderRadius: 20,
    backgroundColor: colors.media2
  },
  buttonText: {
    padding:15,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 28
  },
});
export default function LoginScreen({ navigation }) {

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [usuarioObj, setUsuarioObj] = useState(null);

  const [nomeInput, setNomeInput] = useState("");

  const [openCargo, setOpenCargo] = useState(false);
  const [valueCargo, setValueCargo] = useState(null);
  const [itemsCargo, setItemsCargo] = useState(CARGO_VALUES);

  const [openCurso, setOpenCurso] = useState(false);
  const [valueCurso, setValueCurso] = useState(null);
  const [itemsCurso, setItemsCurso] = useState(CURSO_VALUES);

  const [openCampus, setOpenCampus] = useState(false);
  const [valueCampus, setValueCampus] = useState(null);
  const [itemsCampus, setItemsCampus] = useState(CAMPUS_VALUES);

  const [openTags, setOpenTags] = useState(false);
  const [valueTags, setValueTags] = useState([]);
  const [itemsTags, setItemsTags] = useState([
    {label: 'Disciplina 1', value: 2},
    {label: 'Disciplina 2', value: 3}
  ]);

  const checkIfLogged = async () => {
    var data = await checkLoginState();
    var uObj = await getUserObject();
    if (data) {
      console.log(data.usuario + " está logado");
      setUsuario(data.usuario);
      setToken(data.token);
      setUsuarioObj(uObj);
      setNomeInput(uObj.nome);
      setValueCargo(uObj.cargo);
      setValueCurso(uObj.curso);
      setValueCampus(uObj.campus);
    }else {
      navigation.pop();
      navigation.navigate('Login');
    }
  };
  
  useEffect(() => {
    checkIfLogged();
  }, []);

  const [loading, setLoading] = useState(false);

  const nomeChangeHandler = (i) => {
    setNomeInput(i.nativeEvent.text);
  };

  const efetuarEdicao = async () => {

    console.log("token: ", token);
    if (!loading) {
      setLoading(true);
      api.post("updateUser", {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        usuario: usuario,
        nome: nomeInput,
        cargo: valueCargo,
        curso: valueCurso,
        campus: valueCampus
      } ).then((dbUsuario) => {
        setLoading(false);
        saveUserObject(dbUsuario.data.usuario).then(() => {
          navigation.pop();
          navigation.navigate('Posts');
        });
        
      }).catch(err => {
        setLoading(false);
        console.log('error', err.response);
        showMessage({
          message: "Erro",
          description: "Erro ao salvar informações",
          type: "danger",
        });
      });
    }else {
      console.log("Já está carregando");
    }
    
  };

  const ignorarEdicao = async () => {
    saveUserObject(usuarioObj).then(() => {
      navigation.pop();
      navigation.navigate('Posts');
    });
  };

  return (
    <>
      <ImageBackground
        opacity={0.6}
        style={styles.background}
        blurRadius={3}
      >
        <ScrollView nestedScrollEnabled={true} style={styles.inputContainer}>

          <Text style={styles.textInput}>Nome</Text>
          <TextInput
            style={[styles.input,styles.inputMargin]}
            placeholder=""
            keyboardType="ascii-capable"
            onChange={nomeChangeHandler}
            value={nomeInput}
          />
          <Text style={styles.textInput}>Cargo</Text>
          <DropDownPicker
            style={[styles.inputMargin, styles.dropdown]}
            open={openCargo}
            onOpen={() => {setOpenTags(false);setOpenCurso(false);setOpenCampus(false)}}
            value={valueCargo}
            items={itemsCargo}
            setOpen={setOpenCargo}
            setValue={setValueCargo}
            setItems={setItemsCargo}
            listMode="SCROLLVIEW"
            scrollViewProps={{nestedScrollEnabled: true,}}
          />
          <Text style={styles.textInput}>Curso</Text>
          <DropDownPicker
            style={[styles.inputMargin, styles.dropdown]}
            open={openCurso}
            onOpen={() => {setOpenCargo(false);setOpenTags(false);setOpenCampus(false)}}
            value={valueCurso}
            items={itemsCurso}
            setOpen={setOpenCurso}
            setValue={setValueCurso}
            setItems={setItemsCurso}
            listMode="SCROLLVIEW"
            scrollViewProps={{nestedScrollEnabled: true,}}
          />
          <Text style={styles.textInput}>Câmpus</Text>
          <DropDownPicker
            style={[styles.inputMargin, styles.dropdown]}
            open={openCampus}
            onOpen={() => {setOpenCargo(false);setOpenCurso(false);setOpenTags(false)}}
            value={valueCampus}
            items={itemsCampus}
            setOpen={setOpenCampus}
            setValue={setValueCampus}
            setItems={setItemsCampus}
            listMode="SCROLLVIEW"
            scrollViewProps={{nestedScrollEnabled: true,}}
          />
          <Text style={styles.textInput}>Tags</Text>
          <DropDownPicker
            style={[styles.inputMargin, styles.dropdown]}
            open={openTags}
            onOpen={() => {setOpenCargo(false);setOpenCurso(false);setOpenCampus(false)}}
            value={valueTags}
            items={itemsTags}
            setOpen={setOpenTags}
            setValue={setValueTags}
            setItems={setItemsTags}
            multiple={true}
            min={0}
            max={5}
            listMode="SCROLLVIEW"
            scrollViewProps={{nestedScrollEnabled: true,}}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => efetuarEdicao()} disabled={loading}>
              <View
                style={{
                  ...styles.buttonLogin,
                  backgroundColor: loading ? "#3A8F95" : colors.media2 ,
                }}
              >
                {loading && <ActivityIndicator size="large" color="white" />}
                <Text style={{...styles.buttonText, display: loading ? 'none' : 'flex' }}>
                  Salvar
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonsContainer2}>
            <TouchableOpacity onPress={() => ignorarEdicao()} >
              <View style={styles.buttonLogin}>
                <Text style={styles.buttonText}>
                  Mais tarde
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
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
