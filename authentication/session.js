import { useWixAuth, useWixModules } from "@wix/sdk-react";
import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { View } from "react-native";
import "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import "react-native-url-polyfill/auto";

/**
 * @type {React.Context<{
 *  session: import("@wix/sdk-react").Tokens,
 * setSession: (session: import("@wix/sdk-react").Tokens) => Promise<void>,
 * newVisitorSession: () => Promise<void> }>}
 */
const WixSessionContext = React.createContext(undefined);

export function WixSessionProvider(props) {
  const [session, setSessionState] = React.useState(null);
  const [sessionLoading, setSessionLoading] = React.useState(false);
  const auth = useWixAuth();

  const setSession = React.useCallback(
    async (tokens) => {
      auth.setTokens(tokens);
      await SecureStore.setItemAsync(
        "wixSession",
        JSON.stringify({ tokens, clientId: props.clientId }),
      );
      setSessionState(tokens);
      setSessionLoading(false);
    },
    [auth, setSessionState],
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
        const { tokens, clientId } = JSON.parse(wixSession);
        if (clientId !== props.clientId) {
          newVisitorSession();
        } else {
          setSession(tokens);
        }
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
