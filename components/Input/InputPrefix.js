import {StyleSheet, TextInput, View} from "react-native";
import {Icon} from "react-native-paper";

export const InputPrefix = ({iconName, ...props}) => {
    const inputStyles = StyleSheet.create({
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#333333',
            borderWidth: 1,
            borderRadius: 0,
            paddingHorizontal: 10,
        },
        icon: {
            color: '#333333',
        },
        input: {
            flex: 1,
            height: 40,
            fontSize: 16,
            color: '#333333',
            marginLeft: 5,
        },
    });

    return (
        <View style={props.style || inputStyles.inputContainer}>
            <Icon source={iconName} size={24} style={inputStyles.icon}/>
            <TextInput {...props} style={inputStyles.input}/>
        </View>
    );
};