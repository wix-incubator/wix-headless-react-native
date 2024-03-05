import React, {createRef, useEffect, useRef, useState} from 'react';
import {Appbar, List, Searchbar} from 'react-native-paper';
import {Image, Keyboard, ScrollView, Text, TouchableWithoutFeedback, View} from 'react-native';
import {styles} from '../../styles/home/header/styles';
import {debounce} from 'lodash';
import {useWixModules} from "@wix/sdk-react";
import {useQuery} from "@tanstack/react-query";
import {LoadingIndicator} from "../LoadingIndicator/LoadingIndicator";
import {useNavigation} from "@react-navigation/native";
import {products} from "@wix/stores";
import {WixMediaImage} from "../../WixMediaImage";

const HeaderContent = ({handleShowResults, showResults}) => {
    const {queryProducts} = useWixModules(products);
    const [searchQuery, setSearchQuery] = useState('');
    // const [showResults, setShowResults] = useState(false);
    const searchRef = createRef();
    const navigation = useNavigation();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const productsResponse = useQuery(["products"], () => queryProducts().find());

    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            handleShowResults(false);
            debouncedBlur();
        });
        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (!productsResponse.isLoading && productsResponse?.data?.items) {
            setFilteredProducts(productsResponse.data.items);
        }
    }, [productsResponse?.data?.items]);

    const debouncedBlur = useRef(debounce(() => {
        searchRef?.current?.blur();
    }, 500)).current;

    const onSearchChange = (query) => {
        setSearchQuery(query);
        handleShowResults(query.length > 0);
        setFilteredProducts(productsResponse.data.items.filter((product) =>
            product.name.toLowerCase().startsWith(query.toLowerCase())));
    };

    const handleContainerPress = () => {
        Keyboard.dismiss();
        debouncedBlur();
    };

    const redirectToProduct = (product) => {
        handleShowResults(false);
        navigation.navigate('Product', {product, collectionName: product.name})
    };
    return (
        <TouchableWithoutFeedback onPress={handleContainerPress}>
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
                    />
                    {showResults && (!productsResponse.isLoading && productsResponse?.data?.items ?
                        (<ScrollView style={styles.searchResultsContainer}>
                                {filteredProducts.length > 0 ? filteredProducts.map((product, i) => (
                                        <List.Item
                                            titleStyle={styles.searchResultFont}
                                            key={i}
                                            title={
                                                <View
                                                    style={styles.searchResultItem}
                                                >
                                                    <WixMediaImage
                                                        media={product.media.mainMedia.image.url}
                                                        width={30}
                                                        height={30}
                                                    >
                                                        {({url}) => {
                                                            return (
                                                                <Image
                                                                    style={[styles.image, {
                                                                        width: 30,
                                                                        height: 30,
                                                                    }]}
                                                                    source={{
                                                                        uri: url,
                                                                    }}
                                                                />
                                                            );
                                                        }}
                                                    </WixMediaImage>
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
                        ) : <LoadingIndicator/>)
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export function Header({handleShowResults, showResults}) {
    return (
        <View style={styles.view}>
            <Appbar.Header style={styles.header}>
                <HeaderContent handleShowResults={handleShowResults} showResults={showResults}/>
            </Appbar.Header>
        </View>
    );
}
