import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import PostsScreen from "./app/screens/PostsScreen";
import RegisterScreen from "./app/screens/RegisterScreen";

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
    return <AppLoading />;
  } else {
    
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Posts" component={PostsScreen} options={{headerLeft: null}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
