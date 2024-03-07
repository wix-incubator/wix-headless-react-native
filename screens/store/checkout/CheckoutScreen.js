import * as React from "react";
import { useRef } from "react";
import { WebView } from "react-native-webview";
import { SimpleContainer } from "../../../components/Container/SimpleContainer";
import { LoadingIndicator } from "../../../components/LoadingIndicator/LoadingIndicator";
import { styles } from "../../../styles/store/checkout/checkout-screen/styles";

export function CheckoutScreen({ navigation, route }) {
  const { redirectSession } = route.params;
  const [loading, setLoading] = React.useState(true);
  const webviewRef = useRef(null);

  const loadWebView = () => (
    <WebView
      style={styles.container}
      setSupportMultipleWindows={false}
      ref={webviewRef}
      contentMode={"mobile"}
      source={{ uri: redirectSession.fullUrl }}
      goBack={() => navigation.goBack()}
      onLoad={() => setLoading(false)}
      scalesPageToFit={true}
      bounces={false}
      scrollEnabled={false}
      nestedScrollEnabled={true}
      overScrollMode={"never"}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <>
      <SimpleContainer
        title={"Checkout"}
        navigation={navigation}
        backIcon={true}
        styles={{ backgroundColor: "white" }}
      >
        {loading && <LoadingIndicator />}
        {loadWebView()}
      </SimpleContainer>
    </>
  );
}
