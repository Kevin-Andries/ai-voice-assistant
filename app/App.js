import { useEffect, useState } from "react";
import { AppRegistry, TouchableOpacity } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { name as appName } from "./app.json";
import Assistant from "./views/Assistant";
import SignUp from "./views/SignUp";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "./views/SignIn";
import Icon from "react-native-vector-icons/FontAwesome";
import Settings from "./views/Settings";
import Welcome from "./views/Welcome";

GoogleSignin.configure({
  webClientId:
    "174420886888-ju37hvjcgfj2p652gdi7ffhphpne6jkp.apps.googleusercontent.com",
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [initializingFirstLaunchState, setInitializingFirstLaunchState] =
    useState(true);
  const [user, setUser] = useState();
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  function onAuthStateChanged(user) {
    setUser(user);

    if (initializing) setInitializing(false);
  }

  async function checkIfFirstLaunch() {
    // await AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);
    try {
      const value = await AsyncStorage.getItem("isFirstLaunch");
      if (value === null) {
        await AsyncStorage.setItem("isFirstLaunch", "false");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setInitializingFirstLaunchState(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    checkIfFirstLaunch();
  }, []);

  if (initializing || initializingFirstLaunchState) return null;

  return (
    <PaperProvider>
      <NavigationContainer>
        {user ? (
          <Stack.Navigator>
            <Stack.Screen
              name="AIAssistant"
              component={Assistant}
              options={({ navigation }) => ({
                title: "AI Assistant",
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Settings")}
                  >
                    <Icon name="gear" size={30} color="grey" />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{ title: "Settings" }}
            />
          </Stack.Navigator>
        ) : (
          <>
            <Stack.Navigator>
              {isFirstLaunch && (
                <Stack.Screen name="Welcome" component={Welcome} />
              )}
              <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ title: "Sign In" }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ title: "Sign Up" }}
              />
            </Stack.Navigator>
          </>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
