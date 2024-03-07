import { SafeAreaView, ScrollView, View } from "react-native";
import { MemberHandler } from "../../../authentication/MemberHandler";
import { useWixSession } from "../../../authentication/session";
import { SimpleHeader } from "../../../components/Header/SimpleHeader";
import { styles } from "../../../styles/members/styles";
import { MemberView } from "./MemberView";
import { SignInView } from "./SignInView";

const MemberArea = () => {
  const { session } = useWixSession();
  if (session.refreshToken.role !== "member") {
    return <SignInView />;
  } else {
    return (
      <MemberHandler>
        <MemberView />
      </MemberHandler>
    );
  }
};

export const MemberAreaScreen = ({ navigation }) => {
  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: "#c3c198" }} />
      <SimpleHeader
        title={"My Account"}
        backIcon={true}
        navigation={navigation}
        onBackPress={() => navigation.goBack()}
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
          <MemberArea />
        </ScrollView>
      </View>
    </>
  );
};
