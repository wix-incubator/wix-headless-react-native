import {SafeAreaView, ScrollView, View} from "react-native";
import {SimpleHeader} from "../../../components/Header/SimpleHeader";
import {useWixSession} from "../../../authentication/session";
import {useState} from "react";
import {styles} from "../../../styles/members/styles";
import {SignInScreen} from "../SignInScreen/SignInScreen";
import {MemberScreen} from "../MemberScreen/MemberScreen";
import {MemberHandler} from "../../../authentication/MemberHandler";

const MemberArea = ({showLoginHandler, showLogin,}) => {
    const {session} = useWixSession();
    if (session.refreshToken.role !== "member") {
        return <SignInScreen showLoginHandler={showLoginHandler} showLogin={showLogin}/>
    } else {
        return (
            <MemberHandler>
                <MemberScreen/>
            </MemberHandler>
        )
    }
}

export const MemberAreaScreen = ({navigation}) => {
    const [showLogin, setShowLogin] = useState(false);

    const showLoginHandler = (val) => {
        setShowLogin(val);
    }

    const navigateBack = () => {
        if (showLogin) {
            showLoginHandler(false);
            return;
        }
        navigation.goBack();
    }

    return (
        <>
            <SafeAreaView style={{flex: 0, backgroundColor: '#c3c198'}}/>
            <SimpleHeader title={'My Account'} backIcon={true} navigation={navigation} onBackPress={navigateBack}/>
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
                    <MemberArea showLoginHandler={showLoginHandler} showLogin={showLogin}/>
                </ScrollView>
            </View>
        </>

    )
}