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
                <View style={{paddingHorizontal: 10}}>
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
                            <Avatar.Accessory color={COLORS.blue} reverse name={editing ? 'check' : 'edit'}
                                              size={18}
                                              onPress={() => {
                                                  console.log(`[ProfileScreen] user = ${JSON.stringify(user)}`)
                                                  if (editing) viewModel.updateUser(user)
                                                  setEditing(!editing)
                                              }}
                            />
                        </Avatar>
                    </Card>
                    <GenericDetail icon='badge' title='Name'>
                        <ListItem.Input
                            disabled={!editing}
                            value={user.name}
                            onChangeText={(text) => setUser({...user, name: text})}
                        />
                        <ListItem.Chevron/>
                    </GenericDetail>
                    <GenericDetail icon={user.positionshare ? 'location-on' : 'location-off'}
                                   title={user.positionshare ? "Shared position" : "Not shared"}>
                        <Switch
                            disabled={!editing}
                            value={user.positionshare}
                            onChange={() => setUser({...user, positionshare: !user.positionshare})}
                        />
                    </GenericDetail>
                    <GenericDetail icon='favorite' title='Life points' value={user.life}/>
                    <GenericDetail icon='bar-chart' title='Experience' value={user.experience}/>
                </View>
            }
        </>
    )
}

function GenericDetail({icon, title, value, children}) {
    return (
        <ListItem>
            <Icon name={icon} color={COLORS.blue}/>
            <ListItem.Content>
                <ListItem.Title>{title}</ListItem.Title>
            </ListItem.Content>
            {
                children === undefined ?
                    <ListItem.Content right><ListItem.Title>{value}</ListItem.Title></ListItem.Content> : children
            }
        </ListItem>
    )
}