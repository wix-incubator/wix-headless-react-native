import {Animated} from 'react-native';
import {Header} from './Header';

export const MainAnimatedBar = (translateY, navigation) => {
    return (
        <Animated.View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: '#FEFBEF',
                width: '100%',

                //for animation
                height: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                transform: [{translateY: translateY}],
            }}>

            <Header/>
        </Animated.View>
    );
};