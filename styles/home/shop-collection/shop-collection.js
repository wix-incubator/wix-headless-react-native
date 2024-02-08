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
    }
});