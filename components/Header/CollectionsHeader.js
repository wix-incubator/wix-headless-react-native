import {Text, View} from "react-native";

export const CollectionsHeader = ({navigation}) => {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#c3c198',
            height: 70
        }}>
            <Text style={{
                fontSize: 36,
                fontWeight: 'normal',
                fontFamily: 'Fraunces-Regular',
                textAlign: 'center',
                width: '100%',
                color: '#403f2b'
            }}>Collections</Text>
        </View>
    );
}