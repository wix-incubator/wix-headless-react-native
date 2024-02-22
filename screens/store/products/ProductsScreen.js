import {useQuery} from "@tanstack/react-query";
import {useWixModules} from "@wix/sdk-react";
import * as React from "react";
import {useRef} from "react";
import {Animated, Dimensions, SafeAreaView, View} from "react-native";
import {ProductsGrid} from "../../../components/Grid/ProductsGrid";
import {ProductsHeader} from "../../../components/Header/ProductsHeader";
import {products} from "@wix/stores";
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";
import {ErrorView} from "../../../components/ErrorView/ErrorView";

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
    const {queryProducts} = useWixModules(products);

    const productsResponse = useQuery(["products"], () => queryProducts().find());

    if (productsResponse.isLoading) {
        return <LoadingIndicator/>

    }

    if (productsResponse.isError) {
        return <ErrorView message={productsResponse.error.message}/>
    }
    const items = productsResponse.data.items.filter((product) => product.collectionIds.includes(CollectionId));
    const productPressHandler = (product) => {
        navigation.navigate("Product", {product, collectionName: CollectionName ?? product.name});
    }

    const [animationState, setAnimationState] = React.useState({
        animation: new Animated.Value(0),
        visible: true,
    });

    const scrollOffsetY = useRef(animationState.animation).current;

    return (
        <>
            <SafeAreaView style={{flex: 0, backgroundColor: '#c3c198'}}/>
            <View
                keyboardShouldPersistTaps="always"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
                style={{height: '100%', flex: 1, backgroundColor: '#fdfbef'}}
            >
                <ProductsHeader animHeaderValue={scrollOffsetY} navigation={navigation}
                                visible={animationState.visible} title={CollectionName}
                                description={CollectionDescription} media={items[0]?.media?.mainMedia}/>
                <ProductsGrid data={items} onPress={productPressHandler} navigation={navigation}
                              scrollOffsetY={scrollOffsetY}/>
            </View>
        </>
    );
}
