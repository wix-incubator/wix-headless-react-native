import * as React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import * as Linking from "expo-linking";
import {Dimensions, Text, TouchableOpacity, View} from "react-native";
import {tabs} from "../../data/tabs/data";
import {Icon} from "react-native-paper";

const Tab = createBottomTabNavigator();
const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

function TabBar({state, descriptors, navigation}) {
    return (
        <View style={{flexDirection: 'row'}}>
            {state.routes.map((route, index) => {
                const {options} = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const icon = options.tabBarIcon;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? {selected: true} : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        activeOpacity={1}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{
                            flex: 1,
                            color: "#403F2B",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            flexDirection: "column",
                            height: ScreenHeight * 0.1,
                            backgroundColor: "#C4C197",
                        }}
                    >
                        <Icon size={ScreenWidth * 0.06} source={icon} style={{
                            opacity: isFocused ? 1 : 0.6,
                        }}
                              color={isFocused ? "#403F2B" : "#403F2B66"}
                        />
                        <Text style={{
                            color: isFocused ? "#403F2B" : "#403F2B66",
                        }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

function NavbarTabs({onChangeTab, getActiveTab}) {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarLabelStyle: {
                fontSize: 11,
            },
            tabBarStyle: {
                backgroundColor: "#C4C197",
            },
        }}
                       tabBar={(props) => <TabBar {...props} />}
        >
            {tabs.map((tab) => (
                <Tab.Screen
                    options={{
                        tabBarIcon: tab.icon
                    }}
                    name={tab.name}
                    component={tab.component}
                    // listeners={{
                    //     tabPress: (e) => {
                    //         onChangeTab(tab.name);
                    //     },
                    // }}
                    // options={{
                    //     tabBarIcon: () => <Image source={tab.icon}
                    //                              style={getActiveTab().name === tab.name ? styles.selectedIcon : styles.icon}/>,
                    //     tabBarStyle: {
                    //         backgroundColor: "#C4C197",
                    //         height: ScreenHeight * 0.1,
                    //         display: "flex",
                    //         justifyContent: "center",
                    //         alignItems: "center",
                    //         paddingVertical: ScreenHeight * 0.015,
                    //     },
                    //     tabBarLabelStyle: {
                    //         color: "#403F2B",
                    //         opacity: getActiveTab().name === tab.name ? 1 : 0.6,
                    //         marginBottom: ScreenHeight * 0.015,
                    //     },
                    // }}
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
                                Product: "product",
                                Collections: "collection",
                            },
                        },
                        Home: {
                            path: "home",
                            screens: {
                                Product: "product",
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
