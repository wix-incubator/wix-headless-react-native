import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useWixModules} from "@wix/sdk-react";
import {collections} from "@wix/stores";
import {useQuery} from "@tanstack/react-query";
import {Text, View} from "react-native";
import {ActivityIndicator} from "react-native-paper";
import {CollectionsGrid} from "../../components/Grid/CollectionsGrid";
import {SimpleContainer} from "../../components/Container/SimpleContainer";

const Stack = createNativeStackNavigator();

export const CollectionsScreen = ({navigation}) => {
    const {queryCollections} = useWixModules(collections);
    const collectionsResponse = useQuery(["collections"], () => queryCollections().find());
    if (collectionsResponse.isLoading) {
        return (
            <SimpleContainer navigation={navigation} title={"Collections"} backIcon={false}>
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <ActivityIndicator/>
                </View>
            </SimpleContainer>
        );
    }

    if (collectionsResponse.isError) {
        return <Text>Error: {collectionsResponse.error.message}</Text>;
    }

    const collectionPressHandler = (items) => {
        navigation.navigate("Products", {items});
    }

    return (
        <SimpleContainer navigation={navigation} title={"Collections"} backIcon={false}>
            <CollectionsGrid data={collectionsResponse.data._items} onPress={collectionPressHandler}/>
        </SimpleContainer>
    )
}