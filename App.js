import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { members } from "@wix/members";
import { OAuthStrategy, WixProvider } from "@wix/sdk-react";
import * as Linking from "expo-linking";
import * as React from "react";
import { Text, View } from "react-native";
import "react-native-gesture-handler";
import {
  ActivityIndicator,
  IconButton,
  PaperProvider,
} from "react-native-paper";
import "react-native-url-polyfill/auto";
import { MemberHeaderMenu } from "./authentication/MemberHeaderMenu";
import {
  WixSessionProvider,
  useWixSession,
  useWixSessionModules,
} from "./authentication/session";
import { MyOrdersScreen } from "./store/MyOrdersScreen";
import { StoreScreen } from "./store/StoreScreen";
import * as Crypto from "expo-crypto";
import { CustomLoginScreen } from "./store/CustomLoginScreen";
import { LoginHandler } from "./authentication/LoginHandler";

global.crypto = Crypto;

const Drawer = createDrawerNavigator();

function MemberNickname() {
  const { getCurrentMember } = useWixSessionModules(members);

  const memberDetails = useQuery(["memberDetails"], getCurrentMember);

  if (memberDetails.isLoading) {
    return <ActivityIndicator />;
  }

  if (memberDetails.isError) {
    return <Text>Error: {memberDetails.error.message}</Text>;
  }

  return <Text>{memberDetails.data.member.profile.nickname}</Text>;
}

function HomeScreen({ navigation }) {
  const { session } = useWixSession();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>
        Home Screen:{" "}
        {session.refreshToken.role === "member" ? (
          <MemberNickname />
        ) : (
          "Anonymous"
        )}
      </Text>
    </View>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <PaperProvider>
      <QueryClientProvider client={queryClient}>
        <WixProvider
          auth={OAuthStrategy({
            clientId: "2fb39349-3744-4242-920d-9ccd74af3229",
          })}
        >
          <WixSessionProvider clientId="2fb39349-3744-4242-920d-9ccd74af3229">
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
                        },
                      },
                    },
                  },
                }}
              >
                <Drawer.Navigator
                  screenOptions={({ navigation, route }) => ({
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
                        <MemberHeaderMenu navigation={navigation} />
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
                      drawerItemStyle: { display: "none" },
                      headerTitle: () => <Text>My Orders</Text>,
                    }}
                  />
                  <Drawer.Screen
                    name="CustomLogin"
                    component={CustomLoginScreen}
                    options={{
                      headerTitle: () => <Text>Custom Login</Text>,
                    }}
                  />
                </Drawer.Navigator>
              </NavigationContainer>
            </LoginHandler>
          </WixSessionProvider>
        </WixProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
}

export default App;
