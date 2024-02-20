import * as React from "react";
import {useEffect, useRef} from "react";
import {WebView} from "react-native-webview";
import {StyleSheet} from "react-native";
import {SimpleContainer} from "../../../components/Container/SimpleContainer";
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";

export function CheckoutScreen({navigation, route}) {
    const {redirectSession} = route.params;
    const [loading, setLoading] = React.useState(true);
    const webviewRef = useRef(null);


    useEffect(() => {
        if (!webviewRef.current) return;
        console.log(webviewRef.current);
    }, [webviewRef.current]);

    const loadWebView = () => (
        <WebView
            style={styles.container}
            setSupportMultipleWindows={false}
            ref={webviewRef}
            contentMode={"mobile"}
            source={{uri: redirectSession.fullUrl}}
            goBack={() => navigation.goBack()}
            onLoad={() => setLoading(false)}
            scalesPageToFit={true}
            bounces={false}
            scrollEnabled={false}
            nestedScrollEnabled={true}
            overScrollMode={'never'}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />
    )


    return (
        <>
            <SimpleContainer title={"Checkout"} navigation={navigation} backIcon={true}
                             styles={{backgroundColor: "white"}}>
                {loading && (<LoadingIndicator/>)}
                {loadWebView()}
            </SimpleContainer>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});