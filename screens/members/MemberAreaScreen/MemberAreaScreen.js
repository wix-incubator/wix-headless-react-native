import { SafeAreaView, ScrollView, View } from "react-native";
import { SimpleHeader } from "../../../components/Header/SimpleHeader";
import { useWixSession } from "../../../authentication/session";
import { useState } from "react";
import { styles } from "../../../styles/members/styles";
import { SignInView } from "./SignInView";
import { MemberView } from "./MemberView";
import { MemberHandler } from "../../../authentication/MemberHandler";

const MemberArea = ({ showWixLoginHandler, showWixLogin }) => {
  const { session } = useWixSession();
  if (session.refreshToken.role !== "member") {
    return (
      <SignInView
        showWixLoginHandler={showWixLoginHandler}
        showWixLogin={showWixLogin}
      />
    );
  } else {
    return (
      <MemberHandler>
        <MemberView />
      </MemberHandler>
    );
  }
};

export const MemberAreaScreen = ({ navigation }) => {
  const [showWixLogin, setShowWixLogin] = useState(false);

  const showWixLoginHandler = (val) => {
    setShowWixLogin(val);
  };

  const navigateBack = () => {
    if (showWixLogin) {
      showWixLoginHandler(false);
      return;
    }
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: "#c3c198" }} />
      <SimpleHeader
        title={"My Account"}
        backIcon={true}
        navigation={navigation}
        onBackPress={navigateBack}
      />
      <View
        keyboardShouldPersistTaps="always"
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        style={{ height: "100%", flex: 1, backgroundColor: "#fdfbef" }}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          styles={styles.container}
          contentContainerStyle={styles.content}
        >
          <MemberArea
            showWixLoginHandler={showWixLoginHandler}
            showWixLogin={showWixLogin}
          />
        </ScrollView>
      </View>
    </>
  );
};
