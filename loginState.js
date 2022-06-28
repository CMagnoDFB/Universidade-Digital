
import api from "./connectAPI"
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveLoginState = async (token) => {
    await SecureStore.setItemAsync('secure_token', token);
    console.log("Token salvo");
};

const removeLoginState = async () => {
    await SecureStore.deleteItemAsync('secure_token');
    console.log("Token descartado");
    return true;
};

const checkLoginState = async () => {
    
    const token = await SecureStore.getItemAsync('secure_token');
    
    if (token) {
        return api.get("private" , 
        {
        headers: {
            'Authorization': `Bearer ${token}` 
        }
        }).then(({data}) => {
            if (data) {
                return {usuario: data.data.usuario, token: token};
            }else {
                removeLoginState();
                return false;
            }
        }).catch(err => {
            removeLoginState();
            console.log('errorCheckLoginState: ', err.response.data);
            return false;
        });
      
    }else{
        return false;
    }
};

const saveUserObject = async (usuario) => {
    if (usuario != null) {
        await AsyncStorage.setItem('user', JSON.stringify(usuario));
    console.log("Usuario salvo");
    }
};

const getUserObject = async () => {
    const user = await AsyncStorage.getItem('user');
    return user != null ? JSON.parse(user) : null;
};

module.exports = { saveLoginState, removeLoginState, checkLoginState, saveUserObject, getUserObject }