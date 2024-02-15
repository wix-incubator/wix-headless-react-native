import * as React from "react";
import {WebView} from "react-native-webview";

export function CheckoutScreen({navigation, route}) {
    const {redirectSession} = route.params;
    const webviewRef = React.useRef(null);

    return (
        <WebView
            setSupportMultipleWindows={false}
            ref={webviewRef}
            source={{uri: redirectSession.fullUrl}}
            goBack={() => navigation.goBack()}
        />
    );
}
