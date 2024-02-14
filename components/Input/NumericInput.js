import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useState} from "react";

export const NumericInput = ({value, onChange, min, max, step, style, showIndicators = true}) => {
    const [inputValue, setInputValue] = useState(value);
    const handleChange = (text) => {
        // Allow only numbers
        const numericValue = text.replace(/[^0-9]/g, "");
        max ?? numericValue > max ? setInputValue(max) : setInputValue(numericValue);
        min ?? numericValue < min ? setInputValue(min) : setInputValue(numericValue);
        setInputValue(numericValue);
    };

    return (
        <View style={[styles.numericInputContainer, style]}>
            {showIndicators && (
                <TouchableOpacity
                    onPress={() => onChange(currentValue - step)}
                    style={styles.numericInputButton}
                >
                    <Text style={styles.numericInputButtonText}>-</Text>
                </TouchableOpacity>
            )}
            <TextInput
                value={inputValue?.toString() || min.toString()}
                onChangeText={handleChange}
                keyboardType="numeric"
                style={styles.numericInput}
            />
            {showIndicators && (
                <TouchableOpacity
                    onPress={() => onChange(currentValue + step)}
                    style={styles.numericInputButton}
                >
                    <Text style={styles.numericInputButtonText}>+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    numericInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    numericInput: {
        alignSelf: "flex-start",
        borderWidth: 2,
        borderColor: "#eee",
        width: '100%',
        textAlign: "left",
        backgroundColor: "white",
        fontSize: 20,
        padding: 10,
    },
    numericInputButton: {
        padding: 10,
    },
    numericInputButtonText: {
        fontSize: 20,
    },
});