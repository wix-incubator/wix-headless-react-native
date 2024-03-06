import React from 'react';
import {Dimensions, Image, Pressable, StatusBar, Text, View} from 'react-native';
import {styles} from '../../styles/home/hero/styles';
import Routes from "../../routes/routes";

const windowHeight = Dimensions.get('window').height;

export const HeroSection = ({navigation}) => {
    const [height, setHeight] = React.useState(0);

    return (
        <View style={[styles.heroSection, {
            height: windowHeight - height,
        }]}
              onLayout={(event) => {
                  const {y} = event.nativeEvent.layout;
                  const bottomTabHeight = windowHeight * 0.1;
                  setHeight(y + bottomTabHeight - StatusBar.currentHeight);
              }}
        >
            <View style={styles.heroImageContainer}>
                <Image
                    source={{
                        uri:
                            'https://static.wixstatic.com/media/c837a6_938269b105e04d2c8a3462e43263ecf4~mv2.jpg/v1/fill/w_1441,h_982,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/c837a6_938269b105e04d2c8a3462e43263ecf4~mv2.jpg',
                    }}
                    style={styles.heroImage}
                />
                <View style={styles.overlay}></View>
            </View>
            <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Re.vert</Text>
                <Text style={styles.heroSubtitle}>Home Essentials for Sustainable Living</Text>
            </View>
            <View style={styles.heroShopNow}>
                <Pressable style={styles.heroButton} onPress={() => navigation.navigate(Routes.Store)}>
                    <Text style={styles.heroButtonText}>Shop Now</Text>
                </Pressable>
            </View>
        </View>
    );
};
