import {Animated, Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View} from "react-native";
import {WixMediaImage} from "../../WixMediaImage";

const screenWidth = Dimensions.get('window').width;
export const ProductsGrid = ({navigation, data, onPress, scrollOffsetY, onScroll}) => {

    return (
        <FlatList
            scrollEventThrottle={32}
            data={data} numColumns={2} keyExtractor={(item) => item._id}
            onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
                {
                    useNativeDriver: false,
                    listener: (event) => {
                        onScroll(event.nativeEvent.contentOffset.y)
                    }
                }
            )}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            bounces={false}
            renderItem={({item, index}) => {
                return (
                    <View style={styles.container}>
                        <Pressable onPress={() => {
                            onPress(item)
                        }}>
                            <WixMediaImage
                                media={item.media.mainMedia.image.url}
                                width={screenWidth / 2 - 20}
                                height={screenWidth / 2}
                            >
                                {({url}) => {
                                    return (
                                        <Image
                                            style={[styles.image, {
                                                width: screenWidth / 2 - 20, // Adjust the width as needed
                                                height: screenWidth / 2,
                                            }]}
                                            source={{
                                                uri: url,
                                            }}
                                        />
                                    );
                                }}
                            </WixMediaImage>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.title}>{item.convertedPriceData?.formatted?.price}</Text>
                        </Pressable>
                    </View>
                )
            }} style={{zIndex: -1}}>
        </FlatList>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        borderRadius: 25,
        elevation: 3,
        textAlign: 'left',
        width: '100%',
        paddingBottom: 20,
    },
    image: {
        borderRadius: 25,
        backgroundColor: '#f1ede6',
    },
    title: {
        textAlign: 'left',
        fontSize: 16,
        paddingTop: 10,
        color: '#333',
    },
});