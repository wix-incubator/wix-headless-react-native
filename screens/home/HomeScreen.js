import {Animated, ScrollView, View} from "react-native";
import {Toast} from "../../components/Toast/Toast";
import {HeroSection} from "../../components/Hero/HeroSection";
import {styles} from "../../styles/home/styles";
import {AnimtedBar} from "../../components/Header/AnimtedBar";
import {ShopCollectionsHome} from "../../components/ShopCollectionsHome/ShopCollectionsHome";
import {MissionSectionHome} from "../../components/MissionSectionHome/MissionSectionHome";
import {FollowUsHome} from "../../components/FollowUsHome/FollowUsHome";


export function HomeScreen(navigation) {
    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY, 0, 200);
    const translateY = diffClamp.interpolate({
        inputRange: [0, 200],
        outputRange: [0, -200],
        extrapolate: 'clamp',
    });

    return (
        <View
            style={styles.screen}
        >
            {AnimtedBar(translateY, navigation)}
            <ScrollView style={styles.scrollView}
                        contentContainerStyle={styles.scrollView}
                        keyboardShouldPersistTaps="always"
                        alwaysBounceVertical={false}
                        bounces={false}
                        bouncesZoom={false}
                        showsVerticalScrollIndicator={false}
                        onScroll={e => {
                            scrollY.setValue(e.nativeEvent.contentOffset.y);
                        }}
                        scrollEventThrottle={16}
            >
                {/*<Header/>*/}
                <Toast message={`Free shipping on all\ninternational orders over 35$ 📦`}/>
                <HeroSection/>
                <ShopCollectionsHome/>
                <MissionSectionHome/>
                <FollowUsHome/>
            </ScrollView>
        </View>
    );
}