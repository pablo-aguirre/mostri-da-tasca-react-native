import React, {createContext, useContext, useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {
    Appbar,
    Button,
    Card,
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

// TODO rendere dati del profilo non dipendenti dal server (salvarli nello storage locale)

export default function ProfileScreen() {
    const sid = useContext(SessionID)

    const [user, setUser] = useState(null)
    const [editNameVisible, setEditNameVisible] = useState(false)

    useEffect(() => {
        getUser(sid).then(setUser)
    }, [])

    useEffect(() => {
        if (user) updateUser(sid, user)
    }, [user])

    const updateImage = async () => {
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0
        })
        if (!image.canceled)
            setUser({...user, picture: image.assets[0].base64})
    }

    return (
        <ProfileContext.Provider value={{user, setUser, editNameVisible, setEditNameVisible}}>
            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Profile"/>
                <Appbar.Action icon='refresh' onPress={() => getUser(sid).then(setUser)}/>
            </Appbar.Header>
            {user &&
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
                        left={() => <List.Icon icon='card-account-details'/>}
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
                        left={() => <List.Icon icon={user.positionshare ? 'map-marker' : 'map-marker-off'}/>}
                        right={() => <Switch value={user.positionshare}
                                             onValueChange={(value) => setUser({...user, positionshare: value})}/>}
                    />
                    <Divider/>
                    <List.Item
                        style={{paddingHorizontal: 10}}
                        title='Life points'
                        left={() => <List.Icon icon={'heart'}/>}
                        right={() => <List.Subheader>{user.life}</List.Subheader>}
                    />
                    <List.Item
                        style={{paddingHorizontal: 10}}
                        title='Experience'
                        left={() => <List.Icon icon={'chart-bar'}/>}
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
    }, []);


    return (
        <FlatList horizontal showsVerticalScrollIndicator={false} data={artifacts} renderItem={({item}) => {
            return (
                <Card>
                    <Card.Title title={item.name}/>
                    <Card.Content>
                        <ObjectAvatar object={item} large/>
                        <List.Item
                            title={'type'}
                            right={() => <Text>{item.type}</Text>}
                        />
                        <List.Item
                            title={'level'}
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
                            setUser({...user, name: newName})
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