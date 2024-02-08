import {createDrawerNavigator} from "@react-navigation/drawer";
import {QueryClient, QueryClientProvider,} from "@tanstack/react-query";
import {OAuthStrategy, WixProvider} from "@wix/sdk-react";
import * as React from "react";
import "react-native-gesture-handler";
import {PaperProvider,} from "react-native-paper";
import "react-native-url-polyfill/auto";
import {WixSessionProvider,} from "./authentication/session";
import * as Crypto from "expo-crypto";
import {Tabs} from "./components/Tabs/Tabs";
import {useFonts} from "expo-font";

global.crypto = Crypto;

const Drawer = createDrawerNavigator();


const queryClient = new QueryClient();

function App() {
    const [fontsLoaded] = useFonts({
        "Fraunces-VariableFont_SOFT": require("./assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
        "Fraunces-Italic-VariableFont_SOFT": require("./assets/fonts/Fraunces-Italic-VariableFont_SOFT,WONK,opsz,wght.ttf"),
        "Fraunces-Regular": require("./assets/fonts/static/Fraunces_144pt-Regular.ttf"),
        "Fraunces-Italic": require("./assets/fonts/static/Fraunces_144pt-Italic.ttf"),
        "Fraunces-Bold": require("./assets/fonts/static/Fraunces_144pt-Bold.ttf"),
    });

    return (
        <PaperProvider>
            <QueryClientProvider client={queryClient}>
                <WixProvider
                    auth={OAuthStrategy({
                        clientId: process.env.WIX_CLIENT_ID || "",
                    })}
                >
                    <WixSessionProvider>
                        <Tabs/>
                    </WixSessionProvider>
                </WixProvider>
            </QueryClientProvider>
        </PaperProvider>
    );
}

export default App;
