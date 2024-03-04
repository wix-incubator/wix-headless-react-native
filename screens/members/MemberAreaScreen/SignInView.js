import { useMutation } from "@tanstack/react-query";
import { useWixAuth } from "@wix/sdk-react";
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import * as Linking from "expo-linking";
import * as SecureStorage from "expo-secure-store";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useWixSession } from "../../../authentication/session";
import { LoginForm } from "../../../components/Form/LoginForm";

export const SignInView = ({ showLoginHandler, showLogin }) => {
  const auth = useWixAuth();
  const { sessionLoading } = useWixSession();
  const [authUrl, setAuthUrl] = useState("");

  const isValidLoginUrl = async () => {
    const data = auth.generateOAuthData(
      Linking.createURL("oauth/wix/callback"),
      "stam"
    );

    const { authUrl } = await auth.getAuthUrl(data);

    const response = await fetch(authUrl);
    return response.ok;
  };

  const authSessionMutation = useMutation(
    async () => {
      showLoginHandler(false);
      if (!(await isValidLoginUrl())) {
        console.error(
          "Failed to fetch the URL, make sure to follow this guide: https://dev.wix.com/docs/go-headless/getting-started/setup/manage-urls/overview-of-urls"
        );
        return Promise.reject(
          "Failed to fetch the URL, make sure to follow this guide: https://dev.wix.com/docs/go-headless/getting-started/setup/manage-urls/overview-of-urls"
        );
      }

      const data = auth.generateOAuthData(
        Linking.createURL("oauth/wix/callback"),
        "stam"
      );
      await SecureStorage.setItemAsync("oauthState", JSON.stringify(data));

      const { authUrl } = await auth.getAuthUrl(data);

      return authUrl;
    },
    {
      onSuccess: async (authUrl) => {
        if (!authUrl) {
          console.error("Failed to fetch the URL");
          return;
        }
        setAuthUrl(authUrl);
        showLoginHandler(true);
        // await WebBrowser.openBrowserAsync(authUrl, {});
      },
    }
  );

  const [{ authorizationEndpoint, sessionToken }, setAuthorizationEndpoint] =
    useState({ authorizationEndpoint: null, sessionToken: null });
  useEffect(() => {
    auth
      .getAuthUrl({
        state: "1",
      })
      .then(({ authUrl: authUrlAsString }) => {
        const authUrlASUrl = new URL(authUrlAsString);
        const authorizationEndpoint =
          authUrlASUrl.protocol +
          "//" +
          authUrlASUrl.host +
          authUrlASUrl.pathname;
        const sessionToken = authUrlASUrl.searchParams.get("sessionToken");
        setAuthorizationEndpoint({ authorizationEndpoint, sessionToken });
      });
  }, []);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_WIX_CLIENT_ID,
      redirectUri: makeRedirectUri({
        path: "/callbacckkkkk",
      }),
      scopes: ["offline_access"],
      extraParams: {
        sessionToken,
      },
      usePKCE: true,
      prompt: "login",
    },
    {
      authorizationEndpoint,
      tokenEndpoint: "https://www.wixapis.com/oauth2/token",
    }
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      exchangeCodeAsync(
        {
          code,
          clientId: process.env.EXPO_PUBLIC_WIX_CLIENT_ID,
          redirectUri: makeRedirectUri({
            path: "/callbacckkkkk",
          }),
          extraParams: {
            code_verifier: request?.codeVerifier,
          },
        },
        {
          tokenEndpoint: "https://www.wixapis.com/oauth2/token",
        }
      )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(Object.keys(error));
          console.error(JSON.stringify(error));
          console.error(error);
        });
      console.log(code);
    }
  }, [response]);

  return (
    <>
      {showLogin ? (
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
          <WebView
            style={{ flex: 1 }}
            setSupportMultipleWindows={false}
            contentMode={"mobile"}
            source={{ uri: authUrl }}
            goBack={() => showLoginHandler(false)}
            scalesPageToFit={true}
            bounces={false}
            scrollEnabled={false}
            nestedScrollEnabled={true}
            overScrollMode={"never"}
          />
        </View>
      ) : (
        <LoginForm
          loading={authSessionMutation.isLoading || sessionLoading}
          disabled={authSessionMutation.isLoading || sessionLoading}
          onWixLogin={() => {
            promptAsync({
              showInRecents: true,
            });
          }}
        />
      )}
    </>
  );
};
