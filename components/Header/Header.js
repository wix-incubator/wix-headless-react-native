import {Appbar} from 'react-native-paper';
import {Text, View} from "react-native";
import {styles} from "../../styles/home/header/styles";
import {InputPrefix} from "../Input/InputPrefix";

const header = (
    <View style={styles.header_content}>
        <Text style={styles.header_title}>R.V</Text>
        <View style={styles.header_searchBox}>
            <InputPrefix
                iconName="magnify"
                placeholder="Search..."
                placeholderTextColor="#333333"
            />
        </View>
    </View>
)

export function Header() {
    return (
        <View style={styles.view}>
            <Appbar.Header style={styles.header}>
                <Appbar.Content title={header}/>
            </Appbar.Header>
        </View>
    );
}
