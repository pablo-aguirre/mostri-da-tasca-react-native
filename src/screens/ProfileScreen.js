import {Avatar, Card, Icon, ListItem, Switch} from "@rneui/themed";
import {ActivityIndicator, View} from "react-native";
import React, {useEffect, useState} from "react";
import ProfileViewModel from "../viewmodels/ProfileViewModel";
import {COLORS, globalStyles} from "../../styles/global";

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

    return (
        <>
            {user === undefined ? <ActivityIndicator size="large"/> :
                <>
                    <Card containerStyle={{borderWidth: 0, shadowColor: 'transparent'}}>
                        <Card.Title h4>
                            {user.name}
                        </Card.Title>
                        <Avatar
                            rounded
                            containerStyle={globalStyles.avatar}
                            size="xlarge"
                            title={user.name.charAt(0)}
                            source={{uri: `data:image/jpg;base64,${user.picture}`}}>
                            <Avatar.Accessory color={COLORS.blue} reverse name={editing ? 'check' : 'edit'} size={18}
                                              onPress={() => {
                                                  console.log(`[ProfileScreen] user = ${JSON.stringify(user)}`)
                                                  if (editing) viewModel.updateUser(user)
                                                  setEditing(!editing)
                                              }}
                            />
                        </Avatar>
                    </Card>
                    <View style={{paddingHorizontal: 10}}>
                        <ListItem>
                            <Icon name='badge' color={COLORS.blue}/>
                            <ListItem.Content>
                                <ListItem.Title>Name</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Input
                                disabled={!editing}
                                value={user.name}
                                onChangeText={(text) => setUser({...user, name: text})}
                            />
                            <ListItem.Chevron/>
                        </ListItem>
                        <ListItem>
                            <Icon name={user.positionshare ? 'location-on' : 'location-off'} color={COLORS.blue}/>
                            <ListItem.Content>
                                <ListItem.Title>{user.positionshare ? "Shared position" : "Not shared"}</ListItem.Title>
                            </ListItem.Content>
                            <Switch
                                disabled={!editing}
                                value={user.positionshare}
                                onChange={() => setUser({...user, positionshare: !user.positionshare})}
                            />
                        </ListItem>
                        <ListItem>
                            <Icon name='favorite' color={COLORS.blue}/>
                            <ListItem.Content>
                                <ListItem.Title>Life points</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Content right>
                                <ListItem.Title>{user.life}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem>
                            <Icon name='bar-chart' color={COLORS.blue}/>
                            <ListItem.Content>
                                <ListItem.Title>Experience</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Content right>
                                <ListItem.Title>{user.experience}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    </View>
                </>
            }
        </>)
}