import {StyleSheet, Text, View} from "react-native";

export const Toast = ({message}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.toastText}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E7E59B",
        padding: 10,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
    },
    toastText: {
        color: "#333",
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20,
    },
});