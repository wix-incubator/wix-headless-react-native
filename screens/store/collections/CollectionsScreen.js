import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useWixModules} from "@wix/sdk-react";
import {collections} from "@wix/stores";
import {useQuery} from "@tanstack/react-query";
import {CollectionsGrid} from "../../../components/Grid/CollectionsGrid";
import {SimpleContainer} from "../../../components/Container/SimpleContainer";
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";
import {ErrorView} from "../../../components/ErrorView/ErrorView";
import {ProductScreen} from "../product/ProductScreen";
import {CheckoutThankYouScreen} from "../checkout/CheckoutThankYouScreen";
import {CartScreen} from "../cart/CartScreen";
import {ProductsScreen} from "../products/ProductsScreen";
import Routes from "../../../routes/routes";

const Stack = createNativeStackNavigator();

export const CollectionsScreen = ({navigation}) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Collections" component={Collections}/>
            <Stack.Screen name="Poducts" component={ProductsScreen}/>
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
    )
}
export const Collections = ({navigation}) => {
    const {queryCollections} = useWixModules(collections);
    const collectionsResponse = useQuery(["collections"], () => queryCollections().find());
    if (collectionsResponse.isLoading) {
        return (
            <SimpleContainer navigation={navigation} title={"Collections"} backIcon={false}>
                <LoadingIndicator/>
            </SimpleContainer>
        );
    }

    if (collectionsResponse.isError) {
        return <ErrorView message={collectionsResponse.error.message}/>
    }

    const collectionPressHandler = (items) => {
        navigation.navigate(Routes.Products, {items});
    }

    return (
        <SimpleContainer navigation={navigation} title={"Collections"} backIcon={false}>
            <CollectionsGrid data={collectionsResponse.data._items} onPress={collectionPressHandler}/>
        </SimpleContainer>
    )
}