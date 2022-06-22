
import api from "./connectAPI"
import * as SecureStore from 'expo-secure-store';

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
                return data.data.usuario;
            }else {
                removeLoginState();
                return false;
            }
        }).catch(err => {
            console.log('error', err);
            return false;
        });
      
    }else{
        return false;
    }
};

module.exports = { saveLoginState, removeLoginState, checkLoginState }