import {createDrawerNavigator} from "@react-navigation/drawer";
import {QueryClient, QueryClientProvider,} from "@tanstack/react-query";
import {OAuthStrategy, WixProvider} from "@wix/sdk-react";
import * as React from "react";
import "react-native-gesture-handler";
import {PaperProvider,} from "react-native-paper";
import "react-native-url-polyfill/auto";
import {WixSessionProvider,} from "./authentication/session";
import * as Crypto from "expo-crypto";
import {Navbar} from "./components/Navbar/Navbar";

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
                        <Navbar/>
                    </WixSessionProvider>
                </WixProvider>
            </QueryClientProvider>
        </PaperProvider>
    );
}

export default App;
