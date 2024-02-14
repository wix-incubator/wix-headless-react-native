import {useQuery} from "@tanstack/react-query";
import {useWixModules} from "@wix/sdk-react";
import * as React from "react";
import {useCallback, useRef} from "react";
import {Animated, Dimensions, SafeAreaView, Text, View} from "react-native";
import {ActivityIndicator} from "react-native-paper";
import {ProductsGrid} from "../../components/Grid/ProductsGrid";
import {ProductHeader} from "../../components/Header/ProductHeader";
import {products} from "@wix/stores";

const screenHigh = Dimensions.get('window').height;
const Header_Max_Height = screenHigh / 2;
const Header_Min_Height = 70;

export function ProductsScreen({navigation, route}) {
    const {
        name: CollectionName,
        slug: CollectionSlug,
        _id: CollectionId,
        description: CollectionDescription,
    } = route.params.items;
    const {queryProducts, getCollectionBySlug} = useWixModules(products);

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
    const items = productsResponse.data.items.filter((product) => product.collectionIds.includes(CollectionId));
    const productPressHandler = (product) => {
        navigation.navigate("Product", {product});
    }

    const [animationState, setAnimationState] = React.useState({
        animation: new Animated.Value(0),
        visible: true,
    });

    const scrollOffsetY = useRef(animationState.animation).current;

    const scrollHandler = useCallback((val = 0) => {
        if (val > (Header_Max_Height - Header_Min_Height) - 20) {
            setAnimationState({...animationState, visible: false});
        } else {
            setAnimationState({...animationState, visible: true});
        }
    }, [animationState]);
    return (
        <>
            <SafeAreaView style={{flex: 0, backgroundColor: '#c3c198'}}/>
            <View
                keyboardShouldPersistTaps="always"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
                style={{height: '100%', flex: 1, backgroundColor: '#fdfbef'}}
            >
                <ProductHeader animHeaderValue={scrollOffsetY} navigation={navigation}
                               visible={animationState.visible} title={CollectionName}
                               description={CollectionDescription} media={items[0]?.media?.mainMedia}/>
                <ProductsGrid data={items} onPress={productPressHandler} navigation={navigation}
                              scrollOffsetY={scrollOffsetY} onScroll={scrollHandler}/>
            </View>
        </>
    );
}
