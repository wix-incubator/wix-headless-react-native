import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    view: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginHorizontal: 'auto',
        marginVertical: 0,
        paddingVertical: 40,
    },
    title: {
        fontSize: 40,
        paddingBottom: 20,
        fontFamily: 'Fraunces-Regular',
        textAlign: 'center',
        color: '#403F2B',
    },
    collections: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    indicators: {
        position: 'absolute',
        top: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: '100%',
        height: '100%',
        zIndex: -1,

    },
    indicatorButtonLeft: {
        position: 'absolute',
        top: '50%',
        left: 0,
        padding: 10,
        borderRadius: 5,
    },
    indicatorButtonRight: {
        position: 'absolute',
        top: '50%',
        right: 0,
        padding: 10,
        borderRadius: 5,
    },
    indicatorText: {
        fontSize: 18,
        color: '#333',
    },
});