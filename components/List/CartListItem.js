import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import NumericInput from "react-native-numeric-input";
import {WixMediaImage} from "../../WixMediaImage";
import {IconButton} from "react-native-paper";

export const CartListItem = ({image, name, price, quantity, quantityOnEdit, quantityHandlerChange, removeHandler}) => {
    return (
        <View style={{width: '100%'}}>
            <View style={styles.card}>
                <WixMediaImage media={image} width={80} height={110}>
                    {({url}) => (
                        <Image source={{uri: url}} style={styles.image}/>
                    )}
                </WixMediaImage>

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.price}>{price}</Text>
                </View>

                <View style={styles.close}>
                    <IconButton icon={'close'} onPress={removeHandler} iconColor={'#908e80'}/>
                </View>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 10,
                width: '100%'
            }}>
                <View style={{flex: 1}}/>
                <View style={{
                    flex: 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    width: '100%',
                }}>
                    <NumericInput
                        value={quantity}
                        totalWidth={100}
                        editable={quantityOnEdit}
                        onChange={(quantity) =>
                            quantityHandlerChange(quantity)
                        }
                        minValue={1}
                        containerStyle={{backgroundColor: 'transparent', borderColor: '#908e80'}}
                        rightButtonBackgroundColor={'transparent'}
                        leftButtonBackgroundColor={'transparent'}
                        borderColor={'transparent'}
                        inputStyle={{backgroundColor: 'transparent', color: '#403f2b'}}
                    />
                    <Text style={styles.price}>{price}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        margin: 10,
        elevation: 2,
        position: 'relative',
    },
    close: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    image: {
        width: 80,
        height: 110,
        resizeMode: 'cover',
        borderColor: '#908e80',
        borderWidth: 2,
    },
    infoContainer: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 18,
        maxWidth: '75%',
        color: '#403f2b',
    },
    price: {
        fontSize: 16,
        color: '#403f2b',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 30,
        width: 50,
        borderColor: '#908e80',
        borderWidth: 1,
        marginLeft: 5,
        paddingHorizontal: 5,
    },
});
