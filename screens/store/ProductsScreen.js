import {useQuery} from "@tanstack/react-query";
import {useWixModules} from "@wix/sdk-react";
import {products} from "@wix/stores";
import * as React from "react";
import {SafeAreaView, Text, View} from "react-native";
import {ActivityIndicator} from "react-native-paper";
import {ProductsGrid} from "../../components/Grid/ProductsGrid";

export function ProductsScreen({navigation}) {
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

    const productPressHandler = (product) => {
        navigation.navigate("Product", {product});
    }

    return (
        <>
            <SafeAreaView style={{flex: 0, backgroundColor: '#c3c198'}}/>
            <View
                keyboardShouldPersistTaps="always"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
                style={{height: '100%', flex: 1}}
            >
                <ProductsGrid data={productsResponse.data.items} onPress={productPressHandler}/>
            </View>
        </>
    );
}
