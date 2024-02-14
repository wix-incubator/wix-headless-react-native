import {checkout, currentCart} from "@wix/ecom";
import {redirects} from "@wix/redirects";
import * as Linking from "expo-linking";
import * as React from "react";
import {Pressable, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View,} from "react-native";
import {Button, Card, IconButton, List, Portal, Snackbar, useTheme,} from "react-native-paper";
import RenderHtml from "react-native-render-html";
import {usePrice} from "./price";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useWixSessionModules} from "../../authentication/session";
import {WixMediaImage} from "../../WixMediaImage";
import {SimpleHeader} from "../../components/Header/SimpleHeader";
import {NumericInput} from "../../components/Input/NumericInput";
import {useWixModules} from "@wix/sdk-react";
import {inventory} from "@wix/stores";

export function ProductScreen({route, navigation}) {
    const {product, collectionName} = route.params;
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

    const description = product?.description ?? "";

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

    const onQuantityChanged = (val) => {
        setQuantity(val);
    }
    const prodInventoryId = product?.inventoryItemId;
    const {getInventoryVariants} = useWixModules(inventory);
    const inventoryVariantsResponse = useQuery(["inventoryVariants", prodInventoryId], () =>
        getInventoryVariants(prodInventoryId)
    );
    const inventoryQuantity = (inventoryVariantsResponse?.data?.inventoryItem?.variants[0]?.quantity)
    return (
        <>
            <SafeAreaView style={{flex: 0, backgroundColor: '#c3c198'}}/>
            <SimpleHeader title={collectionName} backIcon={true} navigation={navigation}/>
            <View
                keyboardShouldPersistTaps="always"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
                style={{height: '100%', flex: 1, backgroundColor: '#fdfbef'}}>
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}
                    styles={styles.container}
                    contentContainerStyle={styles.content}
                >
                    <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 20}}>
                        <Pressable onPress={() => navigation.goBack()}
                                   style={{
                                       flexDirection: "row",
                                       alignItems: "center",
                                       justifyContent: "flex-start",
                                       width: '100%'
                                   }}>
                            <IconButton icon={"chevron-left"} onPress={() => navigation.goBack()}/>
                            <Text style={{textAlign: "center", fontSize: 15}}>
                                Back To {collectionName}
                            </Text>
                        </Pressable>
                    </View>
                    <Card style={styles.card} mode={"elevated"} elevation={0}>
                        <WixMediaImage media={product.media.mainMedia.image.url} height={400} width={300}>
                            {({url}) => <Card.Cover source={{uri: url}}
                                                    style={{marginHorizontal: 20, height: 400, borderRadius: 0}}/>}
                        </WixMediaImage>
                        {product.sku && <Card.Title title={''} subtitle={`SKU: ${product.sku}`}
                                                    subtitleStyle={{margin: 0, padding: 0}}/>}
                        <Card.Title title={product.name} subtitle={price}
                                    titleStyle={{fontFamily: "Fraunces-Regular", fontSize: 40, paddingTop: 40}}/>
                        <Card.Content>
                            <View style={styles.flexJustifyStart}>
                                <Text style={{fontSize: 13, marginBottom: 8}}>Quantity</Text>
                                <NumericInput
                                    value={quantity.toString()}
                                    onChange={onQuantityChanged}
                                    min={1}
                                    max={inventoryQuantity}
                                    step={1}
                                    style={{width: 100, justifyContent: "flex-start", alignItems: "flex-start"}}
                                    showIndicators={false}
                                />
                                {/*<NumericInput*/}
                                {/*    onChange={(value) => setQuantity(value)}*/}
                                {/*    value={quantity}*/}
                                {/*    minValue={1}*/}
                                {/*/>*/}
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
                            <RenderHtml style={styles.flexJustifyStart} source={{html: description}}
                                        contentWidth={width}/>
                        </Card.Content>
                    </Card>

                    {product.additionalInfoSections.map((section) => (
                        <List.Accordion title={section.title} key={section.title}
                                        style={{paddingHorizontal: 20, backgroundColor: '#fdfbef'}}
                                        right={(props) => <IconButton
                                            icon={`${props.isExpanded ? 'minus' : 'plus'}`} {...props}/>}
                                        titleStyle={{fontSize: 20, fontFamily: "Fraunces-Regular"}}
                        >


                            <RenderHtml
                                contentWidth={width}
                                baseStyle={{paddingHorizontal: 35}}
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
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        flex: 1,
        height: '100%',
    },
    container: {
        flex: 1,
        height: '100%',
    },
    content: {
        paddingHorizontal: 1,
    },
    flexGrow1Button: {
        flexGrow: 1,
        marginTop: 20,
        backgroundColor: '#403f2a',
    },
    flexJustifyCenter: {
        marginTop: 20,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    flexJustifyStart: {
        marginTop: 20,
        justifyContent: "flex-start",
        alignContent: "flex-start",
        alignItems: "flex-start",
    },
});