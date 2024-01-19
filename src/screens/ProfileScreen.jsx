import React, {createContext, useContext, useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {
    ActivityIndicator,
    Appbar,
    Button,
    Card,
    DefaultTheme,
    Dialog,
    Divider,
    IconButton,
    List,
    Portal,
    Switch,
    Text,
    TextInput
} from "react-native-paper";
import {FlatList, ScrollView} from "react-native";
import {SessionID} from "../Contexts";
import {ObjectAvatar, UserAvatar} from "../components/MyAvatar";
import {getArtifacts, getUser, updateUser} from "../viewmodels/ProfileViewModel";

const ProfileContext = createContext()

export default function ProfileScreen() {
    const sid = useContext(SessionID)

    const [user, setUser] = useState(null)
    const [editNameVisible, setEditNameVisible] = useState(false)

    useEffect(() => {
        getUser(sid)
            .then(setUser)
            .catch(() => alert("Connection error."))
    }, [])

    const updateImage = async () => {
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0,
            allowsEditing: true,
        })
        if (!image.canceled) {
            updateUser(sid, {...user, picture: image.assets[0].base64})
                .then(() => setUser({...user, picture: image.assets[0].base64}))
                .catch(() => alert('Error while updating image'))
        }
    }

    return (
        <ProfileContext.Provider value={{user, setUser, editNameVisible, setEditNameVisible}}>
            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Profile"/>
                <Appbar.Action icon='refresh'
                               onPress={() => getUser(sid).then(setUser).catch(() => alert("Connection error."))}/>
            </Appbar.Header>
            {!user ? <ActivityIndicator size='large' style={{flex: 1}}/> :
                <ScrollView>
                    <Text variant='headlineMedium' style={{alignSelf: 'center'}}>{user.name}</Text>
                    <UserAvatar user={user} large/>
                    <IconButton
                        size={15}
                        icon='image-edit'
                        style={{alignSelf: 'center'}}
                        onPress={() => updateImage()}/>
                    <List.Item
                        style={{paddingHorizontal: 10}}
                        title='Name'
                        left={() => <List.Icon icon='card-account-details' color={DefaultTheme.colors.primary}/>}
                        right={() =>
                            <IconButton
                                icon='account-edit'
                                mode={'contained'}
                                onPress={() => setEditNameVisible(true)}
                            />
                        }
                    />
                    <List.Item
                        style={{paddingHorizontal: 10}}
                        title={user.positionshare ? 'Position shared' : 'Position not shared'}
                        left={() => <List.Icon icon={user.positionshare ? 'map-marker' : 'map-marker-off'}
                                               color={DefaultTheme.colors.primary}/>}
                        right={() =>
                            <Switch value={user.positionshare}
                                    onValueChange={(value) => updateUser(sid, {...user, positionshare: value})
                                        .then(() => setUser({...user, positionshare: value}))
                                        .catch(() => alert('Error while updating position share'))
                                    }
                            />
                        }
                    />
                    <Divider/>
                    <List.Item
                        style={{paddingHorizontal: 10}}
                        title='Life points'
                        left={() => <List.Icon icon={'heart'} color={DefaultTheme.colors.primary}/>}
                        right={() => <List.Subheader>{user.life}</List.Subheader>}
                    />
                    <List.Item
                        style={{paddingHorizontal: 10}}
                        title='Experience'
                        left={() => <List.Icon icon={'chart-bar'} color={DefaultTheme.colors.primary}/>}
                        right={() => <List.Subheader>{user.experience}</List.Subheader>}
                    />
                    <Divider/>
                    <MyArtifacts/>
                    <EditName/>
                </ScrollView>
            }

        </ProfileContext.Provider>
    )
}

function MyArtifacts() {
    const {user} = useContext(ProfileContext)

    const [artifacts, setArtifacts] = useState([])

    useEffect(() => {
        getArtifacts(user).then(setArtifacts)
    }, [user]);

    return (
        <FlatList style={{padding: 5}} horizontal showsVerticalScrollIndicator={false} data={artifacts}
                  renderItem={({item}) => {
                      return (
                          <Card>
                              <Card.Title title={item.name}/>
                              <Card.Content>
                                  <ObjectAvatar object={item} large/>
                                  <List.Item
                                      title={'type'}
                                      left={() => <List.Icon icon='alphabetical-variant'
                                                             color={DefaultTheme.colors.primary}/>}
                                      right={() => <Text>{item.type}</Text>}
                                  />
                                  <List.Item
                                      title={'level'}
                                      left={() => <List.Icon icon='arm-flex' color={DefaultTheme.colors.primary}/>}
                                      right={() => <Text>{item.level}</Text>}
                                  />
                              </Card.Content>
                          </Card>
                      )
                  }
                  }/>
    )
}

function EditName() {
    const sid = useContext(SessionID)
    const {user, setUser, editNameVisible, setEditNameVisible} = useContext(ProfileContext)
    const [newName, setNewName] = useState('')

    function isValid(name) {
        return name !== undefined && name.length < 15 && name.trim() !== '' && name !== user.name
    }

    return (
        <Portal>
            <Dialog visible={editNameVisible} onDismiss={() => setEditNameVisible(false)}>
                <Dialog.Title>Edit name</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        left={<TextInput.Icon icon='card-account-details'/>}
                        label={user.name}
                        onChangeText={(input) => setNewName(input)}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setEditNameVisible(false)}>Cancel</Button>
                    <Button
                        onPress={() => {
                            updateUser(sid, {...user, name: newName})
                                .then(() => setUser({...user, name: newName}))
                                .catch(() => alert('Error while updating name'))
                            setEditNameVisible(false)
                        }}
                        disabled={!isValid(newName)}>
                        Confirm
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}