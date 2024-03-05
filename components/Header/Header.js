import React, {useEffect, useState} from 'react';
import {Appbar, List, Searchbar} from 'react-native-paper';
import {Image, Text, View} from 'react-native';
import {styles} from '../../styles/home/header/styles';
import {useWixModules} from "@wix/sdk-react";
import {useQuery} from "@tanstack/react-query";
import {LoadingIndicator} from "../LoadingIndicator/LoadingIndicator";
import {useNavigation} from "@react-navigation/native";
import {products} from "@wix/stores";
import {WixMediaImage} from "../../WixMediaImage";
import {ScrollView} from 'react-native-gesture-handler';
import Routes from "../../routes/routes";

const HeaderContent = ({handleShowResults, showResults, searchRef}) => {
    const {queryProducts} = useWixModules(products);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const productsResponse = useQuery(["products"], () => queryProducts().find());
    useEffect(() => {
        if (!productsResponse.isLoading && productsResponse?.data?.items) {
            setFilteredProducts(productsResponse.data.items);
        }
    }, [productsResponse?.data?.items]);


    const onSearchChange = (query) => {
        setSearchQuery(query);
        handleShowResults(true);
        setFilteredProducts(productsResponse.data?.items?.filter((product) =>
            product.name.toLowerCase().startsWith(query.toLowerCase())));
    };


    const redirectToProduct = (product) => {
        navigation.navigate(Routes.Product, {product, collectionName: product.name})
    };
    return (
        <View style={styles.header_content}>
            <Text style={styles.header_title}>R.V</Text>
            <View style={styles.header_searchBox}>
                <Searchbar
                    placeholder="Search..."
                    onChangeText={onSearchChange}
                    value={searchQuery}
                    mode={'view'}
                    style={styles.searchContainer}
                    inputStyle={styles.searchInput}
                    theme={{colors: {primary: '#403F2B'}}}
                    showDivider={false}
                    elevation={0}
                    ref={searchRef}
                    onFocus={() => {
                        handleShowResults(true);
                    }}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    onBlur={() => {
                        handleShowResults(searchQuery.length > 0);
                    }}
                    onClearIconPress={() => {
                        handleShowResults(false);
                    }}
                />
                {showResults && (!productsResponse.isLoading && productsResponse?.data?.items ?
                        searchQuery.length > 0 && (
                            <ScrollView style={styles.searchResultsContainer}
                                        nestedScrollEnabled={true}
                            >
                                {filteredProducts.length > 0 ? filteredProducts.map((product, i) => (
                                        <List.Item
                                            key={i}
                                            title={
                                                <View
                                                    style={styles.searchResultItem}
                                                >
                                                    <View style={{flex: 1}}>
                                                        <WixMediaImage
                                                            media={product.media.mainMedia.image.url}
                                                            width={100}
                                                            height={100}
                                                        >
                                                            {({url}) => {
                                                                return (
                                                                    <Image
                                                                        style={{
                                                                            width: 30,
                                                                            height: 30,
                                                                        }}
                                                                        source={{
                                                                            uri: url,
                                                                        }}
                                                                    />
                                                                );
                                                            }}
                                                        </WixMediaImage>
                                                    </View>
                                                    <Text>{product.name}</Text>
                                                </View>
                                            }
                                            onPress={redirectToProduct.bind(this, product)}
                                        />
                                    )
                                ) : <List.Item
                                    titleStyle={styles.searchResultItem}
                                    key={0}
                                    title={<Text>No results found</Text>}
                                />}
                            </ScrollView>
                        ) :
                        <View style={styles.searchResultsContainer}>
                            <LoadingIndicator/>
                        </View>
                )
                }
            </View>
        </View>
    );
};

export function Header({handleShowResults, showResults, searchRef}) {
    return (
        <View style={styles.view}>
            <Appbar.Header style={styles.header}>
                <HeaderContent handleShowResults={handleShowResults} showResults={showResults} searchRef={searchRef}/>
            </Appbar.Header>
        </View>
    );
}
