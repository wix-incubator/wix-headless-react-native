import {StyleSheet, Text, View} from "react-native";
import {IconButton} from "react-native-paper";

export const SimpleHeader = ({navigation, title, backIcon: showBackButton = false}) => {
    return (
        <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>{title}</Text></View>
            <View>
                <IconButton icon={'arrow-left-thin'} size={36} style={styles.backIcon}
                            onPress={() => navigation.goBack()}/>
            </View>
        </View>
        // <View style={{
        //     flexDirection: 'row',
        //     justifyContent: 'space-around',
        //     alignItems: 'center',
        //     padding: 10,
        //     backgroundColor: '#c3c198',
        //     height: 70
        // }}>
        //     {showBackButton && <IconButton icon={'arrow-left'} onPress={() => navigation.goBack()} color={'#403f2b'}/>}
        //     <Text style={{
        //         fontSize: 36,
        //         fontWeight: 'normal',
        //         fontFamily: 'Fraunces-Regular',
        //         textAlign: 'center',
        //         width: '100%',
        //         color: '#403f2b'
        //     }}>{title}</Text>
        // </View>
    );
}

const styles = StyleSheet.create({
    headerContent: {
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#c3c198',
        // height: 70,
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 50
    },
    headerText: {
        color: '#403f2b',
        fontSize: 40,
        fontWeight: 'normal',
        textAlign: 'center',
        fontFamily: 'Fraunces-Regular',
        letterSpacing: 1.5,
        position: 'relative',
        marginVertical: 10,

    },
    backIcon: {
        width: 50,
        height: 50,
    },
});