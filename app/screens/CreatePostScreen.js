import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, ScrollView, View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";

import colors from "../config/colors";
import FlashMessage, { showMessage } from "react-native-flash-message";
import DropDownPicker from "react-native-dropdown-picker";

import api from "./../../connectAPI"
import { BADGE_COLORS, parseTags } from "./../config/consts"
import { checkLoginState, saveUserObject, getUserObject } from "./../../loginState"

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
  loadingScreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#fff"
  },

});
export default function CreatePostScreen({ navigation }) {

  const [loadingPage, setLoadingPage] = useState(true);

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [id_usuario, setIdUsuario] = useState(null);

  const [conteudoInput, setConteudoInput] = useState("");

  const [openTags, setOpenTags] = useState(false);
  const [valueTags, setValueTags] = useState([]);
  const [itemsTags, setItemsTags] = useState(parseTags());

  const showConnectionError = (i) => {
    showMessage({
      message: "Erro",
      description: "Erro de conexão.. Tente novamente",
      type: "danger",
    });
  };

  const checkIfLogged = async () => {
    var data = await checkLoginState();
    var uObj = await getUserObject();
    if (data) {
      console.log(data.usuario + " está logado");
      setUsuario(data.usuario);
      setToken(data.token);
      setNomeInput(uObj.nome);
      setValueCargo(uObj.cargo);
      setValueCurso(uObj.curso);
      setValueCampus(uObj.campus);
      setIdUsuario(uObj.id);
      
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

  const criarPublicacao = async () => {

    if (!loading) {
      setLoading(true);
      api.post("createPost", {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        conteudo: conteudoInput,
        id_usuario: id_usuario
      } ).then((dbPost) => {

        api.post("addPostTags", {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          id_publicacao: dbPost.data.publicacao.id,
          tags: valueTags,
          initial_tags: []
        }).then(() => {
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
          description: "Erro ao salvar informações",
          type: "danger",
        });
      });
    }else {
      console.log("Já está carregando");
    }
    
  };

  const voltar = async () => {
    navigation.pop();
    navigation.navigate('Posts');
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
            multiline={true}
            numberOfLines = {6}
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
            min={1}
            listMode="SCROLLVIEW"
            mode="BADGE"
            badgeDotColors={BADGE_COLORS}
            scrollViewProps={{nestedScrollEnabled: true,}}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => criarPublicacao()} disabled={loading}>
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
            <TouchableOpacity onPress={() => voltar()} >
              <View style={styles.buttonLogin}>
                <Text style={styles.buttonText}>
                  Mais tarde
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
      </ImageBackground>
      {loadingPage && 
        <View style={styles.loadingScreen}>
          <ActivityIndicator size={70} color={colors.media2} />
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