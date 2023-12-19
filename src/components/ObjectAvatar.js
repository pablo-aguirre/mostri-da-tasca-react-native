import {Avatar} from "react-native-paper";
import {globalStyles} from "../../styles/global";

function isValidBase64(picture) {
    return /^[A-Za-z0-9+/]*={0,2}$/.test(picture)
}

export const iconsObjects = {
    "monster":"emoticon-devil",
    "candy":"candy",
    "weapon":"sword",
    "armor":"shield-sword",
    "amulet":"necklace"
}

export function ObjectAvatar({object, large}) {
    if (!object.image || !isValidBase64(object.image))
        return <Avatar.Icon icon={iconsObjects[object.type]} size={large ? 150 : 75} style={globalStyles.avatar}/>
    return <Avatar.Image source={{uri: `data:image/png;base64,${object.image}`}} style={globalStyles.avatar}
              size={large ? 150 : 75}/>
}

