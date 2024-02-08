import {Text, View} from "react-native";

export const Toast = ({message}) => {
    const styles = {
        toast: {
            backgroundColor: "#E7E59B",
            padding: 10,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        toastText: {
            color: "#333",
            fontSize: 16,
            textAlign: "center",
            paddingHorizontal: 20,
        },
    }

    return (
        <View style={styles.toast}>
            <Text style={styles.toastText}>{message}</Text>
        </View>
    );
}