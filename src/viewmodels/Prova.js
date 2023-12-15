import {SafeAreaView} from "react-native";
import {useEffect, useState} from "react";
import StorageManager from "../models/StorageManager";
import {Button, TextInput} from "react-native-paper";

export function Prova() {
    const [db, setDB] = useState(StorageManager.prototype)
    const [user, setUser] = useState()

    useEffect(() => {
        setDB(new StorageManager())
    }, []);

    return (
        <SafeAreaView style={{alignItems: 'center', padding: 10}}>
            <TextInput label='uid' onChangeText={(input) => setUser({...user, uid: parseInt(input)})}/>
            <TextInput label='profileversion'
                       onChangeText={(input) => setUser({...user, profileversion: parseInt(input)})}/>
            <TextInput label='name' onChangeText={(input) => setUser({...user, name: input})}/>
            <TextInput label='picture' onChangeText={(input) => setUser({...user, picture: input})}/>
            <Button onPress={() => db.insertUser(user)}>
                insertUser
            </Button>
            <Button onPress={() => db.selectAllUsers()}>
                selectAllUsers
            </Button>
            <Button onPress={() => db.updateUserName(user.uid, user.profileversion, user.name)}>
                updateUserName
            </Button>
            <Button onPress={() => db.updateUserPicture(user.uid, user.profileversion, user.pictcure)}>
                updateUserPicture
            </Button>
            <Button onPress={() => db.selectUserFrom(user.uid)}>
                updateUserFromUid
            </Button>
        </SafeAreaView>
    )
}