import {useWixAuth} from "@wix/sdk-react";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as React from "react";
import "react-native-gesture-handler";
import "react-native-url-polyfill/auto";
import {WebView} from "react-native-webview";
import {useWixSession} from "./session";

const LoginHandlerContext = React.createContext(null);

export function useLoginHandler() {
    return React.useContext(LoginHandlerContext);
}

export function LoginHandler(props) {
    const {setSession, session, setSessionLoading} = useWixSession();
    const [loginState, setLoginState] = React.useState(null);
    const auth = useWixAuth();
    const loginType = props?.loginType ?? "wix";

    const silentLogin = React.useCallback(
        async (sessionToken) => {
            const data = auth.generateOAuthData(
                Linking.createURL("/oauth/wix/callback")
            );
            const {authUrl} = await auth.getAuthUrl(data, {
                prompt: "none",
                sessionToken,
            });
            setLoginState({
                url: authUrl,
                data,
            });
        },
        [auth, setSessionLoading]
    );

    const login = React.useCallback(
        async (email, password) => {
            setSessionLoading(true);
            const result = await auth.login({
                email,
                password,
            });
            if (!result?.data?.sessionToken) {

                setSessionLoading(false);
                if (result?.loginState === "FAILURE") {
                    return Promise.reject("Email address or password is incorrect!");
                }
                return Promise.reject("An error occurred!");
            }
            await silentLogin(result.data.sessionToken);
        },
        [auth, setSessionLoading]
    );

    React.useEffect(() => {
        Linking.addEventListener("url", async (event) => {
            const url = new URL(event.url);
            const wixMemberLoggedIn = url.searchParams.get("wixMemberLoggedIn");
            const requiresSilentLogin =
                wixMemberLoggedIn === "true" && session.refreshToken.role !== "member";
            if (requiresSilentLogin) {
                silentLogin();
            } else if (
                event.url.startsWith(Linking.createURL("/oauth/wix/callback"))
            ) {
                setSessionLoading(true);
                const oauthData = JSON.parse(
                    await SecureStore.getItemAsync("oauthState")
                );
                const {code, state} = auth.parseFromUrl(event.url);
                const tokens = await auth.getMemberTokens(code, state, oauthData);
                setSession(tokens);
            }
        });
    }, []);

    return (
        <LoginHandlerContext.Provider value={{login, loginType}}>
            <LoginHandlerInvisibleWebview
                loginState={loginState}
                setLoginState={setLoginState}
            />
            {props.children}
        </LoginHandlerContext.Provider>
    );
}

function LoginHandlerInvisibleWebview(props) {
    const auth = useWixAuth();
    const {setSession} = useWixSession();

    if (!props.loginState) {
        return null;
    } else {
        return (
            <WebView
                source={{uri: props.loginState.url}}
                originWhitelist={["exp://*"]}
                containerStyle={{display: "none"}}
                onShouldStartLoadWithRequest={(request) => {
                    if (
                        request.url.startsWith(Linking.createURL("/oauth/wix/callback"))
                    ) {
                        const {code, state} = auth.parseFromUrl(
                            request.url,
                            props.loginState.data
                        );
                        auth
                            .getMemberTokens(code, state, props.loginState.data)
                            .then((tokens) => {
                                setSession(tokens);
                                props.setLoginState(null);
                            });
                        return false;
                    }
                    return true;
                }}
            />
        );
    }
}
