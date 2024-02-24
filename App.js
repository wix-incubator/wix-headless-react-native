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
import {WIX_CLIENT_ID} from "@env";
import {Platform, SafeAreaView, StyleSheet} from "react-native";

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

    if (Platform.OS === 'web') {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.h1}>Hello User</Text>
                <br/>
                <Text style={styles.paragraph}>
                    Open Expo on your mobile device with scanning the QR code in the
                    application log under the start tab.
                </Text>
            </SafeAreaView>
        )
    }

    const clientId = WIX_CLIENT_ID || "";
    return (
        <PaperProvider>
            <QueryClientProvider client={queryClient}>
                <WixProvider
                    auth={OAuthStrategy({
                        clientId,
                    })}
                >
                    <WixSessionProvider clientId={clientId}>
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
                                                    Collections: "collections"
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
                                        },
                                        tabBarHideOnKeyboard: true,
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#ecf0f1",
        padding: 8,
    },
    paragraph: {
        margin: 8,
        fontSize: 16,
        textAlign: "center",
    },
    h1: {
        margin: 28,
        fontSize: 36,
        fontWeight: "bold",
        textAlign: "center",
    },
    h2: {
        margin: 16,
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
    },
});


export default App;