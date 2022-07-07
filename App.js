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
import {
  DefaultTheme,
  LightTheme,
  DarkTheme,
  NavigationContainer,
  ThemeProvider,
  useTheme,
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

// É melhor separar em 2 arquivos depois
const MyDarkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    background: "#181818",
    input: "#0A0A0A",
    post: "#202020",
    clara1: "#d9ed92",
    clara2: "#b5e48c",
    clara3: "#99d98c",
    media1: "#76c893",
    media2: "#52b69a",
    media3: "#34a0a4",
    media4: "#168aad",
    escura1: "#1a759f",
    escura2: "#1e6091",
    escura3: "#184e77",
    text: "#C0C0C0",
    text2: "#FFFFFF66",
    buttonText: "#fff",
    icon: "#000",
  },
};

const MyLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: "#E8E8E8",
    input: "#FFFFFF",
    post: "#FFFFFF",
    clara1: "#d9ed92",
    clara2: "#b5e48c",
    clara3: "#99d98c",
    media1: "#76c893",
    media2: "#52b69a",
    media3: "#34a0a4",
    media4: "#168aad",
    escura1: "#1a759f",
    escura2: "#1e6091",
    escura3: "#184e77",
    text2: "#00000066",
    buttonText: "#fff",
    icon: "#000",
  },
};

export default function App() {
  const deviceTheme = useColorScheme();
  const theme = deviceTheme === "dark" ? MyDarkTheme : MyLightTheme;
  const { colors } = useTheme();
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
      <NavigationContainer theme={theme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerTitle: "Entrar",
              headerTransparent: true,
              headerStyle: { backgroundColor: colors.background },
              headerTitleStyle: { color: colors.background, fontSize: 25 },
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerTitle: "Cadastrar",
              headerTransparent: true,
              headerStyle: { backgroundColor: colors.background },
              headerTitleStyle: { color: colors.background, fontSize: 25 },
            }}
          />
          <Stack.Screen
            name="Posts"
            component={PostsScreen}
            options={{
              headerTitle: "",
              headerLeft: null,
              headerStyle: { backgroundColor: colors.text },
              headerTitleStyle: {
                backgroundColor: colors.text,
                color: colors.background,
                fontSize: 25,
              },
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              headerTitle: "Editar perfil",
              headerLeft: null,
              headerStyle: { backgroundColor: colors.text },
              headerTitleStyle: {
                backgroundColor: colors.text,
                color: colors.background,
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
              headerStyle: { backgroundColor: colors.text },
              headerTitleStyle: {
                backgroundColor: colors.text,
                color: colors.background,
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
              headerStyle: { backgroundColor: colors.text },
              headerTitleStyle: {
                backgroundColor: colors.text,
                color: colors.background,
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
              headerStyle: { backgroundColor: colors.text },
              headerTitleStyle: {
                backgroundColor: colors.text,
                color: colors.background,
                fontSize: 25,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
