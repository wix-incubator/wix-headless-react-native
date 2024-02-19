import React, { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useLoginHandler } from "../authentication/LoginHandler";
import { useWixSession } from "../authentication/session";

export function CustomLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { sessionLoading } = useWixSession();
  const { login } = useLoginHandler();

  return (
    <View
      style={{
        flexDirection: "column",
        height: "100%",
      }}
    >
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        label="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <Button
        mode="contained"
        onPress={async () => {
          await login(email, password);
          navigation.navigate("Home");
        }}
        loading={sessionLoading}
      >
        Login
      </Button>
    </View>
  );
}
