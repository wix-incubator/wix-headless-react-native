import "./polyfills";

import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OAuthStrategy, WixProvider } from "@wix/sdk-react";
import * as Linking from "expo-linking";
import * as React from "react";
import "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-url-polyfill/auto";
import { WixSessionProvider } from "./authentication/session";
import { LoginHandler } from "./authentication/LoginHandler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { tabs } from "./data/tabs/data";
import { TabBar } from "./components/Tabs/Tabs";
import { useFonts } from "expo-font";
import { LoadingIndicator } from "./components/LoadingIndicator/LoadingIndicator";

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

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
            <LoginHandler>
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
                          Product: "products/product",
                          Collections: "collections",
                        },
                      },
                    },
                  },
                }}
              >
                <Tab.Navigator
                  screenOptions={() => ({
                    headerShown: false,
                    tabBarLabelStyle: {
                      fontSize: 11,
                    },
                    tabBarStyle: {
                      backgroundColor: "#C4C197",
                    },
                    tabBarHideOnKeyboard: true,
                  })}
                  initialRouteName={tabs[0].name}
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
