import { useWixAuth, useWixModules } from "@wix/sdk-react";
import * as SecureStore from "expo-secure-store";
import * as React from "react";
import "react-native-gesture-handler";
import "react-native-url-polyfill/auto";
import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { WebView } from "react-native-webview";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

/**
 * @type {React.Context<{
 *  session: import("@wix/sdk-react").Tokens,
 * setSession: (session: import("@wix/sdk-react").Tokens) => Promise<void>,
 * newVisitorSession: () => Promise<void> }>}
 */
const WixSessionContext = React.createContext(null);

export function WixSessionProvider(props) {
  const [session, setSessionState] = React.useState(null);
  const [sessionLoading, setSessionLoading] = React.useState(false);
  const auth = useWixAuth();

  const setSession = React.useCallback(
    async (tokens) => {
      auth.setTokens(tokens);
      await SecureStore.setItemAsync("wixSession", JSON.stringify(tokens));
      setSessionState(tokens);
      setSessionLoading(false);
    },
    [auth, setSessionState]
  );

  const newVisitorSession = React.useCallback(async () => {
    setSessionState(null);
    setSessionLoading(true);
    const tokens = await auth.generateVisitorTokens();
    setSession(tokens);
  }, [auth, setSessionState]);

  React.useEffect(() => {
    setSessionLoading(true);
    SecureStore.getItemAsync("wixSession").then((wixSession) => {
      if (!wixSession) {
        newVisitorSession();
      } else {
        setSession(JSON.parse(wixSession));
      }
    });
  }, []);

  if (!session) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <WixSessionContext.Provider
      value={{
        session,
        setSession,
        sessionLoading,
        setSessionLoading,
        newVisitorSession,
      }}
    >
      <LoginHandler />
      {props.children}
    </WixSessionContext.Provider>
  );
}

export function useWixSession() {
  const context = React.useContext(WixSessionContext);
  if (context === undefined) {
    throw new Error("useWixSession must be used within a WixSessionProvider");
  }
  return context;
}

/**
 *
 * @type {import("@wix/sdk-react").useWixModules}
 */
export function useWixSessionModules(modules) {
  useWixSession();
  return useWixModules(modules);
}

function LoginHandler() {
  const [loginState, setLoginState] = React.useState(null);
  const auth = useWixAuth();
  const { setSession, session, setSessionLoading } = useWixSession();

  const silentLoginMutation = useMutation(
    async () => {
      setSessionLoading(true);
      const data = auth.generateOAuthData(
        Linking.createURL("/oauth/wix/callback")
      );
      const { authUrl } = await auth.getAuthUrl(data, {
        prompt: "none",
      });
      return { authUrl, data };
    },
    {
      onSuccess: async ({ authUrl, data }) => {
        setLoginState({
          url: authUrl,
          data,
        });
      },
    }
  );

  React.useEffect(() => {
    Linking.addEventListener("url", async (event) => {
      const url = new URL(event.url);
      const wixMemberLoggedIn = url.searchParams.get("wixMemberLoggedIn");
      const requiresSilentLogin =
        wixMemberLoggedIn === "true" && session.refreshToken.role !== "member";
      if (requiresSilentLogin) {
        silentLoginMutation.mutate();
      } else if (
        event.url.startsWith(Linking.createURL("/oauth/wix/callback"))
      ) {
        setSessionLoading(true);
        const oauthData = JSON.parse(
          await SecureStore.getItemAsync("oauthState")
        );
        // need to use parseFromUrl but it should get the url from the event
        // then we can polyfill the URLSearchParams and the URL class
        const theURL = new URL(event.url);
        const params = new URLSearchParams(theURL.hash.substring(1));
        const tokens = await auth.getMemberTokens(
          params.get("code"),
          params.get("state"),
          oauthData
        );
        setSession(tokens);
      }
    });
  }, []);

  if (!loginState) {
    return null;
  } else {
    return (
      <WebView
        source={{ uri: loginState.url }}
        originWhitelist={["exp://*"]}
        containerStyle={{ display: "none" }}
        onShouldStartLoadWithRequest={(request) => {
          if (
            request.url.startsWith(Linking.createURL("/oauth/wix/callback"))
          ) {
            const { code, state } = auth.parseFromUrl(
              request.url,
              loginState.data
            );
            auth
              .getMemberTokens(code, state, loginState.data)
              .then((tokens) => {
                setSession(tokens);
                setLoginState(null);
              });
            return false;
          }
          return true;
        }}
      />
    );
  }
}
