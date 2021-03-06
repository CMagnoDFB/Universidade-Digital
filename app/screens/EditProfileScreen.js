import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, BackHandler } from "react-native";

import FlashMessage, { showMessage } from "react-native-flash-message";
import DropDownPicker from "react-native-dropdown-picker";

import api from "./../../connectAPI"
import {CARGO_VALUES, CURSO_VALUES, CAMPUS_VALUES, BADGE_COLORS, parseTags } from "./../config/consts"
import { checkLoginState, saveUserObject, getUserObject } from "./../../loginState"
import { useTheme } from '@react-navigation/native';

import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    inputContainer: {
      width: "100%",
      padding: 20,
    },
    textInput: {
      color: colors.text,
      height: 40,
      fontSize: 18,
      zIndex: -11
    },
    input: {
      height: 40,
      paddingHorizontal: "3%",
      fontSize: 14,
      borderRadius: 10,
      color: colors.text,
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputMargin: {
      marginBottom: 20
    },
    dropdown: {
      zIndex: -10,
      color: colors.text,
      backgroundColor: colors.input,
      borderColor: colors.border,
      borderWidth: 1
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
    loadingScreen: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card
    },

  });
  const [loadingPage, setLoadingPage] = useState(true);

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [id_usuario, setIdUsuario] = useState(null);

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
  const [valueInitialTags, setValueInitialTags] = useState([]);
  const [itemsTags, setItemsTags] = useState(parseTags());

  const showConnectionError = (i) => {
    showMessage({
      message: "Erro",
      description: "Erro de conex??o.. Tente novamente",
      type: "danger",
    });
  };

  const checkIfLogged = async () => {
    var data = await checkLoginState();
    var uObj = await getUserObject();
    if (data) {
      console.log(data.usuario + " est?? logado");
      setUsuario(data.usuario);
      setToken(data.token);
      setNomeInput(uObj.nome);
      setValueCargo(uObj.cargo);
      setValueCurso(uObj.curso);
      setValueCampus(uObj.campus);
      setIdUsuario(uObj.id);
      var tagIds = [];
      if(uObj.tags) {
        uObj.tags.forEach((tag, i) => {
          tagIds.push(tag.id);
        });

        setValueInitialTags(tagIds);  
        setValueTags(tagIds); 
        
      }
      
      api.get("fetchTags", {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json'
        }
      }).then((dbTags) => {
        if(dbTags) {
          setItemsTags(parseTags(dbTags.data.tags));
          setLoadingPage(false); 
        }
        
      }).catch(err => {
        showConnectionError();
        setLoadingPage(false); 
        console.log('error', err.response);
      });

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
        var usuario = dbUsuario.data.usuario;

        api.post("addUserTags", {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          id_usuario: id_usuario,
          tags: valueTags,
          initial_tags: valueInitialTags
        }).then((dbTags) => {
          usuario.tags = dbTags.data.tags;
          saveUserObject(usuario);
          setLoading(false);
          navigation.pop();
          navigation.navigate('Posts');
        }).catch(err => {
          setLoading(false);
          showConnectionError();
          console.log('error', err.response);
        });

      }).catch(err => {
        setLoading(false);
        console.log('error', err.response);
        showMessage({
          message: "Erro",
          description: "Erro ao salvar informa????es",
          type: "danger",
        });
      });
    }else {
      console.log("J?? est?? carregando");
    }
    
  };

  const ignorarEdicao = async () => {
    navigation.pop();
    navigation.navigate('Posts');
  };

  BackHandler.addEventListener('hardwareBackPress', () => {
    ignorarEdicao();
    return true;
  });

  return (
    <>
      <ScrollView nestedScrollEnabled={true} style={styles.inputContainer}
      >
        <TouchableWithoutFeedback onPress={() => {setOpenCargo(false);setOpenCurso(false);setOpenCampus(false);setOpenTags(false)}}>
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
            placeholder="Selecione um Curso"
            labelStyle={{color: colors.text}}
            dropDownContainerStyle={{backgroundColor: colors.card, borderColor: colors.border}}
            placeholderStyle={{color: colors.text}}
            listItemLabelStyle={{color: colors.text}}
            arrowIconStyle={{tintColor: colors.text2}}
            scrollViewProps={{nestedScrollEnabled: false,}}
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
            placeholder="Selecione um Campus"
            placeholderStyle={{color: colors.text}}
            labelStyle={{color: colors.text}}
            dropDownContainerStyle={{backgroundColor: colors.card, borderColor: colors.border}}
            arrowIconStyle={{tintColor: colors.text2}}
            listItemLabelStyle={{color: colors.text}}
            scrollViewProps={{nestedScrollEnabled: true,}}
          />
          <Text style={styles.textInput}>Campus</Text>
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
            placeholder="Selecione um Curso"
            placeholderStyle={{color: colors.text}}
            labelStyle={{color: colors.text}}
            dropDownContainerStyle={{backgroundColor: colors.card, borderColor: colors.border}}
            listItemLabelStyle={{color: colors.text}}
            arrowIconStyle={{tintColor: colors.text2}}
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
            listMode="SCROLLVIEW"
            mode="BADGE"
            placeholder="Selecione as Tags"
            placeholderStyle={{color: colors.text}}
            badgeDotColors={BADGE_COLORS}
            badgeColors={colors.background}
            badgeTextStyle={{color: colors.text}}
            badgeStyle={{borderColor: colors.border, borderWidth: 1}}
            labelStyle={{color: colors.text}}
            dropDownContainerStyle={{backgroundColor: colors.card, borderColor: colors.border}}
            listItemLabelStyle={{color: colors.text}}
            arrowIconStyle={{tintColor: colors.text2}}
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
          </TouchableWithoutFeedback>
        </ScrollView>

        {loadingPage && 
          <View style={styles.loadingScreen}>
            <ActivityIndicator size={70} color={colors.loading} />
          </View>
        }
        <FlashMessage position="bottom" />
      
    </>
  );
}


// original:
// 150 por 168

// 70%:
// 105 por 117
//
