import {Dimensions, Image, Linking, Pressable, Text, View} from "react-native";
import {styles} from "../../styles/home/followus/styles";
import Carousel from "react-native-reanimated-carousel";
import {data} from "../../data/followus/data";
import {useCallback} from "react";

export const FollowUsHome = () => {
    const width = Dimensions.get('window').width;
    const handlePress = useCallback(async (url) => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        }
    }, []);
    return (
        <View style={styles.view}>
            <Text style={styles.title}>Follow Us</Text>
            <Text style={styles.subtitle}>{`@Re.vert`}</Text>
            <Carousel
                loop
                width={width * 0.7}
                height={width}
                autoPlay={false}
                data={data}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => {
                }}
                renderItem={({index}) => {
                    return (
                        <View
                            style={{
                                flex: 1,
                                borderRadius: 15,
                                justifyContent: 'center',
                                width: width * 0.7,
                                height: width * 0.8,
                            }}
                        >
                            <Pressable onPress={handlePress.bind(this, data[index].link)}>
                                <Image
                                    style={{
                                        width: width * 0.7,
                                        height: width * 0.8,
                                        borderRadius: 15,
                                    }}
                                    source={{
                                        uri: data[index].uri,
                                    }}
                                />
                            </Pressable>
                        </View>
                    );
                }}
            />
        </View>
    )
}