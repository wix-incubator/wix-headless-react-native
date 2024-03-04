import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OAuthStrategy, WixProvider } from "@wix/sdk-react";
import * as Crypto from "expo-crypto";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-url-polyfill/auto";
import { LoginHandler } from "./authentication/LoginHandler";
import { WixSessionProvider } from "./authentication/session";
import { LoadingIndicator } from "./components/LoadingIndicator/LoadingIndicator";
import { TabBar } from "./components/Tabs/Tabs";
import { tabs } from "./data/tabs/data";

global.crypto = Crypto;

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

console.log(
  "maybe complete auth session",
  WebBrowser.maybeCompleteAuthSession()
);

function App() {
  const [fontsLoaded] = useFonts({
    "Fraunces-Regular": require("./assets/fonts/static/Fraunces_144pt-Regular.ttf"),
    "Fraunces-Bold": require("./assets/fonts/static/Fraunces_144pt-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <LoadingIndicator />;
  }

  const clientId = process.env.EXPO_PUBLIC_WIX_CLIENT_ID || "";
  return (
    <PaperProvider>
      <QueryClientProvider client={queryClient}>
        <WixProvider
          auth={OAuthStrategy({
            clientId,
          })}
        >
          <WixSessionProvider clientId={clientId}>
            <LoginHandler loginType={"custom"}>
              <NavigationContainer
                linking={{
                  prefixes: [Linking.createURL("/")],
                  config: {
                    screens: {
                      Store: {
                        path: "store",
                        screens: {
                          CheckoutThankYou: "checkout/thank-you",
                          Cart: "cart",
                          Products: "products",
                          Collections: "collections",
                        },
                      },
                    },
                  },
                }}
              >
                <Tab.Navigator
                  screenOptions={({ navigation, route }) => ({
                    headerShown: false,
                    tabBarLabelStyle: {
                      fontSize: 11,
                    },
                    tabBarStyle: {
                      backgroundColor: "#C4C197",
                    },
                    tabBarHideOnKeyboard: true,
                  })}
                  tabBar={(props) => <TabBar {...props} />}
                >
                  {tabs.map((tab) => (
                    <Tab.Screen
                      options={{
                        tabBarIcon: tab.icon,
                      }}
                      name={tab.name}
                      component={tab.component}
                      navigationKey={tab.name}
                      key={tab.name}
                    />
                  ))}
                </Tab.Navigator>
              </NavigationContainer>
            </LoginHandler>
          </WixSessionProvider>
        </WixProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
}

export default App;
