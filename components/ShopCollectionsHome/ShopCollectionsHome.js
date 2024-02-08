import {Text, View} from "react-native";
import {styles} from "../../styles/home/shop-collection/shop-collection";
import {ImageCard} from "../Cards/ImageCard";
import {collections} from "../../data/homeScreen/ShopCollection/data";

export const ShopCollectionsHome = (navigation) => {
    return (
        <View style={styles.view}>
            <Text style={styles.title}>Shop Collections</Text>
            <View style={styles.collections}>
                {
                    collections.map((collection, index) => {
                        return (
                            <View key={index} style={{
                                marginVertical: 10,
                            }}>
                                <ImageCard imageSrc={{
                                    uri: collection.uri,
                                }}
                                           title={collection.title}
                                />
                            </View>
                        );
                    })
                }
            </View>
        </View>
    );
}