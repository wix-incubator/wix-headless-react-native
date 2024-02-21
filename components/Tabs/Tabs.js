import * as React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Dimensions, Text, TouchableOpacity, View} from "react-native";
import {Icon} from "react-native-paper";

const Tab = createBottomTabNavigator();
const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

export const TabBar = ({state, descriptors, navigation}) => {
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