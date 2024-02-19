import * as React from "react";
import {WebView} from "react-native-webview";
import {StyleSheet} from "react-native";

export function CheckoutScreen({navigation, route}) {
    const {redirectSession} = route.params;
    const webviewRef = React.useRef(null);

    return (
        <WebView
            style={styles.container}
            setSupportMultipleWindows={false}
            ref={webviewRef}
            contentMode={"mobile"}
            source={{uri: redirectSession.fullUrl}}
            goBack={() => navigation.goBack()}
            scrollEnabled={false}
            bounces={false}
            contentInsetAdjustmentBehavior={"automatic"}
            automaticallyAdjustContentInsets={false}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});