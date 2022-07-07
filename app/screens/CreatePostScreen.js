import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, ScrollView, View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, BackHandler } from "react-native";

import FlashMessage, { showMessage } from "react-native-flash-message";
import DropDownPicker from "react-native-dropdown-picker";
import { Icon } from 'react-native-elements';

import api from "./../../connectAPI"
import { BADGE_COLORS, parseTags } from "./../config/consts"
import { checkLoginState, getUserObject } from "./../../loginState"
import { useTheme } from '@react-navigation/native';
import { color } from "react-native-elements/dist/helpers";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function CreatePostScreen({ navigation }) {
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
    },
    input: {
      padding: 10,
      backgroundColor: colors.input,
      fontSize: 14,
      borderRadius: 10,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      textAlignVertical: 'top'
    },
    inputMargin: {
      marginBottom: 20
    },
    dropdown: {
      zIndex: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.input
    },
    buttonsContainer: {
      width: "100%",
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40
      
    },
    buttonsContainerHeader: {
      width: "100%",
      flexDirection: "row",
      marginHorizontal: 20,
      marginTop: 10,
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
      color: colors.buttonText,
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
      backgroundColor: colors.background,
      zIndex: 10
    },

  });
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
      setIdUsuario(uObj.id);
      
      setItemsTags(parseTags(uObj.tags, true));
      setLoadingPage(false); 

    }else {
      navigation.pop();
      navigation.navigate('Login');
    }
  };
  
  useEffect(() => {
    checkIfLogged();
  }, []);

  const [loading, setLoading] = useState(false);

  const conteudoChangeHandler = (i) => {
    setConteudoInput(i.nativeEvent.text);
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

  BackHandler.addEventListener('hardwareBackPress', () => {
    voltar();
    return true;
  });

  return (
    <>
      <TouchableWithoutFeedback onPress={() => {setOpenTags(false)}}>
        <View style={styles.buttonsContainerHeader}>
          <Icon
            onPress={() => voltar()}
            name='chevron-left'
            type='font-awesome'
            color={colors.text}
            raised
            size={25}
            style={styles.headerIcon}
          />
        </View>
        <View style={styles.inputContainer}>

          <Text style={styles.textInput}>Conteúdo</Text>
          <TextInput
            style={[styles.input,styles.inputMargin]}
            placeholder=""
            keyboardType="ascii-capable"
            onChange={conteudoChangeHandler}
            value={conteudoInput}
            multiline={true}
            numberOfLines = {10}
          />
          <Text style={styles.textInput}>Tags</Text>
          <DropDownPicker
            style={[styles.inputMargin, styles.dropdown]}
            open={openTags}
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
            badgeColors={colors.background}
            badgeTextStyle={{color: colors.text}}
            badgeStyle={{borderColor: colors.border, borderWidth: 1}}
            labelStyle={{color: colors.text}}
            dropDownContainerStyle={{backgroundColor: colors.card, borderColor: colors.border}}
            arrowStyle={{color: colors.text}}
            listItemLabelStyle={{color: colors.text}}
            backgroundColor={colors.input}
            scrollViewProps={{nestedScrollEnabled: true}}
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
                  Publicar
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {loadingPage && 
          <View style={styles.loadingScreen}>
            <ActivityIndicator size={70} color={colors.loading} />
          </View>
        }
        <FlashMessage position="bottom" />
      </TouchableWithoutFeedback>
    </>
  );
}


// original:
// 150 por 168

// 70%:
// 105 por 117
//
