import * as React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import * as Linking from "expo-linking";
import {HomeScreen} from "../../screens/home/HomeScreen";
import {StoreScreen} from "../../screens/store/StoreScreen";
import {Image, StyleSheet} from "react-native";

const Tab = createBottomTabNavigator();

const tabs = [
    {
        name: "Home",
        component: HomeScreen,
        icon: require("../../assets/icons/home-icon.png"),
    },
    {
        name: "Collections",
        component: StoreScreen,
        icon: require("../../assets/icons/collections-icon.png"),
    },
    {
        name: "Chat",
        component: StoreScreen,
        icon: require("../../assets/icons/chat-icon.png"),
    },
    {
        name: "Members Area",
        component: StoreScreen,
        icon: require("../../assets/icons/user-icon.png"),
    },
    {
        name: "Cart",
        component: StoreScreen,
        icon: require("../../assets/icons/cart-icon.png"),
    }
];

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
        opacity: 0.6,
    },
    selectedIcon: {
        width: 24,
        height: 24,
        opacity: 1,
    },
});


function NavbarTabs({onChangeTab, getActiveTab}) {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarLabelStyle: {
                fontSize: 11,
            },
            tabBarStyle: {
                backgroundColor: "#C4C197",
                borderTopWidth: 0,
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity: 0,
            },
        }}>
            {tabs.map((tab) => (
                <Tab.Screen
                    name={tab.name}
                    component={tab.component}
                    listeners={{
                        tabPress: (e) => {
                            onChangeTab(tab.name);
                        },
                    }}
                    options={{
                        tabBarIcon: () => <Image source={tab.icon}
                                                 style={getActiveTab().name === tab.name ? styles.selectedIcon : styles.icon}/>,
                        tabBarStyle: {
                            backgroundColor: "#C4C197",
                            height: 109,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingTop: 20,
                            margin: 0,
                        },
                        tabBarLabelStyle: {
                            color: "#403F2B",
                            opacity: getActiveTab().name === tab.name ? 1 : 0.6,
                        },
                    }}

                    navigationKey={tab.name}
                    key={tab.name}
                />
            ))}
        </Tab.Navigator>
    );
}

export function Tabs() {
    const [activeTab, setActiveTab] = React.useState(tabs[0].name);
    const changeTabHandler = (tab) => {
        setActiveTab(tab);
    }

    const getActiveTabHandler = () => {
        return tabs.find((tab) => tab.name === activeTab);
    }

    return (
        <NavigationContainer
            linking={{
                prefixes: [Linking.createURL("/")],
                config: {
                    screens: {
                        Store: {
                            path: "store",
                            screens: {
                                CheckoutThankYou: "checkout/thank-you",
                                Cart: "cart",
                                Products: "products",
                            },
                        },
                    },
                },
            }}
        >
            <NavbarTabs onChangeTab={changeTabHandler} getActiveTab={getActiveTabHandler}/>
        </NavigationContainer>
    );
}
