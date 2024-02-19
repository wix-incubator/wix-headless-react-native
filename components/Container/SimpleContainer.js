import {SafeAreaView, View} from "react-native";
import {SimpleHeader} from "../Header/SimpleHeader";

export const SimpleContainer = ({children, navigation, title, backIcon = true, styles}) => {
    return (
        <>
            <SafeAreaView style={{flex: 0, backgroundColor: '#c3c198'}}/>
            <SimpleHeader navigation={navigation} title={title} backIcon={backIcon}/>
            <View
                style={{
                    flexDirection: "column",
                    height: "100%",
                    backgroundColor: "#fdfbef",
                    flex: 1,
                    ...styles,
                }}
            >
                {children}
            </View>
        </>
    )
}