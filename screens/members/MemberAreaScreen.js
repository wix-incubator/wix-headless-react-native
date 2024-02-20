import {SafeAreaView, ScrollView, Text, TextInput, View} from "react-native";
import {SimpleHeader} from "../../components/Header/SimpleHeader";
import {useWixSession} from "../../authentication/session";
import {useWixAuth, useWixModules} from "@wix/sdk-react";
import {useMutation, useQuery} from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as SecureStorage from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import {Button} from "react-native-paper";
import {useState} from "react";
import {styles} from "../../styles/members/styles";
import {CustomLoginScreen} from "./CustomLoginScreen";
import {useLoginHandler} from "../../authentication/LoginHandler";
import {members} from "@wix/members";
import {LoadingIndicator} from "../../components/LoadingIndicator/LoadingIndicator";
import {ErrorView} from "../../components/ErrorView/ErrorView";

const FormInput = ({labelValue, placeholderText, inputValue, ...rest}) => {
    return (
        <View
            style={styles.accountInputContainer}>
            <Text style={styles.accountInfoText}>
                {labelValue}:
            </Text>
            <TextInput style={styles.accountInput} placeholder={placeholderText} {...rest} value={inputValue}/>
        </View>
    )
}

const MemberForm = ({session, handlers, values}) => {
    const {firstNameChangeHandler, lastNameChangeHandler, phoneChangeHandler} = handlers;
    const {firstName, lastName, phone} = values;
    return (
        <View style={styles.accountInfo}>
            <Text style={styles.accountInfoTitle}>
                Account
            </Text>
            <Text style={styles.accountInfoSubtitle}>
                Update your personal information.
            </Text>
            <Text style={styles.accountInfoText}>
                Login Email:
            </Text>
            <Text style={styles.accountInfoText}>
                {session.refreshToken.email || 'demo@email'}
            </Text>
            <Text style={styles.accountInfoSmallText}>
                Your Login email can't be changed.
            </Text>
            <FormInput inputValue={firstName} labelValue={'First Name'}
                       placeholderText={'First Name'} onChangeText={firstNameChangeHandler}/>
            <FormInput inputValue={lastName} labelValue={'Last Name'}
                       placeholderText={'Last Name'} onChangeText={lastNameChangeHandler}/>
            <FormInput inputValue={phone} labelValue={'Phone'} placeholderText={'Phone'}
                       onChangeText={phoneChangeHandler} keyboardType="phone-pad"/>
        </View>
    );
}
const SignInSection = () => {
    const auth = useWixAuth();
    const {sessionLoading} = useWixSession();
    const {loginType} = useLoginHandler();

    const isValidLoginUrl = async () => {
        const data = auth.generateOAuthData(
            Linking.createURL("oauth/wix/callback"),
            "stam"
        );

        const {authUrl} = await auth.getAuthUrl(data);

        const response = await fetch(authUrl);
        return response.ok;
    }

    const authSessionMutation = useMutation(
        async () => {
            if (!await isValidLoginUrl()) {
                console.error('Failed to fetch the URL, make sure to follow this guide: https://dev.wix.com/docs/go-headless/getting-started/setup/manage-urls/overview-of-urls');
                return Promise.reject('Failed to fetch the URL, make sure to follow this guide: https://dev.wix.com/docs/go-headless/getting-started/setup/manage-urls/overview-of-urls');
            }

            const data = auth.generateOAuthData(
                Linking.createURL("oauth/wix/callback"),
                "stam"
            );
            await SecureStorage.setItemAsync("oauthState", JSON.stringify(data));

            const {authUrl} = await auth.getAuthUrl(data);

            return authUrl;

        },
        {
            onSuccess: async (authUrl) => {
                if (!authUrl) {
                    console.error('Failed to fetch the URL');
                    return;
                }
                await WebBrowser.openBrowserAsync(authUrl, {});
            },
        }
    );

    const loginScreen = () => {
        switch (loginType) {
            case 'wix':
                return (
                    <View style={styles.loginSection}>
                        <Text style={{fontSize: 20, marginBottom: 20}}>Please sign in to access this area</Text>
                        <Button
                            mode="elevated"
                            icon={"login"}
                            loading={authSessionMutation.isLoading || sessionLoading}
                            disabled={authSessionMutation.isLoading || sessionLoading}
                            onPress={async () => authSessionMutation.mutate()}
                        >
                            Login
                        </Button>
                    </View>
                );
            case 'custom':
                return <CustomLoginScreen/>;
            default:
                return (
                    <View style={styles.loginSection}>
                        <Text style={{fontSize: 20, marginBottom: 20}}>Unknown login type</Text>
                    </View>
                );
        }
    }

    return loginScreen();
}

const MemberSection = ({session, handlers, values}) => {
    const {getCurrentMember, listMembers} = useWixModules(members);
    const {newVisitorSession} = useWixSession();

    const [visibleMenu, setVisibleMenu] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const getCurrentMemberRes = useQuery(["currentMember"], getCurrentMember);
    const getMembersRes = useQuery(["members"], listMembers);
    let {profile, memberInfo, firstName, lastName, phone} = {};
    // useEffect(() => {
    //     const newSession = async () => {
    //         await newVisitorSession()
    //     }
    //     newSession();
    // }, []);

    if (getCurrentMemberRes.isLoading || getMembersRes.isLoading) {
        return <LoadingIndicator/>
    }

    if (getCurrentMemberRes.isError) {
        console.log(session);
        return <ErrorView message={getCurrentMemberRes.error.message}/>
    }


    // if (getCurrentMemberRes.isSuccess) {
    //     setCurrentMember(getCurrentMemberRes.data);
    // }
    //
    // if (getMembersRes.isSuccess) {
    //     profile = getMembersRes.data?.members[1]?.profile;
    //     memberInfo = getMembersRes.data?.members[1]?.contact;
    //     firstName = memberInfo?.firstName;
    //     lastName = memberInfo?.lastName;
    //     phone = memberInfo?.phone;
    //     console.log(getMembersRes.data.members[1]);
    // }

    return (
        <></>
        // <ScrollView style={styles.contentSection}
        //             keyboardShouldPersistTaps="always"
        //             alwaysBounceVertical={false}
        //             showsVerticalScrollIndicator={false}
        //             bounces={false}
        // >
        //     <View style={styles.memberHeader}/>
        //     <View style={styles.memberSection}>
        //         <View style={{
        //             flexDirection: 'row',
        //             justifyContent: 'space-between',
        //             alignItems: 'center',
        //             width: '100%',
        //         }}>
        //             <Image
        //                 style={styles.memberImage}
        //                 source={{
        //                     uri: profile?.photo?.url ??
        //                         `https://ui-avatars.com/api/?background=random&name=
        //                      ${firstName && lastName ? `${firstName} + ${lastName}` : profile?.nickname}
        //                       &color=fff&size=100&font-size=0.33&length=1&rounded=true&uppercase=true`
        //                 }}
        //             />
        //             <Menu
        //                 visible={visibleMenu}
        //                 onDismiss={() => setVisibleMenu(false)}
        //                 anchor={
        //                     <IconButton icon={'dots-vertical'}
        //                                 iconColor={'#403f2b'}
        //                                 size={30}
        //                                 onPress={() => setVisibleMenu(!visibleMenu)}
        //                                 style={{backgroundColor: '#fdfbef'}}
        //                     />
        //                 }
        //                 contentStyle={{backgroundColor: '#fdfbef', padding: 10, marginTop: 40}}
        //                 theme={{colors: {text: '#403f2b'}}}
        //             >
        //                 <Menu.Item leadingIcon="logout" onPress={async () => {
        //                     await newVisitorSession();
        //                     navigation.navigate("Home");
        //                 }} title="Signout"/>
        //             </Menu>
        //         </View>
        //         <Text style={{
        //             fontSize: 20,
        //             marginTop: 20,
        //             color: '#403f2b'
        //         }}>
        //             {firstName && lastName ? `${firstName} + ${lastName}` : profile?.nickname}
        //         </Text>
        //     </View>
        //     <View style={{marginTop: 20, width: '100%'}}>
        //         <List.Accordion title={'My Orders'}
        //                         style={styles.membersOrders}
        //                         titleStyle={{
        //                             fontSize: 20,
        //                             color: '#403f2b',
        //                         }}
        //                         right={(props) => <List.Icon {...props}
        //                                                      icon={`chevron-${props.isExpanded ? 'up' : 'down'}`}
        //                                                      color={'#403f2b'}
        //                                                      style={styles.ordersShowMoreIcon}
        //                         />}
        //         >
        //             {/*{orders.map((order, index) => (*/}
        //             {/*    <List.Item key={index} title={order.title} description={order.description}/>*/}
        //             {/*))}*/}
        //             <Text style={styles.orderDetails}>
        //                 You have no orders yet.
        //             </Text>
        //         </List.Accordion>
        //     </View>
        //     <View style={styles.memberDetails}>
        //         <Text style={styles.memberDetailsTitle}>
        //             My Account
        //         </Text>
        //         <Text style={styles.memberDetailsSubTitle}>
        //             View and edit your personal info below.
        //         </Text>
        //         <View style={{
        //             flexDirection: 'row',
        //             justifyContent: 'space-between',
        //             gap: 10,
        //             width: '100%',
        //             marginTop: 20,
        //         }}>
        //             <Button
        //                 mode="outlined"
        //                 onPress={() => {
        //                     const {firstNameChangeHandler, lastNameChangeHandler, phoneChangeHandler} = handlers;
        //                     firstNameChangeHandler(firstName);
        //                     lastNameChangeHandler(lastName);
        //                     phoneChangeHandler(phone);
        //                 }}
        //                 style={styles.memberActionButton}
        //                 labelStyle={{fontFamily: 'Fraunces-Regular', fontSize: 16}}
        //                 theme={{colors: {primary: '#403f2b'}}}
        //             >
        //                 Discard
        //             </Button>
        //             <Button
        //                 mode="contained"
        //                 onPress={() => {
        //                     const {firstName, lastName, phone} = values;
        //                     console.log(firstName, lastName, phone);
        //                 }} style={styles.memberActionButton}
        //                 labelStyle={{fontFamily: 'Fraunces-Regular', fontSize: 16}}
        //                 theme={{colors: {primary: '#403f2b'}, fonts: {fontFamily: 'Fraunces-Regular'}}}
        //             >
        //                 Update Info
        //             </Button>
        //         </View>
        //         <MemberForm session={session} handlers={handlers} values={values}/>
        //     </View>
        // </ScrollView>
    );
}

const MemberArea = ({session, handlers, values}) => {
    if (session.refreshToken.role !== "member") {
        return <SignInSection/>
    } else {
        return <MemberSection session={session} handlers={handlers} values={values}/>
    }
}

export const MemberAreaScreen = ({navigation}) => {
    const {session} = useWixSession();
    const [firstName, setFirstName] = useState(session.refreshToken.firstName);
    const [lastName, setLastName] = useState(session.refreshToken.lastName);
    const [phone, setPhone] = useState(session.refreshToken.phone);

    const firstNameChangeHandler = (text) => {
        setFirstName(text);
    };

    const lastNameChangeHandler = (text) => {
        setLastName(text);
    };

    const phoneChangeHandler = (text) => {
        setPhone(text);
    }

    const formHandlers = {
        firstNameChangeHandler,
        lastNameChangeHandler,
        phoneChangeHandler,
    }

    const formValues = {
        firstName,
        lastName,
        phone,
    }

    return (
        <>
            <SafeAreaView style={{flex: 0, backgroundColor: '#c3c198'}}/>
            <SimpleHeader title={'My Account'} backIcon={false} navigation={navigation}/>
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
                    <MemberArea session={session} handlers={formHandlers} values={formValues}/>
                </ScrollView>
            </View>
        </>

    )
}