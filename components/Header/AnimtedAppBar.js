import {Animated} from 'react-native';
import {Header} from './Header';

export const AnimtedAppBar = (translateY, navigation) => {
    return (
        <Animated.View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: '#FEFBEF',
                width: '100%',

                //for animation
                height: 100,
                transform: [{translateY: translateY}],
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                elevation: 4,
                zIndex: 1,
            }}>

            <Header/>
        </Animated.View>
    );
};