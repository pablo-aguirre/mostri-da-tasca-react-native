import {Avatar} from "react-native-paper";
import {globalStyles} from "../../styles/global";

export const iconsObjects = {
    monster: "emoticon-devil",
    candy: "candy",
    weapon: "sword",
    armor: "shield-sword",
    amulet: "necklace",
}

function size(large) {
    return large ? 150 : 75
}

export function UserAvatar({user, large}) {
    return user.picture ?
        <Avatar.Image style={globalStyles.avatar} size={size(large)}
                      source={{uri: 'data:image/png;base64,' + user.picture.replace(/\s/g, '')}}/> :
        <Avatar.Text style={globalStyles.avatar} size={size(large)} label={user.name[0]}/>
}

export function ObjectAvatar({object, large}) {
    return object.image ?
        <Avatar.Image style={globalStyles.avatar} size={size(large)}
                      source={{uri: 'data:image/png;base64,' + object.image.replace(/\s/g, '')}}/> :
        <Avatar.Icon style={globalStyles.avatar} size={size(large)} icon={iconsObjects[object.type]}/>
}
