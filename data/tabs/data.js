import {HomeScreen} from "../../screens/home/HomeScreen";
import {StoreScreen} from "../../screens/store/StoreScreen";
import {CartScreen} from "../../screens/store/cart/CartScreen";
import {MemberAreaScreen} from "../../screens/members/MemberAreaScreen";

export const tabs = [
    {
        name: "Home",
        component: HomeScreen,
        icon: 'home-outline'
    },
    {
        name: "Collections",
        component: StoreScreen,
        icon: 'view-grid-outline'
    },
    {
        name: "Members Area",
        component: MemberAreaScreen,
        icon: 'account-outline'
    },
    {
        name: "Cart",
        component: CartScreen,
        icon: 'cart-outline'
    }
];