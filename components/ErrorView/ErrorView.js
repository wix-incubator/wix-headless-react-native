import {Text, View} from "react-native";

export const ErrorView = ({message}) => (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Text>Error: {message}</Text>
    </View>
);
