import {Animated, ScrollView, View} from "react-native";
import {Toast} from "../../components/Toast/Toast";
import {HeroSection} from "../../components/Hero/HeroSection";
import {styles} from "../../styles/home/styles";
import {MainAnimatedBar} from "../../components/Header/MainAnimatedBar";
import {ShopCollectionsHome} from "../../components/ShopCollectionsHome/ShopCollectionsHome";
import {MissionSectionHome} from "../../components/MissionSectionHome/MissionSectionHome";
import {FollowUsHome} from "../../components/FollowUsHome/FollowUsHome";
import {Footer} from "../../components/Footer/Footer";


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
            {MainAnimatedBar(translateY, navigation)}
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
                <HeroSection navigation={navigation}/>
                <ShopCollectionsHome/>
                <MissionSectionHome/>
                <FollowUsHome/>
                <Footer/>
            </ScrollView>
        </View>
    );
}