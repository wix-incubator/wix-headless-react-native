import {Animated, ScrollView, View} from "react-native";
import {Toast} from "../../components/Toast/Toast";
import {HeroSection} from "../../components/Hero/HeroSection";
import {styles} from "../../styles/home/styles";
import {AnimtedAppBar} from "../../components/Header/AnimtedAppBar";


export function HomeScreen(navigation) {
    const scrollY = new Animated.Value(0);
    const translateY = scrollY.interpolate({
        inputRange: [0, 100],
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
                        showsVerticalScrollIndicator={false}
                        onScroll={e => {
                            scrollY.setValue(e.nativeEvent.contentOffset.y);
                        }}
                        scrollEventThrottle={16}
            >
                {/*<Header/>*/}
                <Toast message={`Free shipping on all\ninternational orders over 35$ 📦`}/>
                <HeroSection/>
            </ScrollView>
        </View>
    );
}