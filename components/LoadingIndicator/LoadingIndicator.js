import {View} from "react-native";
import {ActivityIndicator} from "react-native-paper";

export const LoadingIndicator = () => (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator/>
    </View>
);