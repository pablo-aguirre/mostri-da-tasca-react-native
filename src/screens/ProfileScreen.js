import React, {useEffect, useState} from "react";
import ProfileViewModel from "../viewmodels/ProfileViewModel";
import * as ImagePicker from "expo-image-picker";
import {
    ActivityIndicator,
    Appbar,
    Avatar,
    Button,
    Dialog,
    Divider,
    IconButton,
    List,
    Portal,
    Switch,
    Text,
    TextInput
} from "react-native-paper";
import {ScrollView} from "react-native";
import {globalStyles} from "../../styles/global";


// TODO salvataggio in locale delle informazioni (attualmente usa il server per salvarle e aggiornarle)
// TODO artefatti

export default function ProfileScreen({session}) {
    const [viewModel] = useState(new ProfileViewModel(session))
    const [user, setUser] = useState(null)
    const [editName, setEditName] = useState(false)

    useEffect(() => {
        viewModel.getUser()
            .then(result => setUser(result))
            .catch(error => console.error(`[ProfileScreen] ${error}`))
        console.log(`[ProfileScreen] user = ${JSON.stringify(user)}`)
    }, []);

    const updateImage = async () => {
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0
        });
        if (!image.canceled)
            viewModel.updateUser({...user, picture: image.assets[0].base64})
                .then(() => setUser({...user, picture: image.assets[0].base64}))
                .catch(error => console.error(`[ProfileScreen] ${error}`))
    };

    return (
        <>
            <Appbar.Header mode='small' elevated>
                <Appbar.Content title="Profile"/>
            </Appbar.Header>
            {!user ? <ActivityIndicator size='large'/> :
                <ScrollView style={globalStyles.screen}>
                    {editName && <EditName visible={editName} setVisible={setEditName} user={user} setUser={setUser}
                                           vm={viewModel}/>}
                    <Text variant='headlineMedium' style={{alignSelf: 'center'}}>{user.name}</Text>

                    {user.picture ?
                        <Avatar.Image size={150} style={{alignSelf: 'center'}}
                                      source={{uri: `data:image/jpg;base64,${user.picture}`}}/> :
                        <Avatar.Text size={150} style={{alignSelf: 'center'}} label={user.name.charAt(0)}/>
                    }
                    <IconButton size={15} icon='camera' selected style={{alignSelf: 'center'}}
                                onPress={() => updateImage()}/>
                    <List.Item
                        title='Name'
                        left={() => <List.Icon icon='card-account-details'/>}
                        right={() => <IconButton icon='account-edit' mode={'contained'}
                                                 onPress={() => setEditName(true)}/>}
                    />
                    <List.Item
                        title={user.positionshare ? 'Position shared' : 'Position not shared'}
                        left={() => <List.Icon icon={user.positionshare ? 'map-marker' : 'map-marker-off'}/>}
                        right={() => <Switch value={user.positionshare} onValueChange={(value) => {
                            viewModel.updateUser({...user, positionshare: value})
                                .then(() => setUser({...user, positionshare: value}))
                                .catch(error => console.error(`[ProfileScreen] ${error}`))
                        }}/>}
                    />
                    <Divider/>
                    <List.Item
                        title='Life points'
                        left={() => <List.Icon icon={'heart'}/>}
                        right={() => <List.Subheader>{user.life}</List.Subheader>}
                    />
                    <List.Item
                        title='Experience'
                        left={() => <List.Icon icon={'chart-bar'}/>}
                        right={() => <List.Subheader>{user.experience}</List.Subheader>}
                    />
                    <Divider/>
                </ScrollView>
            }
        </>
    )
}

function EditName({visible, setVisible, user, setUser, vm}) {
    const [newName, setNewName] = useState('')

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                <Dialog.Title>Edit name</Dialog.Title>
                <Dialog.Content>
                    <TextInput left={<TextInput.Icon icon='account-details'/>} label={user.name} placeholder="New name"
                               onChangeText={(input) => setNewName(input)}/>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setVisible(false)}>Cancel</Button>
                    <Button onPress={() => {
                        if (user.name !== newName && newName !== undefined) {
                            vm.updateUser({...user, name: newName})
                                .then(() => setUser({...user, name: newName}))
                                .catch(error => console.error(`[ProfileScreen] ${error}`))
                            setVisible(false)
                        }
                    }} disabled={newName.trim() === '' || newName.length >= 15}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}