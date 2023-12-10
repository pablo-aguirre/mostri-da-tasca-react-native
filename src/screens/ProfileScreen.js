import {Avatar, Button, Icon, ListItem, Switch, Text} from "@rneui/themed";
import {ActivityIndicator, View} from "react-native";
import React, {useEffect, useState} from "react";
import ProfileViewModel from "../viewmodels/ProfileViewModel";


/** TODO
 *  - immagine del profilo (modificabile)
 *  - nome utente (modificabile)
 *  - posizione condivisa (booleano modificabile)
 *  - punti vita
 *  - punti esperienza
 *  - artefatti
 */
export default function ProfileScreen({session}) {
    const [viewModel] = useState(new ProfileViewModel(session))
    const [user, setUser] = useState()
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        viewModel.getUser().then(result => setUser(result))
        console.log(`[ProfileScreen] user = ${JSON.stringify(user)}`)
    }, []);

    const toggleEdit = () => {
        setEditing(!editing)
    }

    return (
        <>
            {
                user === undefined ? <ActivityIndicator size="large"/> :
                    <ListItem bottomDivider>
                        <Avatar rounded
                                size="large"
                                title={user.name.charAt(0)}
                                source={{uri: `data:image/jpg;base64,${user.picture}`}}
                        >
                            {editing ? <Avatar.Accessory size={23} onPress={() => console.log('Avatar.Accessory')}/>:''}
                        </Avatar>

                        <ListItem.Content>
                            <ListItem.Input
                                disabled={!editing}
                                value={user.name}
                                inputStyle={{textAlign: 'left', fontSize: 25}}
                                onChangeText={(text) => setUser({...user, name:text})}
                            />
                            <View style={{flexDirection: 'row', paddingLeft: 10, paddingTop: 5}}>
                                <Icon
                                    type="material"
                                    name={user.positionshare ? "location-on" : "location-off"}
                                    size={25}
                                    style={{padding: 5}}
                                />
                                <Text style={{fontSize: 20, padding: 5}}>
                                    Position
                                </Text>
                                {
                                    editing ? <Switch value={user.positionshare} onChange={() => setUser({...user, positionshare: !user.positionshare})}/> : ''
                                }
                            </View>
                        </ListItem.Content>
                        <ListItem.Content right>
                            <Button onPress={() => {
                                console.log(`[ProfileScreen] user = ${JSON.stringify(user)}`)
                                if (editing)
                                    viewModel.updateUser(user)
                                setEditing(!editing)
                            }}>
                                <Icon type="material" name={editing ? 'save' : 'edit'} color="white" />
                            </Button>
                        </ListItem.Content>
                    </ListItem>
            }
        </>
    )
}