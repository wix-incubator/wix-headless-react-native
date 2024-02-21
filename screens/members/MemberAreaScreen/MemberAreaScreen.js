import {SafeAreaView, ScrollView, View} from "react-native";
import {SimpleHeader} from "../../../components/Header/SimpleHeader";
import {useWixSession} from "../../../authentication/session";
import {useWixModules} from "@wix/sdk-react";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {styles} from "../../../styles/members/styles";
import {members} from "@wix/members";
import {LoadingIndicator} from "../../../components/LoadingIndicator/LoadingIndicator";
import {ErrorView} from "../../../components/ErrorView/ErrorView";
import {SignInScreen} from "../SignInScreen/SignInScreen";
import {MemberScreen} from "../MemberScreen/MemberScreen";
import {MemberHandler} from "../../../authentication/MemberHandler";

const MemberArea = ({showLoginHandler, showLogin}) => {
    const {session} = useWixSession();
    if (session.refreshToken.role !== "member") {
        return <SignInScreen showLoginHandler={showLoginHandler} showLogin={showLogin}/>
    } else {
        const {getCurrentMember, updateMember} = useWixModules(members);
        const getCurrentMemberRes = useQuery(["currentMember"], getCurrentMember);

        if (getCurrentMemberRes.isLoading) {
            return <LoadingIndicator/>
        }

        if (getCurrentMemberRes.isError) {
            return <ErrorView message={getCurrentMemberRes.error.message}/>
        }

        const member = getCurrentMemberRes.data.member;
        return (
            <MemberHandler>
                <MemberScreen member={member}/>
            </MemberHandler>
        )
    }
}

export const MemberAreaScreen = ({navigation}) => {
    const {session} = useWixSession();
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