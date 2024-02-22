import {Text, View} from "react-native";
import {ActivityIndicator} from "react-native-paper";

export const LoadingIndicator = ({loadingMessage = undefined}) => (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator/>
        {loadingMessage && <Text>{loadingMessage}</Text>}
    </View>
);