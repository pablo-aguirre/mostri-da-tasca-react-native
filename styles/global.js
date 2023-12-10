import {StyleSheet} from "react-native";
import {lightColors} from "@rneui/themed";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1
    }, list: {
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: lightColors.greyOutline,
    },
    avatar: {alignSelf: 'center'}
});