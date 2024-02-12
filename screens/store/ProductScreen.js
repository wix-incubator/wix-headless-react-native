import {checkout, currentCart} from "@wix/ecom";
import {redirects} from "@wix/redirects";
import * as Linking from "expo-linking";
import * as React from "react";
import {ScrollView, StyleSheet, Text, useWindowDimensions, View,} from "react-native";
import NumericInput from "react-native-numeric-input";
import {Button, Card, List, Portal, Snackbar, useTheme,} from "react-native-paper";
import RenderHtml from "react-native-render-html";
import {usePrice} from "./price";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useWixSessionModules} from "../../authentication/session";
import {WixMediaImage} from "../../WixMediaImage";

export function ProductScreen({route, navigation}) {
    const {product} = route.params;
    const {width} = useWindowDimensions();
    const theme = useTheme();
    const [quantity, setQuantity] = React.useState(1);

    const {addToCurrentCart} = useWixSessionModules(currentCart);

    const {
        redirects: {createRedirectSession},
        checkout: {createCheckout},
    } = useWixSessionModules({redirects, checkout});

    const price = usePrice({
        amount: product?.price?.price,
        currencyCode: product?.price?.currency,
    });

    const buyNowMutation = useMutation(
        async (quantity) => {
            const item = {
                quantity,
                catalogReference: {
                    catalogItemId: product._id,
                    appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
                },
            };

            const currentCheckout = await createCheckout({
                lineItems: [item],
                channelType: checkout.ChannelType.OTHER_PLATFORM,
            });

            const {redirectSession} = await createRedirectSession({
                ecomCheckout: {checkoutId: currentCheckout._id},
                callbacks: {
                    thankYouPageUrl: Linking.createURL("/store/checkout/thank-you"),
                    cartPageUrl: Linking.createURL("/store/cart"),
                    postFlowUrl: Linking.createURL("/store/products"),
                },
            });

            return redirectSession;
        },
        {
            onSuccess: (redirectSession) => {
                navigation.navigate("Checkout", {redirectSession});
            },
        }
    );

    const [addToCartSnackBarVisible, setAddToCartSnackBarVisible] =
        React.useState(false);

    const queryClient = useQueryClient();
    const addToCurrentCartMutation = useMutation(
        async (quantity) =>
            addToCurrentCart({
                lineItems: [
                    {
                        quantity,
                        catalogReference: {
                            catalogItemId: product._id,
                            appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
                        },
                    },
                ],
            }),
        {
            onSuccess: (response) => {
                queryClient.setQueryData(["currentCart"], response.cart);
                setAddToCartSnackBarVisible(true);
            },
        }
    );

    return (
        <ScrollView
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            styles={styles.container}
            contentContainerStyle={styles.content}
        >
            <Card style={styles.card} mode={"elevated"}>
                <WixMediaImage media={product.media.mainMedia.image.url}>
                    {({url}) => <Card.Cover source={{uri: url}}/>}
                </WixMediaImage>
                <Card.Title title={product.name} subtitle={price}/>
                <Card.Content>
                    <Text variant="bodyMedium">{product.description}</Text>
                    <View style={styles.flexJustifyCenter}>
                        <NumericInput
                            onChange={(value) => setQuantity(value)}
                            value={quantity}
                            minValue={1}
                        />
                    </View>

                    <Button
                        mode="contained"
                        onPress={() => addToCurrentCartMutation.mutateAsync(quantity)}
                        loading={addToCurrentCartMutation.isLoading}
                        disabled={addToCurrentCartMutation.isLoading}
                        style={styles.flexGrow1Button}
                        buttonColor={theme.colors.secondary}
                    >
                        Add to Cart
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.flexGrow1Button}
                        loading={buyNowMutation.isLoading}
                        disabled={buyNowMutation.isLoading}
                        onPress={() => buyNowMutation.mutateAsync(quantity)}
                    >
                        Buy Now
                    </Button>
                </Card.Content>
            </Card>

            {product.additionalInfoSections.map((section) => (
                <List.Accordion title={section.title} key={section.title}>
                    <RenderHtml
                        contentWidth={width}
                        baseStyle={{
                            padding: 10,
                        }}
                        source={{html: section.description ?? ""}}
                    />
                </List.Accordion>
            ))}

            <Portal>
                <Snackbar
                    visible={addToCartSnackBarVisible}
                    onDismiss={() => setAddToCartSnackBarVisible(false)}
                    action={{
                        label: "View Cart",
                        onPress: () => {
                            navigation.navigate("Cart");
                        },
                    }}
                    duration={5000}
                >
                    Added to cart!
                </Snackbar>
            </Portal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 4,
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 4,
    },
    flexGrow1Button: {
        flexGrow: 1,
        marginTop: 10,
    },
    flexJustifyCenter: {
        marginTop: 10,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
});