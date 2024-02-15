import {SafeAreaView, ScrollView, View} from "react-native";
import {SimpleHeader} from "../../components/Header/SimpleHeader";

export const MemberAreaScreen = ({navigation}) => {
    return (
        <>
            <SafeAreaView style={{flex: 0, backgroundColor: '#c3c198'}}/>
            <SimpleHeader title={'My Accout'} backIcon={false} navigation={navigation}/>
            <View
                keyboardShouldPersistTaps="always"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
                style={{height: '100%', flex: 1, backgroundColor: '#fdfbef'}}>
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}
                    styles={styles.container}
                    contentContainerStyle={styles.content}
                >
                </ScrollView>
            </View>
        </>

    )
}