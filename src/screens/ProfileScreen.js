import React, {createContext, useContext, useEffect, useState} from "react";
import ProfileViewModel from "../viewmodels/ProfileViewModel";
import * as ImagePicker from "expo-image-picker";
import {Appbar, Button, Dialog, IconButton, List, Portal, Text, TextInput} from "react-native-paper";
import {ScrollView} from "react-native";
import {globalStyles} from "../../styles/global";
import {SessionID} from "../Contexts";
import {UserAvatar} from "../components/MyAvatar";

// TODO salvataggio in locale delle informazioni (attualmente usa il server per salvarle e aggiornarle)
// TODO artefatti

const ProfileContext = createContext()

export default function ProfileScreen() {
    const sid = useContext(SessionID)
    const viewModel = new ProfileViewModel(sid)

    const [user, setUser] = useState(null)
    const [editNameDialogVisible, setEditNameDialogVisible] = useState(false)

    const getUser = async () => {
        setUser(await viewModel.getUser())
    }

    useEffect(() => {
        getUser()
    }, [])

    const updateImage = async () => {
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0
        })
        if (!image.canceled) {
            await viewModel.updateUser({...user, picture: image.assets[0].base64})
            setUser({...user, picture: image.assets[0].base64})
        }
    }

    return (
        <ProfileContext.Provider value={{user, setUser, editNameDialogVisible, setEditNameDialogVisible}}>
            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Profile"/>
            </Appbar.Header>
            {user &&
                <ScrollView style={globalStyles.screen}>
                    <Text variant='headlineMedium' style={{alignSelf: 'center'}}>{user.name}</Text>
                    <UserAvatar user={user} large/>
                    <IconButton
                        size={15}
                        icon='camera'
                        style={{alignSelf: 'center'}}
                        onPress={() => updateImage()}/>
                    <List.Item
                        title='Name'
                        left={() => <List.Icon icon='card-account-details'/>}
                        right={() =>
                            <IconButton
                                icon='account-edit'
                                mode={'contained'}
                                onPress={() => setEditNameDialogVisible(true)}
                            />
                        }
                    />
                    {/*<List.Item*/}
                    {/*    title={user.positionshare ? 'Position shared' : 'Position not shared'}*/}
                    {/*    left={() => <List.Icon icon={user.positionshare ? 'map-marker' : 'map-marker-off'}/>}*/}
                    {/*    right={() => <Switch value={user.positionshare} onValueChange={(value) => {*/}
                    {/*        viewModel.updateUser({...user, positionshare: value})*/}
                    {/*            .then(() => setUser({...user, positionshare: value}))*/}
                    {/*            .catch(error => console.error(`[ProfileScreen] ${error}`))*/}
                    {/*    }}/>}*/}
                    {/*/>*/}
                    {/*<Divider/>*/}
                    {/*<List.Item*/}
                    {/*    title='Life points'*/}
                    {/*    left={() => <List.Icon icon={'heart'}/>}*/}
                    {/*    right={() => <List.Subheader>{user.life}</List.Subheader>}*/}
                    {/*/>*/}
                    {/*<List.Item*/}
                    {/*    title='Experience'*/}
                    {/*    left={() => <List.Icon icon={'chart-bar'}/>}*/}
                    {/*    right={() => <List.Subheader>{user.experience}</List.Subheader>}*/}
                    {/*/>*/}
                    {/*<Divider/>*/}
                </ScrollView>
            }
        </ProfileContext.Provider>
    )
}

function EditName() {
    const {user, setUser, editNameDialogVisible, setEditNameDialogVisible} = useContext(ProfileContext)
    const [newName, setNewName] = useState('')

    function isValid(name) {
        return name !== undefined && name.length < 15 && name.trim() !== '' && name !== user.name
    }

    return (
        <Portal>
            <Dialog visible={editNameDialogVisible} onDismiss={() => setEditNameDialogVisible(false)}>
                <Dialog.Title>Edit name</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        left={<TextInput.Icon icon='account-details'/>}
                        label={user.name}
                        placeholder="New name"
                        onChangeText={(input) => setNewName(input)}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setEditNameDialogVisible(false)}>Cancel</Button>
                    <Button
                        onPress={() => setUser({...user, name: newName})}
                        disabled={!isValid(newName)}>
                        Ok
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}