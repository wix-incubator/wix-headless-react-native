import {Dimensions, Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import {styles} from "../../styles/home/shop-collection/shop-collection";
import {ImageCard} from "../Cards/ImageCard";
import Carousel from 'react-native-reanimated-carousel';
import {useWixModules} from "@wix/sdk-react";
import {collections, products} from "@wix/stores";
import {useQuery} from "@tanstack/react-query";
import {IconButton} from "react-native-paper";
import {useRef} from "react";
import {LoadingIndicator} from "../LoadingIndicator/LoadingIndicator";
import {ErrorView} from "../ErrorView/ErrorView";
import {WixMediaImage} from "../../WixMediaImage";

const screenWidth = Dimensions.get('window').width;

export const ShopCollectionsHome = ({navigation}) => {
    const {queryProducts} = useWixModules(products);
    const {queryCollections} = useWixModules(collections);
    const carouselRef = useRef(null);
    const productsResponse = useQuery(["products"], () => queryProducts().find());
    const collectionsResponse = useQuery(["collections"], () => queryCollections().find());

    if (productsResponse.isLoading || collectionsResponse.isLoading) {
        return <LoadingIndicator/>
    }

    if (productsResponse.isError) {
        return <ErrorView message={productsResponse.error.message}/>
    }

    if (collectionsResponse.isError) {
        return <ErrorView message={collectionsResponse.error.message}/>
    }

    const handleNext = () => {
        carouselRef.current?.next();
    }
    const handlePrev = () => {
        carouselRef.current?.prev();
    }
    const shopCollections = [...collectionsResponse.data.items];
    const firstThreeCollections = shopCollections.slice(0, 3).map(collection =>
        collection.name.toLowerCase() === "all products" ? shopCollections[3] : collection
    );

    const newProducts = [...productsResponse.data.items];
    const filteredProducts = newProducts.filter((product) => product.collectionIds.includes('50ce695b-b834-0414-48a8-45dcf7cba52d'));
    return (
        <View style={styles.view}>
            <Text style={styles.title}>Shop Collections</Text>
            <View style={styles.collections}>
                {
                    firstThreeCollections.map((item, index) => {
                        return (
                            <View key={index} style={{
                                marginVertical: 10,
                            }}>
                                <Pressable
                                    onPress={() => {
                                        navigation.navigate("Products", {items: item});
                                    }}>
                                    {item.media?.mainMedia?.image?.url ? (
                                        <WixMediaImage
                                            media={item.media.mainMedia.image.url}
                                            width={screenWidth * 0.8}
                                            height={screenWidth * 0.8}
                                        >
                                            {({url}) => {
                                                return (
                                                    <ImageCard imageSrc={{
                                                        uri: url,
                                                    }}
                                                               title={item.name}
                                                    />
                                                );
                                            }}
                                        </WixMediaImage>

                                    ) : (
                                        <ImageCard
                                            source={{
                                                uri: `https://via.placeholder.com/${screenWidth / 2}`
                                            }}
                                            title={item.name}

                                        />)
                                    }
                                </Pressable>
                            </View>
                        );
                    })
                }
            </View>
            <View style={styles.carouselContainer}>
                <Text style={[styles.title, {
                    marginTop: 20,
                }]}>New In</Text>
                <Carousel
                    style={{
                        position: 'relative',
                    }}
                    loop
                    width={screenWidth * 0.6}
                    height={screenWidth}
                    autoPlay={false}
                    data={filteredProducts}
                    scrollAnimationDuration={1000}
                    ref={carouselRef}
                    renderItem={({index}) => {
                        return (
                            <View
                                style={styles.carousel}
                            >
                                <Pressable
                                    onPress={() => {
                                        navigation.navigate('Product', {
                                            product: filteredProducts[index],
                                            collectionName: filteredProducts[index].name
                                        });
                                    }}
                                >
                                    <Image
                                        style={styles.carouselImage}
                                        source={{
                                            uri: filteredProducts[index].media.mainMedia.image.url,
                                        }}
                                    />
                                    <Text style={styles.carouselTitle}>
                                        {filteredProducts[index].name}
                                    </Text>
                                    <Text style={styles.carouselPrice}>
                                        {filteredProducts[index].convertedPriceData.formatted?.price}
                                    </Text>
                                </Pressable>
                            </View>
                        );
                    }}
                />
                <View style={styles.indicators}>
                    <TouchableOpacity onPress={handlePrev} style={styles.indicatorButtonLeft}>
                        <IconButton icon={'chevron-left'} size={30} color={'#333'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNext} style={styles.indicatorButtonRight}>
                        <IconButton icon={'chevron-right'} size={30} color={'#333'}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}