import {checkout, currentCart} from "@wix/ecom";
import {redirects} from "@wix/redirects";
import * as Linking from "expo-linking";
import * as React from "react";
import {Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View,} from "react-native";
import {Button, Card, IconButton, List, Portal, Snackbar, useTheme,} from "react-native-paper";
import RenderHtml from "react-native-render-html";
import {usePrice} from "../price";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useWixSessionModules} from "../../../authentication/session";
import {WixMediaImage} from "../../../WixMediaImage";
import {NumericInput} from "../../../components/Input/NumericInput";
import {useWixModules} from "@wix/sdk-react";
import {inventory} from "@wix/stores";
import {SimpleContainer} from "../../../components/Container/SimpleContainer";
import Routes from "../../../routes/routes";

export function ProductScreen({route, navigation}) {
    const {product, collectionName} = route.params;
    const {width} = useWindowDimensions();
    const theme = useTheme();
    const [quantity, setQuantity] = React.useState(1);
    const {addToCurrentCart, getCurrentCart, updateCurrentCartLineItemQuantity} = useWixSessionModules(currentCart);

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
                navigation.navigate(Routes.Checkout, {redirectSession});
            },
        }
    );

    const [addToCartSnackBarVisible, setAddToCartSnackBarVisible] =
        React.useState(false);

    const queryClient = useQueryClient();
    const addToCart = (quantity) => addToCurrentCart({
        lineItems: [
            {
                quantity,
                catalogReference: {
                    catalogItemId: product._id,
                    appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
                },
            },
        ],
    });

    const addToCurrentCartMutation = useMutation(
        async (quantity) => {
            try {
                const currentCart = await getCurrentCart();

                const existingProductIndex = currentCart.lineItems.findIndex(
                    (item) => item.catalogReference.catalogItemId === product._id
                );

                if (existingProductIndex !== -1 && currentCart) {
                    return updateCurrentCartLineItemQuantity([{
                        _id: currentCart.lineItems[existingProductIndex]._id,
                        quantity: currentCart.lineItems[existingProductIndex].quantity + quantity,
                    }]);
                } else {
                    return addToCart(quantity);
                }
            } catch (e) {
                return addToCart(quantity);
            }
        },
        {
            onSuccess: (response) => {
                queryClient.setQueryData(["currentCart"], response.cart);
                setAddToCartSnackBarVisible(true);
            },
        }
    );

    const onQuantityChanged = (val) => {
        setQuantity(parseInt(val));
    }
    const prodInventoryId = product?.inventoryItemId;
    const {getInventoryVariants} = useWixModules(inventory);
    const inventoryVariantsResponse = useQuery(["inventoryVariants", prodInventoryId], () =>
        getInventoryVariants(prodInventoryId)
    );
    const inventoryQuantity = (inventoryVariantsResponse?.data?.inventoryItem?.variants[0]?.quantity)
    const addToCartHandler = () => {
        !addToCurrentCartMutation.isLoading ? addToCurrentCartMutation.mutateAsync(quantity) : {}
    }
    return (
        <SimpleContainer navigation={navigation} title={collectionName} backIcon={true}>
            <ScrollView
                keyboardShouldPersistTaps="always"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
                styles={styles.container}
                contentContainerStyle={styles.content}
            >
                <View style={styles.backContainer}>
                    <Pressable onPress={() => navigation.goBack()}
                               style={styles.backButton}>
                        <IconButton icon={"chevron-left"} onPress={() => navigation.goBack()}/>
                        <Text style={styles.backButtonText}>
                            Back To {collectionName}
                        </Text>
                    </Pressable>
                </View>
                <Card style={styles.card} mode={"elevated"} elevation={0}>
                    <WixMediaImage media={product.media.mainMedia.image.url} height={400} width={300}>
                        {({url}) => <Card.Cover source={{uri: url}}
                                                style={styles.cardImage}/>}
                    </WixMediaImage>
                    {product.sku && <Card.Title title={''} subtitle={`SKU: ${product.sku}`}
                                                subtitleStyle={styles.productSku}/>}
                    <Card.Title title={product.name} subtitle={price}
                                titleStyle={styles.productTitle}/>
                    <Card.Content>
                        <View style={styles.flexJustifyStart}>
                            <Text style={{fontSize: 13, marginBottom: 8}}>Quantity</Text>
                            <NumericInput
                                value={1}
                                onChange={onQuantityChanged}
                                min={1}
                                max={inventoryQuantity}
                                style={{width: 100, justifyContent: "flex-start", alignItems: "flex-start"}}
                            />
                        </View>

                        <Button
                            mode="contained"
                            onPress={addToCartHandler}
                            loading={addToCurrentCartMutation.isLoading}
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
                        style={{backgroundColor: '#FDFBEF'}}
                        action={{
                            label: "View Cart",
                            labelStyle: {color: '#403F2B'},
                            onPress: () => {
                                navigation.navigate(Routes.Cart);
                            },
                        }}
                        label
                        duration={5000}
                    >
                        <Text style={{color: '#403F2B'}}>Added to Cart</Text>
                    </Snackbar>
                </Portal>
            </ScrollView>
        </SimpleContainer>
    );
}

const styles = StyleSheet.create({
    backContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: '100%'
    },
    backButtonText: {
        textAlign: "center",
        fontSize: 15
    },
    card: {
        marginHorizontal: 20,
        flex: 1,
        height: '100%',
    },
    cardImage: {
        marginHorizontal: 20,
        height: 400,
        borderRadius: 0
    },
    productSku: {
        margin: 0,
        padding: 0
    },
    productTitle: {
        fontFamily: "Fraunces-Regular",
        fontSize: 40,
        paddingTop: 40
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