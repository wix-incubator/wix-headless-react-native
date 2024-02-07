import {createDrawerNavigator} from "@react-navigation/drawer";
import {NavigationContainer} from "@react-navigation/native";
import {QueryClient, QueryClientProvider,} from "@tanstack/react-query";
import {OAuthStrategy, WixProvider} from "@wix/sdk-react";
import * as Linking from "expo-linking";
import * as React from "react";
import {Text, View} from "react-native";
import "react-native-gesture-handler";
import {IconButton, PaperProvider,} from "react-native-paper";
import "react-native-url-polyfill/auto";
import {MemberHeaderMenu} from "./authentication/MemberHeaderMenu";
import {WixSessionProvider,} from "./authentication/session";
import * as Crypto from "expo-crypto";
import {HomeScreen} from "./screens/home/HomeScreen";
import {StoreScreen} from "./screens/store/StoreScreen";
import {MyOrdersScreen} from "./screens/store/MyOrdersScreen";

global.crypto = Crypto;

const Drawer = createDrawerNavigator();


const queryClient = new QueryClient();

function App() {
    return (
        <PaperProvider>
            <QueryClientProvider client={queryClient}>
                <WixProvider
                    auth={OAuthStrategy({
                        clientId: process.env.WIX_CLIENT_ID || "",
                    })}
                >
                    <WixSessionProvider>
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
                            <Drawer.Navigator
                                screenOptions={({navigation, route}) => ({
                                    headerRight: () => (
                                        <View
                                            style={{
                                                marginRight: 10,
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                        >
                                            {route.name === "Store" && (
                                                <IconButton
                                                    icon="cart"
                                                    onPress={() => navigation.navigate("Cart")}
                                                />
                                            )}
                                            <MemberHeaderMenu navigation={navigation}/>
                                        </View>
                                    ),
                                })}
                            >
                                <Drawer.Screen
                                    name="Home"
                                    component={HomeScreen}
                                    options={{
                                        headerTitle: () => <Text>Home</Text>,
                                    }}
                                />
                                <Drawer.Screen
                                    name="Store"
                                    component={StoreScreen}
                                    options={{
                                        headerTitle: () => <Text>Store</Text>,
                                    }}
                                />
                                <Drawer.Screen
                                    name="MyOrders"
                                    component={MyOrdersScreen}
                                    options={{
                                        drawerItemStyle: {display: "none"},
                                        headerTitle: () => <Text>My Orders</Text>,
                                    }}
                                />
                            </Drawer.Navigator>
                        </NavigationContainer>
                    </WixSessionProvider>
                </WixProvider>
            </QueryClientProvider>
        </PaperProvider>
    );
}

export default App;
