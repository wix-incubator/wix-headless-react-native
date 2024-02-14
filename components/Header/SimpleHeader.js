import {Text, View} from "react-native";
import {IconButton} from "react-native-paper";

export const SimpleHeader = ({navigation, title, backIcon: showBackButton = false}) => {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#c3c198',
            height: 70
        }}>
            {showBackButton && <IconButton icon={'arrow-left'} onPress={() => navigation.goBack()} color={'#403f2b'}/>}
            <Text style={{
                fontSize: 36,
                fontWeight: 'normal',
                fontFamily: 'Fraunces-Regular',
                textAlign: 'center',
                width: '100%',
                color: '#403f2b'
            }}>{title}</Text>
        </View>
    );
}