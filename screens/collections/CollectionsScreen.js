import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useWixModules} from "@wix/sdk-react";
import {collections} from "@wix/stores";
import {useQuery} from "@tanstack/react-query";
import {SafeAreaView, Text, View} from "react-native";
import {ActivityIndicator} from "react-native-paper";
import {useEffect, useState} from "react";
import {CollectionsHeader} from "../../components/Header/CollectionsHeader";
import {CollectionsGrid} from "../../components/Grid/CollectionsGrid";

const Stack = createNativeStackNavigator();

export const CollectionsScreen = ({navigation}) => {
    const {queryCollections} = useWixModules(collections);
    const collectionsResponse = useQuery(["collections"], () => queryCollections().find());
    if (collectionsResponse.isLoading) {
        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <ActivityIndicator/>
            </View>
        );
    }

    if (collectionsResponse.isError) {
        return <Text>Error: {collectionsResponse.error.message}</Text>;
    }

    const [data, setData] = useState(collectionsResponse.data._items);

    const collectionPressHandler = (items) => {
        navigation.navigate("Products", {items});
    }

    useEffect(() => {
        setData(collectionsResponse.data);
    }, [collectionsResponse.data]);
    return (
        <>
            <SafeAreaView style={{flex: 0, backgroundColor: '#c3c198'}}/>
            <View
                keyboardShouldPersistTaps="always"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
                style={{height: '100%', flex: 1, backgroundColor: '#fdfbef'}}
            >
                <CollectionsHeader/>
                <CollectionsGrid data={data?._items} onPress={collectionPressHandler}/>
            </View>
        </>
    )
}