import * as React from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {checkout, currentCart} from "@wix/ecom";
import {useWixSessionModules} from "../../../authentication/session";
import {ActivityIndicator, Button, Surface, TouchableRipple,} from "react-native-paper";
import {Pressable, RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {usePrice} from "../price";
import {redirects} from "@wix/redirects";
import {useWixModules} from "@wix/sdk-react";
import * as Linking from "expo-linking";
import {CartListItem} from "../../../components/List/CartListItem";
import {InputPrefix} from "../../../components/Input/InputPrefix";
import {PrefixText} from "../../../components/PrefixText/PrefixText";
import _ from 'lodash';
import {SimpleContainer} from "../../../components/Container/SimpleContainer";

const EmptyCart = ({navigation}) => {
    return (
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
                theme={{colors: {primary: '#403f2b'}}}
            >
                Go to products
            </Button>
        </View>
    )
}

export function CartScreen({navigation}) {
    const [userNote, setUserNote] = React.useState('');
    const [userDiscount, setUserDiscount] = React.useState('');
    const [triggerInvalidCoupon, setTriggerInvalidCoupon] = React.useState(false);
    const [checkoutRedirect, setCheckoutRedirect] = React.useState(false);
    const {getCurrentCart, createCheckoutFromCurrentCart} = useWixModules(currentCart);
    const {updateCheckout} = useWixModules(checkout);
    const {createRedirectSession} = useWixSessionModules(redirects);

    const currentCartQuery = useQuery(["currentCart"], () => {
        try {
            return getCurrentCart();
        } catch (e) {
            return console.error(e);
        }
    });

    const checkoutMutation = useMutation(
        async () => {
            setCheckoutRedirect(true);
            let currentCheckout = await createCheckoutFromCurrentCart(
                currentCart.ChannelType.OTHER_PLATFORM
            );
            if (userNote !== '') {
                currentCheckout.buyerNote = userNote;
            }
            if (userDiscount !== '') {
                currentCheckout.discountCode = userDiscount;
            }

            if (userDiscount !== '') {
                try {
                    currentCheckout = await updateCheckout(currentCheckout.checkoutId, currentCheckout, {
                        couponCode: userDiscount,
                    });
                } catch (e) {
                    setTriggerInvalidCoupon(true);
                    setCheckoutRedirect(false);
                    return undefined;
                }
            }

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
                if (!redirectSession) return;
                navigation.navigate("Checkout", {redirectSession});
                setCheckoutRedirect(false);
            },
        }
    );

    if (currentCartQuery.isLoading) {
        return (
            <SimpleContainer navigation={navigation} title={'My Cart'}>
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <ActivityIndicator/>
                </View>
            </SimpleContainer>
        );
    }

    if (currentCartQuery.isError) {
        if (!currentCartQuery.error.message.includes('code: OWNED_CART_NOT_FOUND')) {
            return (
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Text>Error: {currentCartQuery.error.message}</Text>
                </View>
            );
        } else {
            return (
                <SimpleContainer navigation={navigation} title={'My Cart'}>
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
                        <EmptyCart navigation={navigation}/>
                    </ScrollView>
                </SimpleContainer>
            );
        }
    }

    const subTotal = usePrice({
        amount: currentCartQuery.data.lineItems.reduce((acc, item) => {
            return acc + Number.parseFloat(item.price?.amount) * item.quantity;
        }, 0),
        currencyCode: currentCartQuery.data.currency,
    });

    const userAddNoteHandler = _.debounce((text) => {
        setUserNote(text);
    }, 250);

    const userAddDiscountHandler = _.debounce((text) => {
        setTriggerInvalidCoupon(false);
        setUserDiscount(text);
    }, 250);

    return (
        <SimpleContainer navigation={navigation} title={'My Cart'}>
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
                {currentCartQuery?.data?.lineItems?.length === 0 ? (
                    <EmptyCart navigation={navigation}/>
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
                                     placeholder={'Enter your promo code'}
                                     onChangeText={userAddDiscountHandler}
                                     placeholderTextColor={'#403f2b'}
                                     error={triggerInvalidCoupon}
                                     errorMessage={`${userDiscount} is not a valid coupon code`}

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
                                     placeholder={'Add a note'}
                                     onChangeText={userAddNoteHandler}
                                     placeholderTextColor={'#403f2b'}
                                     outlineStyle={{borderWidth: 1, borderColor: '#403f2b'}}
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
                                <Text style={{margin: 10, color: '#403f2b', textDecorationLine: 'underline'}}>
                                    Estimated delivery
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
                            onPress={() => {
                                !checkoutRedirect ? checkoutMutation.mutateAsync() : {};
                            }}
                            rippleColor="rgba(0, 0, 0, .32)"
                            style={styles.checkoutButton}
                        >
                            <Button
                                theme={{colors: {primary: '#fdfbef'}}}
                                loading={checkoutRedirect}
                                contentStyle={{color: '#fdfbef'}}
                            >
                                <Text style={styles.checkoutButtonText}>Checkout</Text>
                            </Button>
                        </TouchableRipple>
                        <View style={{flexDirection: "row", justifyContent: "center", paddingBottom: 20}}>
                            <PrefixText icon="lock">
                                Secure Checkout
                            </PrefixText>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SimpleContainer>
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