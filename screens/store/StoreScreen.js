import {createNativeStackNavigator} from "@react-navigation/native-stack";
import * as React from "react";
import {ProductsScreen} from "./products/ProductsScreen";
import {ProductScreen} from "./product/ProductScreen";
import {CheckoutScreen} from "./checkout/CheckoutScreen";
import {CheckoutThankYouScreen} from "./checkout/CheckoutThankYouScreen";
import {CartScreen} from "./cart/CartScreen";
import {CollectionsScreen} from "./collections/CollectionsScreen";

const Stack = createNativeStackNavigator();

export function StoreScreen() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: "ios",
            }}
        >
            <Stack.Screen name="Collection" component={CollectionsScreen}/>
            <Stack.Screen name="Products" component={ProductsScreen}
                          options={({route}) => ({title: route?.params?.items?.name})}
            />
            <Stack.Screen name="Checkout" component={CheckoutScreen}/>
            <Stack.Screen
                name="Product"
                component={ProductScreen}
                options={({route}) => ({title: route?.params?.CollectionName})}
            />
            <Stack.Screen
                name="CheckoutThankYou"
                component={CheckoutThankYouScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen name="Cart" component={CartScreen}/>
        </Stack.Navigator>
    );
}
