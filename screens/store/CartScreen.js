import * as React from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {currentCart} from "@wix/ecom";
import {useWixSessionModules} from "../../authentication/session";
import {ActivityIndicator, Button, Surface, TouchableRipple,} from "react-native-paper";
import {Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import {usePrice} from "./price";
import {redirects} from "@wix/redirects";
import {useWixModules} from "@wix/sdk-react";
import * as Linking from "expo-linking";
import {SimpleHeader} from "../../components/Header/SimpleHeader";
import {CartListItem} from "../../components/List/CartListItem";
import {InputPrefix} from "../../components/Input/InputPrefix";
import {PrefixText} from "../../components/PrefixText/PrefixText";

export function CartScreen({navigation}) {
    const {getCurrentCart, createCheckoutFromCurrentCart} =
        useWixModules(currentCart);
    const {createRedirectSession} = useWixSessionModules(redirects);
    const currentCartQuery = useQuery(["currentCart"], getCurrentCart);

    const checkoutMutation = useMutation(
        async () => {
            const currentCheckout = await createCheckoutFromCurrentCart(
                currentCart.ChannelType.OTHER_PLATFORM
            );

            const {redirectSession} = await createRedirectSession({
                ecomCheckout: {checkoutId: currentCheckout.checkoutId},
                callbacks: {
                    thankYouPageUrl: Linking.createURL("/store/checkout/thank-you"),
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

    if (currentCartQuery.isLoading) {
        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <ActivityIndicator/>
            </View>
        );
    }

    if (currentCartQuery.isError) {
        return <Text>Error: {currentCartQuery.error.message}</Text>;
    }

    const subTotal = usePrice({
        amount: currentCartQuery.data.lineItems.reduce((acc, item) => {
            return acc + Number.parseFloat(item.price?.amount) * item.quantity;
        }, 0),
        currencyCode: currentCartQuery.data.currency,
    });

    return (
        <>
            <SafeAreaView style={{flex: 0, backgroundColor: '#c3c198'}}/>
            <SimpleHeader navigation={navigation} title={'My Cart'} backIcon={true}/>
            <View
                style={{
                    flexDirection: "column",
                    height: "100%",
                    backgroundColor: "#fdfbef",
                    flex: 1,
                }}
            >
                <ScrollView
                    style={{flexGrow: 1, height: "100%"}}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                    keyboardShouldPersistTaps="always"
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={currentCartQuery.isFetching}
                            onRefresh={currentCartQuery.refetch}
                        />
                    }
                >
                    {currentCartQuery.data.lineItems.length === 0 ? (
                        <View
                            style={{
                                flexGrow: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text>Your cart is empty</Text>
                            <Button
                                onPress={() => navigation.navigate('Collections', {})}
                                mode="contained"
                                style={{marginTop: 10}}
                            >
                                Go to products
                            </Button>
                        </View>
                    ) : (
                        <View
                            style={{
                                flexGrow: 1,
                                justifyContent: "flex-start",
                            }}
                        >
                            {currentCartQuery.data.lineItems.map((item, index) => (
                                <View key={item._id}>
                                    <CartItem
                                        currency={currentCartQuery.data.currency}
                                        key={item._id}
                                        item={item}
                                    />
                                    <Surface
                                        style={{
                                            margin: 10,
                                            height: 1,
                                            backgroundColor: "#c7c7bd",
                                        }}
                                        mode="elevated"
                                        elevation={0}
                                        children={null}
                                    />
                                </View>
                            ))}
                            <InputPrefix iconName={'tag-outline'} style={{margin: 10, borderWidth: 0}}
                                         label={'Promo code'}
                                         placeholder={'Enter your promo code'}
                                         placeholderTextColor={'#403f2b'}
                            />
                            <Surface
                                style={{
                                    margin: 10,
                                    height: 1,
                                    backgroundColor: "#c7c7bd",
                                }}
                                mode="elevated"
                                elevation={0}
                                children={null}
                            />
                            <InputPrefix iconName={'note-text-outline'} style={{margin: 10, borderWidth: 0}}
                                         label={'Promo code'}
                                         placeholder={'Add a note'}
                                         placeholderTextColor={'#403f2b'}
                            />
                            <Surface
                                style={{
                                    margin: 10,
                                    height: 1,
                                    backgroundColor: "#c7c7bd",
                                }}
                                mode="elevated"
                                elevation={0}
                                children={null}
                            />
                            <View style={{flexDirection: "column", justifyContent: "space-between"}}>
                                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                    <Text style={{margin: 10, color: '#403f2b'}}>Subtotal</Text>
                                    <Text style={{margin: 10, color: '#403f2b'}}>{subTotal}</Text>
                                </View>
                                <Pressable onPress={() => navigation.navigate('Shipping', {})}>
                                    <Text style={{margin: 20, color: '#403f2b', textDecorationLine: 'underline'}}>Estimated
                                        delivery
                                    </Text>
                                </Pressable>
                            </View>
                            <Surface
                                style={{
                                    margin: 10,
                                    height: 1,
                                    backgroundColor: "#c7c7bd",
                                }}
                                mode="elevated"
                                elevation={0}
                                children={null}
                            />
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={{margin: 10, color: '#403f2b', fontSize: 18}}>Total</Text>
                                <Text style={{margin: 10, color: '#403f2b', fontSize: 18}}>{subTotal}</Text>
                            </View>
                            <TouchableRipple
                                onPress={() => checkoutMutation.mutateAsync()}
                                style={styles.checkoutButton}
                                rippleColor="rgba(0, 0, 0, .32)"
                            >
                                <Text style={styles.checkoutButtonText}>Checkout</Text>
                            </TouchableRipple>
                            <View style={{flexDirection: "row", justifyContent: "center", paddingBottom: 20}}>
                                <PrefixText icon="lock">
                                    Secure Checkout
                                </PrefixText>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>
        </>
    );
}

function CartItem({item, currency}) {
    const queryClient = useQueryClient();
    const {updateCurrentCartLineItemQuantity, removeLineItemsFromCurrentCart} =
        useWixSessionModules(currentCart);

    const updateQuantityMutation = useMutation(
        async (quantity) => {
            return updateCurrentCartLineItemQuantity([
                {
                    _id: item._id,
                    quantity,
                },
            ]);
        },
        {
            onSuccess: (response) => {
                queryClient.setQueryData(["currentCart"], response.cart);
            },
        }
    );

    const removeMutation = useMutation(
        async () => {
            return removeLineItemsFromCurrentCart([item._id]);
        },
        {
            onSuccess: (response) => {
                queryClient.setQueryData(["currentCart"], response.cart);
            },
        }
    );
    return (
        <CartListItem
            name={item.productName.translated}
            price={usePrice({
                amount: Number.parseFloat(item.price?.amount) * item.quantity,
                currencyCode: currency,
            })}
            image={item.image}
            quantity={item.quantity}
            quantityOnEdit={!updateQuantityMutation.isLoading}
            quantityHandlerChange={(quantity) =>
                updateQuantityMutation.mutateAsync(quantity)
            }
            removeHandler={() => removeMutation.mutateAsync()}
        />
    );
}

const styles = StyleSheet.create({
    checkoutButton: {
        backgroundColor: '#403f2a',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        padding: 10,
        borderRadius: '50%',
    },
    checkoutButtonText: {
        color: '#fdfbef',
        fontSize: 18,
        textAlign: 'center',
    }
});