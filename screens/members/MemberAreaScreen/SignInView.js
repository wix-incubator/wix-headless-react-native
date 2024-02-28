import {useWixAuth} from "@wix/sdk-react";
import {useWixSession} from "../../../authentication/session";
import * as Linking from "expo-linking";
import {useMutation} from "@tanstack/react-query";
import * as SecureStorage from "expo-secure-store";
import {View} from "react-native";
import {WebView} from "react-native-webview";
import {LoginForm} from "../../../components/Form/LoginForm";
import {useState} from "react";

export const SignInView = ({showWixLoginHandler, showWixLogin}) => {
    const auth = useWixAuth();
    const {sessionLoading} = useWixSession();
    const [authUrl, setAuthUrl] = useState("");

    const isValidLoginUrl = async () => {
        const data = auth.generateOAuthData(
            Linking.createURL("oauth/wix/callback"),
            "stam"
        );

        const {authUrl} = await auth.getAuthUrl(data);

        const response = await fetch(authUrl);
        return response.ok;
    }

    const authSessionMutation = useMutation(
        async () => {
            showWixLoginHandler(false)
            if (!await isValidLoginUrl()) {
                console.error('Failed to fetch the URL, make sure to follow this guide: https://dev.wix.com/docs/go-headless/getting-started/setup/manage-urls/overview-of-urls');
                return Promise.reject('Failed to fetch the URL, make sure to follow this guide: https://dev.wix.com/docs/go-headless/getting-started/setup/manage-urls/overview-of-urls');
            }

            const data = auth.generateOAuthData(
                Linking.createURL("oauth/wix/callback"),
                "stam"
            );
            await SecureStorage.setItemAsync("oauthState", JSON.stringify(data));

            const {authUrl} = await auth.getAuthUrl(data);

            return authUrl;

        },
        {
            onSuccess: async (authUrl) => {
                if (!authUrl) {
                    console.error('Failed to fetch the URL');
                    return;
                }
                setAuthUrl(authUrl);
                showWixLoginHandler(true);
                // await WebBrowser.openBrowserAsync(authUrl, {});
            },
        }
    );

    return (
        <>
            {showWixLogin ? (
                <View style={{flex: 1, width: '100%', height: '100%'}}>
                    <WebView
                        style={{flex: 1}}
                        setSupportMultipleWindows={false}
                        contentMode={"mobile"}
                        source={{uri: authUrl}}
                        goBack={() => showWixLoginHandler(false)}
                        scalesPageToFit={true}
                        bounces={false}
                        scrollEnabled={false}
                        nestedScrollEnabled={true}
                        overScrollMode={'never'}
                    />
                </View>
            ) : (
                <LoginForm loading={authSessionMutation.isLoading || sessionLoading}
                           disabled={authSessionMutation.isLoading || sessionLoading}
                           onWixLogin={() => authSessionMutation.mutate()}/>
            )}
        </>
    );
}
