import {useQuery} from "@tanstack/react-query";
import {useWixModules} from "@wix/sdk-react";
import {products} from "@wix/stores";
import * as React from "react";
import {Text, View} from "react-native";
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
        <View
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
        >
            <ProductsGrid data={productsResponse.data.items} onPress={productPressHandler}/>
        </View>
        // <ScrollView
        //     keyboardShouldPersistTaps="always"
        //     alwaysBounceVertical={false}
        //     showsVerticalScrollIndicator={false}
        // >
        //     <List.Section>
        //         {productsResponse.data.items.map((product) => (
        //             <List.Item
        //                 key={product._id}
        //                 title={product.name}
        //                 onPress={() => {
        //                     productPressHandler(product)
        //                 }}
        //                 left={(props) => (
        //                     <WixMediaImage
        //                         media={product.media.mainMedia.image.url}
        //                         width={50}
        //                         height={50}
        //                     >
        //                         {({url}) => {
        //                             return (
        //                                 <List.Image
        //                                     style={props.style}
        //                                     source={{
        //                                         uri: url,
        //                                     }}
        //                                 />
        //                             );
        //                         }}
        //                     </WixMediaImage>
        //                 )}
        //             />
        //         ))}
        //     </List.Section>
        // </ScrollView>
    );
}
