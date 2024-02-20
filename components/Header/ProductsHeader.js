import React from 'react';
import {Animated, Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import {IconButton} from "react-native-paper";
import {WixMediaImage} from "../../WixMediaImage";

const screenHigh = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const Header_Max_Height = screenHigh / 2 - 10;
const Header_Min_Height = 70 + StatusBar.currentHeight;
export const ProductsHeader = ({navigation, animHeaderValue, visible, title, description, media}) => {
    const animateHeaderTextOpacity = animHeaderValue.interpolate({
        inputRange: [0, Header_Max_Height - Header_Min_Height],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const animateHeaderHeight = animHeaderValue.interpolate({
        inputRange: [0, 2 * (Header_Max_Height + Header_Min_Height + 10)],
        outputRange: [Header_Max_Height, Header_Min_Height + 10],
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
                    height: (animateHeaderHeight),
                    backgroundColor: '#c3c198',
                }
            ]}
        >
            <View style={styles.headerContent}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>{title}</Text></View>
                <View>
                    <IconButton icon={'arrow-left-thin'} size={36} style={styles.backIcon} onPress={handleGoBack}/>
                </View>
            </View>
            {visible && (
                <>
                    <Animated.Text style={
                        [styles.subTitle,
                            {
                                opacity: animateHeaderTextOpacity,
                                height: description ? animHeaderValue.interpolate({
                                    inputRange: [0, Math.min(Header_Max_Height - Header_Min_Height, 300)],
                                    outputRange: [150, 0],
                                    extrapolate: 'clamp',
                                }) : 0,
                                width: '100%',
                                paddingHorizontal: 10
                            }
                        ]}>
                        {description}
                    </Animated.Text>
                    {media && (
                        <Animated.View style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginVertical: 15,
                            opacity: animateHeaderTextOpacity,
                            height: animHeaderValue.interpolate({
                                inputRange: [0, Math.min(Header_Max_Height - Header_Min_Height, 300)],
                                outputRange: [0, 0],
                                extrapolate: 'clamp',
                            })
                        }}>
                            <WixMediaImage
                                media={media?.image?.url}
                                width={screenWidth / 2 - 20}
                                height={screenWidth / 2}
                            >
                                {({url}) => {
                                    return (
                                        <Animated.Image
                                            style={[styles.image, {
                                                height: description ? animHeaderValue.interpolate({
                                                    inputRange: [0, Math.min(Header_Max_Height - Header_Min_Height, 400)],
                                                    outputRange: [200, 0],
                                                    extrapolate: 'clamp',
                                                }) : 0,
                                                width: screenWidth / 2 - 20
                                            }]}
                                            source={{
                                                uri: url,
                                            }}
                                        />
                                    );
                                }}
                            </WixMediaImage>
                        </Animated.View>
                    )}
                </>
            )}

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
        paddingTop: StatusBar.currentHeight + 10,
        width: '100%'
    },
    headerContent: {
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
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
        // width: '100%',
    },
    backIcon: {
        width: 50,
        height: 50,
    },
    subTitle: {
        color: '#403f2b',
        fontSize: 15,
        fontWeight: 'normal',
        textAlign: 'center',
    }
});