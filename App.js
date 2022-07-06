import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import PostsScreen from "./app/screens/PostsScreen";
import EditProfileScreen from "./app/screens/EditProfileScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import CreatePostScreen from "./app/screens/CreatePostScreen";
import ViewPostScreen from "./app/screens/ViewPostScreen";

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

import AppLoading from "expo-app-loading";
import {
  useFonts,
  Mulish_200ExtraLight,
  Mulish_300Light,
  Mulish_500Medium,
  Mulish_600SemiBold,
  Mulish_800ExtraBold,
  Mulish_900Black,
  Mulish_200ExtraLight_Italic,
  Mulish_300Light_Italic,
  Mulish_400Regular_Italic,
  Mulish_500Medium_Italic,
  Mulish_600SemiBold_Italic,
  Mulish_700Bold_Italic,
  Mulish_800ExtraBold_Italic,
  Mulish_900Black_Italic,
} from "@expo-google-fonts/mulish";

export default function App() {
  let fontsLoaded = useFonts({
    Mulish_200ExtraLight,
    Mulish_300Light,
    Mulish_500Medium,
    Mulish_600SemiBold,
    Mulish_800ExtraBold,
    Mulish_900Black,
    Mulish_200ExtraLight_Italic,
    Mulish_300Light_Italic,
    Mulish_400Regular_Italic,
    Mulish_500Medium_Italic,
    Mulish_600SemiBold_Italic,
    Mulish_700Bold_Italic,
    Mulish_800ExtraBold_Italic,
    Mulish_900Black_Italic,
  });
  if (!fontsLoaded) {
    return <AppLoading/>;
  } else {
    
    return (
      <NavigationContainer >
        <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}} />
          <Stack.Screen name="Login" component={LoginScreen} options={{headerTitle: 'Entrar', headerTransparent: true, headerTintColor: '#fff', headerTitleStyle: {color: '#fff', fontSize: 25}}} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{headerTitle: 'Cadastrar', headerTransparent: true, headerTintColor: '#fff', headerTitleStyle: {color: '#fff', fontSize: 25}}} />
          <Stack.Screen name="Posts" component={PostsScreen} options={{headerTitle: '', headerLeft: null,  headerTitleStyle: {color: '#000', fontSize: 25}}} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{headerTitle: 'Editar perfil', headerLeft: null,  headerTitleStyle: {color: '#000', fontSize: 25}}} />
          <Stack.Screen name="CreatePosts" component={CreatePostScreen} options={{headerTitle: 'Criar publicação', headerLeft: null,  headerTitleStyle: {color: '#000', fontSize: 25}}} />
          <Stack.Screen name="ViewPost" component={ViewPostScreen} options={{headerTitle: 'Publicação', headerLeft: null,  headerTitleStyle: {color: '#000', fontSize: 25}}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
