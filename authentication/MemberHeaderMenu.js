import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { members } from "@wix/members";
import { TouchableHighlight } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Divider,
  Menu,
  Button,
} from "react-native-paper";
import { useWixSession, useWixSessionModules } from "./session";
import { useWixAuth } from "@wix/sdk-react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as SecureStorage from "expo-secure-store";

export function MemberHeaderMenu({ navigation }) {
  const { session } = useWixSession();

  if (session.refreshToken.role !== "member") {
    return <SignInButton />;
  } else {
    return <MemberMenu navigation={navigation} />;
  }
}

function SignInButton() {
  const { sessionLoading } = useWixSession();
  const auth = useWixAuth();

  const authSessionMutation = useMutation(
    async () => {
      const data = auth.generateOAuthData(
        Linking.createURL("oauth/wix/callback"),
      );

      await SecureStorage.setItemAsync("oauthState", JSON.stringify(data));

      const { authUrl } = await auth.getAuthUrl(data);
      return authUrl;
    },
    {
      onSuccess: async (authUrl) => {
        WebBrowser.openBrowserAsync(authUrl, {});
      },
    },
  );

  return (
    <Button
      mode="elevated"
      icon={"login"}
      loading={authSessionMutation.isLoading || sessionLoading}
      disabled={authSessionMutation.isLoading || sessionLoading}
      onPress={async () => authSessionMutation.mutate()}
    >
      Login
    </Button>
  );
}

function MemberMenu({ navigation }) {
  const { newVisitorSession } = useWixSession();
  const { getCurrentMember } = useWixSessionModules(members);
  const memberQuery = useQuery(["myMember"], () => getCurrentMember());
  const [visible, setVisible] = React.useState(false);

  if (memberQuery.isFetching) {
    return <ActivityIndicator animating={true} />;
  }

  if (memberQuery.isError) {
    return null;
  }

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchorPosition="bottom"
      anchor={
        <TouchableHighlight
          onPress={() => setVisible(true)}
          underlayColor="white"
        >
          <Avatar.Image
            size={36}
            source={{ uri: memberQuery.data.member.profile.photo.url }}
          />
        </TouchableHighlight>
      }
    >
      <Menu.Item
        onPress={() => {
          navigation.navigate("MyOrders");
        }}
        title="My Orders"
      />
      <Divider />
      <Menu.Item
        onPress={async () => {
          await newVisitorSession();
          navigation.navigate("Home");
        }}
        title="Sign out"
      />
    </Menu>
  );
}
