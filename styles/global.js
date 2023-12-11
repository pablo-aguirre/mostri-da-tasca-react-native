import {StyleSheet} from "react-native"
export const globalStyles = StyleSheet.create({
    container: {
        flex: 1
    }, list: {
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: lightColors.greyOutline,
    },
    avatar: {alignSelf: 'center'},
    cardWithoutBorder: {borderWidth: 0, shadowColor: 'transparent'}
});

export const COLORS = {
    blue:'#067cd6'
}