import React from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import {IconButton} from "react-native-paper";

const screenHigh = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const Header_Max_Height = screenHigh / 2;
const Header_Min_Height = 70;
export const ProductHeader = ({navigation, animHeaderValue, visible}) => {
    const animateHeaderTextOpacity = animHeaderValue.interpolate({
        inputRange: [0, Header_Max_Height - Header_Min_Height],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const animateHeaderHeight = animHeaderValue.interpolate({
        inputRange: [0, Header_Max_Height - Header_Min_Height],
        outputRange: [Header_Max_Height, Header_Min_Height],
        extrapolate: 'clamp'
    })

    const handleGoBack = () => {
        navigation.goBack()
    }

    return (
        <Animated.View
            style={[
                styles.header,
                {
                    height: animateHeaderHeight,
                    backgroundColor: '#c3c198',
                }
            ]}
        >
            <Text style={styles.headerText}>Kitchen
                <View>
                    <IconButton icon={'arrow-left-thin'} size={36} style={styles.backIcon} onPress={handleGoBack}/>
                </View>
            </Text>
            {visible &&
                (
                    <>
                        <Animated.Text style={
                            [styles.subTitle,
                                {
                                    opacity: animateHeaderTextOpacity,
                                    height: animHeaderValue.interpolate({
                                        inputRange: [0, Header_Max_Height - Header_Min_Height],
                                        outputRange: [200, 0],
                                        extrapolate: 'clamp',
                                    }),
                                    width: '100%',
                                    paddingHorizontal: 10
                                }
                            ]}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores deserunt nihil numquam
                            odio
                            perspiciatis quasi, quo veniam veritatis? Architecto ea eius est exercitationem fuga modi
                            placeat
                            sapiente sit tenetur voluptatibus!
                        </Animated.Text>
                        <Animated.View style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginVertical: 15,
                            opacity: animateHeaderTextOpacity,
                            height: animHeaderValue.interpolate({
                                inputRange: [0, Header_Max_Height - Header_Min_Height],
                                outputRange: [0, 0],
                                extrapolate: 'clamp',
                            })
                        }}>
                            <Animated.Image source={require('../../assets/icons/home-icon.png')}/>
                        </Animated.View>
                    </>)}

        </Animated.View>
    );
}

const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        left: 0,
        right: 0,
        paddingTop: 10,
        width: '100%'
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
        width: '100%'
    },
    backIcon: {
        position: 'absolute',
        top: -50,
        right: screenWidth - 220,
    },
    subTitle: {
        color: '#403f2b',
        fontSize: 15,
        fontWeight: 'normal',
        textAlign: 'center',
    }
});