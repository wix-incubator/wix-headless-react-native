import {Dimensions, Image, Text, View} from "react-native";
import {styles} from "../../styles/home/shop-collection/shop-collection";
import {ImageCard} from "../Cards/ImageCard";
import {collections} from "../../data/homeScreen/ShopCollection/data";
import Carousel from 'react-native-reanimated-carousel';
import {useWixModules} from "@wix/sdk-react";
import {products} from "@wix/stores";
import {useQuery} from "@tanstack/react-query";
import {ActivityIndicator} from "react-native-paper";

export const ShopCollectionsHome = (navigation) => {
    const width = Dimensions.get('window').width;
    const {queryProducts} = useWixModules(products);

    const productsResponse = useQuery(["products"], () => queryProducts().find());

    if (productsResponse.isLoading) {
        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <ActivityIndicator/>
            </View>
        );
    }

    if (productsResponse.isError) {
        return <Text>Error: {productsResponse.error.message}</Text>;
    }

    const newProducts = productsResponse.data.items.splice(0, 6);
    return (
        <View style={styles.view}>
            <Text style={styles.title}>Shop Collections</Text>
            <View style={styles.collections}>
                {
                    collections.map((collection, index) => {
                        return (
                            <View key={index} style={{
                                marginVertical: 10,
                            }}>
                                <ImageCard imageSrc={{
                                    uri: collection.uri,
                                }}
                                           title={collection.title}
                                />
                            </View>
                        );
                    })
                }
            </View>
            <Text style={[styles.title, {marginTop: 20}]}>New In</Text>
            <Carousel
                loop
                width={width * 0.6}
                height={width}
                autoPlay={false}
                data={newProducts}
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
                                width: width * 0.6,
                                height: width * 0.7,
                            }}
                        >
                            <Image
                                style={{
                                    width: width * 0.6,
                                    height: width * 0.7,
                                    borderRadius: 15,
                                }}
                                source={{
                                    uri: newProducts[index].media.mainMedia.image.url,
                                }}
                            />
                            <Text style={{
                                width: width * 0.6,
                                textAlign: 'center',
                                color: '#333',
                                padding: 5,
                                marginTop: 10,
                                fontSize: 20,
                            }}>
                                {newProducts[index].name}
                            </Text>
                            <Text style={{
                                width: width * 0.6,
                                textAlign: 'center',
                                color: '#333',
                                padding: 5,
                                marginTop: 10,
                                fontSize: 14,
                            }}>
                                {newProducts[index].convertedPriceData.formatted?.price}
                            </Text>
                        </View>
                    );
                }}
            />
        </View>
    );
}