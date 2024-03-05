import {ScrollView} from "react-native";

export const DismissKeyboardScrollView = ({children, ...props}) => {
    return (
        <ScrollView
            keyboardShouldPersistTaps="never"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            {...props}
        >
            {children}
        </ScrollView>
    )
}