import {Avatar} from "react-native-paper";
import {globalStyles} from "../../styles/global";

function isValidBase64(picture) {
    return /^[A-Za-z0-9+/]*={0,2}$/.test(picture)
}

export default function UserAvatar({user, large}) {
    return (
        (!user.picture || !isValidBase64(user.picture)) ?
            <Avatar.Text label={user.name.charAt(0).toUpperCase()} style={globalStyles.avatar} size={large ? 150 : 75}/> :
            <Avatar.Image source={{uri: `data:image/png;base64,${user.picture}`}} style={globalStyles.avatar} size={large ? 150 : 75}/>
    )
}