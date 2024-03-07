import { useWixAuth } from "@wix/sdk-react";
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import * as Linking from "expo-linking";
import * as React from "react";
import "react-native-gesture-handler";
import "react-native-url-polyfill/auto";
import { WebView } from "react-native-webview";
import validator from "validator";
import { useWixSession } from "./session";

const LoginHandlerContext = React.createContext(null);

export function useLoginHandler() {
  return React.useContext(LoginHandlerContext);
}

export function LoginHandler(props) {
  const { session, setSessionLoading } = useWixSession();
  const [loginState, setLoginState] = React.useState(null);
  const auth = useWixAuth();

  const silentLogin = React.useCallback(
    async (sessionToken) => {
      const data = auth.generateOAuthData(
        Linking.createURL("/wix/oauth/callback"),
      );
      const { authUrl } = await auth.getAuthUrl(data, {
        prompt: "none",
        sessionToken,
      });
      setLoginState({
        url: authUrl,
        data,
      });
    },
    [auth, setSessionLoading],
  );

  const login = React.useCallback(
    async (email, password) => {
      setSessionLoading(true);
      if (!validator.isEmail(email)) {
        setSessionLoading(false);
        return Promise.reject("Invalid email address!");
      }
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
    [auth, setSessionLoading],
  );

  React.useEffect(() => {
    const subscription = Linking.addEventListener("url", async (event) => {
      const url = new URL(event.url);
      const wixMemberLoggedIn = url.searchParams.get("wixMemberLoggedIn");
      const requiresSilentLogin =
        wixMemberLoggedIn === "true" && session.refreshToken.role !== "member";
      if (requiresSilentLogin) {
        silentLogin();
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <LoginHandlerContext.Provider value={{ login }}>
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
  const { setSession } = useWixSession();

  if (!props.loginState) {
    return null;
  } else {
    return (
      <WebView
        source={{ uri: props.loginState.url }}
        originWhitelist={["exp://*", "wixmobileheadless://*"]}
        containerStyle={{ display: "none" }}
        onShouldStartLoadWithRequest={(request) => {
          if (
            request.url.startsWith(Linking.createURL("/wix/oauth/callback"))
          ) {
            const { code, state } = auth.parseFromUrl(
              request.url,
              props.loginState.data,
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

export function useLoginByWixManagedPages() {
  const redirectUri = makeRedirectUri({
    path: "/wix/oauth/callback",
  });

  const auth = useWixAuth();
  const { setSession, setSessionLoading } = useWixSession();

  const [{ authorizationEndpoint, sessionToken }, setAuthorizationEndpoint] =
    React.useState({ authorizationEndpoint: null, sessionToken: null });

  React.useEffect(() => {
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
      redirectUri,
      scopes: ["offline_access"],
      extraParams: {
        sessionToken,
      },
      usePKCE: true,
      prompt: "login",
    },
    {
      authorizationEndpoint,
    },
  );

  React.useEffect(() => {
    let aborted = false;
    if (response?.type === "success") {
      const { code } = response.params;
      exchangeCodeAsync(
        {
          code,
          clientId: process.env.EXPO_PUBLIC_WIX_CLIENT_ID,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier,
          },
        },
        {
          tokenEndpoint: "https://www.wixapis.com/oauth2/token",
        },
      )
        .then((response) => {
          if (!aborted) {
            setSession({
              accessToken: {
                value: response.accessToken,
                expiresAt: (response.issuedAt + response.expiresIn) * 1000,
              },
              refreshToken: {
                value: response.refreshToken,
                role: "member",
              },
            });
          }
        })
        .catch((error) => {
          console.log(Object.keys(error));
          console.error(JSON.stringify(error));
          console.error(error);
        })
        .finally(() => {
          setSessionLoading(false);
        });

      return () => {
        aborted = true;
        setSessionLoading(false);
      };
    }
  }, [response]);

  return {
    openBrowser: () => {
      return promptAsync();
    },
  };
}
