import {Animated, Platform, SafeAreaView, StatusBar, View} from "react-native";
import {Toast} from "../../components/Toast/Toast";
import {HeroSection} from "../../components/Hero/HeroSection";
import {styles} from "../../styles/home/styles";
import {MainAnimatedBar} from "../../components/Header/MainAnimatedBar";
import {ShopCollectionsHome} from "../../components/ShopCollectionsHome/ShopCollectionsHome";
import {MissionSectionHome} from "../../components/MissionSectionHome/MissionSectionHome";
import {FollowUsHome} from "../../components/FollowUsHome/FollowUsHome";
import {Footer} from "../../components/Footer/Footer";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {ProductScreen} from "../store/product/ProductScreen";
import {CheckoutThankYouScreen} from "../store/checkout/CheckoutThankYouScreen";
import {CartScreen} from "../store/cart/CartScreen";
import {useEffect, useRef} from "react";
import {ProductsScreen} from "../store/products/ProductsScreen";
import {GestureHandlerRootView, ScrollView} from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

export const HomeScreen = ({navigation}) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="HomePage" component={HomePage}/>
            <Stack.Screen name="Products" component={ProductsScreen}/>
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
const HomePage = ({navigation}) => {
    const searchRef = useRef(null);
    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY, 0, 200);
    const translateY = diffClamp.interpolate({
        inputRange: [0, 200],
        outputRange: [0, -200],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        navigation.addListener('focus', () => {
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#FEFBEF', false);
            StatusBar.setBarStyle('dark-content', false);
        });
    }, [navigation]);

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaView
                style={styles.screen}
            >
                <MainAnimatedBar translateY={translateY} searchRef={searchRef}/>
                <ScrollView style={styles.scrollView}
                            alwaysBounceVertical={false}
                            bounces={false}
                            bouncesZoom={false}
                            showsVerticalScrollIndicator={false}
                            onScroll={e => {
                                scrollY.setValue(e.nativeEvent.contentOffset.y);
                            }}
                            scrollEventThrottle={16}
                >

                    <View style={styles.spacer}/>
                    <Toast message={`Free shipping on all\ninternational orders over 35$ 📦`}/>
                    <HeroSection navigation={navigation}/>
                    <ShopCollectionsHome navigation={navigation}/>
                    <MissionSectionHome/>
                    <FollowUsHome/>
                    <Footer/>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}