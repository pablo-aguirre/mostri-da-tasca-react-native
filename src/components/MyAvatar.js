import {Avatar} from "react-native-paper";
import {globalStyles} from "../../styles/global";

function renderAvatar({source, icon, large, label}) {
    const avatarSize = large ? 150 : 75;

    if (source)
        return <Avatar.Image style={globalStyles.avatar} size={avatarSize} source={source}/>;

    if (icon)
        return <Avatar.Icon style={globalStyles.avatar} size={avatarSize} icon={icon}/>;

    return <Avatar.Text style={globalStyles.avatar} size={avatarSize} label={label}/>;
}

function isValidBase64String(base64String) {
    return base64String && /^[A-Za-z0-9+/]*={0,2}$/.test(base64String);
}


export function UserAvatar({user, large}) {
    const source = isValidBase64String(user.picture) ? {uri: `data:image/png;base64,${user.picture}`} : null;
    const label = user.name.charAt(0).toUpperCase();

    return renderAvatar({source, large, label});
}

export const iconsObjects = {
    monster: "emoticon-devil",
    candy: "candy",
    weapon: "sword",
    armor: "shield-sword",
    amulet: "necklace",
};

export function ObjectAvatar({object, large}) {
    const source = isValidBase64String(object.image) ? {uri: `data:image/png;base64,${object.image}`} : null;
    const icon = iconsObjects[object.type];

    return renderAvatar({source, icon, large});
}
