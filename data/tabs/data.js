import {HomeScreen} from "../../screens/home/HomeScreen";
import {StoreScreen} from "../../screens/store/StoreScreen";

export const tabs = [
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