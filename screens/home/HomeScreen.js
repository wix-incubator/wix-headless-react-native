import {Animated, ScrollView, View} from "react-native";
import {Toast} from "../../components/Toast/Toast";
import {HeroSection} from "../../components/Hero/HeroSection";
import {styles} from "../../styles/home/styles";
import {AnimtedAppBar} from "../../components/Header/AnimtedAppBar";
import {ShopCollectionsHome} from "../../components/ShopCollectionsHome/ShopCollectionsHome";
import {MissionSectionHome} from "../../components/MissionSectionHome/MissionSectionHome";


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
            {AnimtedAppBar(translateY, navigation)}
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
            </ScrollView>
        </View>
    );
}