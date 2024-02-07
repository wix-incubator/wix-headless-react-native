import {useWixSession, useWixSessionModules} from "../../authentication/session";
import {members} from "@wix/members";
import {useQuery} from "@tanstack/react-query";
import {ActivityIndicator} from "react-native-paper";
import {Text, View} from "react-native";

function MemberNickname() {
    const {getCurrentMember} = useWixSessionModules(members);

    const memberDetails = useQuery(["memberDetails"], getCurrentMember);

    if (memberDetails.isLoading) {
        return <ActivityIndicator/>;
    }

    if (memberDetails.isError) {
        return <Text>Error: {memberDetails.error.message}</Text>;
    }

    return <Text>{memberDetails.data.member.profile.nickname}</Text>;
}

export function HomeScreen({navigation}) {
    const {session} = useWixSession();

    return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Text>
                Home Screen:{" "}
                {session.refreshToken.role === "member" ? (
                    <MemberNickname/>
                ) : (
                    "Anonymous"
                )}
            </Text>
        </View>
    );
}