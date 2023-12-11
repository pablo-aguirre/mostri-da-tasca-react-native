import {Avatar, Card, Icon, ListItem, Switch} from "@rneui/themed";
import {ActivityIndicator, FlatList, ScrollView, View} from "react-native";
import React, {useEffect, useState} from "react";
import ProfileViewModel from "../viewmodels/ProfileViewModel";
import {COLORS, globalStyles} from "../../styles/global";
import * as ImagePicker from "expo-image-picker";


/** TODO immagine del profilo
 *  - sistemare caricamento annullato (aperta Picker e premuto cancel)
 *  - controlli sull'immagine troppo grande
 */

/** TODO artefatti
 *  - aggiungere uno header, se presenti artefatti
 */
export default function ProfileScreen({session}) {
    const [viewModel] = useState(new ProfileViewModel(session))
    const [user, setUser] = useState()
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        viewModel.getUser().then(result => setUser(result)).catch(error => console.error(`[ProfileScreen] ${error}`))
        console.log(`[ProfileScreen] user = ${JSON.stringify(user)}`)
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0
        });

        if (!result.canceled)
            return result.base64
        else
            return ''
    };


    return (
        <ScrollView style={{paddingHorizontal: 5}}>
            {user === undefined ? <ActivityIndicator size="large"/> :
                <View>
                    <Card containerStyle={globalStyles.cardWithoutBorder}>
                        <Card.Title h4>
                            {user.name}
                            <Icon name={editing ? 'done' : 'edit'}
                                  color={COLORS.blue}
                                  style={{marginLeft: 5}}
                                  onPress={() => {
                                      console.log(`[ProfileScreen] user = ${JSON.stringify(user)}`)
                                      if (editing) viewModel.updateUser(user)
                                      setEditing(!editing)
                                  }}
                            />
                        </Card.Title>
                        <Avatar
                            rounded
                            containerStyle={globalStyles.avatar}
                            size="xlarge"
                            title={user.name.charAt(0)}
                            source={{uri: `data:image/jpg;base64,${user.picture}`}}>

                            {editing &&
                                <Avatar.Accessory color={COLORS.blue} reverse size={18}
                                                  onPress={() =>
                                                      pickImage().then(result => setUser({...user, picture: result}))}
                                />
                            }
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
                                   title={user.positionshare ? "Shared position" : "Not shared"}
                                   bottomDivider>
                        <Switch
                            disabled={!editing}
                            value={user.positionshare}
                            onChange={() => setUser({...user, positionshare: !user.positionshare})}
                        />
                    </GenericDetail>
                    <GenericDetail icon='favorite' title='Life points' value={user.life}/>
                    <GenericDetail icon='bar-chart' title='Experience' value={user.experience}/>
                    <ListArtifacts user={user} viewModel={viewModel}/>
                </View>
            }
        </ScrollView>
    )
}

function GenericDetail({icon, title, value, children, bottomDivider}) {
    return (
        <ListItem bottomDivider={bottomDivider}>
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

function ListArtifacts({user, viewModel}) {
    const [artifacts, setArtifacts] = useState([])
    const [icons] = useState({weapon: 'hardware', armor: 'security', amulet: 'science'})

    useEffect(() => {
        viewModel.getArtifacts(user).then(result => {
            setArtifacts(result)
            console.log(`[ListArtifacts] ${JSON.stringify(artifacts)}`)
        }).catch(error => console.error(`[ListArtifacts] ${error}`))
    }, []);

    return (
        <FlatList horizontal data={artifacts} keyExtractor={(item) => item.id} renderItem={({item}) =>
            <Card>
                <Card.Title>{item.name}</Card.Title>
                <Card.Divider/>
                <Avatar
                    rounded
                    containerStyle={globalStyles.avatar}
                    size="medium"
                    icon={{name: icons[item.type], type: 'material'}}
                    source={{uri: `data:image/jpg;base64,${item.image}`}}
                />
                <GenericDetail title='Type' value={item.type}/>
                <GenericDetail title='Level' value={item.level}/>
            </Card>
        }/>
    )
}