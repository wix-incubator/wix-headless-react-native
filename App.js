import {NavigationContainer} from "@react-navigation/native";
import {QueryClient, QueryClientProvider,} from "@tanstack/react-query";
import {OAuthStrategy, WixProvider} from "@wix/sdk-react";
import * as Linking from "expo-linking";
import * as React from "react";
import "react-native-gesture-handler";
import {PaperProvider,} from "react-native-paper";
import "react-native-url-polyfill/auto";
import {WixSessionProvider,} from "./authentication/session";
import * as Crypto from "expo-crypto";
import {LoginHandler} from "./authentication/LoginHandler";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {tabs} from "./data/tabs/data";
import {TabBar} from "./components/Tabs/Tabs";
import {useFonts} from "expo-font";
import {LoadingIndicator} from "./components/LoadingIndicator/LoadingIndicator";

global.crypto = Crypto;

const Tab = createBottomTabNavigator();

const queryClient = new QueryClient();

function App() {
    const [fontsLoaded] = useFonts({
        "Fraunces-Regular": require("./assets/fonts/static/Fraunces_144pt-Regular.ttf"),
        "Fraunces-Bold": require("./assets/fonts/static/Fraunces_144pt-Bold.ttf"),
    });

    if (!fontsLoaded) {
        return <LoadingIndicator/>;
    }

    return (
        <PaperProvider>
            <QueryClientProvider client={queryClient}>
                <WixProvider
                    auth={OAuthStrategy({
                        clientId: "2d3621e3-87dc-4afa-bf42-089a29d16a4c",
                    })}
                >
                    <WixSessionProvider clientId="2d3621e3-87dc-4afa-bf42-089a29d16a4c">
                        <LoginHandler loginType={'custom'}>
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
                                                },
                                            },
                                        },
                                    },
                                }}
                            >
                                <Tab.Navigator
                                    screenOptions={({navigation, route}) => ({
                                        headerShown: false,
                                        tabBarLabelStyle: {
                                            fontSize: 11,
                                        },
                                        tabBarStyle: {
                                            backgroundColor: "#C4C197",
                                        }
                                    })}
                                    tabBar={(props) => <TabBar {...props} />}
                                >
                                    {tabs.map((tab) => (
                                        <Tab.Screen
                                            options={{
                                                tabBarIcon: tab.icon
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