import {StyleSheet, TextInput, View} from "react-native";
import {Icon} from "react-native-paper";

export const InputPrefix = ({iconName, ...props}) => {
    return (
        <View style={[styles.inputContainer, props.style]}>
            <Icon source={iconName} size={24} color={'#403f2b'}/>
            <TextInput style={styles.input} {...props}/>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#403f2b',
        borderWidth: 1,
        borderRadius: 0,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#403f2b',
        marginLeft: 5,
    },
});
