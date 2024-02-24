import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    view: {
        flexDirection: 'column',
        alignContent: 'start',
        justifyContent: 'start',
        width: '100%',
        textAlign: 'left',
        elevation: 0,
        height: '100%',
        backgroundColor: '#FEFBEF',
    },
    header: {
        backgroundColor: '#FEFBEF',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
        height: 100,
        paddingHorizontal: 20,
    },
    header_content: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        maxWidth: '100%',
        backgroundColor: '#FEFBEF',
    },
    header_title: {
        fontSize: 32,
        fontWeight: 'normal',
        fontFamily: "Fraunces-Regular",
        letterSpacing: 2,
        color: "#333333",
    },
    header_searchBox: {
        marginLeft: 20, // Adjust the spacing as needed
        flex: 1, // Take up all available space
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.6,
    },
    text: {
        fontFamily: "Fraunces-Regular",
        fontSize: 32,
        color: "#403F2B",
        letterSpacing: 2,
    },
});