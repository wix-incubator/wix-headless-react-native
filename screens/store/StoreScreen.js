import {createNativeStackNavigator} from "@react-navigation/native-stack";
import * as React from "react";
import {ProductsScreen} from "./ProductsScreen";
import {ProductScreen} from "./ProductScreen";
import {CheckoutScreen} from "./CheckoutScreen";
import {CheckoutThankYouScreen} from "./CheckoutThankYouScreen";
import {CartScreen} from "./CartScreen";

const Stack = createNativeStackNavigator();

export function StoreScreen() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Products" component={ProductsScreen}/>
            <Stack.Screen name="Checkout" component={CheckoutScreen}/>
            <Stack.Screen
                name="Product"
                component={ProductScreen}
                options={({route}) => ({title: route.params.product.name})}
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
