import "react-native-gesture-handler";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import PostsScreen from "./app/screens/PostsScreen";
import EditProfileScreen from "./app/screens/EditProfileScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import CreatePostScreen from "./app/screens/CreatePostScreen";
import ViewPostScreen from "./app/screens/ViewPostScreen";
import ViewProfileScreen from "./app/screens/ViewProfileScreen";
import { Dark, Light } from "./app/themes/index";
import React  from "react";
import {
  NavigationContainer
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorScheme } from "react-native";
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
  const deviceTheme = useColorScheme();
  const dark = deviceTheme === "dark";
  const theme = dark ? Dark : Light;
  const colors = theme.colors;
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
    return <AppLoading backgroundColor={colors.background} color={colors.text}/>;
  } else {
    return (
      <NavigationContainer theme={theme}>
        <Stack.Navigator headerShown={true}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ 
              headerTitle: "Bem-vindo", 
              headerShown: true,
              headerTitleStyle: { fontSize: 25 },
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerTitle: "Entrar",
              headerShown: true,
              headerStyle: { backgroundColor: colors.header },
              headerTitleStyle: { color: colors.text, fontSize: 25 },
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerTitle: "Cadastrar",
              headerTransparent: true,
              headerStyle: { backgroundColor: colors.header },
              headerTitleStyle: { color: colors.text, fontSize: 25 },
            }}
          />
          <Stack.Screen
            name="Posts"
            component={PostsScreen}
            options={{
              headerTitle: "Publicações",
              headerStyle: { backgroundColor: colors.header },
              headerTitleStyle: {
                color: colors.text,
                fontSize: 25,
              }
            }}            
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              headerTitle: "Editar perfil",
              headerLeft: null,
              headerStyle: { backgroundColor: colors.header },
              headerTitleStyle: {
                color: colors.text,
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="CreatePosts"
            component={CreatePostScreen}
            options={{
              headerTitle: "Criar publicação",
              headerLeft: null,
              headerStyle: { backgroundColor: colors.header },
              headerTitleStyle: {
                color: colors.text,
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="ViewPost"
            component={ViewPostScreen}
            options={{
              headerTitle: "Publicação",
              headerLeft: null,
              headerStyle: { backgroundColor: colors.header },
              headerTitleStyle: {
                color: colors.text,
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="ViewProfile"
            component={ViewProfileScreen}
            options={{
              headerTitle: "Perfil de Usuário",
              headerLeft: null,
              headerStyle: { backgroundColor: colors.header },
              headerTitleStyle: {
                color: colors.text,
                fontSize: 25,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
