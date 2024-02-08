import {List} from 'react-native-paper';
import {Linking, Text, TouchableOpacity, View} from "react-native";
import {styles} from '../../styles/home/footer/styles'
import {data} from "../../data/footer/footer-links/data";

export const Footer = () => {
    const handleWixPress = () => {
        Linking.openURL('https://www.wix.com');
    }
    return (
        <View style={styles.view}>
            <List.Section>
                {data.map((item, index) => {
                    return (
                        <List.Item
                            key={index}
                            title={item.title}
                            onPress={() => {
                            }}
                            style={styles.listItem}
                            titleStyle={styles.listItemTitle}
                        />
                    )
                })}
            </List.Section>
            <View style={{display: "flex", flexDirection: "row", flexWrap: 'wrap', gap: -10}}>
                <Text style={styles.text}>
                    © 2035 by Re.Vert. Powered and secured by
                </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://wix.com')}>
                    <Text style={styles.text_pressable}>
                        Wix
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}